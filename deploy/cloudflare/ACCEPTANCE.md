# Cloudflare acceptance matrix

This document tracks the requested sequence for `indexes-waha`. It is evidence,
not permission to execute a live stage. Stop at the first failure and do not
advance a blocked stage without the approval recorded for that stage.

## Status definitions

- `PASS`: executed successfully with the evidence described here.
- `FAIL`: executed and did not meet its acceptance criteria.
- `BLOCKED`: not executable safely because a prerequisite or approval is absent.
- `NOT RUN`: technically available later, but not executed yet.

No live stage has run, and there is currently no `FAIL` result.

## Matrix

| # | Stage | Status | Evidence or acceptance criterion |
|---:|---|---|---|
| 1 | Clean install | `PASS` | On 2026-10-25, `npm ci` completed in a separate copy with a fresh isolated npm cache. The installed graph resolved `undici@7.30.1`. |
| 2 | Tests | `PASS` | `npm test`: 40/40 tests passed. `npm audit --audit-level=high`: zero findings. |
| 3 | Local lifecycle tests | `PASS` | `npm run test:lifecycle`: 6/6 selected tests passed. They cover stopped start, matching-fingerprint reuse, stale-fingerprint replacement, secret/config-sensitive HMAC, the Container label limit, and bounded backoff. This is not a live Container lifecycle result. |
| 4 | GitHub CI | `BLOCKED` | Draft PR #1 has no workflow runs or commit statuses. Existing workflows either publish images or do not run for this fork/PR. The inert least-privilege template is at `ci/cloudflare-containers-ci.yml.example`; enabling it is a separate Actions change. CI must pass before merge. |
| 5 | Isolated Preview deploy | `BLOCKED` | The checked-in Wrangler config deliberately targets the existing `indexes-waha` service and must not be used as a Preview. A separately named Worker, Container app, Durable Object namespace, database, secrets, budget, and secure WAHA image require explicit approval. |
| 6 | QR pairing | `BLOCKED` | Requires the approved Preview, a dedicated test phone, separately approved secret creation, and a time-limited version with `WAHA_QR_ENABLED=true`. QR material must never enter logs, issues, CI artifacts, or this repository. |
| 7 | Chats | `NOT RUN` | Pass only for an agreed endpoint set and consenting test recipients, with send/receive/read evidence recorded as redacted request IDs and message-ID hashes. GOWS supports core list/read/edit/delete-message flows but not every chat operation. |
| 8 | Media | `BLOCKED` | Define whether acceptance means send, receive metadata, downloaded bytes, or persistence. The gateway now pins an HTTPS `WAHA_BASE_URL`, so on-demand file URLs can point back through the Worker. Automatic event download remains disabled, and no persistent media storage is configured. |
| 9 | Groups | `NOT RUN` | Use a Preview-only group with consenting members. Core GOWS group operations are supported, but unsupported/destructive operations are outside the initial test manifest. |
| 10 | Channels | `BLOCKED` | GOWS channel support is partial. Search/list/create/get, text/image/video send, receive, follow/unfollow, and mute/unmute are candidates; delete, channel-history retrieval, polls, and admin invite operations must not be claimed. |
| 11 | Status | `BLOCKED` | GOWS supports text/image/voice/video status APIs, delete, and message-ID generation. Execution still needs an approved test audience and non-sensitive assets; never publish to the production account's normal audience. |
| 12 | Webhook | `BLOCKED` | Requires an HTTPS receiver owned by the user, a Preview-only HMAC secret, an exact destination allowlist, an explicit event list, redacted retention, and a retry test. The pinned image disables outbound certificate verification and accepts HTTP/private destinations, so it cannot run this stage. GOWS also lacks events such as `message.waiting` and `chat.archive`. |
| 13 | Restart | `NOT RUN` | Preview only. Pass when a controlled Container restart returns the same session without a new QR and chat plus webhook probes succeed again within the approved recovery objective. |
| 14 | Secret rotation | `BLOCKED` | Requires approval at execution time. Stage a new Preview Worker version, verify old edge credentials fail and new credentials succeed, confirm the HMAC fingerprint replaces the Container once, and keep all values out of evidence. |
| 15 | Persistent reconnect | `NOT RUN` | Pass only when the same GOWS session reconnects from the isolated PostgreSQL store without QR after restart and rotation, then receives a new message and emits the expected webhook. |
| 16 | Controlled failure | `BLOCKED` | Preview only, with one approved failure, a time limit, maximum retries, rollback trigger, and no production resources. A receiver returning `503` is safer than disrupting production; database failure injection needs separate approval. |

## Current capability boundary

The Worker currently proxies authenticated `/api/**` except for a permanent
deny list. That is an authenticated administrative proxy, not a per-feature
endpoint allowlist. Before Preview, approve a minimal manifest for the exact
chat, media, group, channel, status, session, QR, and webhook operations to be
tested, or implement and test a narrower route allowlist. Do not call this a
full-WAHA gateway.

The proposed GOWS engine covers the core requested flows, but it is not feature
equivalent to WEBJS. Important gaps include some chat archive/delete operations,
channel delete/history/polls/admin operations, `message.waiting`, and
`chat.archive`. The authoritative matrix is the WAHA Engines documentation.
No single documented engine combines every requested chat and channel operation,
the complete event catalog, and the required persistence path:

- GOWS plus PostgreSQL is the proposed bounded manifest: core chat send/receive
  and read flows, media send/metadata, common group operations, channel
  search/list/create/send/receive/follow/mute, Status, and a named webhook event
  subset. It does not provide full chat/channel/event parity.
