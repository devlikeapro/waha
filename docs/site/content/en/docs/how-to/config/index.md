---
title : "Configuration"
description: "Configuration"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 800
---
You can configure WhatsApp HTTP API behaviour via environment variables, by adding `-e WHATSAPP_VARNAME=value` at the
begging of the command line or by using [other options](https://docs.docker.com/engine/reference/commandline/run/)

```bash
docker run -it -e "WHATSAPP_HOOK_EVENTS=*" -e WHATSAPP_HOOK_URL=https://httpbin.org/post devlikeapro/whatsapp-http-api
```

## Environment variables

- `DEBUG=1` - show debug and verbose logs, set in any value
- `WHATSAPP_API_PORT=3000` - listen port for HTTP server (default: `3000`)
- `WHATSAPP_API_HOSTNAME=localhost` - Hostname for HTTP server (default: `localhost`)
- `WHATSAPP_API_KEY=mysecret` - protect the api with a secret code. If you set it - add `X-Api-Key: mysecret` to all
  requests.
- `WHATSAPP_SWAGGER_USERNAME=admin` + `WHATSAPP_SWAGGER_PASSWORD=admin` - protect the Swagger panel with `admin / admin`
  credentials. It doesn't affect api access!
- `WHATSAPP_START_SESSION=default` - start session with the name right after launching the app

## File storage ![](/images/versions/plus.png)

- `WHATSAPP_FILES_MIMETYPES` - download only these mimetypes from messages (download all files be default). Mimetypes
  must be separated by a comma, without spaces: `audio,image/png,image/gif`. In order to choose type use prefix (
  like `audio,image`).
- `WHATSAPP_FILES_LIFETIME`- to keep free space files will be removed after this time (default: `180`, in seconds)
- `WHATSAPP_FILES_FOLDER` - folder where will be stored files from chats (images, voice messages) (
  default: `/tmp/whatsapp-files`)

## Engines

Under the hood **WAHA** allows you to use two different engines. You can control what you want to run by settings
`WHATSAPP_DEFAULT_ENGINE` environment variables.

If you have any problems with one engine - try another!

{{< alert icon="👉" text="API responses and webhook payloads may differ significantly! We do our best to keep requests body stable between engines." />}}

### WhatsApp WebJS ![](/images/versions/core.png)

**WAHA** uses **WhatsApp WebJS** engine by default

- https://github.com/pedroslopez/whatsapp-web.js
- `WHATSAPP_DEFAULT_ENGINE=WEBJS`

### Venom ![](/images/versions/core.png)

- https://github.com/orkestral/venom
- `WHATSAPP_DEFAULT_ENGINE=VENOM`

