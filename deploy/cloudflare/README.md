# WAHA on Cloudflare Containers

This directory prepares the existing `indexes-waha` Worker and Container for a
reviewed deployment. It does not deploy anything by itself.

## Current target

- Cloudflare account: `34dad04466d97745f2c9f8214c81c0f2`
- Existing Worker and Container application: `indexes-waha`
- Existing application ID: `a031b602-91b4-4a58-a888-ce838b7713e5`
- Public route: `https://indexes-waha.helalalfqih.workers.dev`
- Image: `devlikeapro/waha` pinned to digest
  `sha256:ecadb467ff9af107e7c235a955cab99ef5a1c13656cbc78aeb3e6b4d30fae7e4`
- Instance: `standard-1` (`0.5 vCPU`, `4 GiB`, `8 GB`), one instance maximum

The pinned manifest was checked directly in Docker Hub and is `linux/amd64`,
which is the architecture Cloudflare Containers requires.

This configuration runs the pinned upstream image; it does not build the WAHA
application source in this fork. The files in this directory add the Cloudflare
gateway and deployment configuration only. If a future change modifies WAHA
itself, build and review a separate image, pin its digest here, and repeat the
runtime acceptance test before rollout.

The current endpoint returned Cloudflare `403 / 1010` to an unauthenticated
probe. That confirms an edge block, not WAHA readiness. No WhatsApp session,
PostgreSQL connection, message delivery, or restart recovery has been verified.

## Design

The Worker authenticates requests before resolving the Durable Object, so a
bad request cannot wake a Container. It uses one fixed Durable Object name and
`max_instances: 1` to avoid request-controlled instance creation.
The fixed name is `default`, matching the live Worker's existing
`env.WAHA.getByName("default")` calls; changing it would address a different
Durable Object.

Only these routes are reachable:

- `GET /healthz`: Worker liveness only; never starts the Container.
- Authenticated `GET /readyz`: starts or reconnects the Container and returns
  only `ready` or `not_ready`.
- Authenticated `/health` and `/api/**`, except the permanent deny list.
- `/api/{session}/auth/qr` additionally requires the separate
  `WAHA_QR_TOKEN` and `WAHA_QR_ENABLED=true`. The flag defaults to `false`, so
  the route remains a `404` outside an approved pairing deployment.

The permanent deny list includes the Dashboard, Swagger, WebSocket, MCP, jobs,
metrics, screenshots, server environment, server debug, and server stop routes.
Inbound edge credentials are removed before the Worker injects the separate
WAHA API key. Responses are `no-store` and do not expose cookies, CORS, or
server-identifying headers. Explicit, unrelated passwords are also supplied for
the disabled Dashboard and Swagger so upstream WAHA does not generate and print
credentials during startup. The edge, upstream, QR, Dashboard, and Swagger
credentials must all be different. `WAHA_API_KEY` must be the plaintext
high-entropy key used in the request header, not a `sha512:` value; the WAHA
entrypoint replaces it with a SHA-512 digest before Node starts.

The PostgreSQL URL must include `sslmode=require`; an unencrypted DSN fails
closed. The pinned upstream WAHA parser nevertheless sets
`rejectUnauthorized: false` for every enabled SSL mode, so it encrypts the
connection but does not authenticate the database certificate or hostname.
Even `verify-ca` and `verify-full` do not change that behavior in this image and
are rejected here to avoid a false assurance. Full certificate verification
requires a reviewed upstream fix or custom WAHA image.

The Container uses GOWS and PostgreSQL session storage. GOWS writes live auth
state to PostgreSQL; WEBJS and WPP remote auth use periodic snapshots and can
lose recent state. Local disk is still ephemeral, so automatic media downloads
are disabled. Cloudflare Container snapshots are not used as session storage.

### Engine scope

The live application did not expose a `WHATSAPP_DEFAULT_ENGINE` variable name,
so it currently falls back to WEBJS. This proposal deliberately changes it to
GOWS for direct PostgreSQL-backed auth state and substantially lower browser
overhead. That choice needs approval before deployment.

GOWS is not a drop-in implementation of every browser-backed WAHA feature. It
supports the main message, reaction, acknowledgement, edit, revoke, chats,
groups, contacts, and webhook flows, but the WAHA feature matrices show gaps.
For example, `message.waiting`, contact “about”, contact block/unblock, browser
screenshots, and some browser-specific message types are unavailable. The
gateway exposes authenticated `/api/**`; it does not emulate unsupported GOWS
operations. Confirm every endpoint and event required by the integration
against the WAHA engine tables before approving this engine change. If a
browser-only feature is mandatory, revisit WEBJS together with its higher
resource use and snapshot/recovery trade-off.

The Worker labels a started Container with an opaque HMAC fingerprint of its
runtime revision and Container secrets. The fingerprint changes when the WAHA
key or database URL changes without placing either value in a label. On the
first readiness check after this proposal is deployed, the currently running
unlabelled Container is deliberately replaced so the GOWS, database, and
security environment takes effect. This causes an interruption and is one
reason deployment requires an approved rollout window. Increment
`WAHA_CONFIG_REVISION` for future non-secret runtime-setting changes.

