---
title: "📖 Introduction"
description: "WAHA - WhatsApp HTTP API that you can install on your own server and run in less than 5 minutes!"
lead: ""
date: 2020-10-06T08:48:57+00:00
lastmod: 2020-10-06T08:48:57+00:00
draft: false
images: []
menu:
docs:
parent: "overview"
weight: 100
toc: true
---
**WAHA** - <u>W</u>hats<u>A</u>pp <u>H</u>TTP <u>A</u>PI that you can install on your own server and run in less than 5 minutes!

<div class="d-flex justify-content-center my-4">
  <img src="/images/logo.svg" style='border-radius: 50%' width='150'/>
</div>

## Get started

{{< alert icon="👉" text="Run WhatsApp HTTP API in less than 5 minutes!" />}}

We will guide you through the necessary steps to successfully send your first text message using WhatsApp HTTP API in
[**Quick Start →**]({{< relref "quick-start" >}}).

## Disclaimer
This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or its affiliates. The official WhatsApp website can be found at [whatsapp.com](https://whatsapp.com).

"WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners. Also it is not guaranteed you will not be blocked by using this method. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.

For any businesses looking to integrate with WhatsApp for critical applications, we highly recommend using officially supported methods, such as Twilio's solution or other alternatives. You might also consider [the official API ->](https://developers.facebook.com/docs/whatsapp/).



## Features

Here's the available features:

### Messages
- Send messages
- Receive messages
- Message replies
- Send location
- Receive location
- React to messages
- Send media (images/documents/files) ![](/images/versions/plus.png)
- Send voice messages ![](/images/versions/plus.png)
- Receive media (images/audio/video/documents) ![](/images/versions/plus.png)
- Receive messages - webhook retries ![](/images/versions/plus.png)

### Groups
- Create a group
- Get invite for group
- Modify group info (subject, description)
- Add group participants
- Kick group participants
- Promote/demote group participants

### Contacts
- Mute/unmute chats
- Block/unblock contacts
- Get contact info
- Get profile pictures
- Get presence (online\offline\typing) status

### Sessions
- Multi Device
- Get the screenshot
- Single WhatsApp account running inside one container
- Multiple WhatsApp account running inside one container ![](/images/versions/plus.png)
- Session saving (don't have to scan QR on every restart) ![](/images/versions/plus.png)
- Session saving on remote storage (mongodb) ![](/images/versions/plus.png)

### Security
- API authentication ![](/images/versions/plus.png)
- Swagger panel authentication ![](/images/versions/plus.png)

### Updates
- Bug fixes and updates come as soon as they are implemented.

## Engines
Not all Engines support all Features, see [**the feature supported by engines ->**]({{< relref "/docs/how-to/engines#features" >}}).


## Versions
WAHA is distributed in two versions:
- Core ![](/images/versions/core.png) - the basic version that meet almost 80% people's needs. **100% free and [open source ->](https://github.com/devlikeapro/whatsapp-http-api)**.
- Plus ![](/images/versions/plus.png) - the version with advanced messages, security, and reliability features. Donations, no license expiration, quick updates, read more about [**Plus Version →**]({{< relref "plus-version" >}})

