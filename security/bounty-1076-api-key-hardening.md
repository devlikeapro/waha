# WAHA API Key Hardening — Issue #1076

Context: Bug bounty offering 1,000 USDT for a reproducible bypass of
`WAHA_API_KEY` validation leading to sending messages or listing sessions.
Conditions: default install, `WAHA_API_KEY` is SHA-512 of random UUIDv4,
HTTPS only, `devlikeapro/waha` image, no prior key knowledge.

This checklist is the recommended secure baseline while the bounty is open.
No payment, submission, or contact is performed by this patch.

## Required configuration

1. Set a high-entropy key (do not use default/empty):

```bash
# generate: SHA-512 of random UUIDv4
UUID=$(cat /proc/sys/kernel/random/uuid)
echo -n "$UUID" | sha512sum | awk '{print $1}'
# then export in .env / compose:
# WAHA_API_KEY=<sha512-hex-output>
```

2. Enforce HTTPS at the reverse proxy (per install guide). Do not expose
   plain HTTP to the internet. Example: terminate TLS in nginx/caddy/traefik
   and deny port 80 WAN access.

3. Verify unauthenticated access is denied:

```bash
BASE=https://localhost
# should be 401 without key
curl -sk -o /dev/null -w "%{http_code}\n" "$BASE/api/sessions"
# should be 200 with key
curl -sk -o /dev/null -w "%{http_code}\n" -H "X-Api-Key: $WAHA_API_KEY" "$BASE/api/sessions"
```

## Audit pointers (`src/core/auth`)

- Ensure every controller uses the API-key guard by default; allowlist only
  health/readiness, never `/api/sessions` or send-message routes.
- Accept key from a single canonical source (`X-Api-Key` header).
- Use constant-time comparison and uniform 401 responses.
- Do not log the key; do not echo it in errors or Swagger examples.

## Responsible testing
