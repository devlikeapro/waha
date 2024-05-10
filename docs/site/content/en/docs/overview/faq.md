---
title: "❓ FAQ"
description: "Answers to frequently asked questions."
lead: "Answers to frequently asked questions."
date: 2020-10-06T08:49:31+00:00
lastmod: 2020-10-06T08:49:31+00:00
draft: false
images: [ ]
menu:
docs:
parent: "help"
weight: 130
toc: true
---

## How much CPU and Memory does WhatsApp HTTP API consume?
### WEBJS

The benchmark has been made on **Intel(R) Core(TM) i7-10510U CPU @ 1.80GHz**.
It may differ from case to case, it depends on usage pattern - how many messages you get, how many send, etc.

| Accounts (sessions) in the container | CPU  | Memory |
|--------------------------------------|------|--------|
| 1                                    | 30%  | 400MB  |
| 10                                   | 270% | 1.5GB  |

The nature of WhatsApp HTTP API and its underlying engines - is to run **real** WhatsApp Web version in Chrome and
communicate with it to prevent blocking from WhatsApp. It's the reason why it's so demanding on resources.

### NOWEB
If you're looking for less resource demanded engine - [have a look at **NOWEB** engine ->]({{< relref "/docs/how-to/engines" >}})

Quotes from the users:
> The server has **2 CPU and 8GB** of memory. Today we have **85 sessions** in this instance.

> **400** sessions with **4CPU and 32RAM**. It's working fine.