The configured five-minute Worker schedule checks readiness and restarts the
Container after a platform stop once this Worker code is deployed. A
fifteen-minute Durable Object alarm is a fallback if scheduled events are
delayed, with bounded backoff on repeated failures. The Container inactivity
timeout is six hours. This reduces downtime but does not guarantee
uninterrupted WhatsApp delivery. Cloudflare can stop a Container for a host
restart or rollout, and missed webhook delivery is not guaranteed.

## Local validation

Docker is required only for a full `wrangler dev` Container test.

```bash
cd deploy/cloudflare
npm ci
npm test
npm run typecheck
npm run cf:types
npm run cf:dry-run
```

The `pretypecheck` hook generates the ignored `worker-configuration.d.ts` from
`wrangler.jsonc`; `npm run cf:types` then verifies that it is current.

`wrangler@4.152.0` currently reaches `undici@7.29.1` through Miniflare. The
package override resolves it to `7.30.1`, the patched 7.x release for the three
October 2026 advisories. This is development tooling and is not bundled into the
deployed Worker, but the override keeps clean installs and `npm audit` clean.
Re-test before removing it when Wrangler's dependency graph advances.

Create `.dev.vars` from `.dev.vars.example` only for local testing. Empty or
short credentials fail closed. Never commit `.dev.vars` or paste secrets into
commands, logs, issues, or pull requests.

## Deployment gates

Do not run `wrangler deploy` until all of these have explicit approval:

1. Confirm Workers Paid in the Cloudflare dashboard. The available OAuth
   connection can read Workers and Containers but Billing Read returned `403`.
2. Approve a monthly usage budget. At 730 always-on hours, `standard-1` costs
   about `$27.48` for memory and disk plus about `$2.18` at 10% average CPU.
   This excludes the `$5` Workers plan and Worker, Durable Object, database,
   logging, egress, and tax charges. Budget alerts do not cap spend.
3. Approve a separate rotation of the current Worker and database credentials.
   An authorized Cloudflare application read included existing environment
   values in the connector response. No value was copied or used, and this is
   not evidence that an unauthorized party accessed them; rotation is a
   precaution because the values appeared in tool output.
4. Verify the PostgreSQL provider supports encrypted TLS, outbound Cloudflare
   access, enough connections, and `CREATE DATABASE`. Include
   `sslmode=require`; WAHA creates a main database and a database per session.
5. Decide whether encrypted-but-unverified database TLS is acceptable for the
   initial rollout or require a reviewed custom image that validates the CA and
   hostname. Do not describe the pinned upstream image as certificate-verified.
6. During the approved rollout window, stage distinct `ADMIN_TOKEN`, plaintext
   `WAHA_API_KEY`, `WAHA_QR_TOKEN`, `WAHA_DISABLED_DASHBOARD_PASSWORD`,
   `WAHA_DISABLED_SWAGGER_PASSWORD`, and
   `WHATSAPP_SESSIONS_POSTGRESQL_URL` values with interactive
   `wrangler versions secret put` prompts. Unlike `wrangler secret put`, the
   versions form does not immediately deploy the new Worker version. Keep
   `WAHA_QR_ENABLED=false` except in a separately reviewed pairing version.
7. Re-read the live Worker, Container application, image digest, routes, and
   secret names immediately before deployment. Do not create a second app.
8. Re-read the live Worker source and confirm it still uses the `default`
   Durable Object identity pinned by this proposal. Do not deploy if it changed.
9. Approve the rollout window and rollback plan. The first readiness check will
   replace the old unlabelled Container, and a Containers deployment is not
   transactional: Worker code becomes live before the image rollout finishes.

## Runtime acceptance test

Deployment is not proof of session durability. Before declaring success:

1. Confirm `/healthz` without credentials and `/readyz` with the edge token.
2. Link a test WhatsApp account through the guarded QR route.
3. Send and receive a test message and verify the intended webhook.
4. Request a controlled `SIGTERM`/restart during an approved window.
5. Verify that GOWS restores the same session from PostgreSQL without a new QR.
6. Send and receive again after restart, and record any delivery gap.
7. Confirm the Dashboard, Swagger, environment, debug, stop, screenshot, and QR
   routes remain unavailable outside their intended policy.

Until that test passes, do not claim uninterrupted reception or durable session
recovery.

## References

- [Cloudflare Containers API](https://developers.cloudflare.com/containers/api/)
- [Container lifecycle](https://developers.cloudflare.com/containers/concepts/architecture/)
- [Container pricing](https://developers.cloudflare.com/containers/platform/pricing/)
- [Container limits](https://developers.cloudflare.com/containers/platform/limits/)
- [WAHA storage](https://waha.devlike.pro/docs/how-to/storages/)
- [WAHA engines](https://waha.devlike.pro/docs/how-to/engines/)
- [GOWS engine](https://waha.devlike.pro/docs/engines/gows/)
- [WAHA receive-message feature matrix](https://waha.devlike.pro/docs/how-to/receive-messages/)
- [WAHA contacts feature matrix](https://waha.devlike.pro/docs/how-to/contacts/)
- [WAHA security](https://waha.devlike.pro/docs/how-to/security/)
- [Undici EventSource advisory](https://github.com/nodejs/undici/security/advisories/GHSA-4qv8-2p9j-2685)
- [Cloudflare Workers SDK dependency issue](https://github.com/cloudflare/workers-sdk/issues/15007)
