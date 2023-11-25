---
title : "Receive messages"
description: "Receive messages"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 120
---
We consider that you've run docker container and authenticated the session with QR code.

If you haven't yet - please follow the steps from [**Quick Start →**]({{< relref "/docs/overview/quick-start" >}}).

You must use [Webhooks]({{< relref "/docs/how-to/webhooks" >}}) to receive messages from WhatsApp to your application.

Start a new session with configured `message` event in webhooks - call `POST /api/sessions/start` with the payload:
```json
{
  "name": "default",
  "config": {
    "webhooks": [
      {
        "url": "https://httpbin.org/post",
        "events": [
          "message"
        ]
      }
    ]
  }
}
```

After that WAHA'll send events (see below) about new messages to an endpoint you provided.


## Webhooks
See the list of engines [**that support the feature ->**]({{< relref "/docs/how-to/engines#features" >}}).

Here's examples of message-related events.
Read [Webhooks ->]({{< relref "/docs/how-to/webhooks" >}}) to find how to set them up.

### message

Incoming message (text/audio/files)

```json
{
  "event": "message",
  "session": "default",
  "payload": {
    "id": "true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "timestamp": 1667561485,
    "from": "11111111111@c.us",
    "fromMe": true,
    "to": "11111111111@c.us",
    "body": "Hi there!",
    "hasMedia": false,
    "ack": 1,
    "vCards": [],
    "_data": {
      "id": {
        "fromMe": true,
        "remote": "11111111111@c.us",
        "id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "_serialized": "true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
      },
      "body": "Hi there!",
      "type": "chat",
      "t": 1667561485,
      "notifyName": "MyName",
      "from": "11111111111@c.us",
      "to": "11111111111@c.us",
      "self": "in",
      "ack": 1,
      "isNewMsg": true,
      "star": false,
      "kicNotified": false,
      "recvFresh": true,
      "isFromTemplate": false,
      "pollInvalidated": false,
      "latestEditMsgKey": null,
      "latestEditSenderTimestampMs": null,
      "broadcast": false,
      "mentionedJidList": [],
      "isVcardOverMmsDocument": false,
      "isForwarded": false,
      "hasReaction": false,
      "ephemeralOutOfSync": false,
      "productHeaderImageRejected": false,
      "lastPlaybackProgress": 0,
      "isDynamicReplyButtonsMsg": false,
      "isMdHistoryMsg": false,
      "stickerSentTs": 0,
      "isAvatar": false,
      "requiresDirectConnection": false,
      "pttForwardedFeaturesEnabled": true,
      "isEphemeral": false,
      "isStatusV3": false,
      "links": []
    }
  }
}
```

### message.any

Fired on all message creations, including your own. The payload is the same as for [message](#message) event.

```json
{
  "event": "message.any",
  "session": "default",
  "payload": {}
}
```

### message.ack
Receive events when server or recipient gets the message, read or played it.

[See details on Webhooks page ->]({{< relref "webhooks#messageack" >}}).

```json
{
  "event": "message.ack",
  "session": "default",
  "payload": {}
}
```

### message.revoked

[See details on Webhooks page ->]({{< relref "webhooks#messageack" >}}).

```json
{
  "event": "message.ack",
  "session": "default",
  "payload": {
    "before": {
      "id": "some-id-here",
      "timestamp": "some-timestamp-here",
      "body": "Hi there!"
    },
    "after": {
      "id": "some-id-here",
      "timestamp": "some-timestamp-here",
      "body": ""
    }
  }
}
```


## Files ![](/images/versions/plus.png)

When people send you media - images, voice messages, and documents - WAHA saves it in the file storage.
In your application you must download it and use it as you want to. You can find the URL in `media.url` field.

For example, you can get the webhook like this with `media` value (we've skipped other fields):

```json
{
  "event": "message",
  "session": "default",
  "payload": {
    "id": "true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "timestamp": 1667561485,
    "from": "11111111111@c.us",
    "hasMedia": true,
    "media": {
      "url": "http://localhost:3000/api/files/true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.jpg",
      "mimetype": "image/jpeg",
      "filename": null
    }
  }
}
```
Then you can use the link to download the file `http://localhost:3000/api/files/true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.jpg`.

For documents (file attachments) there's also `filename` field with the original file name.
```json
{
  "event": "message",
  "session": "default",
  "payload": {
    "id": "true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "timestamp": 1667561485,
    "from": "11111111111@c.us",
    "media": {
      "url": "http://localhost:3000/api/files/true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.pdf",
      "filename": "some-file.pdf",
      "mimetype": "application/pdf"
    }
  }
}
```

To configure the url you can use environment variables `WHATSAPP_API_HOSTNAME` and `WHATSAPP_API_PORT`.

By default, WAHA download all files that the account receive.
If you want to limit files lifetime, specify file types for download or change directory for files -
[read more about file storage configuration and variables ->]({{< relref "config" >}}).

## Endpoints
See the list of engines [**that support the feature ->**]({{< relref "/docs/how-to/engines#features" >}}).

### Get messages
Read messages from the history - use `GET /api/messages` endpoint.

You also can get messages for chats by using
[**Get messages from chat ->**]({{< relref "/docs/how-to/chats" >}}) endpoint.

{{< alert icon="👉" text="We do not recommend using this method in production, consider using webhooks instead!" />}}

```bash
curl -X 'GET' \
  'http://localhost:3000/api/messages?chatId=11111111111%40c.us&limit=1000&session=default' \
  -H 'accept: application/json'
```

## Examples
Here's few examples of how to receive messages in different languages:
1. [Python guide ->]({{< relref "/docs/examples/python" >}})

**Do you use another language?**

Please create a short guide how to handle webhook and send message after you finish your setup!
You can create a pull request with your favorite language in the
[GitHub, in examples folder ->](https://github.com/devlikeapro/whatsapp-http-api/tree/core/examples).

