# WhatsApp HTTP API Free

WhatsApp HTTP API that you can configure in a click! And it's Free! :)

|                                                            |     |
| ---------------------------------------------------------- | --- |
| Automatic QR Refresh                                       | ✔   |
| Send **text, image, video, audio and docs**                | ✔   |
| Get **contacts, chats, groups, group members, Block List** | ✔   |
| Send contacts                                              | ✔   |
| Send stickers                                              | ✔   |
| Send stickers GIF                                          | ✔   |
| Multiple Sessions                                          | ✔   |
| Forward Messages                                           | ✔   |
| Receive message                                            | ✔   |
| insert user section                                        | ✔   |
| 📍 Send location!!                                         | ✔   |
| 🕸🕸 **and much more**                                       | ✔   |

The project is an HTTP wrapper around https://github.com/orkestral/venom

# Installation

Only thing that you must have - installed docker. Please follow the original
instruction [how to install docker](https://docs.docker.com/get-docker/)

```bash
docker pull allburov/whatsapp-http-api
```

# First Steps

We are going to show how to use WhatsApp HTTP API.

TODO: Add GIF here

## Run and login

```bash
docker run -it -v `pwd`/tokens:/app/tokens -p 127.0.0.1:3000:3000/tcp allburov/whatsapp-http-api
```

If you are not logged in, it will print a QR code in the terminal. Scan it with your phone and you are ready to go!
We will remember the session so there is no need to authenticate everytime.
[How to log in - the instruction on WhatsApp site](https://faq.whatsapp.com/general/download-and-installation/how-to-log-in-or-out/?lang=en)

After that open in a browser the link and you'll see API swagger specification for you own WhatsApp HTTP API
http://localhost:3000/#/

## Get a screenshot

Go to the "screenshot" section and get a screenshot http://localhost:3000/#/screenshot

## Send a text message

Let's try to send a message:

```bash
# Phone without +
# Using GET
curl "http://localhost:3000/api/sendText?phone=79776772457&text=Hello+from+WhatsApp+HTTP+API+Free!"

# Using POST 
export PHONE=79776772457
curl -d "{\"chatId\": \"${PHONE}@c.us\", \"text\": \"Hello from WhatsApp HTTP API Free\" }" -H "Content-Type: application/json" -X POST http://localhost:3000/api/sendText
```

# Environment variables

## Common

- `DEBUG` - show debug and verbose logs, set in any value
- `WHATSAPP_API_PORT` - listen port for HTTP server (default: `3000`)
- `WHATSAPP_API_HOSTNAME` - Hostname for HTTP server (default: `localhost`)

## Webhooks

The description of [webhooks you can in Venom README.md, section Events](https://github.com/orkestral/venom#events)

All webhooks are disabled by default:

- `WHATSAPP_HOOK_ONMESSAGE=http://localhost/uri`
- `WHATSAPP_HOOK_ONSTATECHANGE=http://localhost/uri`
- `WHATSAPP_HOOK_ONACK=http://localhost/uri`
- `WHATSAPP_HOOK_ONADDEDTOGROUP=http://localhost/uri`

## File storage

- `WHATSAPP_FILES_FOLDER` - folder where will be stored files from chats (images, voice messages) (
  default: `/tmp/whatsapp-files`)
- `WHATSAPP_FILES_MIMETYPES` - download only these mimetypes from messages (download all files be default). Mimetypes
  must be separated by a comma, without spaces: `audio,image/png,image/gif`. In order to choose type use prefix (
  like `audio,image`).
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
