# WAHA Agent Playbook

This guide summarizes how to explore, modify, and validate the WhatsApp HTTP API
(WAHA) codebase when assisting as an automation or coding agent.

- When you asked to refactor or "apply new lib" instead of current one - do not
  change the behavior, make a minimum amount of changes possible. If you see
  some edge case during that process that haven't been covered - tell it,
  suggest fix, but don't change the code.

## Product & Variants

- WAHA ships in **Core** and **Plus** editions. Core lives under `src/core` and
  only supports the default session plus minimal media features. Plus extends
  core via `src/plus` to add multi-session orchestration, richer media handling,
  and external storage integrations.
- Core code must remain free from Plus-only references. A pre-commit hook
  rejects the word `plus` inside core files; reuse abstractions exposed through
  `@waha/core/**` instead of importing Plus modules from Core.
- Commit subjects are validated: changes that touch `src/plus` require a
  `[PLUS] …` prefix and must not include non-Plus files; everything else must
  use `[core] …`. Verify against `./.precommit/validate_commit_message.py` if
  unsure.

## Tech Stack Snapshot

- **Runtime**: Node.js 22.x, Yarn 3.6 (Berry). Always install packages and run
  scripts with Yarn.
- **Framework**: NestJS v11 with dependency injection, modular controllers in
  `src/api`, and Pino-based logging via `nestjs-pino`.
- **Engines**: WhatsApp engines are abstracted (`WEBJS`, `GOWS`, `NOWEB`). Core
  uses `SessionManagerCore`; Plus swaps to `SessionManagerPlus` with extra
  storage backends (Mongo/Postgres/SQLite).
- **ESM Bridge**: ESM-only dependencies (Baileys) load through
  `src/vendor/esm.ts`. Add new ESM modules there to ensure they load exactly
  once.
- **Utilities**: RxJS streams (`SwitchObservable`, `DefaultMap`) drive webhook
  event fan-out. Prefer existing helpers in `src/utils` and `src/core/utils`
  before adding bespoke logic.

## Repository Landmarks

- `src/main.ts`: runtime entry point; dynamically loads the correct AppModule
  (Core vs Plus) and configures global interceptors/filters.
- `src/api/**`: REST controllers and WebSocket gateway. Keep handlers thin;
  delegate to managers/services. HTTP routes follow `/api/{sessionName}/…`;
  always thread the session name through request DTOs and guards instead of
  hardcoding `default`.
- `src/core/**`: shared abstractions (config services, engine bootstrap,
  storage, session management). Core only allows the `default` session and
  cleans up storage on boot.
- `src/plus/**`: multi-session orchestration, advanced media services, and
  external persistence layers (Mongo, Postgres). Reuse this layer when adding
  Plus-only capabilities.
- `src/apps/**`: integrations (e.g., ChatWoot) and application-specific
  services.
- `src/structures/**` and `src/utils/**`: DTOs, enums (event names follow
  `domain.action`), helper utilities. Maintain naming consistency when
  introducing new events.
- `tests/**`: Jest-based suites; do not add new tests unless explicitly asked,
  but keep existing tests working.

## Coding Expectations

- Favor composable, long-lived solutions. If a helper already exists (e.g.,
  `parseBool`, `DefaultMap`, media factories), extend it instead of reinventing
  logic. Lodash ships with the project—prefer its utilities over hand-rolled
  helpers. Import lodash as a namespace (`import * as lodash from 'lodash';`) so
  helpers like `lodash.camelCase` stay consistent across files. When a new
  third-party library seems necessary, confirm with the user, especially if the
  package looks stale.
- Stick to NestJS patterns: inject dependencies through constructors, expose
  provider tokens from modules, and keep controllers free from business logic.
- Logging goes through injected `PinoLogger` or helpers in
  `src/utils/logging.ts`. `console.log` is blocked by pre-commit.
- Respect path aliases (`@waha/...`) defined in `tsconfig.json`; keep imports
  consistent (use absolute aliases, not relative `../../../`).
- Prefer named function declarations over `const` arrow functions when possible.
- Avoid naming unused variables with a leading underscore; if a parameter is
  required by a signature, explicitly `void` it instead.
- For configs, prefer runtime configurability over constants. Environment keys
  follow `WAHA_*` for global values and `WAHA_SESSION_CONFIG_*` /
  `session.config.*` for per-session overrides. If both env and config are
  supported, honor both (`WAHA_WEBJS_CONFIG_*` vs. `session.webjs.config.*`).

## Language & Localization

- Keep identifiers (classes, methods, variables) and code comments in English so
  the codebase stays consistent for the global team.
- Route user-visible strings through the existing i18n structure rather than
  hardcoding text. ChatWoot copy belongs in `src/apps/chatwoot/i18n` with
  English as the source locale before adding translations.

## ChatWoot Integration Notes

- Avoid introducing synthetic events; map onto existing webhook or engine events
  whenever plausible. Always use the official ChatWoot API client located in
  `src/apps/chatwoot/client`.
- When adding events, align consumer names with webhook/event identifiers (e.g.,
  `message.any`).

## Workflow Checklist

1. Identify whether work targets Core, Plus, or shared layers. If Plus-only,
   isolate changes to `src/plus` and ensure the commit prefix matches.
2. Lean on existing services/managers; extend the appropriate session manager
   rather than branching logic inline.
3. After edits run:
   - `pre-commit run --all-files`
   - `yarn build`
   - `yarn test` Use Node 22. Address lint or formatting issues before
     proceeding.
4. Do **not** start the application yourself; ask the user to run it if runtime
   validation is required.
5. Capture any assumptions or open questions for the user, especially when
   touching configs, introducing dependencies, or modifying public APIs.

## Additional Tips

- Concurrency-sensitive sections (session start/stop) rely on `async-lock`. When
  adding async flows, reuse `SessionManager.withLock` or existing retry
  utilities (`promiseTimeout`, `waitUntil`).
- Media features centralize through `MediaManager` and `MediaStorageFactory`.
  When altering media behavior, update both Core and Plus variants where
  applicable.
- Keep docs and code ASCII unless a file already uses other characters. When
  updating documentation, mirror the concise, actionable tone used here.

## Related Sources Code

You can find related source code in the following paths:

- WEBJS: `../whatsapp-web.js`
- NOWEB: `../WhiskeySockets-Baileys`
- GOWS: `../gows` + `../whatsmeow`
- ChatWoot: `../chatwoot`

Following this playbook keeps contributions aligned with WAHA’s structure,
automation hooks, and release process.
