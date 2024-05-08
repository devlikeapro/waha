---
title: "Swagger (OpenAPI)"
description: "Swagger (OpenAPI)"
lead: ""
date: 2020-10-06t08:48:45+00:00
lastmod: 2020-10-06t08:48:45+00:00
draft: false
images: [ ]
weight: 111
---

## Overview
The project provides HTTP API (REST), which is documented with OpenAPI specification and Swagger UI.

You can see all available endpoints, request/response examples, and even execute them directly from the Swagger UI.

Later version:
- [OpenAPI specification ->](/swagger/openapi.json)
- [Swagger documentation ->](/swagger)

You can find Swagger documentation on the following url after you
[install and started]( {{< relref "/docs/how-to/install" >}}) it:
- Swagger: [http://localhost:3000](http://localhost:3000).
- OpenAPI: [http://localhost:3000/-json](http://localhost:3000/-json).

## Configuration
- `WHATSAPP_SWAGGER_CONFIG_ADVANCED=true` - enables advanced configuration options for Swagger documentation - you can customize host, port and base URL for the requests.
  Disabled by default.
- `WHATSAPP_SWAGGER_ENABLED=false` - disables Swagger documentation. Enabled by default. Available in **WAHA Plus** only.
- `WHATSAPP_SWAGGER_USERNAME=admin` and `WHATSAPP_SWAGGER_PASSWORD=admin` - these variables can be used to protect the Swagger panel
  with `admin / admin` credentials. This does not affect API access. Available in **WAHA Plus** only.

Read more about security settings for Swagger and API on [**Security page** ->]({{< relref "/docs/how-to/security" >}}).

