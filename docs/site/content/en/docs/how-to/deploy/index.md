---
title: "Deploy"
description: "How to deploy WAHA"
lead: ""
date: 2020-10-06T08:48:45+00:00
lastmod: 2020-10-06T08:48:45+00:00
draft: false
images: [ ]
weight: 899
---

This page provides useful information to assist you in deploying the project.
It includes tips on how to avoid running long command lines, how to view logs, and other helpful advice.

## How to Use Docker Compose

Docker Compose is a tool that allows you to define and run multi-container Docker applications. It simplifies the
process of managing multiple containers and their dependencies. In this topic, we will walk you through how to use
Docker Compose with the WhatsApp HTTP API.

### Prerequisites

Before you start, you need to have Docker and Docker Compose installed on your machine. You can download Docker from the
official website [here](https://www.docker.com/products/docker-desktop). Docker Compose is included with Docker Desktop
for Windows and macOS, but for Linux, you need to install it separately. You can find the installation
instructions [here](https://docs.docker.com/compose/install/).

### Getting Started

To get started, you need to clone the [docker-compose.yaml](https://github.com/devlikeapro/whatsapp-http-api/blob/core/docker-compose.yaml) file to your local machine.
Open your terminal and run the following command:

```
wget https://raw.githubusercontent.com/devlikeapro/whatsapp-http-api/core/docker-compose.yaml
```

### Running the WhatsApp HTTP API Service

To start the `whatsapp-http-api` service, run the following command:

```
docker-compose up -d whatsapp-http-api
```

This will start the container in detached mode and map port 3000 to 3000 on the host machine.

To stop the service, run the command:

```
docker-compose down
```

This will stop and remove the container.

To restart the service, run the command:

```
docker-compose restart whtasapp-http-api
```

This will restart the container.

### Viewing the Logs

To view the logs for the `whatsapp-http-api` service, run the command:

```
docker-compose logs -f whatsapp-http-api
```

This will show the logs in real-time. To view the logs for the `whatsapp-http-api-plus` service,
replace `whatsapp-http-api` with `whatsapp-http-api-plus`.

To view the logs for a specific period, run the command:

```
docker-compose logs --since <time>
```

Replace `<time>` with the time period you want to view the logs for. For example, `docker-compose logs --since 1h` will
show the logs for the past hour.

### Using the WhatsApp HTTP API Services

There are two services provided in the `docker-compose.yml` file - `whatsapp-http-api` and `whatsapp-http-api-plus`.
It is important to note that these services must not be run at the same time.
By default, the `whatsapp-http-api` service will be used.

To use the `whatsapp-http-api-plus` service, you need to specify it in the command.

