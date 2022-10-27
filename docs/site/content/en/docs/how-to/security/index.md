---
title : "Security"
description: "Security"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: []
weight: 800
---
{{< alert icon="💡" text="Do not expose WhatsApp HTTP API on public networks!" />}}

We do not recommend exposing the API on any public networks!

Either protect the API with [Api Key](https://www.fortinet.com/resources/cyberglossary/api-key) or deny access by using
firewalls.

## API security ![](/images/versions/plus.png)

You can protect the API by requiring Api Key in a request's headers.

### Set Api Key

Set `WHATSAPP_API_KEY=yoursecretkey` environment variable for that:

```bash
docker run -it -e WHATSAPP_API_KEY=yoursecretkey devlikeapro/whatsapp-http-api
```

### Swagger

After you set api key - to authorize on swagger use **Authorize** button at the top:
![](swagger-auth.png)

### Add X-Api-Key header

To authorize requests - set `X-Api-Key` header to `yoursecretkey` for all requests that go to WAHA.

#### Python
Example for Python **requests** library:

```python
import requests

headers = {
  'Content-type': 'application/json',
  'X-Api-Key': 'yoursecretkey',
}
requests.get("http://localhost:3000/api/sessions", headers=headers)
```

## Swagger Security ![](/images/versions/plus-soon.png)
If you want to hide under a password the swagger UI - please create an issue on GitHub, we'll do it!
