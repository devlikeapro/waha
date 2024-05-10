---
title : "💬 Chats"
description: "Chats"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 127
---

Chats methods.

Parameters in path that you can find in below endpoints:
- `{session}` - use the session name for Whatsapp instance that you created with `POST /api/session/start` endpoint
- `{chatId}` - chat id in format `123123123123@[c.us|g.us]`, `c.us` for direct chats and `g.us` for groups.

## Endpoints
See the list of engines [**that support the feature ->**]({{< relref "/docs/how-to/engines#features" >}}).

### Get all chats
Get all chats
`GET /api/{session}/chats`

### Get messages from chat
Get 100 messages from the chat

`GET /api/{session}/chats/{chatId}/messages?limit=100`


Get 100 messages from the chat, skip downloading media (images, files)

`GET /api/{session}/chats/{chatId}/messages?limit=100&downloadMedia=false`

### Delete chat
Use the method to delete chat

`DELETE /api/{session}/chats/{chatId}`

### Clear messages
Use the method to clear all messages from the chat

`DELETE /api/{session}/chats/{chatId}/messages`
