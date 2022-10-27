---
title: "How to Update"
description: "Regularly update the installed npm packages to keep your Doks website stable, usable, and secure."
lead: "Regularly update the installed npm packages to keep your Doks website stable, usable, and secure."
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

{{< alert icon="💡" text="Learn more about <a href=\"https://docs.npmjs.com/about-semantic-versioning\">semantic versioning</a> and <a href=\"https://docs.npmjs.com/cli/v6/using-npm/semver#advanced-range-syntax\">advanced range syntax</a>." />}}

## Check for outdated packages

The [`npm outdated`](https://docs.npmjs.com/cli/v7/commands/npm-outdated) command will check the registry to see if any (or, specific) installed packages are currently outdated:

```bash
npm outdated [[<@scope>/]<pkg> ...]
```

## Update packages

The [`npm update`](https://docs.npmjs.com/cli/v7/commands/npm-update) command will update all the packages listed to the latest version (specified by the tag config), respecting semver:

```bash
npm update [<pkg>...]
```
