---
title: "Configuration"
description: "Configuration"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: [ ]
weight: 800
---

You can configure WhatsApp HTTP API behaviour via environment variables, by adding `-e WHATSAPP_VARNAME=value` at the
begging of the command line or by using [other options](https://docs.docker.com/engine/reference/commandline/run/)

```bash
docker run -it -e "WHATSAPP_HOOK_EVENTS=*" -e WHATSAPP_HOOK_URL=https://httpbin.org/post devlikeapro/whatsapp-http-api
```

It's not necessary to always run such a long command - you can save all data in
[docker-compose.yaml](https://github.com/devlikeapro/whatsapp-http-api/blob/core/docker-compose.yaml)
file as described on [How to deploy page ->]({{< relref "/docs/how-to/deploy" >}}).

## Environment variables

The following environment variables can be used to configure the WAHA.

### Common
- `DEBUG=1`: Set this variable to any value to enable debug and verbose logs.
- `WHATSAPP_API_PORT=3000`: The port number that the HTTP server will listen on. The default value is `3000`.
- `WHATSAPP_API_HOSTNAME=localhost`: The hostname for the HTTP server. The default value is `localhost`.

### Sessions
- `WHATSAPP_RESTART_ALL_SESSIONS=True`: Set this variable to `True` to start all **STOPPED** sessions after container
  restarts. By default, this variable is set to `False`.
  - Please note that this will start all **STOPPED** sessions, not just the sessions that were working before the restart. You can maintain the session list by
    using `POST /api/session/stop` with the `logout: True` parameter or by calling `POST /api/session/logout` to remove
    **STOPPED** sessions. You can see all sessions, including **STOPPED** sessions, in the `GET /api/sessions/all=True`
    response.
- `WHATSAPP_START_SESSION=session1,session2`: This variable can be used to start sessions with the specified names right
  after launching the API. Separate session names with a comma.

### Swagger
- `WHATSAPP_SWAGGER_CONFIG_ADVANCED=true` - enables advanced configuration options for Swagger documentation - you can customize host, port and base URL for the requests.
  Disabled by default.
- `WHATSAPP_SWAGGER_ENABLED=false` - disables Swagger documentation. Enabled by default. Available in **WAHA Plus** only.
- `WHATSAPP_SWAGGER_USERNAME=admin` and `WHATSAPP_SWAGGER_PASSWORD=admin` - these variables can be used to protect the Swagger panel
  with `admin / admin` credentials. This does not affect API access. Available in **WAHA Plus** only.

Read more about security settings for Swagger and API on [**Security page** ->]({{< relref "/docs/how-to/security" >}}).

### Proxy
#### Global proxy configuration
If you need to use a proxy, you can set the following environment variables:

- `WHATSAPP_PROXY_SERVER=localhost:3128`: Use this variable to set the proxy server in the format `host:port`, without http or https.
- `WHATSAPP_PROXY_SERVER_USERNAME=username` and `WHATSAPP_PROXY_SERVER_PASSWORD=password`: Use these variables to set up credentials for the proxy.
- `WHATSAPP_PROXY_SERVER_LIST=host1.example.com:3138,host2.example.com:3138`: Use this variable to set a comma-separated list of addresses to use, using a round-robin algorithm to choose the server for the session.
- `WHATSAPP_PROXY_SERVER_INDEX_PREFIX=proxy-`: Use this variable to parse the session name for the prefix and find the appropriate session.
  For example, if you have set `WHATSAPP_PROXY_SERVER_LIST=host-first:80,host-second:80,host-third:80` and `WHATSAPP_PROXY_SERVER_INDEX_PREFIX=proxy-` and you run `proxy-3` session, the `host-third:80` proxy will be chosen for that session.
  This is a way to select a proxy from while you start session.

#### Session proxy configuration
You can configure proxy when you start session by setting `config.proxy` fields.
Read more about it on [**Session page** ->]({{< relref "/docs/how-to/sessions#configure-proxy" >}}).

Keep in mind that session's proxy configuration takes precedence over proxy configuration set by environment variables!


### Security ![](/images/versions/plus.png)
- `WHATSAPP_API_KEY=mysecret`: If you set this variable, you must include the `X-Api-Key: mysecret` header in all
  requests to the API. This will protect the API with a secret code.
- `WHATSAPP_SWAGGER_USERNAME=admin` and `WHATSAPP_SWAGGER_PASSWORD=admin`: These variables can be used to protect the
  Swagger panel with `admin / admin` credentials. This does not affect API access.


### Files ![](/images/versions/plus.png)

The following environment variables can be used to configure the file storage options for the WAHA:

- `WHATSAPP_FILES_MIMETYPES`: This variable can be used to download only specific mimetypes from messages.
  By default, all files are downloaded. The mimetypes must be separated by a comma, without spaces.
  For example: `audio,image/png,image/gif`. To choose a specific type, use a prefix (like `audio,image`). See usage below.
- `WHATSAPP_DOWNLOAD_MEDIA=true` - this variable can be used to **completely** disable downloading media files. By default, all files are downloaded.
  Set this variable to `WHATSAPP_DOWNLOAD_MEDIA=false` to disable downloading media files.
  - Under the hood, it sets `WHATSAPP_FILES_MIMETYPES=mimetype/ignore-all-media` to ignore all media files.
- `WHATSAPP_FILES_LIFETIME`: This variable can be used to set the time (in seconds) after which files will be removed to
  free up space. The default value is `180`.
- `WHATSAPP_FILES_FOLDER`: This variable can be used to set the folder where files from chats (images, voice messages)
  will be stored. The default value is `/tmp/whatsapp-files`.

💡 Even if WAHA doesn't process the message media because of `WHATSAPP_FILES_MIMETYPES` or `WHATSAPP_DOWNLOAD_MEDIA`
you'll get a webhook event with `hasMedia: True` field, but with no `media.url`.
```json
{
  "event": "message",
  "session": "default",
  "payload": {
    "hasMedia": true,
    "media": {
      "url": null,
      "mimetype": "video/mp4",
      "filename": null
    }
  }
}
```

## Examples

#### Debug Mode

To enable debug mode, set the `DEBUG` environment variable to any value:

```
DEBUG=1
```

#### Protecting the API with a Secret Code

To protect the API with a secret code, set the `WHATSAPP_API_KEY` environment variable to your secret code:

```
WHATSAPP_API_KEY=mysecret
```

You must include the `X-Api-Key: mysecret` header in all requests to the API.

#### Starting Sessions Automatically

To start sessions automatically when the API is launched, set the `WHATSAPP_START_SESSION` environment variable to a
comma-separated list of session names:

```
WHATSAPP_START_SESSION=session1,session2
```

#### Restarting All Sessions

To start all **STOPPED** sessions after container restarts, set the `WHATSAPP_RESTART_ALL_SESSIONS` environment variable
to `True`:

```
WHATSAPP_RESTART_ALL_SESSIONS=True
```

#### Protecting the Swagger Panel

To protect the Swagger panel with `admin / admin` credentials, set the `WHATSAPP_SWAGGER_USERNAME`
and `WHATSAPP_SWAGGER_PASSWORD` environment variables:

```
WHATSAPP_SWAGGER_USERNAME=admin
WHATSAPP_SWAGGER_PASSWORD=admin
```


#### Downloading Specific Mimetypes

To download only specific mimetypes from messages, set the `WHATSAPP_FILES_MIMETYPES` environment variable to a
comma-separated list of mimetypes:

```
WHATSAPP_FILES_MIMETYPES=audio,image/png,image/gif
```

#### Disable Downloading Media Files
To disable downloading media files, set the `WHATSAPP_DOWNLOAD_MEDIA` environment variable to `false`:

```
WHATSAPP_DOWNLOAD_MEDIA=false
```

#### Setting the File Lifetime

To set the time (in seconds) after which files will be removed to free up space, set the `WHATSAPP_FILES_LIFETIME`
environment variable:

```
WHATSAPP_FILES_LIFETIME=300
```

#### Setting the File Storage Folder

To set the folder where files from chats (images, voice messages) will be stored, set the `WHATSAPP_FILES_FOLDER`
environment variable:

```
WHATSAPP_FILES_FOLDER=/home/user/whatsapp-files
```
