---
title : "➕ WAHA Plus"
description: "WAHA Plus"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 900
---

## Overview

**WAHA** is distributed in two versions:

1. Core ![](/images/versions/core.png) the basic version that meet almost 80% people’s needs. 100% free and open source.
2. Plus ![](/images/versions/plus.png) the version with advanced messages, security, and reliability features.

## Tiers
You support the project and get WAHA Plus by donating to the project on one of the platforms.

See tiers and available platforms on [**Pricing page ->**](/pricing)

## Patron Portal
<p align="center">
  <img src="patron-portal.png" alt="Patron Portal" />
  <br/>
  <br/>
</p>

After subscribing on Patreon or Boosty, you will get access to the [WAHA Patron Portal ->](https://portal.devlike.pro/)
where you will get the password to download the Plus image and manage your perks!

Read more about Patron Portal in
**<a href="https://www.patreon.com/posts/waha-patron-97637416" target="_blank">Patreon -> </a>**
or
**<a href="https://boosty.to/wa-http-api/posts/8319079f-dac1-4179-b954-fcc559097c76" target="_blank">Boosty -></a>**
posts.

### Install Plus
After you get the password, get your login to Docker Hub in [Patron Portal ->](https://portal.devlike.pro/)
and run the commands:
```bash
docker login -u devlikeapro -p {KEY}
docker pull devlikeapro/whatsapp-http-api-plus
docker logout
```
Then in all commands use **Plus** image `devlikeapro/whatsapp-http-api-plus` instead of Core `devlikeapro/whatsapp-http-api`.

