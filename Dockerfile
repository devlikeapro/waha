#
# Build
#
FROM node:18 as build

# npm packages
WORKDIR /src
COPY package.json .
COPY package-lock.json .
RUN npm install

# App
WORKDIR /src
ADD . /src
RUN npm run build && find ./dist -name "*.d.ts" -delete

#
# Final
#
FROM node:18 as release

# Install Chrome
RUN apt-get update  \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Attach sources, install packages
WORKDIR /app
COPY package.json ./
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/dist ./dist

# Run command, etc
EXPOSE 3000
CMD npm run start:prod
