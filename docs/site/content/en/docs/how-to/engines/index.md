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

## Docker images
WAHA provides few docker images with different setup.
{{< alert icon="👉" text="Use `devlikeapro/whatsapp-http-api` instead of `devlikeapro/whatsapp-http-api-plus` to get **WAHA Plus** version." />}}

For **x86** processors use following images:
- `devlikeapro/whatsapp-http-api:latest` - latest version of WAHA, using **Chromium** (does not support video receiving and receiving in Plus version)
- `devlikeapro/whatsapp-http-api:chrome` - latest version of WAHA, using **Chrome** (supports video receiving and receiving in Plus version)
- `devlikeapro/whatsapp-http-api:noweb`- latest version of WAHA, **no browser installed** - use it only for **NOWEB** engine

For **ARM** processors use following images:
- `devlikeapro/whatsapp-http-api:arm` - **Chromium**
- `devlikeapro/whatsapp-http-api:arm-noweb`- **no browser installed**

{{< alert icon="💡" text="Chrome version is not available in ARM" />}}

## Features

Some engines may not support certain features.
Here, you will find a list of supported endpoints and webhooks per engine.

|             Symbol             | Meaning                                                                                                                                                                                                                                                                                                                                                                                       |
|:------------------------------:|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|               ✔️               | The engines supports the feature.                                                                                                                                                                                                                                                                                                                                                             |
|               ➖                | The engine does **not** support this feature. <br/>Please search for the issue about the endpoint in [the project's issue](https://github.com/devlikeapro/whatsapp-http-api/issues) and upvote it by using the "👍" reaction on the issue's description. This will help us determine the level of interest in the feature. <br/>If you are unable to find the issue, please create a new one. |
| ![](/images/versions/plus.png) | The feature available in [WAHA Plus]({{< relref "/docs/how-to/plus-version" >}}).                                                                                                                                                                                                                                                                                                             |

If you don't specify `WHATSAPP_DEFAULT_ENGINE` environment variable - look at **WEBJS** engine,
it's the engine WAHA runs by default.

### Engine

|                                                              | WEBJS | NOWEB | VENOM |
|--------------------------------------------------------------|:-----:|:-----:|:-----:|
| Run a browser (chromium\chrome) to communicate with WhatsApp |  ✔️   |   ➖   |  ✔️   |
| Communicate with WhatsApp via websocket (no browser)         |   ➖   |  ✔️   |   ➖   |

### Endpoints

If you find any inconsistency with actual endpoints -
please [create an issue](https://github.com/devlikeapro/whatsapp-http-api/issues/new?title=Error+in+engine+features )

|                                           | WEBJS |                                   NOWEB                                   | VENOM |
|-------------------------------------------|:-----:|:-------------------------------------------------------------------------:|:-----:|
| **Session**                               |       |                                                                           |       |
| `POST /api/sessions/start`                |  ✔️   |                                    ✔️                                     |  ✔️   |
| `POST /api/sessions/stop`                 |  ✔️   |                                    ✔️                                     |  ✔️   |
| `POST /api/sessions/logout`               |  ✔️   |                                    ✔️                                     |  ✔️   |
| `GET /api/sessions/`                      |  ✔️   |                                    ✔️                                     |  ✔️   |
| `GET /api/sessions/{session}/me`          |  ✔️   |                                    ✔️                                     |   ➖   |
| **Authentication**                        |       |                                                                           |       |
| `POST /api/{session}/auth/qr`             |  ✔️   |                                    ✔️                                     |  ✔️   |
| `POST /api/{session}/auth/request-code`   |   ➖   |                                    ✔️                                     |   ➖   |
| `POST /api/{session}/auth/authorize-code` |   ➖   | ➖️<br>[#113](https://github.com/devlikeapro/whatsapp-http-api/issues/113) |   ➖   |
| **Screenshot**                            |       |                                                                           |       |
| `POST /api/screenshot`                    |  ✔️   |                                     ➖                                     |  ✔️   |

| **Chatting**                                         | WEBJS | NOWEB | VENOM |
|------------------------------------------------------|:-----:|:-----:|:-----:|
| `GET /api/checkNumberStatus`                         |  ✔️   |  ✔️   |  ✔️   |
| `GET /api/sendContactVcard`                          |   ➖   |   ➖   |  ✔️   |
| `GET /api/sendText`                                  |  ✔️   |  ✔️   |  ✔️   |
| `POST /api/sendText`                                 |  ✔️   |  ✔️   |  ✔️   |
| `POST /api/sendPoll`                                 |   ➖   |  ✔️   |   ➖   |
| `POST /api/sendLocation`                             |  ✔️   |  ✔️   |  ✔️   |
| `POST /api/sendLinkPreview`                          |   ➖   |  ✔️   |  ✔️   |
| `POST /api/sendImage` ![](/images/versions/plus.png) |  ✔️   |  ✔️   |  ✔️   |
| `POST /api/sendFile` ![](/images/versions/plus.png)  |  ✔️   |  ✔️   |  ✔️   |
| `POST /api/sendVoice` ![](/images/versions/plus.png) |  ✔️   |  ✔️   |  ✔️   |
| `POST /api/sendVideo` ![](/images/versions/plus.png) |  ✔️   |  ✔️   |   ➖   |
| `POST /api/reply`                                    |  ✔️   |  ✔️   |  ✔️   |
| `POST /api/sendSeen`                                 |  ✔️   |  ✔️   |  ✔️   |
| `POST /api/startTyping`                              |  ✔️   |  ✔️   |  ✔️   |
| `POST /api/stopTyping`                               |  ✔️   |  ✔️   |   ➖   |
| `POST /api/reaction`                                 |  ✔️   |  ✔️   |   ➖   |
| `GET /api/messages`                                  |  ✔️   |   ➖   |  ✔️   |

|                                                                   | WEBJS | NOWEB | VENOM |
|-------------------------------------------------------------------|:-----:|:-----:|:-----:|
| **Status**                                                        |       |       |       |
| `POST /api/{session}/status/text`                                 |   ➖   |  ✔️   |   ➖   |
| `POST /api/{session}/status/image` ![](/images/versions/plus.png) |   ➖   |  ✔️   |   ➖   |
| `POST /api/{session}/status/voice` ![](/images/versions/plus.png) |   ➖   |  ✔️   |   ➖   |
| `POST /api/{session}/status/video` ![](/images/versions/plus.png) |   ➖   |  ✔️   |   ➖   |
| **Chats**                                                         |       |       |       |
| `GET /api/{session}/chats`                                        |  ✔️   |   ➖   |   ➖   |
| `DELETE /api/{session}/chats/{chatId}`                            |  ✔️   |   ➖   |   ➖   |
| `GET /api/{session}/chats/{chatId}/messages`                      |  ✔️   |   ➖   |  ✔️   |
| `DELETE /api/{session}/chats/{chatId}/messages`                   |  ✔️   |   ➖   |   ➖   |
| **Contacts**                                                      |       |       |       |
| `GET /api/contacts`                                               |  ✔️   |   ➖   |   ➖   |
| `GET /api/contacts/all`                                           |  ✔️   |   ➖   |   ➖   |
| `GET /api/contacts/check-exists`                                  |  ✔️   |  ✔️   |  ✔️   |
| `GET /api/contacts/about`                                         |  ✔️   |   ➖   |   ➖   |
| `GET /api/contacts/profile-picture`                               |  ✔️   |   ➖   |   ➖   |
| `POST /api/contacts/block`                                        |  ✔️   |   ➖   |   ➖   |
| `POST /api/contacts/unblock`                                      |  ✔️   |   ➖   |   ➖   |

| **Groups**                                                         | WEBJS | NOWEB | VENOM |
|--------------------------------------------------------------------|:-----:|:-----:|:-----:|
| `POST /api/{session}/groups`                                       |  ✔️   |  ✔️   |   ➖   |
| `GET /api/{session}/groups`                                        |  ✔️   |  ✔️   |   ➖   |
| `GET /api/{session}/groups/{id}`                                   |  ✔️   |  ✔️   |   ➖   |
| `DELETE /api/{session}/groups/{id}`                                |  ✔️   |   ➖   |   ➖   |
| `GET /api/{session}/groups/{id}/settings/security/info-admin-only` |  ✔️   |   ➖   |   ➖   |
| `PUT /api/{session}/groups/{id}/settings/security/info-admin-only` |  ✔️   |   ➖   |   ➖   |
| `POST /api/{session}/groups/{id}/leave`                            |  ✔️   |  ✔️   |   ➖   |
| `PUT /api/{session}/groups/{id}/description`                       |  ✔️   |  ✔️   |   ➖   |
| `PUT /api/{session}/groups/{id}/subject`                           |  ✔️   |  ✔️   |   ➖   |
| `GET /api/{session}/groups/{id}/invite-code`                       |  ✔️   |  ✔️   |   ➖   |
| `POST /api/{session}/groups/{id}/invite-code/revoke`               |  ✔️   |  ✔️   |   ➖   |
| `GET /api/{session}/groups/{id}/participants`                      |  ✔️   |  ✔️   |   ➖   |
| `POST /api/{session}/groups/{id}/participants/add`                 |  ✔️   |  ✔️   |   ➖   |
| `POST /api/{session}/groups/{id}/participants/remove`              |  ✔️   |  ✔️   |   ➖   |
| `POST /api/{session}/groups/{id}/admin/promote`                    |  ✔️   |  ✔️   |   ➖   |
| `POST /api/{session}/groups/{id}/admin/demote`                     |  ✔️   |  ✔️   |   ➖   |

|                                                   | WEBJS | NOWEB | VENOM |
|---------------------------------------------------|:-----:|:-----:|:-----:|
| **Presence**                                      |       |       |       |
| `POST /api/{session}/presence`                    |   ➖   |  ✔️   |   ➖   |
| `GET /api/{session}/presence`                     |   ➖   |  ✔️   |   ➖   |
| `GET /api/{session}/presence/{chatId}`            |   ➖   |  ✔️   |   ➖   |
| `POST /api/{session}/presence/{chatId}/subscribe` |   ➖   |  ✔️   |   ➖   |
| **Other**                                         |       |       |       |
| `POST /api/version`                               |   ➖   |  ✔️   |   ➖   |

| **Webhooks**                                        | WEBJS | NOWEB | VENOM |
|-----------------------------------------------------|:-----:|:-----:|:-----:|
| `message`                                           |  ✔️   |  ✔️   |  ✔️   |
| `message` with files ![](/images/versions/plus.png) |  ✔️   |  ✔️   |  ✔️   |
| `message.any`                                       |  ✔️   |  ✔️   |  ✔️   |
| `message.ack`                                       |  ✔️   |  ✔️   |  ✔️   |
| `message.revoked`                                   |  ✔️   |   ➖   |   ➖   |
| `state.change`                                      |  ✔️   |  ✔️   |  ✔️   |
| `group.join`                                        |  ✔️   |  ✔️   |  ✔️   |
| `group.leave`                                       |  ✔️   |   ➖   |   ➖   |
| `presence.update`                                   |   ➖   |  ✔️   |   ➖   |
| `poll.vote`                                         |   ➖   |  ✔️   |   ➖   |
| `poll.vote.failed`                                  |   ➖   |  ✔️   |   ➖   |
