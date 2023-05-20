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

The project uses [Webhooks](https://en.wikipedia.org/wiki/Webhook) to send the messages and events from WhatsApp to your
application.

Webhooks are a way for two different applications to communicate with each other in real-time.
When a certain event happens in one application, it sends a message to another application through a webhook URL.
The receiving application can then take action based on the information received.

To receive incoming messages with webhooks,
you first need to set up a webhook URL in your application and pass it to `WHATSAPP_HOOK_URL` environment variable.
This URL is where WhatsApp will send incoming messages and other events -
define which events you want to receive with `WHATSAPP_HOOK_EVENTS` environment variable.

## Webhooks ![](/images/versions/core.png)

You can configure where you want to receive events in environment variables:

- `WHATSAPP_HOOK_URL=https://httpbin.org/post`  - to set up a URL for the webhook
- `WHATSAPP_HOOK_EVENTS=message,message.any,state.change,group.join,group.leave` - specify events. DO NOT specify all of
  them, it's too heavy payload, choose the right for you.
  - `WHATSAPP_HOOK_EVENTS=*` - subscribe to all events. It's not recommended for production, but it's fine for
  development.

On the URL that you set via `WHATSAPP_HOOK_URL` you receive JSON-data with following format:

```json
{
  "event": "message",
  "session": "default",
  "payload": {}
}
```

Where `event` value helps you identify the incoming event with `payload` for that events.

Below the list of all events that WhatsApp HTTP API sends to your.

{{< alert icon="👉" text="If you want to look at a webhook body - use the url `https://httpbin.org/post`" />}}

Run the bellow command and see look at the logs - it prints body request for all events that happen in your WhatsApp!

```bash
docker run -it -e "WHATSAPP_HOOK_EVENTS=*" -e WHATSAPP_HOOK_URL=https://httpbin.org/post -p 3000:3000 devlikeapro/whatsapp-http-api
```

### Examples
Here's few examples of how to handle webhook in different languages:
1. [Python guide]({{< relref "/docs/examples/python" >}})

**Do you use another language?**

Please create a short guide how to handle webhook and send message after you finish your setup!
You can create a pull request with your favorite language in the [GitHub, in examples folder](https://github.com/devlikeapro/whatsapp-http-api/tree/core/examples).

Just put the code and **README.md** file in the folder - we'll do the rest!


## Events ![](/images/versions/core.png)

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

```json
{
  "event": "message.ack",
  "session": "default",
  "payload": {}
}
```

### state.change

```json
{
  "event": "state.change",
  "session": "default",
  "payload": {}
}
```

### group.join

```json
{
  "event": "group.join",
  "session": "default",
  "payload": {}
}
```

### group.leave

```json
{
  "event": "group.left",
  "session": "default",
  "payload": {}
}
```

## Files ![](/images/versions/plus.png)

When people send you files - images, voice messages, and documents - WAHA saves it in the file storage.
In your application you must download it and use it as you want to. You can find the URL in `mediaUrl` field

For example, you can get the webhook like this with `mediaUrl` value (we've skipped other fields):

```json
{
  "event": "message",
  "session": "default",
  "payload": {
    "id": "true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "timestamp": 1667561485,
    "from": "11111111111@c.us",
    "mediaUrl": "http://localhost:3000/api/files/true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.jpg"
  }
}
```
Then you can use the link to download the file `http://localhost:3000/api/files/true_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.jpg`.

To configure the url you can use environment variables `WHATSAPP_API_HOSTNAME` and `WHATSAPP_API_PORT`.

[Read more about file storage configuration and variables ->]({{< relref "config" >}}).

## Webhook retries ![](/images/versions/plus.png)

**WAHA** retries to reach your webhook URL 15 times and with 2 seconds delay between attempts.

## Get messages
You can read messages from the history by using `GET /api/messages` endpoint.

```bash
curl -X 'GET' \
  'http://localhost:3000/api/messages?chatId=11111111111%40c.us&limit=1000&session=default' \
  -H 'accept: application/json'
```
