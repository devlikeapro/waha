---
title : "🔧 Install"
description: "How to install and update WAHA"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 109
---

On the page you'll find answers on how to install WAHA.

If you wish to read a quick start guide which show you how to send you first message via HTTP API
please go to [**Quick Start ->**]({{< relref "/docs/overview/quick-start" >}}).

WAHA is distributed in two versions, that have a similar installation instructions.
- WAHA Core ![](/images/versions/core.png) - the basic version that meet almost 80% people's needs. 100% free and [open source ->](https://github.com/devlikeapro/whatsapp-http-api).
- WAHA Plus ![](/images/versions/plus.png) - the version with advanced messages, security, and reliability features. Donations, no license expiration, quick updates, read more about [Plus Version →]({{< relref "plus-version" >}})

## Requirements

Only thing that you must have - installed docker. Please follow the original
instruction <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noopener">how to install docker -></a>.

{{< details "Why Docker?" >}}
Docker makes it easy to ship all-in-one solution with the runtime and dependencies. You don't have to worry about
language-specific libraries or chrome installation.

Also, Docker makes installation and update processes so simple, just one command!
{{< /details >}}

## WAHA Core
Download the image:
```bash
docker pull devlikeapro/whatsapp-http-api
```

Run the container:
```bash
docker run -it -p 3000:3000/tcp devlikeapro/whatsapp-http-api
```

Open API documentation [http://localhost:3000](http://localhost:3000).

## WAHA Plus
Before installing WAHA Plus version you need to get a key, `{KEY}` in below commands, in format `dckr_pat_1111`

We distribute the key via two platforms (Boosty and Patreon) and you'll find the active key **in the latest post**.
Keep in mind that we publish new key every month, so you must get the latest active key in order to download
the latest image.

Read more about [**Plus Version →**]({{< relref "plus-version" >}})

{{< alert icon="👉" text="Subscribe as **PRO** level and get your personal key which won't expire every month while you're supporting the project" />}}

Download the image:
```bash
docker login -u devlikeapro -p {KEY}
docker pull devlikeapro/whatsapp-http-api-plus
docker logout
```

Run the container:
```bash
docker run -it -p 3000:3000/tcp devlikeapro/whatsapp-http-api-plus
```

Open API documentation [http://localhost:3000](http://localhost:3000).

## ARM
If you’re using **ARM** processor (like Apple Silicon, Apple M1, etc.) - add `:arm` tag at the end of the image name in the above commands.
- **WAHA Core** - `devlikeapro/whatsapp-http-api:arm`
- **WAHA Plus** - `devlikeapro/whatsapp-http-api-plus:arm`

You can also rename the image after you downloaded it with `docker tag` command,
so you can use the same image names in commands:
```bash
# Rename WAHA Core ARM
docker tag devlikeapro/whatsapp-http-api:arm devlikeapro/whatsapp-http-api

# Rename WAHA Plus ARM
docker tag devlikeapro/whatsapp-http-api-plus:arm devlikeapro/whatsapp-http-api-plus
```


## Update WAHA
{{< alert icon="💡" text="Please test all new versions in the development environment before updating production!" />}}

The commands are the same as for downloading, expected you need to restart **all working containers** after you download new image.

**WAHA Core** - download new image
```bash
# Download the image
docker pull devlikeapro/whatsapp-http-api

# Restart all containers
docker stop whatsapp-http-api
docker rm whatsapp-http-api
docker run -it --rm -p 3000:3000/tcp --name whatsapp-http-api devlikeapro/whatsapp-http-api
```

**WAHA Plus** - download new image (please use **the latest key** from Boosty or Patreon)
```bash
# Download the image
docker login -u devlikeapro -p {KEY}
docker pull devlikeapro/whatsapp-http-api-plus
docker logout
docker stop whatsapp-http-api

# Restart all containers
docker stop whatsapp-http-api
docker rm whatsapp-http-api
docker run -it --rm -p 3000:3000/tcp --name whatsapp-http-api devlikeapro/whatsapp-http-api
```
