---
title: "Presence"
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

{{< alert icon="👉" text="Presence endpoints and webhook is available only in **NOWEB** engine." />}}
[Read more about engines to choose right for you ->]({{< relref "/docs/how-to/engines" >}})

Here's few notes about fields:

- `chatId` - either contact id (`213213213@c.us`) or group chat id (`1111111111111@g.us`).
- `lastSeen` - contains Unix timestamps indicating when a participant was last online
- `lastKnownPresence` - contains the last known presence status, which can be
  `offline`, `online`, `typing`, `recording`, or `paused`

## Endpoints

### Get all presence

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

## Webhook

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
