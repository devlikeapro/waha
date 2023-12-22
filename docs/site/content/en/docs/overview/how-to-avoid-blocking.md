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

> You can use a short link http://wa.me/7911111111?text=Hi
> so a user can click on it and start the dialog with the bot first

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

## How to not get Banned?

WhatsApp knows that it's uncommon for someone to send so many messages or bulk messages to people they've never talked to each other before so it is considered spam/marketing junk pretty fast. There are some tips before sending a message to WhatsApp

**Dos and Don'ts:**

1. Important: Do NOT send messages which get you a report. As long as you don't get reports from users who you sent a message, your account will be mostly fine.
2. Having real content, a survey that the person agreed with is different from a marketing message on a Saturday night.
3. Send messages written in different ways, you could make a script that places spacebars randomly on your string AND includes the person's (first) name
4. Never use fixed times, always go for sending the first message, wait a random time between 30 ~ and 60 seconds and then send the second message
5. Always try to group contacts by their area code, WhatsApp expects a regular person to talk mostly with contacts that are within the same area of your phone number.
6. Have a profile picture, this is not related to WhatsApp Bots Catcher® but sending a new message for someone not having a picture/name/status will elevate your chances of being manually tagged as spam.
7. Send "seen" confirmation to messages or disable it on WhatsApp
8. Avoid sending links that were previously marked as spam on WhatsApp or non-HTTPS. A URL shortener is a good idea
9. IMPORTANT: It's terrible if you send messages 24/7 without giving it some time to wait. Random delays between messages are not enough, send a reasonable amount of messages keeping in mind your conversion rate, For example: for one hour send a maximum of 4 messages per contact that have replied to your message, and stop sending messages for one hour, then start again. Again, don't send messages without stopping for a while between every "package"
10. Send only one short message when starting a conversation, one should not send long texts or multiple messages without the user consenting

**Have in mind:**

1. For every one you send a message that doesn't have your number on their contact list asked if it's spam, being tagged as spam a few times (5 - 10) will get you banned
2. WhatsApp records every movement you do, you can even check the logs when sending simple support email, it contains all kinds of information, this said: act as human as possible
3. Try to engage in conversations, as long as you send a message and the person doesn't automatically block you it'll be quite okay. People constantly talking to you and adding you to their contact list will make your number stronger against a ban
4. Think about that like a points system, you start with zero points (negative if your device was previously blacklisted), if you reach below zero you are out, if you engage in conversations you get a point, if you are tagged as spam you lose some points, if you are blocked you may lose more points
5. Finally, If your content is spam, it doesn't matter if you are using a broadcast list, group, or direct contact, you will still be banned

As API, we say all that's left to do right now is to agree with WhatsApp's policy, not send spam messages, and always wait for the other person to contact you first.

You could make it by sending an SMS to the person with a link to start a chat on WhatsApp with you by link [https://wa.me/12132132131?text=Hi](https://wa.me/12132132131?text=Hi).


