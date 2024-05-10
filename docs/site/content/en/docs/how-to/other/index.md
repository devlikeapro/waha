---
title: "🛸 Other"
description: "Other features and API"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: [ ]
weight: 802
---

This page provides useful information about other features and API that are not covered in the other sections.

## Health Check
<b>Health check is available in [WAHA Plus ![](/images/versions/plus.png)]({{< relref "/docs/how-to/plus-version" >}}) only.</b>

The health check endpoint is used to determine the health of the service.

```
GET /health
```

It returns a **200 OK** status code if the service is healthy.

The response format:
```json
{
  "status": "ok",
  "info": {
    "metric1": {
      "field": "value"
    },
    "metric2": {
      "field": "value"
    }
  },
  "error": {},
  "details": {}
}
```

Where:
- `status`: `'error' | 'ok' | 'shutting_down'` - If any health indicator failed the status will be `'error'`. If the app is shutting down but still accepting HTTP requests, the health check will have the `'shutting_down'` status.
- `info`: Object containing information of each health indicator which is of status `'up'`, or in other words "healthy".
- `error`: Object containing information of each health indicator which is of status `'down'`, or in other words "unhealthy".
- `details`: Object containing detailed information of each health indicator.

### Health Check Indicators
Few things we check in the health check:
- Media files storage space - `mediaFiles.space`
- Sessions files storage space - `sessionsFiles.space`
- MongoDB connection - `mongodb`

### Configuration
The following environment variables can be used to configure the health check:
- `WHATSAPP_HEALTH_MEDIA_FILES_THRESHOLD_MB` - the threshold in MB for the media files storage. The default value is `100`.
- `WHATSAPP_HEALTH_SESSIONS_FILES_THRESHOLD_MB` - the threshold in MB for the sessions files storage. The default value is `100`.
- `WHATSAPP_HEALTH_MONGODB_TIMEOUT` - the timeout in milliseconds for the MongoDB health check. The default value is `5000`.

### Examples
**Healthy response** when you use [Local Storage]({{< relref "/docs/how-to/storages#sessions" >}}) for session authentication:

**200 OK**
```json
{
  "status": "ok",
  "info": {
    "mediaFiles.space": {
      "status": "up",
      "path": "/tmp/whatsapp-files",
      "diskPath": "/",
      "free": 132979355648,
      "threshold": 104857600
    },
    "sessionsFiles.space": {
      "status": "up",
      "path": "/app/.sessions",
      "diskPath": "/",
      "free": 132979355648,
      "threshold": 104857600
    }
  },
  "error": {},
  "details": {
    "mediaFiles.space": {
      "status": "up",
      "path": "/tmp/whatsapp-files",
      "diskPath": "/",
      "free": 132979355648,
      "threshold": 104857600
    },
    "sessionsFiles.space": {
      "status": "up",
      "path": "/app/.sessions",
      "diskPath": "/",
      "free": 132979355648,
      "threshold": 104857600
    }
  }
}
```

**Healthy response** when you use [MongoDB Storage]({{< relref "/docs/how-to/storages#sessions" >}}) for session authentication:

**200 OK**
```json
{
  "status": "ok",
  "info": {
    "mediaFiles.space": {
      "status": "up",
      "path": "/tmp/whatsapp-files",
      "diskPath": "/",
      "free": 132977496064,
      "threshold": 104857600
    },
    "mongodb": {
      "status": "up",
      "message": "Up and running"
    }
  },
  "error": {},
  "details": {
    "mediaFiles.space": {
      "status": "up",
      "path": "/tmp/whatsapp-files",
      "diskPath": "/",
      "free": 132977496064,
      "threshold": 104857600
    },
    "mongodb": {
      "status": "up",
      "message": "Up and running"
    }
  }
}
```

**Unhealthy response example**

**503 Service Unavailable**
```json
{
  "status": "error",
  "info": {
    "mediaFiles.space": {
      "status": "up",
      "path": "/tmp/whatsapp-files",
      "diskPath": "/",
      "free": 132976623616,
      "threshold": 104857600
    }
  },
  "error": {
    "mongodb": {
      "status": "down",
      "error": "Timeout"
    }
  },
  "details": {
    "mediaFiles.space": {
      "status": "up",
      "path": "/tmp/whatsapp-files",
      "diskPath": "/",
      "free": 132976623616,
      "threshold": 104857600
    },
    "mongodb": {
      "status": "down",
      "error": "Timeout"
    }
  }
}
```



## Get version
Returns the version of the installed docker image.
```
GET /api/version
```

```json
{
  "version": "2024.2.3",
  "engine": "NOWEB",
  "tier": "PLUS",
  "browser": "/usr/bin/google-chrome-stable"
}
```