- NOWEB plus PostgreSQL is a candidate only if chat archive/pin or channel
  history/delete is mandatory. Its store must be enabled and its full-sync
  choice fixed before QR pairing; current documentation and source also differ
  on some channel operations, so the pinned runtime must decide the result.
- WEBJS requires Chromium and still has channel gaps. WPP has no documented
  durable storage path in the engine matrix. Neither is a proven single-engine
  replacement for this acceptance chain.

Engine selection therefore stays `BLOCKED` until the exact endpoint/event
manifest is approved. A change from GOWS must occur before pairing the isolated
test account and must repeat the clean-install and runtime matrix.

Media is also a design gap until its scope is fixed. The checked-in
`WAHA_PUBLIC_BASE_URL` is validated as an HTTPS origin and passed to WAHA as
`WAHA_BASE_URL`, so an on-demand download URL can point back through the Worker
instead of `0.0.0.0`. A Preview must replace it with its own route. Sending
media and receiving message metadata can be tested after Preview approval, but
automatic event download remains disabled. Persistent received-media bytes
require a reviewed `WAHA_MEDIA_STORAGE=POSTGRESQL` design (or another durable
store), a separate Preview database, retention rules, and new tests. Session
PostgreSQL storage does not persist media, and Cloudflare's local Container disk
is ephemeral.

## Isolated Preview design

The live `indexes-waha` service and its primary WhatsApp session are out of
scope for Preview testing. A future approved Preview must use:

- A new, explicitly approved Worker and Container app name such as
  `indexes-waha-acceptance-<ticket>`, one instance maximum, no custom domain,
  and no promotion to production.
- A separate Durable Object namespace and migration state.
- A separate PostgreSQL project or cluster, not merely another schema. WAHA
  needs `CREATE DATABASE` and creates multiple databases for sessions.
- A dedicated session alias and a WhatsApp test account unrelated to the
  primary account.
- A completely new set of Preview secrets; never copy production values.
- A user-managed HTTPS webhook receiver on an exact approved origin that
  verifies WAHA HMAC and retains
  only event type, session alias, request ID, timestamp, and hashed message ID.
- A fixed duration, cleanup time, and approved spend. Budget alerts are
  informational and are not a hard spending cap.

The planning assumption for the existing `standard-1` size is 730 hours per
month: approximately `$27.48` for memory plus disk and `$2.18` at an average
`0.05 vCPU` (10% of the available `0.5 vCPU`), or about `$29.65` before the `$5`
Workers plan, Worker/Durable Object usage, PostgreSQL, logs, egress, and tax.
No budget has been approved; a short Preview must receive its own duration and
spend approval before creation.

## Secure image prerequisite

The pinned upstream image is `linux/amd64`, but its PostgreSQL parser sets
`rejectUnauthorized: false` whenever SSL is enabled. `sslmode=require` therefore
encrypts traffic without authenticating the CA or hostname. Its webhook sender
also disables TLS certificate verification, while webhook configuration accepts
HTTP and private-network destinations without an allowlist. These are not
acceptable Preview or production defaults.

Prefer an upstream release that implements certificate validation. If an
upstream fix is unavailable and a custom image is explicitly approved:

1. Patch PostgreSQL and webhook clients to validate CA and hostname.
2. Restrict webhook destinations to the exact user-owned HTTPS origin and
   reject HTTP, private, loopback, link-local, and unapproved destinations.
3. Build and review a `linux/amd64` image, produce an SBOM, and pin its immutable
   digest in the Preview config.
4. Prove valid database and webhook certificates succeed; wrong-CA and
   wrong-hostname connections fail; and HTTP/private webhook destinations plus
   `sslmode=disable` are rejected.
5. Repeat the full clean-install, CI, Preview, restart, and persistence matrix.

Cloudflare runs the image digest in `wrangler.jsonc`; it does not build or run
WAHA application changes from this fork automatically.

## Approval record required before live stages

One explicit approval must name all of the following before Preview creation:

- Maximum spend, Preview duration, and cleanup deadline.
- Test WhatsApp account and the count of consenting recipients.
- Preview-only group, channel, and Status audience.
- Exact non-sensitive asset types, maximum sizes, and SHA-256 hashes.
- PostgreSQL project/cluster and the exact origin of the user-managed webhook
  receiver.
- Endpoint/event manifest and success criteria.
- Recovery objective, maximum retries, rollback trigger, and the single
  controlled-failure method.

Separate approvals are still required at the moment of creating or rotating
secrets, enabling QR, linking the phone, and injecting a failure.

## Rollback and evidence

Before Preview, record the prior Worker version, Container image digest, config,
and resource IDs without secret values. Stop immediately on the first failed
stage. Roll back the Preview Worker version; if it cannot recover, disable only
the Preview route and cron to stop a crash loop. Keep the isolated database only
for the approved diagnostic retention period, then request approval before
deleting Preview resources, secrets, and the linked test session.

Evidence may contain CI and version URLs, resource names, status codes, request
IDs, timestamps, asset hashes, and measured recovery duration. It must not
contain QR images, tokens, phone numbers, contact lists, message bodies, media
content, database URLs, or secret values.

## References

- [WAHA engine matrix](https://waha.devlike.pro/docs/how-to/engines/)
- [WAHA NOWEB engine](https://waha.devlike.pro/docs/engines/noweb/)
- [WAHA status API](https://waha.devlike.pro/docs/how-to/status/)
- [WAHA events and webhooks](https://waha.devlike.pro/docs/how-to/events/)
- [WAHA storage](https://waha.devlike.pro/docs/how-to/storages/)
- [Cloudflare Container pricing](https://developers.cloudflare.com/containers/platform/pricing/)
- [Cloudflare Container lifecycle](https://developers.cloudflare.com/containers/concepts/architecture/)
