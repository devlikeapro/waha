# WAHA (WhatsApp HTTP API) - Gemini Context

## Project Overview
**WAHA** (WhatsApp HTTP API) is a comprehensive REST API wrapper for WhatsApp, designed to allow programmatic interaction with WhatsApp accounts. It abstracts the complexity of automating WhatsApp behind a standard HTTP interface.

The project is built using **NestJS** and supports multiple underlying engines to communicate with WhatsApp, including:
- **WEBJS:** Uses `whatsapp-web.js` (Puppeteer/Chrome-based).
- **NOWEB:** Uses `@adiwajshing/baileys` (WebSocket-based, no browser required).
- **GOWS:** A Go-based WhatsApp server implementation (likely integrated via binary/proto).

## Tech Stack
- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Language:** TypeScript
- **Package Manager:** Yarn (v4.x)
- **Engines:** `whatsapp-web.js`, `@adiwajshing/baileys`, `libsignal`
- **Database/Storage:** SQLite (`better-sqlite3`), MongoDB, PostgreSQL, Knex.
- **Testing:** Jest (Unit & E2E).
- **Linting/Formatting:** Oxlint, Prettier.
- **Containerization:** Docker (primary distribution channel).

## Key Directories
- **`src/api`**: Contains NestJS Controllers defining the REST API endpoints (e.g., `sessions.controller.ts`, `chatting.controller.ts`).
- **`src/core`**: Core business logic, configuration services, authentication (`auth`), media handling, and storage abstractions.
- **`src/apps`**: Manages the different underlying engines/apps.
- **`src/structures`**: DTOs (Data Transfer Objects) and TypeScript interfaces for API requests/responses.
- **`src/nestjs`**: Custom NestJS filters, interceptors, and pipes.
- **`examples`**: Example files for testing media sending.
- **`docker-compose`**: Docker Compose configurations for various setups.

## Building and Running

### Prerequisites
- Node.js >= 22 (check `.nvmrc`)
- Yarn
- Docker (optional, but recommended for production)

### Development Commands
```bash
# Install dependencies
yarn install

# Fetch and compile proto files (Required for GOWS engine integration)
yarn gows:proto

# Run in development mode (Watch mode)
yarn start:dev

# Run in debug mode
yarn start:debug

# Run unit tests
yarn test

# Run End-to-End tests
yarn test:e2e
```

### Docker Builds (via Makefile)
The project uses a `Makefile` to simplify Docker builds:
- `make build`: Standard build (`devlikeapro/waha`).
- `make build-plus`: Build the "Plus" version.
- `make build-noweb`: Build with the `NOWEB` engine (no browser).
- `make build-gows`: Build with the `GOWS` engine.

## Development Conventions
- **Architecture:** Follows standard NestJS modular architecture (Modules, Controllers, Providers).
- **Configuration:** heavily relies on environment variables and `ConfigService`. Custom config files like `waha.config.json` are used for external dependencies.
- **Validation:** Uses `class-validator` and DTOs in `src/structures` to validate incoming requests.
- **Logging:** Uses `nestjs-pino` for structured logging.
- **Authentication:** Supports API Key and Basic Auth, handled in `src/core/auth`.
