---
title: "Changelog"
description: "WAHA's changelog"
lead: "Changelog"
date: 2020-10-06T08:49:31+00:00
lastmod: 2020-10-06T08:49:31+00:00
draft: false
images: []
menu:
  docs:
    parent: "help"
weight: 600
toc: true
---
## 2021.3
- Add [Groups API]({{< relref "/docs/how-to/groups" >}})
- Use Chromium by default instead of Chrome

## 2021.1
- Added  [Contacts API]({{< relref "/docs/how-to/contacts" >}})
  - Get all contacts
  - Get a contact
  - Get contact "about" (status)
  - Get contact profile picture
  - Check number exists (is registered in WhatsApp) - works even if the number is not in the contact list
  - Block and unblock contact

## 2022.12
- Added `GET /messages/` endpoint to get chat messages [#31](https://github.com/devlikeapro/whatsapp-http-api/issues/31)

### Security ![](/images/versions/plus.png)
- Added `WHATSAPP_SWAGGER_USERNAME` and `WHATSAPP_SWAGGER_PASSWORD` to hide and protect swagger panel.

## 2022.11
**Please test changes in test environment before update production!!**

### Engine ![](/images/versions/core.png) ![](/images/versions/plus.png)
1. WAHA has changed its underlying engine from Venom to Whatsapp Web.JS. It might change the response and webhook's payloads.
2. Optimize CPU and memory consumption.


### Requests ![](/images/versions/core.png) ![](/images/versions/plus.png)
- For all `/api/session/` requests use `name` field instead of `sessionName`.
- For all "chatting" requests use `session` field instead of `sessionName`.

### Sessions ![](/images/versions/plus.png)
Now you don't have to scan QR code each time you run WAHA, WAHA saves it for you! Available only in Plus version.

### Authentication ![](/images/versions/plus.png)
Now you can authenticate all requests for WAHA - use `WHATSAPP_API_KEY=secret` environment variable to set "secret key".

If `WHATSAPP_API_KEY` is set - requests must have `X-Api-Key` header with `secret` value, where `secret` - any random secret key.

### Webhooks ![](/images/versions/core.png) ![](/images/versions/plus.png)
#### Configuration

Instead of setting each webhook via environment variables - we use two environments variables:

- `WHATSAPP_HOOK_URL` - to set a URL
- `WHATSAPP_HOOK_EVENTS` - to set events that are sent to the URL

| Previous                                                                                                             | Current                                                                                            |
|----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| <pre>WHATSAPP_HOOK_ONMESSAGE=https://httpbin.org/post <br>WHATSAPP_HOOK_ONANYMESSAGE=https://httpbin.org/post </pre> | <pre>WHATSAPP_HOOK_URL=https://httpbin.org/post <br>WHATSAPP_HOOK_EVENTS=message,message.any</pre> |

#### Payload

The data for webhooks are wrapped inside a new `WAWebhook` object with `event` and `payload` fields to help you identify
which handler you should call based on `event`.

```json
{
  "event": "message.any",
  "payload": {
  }
}
```
