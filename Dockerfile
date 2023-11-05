#
# Build
#
FROM node:20-bullseye as build
ENV PUPPETEER_SKIP_DOWNLOAD=True

# npm packages
WORKDIR /src
COPY package.json .
COPY yarn.lock .
RUN yarn set version 3.6.3
RUN yarn install

# App
WORKDIR /src
ADD . /src
RUN yarn install
RUN yarn build && find ./dist -name "*.d.ts" -delete

#
# Final
#
FROM node:20-bullseye as release
ENV PUPPETEER_SKIP_DOWNLOAD=True
ARG USE_BROWSER=chromium

RUN echo "USE_BROWSER=$USE_BROWSER"

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
RUN if [ "$USE_BROWSER" = "chrome" ]; then \
        apt-get update  \
        && apt-get install -y wget gnupg \
        && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
        && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
        && apt-get update \
        && apt-get install -y google-chrome-stable \
          --no-install-recommends \
        && rm -rf /var/lib/apt/lists/*; \
    fi

# Attach sources, install packages
WORKDIR /app
COPY package.json ./
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/dist ./dist

# Run command, etc
EXPOSE 3000
CMD yarn start:prod
