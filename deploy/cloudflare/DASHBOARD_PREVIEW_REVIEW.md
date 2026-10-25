# Isolated WAHA Dashboard Preview — review gate

Status: **DESIGN ONLY / NOT DEPLOYED**. Branch: `codex/waha-dashboard-isolated-preview`.
This branch must not be deployed with the production `deploy/cloudflare/wrangler.jsonc`, which targets the existing `indexes-waha` application.

## Intended result

Open the upstream WAHA Dashboard at `/dashboard/` from an isolated Preview hostname after signing in through Cloudflare Access. The preview must have its **own** Worker, Container application, Durable Object namespace, PostgreSQL project/cluster, session, credentials and test phone. No production WhatsApp, Whapi, Shopify or existing WAHA session is touched.

## Verified source behavior

- Upstream `src/modules/waha-dashboard/dashboard.module.ts` serves static assets under `/dashboard` and optionally enforces HTTP Basic Auth.
- `src/modules/waha-dashboard/dashboard.config.ts` uses `WAHA_DASHBOARD_ENABLED`, `WAHA_DASHBOARD_USERNAME`, and `WAHA_DASHBOARD_PASSWORD`.
- Existing `src/policy.ts` blocks `/dashboard`; existing `src/gateway.ts` sets `WAHA_DASHBOARD_ENABLED=False` and requires a Bearer token on `/api/**`. Enabling upstream Dashboard alone will **not** produce a functional browser UI.
- Cloudflare Access can protect a `workers.dev` hostname or path; Access policy enforcement must be tested on the actual Preview URL.

## Implementation requirements (not yet implemented)

1. Separate `wrangler.preview.jsonc` with unique Worker/app name, fresh DO namespace, separate HTTPS origin, preview-only vars, no production routes, and a dedicated account preflight. No inherited production secrets or state. Avoid default cron until explicitly needed.
2. Add `WAHA_DASHBOARD_ENABLED` defaulting to `false` and a separate dashboard-only credential. Never reuse `ADMIN_TOKEN` or `WAHA_API_KEY`.
3. Keep production gateway behavior unchanged. In Preview only, allow strictly `GET/HEAD /dashboard` and `/dashboard/**` static resources after verifying a Cloudflare Access identity token. No query-string credentials, untrusted redirects, or broad wildcard path proxy.
4. Dashboard API calls need an explicit browser-safe authentication design. Current gateway strips cookies and requires a Bearer token on `/api/**`, so simply allowing dashboard HTML is insufficient. Prefer a narrowly scoped backend-for-frontend session after verified Access JWT; never embed or return upstream API keys to JavaScript or store them in browser localStorage. Restrict session-management and send operations separately; require explicit approval for writes.
5. Keep `/swagger`, `/mcp`, `/ws`, `/api/server/environment`, `/api/server/debug`, `/api/server/stop`, screenshot, jobs and metrics denied. QR remains disabled except for a separately approved time-limited pairing stage. Test encoded-path/case/dot-segment bypasses.
6. Preserve `Cache-Control: no-store`, strict CSP for dashboard assets (compatible with upstream bundle), frame protection, no credential leakage in redirects or logs, and no unauthenticated container wake-ups.
7. Resolve upstream PostgreSQL TLS hostname/certificate verification and webhook destination TLS/SSRF constraints before any live preview. Do not use the current pinned image for live pairing without this gate.
8. Add tests: anonymous/expired/wrong-audience Access JWT rejected, static assets load for authorized user, dashboard API calls work without exposing upstream keys, API permissions cannot escalate, QR off by default, forbidden endpoints denied, restart and reconnect.

## Cost and approval gates

The current `standard-1` reference estimate is about **USD 29.65/month** for an always-on container at 10% average CPU, **not** a Preview quote. It excludes Workers plan, Worker/DO requests, database, logs, egress and taxes. Actual cost depends on duration and measured usage. Budget alerts are not hard caps.

Before any resource creation, present a fixed Preview duration, proposed maximum budget and cleanup time for approval. Confirm Cloudflare Workers Paid and the database provider costs. The existing service is already running and is **not** the isolated Preview.

## Acceptance

1. CI passes on the Preview branch.
2. Access login required; unauthorized requests never reach WAHA.
3. Authenticated dashboard HTML/assets and session list render on a real mobile browser.
4. No keys, tokens, phone numbers, QR images or message bodies in logs/CI artifacts.
5. Separate test phone QR pairing only after approval.
6. Send/receive, media, groups, channels, status, webhooks, restart, rotation and reconnect tested against the approved feature matrix.
7. Stop on first failure; retain Whapi until the complete migration criteria pass.

## Links

- [Cloudflare Access for Workers](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)
- [WAHA Dashboard](https://waha.devlike.pro/docs/how-to/dashboard/)
- [WAHA engines](https://waha.devlike.pro/docs/how-to/engines/)
- [Cloudflare Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/)
