ARG NODE_IMAGE_TAG=24.11-bookworm-slim
ARG GOLANG_IMAGE_TAG=1.24-bookworm

#
# Build
#
FROM node:${NODE_IMAGE_TAG} AS build
ENV PUPPETEER_SKIP_DOWNLOAD=True

# git + build toolchain for git deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends git python3 build-essential curl ca-certificates unzip && \
    rm -rf /var/lib/apt/lists/*

# npm packages
WORKDIR /git
COPY package.json .
COPY yarn.lock .
ENV YARN_CHECKSUM_BEHAVIOR=update

RUN npm install -g corepack && corepack enable
RUN yarn set version 4.9.2
RUN yarn install

# App
WORKDIR /git
ADD . /git
RUN yarn install
RUN yarn build && find ./dist -name "*.d.ts" -delete

# Rebuild sharp from source on x86-64 so it runs on pre-v2 CPUs (no SSE4.2 requirement).
# The prebuilt @img/sharp-linux-x64 binary requires x86-64-v2; -march=x86-64 limits
# code generation to baseline x86-64 (SSE2 only). ARM64 prebuilts have no such
# constraint, so no rebuild is needed there.
# We call sharp's own install/build.js (not npm rebuild) so it first generates config.gypi
# with include/lib paths pointing to its bundled @img/sharp-libvips-linux-x64 package,
# then invokes node-gyp with those paths. Without this step node-gyp cannot find vips headers.
RUN if [ "$(uname -m)" = "x86_64" ]; then \
        LIBVIPS_DEV_VER=$(node -e "require('/git/node_modules/sharp/package.json').devDependencies['@img/sharp-libvips-dev']" | tr -d '^') && \
        npm install --prefix /tmp/sharp-dev --no-package-lock "@img/sharp-libvips-dev@${LIBVIPS_DEV_VER}" && \
        cp -r /tmp/sharp-dev/node_modules/@img/sharp-libvips-dev /git/node_modules/@img/ && \
        cd /git/node_modules/sharp && \
        PATH="/git/node_modules/.bin:$PATH" CFLAGS="-march=x86-64" CXXFLAGS="-march=x86-64" node install/build.js; \
    fi

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
# GOWS
#
FROM golang:${GOLANG_IMAGE_TAG} AS gows

# jq to parse json
RUN apt-get update && apt-get install -y jq && rm -rf /var/lib/apt/lists/*

# install protoc
RUN apt-get update && \
    apt-get install protobuf-compiler -y

# Image processing for thumbnails
RUN apt-get update  \
    && apt-get install -y libvips-dev \
    && rm -rf /var/lib/apt/lists/*

COPY waha.config.json /tmp/waha.config.json
WORKDIR /go/gows
RUN \
    GOWS_GITHUB_REPO=$(jq -r '.waha.gows.repo' /tmp/waha.config.json) && \
    GOWS_SHA=$(jq -r '.waha.gows.ref' /tmp/waha.config.json) && \
    ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then ARCH="amd64"; \
    elif [ "$ARCH" = "aarch64" ]; then ARCH="arm64"; \
    else echo "Unsupported architecture: $ARCH" && exit 1; fi && \
    mkdir -p /go/gows/bin && \
    wget -O /go/gows/bin/gows https://github.com/${GOWS_GITHUB_REPO}/releases/download/${GOWS_SHA}/gows-${ARCH} && \
    chmod +x /go/gows/bin/gows


#
# Final
#
FROM node:${NODE_IMAGE_TAG} AS release
ENV PUPPETEER_SKIP_DOWNLOAD=True
# Quick fix for memory potential memory leaks
# https://github.com/devlikeapro/waha/issues/347
ENV NODE_OPTIONS="--max-old-space-size=16384"
ARG USE_BROWSER=chromium
ARG WHATSAPP_DEFAULT_ENGINE

RUN echo "USE_BROWSER=$USE_BROWSER"

# Install ffmpeg to generate previews for videos
RUN apt-get update && apt-get install -y ffmpeg --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Image processing for thumbnails
RUN apt-get update  \
    && apt-get install -y libvips \
    && rm -rf /var/lib/apt/lists/*

# Install zip and unzip - either for chromium or chrome
RUN if [ "$USE_BROWSER" = "chromium" ] || [ "$USE_BROWSER" = "chrome" ]; then \
    apt-get update  \
    && apt-get install -y zip unzip \
    && rm -rf /var/lib/apt/lists/*; \
    fi

# Install wget - either for chromium or chrome
RUN if [ "$USE_BROWSER" = "chromium" ] || [ "$USE_BROWSER" = "chrome" ]; then \
    apt-get update  \
    && apt-get install -y wget \
    && rm -rf /var/lib/apt/lists/*; \
    fi

# Install fonts if using either chromium or chrome
RUN if [ "$USE_BROWSER" = "chromium" ] || [ "$USE_BROWSER" = "chrome" ]; then \
    apt-get update  \
    && apt-get install -y \
        fontconfig \
        fonts-freefont-ttf \
        fonts-gfs-neohellenic \
        fonts-indic \
        fonts-ipafont-gothic \
        fonts-kacst \
        fonts-liberation \
        fonts-noto-cjk \
        fonts-noto-color-emoji \
        fonts-roboto \
        fonts-thai-tlwg \
        fonts-wqy-zenhei \
        fonts-open-sans \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*; \
    fi

# Install xvfb, xauth
RUN if [ "$USE_BROWSER" = "chromium" ] || [ "$USE_BROWSER" = "chrome" ]; then \
    apt-get update && apt-get install -y --no-install-recommends \
        xvfb \
        xauth \
        libnss3 \
        libxss1 \
        libasound2 \
        libatk-bridge2.0-0 \
        libgtk-3-0 \
        libdrm2 \
        ca-certificates \
        && rm -rf /var/lib/apt/lists/*; \
    fi

# Install Chromium
RUN if [ "$USE_BROWSER" = "chromium" ]; then \
        apt-get update  \
        && apt-get update \
        && apt-get install -y chromium \
          --no-install-recommends \
        && rm -rf /var/lib/apt/lists/*; \
    fi

# Install Chrome
# Available versions:
# https://www.ubuntuupdates.org/package/google_chrome/stable/main/base/google-chrome-stable
ARG CHROME_VERSION="140.0.7339.207-1"
ARG OPUSTAGS_VERSION="1.10.1"
RUN if [ "$USE_BROWSER" = "chrome" ]; then \
        wget --no-verbose -O /tmp/chrome.deb https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}_amd64.deb \
          && apt-get update \
          && apt install -y /tmp/chrome.deb \
          && rm /tmp/chrome.deb \
          && rm -rf /var/lib/apt/lists/*; \
    fi

# curl
RUN apt-get update  \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

# Build and install opustags so audio metadata can be cleaned up inside the container
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

# GOWS requirements
# libc6
RUN  apt-get update \
     && apt-get install -y libc6 \
     && rm -rf /var/lib/apt/lists/*

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
COPY --from=gows /go/gows/bin/gows /app/gows
COPY .env.example ./.env.example
COPY scripts/init-waha.js ./scripts/init-waha.js
RUN chmod +x ./scripts/init-waha.js \
  && printf '%s\n' '#!/bin/sh' 'exec node /app/scripts/init-waha.js "$@"' > /usr/local/bin/init-waha \
  && chmod +x /usr/local/bin/init-waha
ENV WAHA_GOWS_PATH=/app/gows
ENV WAHA_GOWS_SOCKET=/tmp/gows.sock

COPY entrypoint.sh /entrypoint.sh

# Chokidar options to monitor file changes
ENV CHOKIDAR_USEPOLLING=1
ENV CHOKIDAR_INTERVAL=5000

# WAHA variables
ENV WAHA_ZIPPER=ZIPUNZIP

# GOWS - use libc DNS resolver
ENV GODEBUG=netdns=cgo

# Run command, etc
EXPOSE 3000
# Use tini as init system to handle zombie processes properly
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["/entrypoint.sh"]
