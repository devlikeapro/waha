---
title : "Contacts"
description: "Contacts"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 130
---

Methods for contacts.

{{< alert icon="👉" text="WhatsApp Web does not support adding contacts, so the API doesn't support it too." />}}

## Get all contacts

Get your contacts - `GET /api/contacts/all`

```json
[
  {
    "id": "11231231231@c.us",
    "number": "11231231231",
    "name": "Contact Name",
    "pushname": "Pushname",
    "shortName": "Shortname",
    "isMe": true,
    "isGroup": false,
    "isWAContact": true,
    "isMyContact": true,
    "isBlocked": false
  }
]
```

## Get contact

Get contact

- `GET /api/contacts?contactId=11231231231&session=default`
- `GET /api/contacts?contactId=11231231231@c.us&session=default`

```json
{
  "id": "11231231231@c.us",
  "number": "11231231231",
  "name": "Contact Name",
  "pushname": "Pushname",
  "shortName": "Shortname",
  "isMe": true,
  "isGroup": false,
  "isWAContact": true,
  "isMyContact": true,
  "isBlocked": false
}
```

## Check phone number exists

If you want to check if phone number is registered in WhatsApp (even if the number is not in your contact list) - use
this endpoint for that.
- `GET /api/contacts/check-exists?phone=11231231231&session=default`

```json
{
  "numberExists": true
}
```

## Get "about" contact

- `GET /api/contacts/about?contactId=11231231231&session=default`

```json
{
  "about": "Hi, I use WhatsApp!"
}
```

## Get contact profile picture

- `GET /api/contacts/profile-picture?contactId=11231231231&session=default`

```json
{
  "profilePictureURL": "https://example.com/profile.jpg"
}
```

## Block (unblock) contact
- To block contact - `POST /api/contacts/block`
- To unblock contact - `POST /api/contacts/unblock`

Request:
```json
{
  "contactId": "11231231231",
  "session": "default"
}
```
