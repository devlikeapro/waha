---
title: "Troubleshooting"
description: "Solutions to common problems."
lead: "Solutions to common problems."
date: 2020-11-12T15:22:20+01:00
lastmod: 2020-11-12T15:22:20+01:00
draft: false
images: []
menu: 
  docs:
    parent: "help"
weight: 620
toc: true
---

## Problems updating npm packages

Delete the `./node_modules` folder, and run again:

```bash
npm install
```

## Problems with cache

Delete the temporary directories:

```bash
npm run clean
```
