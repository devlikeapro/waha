---
title: "Engines"
description: "Engines"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: [ ]
weight: 800
---

## Engines

Under the hood **WAHA** allows you to use different engines. You can control what you want to run by settings
`WHATSAPP_DEFAULT_ENGINE` environment variables.

```bash
docker run -it -e "WHATSAPP_DEFAULT_ENGINE=WEBJS" devlikeapro/whatsapp-http-api
```

If you have any problems with one engine - try another!

{{< alert icon="👉" text="API responses and webhook payloads may differ significantly, test everything before changing the engine" />}}

All engines are available in both
Core ![](/images/versions/core.png) and
[Plus ![](/images/versions/plus.png) versions]({{< relref "/docs/how-to/plus-version" >}}).

### WEBJS

- `WHATSAPP_DEFAULT_ENGINE=WEBJS`
- [https://github.com/pedroslopez/whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)

A WhatsApp API client that connects through the WhatsApp Web browser app.
It uses Puppeteer to run a real instance of Whatsapp Web to avoid getting blocked.

**WAHA** uses **WhatsApp WebJS** engine by default.

### NOWEB

- `WHATSAPP_DEFAULT_ENGINE=NOWEB`
- [https://github.com/WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)

**NOWEB** engine **does not require a browser** to work with WhatsApp Web, it does so directly using a WebSocket.
Not running Chromium saves you CPU and Memory, so you can run more instances on a single server!

️Working with the engine requires more attention, because it's easy to be blocked with it!

⚠ Read the article before using **NOWEB** engine
[How to avoid blocking ->]({{< relref " /docs/overview/how-to-avoid-blocking" >}}).

### VENOM

- `WHATSAPP_DEFAULT_ENGINE=VENOM`
- [https://github.com/orkestral/venom](https://github.com/orkestral/venom)

It's a high-performance system developed with JavaScript to create a bot for WhatsApp.
It uses Puppeteer to run a real instance of Whatsapp Web to avoid getting blocked.
