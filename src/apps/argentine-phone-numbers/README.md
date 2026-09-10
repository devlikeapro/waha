# Argentine Phone Numbers

Opt-in outbound phone resolution for Argentina. An integration can supply
`5411XXXXXXXX` or `54911XXXXXXXX`; the app asks WhatsApp for the supplied
number first and only tries the alternate after an explicit `numberExists: false`.
The returned phone JID or LID is used as the destination for a single send.

This uses the session plugin architecture introduced alongside
[Brazilian Phone Numbers](https://github.com/devlikeapro/waha/pull/2180).
It does not assume that the two variants identify the same account.

## Enable

Set `WAHA_APPS_ENABLED=True`. If filtering apps with `WAHA_APPS_ON`, include
`argentine-phone-numbers`. Restart WAHA, then create the app through the Apps API:

```http
POST /api/apps
Content-Type: application/json
```

```json
{
  "app": "argentine-phone-numbers",
  "session": "default",
  "id": "argentine_default",
  "config": {
    "lookup": true,
    "strict": false,
    "memoryTtl": "24h"
  }
}
```

Only one enabled instance is allowed per session. Disabling the app restores
normal engine behavior. App configuration changes rebuild its plugin.

## Behavior

- Accepts international geographic phone numbers: `54` + ten national digits,
  or `549` + ten national digits, with optional `+`, `@c.us` or
  `@s.whatsapp.net`. Geographic prefixes start with 1, 2 or 3. This is a shape
  check, not proof that a number or area code is assigned.
- Works beyond Buenos Aires, including three- and four-digit area codes.
- Does not parse local `011`, `15`, missing-country forms, non-geographic
  numbers, device-qualified JIDs, groups, broadcasts, newsletters or LIDs.
- Resolves message-send chat targets only. Mentions, typing, read receipts,
  call rejection, deletion and group administration are unchanged.
- Preserves the supplied number when a lookup fails or yields an incomplete
  answer. Network errors do not trigger alternate-number routing or caching.
- `strict: true` returns 422 only when both variants explicitly report absence.
  False negatives from WhatsApp can therefore reject a valid destination.
  By default, the original destination is retained.
- Successful lookups are cached for `memoryTtl`; confirmed negatives for 60s.
  Cache entries and concurrent lookups are keyed by the exact input digits,
  never by the pair. The cache is per plugin/session and is not persisted.
- `lookup: false` uses cached resolutions only and otherwise keeps the input.
- No local-contact shortcut for the alternate: knowing that the alternate
  exists does not prove the original is absent.

## Validation

```sh
yarn test:unit --runInBand argentine-phone-numbers
yarn tsc --noEmit
```

Unit tests exercise the real hook registration with a stubbed WhatsApp lookup.
They do not establish delivery behavior for real Argentine accounts.

Before claiming live engine coverage, record the WAHA version and engine,
query both forms of an authorized test number using `checkNumberStatus`, and
compare the returned identifiers. Then test one controlled send with the app
disabled and enabled, checking recipient delivery (not just HTTP success).
Repeat for GOWS, NOWEB, WEBJS and WPP as available. Keep personal numbers and
session credentials out of fixtures and public logs.

### Live GOWS validation — 2026-09-10

Validated the compiled plugin from commit `51c0039` against a real paired
WAHA `2026.8.2` Core / GOWS session on Linux x64, using an authorized Argentine
test recipient. The plugin ran in a local harness with real `SessionHooks` and
`RegisterPluginHooks`; its `checkNumberStatus` adapter called the remote WAHA
API, and the resolved target was passed to that same session's `sendText` API.
The app was not installed into the running worker. This verifies the resolver
with real GOWS lookups and delivery, not the deployed app's lifecycle wiring.

| Case | Result |
| --- | --- |
| Lookup with `54911…` | Exists; returns a LID and canonical `54911…@c.us` PN |
| Lookup with `5411…` | Exists; returns the same LID and canonical PN |
| Direct send to `5411…@c.us`, without plugin | HTTP 500: `no LID found for 5411…@s.whatsapp.net from server` |
| Plugin resolves `5411…`, then send | HTTP 201; message subsequently has `ack=2`, `ackName=DEVICE` |
| Plugin resolves `54911…`, then send | HTTP 201; message subsequently has `ack=2`, `ackName=DEVICE` |
| Repeat resolution of the same input | Cache hit; zero additional lookup calls |

The real failure was not a negative existence lookup: GOWS could resolve the
phone through `checkNumberStatus` but could not send to the original noncanonical
JID directly. Using the returned PN corrected the destination. The alternate
candidate fallback remains covered by unit tests, not this real recipient.
No live WEBJS, NOWEB or WPP coverage is claimed. Personal identifiers and raw
responses are intentionally omitted.
