---
title: "How to Update"
description: "Regularly update the installed WAHA to keep your bot stable, usable, and secure."
lead: "Regularly update the installed WAHA to keep your bot stable, usable, and secure."
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "help"
weight: 610
toc: true
---

{{< alert icon="💡" text="Please test all new versions in the development environment before updating production!" />}}

## Core
![](/images/versions/core.png) For Core version the command is

```bash
docker pull devlikeapro/whatsapp-http-api
```

## Plus
![](/images/versions/plus.png) For Plus version, we use login to get the image before:

```bash
docker login -u devlikeapro -p {PASSWORD}
docker pull devlikeapro/whatsapp-http-api-plus
docker logout
```

Read more about how to get `PASSWORD` for [Plus Version →]({{< relref "plus-version" >}})
