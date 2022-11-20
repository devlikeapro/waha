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

## How much CPU and Memory does WhatsApp HTTP API consume?
The benchmark has been made on **Intel(R) Core(TM) i7-10510U CPU @ 1.80GHz**.
It may differ from case to case, it depends on usage pattern - how many messages you get, how many send, etc.

| Accounts (sessions) in the container | CPU  | Memory |
|--------------------------------------|------|--------|
| 1                                    | 30%  | 400MB  |
| 10                                   | 270% | 1.5GB  |


The nature of WhatsApp HTTP API and its underlying engines - is to run **real** WhatsApp Web version in Chrome and
communicate with it to prevent blocking from WhatsApp. It's the reason why it's so demanding on resources.
