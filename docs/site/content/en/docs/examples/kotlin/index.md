---
title: "Kotlin"
description: "WhatsApp HTTP API + Kotlin examples."
lead: "WhatsApp HTTP API + Kotlin examples."
date: 2020-10-06T08:49:31+00:00
lastmod: 2020-10-06T08:49:31+00:00
draft: false
images: ["/images/kotlin-whatsapp.png"]
menu:
docs:
parent: "help"
weight: 630
toc: true
---

![](/images/kotlin-whatsapp.png)

We've created a few examples on how to interact with WAHA WhatsApp HTTP API with Kotlin (ktor).

You can find the examples in
[examples folder on GitHub with detailed instructions in README.md ->](https://github.com/devlikeapro/waha-kotlin)

## Installation

We assume that you have installed software:

1. Kotlin + JVM
2. Docker

### Download and start image

First of all, you must run WhatsApp HTTP API locally (which under the hood it
runs real WhatsApp Web instance and expose HTTP API for interaction).

Here are the steps from
[Quick Start](https://waha.devlike.pro/docs/overview/quick-start/):

Download and start WhatsApp HTTP API docker container

```bash
# Download the image
docker pull devlikeapro/whatsapp-http-api
# Run the docker container
docker run -it --rm --network=host -e WHATSAPP_HOOK_URL=http://localhost:5000/bot -e "WHATSAPP_HOOK_EVENTS=*" --name whatsapp-http-api devlikeapro/whatsapp-http-api

# It prints logs and the last line must be
# WhatsApp HTTP API is running on: http://[::1]:3000
```

#### Download image - ARM

If you're using ARM (like Apple Silicon, Apple M1, etc.) - use following
commands to download the image

![](/images/versions/core.png) For Core version the command is

```bash
# Download the image
docker pull devlikeapro/whatsapp-http-api:arm
# Rename it, so you can use devlikeapro/whatsapp-http-api image in other place
docker tag devlikeapro/whatsapp-http-api:arm devlikeapro/whatsapp-http-api
# Run the docker container
docker run -it --rm --network=host -e WHATSAPP_HOOK_URL=http://localhost:5000/bot -e "WHATSAPP_HOOK_EVENTS=*" --name whatsapp-http-api devlikeapro/whatsapp-http-api

# It prints logs and the last line must be
# WhatsApp HTTP API is running on: http://[::1]:3000
```

### Start session and scan QR

2. Open Swagger API in the browser http://localhost:3000/
3. Start session and scan QR code in swagger
   1. Find `POST /api/session/start` request press **Try it out** and
      **Execute** it with `default` session name
   2. Find `GET /api/screenshot` and execute it - it must show QR code
   3. Scan QR code on your mobile WhatsApp application (that installed on your
      phone)
   4. Execute `GET /api/screenshot` once again - it must show the screenshot
      from WhatsApp Web.
4. Send test text message - find `POST /api/sendText` and execute it with
   payload (change `12132132130` in the `chatId` to phone number that is
   registered in WhatsApp).

```json
{
  "chatId": "12132132130@c.us",
  "text": "Hi there!",
  "session": "default"
}
```

If you see **Hi there!** message then you're ready to run bots!

## WhatsApp Echo Bot

The WhatsApp Echo Bot is a sample ktor webhook server application that echoes
back to you whatever you send it. It can serve as a basic reference for how to
set up webhooks and reply to incoming messages.

```bash
# Clone the git repository with example
git clone https://github.com/devlikeapro/waha-kotlin.git

# Build and run the app
./gradlew build
./gradlew run
```

Open http://127.0.0.1:5000/bot - if you see **WhatsApp Echo Bot is ready!** then
the bot is ready to receive message!

Send message to the WhatsApp (that you used to scan QR code) and it'll echo text
back to you!


