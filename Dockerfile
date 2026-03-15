ARG NODE_IMAGE_TAG=24.11-bookworm-slim

#
# Build
#
FROM node:${NODE_IMAGE_TAG} AS build
ENV PUPPETEER_SKIP_DOWNLOAD=True

# git + build toolchain for git deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends git python3 build-essential curl ca-certificates unzip && \
    rm -rf /var/lib/apt/lists/*

# bun + rust toolchains for whatsapp-rust-bridge prepare scripts
RUN set -eux; \
    mkdir -p "${RUST_BUN_INSTALL}"; \
    curl -fsSL https://bun.sh/install | bash -s -- bun-v${RUST_BUN_VERSION}; \
    curl -fsSL https://sh.rustup.rs | bash -s -- -y --default-toolchain ${RUSTUP_TOOLCHAIN}; \
    /root/.cargo/bin/rustup target add wasm32-unknown-unknown; \
    /root/.cargo/bin/cargo install wasm-pack --vers ${RUST_WASM_PACK_VERSION} --locked; \
    "${RUST_BUN_INSTALL}/bin/bun" --version; \
    /root/.cargo/bin/cargo --version; \
    /root/.cargo/bin/rustc --version; \
    /root/.cargo/bin/wasm-pack --version

# App
WORKDIR /git
ADD . /git
ENV YARN_CHECKSUM_BEHAVIOR=update

RUN npm install -g corepack && corepack enable
RUN yarn set version 4.9.2
RUN yarn install
RUN yarn build && find ./dist -name "*.d.ts" -delete \
    && if [ ! -f ./dist/main.js ] && [ -f ./dist/src/main.js ]; then \
         echo "Fixing nested dist/src structure..." && \
         cp -a ./dist/src/* ./dist/ && \
         rm -rf ./dist/src; \
       fi \
    && test -f ./dist/main.js || (echo "ERROR: dist/main.js not found after build!" && find ./dist -name "main.js" && exit 1)

#
# Dashboard
#
FROM node:${NODE_IMAGE_TAG} AS dashboard

# jq to parse json
RUN apt-get update && apt-get install -y jq && rm -rf /var/lib/apt/lists/*

# wget, unzip
RUN apt-get update && apt-get install -y wget unzip && rm -rf /var/lib/apt/lists/*

COPY waha.config.json /tmp/waha.config.json
RUN \
    WAHA_DASHBOARD_GITHUB_REPO=$(jq -r '.waha.dashboard.repo' /tmp/waha.config.json) && \
    WAHA_DASHBOARD_SHA=$(jq -r '.waha.dashboard.ref' /tmp/waha.config.json) && \
    wget https://github.com/${WAHA_DASHBOARD_GITHUB_REPO}/archive/${WAHA_DASHBOARD_SHA}.zip \
    && unzip ${WAHA_DASHBOARD_SHA}.zip -d /tmp/dashboard \
    && mkdir -p /dashboard \
    && mv /tmp/dashboard/dashboard-${WAHA_DASHBOARD_SHA}/* /dashboard/ \
    && rm -rf ${WAHA_DASHBOARD_SHA}.zip \
    && rm -rf /tmp/dashboard/dashboard-${WAHA_DASHBOARD_SHA}




#
# Final
#
FROM node:${NODE_IMAGE_TAG} AS release
ENV PUPPETEER_SKIP_DOWNLOAD=True
# Quick fix for memory potential memory leaks
# https://github.com/devlikeapro/waha/issues/347
ENV NODE_OPTIONS="--max-old-space-size=16384"
ARG WHATSAPP_DEFAULT_ENGINE=NOWEB

RUN echo "WHATSAPP_DEFAULT_ENGINE=$WHATSAPP_DEFAULT_ENGINE"

# Install ffmpeg to generate previews for videos
RUN apt-get update && apt-get install -y ffmpeg --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Image processing for thumbnails
RUN apt-get update  \
    && apt-get install -y libvips \
    && rm -rf /var/lib/apt/lists/*


# curl
RUN apt-get update  \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

# Build and install opustags so audio metadata can be cleaned up inside the container
ARG OPUSTAGS_VERSION="1.10.1"
RUN set -eux; \
    buildDeps='build-essential cmake pkg-config libogg-dev'; \
    apt-get update; \
    apt-get install -y --no-install-recommends ${buildDeps}; \
    mkdir -p /tmp/opustags; \
    curl -L https://github.com/fmang/opustags/archive/refs/tags/${OPUSTAGS_VERSION}.tar.gz \
      | tar -xz -C /tmp/opustags; \
    cd /tmp/opustags/opustags-${OPUSTAGS_VERSION}; \
    cmake -S . -B build -DCMAKE_INSTALL_PREFIX=/usr/local -DCMAKE_BUILD_TYPE=Release; \
    cmake --build build --config Release; \
    cmake --install build; \
    rm -rf /tmp/opustags; \
    apt-get purge -y --auto-remove ${buildDeps}; \
    rm -rf /var/lib/apt/lists/*


# Install tini for proper init process
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

# Set the ENV for docker image
ENV WHATSAPP_DEFAULT_ENGINE=$WHATSAPP_DEFAULT_ENGINE

# Attach sources, install packages
WORKDIR /app
COPY package.json ./
COPY --from=build /git/node_modules ./node_modules
COPY --from=build /git/dist ./dist
COPY --from=dashboard /dashboard ./dist/dashboard
COPY .env.example ./.env.example
COPY scripts/init-waha.js ./scripts/init-waha.js
RUN chmod +x ./scripts/init-waha.js \
  && printf '%s\n' '#!/bin/sh' 'exec node /app/scripts/init-waha.js "$@"' > /usr/local/bin/init-waha \
  && chmod +x /usr/local/bin/init-waha

COPY entrypoint.sh /entrypoint.sh

# Chokidar options to monitor file changes
ENV CHOKIDAR_USEPOLLING=1
ENV CHOKIDAR_INTERVAL=5000

# WAHA variables
ENV WAHA_ZIPPER=ZIPUNZIP


# Run command, etc
EXPOSE 3000
# Use tini as init system to handle zombie processes properly
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["/entrypoint.sh"]
