---
title: "FAQ"
description: "Answers to frequently asked questions."
lead: "Answers to frequently asked questions."
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


## How to build the newest Docker image locally

If the changes haven't been released yet from `main` branch - you can build your own version from the git repository

```bash
git clone https://github.com/devlikeapro/whatsapp-http-api.git
cd whatsapp-http-api
docker build . -t devlikeapro/whatsapp-http-api
```


