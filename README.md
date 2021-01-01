# WhatsApp HTTP API Free
WhatsApp HTTP API that you can configure in a click! And it's Free! :)

# First Steps
We are going to show how to use WhatsApp HTTP API. Only thing that you must have - installed docker. Please follow the original instruction how to install it https://docs.docker.com/get-docker/)

Install and run
```bash
docker pull allburov/whatsapp-http-api
docker run -it -v `pwd`/tokens:/app/tokens -p 127.0.0.1:3000:3000/tcp allburov/whatsapp-http-api
```

A few seconds later you'll see QR code on you console. Do you see? Let's go to WhatsApp application on your mobile phone and scan this code! [Follow the instruction](https://faq.whatsapp.com/general/download-and-installation/how-to-log-in-or-out/?lang=en)

After that open in a browser the link and you'll see API swagger specification for you own WhatsApp HTTP API - http://localhost:3000/#/

TODO: Add GIF here

## Get a screenshot
Go to the "screenshot" section and get a screenshot http://localhost:3000/#/screenshot

TODO: Add GIF here

## Send a text message
Let's try to send a message:
```bash
# Phone without +
export PHONE=79776772457
curl -d "{\"chatId\": \"${PHONE}@c.us\", \"text\": \"Hello from WhatsApp HTTP API Free\" }" -H "Content-Type: application/json" -X POST http://localhost:3000/api/sendText
```

TODO: Add GIF here

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
