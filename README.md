# WhatsApp HTTP API Free
WhatsApp HTTP API that you can configure in a click!

# Quickstart
Install and run
```bash
docker pull ...
```

## Send a text message
```bash
# Phone without +
export PHONE=79776772457
curl -d "{\"chatId\": \"${PHONE}@c.us\", \"text\": \"Hello from WhatsApp HTTP API Free\" }" -H "Content-Type: application/json" -X POST http://localhost:3000/api/sendText

```

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
- `WHATSAPP_FILES_FOLDER` - folder where will be stored files from chats (images, voice messages) (default: `/tmp/whatsapp-files`)
- `WHATSAPP_FILES_MIMETYPES` - download only these mimetypes from messages. Mimetypes must be separated by comma, without spaces: `audio,image/png,image/gif`. In order to choose type use prefix (like `audio,image`). Disabled by default, `message.clientUrl` will be equal emtpy string `""`.
- `WHATSAPP_FILES_LIFETIME`- to keep free space files will be removed after this time (default: `180`, in seconds)

# Development
Use node 10 version:
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
