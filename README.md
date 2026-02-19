# WAHA

<p align="center">
  <img src="./logo.png" style='border-radius: 50%' width='150'/>
</p>

**WAHA** - **W**hats**A**pp **H**TTP **A**PI (REST API) that you can install on your own server and run in less than 5 minutes!

[![Docker Pulls](https://img.shields.io/docker/pulls/devlikeapro/waha)](https://hub.docker.com/r/devlikeapro/waha)

- Documentation: [https://waha.devlike.pro/](https://waha.devlike.pro/)
- Dashboard Example: [https://waha.devlike.pro/dashboard](https://waha.devlike.pro/dashboard)
- Swagger Example: [https://waha.devlike.pro/swagger](https://waha.devlike.pro/swagger)

# Tables of Contents

<!-- toc -->

- [Quick start](#quick-start)
  * [Requirements](#requirements)
  * [Send your first message](#send-your-first-message)
    + [1. Download image](#1-download-image)
    + [2. Run WhatsApp HTTP API](#2-run-whatsapp-http-api)
    + [3. Start a new session](#3-start-a-new-session)
    + [4. Get and scan QR](#4-get-and-scan-qr)
    + [5. Get the screenshot](#5-get-the-screenshot)
    + [6. Send a text message](#6-send-a-text-message)
  * [What is next?](#what-is-next)
- [Development](#development)
  * [Start the project](#start-the-project)

<!-- tocstop -->

# Quick start

## Requirements

Only thing that you must have - installed docker. Please follow the original
instruction <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noopener">how to install docker -></a>.

When you are ready - come back and follows the below steps to send the first text message to WhatsApp via HTTP API!

## Send your first message

Let's go over steps that allow you to send your first text message via WhatsApp HTTP API!

### 1. Download image

Assuming you have installed [Docker](https://docs.docker.com/get-docker/), let's download the image.


```bash
docker pull devlikeapro/waha
```


```bash
docker login -u devlikeapro -p {KEY}
docker pull devlikeapro/waha-plus
docker logout
```

Read more about how to get `PASSWORD` for [**➕ WAHA Plus**](https://waha.devlike.pro/docs/how-to/waha-plus/)

### 2. Run WhatsApp HTTP API

Run WhatsApp HTTP API:

```bash
docker run -it --rm -p 3000:3000/tcp --name waha devlikeapro/waha

# It prints logs and the last line must be
# WhatsApp HTTP API is running on: http://[::1]:3000
```

Open the link in your browser [http://localhost:3000/](http://localhost:3000/) and you'll see API documentation
(Swagger).


### 3. Start a new session

To start a new session you should have your mobile phone with installed WhatsApp application close to you.

Please go and read how what we'll need to a bit
later:
<a href="https://faq.whatsapp.com/381777293328336/?helpref=hc_fnav" target="_blank">
How to log in - the instruction on WhatsApp site
</a>

When your ready - find `POST /api/sessions`, click on **Try it out**, then **Execute** a bit below.


The example payload:
```json
{
  "name": "default"
}
```


By using the request with `name` values you can start multiple session (WhatsApp accounts) inside the single docker container in Plus


### 4. Get and scan QR

Find `GET /api/screenshot` and execute it, it shows you QR code.


**Scan the QR with your cell phone's WhatsApp app.**


### 5. Get the screenshot

Execute `GET /api/screenshot` after a few seconds after scanning the QR - it'll show you the screenshot of you Whatsapp
instance. If you can get the actual screenshot - then you're ready to start sending messages!


### 6. Send a text message

Let's send a text message - find `POST /api/sendText`  in [swagger](http://localhost:3000/) and change `chatId` this
way: use a phone international phone number without `+` symbol and add `@c.us` at the end.

For phone number `12132132131` the `chatId` is  `12132132131@c.us`.

The example payload:
```json
{
  "chatId": "12132132130@c.us",
  "text": "Hi there!",
  "session": "default"
}
```

Also, you can use `curl` and send POST request like this:

```bash
# Phone without +
export PHONE=12132132130
curl -d "{\"chatId\": \"${PHONE}@c.us\", \"text\": \"Hello from WhatsApp HTTP API\" }" -H "Content-Type: application/json" -X POST http://localhost:3000/api/sendText
```

## What is next?
[Go and read the full documentation!](https://waha.devlike.pro/docs/overview/introduction/)

# Development

## Start the project
1. Clone the repository
2. Make sure you're using node>=22 (check [.nvmrc](/.nvmrc) to get the version)
3. Install the **whatsapp-rust-bridge prerequisites**:
 ```bash
# Bun runtime used by whatsapp-rust-bridge prepare scripts
curl -fsSL https://bun.sh/install | bash -s -- bun-v1.3.9

# Rust nightly toolchain used for whatsapp-rust-bridge
curl -fsSL https://sh.rustup.rs | bash -s -- -y --default-toolchain nightly-2026-01-30
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --vers 0.14.0 --locked
```

4. Run the following commands:
```bash
# Install dependencies
yarn install
# Fetch and compile proto files
yarn gows:proto
# Run
yarn start
# open http://localhost:3000
```