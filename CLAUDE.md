# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

WAHA (WhatsApp HTTP API) - a NestJS REST API that wraps WhatsApp behind HTTP endpoints. Supports multiple WhatsApp engines: **WEBJS** (whatsapp-web.js/Puppeteer), **NOWEB** (Baileys/WebSocket), and **GOWS** (Go binary via gRPC/proto). Distributed as Docker images.

## Commands

```bash
# Development
yarn install
yarn start:dev          # watch mode
yarn start:debug        # debug mode
yarn gows:proto         # fetch + compile proto files (required for GOWS engine)

# Testing
yarn test:unit          # unit tests only
yarn test:e2e           # end-to-end tests
yarn test:all           # both

# Quality
yarn lint               # oxlint
yarn format             # prettier

# Docker (via Makefile)
make build              # core image
make build-plus         # plus version
make build-noweb        # NOWEB engine only
make build-gows         # GOWS engine only
```

Node 24.11 (see `.nvmrc`), Yarn 4.9.2.

## Architecture

NestJS monorepo with three projects (see `nest-cli.json`):
- **waha** (root `src/`) - main API server
- **smart-bot** (`apps/smart-bot/`) - conversational AI worker (Drizzle ORM, BullMQ)
- **shared** (`libs/shared/`) - shared DTOs between projects

### Main Application Layout (`src/`)

- `api/` - 23 REST controllers (sessions, chatting, chats, groups, contacts, media, etc.)
- `core/` - business logic: engines, auth (CASL-based), storage abstractions, media handling, scheduler, session manager
- `core/engines/` - engine implementations behind abstract `WhatsappSession` base class
- `structures/` - DTOs with `class-validator` decorators for request/response validation
- `apps/` - optional feature modules (chatwoot integration, calls, app SDK)
- `nestjs/` - custom filters, interceptors, guards
- `config.service.ts` - global config from environment variables

### Key Patterns

- **Session-scoped**: all WhatsApp operations are scoped to a named session (one session = one WhatsApp account)
- **Engine abstraction**: `WhatsappSession` abstract class in `src/core/abc/` with per-engine implementations
- **Dynamic module loading**: `main.ts` loads Core vs Plus app module based on build variant
- **Storage backends**: pluggable via factories - Local/S3/PostgreSQL for media, SQLite/MongoDB/PostgreSQL for sessions
- **Auth**: API Key (header) + Basic Auth (dashboard) + Passport/JWT; authorization via CASL policies

### TypeScript Path Aliases

```
@waha/*      -> src/*
@waha/shared -> libs/shared/src/*
```

## Pre-commit Hooks

These hooks run automatically and will reject commits that violate them:

1. **No "plus" references in core** - files in `src/api/`, `src/core/`, `src/structures/`, and `src/config.service.ts` must not contain the string "plus". The codebase has a Core/Plus split; core code cannot reference plus.
2. **No `console.log()`** - use the Pino logger (`nestjs-pino`) instead.
3. **oxlint** - runs with `--deny-warnings` (warnings are errors).
4. **Prettier** - auto-formats on commit.
5. **Commit message validation** - when `src/plus/` files are changed, commit messages must follow a specific format.

## Monorepo Boundaries (ESLint)

Enforced via `eslint-plugin-boundaries`:
- **Apps cannot import other apps** (e.g., smart-bot cannot import from waha src)
- **Libs cannot import apps** (shared lib must stay independent)
- Apps can import libs

## Environment

Key env vars (see `.env.example`): `WHATSAPP_DEFAULT_ENGINE`, `WAHA_API_KEY`, `WHATSAPP_API_PORT` (default 3000), `WAHA_LOG_FORMAT` (JSON/PRETTY), media/session storage backends. The `ConfigService` at `src/config.service.ts` centralizes all env var access.

## Docker

Multi-stage Dockerfile. Main service on port 3000, smart-bot on 3001, vision-worker (Python/FastAPI) on 8000. Full stack via `docker-compose.yaml` includes PostgreSQL, Redis, MinIO.
