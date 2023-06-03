---
title: "How to Avoid Blocking"
description: "How to Avoid Blocking From Whatsapp"
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: [ ]
menu:
  docs:
    parent: "help"
weight: 120
toc: true
---

How to Avoid Blocking in WhatsApp when developing bots.

It's important to keep in mind that WhatsApp has strict policies in place to prevent spamming and abuse of their
platform.

If you're developing a bot for WhatsApp, it's crucial to follow these guidelines to avoid getting blocked.

## Guidelines to Follow

### 1. Only Reply to Messages

When developing a bot for WhatsApp, you **should never initiate a conversation**.
Instead, your bot **should only reply** to messages that it receives.
This will prevent your bot from being flagged as spam by WhatsApp's users and algorithms.

### 2. Avoid Spamming and Sending Unnecessary Content

Sending too many messages or sending content that the user did not request can also lead to your bot being blocked. Make
sure to only send relevant and useful information to the user.
Additionally, do not send too many messages at once, as this can also trigger spam filters.

### 3. Other Considerations

There are other guidelines to follow when developing a bot for WhatsApp, such as avoiding the use of banned words and
not sharing sensitive or inappropriate content.
Make sure to read WhatsApp's policies thoroughly to ensure that your bot complies with all of their rules.

## How to Process Messages

When processing messages in your bot, it's important to follow certain steps to avoid being flagged as spam.
Here's a recommended process to follow:

1. **Send seen** before processing the message. This can be done by sending a `POST /api/sendSeen/` request to
   the WAHA API.

2. **Start typing** before sending a message and wait for a random interval depending on the size of the message. This can
   be done by sending a `POST /api/startTyping/` request.

3. **Stop typing** before sending the message. This can be done by sending a `POST /api/stopTyping/` request.

4. **Send the text message** using the `POST /api/sendText` request.

By following these steps, you can ensure that your bot processes messages in a way that's compliant with WhatsApp's
guidelines and reduces the risk of being blocked.
