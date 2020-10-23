# WhatsApp HTTP API
WhatsApp HTTP API that you can configure in a click!

# Quickstart

# Environment variables
## Common
- `DEBUG` - show debug and verbose logs, set in any value
- `WHATSAPP_API_PORT` - listen port for HTTP server (default: `3000`)
- `WHATSAPP_API_HOSTNAME` - Hostname for HTTP server (default: `localhost`)
## Webhooks
https://github.com/orkestral/venom#events
All webhooks are disabled by default.

- `WHATSAPP_HOOK_ONMESSAGE=http://localhost/uri`
- `WHATSAPP_HOOK_ONSTATECHANGE=http://localhost/uri`
- `WHATSAPP_HOOK_ONACK=http://localhost/uri`
- `WHATSAPP_HOOK_ONADDEDTOGROUP=http://localhost/uri`
## File storage 
- `WHATSAPP_FILES_FOLDER` - folder where will be stored files from chats (images, voice messages)

# Installation
```bash
docker pull ...
```

# Development

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
