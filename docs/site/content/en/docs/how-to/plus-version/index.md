---
title : "WAHA Plus"
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

 You support the project and get **WAHA Plus** on
 <a href="https://patreon.com/wa_http_api" target="_blank">
   <b>
     Patreon ->
   </b>
 </a>
 or
 <a href="https://boosty.to/wa-http-api" target="_blank">
     <b>
         Boosty ->
     </b>
 </a>
.

### Donations

WAHA Plus version is available through **donations** (subscriptions).

**It doesn't require monthly subscriptions, once installed on your server - it always works!**
(until WhatsApp made backward-incompatible changes, and you have to update the image)

{{< alert icon="💡" text="No licence checks or expiration on already installed instances!" />}}
We do not sell **WAHA**, it's not a purchase. It's a donation.

We treat our projects like art. You donate to the project and get a bit more from it as a thank-you. 😊

Treat **WAHA Plus** it as an additional episode, behind-the-scenes videos, our nude photos 😊

{{< alert icon="💡" text="WAHA does not have license checks and expiration - because art can not expire! Enjoy it till it works!" />}}

We donate most of the donations down to the stream to the underlying libraries and tools - JS-community, Node, other libraries authors, personal contributors.
By donating to the **WAHA** you donate to the Open Source world!

### Features

The Plus additional features are:

1. [**Send images\files\voices** →]({{< relref "/docs/how-to/send-messages" >}})
2. [**Receive images\files\voices** →]({{< relref "/docs/how-to/receive-messages" >}})
3. [**Webhook retries** →]({{< relref "/docs/how-to/receive-messages#retries" >}})
4. [**Security** →]({{< relref "/docs/how-to/security" >}})
5. [**Saving sessions** →]({{< relref "/docs/how-to/sessions" >}})
6. [**Support multiple sessions** →]({{< relref "/docs/how-to/sessions" >}})
7. **Priority in support** - on both bugs and features

### Why WAHA?

What is the difference between **WAHA Plus** and **other SaaS solutions** for WhatsApp HTTP API?

|                    |                     WAHA Plus                     |                                                                            Others |
|--------------------|:-------------------------------------------------:|----------------------------------------------------------------------------------:|
| **Sessions**       |   ✔️ No limits on **accounts** or **servers**!    |                                                      ➖ One account for $50/month. |
| **Infrastructure** | ✔️ On-Premise - your server, your infrastructure! |                                                        ➖ Insecure cloud solution. |
| **Security**       |                 ✔️ No data leaks!                 | ➖ You have to give access to customers' data - phone number, name, your messages. |
| **License Term**               |               ✔️ No license checks!               |                                                                       ➖ One month |
| **Message price**  |             ✔️ All messages are Free!             |                     ➖ Some solutions have a price for messages - $1/100 messages. |
| **Expenses**       |               ✔️ $19 **donation**!                |                                                 ➖ Monthly payment starts from $50 |


## Get Plus ![](/images/versions/plus.png)

The more you support the project - the more you get!

### Tiers

Here's available tiers for our supporters:

|                                                                                                                                                                                                                                                                                                                  | Plus    | Advanced |   Pro   |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|:--------:|:-------:|
| Access to WAHA Plus  ![](/images/versions/plus.png) docker image with a personal key.                                                                                                                                                                                                                            | ✔️      |    ✔️    |   ✔️    |
| Special badge ([![patron:TIER](https://img.shields.io/badge/patron-TIER-188a42)](https://waha.devlike.pro/docs/how-to/plus-version/#tiers)) and labels (`patron:TIER`) on [project's issues, PRs and Discussion](https://github.com/devlikeapro/whatsapp-http-api) to highlight your support to the project!     | ✔️      |    ✔️    |   ✔️    |
| An invitation to a private Github repository so you have the WAHA Plus source code.                                                                                                                                                                                                                              | ➖️      |    ✔️    |   ✔️️   |
| Access to a Telegram group where we provide support and assistance.                                                                                                                                                                                                                                              | ➖️      |    ➖     |   ✔️    |
| Access to an [experimental MOBILE engine]({{< relref "/docs/how-to/plus-version#tiers" >}})!.                                                                                                                                                                                                                    | ➖️      |    ➖     |   ✔️    |
| **Donation**                                                                                                                                                                                                                                                                                                     | **$19** | **$39**  | **$99** |

For **$19** donation you get:
1. **Secret password** for Docker Hub to download Plus image: `devlikeapro/whatsapp-http-api-plus`.
2. **All updates for one month** for the Plus image.
3. **NO LICENSE CHECKS** on installed instances!
4. **NO LICENSE EXPIRATION** on installed instances! We repeated it twice to make sure that you've got it 😊

{{< alert icon="💡" text="If you stay subscribed - the donation amount will never change for you and always be $19 to get monthly updates!" />}}

### Patreon
<p align="center">
  <img src="patreon.png" alt="Patreon" />
</p>

Support the project and get WAHA Plus version on
<a href="https://patreon.com/wa_http_api" target="_blank">
  <b>
    Patreon ->
  </b>
</a>

Go ahead and get your own WhatsApp HTTP API!

### Boosty
<p align="center">
  <img src="boosty.svg" alt="Patreon" />
  <br/>
  <br/>
</p>

Support the project and get WAHA Plus version on
<a href="https://boosty.to/wa-http-api" target="_blank">
<b>
Boosty ->
</b>
</a>

Go ahead and get your own WhatsApp HTTP API!

### Install Plus
After you get the password, use it to login and download docker image:
```bash
docker login -u devlikeapro -p {KEY}
docker pull devlikeapro/whatsapp-http-api-plus
docker logout
```
Then in all commands use **Plus** image `devlikeapro/whatsapp-http-api-plus` instead of Core `devlikeapro/whatsapp-http-api`.

