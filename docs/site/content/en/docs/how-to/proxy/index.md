---
title: "🌐 Proxy"
description: "Proxy"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: [ ]
weight: 226
---

## Overview
If you're experiencing issues scanning QR codes in WhatsApp, especially with **Indian 🇮🇳 phone numbers**,
using a proxy located close to the phone number's location may help resolve the problem.

It affects both **WEBJS** and **NOWEB** [engines]({{< relref "/docs/how-to/engines" >}}).

### Symptoms
1. You start a new session in WhatsApp.
2. Scan the QR code.
3. Experience a long loading time.
4. Face login failures or instant logout.
5. Encounter a new QR code or enter a FAILED state immediately.

<div class="text-center">

  ![WhatsApp - could not login](could-not-login.png)

</div>

## Configuration
There are two ways to set up proxies:
1. Global Setting (for all sessions per container)
2. Per Session Configuration (you can define a proxy for each session when you start it)

### Global Proxy Configuration
To use a proxy, you can set the following environment variables:

- `WHATSAPP_PROXY_SERVER=localhost:3128`: Set the proxy server in the format `host:port`, without HTTP or HTTPS.
- `WHATSAPP_PROXY_SERVER_USERNAME=username` and `WHATSAPP_PROXY_SERVER_PASSWORD=password`: Configure credentials for the proxy.
- `WHATSAPP_PROXY_SERVER_LIST=host1.example.com:3138,host2.example.com:3138`: Specify a comma-separated list of addresses to use, utilizing a round-robin algorithm for server selection.
- `WHATSAPP_PROXY_SERVER_INDEX_PREFIX=proxy-`: Define a session name prefix to choose the appropriate proxy from the list.

Read more about it on [**Configuration page** ->]({{< relref "/docs/how-to/config#proxy" >}}).

### Session Proxy Configuration
You can configure proxy for a session by setting `config.proxy` fields when you `POST /api/sessions/start`:
- `server` - proxy server address, without `http://` or `https://` prefixes
- `username` and `password` - set this if the proxy requires authentication


**No authentication**
```json
{
  "name": "default",
  "config": {
    "proxy": {
      "server": "localhost:3128"
    }
  }
}
```

**Proxy with authentication**
```json
{
  "name": "default",
  "config": {
    "proxy": {
      "server": "localhost:3128",
      "username": "username",
      "password": "P@ssw0rd"
    }
  }
}
```

The configuration is saved and will be applied if the docker container restarts,
and you set `WHATSAPP_RESTART_ALL_SESSIONS` environment variables.
Read more about it in [Autostart section](#autostart).

Read more about it on [**Sessions page** ->]({{< relref "/docs/how-to/sessions#configure-proxy" >}}).


## Recommended Proxies

### Proxy6
We recommend using <b><a href="https://proxy6.net/en/?r=628046" target="_blank">Proxy6</a></b>
where you can get a DEDICATED proxy (only you'll use it) for **$1.77 per month**.

Apply the promocode get a **5% discount** on your purchase.
```
9W9oVxx3UX
```

### Geonode
Another option is <b><a href="https://geonode.com/invite/89107" target="_blank">Geonode</a></b>.
