#
# Build
#
ARG NODE_VERSION=20.12.2-bullseye
FROM node:${NODE_VERSION} as build
ENV PUPPETEER_SKIP_DOWNLOAD=True

# npm packages
RUN apt-get update \
    && apt-get install -y openssh-client
RUN apt install openssh-client
RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

WORKDIR /src
COPY package.json .
COPY yarn.lock .
RUN yarn set version 3.6.3
RUN --mount=type=ssh yarn install

# App
WORKDIR /src
ADD . /src
RUN --mount=type=ssh yarn install
RUN yarn build && find ./dist -name "*.d.ts" -delete

#
# Final
#
FROM node:${NODE_VERSION} as release
ENV PUPPETEER_SKIP_DOWNLOAD=True
# Quick fix for memory potential memory leaks
# https://github.com/devlikeapro/waha/issues/347
ENV NODE_OPTIONS="--max-old-space-size=16384"
ARG USE_BROWSER=chromium

RUN echo "USE_BROWSER=$USE_BROWSER"

# Install ffmpeg to generate previews for videos
RUN apt-get update && apt-get install -y ffmpeg --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Install fonts if using either chromium or chrome
RUN if [ "$USE_BROWSER" = "chromium" ] || [ "$USE_BROWSER" = "chrome" ]; then \
    apt-get update  \
    && apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
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
ARG CHROME_VERSION="122.0.6261.128-1"
RUN if [ "$USE_BROWSER" = "chrome" ]; then \
        wget --no-verbose -O /tmp/chrome.deb https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}_amd64.deb \
          && apt-get update \
          && apt install -y /tmp/chrome.deb \
          && rm /tmp/chrome.deb \
          && rm -rf /var/lib/apt/lists/*; \
    fi

# Attach sources, install packages
WORKDIR /app
COPY package.json ./
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/dist ./dist

# Chokidar options to monitor file changes
ENV CHOKIDAR_USEPOLLING=1
ENV CHOKIDAR_INTERVAL=5000

# Run command, etc
EXPOSE 3000
CMD yarn start:prod
