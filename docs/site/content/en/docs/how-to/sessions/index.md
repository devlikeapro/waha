---
title : "Sessions"
description: "Sessions"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 200
---

## Saving session ![](/images/versions/plus.png)

Plus ![](/images/versions/plus.png) version allows you to save "session" state and avoid scanning QR code everytime when
you start a container.

### File storage

If you want to save your session and do not scan QR code everytime when you launch WAHA - connect a local file storage
to the container. WAHA stores authentication information in the directory and reuses it after restart.

[Attach volume](https://docs.docker.com/storage/volumes/) part to the command:
```bash
-v `pwd`/.sessions:/app/.sessions
```

The full command would be:
```bash
docker run --rm -d -v `pwd`/.sessions:/app/.sessions -p 127.0.0.1:3000:3000/tcp --name whatsapp-http-api devlikeapro/whatsapp-http-api
```

### Remote storage ![](/images/versions/soon.png)

If you're interested in using some "remote" storage (like Redis or other Databases) to save sessions - please create an
issue on GitHub.

For instances, it may be useful if you run WAHA in a cluster of servers and do not have shared file storage

## Multiple sessions ![](/images/versions/plus.png)

If you want to save server's CPU and Memory - run multiple sessions inside one docker container!

### Start

In order to start a new session - call `POST /api/sessions/start`

```json
{
  "name": "default"
}
```

### List

To get session list - call `GET /api/sessions`.

The response:

```json
[
  {
    "name": "default",
    "status": "STARTING"
  }
]
```

### Stop

In order to stop a new session - call `POST /api/sessions/stop`

{{< alert icon="👉" text="The stop request does not log out the account. Manually remove the session storage." />}}

```json
{
  "name": "default"
}
```

