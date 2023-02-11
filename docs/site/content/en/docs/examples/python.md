---
title: "Python"
description: "WhatsApp HTTP API Python example."
lead: "WhatsApp HTTP API Python example."
date: 2020-10-06T08:49:31+00:00
lastmod: 2020-10-06T08:49:31+00:00
draft: false
images: []
menu:
docs:
parent: "help"
weight: 630
toc: true
---

To show how to receive messages we've created a simple "echo" server with two functions:

1. When we receive a text message - just send the text back
2. When we receive a message with a file (an image, a voice message) - download it and send the path back ![](/images/versions/plus.png)

In order to send you messages we use **Webhooks** and configure them via environments variables. So
what you need to
create "echo" server is HTTP server that will receive JSON POST request and then call back WhatsApp HTTP API
via `POST /api/sendText` endpoint with JSON body.

## Python echo server

We use Python. Feel free to create your favorite language example and contribute to the project!

Run "echo" server in one terminal and leave it working:

```bash
# if you haven't already
git clone https://github.com/devlikeapro/whatsapp-http-api.git
cd whatsapp-http-api
python -mpip install -r examples/requirements.txt
export FLASK_APP=examples/echo.py
flask run
```

Visit [http://localhost:5000](http://localhost:5000) and check that we are good to go further.

Let's start WhatsApp HTTP API and configure the "on message" webhook and point it on our "http://localhost:5000/message"
endpoint:

```bash
docker run -it --network=host -e WHATSAPP_HOOK_URL=http://localhost:5000/message -e WHATSAPP_HOOK_EVENTS=* devlikeapro/whatsapp-http-api
```

Now go ahead, open the second whatsapp and send to our WhatsApp HTTP API a text message! It must reply the same text.

![](/images/versions/plus.png) If you try to send an image the "echo server" will send a path to the downloaded file.
