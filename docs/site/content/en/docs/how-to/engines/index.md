---
title : "Engines"
description: "Engines"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 700
---
Under the hood **WAHA** allows you to use two different engines. You can control what you want to run by settings
`WHATSAPP_DEFAULT_ENGINE` environment variables.

If you have any problems with one engine - try another!

{{< alert icon="👉" text="API responses and webhook payloads may differ significantly! We do our best to keep requests body stable between engines." />}}

## WhatsApp WebJS ![](/images/versions/core.png)
**WAHA** uses **WhatsApp WebJS** engine by default

- https://github.com/pedroslopez/whatsapp-web.js
- `WHATSAPP_DEFAULT_ENGINE=WEBJS`

## Venom ![](/images/versions/core.png)
- https://github.com/orkestral/venom
- `WHATSAPP_DEFAULT_ENGINE=VENOM`

