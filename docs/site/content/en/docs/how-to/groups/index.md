---
title : "Groups"
description: "Groups"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 140
---

## Endpoints
See the list of engines [**that support the feature ->**]({{< relref "/docs/how-to/engines#features" >}}).

Endpoints for groups. Please look at swagger for details.

- `{session}` - use the session name for Whatsapp instance that you created with `POST /api/session/start` endpoint
- `{groupId}` - group id in format `123123123123@g.us`. You can get the id in a few ways:
  - By [handling incoming message webhook]({{< relref "/docs/how-to/receive-messages" >}}).
  - By getting all groups (see below).
  - By creating a new group and saving the id.

### Create a new group

`POST /api/{session}/groups`

Request:

```json
{
  "name": "Group name",
  "participants": [
    {
      "id": "123123123123@c.us"
    }
  ]
}
```

### Get all groups

`GET /api/{session}/groups`

### Get the group

`GET /api/{session}/groups/{groupId}`

### Delete the group

`DELETE /api/{session}/groups/{groupId}`

### Leave the group

`POST /api/{session}/groups/{groupId}/leave`

### Set group subject

Updates the group subject.

Returns `true` if the subject was properly updated. This can return false if the user does not have the necessary
permissions.

`PUT /api/{session}/groups/{groupId}/subject`

Request:

```json
{
  "subject": "Group name"
}
```

### Set group description

Updates the group description.

Returns `true` if the subject was properly updated. This can return false if the user does not have the necessary
permissions.

`PUT /api/{session}/groups/{groupId}/description`

Request:

```json
{
  "description": "Group description"
}
```

### Settings
#### Security for group info
Updates the group settings to only allow admins to edit group info (title, description, photo).
`GET /api/{session}/groups/{groupId}/settings/security/info-admin-only`
```json
{
  "adminsOnly": true
}
```
`PUT /api/{session}/groups/{groupId}/settings/security/info-admin-only`

The request doesn't require any request's body and
**can't be used to disable the security setting (allow ANY to edit group info)**.
If you wish to have that ability - please [create an issue](https://github.com/devlikeapro/whatsapp-http-api/issues)


### Participants

#### Get participants

`GET /api/{session}/groups/{groupId}/participants`

#### Add participants

`POST /api/{session}/groups/{groupId}/participants/add`

```json
{
  "participants": [
    {
      "id": "123123123123@c.us"
    }
  ]
}
```

#### Remove participants

`POST /api/{session}/groups/{groupId}/participants/remove`

```json
{
  "participants": [
    {
      "id": "123123123123@c.us"
    }
  ]
}
```

### Admin

#### Promote to admin

Promote participants to admin users.

`POST /api/{session}/groups/{groupId}/admin/promote`

```json
{
  "participants": [
    {
      "id": "123123123123@c.us"
    }
  ]
}
```

#### Demote to regular users

Demote participants by to regular users.

`POST /api/{session}/groups/{groupId}/admin/demote`

```json
{
  "participants": [
    {
      "id": "123123123123@c.us"
    }
  ]
}
```

### Invite code

#### Get invite code

`GET /api/{session}/groups/{groupId}/invite-code`

Then you can put it in the url `https://chat.whatsapp.com/{inviteCode}` and send it to contacts.

#### Revoke invite code

Invalidates the current group invite code and generates a new one.

`POST /api/{session}/groups/{groupId}/invite-code/revoke`

## Webhooks
See the list of engines [**that support the feature ->**]({{< relref "/docs/how-to/engines#features" >}}).

### group.join

```json
{
  "event": "group.join",
  "session": "default",
  "engine": "WEBJS",
  "payload": {
    ...
  }
}
```

### group.leave

```json
{
  "event": "group.left",
  "session": "default",
  "engine": "WEBJS",
  "payload": {
    ...
  }
}
```
