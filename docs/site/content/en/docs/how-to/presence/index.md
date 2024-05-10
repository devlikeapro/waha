---
title: "✅ Presence"
description: "Presence"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: [ ]
weight: 801
---

You can get presence information (online, offline with last seen, typing status) for a contact if they share their
presence information.

Possible presence statuses that you can set or get for chats:
- `online`
- `offline`
- `typing`
- `recording`
- `paused` resets the chat presence after you were `typing`


## Endpoints
See the list of engines [**that support the feature ->**]({{< relref "/docs/how-to/engines#features" >}}).

### Set presence
You can set your global or chat-related presence with `POST /api/{session}/presence` endpoint

Start typing to a chat (you can use `POST /startTyping` instead)
```
POST /api/{session}/presence
{
  "chatId": "111111111@c.us",
  "presence": "typing"
}
```

Clear "typing" state (you can use `POST /stopTyping` instead)
```
POST /api/{session}/presence
{
  "chatId": "111111111@c.us",
  "presence": "paused"
}
```

Set global "online", all contacts will see it
```
POST /api/{session}/presence
{
  "presence": "online"
}
```

💡 In the multi-device version of WhatsApp - if a desktop client is active, WhatsApp doesn't send push notifications
to the device.
If you would like to receive said notifications - you need to mark a session's presence as `offline`.

```
POST /api/{session}/presence
{
  "presence": "offline"
}
```

### Get all chats presence

Here's few notes about fields:

- `chatId` - either contact id (`213213213@c.us`) or group chat id (`1111111111111@g.us`).
- `lastSeen` - contains Unix timestamps indicating when a participant was last online
- `lastKnownPresence` - contains the last known presence status, which can be
  `offline`, `online`, `typing`, `recording`, or `paused`


You can get all presence information available for a session by calling `GET /api/{session}/presence/`.
It returns both groups' and personal chats' presence information.

```json
[
  {
    "id": "2132132130@c.us",
    "presences": [
      {
        "participant": "2132132130@c.us",
        "lastKnownPresence": "offline",
        "lastSeen": 1686719326
      }
    ]
  },
  {
    "id": "11111111111111111111111@g.us",
    "presences": [
      {
        "participant": "11111111111111111111111@g.us",
        "lastKnownPresence": "online",
        "lastSeen": null
      },
      {
        "participant": "2132132130@c.us",
        "lastKnownPresence": "offline",
        "lastSeen": 1686719326
      }
    ]
  }
]
```

### Get chat presence

To get presence information for a single chat - call `GET /api/{session}/presence/{chatId}`.
For a group, you'll get participants' statuses.

```json
{
  "id": "2132132130@c.us",
  "presences": [
    {
      "participant": "2132132130@c.us",
      "lastKnownPresence": "online",
      "lastSeen": null
    }
  ]
}
```

### Subscribe to presence

You can subscribe to presence information by calling `POST /api/{session}/presence/{chatId}/subscribe` request
(no body required).
You can get later presence information for the chat with above `GET` endpoints or by listening to `presence.update`
webhook.

## Webhooks
See the list of engines [**that support the feature ->**]({{< relref "/docs/how-to/engines#features" >}}).

### presence.update

You can subscribe to `presence.update` webhook event to get the most recent presence information.

```json
{
    "event": "presence.update",
    "session": "default",
    "payload": {
        "id": "111111111111111111@g.us",
        "presences": [
            {
                "participant": "11111111111@c.us",
                "lastKnownPresence": "typing",
                "lastSeen": null
            }
        ]
    },
    "engine": "NOWEB"
}
```
