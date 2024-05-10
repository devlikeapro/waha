---
title: "🗄️ Storages"
description: "Storages"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: [ ]
weight: 700
---
There are several storages that are used by the WAHA, below you can find the list of them and the way to configure them.
1. [Sessions](#sessions) - used to store the session data, such as authentication information, configuration, and other data that is required to keep the session alive and connected to WhatsApp.
2. [Media](#media) - used to store the media files, such as images, videos, and other files that are received from the WhatsApp instance.

<b>Storages are available in [WAHA Plus ![](/images/versions/plus.png)]({{< relref "/docs/how-to/plus-version" >}}) only.</b>

## Sessions
The "Sessions" storage is used to store the session data, such as authentication information, configuration,
and other data that is required to keep the session alive and connected to WhatsApp.

If you want to save your session and do not scan QR code everytime when you launch WAHA -
connect the session storage to the container.

For the session storage, you can use the following options:
1. [Local (files)](#local-files) - the default option, stores the session data in the local storage using files.
2. [MongoDB](#mongodb) - stores the session data in the MongoDB database.

The following table shows the compatibility of the session storage with the engines:

|               | WEBJS | NOWEB | VENOM |
|---------------|:-----:|:-----:|:-----:|
| Local (files) |  ✔️   |  ✔️   |  ✔️   |
| MongoDB       |  ✔️   |  ✔️   |   ➖   |

## Sessions - Local (files)
By default, the WAHA uses the **local storage (files)** to store the session data.

{{< alert icon="💡" text="It's <b>well tested solution</b> even for production" />}}

In order to use the local storage and save the session data between the container restarts,
you need to mount the volume to the `/app/.sessions` directory using the `-v` option in `docker run` command:

```bash
-v /path/to/on/host/.sessions:/app/.sessions
```

The full command to run the WAHA with the local storage and save the session data
in the current directory and `.sessions` directory:
```bash
docker run -v `pwd`/.sessions:/app/.sessions -p 3000:3000/tcp devlikeapro/whatsapp-http-api-plus
```
This is the only action you need to do to use the local storage - all session data will be available between the container restarts.

### How it works
In the host machine, the session data will be stored in the current directory in the `.sessions` directory.

Under the hood, the WAHA stores the session data in the following directory structure:
```
.sessions/{engine}/{sessionName}/...
```
when you "logout" the session using [POST /api/sessions/logout]({{< relref "/docs/how-to/sessions#logout">}}) or providing `logout: True` in [POST /api/sessions/stop]({{< relref "/docs/how-to/sessions#stop">}})
it removes the directory with the session data.

### Health Check
The [WAHA Plus ![](/images/versions/plus.png)]({{< relref "/docs/how-to/plus-version" >}}) provides [the health check endpoint]({{< relref "/docs/how-to/other" >}}) that checks the local storage.

## Sessions - MongoDB
If you want to use the MongoDB to store the session data, you need to:
1. Start the MongoDB server (using docker or any other way). You can either start your own MongoDB server or use the one of cloud providers, like [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Set `WHATSAPP_SESSIONS_MONGO_URL=mongodb://user:password@host:port/` environment variable to connect to the MongoDB server.


**We recommend using your own MongoDB server as close as possible to WAHA server** for the best performance and security reasons.

{{< alert icon="💡" text="For <b>WEBJS</b> engine it can take up to 1 minute to save credentials in Mongo Database" />}}

### Example
First, you need to start MongoDB server:
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

Then, you need to run the WAHA with the `WHATSAPP_SESSIONS_MONGO_URL` environment variable (please note using `--network host` option as well)
```bash
docker run -e WHATSAPP_SESSIONS_MONGO_URL=mongodb://localhost:27017/ --network host devlikeapro/whatsapp-http-api-plus
```

This is the only action you need to do to use the MongoDB storage -
all session authentication data will be stored in the MongoDB database.

### How it works
When you start a session, it stores the session data in the MongoDB database in two databases:
1. `waha_{engine}` - it saves the session configuration in `sessions` collection with `name: {sessionName}` field.
2. `waha_{engine}_{sessionName}` - it saves the WhatsApp authentication data and other session data. Each engine saves different data in this database.

When you "logout" the session using [POST /api/sessions/logout]({{< relref "/docs/how-to/sessions#logout">}}) or providing `logout: True` in [POST /api/sessions/stop]({{< relref "/docs/how-to/sessions#stop">}}) it removes those databases or elements from them.

For dealing and troubleshooting with the MongoDB, we recommend using [MongoDB Compass](https://www.mongodb.com/products/tools/compass).

![](waha-mongodb.png)

### MongoDB Atlas
If you use the [MongoDB Atlas](https://www.mongodb.com/atlas/database) you must grant
`Atlas Admin` role in **Security => Database Access** before you connect to the database.

For production please consider running the MongoDB server close to the WAHA server for the best performance and security reasons.

### Health Check
The [WAHA Plus ![](/images/versions/plus.png)]({{< relref "/docs/how-to/plus-version" >}}) provides [the health check endpoint]({{< relref "/docs/how-to/other" >}}) that checks the MongoDB connection.

## Media
When your WhatsApp instance receives media files, it stores them in the media storage.

You can use the following options to store the media files:
1. [Local](#local) - the default option, stores the media files in the local storage using files.
2. [S3](#s3) - stores the media files in the S3 storage.

Read more about [available configuration options ->]({{<relref "/docs/how-to/config#files">}}).

The following table shows the compatibility of the storage with the engines:

|       | WEBJS | NOWEB | VENOM |
|-------|:-----:|:-----:|:-----:|
| Local |  ✔️   |  ✔️   |  ✔️   |
| S3    |  🕒   |  🕒   |   ➖   |

## Media - Local
By default, the WAHA uses the **local file storage** to store the media files and those files has a short lifetime (180 seconds).
So it's your app responsibility to download and store them in a safe persistent place during this time.

### Save media files between the container restarts
If you want to use the local storage and **save the media files between the container restarts for a long time** - you need to:
1. Specify a dedicated folder to store the media files using `WHATSAPP_FILES_FOLDER=/app/.media` environment variable
2. Disable automatic media files cleanup using `WHATSAPP_FILES_LIFETIME=0` environment variable
3. Connect the volume to the specified folder using the `-v /path/to/files/on/host:/app/.media` option in `docker run` command to the folder specified in `WHATSAPP_FILES_FOLDER` environment variable.

Read more about [available configuration options ->]({{<relref "/docs/how-to/config#files">}}).

Here's all the steps in one command:
```bash
docker run -v /path/to/on/host/.media:/app/.media -e WHATSAPP_FILES_FOLDER=/app/.media -e WHATSAPP_FILES_LIFETIME=0 -p 3000:3000/tcp devlikeapro/whatsapp-http-api-plus
```

### Health Check
The [WAHA Plus ![](/images/versions/plus.png)]({{< relref "/docs/how-to/plus-version" >}}) provides [the health check endpoint]({{< relref "/docs/how-to/other" >}}) that checks the local storage.

## Media - S3
If you're interested in using the S3 storage or any other cloud storage (like [self-hosted S3 - Minio](https://min.io/)),
please create an issue or vote for the S3 issue in [the GitHub repository](https://github.com/devlikeapro/whatsapp-http-api/issues?q=is%3Aissue+is%3Aopen+S3).
