---
title: "Changelog"
description: "WAHA's changelog"
lead: "You can find here the list of changes made to WAHA."
date: 2020-10-06T08:49:31+00:00
lastmod: 2020-10-06T08:49:31+00:00
draft: false
images: [ ]
menu:
  docs:
    parent: "help"
weight: 199
toc: true
---

If you wish to get and read Release Notes - read them on one of our platforms, **these posts are FREE**.
- [**Boosty ->**](https://boosty.to/wa-http-api)
- [**Patreon ->**](patreon.com/wa_http_api)

You even can **subscribe to get new updates** there!

## 2023.12
December 2023
- Add `chatId` field to `GET /api/contacts/check-exists` to help get the right `chatId` for Brazilian numbers.
Read more about
  [error sending text to half of Brazilian numbers (every number registered before 2012) ->](https://github.com/devlikeapro/whatsapp-http-api/issues/238)

## 2023.11
November 2023
- Add different formats for QR code:
  1. **binary image** - `GET /api/{session}/auth/qr`
  2. **base64 image** - `GET /api/{session}/auth/qr` and set `Accept: application/json` header
  3. **raw** - `GET /api/{session}/auth/qr?format=raw`
- Add different formats for the screenshot:
  1. **binary image** - `GET /api/{session}/screenshot`
  2. **base64 image** - `GET /api/{session}/screenshot` and set `Accept: application/json` header
- Add `WHATSAPP_SWAGGER_ENABLED=false` so you can hide Swagger documentation (available only in Plus version). [#185](https://github.com/devlikeapro/whatsapp-http-api/issues/185)
- Add dedicated `media` field in webhook payload - now you can know which media is attached to the message.
```json
{
  "event": "message",
  "session": "default",
  "payload": {
    "hasMedia": true,
    "media": {
      "url": "http://localhost:3000/api/files/true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.pdf",
      "mimetype": "application/pdf",
      "filename": "file.pdf"
    }
  }
}

```
- Add `WHATSAPP_DOWNLOAD_MEDIA` environment variable to control media download. Available only in Plus version.
  - `WHATSAPP_DOWNLOAD_MEDIA=True` - download media
  - `WHATSAPP_DOWNLOAD_MEDIA=False` - do not download media at all.
- Add `filename` field for document (file attachments) - the original filename of the document.
- Add `/api/sendVideo` endpoint to **NOWEB** and **WEBJS** engines. Available only in Plus version.
- Add security settings for edit group info `GET /api/{session}/groups/{groupId}/settings/security/info-admin-only` - updates the group settings to only allow admins to edit group info (title, description, photo).

## 2023.10
October 2023
- Add `session.status` event for all engines! Now you can get the latest session's status immediately after it changes.
- Add `message.revoked` event in **WEBJS** engine
- Add `me` field in webhook payload - now you can know which number is associated with the session
- Add `enviroment` field in webhook payload - now you can know which environment is used for the session

## 2023.9
September 2023
- Add `GET /api/sessions/{session/me` endpoint so you [can get the phone number associated with the session](https://waha.devlike.pro/docs/how-to/sessions/#get-me)
- Add [polls support in NOWEB engine](https://waha.devlike.pro/docs/how-to/polls)
- Add dedicated [Get QR](https://waha.devlike.pro/docs/how-to/sessions/#get-qr) endpoint!
- Support [pairing method (NOWEB)](https://waha.devlike.pro/docs/how-to/sessions/#get-pairing-code) - you can connect with a code instead of QR.
- Add string field `ackName: DEVICE|READ|...` in [message.ack payload](https://waha.devlike.pro/docs/how-to/webhooks/#messageack)
- Support `message.ack` event webhook in **NOWEB** engine

## 2023.8
August 2023
- Added [stories (aka status) endpoints](https://waha.devlike.pro/docs/how-to/send-messages/#send-status-aka-stories) to **NOWEB** engine!
  - `POST /api/{session}/status/text|image|voice|video` - choose one that suites your!
- Added [chats endpoints](https://waha.devlike.pro/docs/how-to/chats)
  - Get all chats - `GET /api/{session/chats`
  - Delete chat - `DELETE /api/{session/chats/{chatId}`
  - Get messages from chat - `GET /api/{session/chats/{chatId}/messages?limit=1000?downloadMedia=true`
  - Clear messages in the chat `DELETE /api/{session/chats/{chatId}/messages`
- Added `downloadMedia` flag to speed up `GET /api/messages` and `GET /api/{session/chats/{chatId}/messages` performance.
- Added [set presence endpoint](https://waha.devlike.pro/docs/how-to/presence)!
  - With `online` presence you can show your status as online [#121](https://github.com/devlikeapro/whatsapp-http-api/issues/121)
  - With `offline` presence you can get notifications for your device [#28](https://github.com/devlikeapro/whatsapp-http-api/issues/28)
- Added security settings for edit group info `PUT /api/{session}/groups/{groupId}/settings/security/info-admin-only` - updates the group settings to only allow admins to edit group info (title, description, photo).

## 2023.7
July 2023
- Now session can have their own [Webhooks](https://waha.devlike.pro/docs/how-to/webhooks) -
   you can define webhook configuration when you start a session with `POST /api/session/start`!
  - Add HMAC authentication for webhooks
  - Configure retries
  - Add you custom headers
- Added [proxy configuration](https://waha.devlike.pro/docs/how-to/config/#proxy) with supporting proxy authentication.
  Thanks **puntolino** for the contribution!
  You can control proxy's settings per session with `POST /api/session/start` or globally with environment variables.
- Added [presence information](https://waha.devlike.pro/docs/how-to/presence) - now you can get online status for
  a contact by calling endpoints or receiving a webhook event!
- Now you can mention contact in groups by settings `mentions` field in `POST /api/sendText`
  [read more about it in Send Messages ->]({{< relref "/docs/how-to/send-messages" >}})

## 2023.6
June 2023

Improvements on session management, restarting sessions and more:

- Added `WHATSAPP_RESTART_ALL_SESSIONS=True`: Set this variable to `True` to start all **STOPPED** sessions after
  container restarts. By default, this variable is set to `False`.
  - Please note that this will start all **STOPPED** sessions, not just the sessions that were working before the
    restart. You can maintain the session list by
    using `POST /api/session/stop` with the `logout: True` parameter or by calling `POST /api/session/logout` to remove
    **STOPPED** sessions. You can see all sessions, including **STOPPED** sessions, in the `GET /api/sessions/all=True`
    response.
- `WHATSAPP_START_SESSION` now support more than one session! Separate session names by command, and it'll start them
  ALWAYS after container restart `WHATSAPP_START_SESSION=session1,session2`
- `WHATSAPP_SWAGGER_CONFIG_ADVANCED=true` enables advanced configuration options for Swagger documentation - you can customize host, port and base URL for the requests.
  Disabled by default.
- Added `?all=true` parameter to `GET /api/session?all=True` endpoint - it'll show you ALL session, included **STOPPED
  **, so you can know which one will be restarted if you set `WHATSAPP_RESTART_ALL_SESSIONS=True` environment variable.
- Added `POST /api/sessions/logout` that allow you to logout from session - remove saved credentials.
- Added `logout` boolean parameter to `POST /api/sessions/stop` request that allow you to stop the session AND logout at
  the same time.
- Added [How to deploy page ->]({{< relref "/docs/how-to/deploy" >}}) with
  [docker-compose.yaml](https://github.com/devlikeapro/whatsapp-http-api/blob/core/docker-compose.yaml) example
- Added `engine` field in webhook payload

```json
{
  "event": "message",
  "session": "default",
  "engine": "WEBJS",
  "payload": {}
}
```

## 2023.5
May 2023

- Added new [NOWEB engine]({{< relref "/docs/how-to/engines" >}}). **NOWEB** engine does not require a browser to work
  with
  WhatsApp Web, it does so directly using a WebSocket.
  - Less CPU and RAM usage!
  - Send Locations API works!
  - Send Link Preview API works!
  - ⚠ Read the article before using it [How to avoid blocking ->]({{< relref "/docs/overview/how-to-avoid-blocking" >}}).

## 2023.4
March 2023

- Add [Groups API]({{< relref "/docs/how-to/groups" >}})
- Use Chromium by default instead of Chrome

## 2023.1
January 2023

- Added  [Contacts API]({{< relref "/docs/how-to/contacts" >}})
  - Get all contacts
  - Get a contact
  - Get contact "about" (status)
  - Get contact profile picture
  - Check number exists (is registered in WhatsApp) - works even if the number is not in the contact list
  - Block and unblock contact

## 2022.12
December 2023

- Added `GET /messages/` endpoint to get chat messages [#31](https://github.com/devlikeapro/whatsapp-http-api/issues/31)
- Added `WHATSAPP_SWAGGER_USERNAME` and `WHATSAPP_SWAGGER_PASSWORD` to hide and protect swagger panel.

## 2022.11

**Please test changes in test environment before update production!!**

**Engine** ![](/images/versions/core.png)

1. WAHA has changed its underlying engine from Venom to Whatsapp Web.JS. It might change the response and webhook's
   payloads.
2. Optimize CPU and memory consumption.

**Requests** ![](/images/versions/core.png)

- For all `/api/session/` requests use `name` field instead of `sessionName`.
- For all "chatting" requests use `session` field instead of `sessionName`.

**Sessions** ![](/images/versions/plus.png)

Now you don't have to scan QR code each time you run WAHA, WAHA saves it for you! Available only in Plus version.

**Authentication** ![](/images/versions/plus.png)

Now you can authenticate all requests for WAHA - use `WHATSAPP_API_KEY=secret` environment variable to set "secret key".

If `WHATSAPP_API_KEY` is set - requests must have `X-Api-Key` header with `secret` value, where `secret` - any random
secret key.

**Webhooks** ![](/images/versions/core.png)

Instead of setting each webhook via environment variables - we use two environments variables:

- `WHATSAPP_HOOK_URL` - to set a URL
- `WHATSAPP_HOOK_EVENTS` - to set events that are sent to the URL

| Previous                                                                                                             | Current                                                                                            |
|----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| <pre>WHATSAPP_HOOK_ONMESSAGE=https://httpbin.org/post <br>WHATSAPP_HOOK_ONANYMESSAGE=https://httpbin.org/post </pre> | <pre>WHATSAPP_HOOK_URL=https://httpbin.org/post <br>WHATSAPP_HOOK_EVENTS=message,message.any</pre> |

** Webhook payload**

The data for webhooks are wrapped inside a new `WAWebhook` object with `event` and `payload` fields to help you identify
which handler you should call based on `event`.

```json
{
  "event": "message.any",
  "payload": {
  }
}
```
