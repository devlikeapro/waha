# WAHA original Dashboard in a private Codespace

This configuration runs the official **WAHA Core Docker image**, including its original Dashboard at /dashboard. It does not build this branch's source or use the Cloudflare preview. Core supports the default session. No Plus credentials are required.

## Start

1. Create a Codespace in helalalfqih-sketch/waha on branch codex/waha-dashboard-isolated-preview, selecting this dev container (4 CPUs / 8 GB recommended).
2. Run:
   `WAHA_TEST_NUMBER_ONLY=yes bash .devcontainer/preview/start.sh`
3. Check PORTS: port 3000 must show **Private**, never Public or Organization. Open its forwarded URL with /dashboard/.
4. Read the ignored .devcontainer/preview/runtime.env privately in the editor. Log in as preview using its generated Dashboard password, then enter its separate API key in Dashboard. Keep the API server on this Codespace's same origin. Do not add production servers.
5. Only after the smoke check passes, manually create the default session and pair **a dedicated test phone number**. Never scan with the main Index number. No automated pairing or messages are performed.

The script requires GitHub CLI access to set port 3000 private and exits before starting WAHA if that operation fails. Codespaces ports default to private, but visibility is a runtime GitHub setting, not a guarantee supplied by devcontainer.json. Recheck it after rebuilding or restarting. Start is manual; there is no automatic WAHA lifecycle command. Do not start Compose directly outside CI.

## Isolation and secrets

New random API and Dashboard secrets are generated once inside the Codespace with file mode 600. They are independent of environment variables and production secrets. Do not copy .env, session files, browser profiles, tokens, or numbers from other installations. No Codespaces secrets are required. Do not grant this Codespace production secrets.

Compose uses only the dedicated runtime.env and named test volumes. It binds Docker to loopback port 3000, disables Swagger and QR logs, and has no automatic session start, webhook, proxy, external database, Cloudflare, Whapi, or Shopify configuration. This is configuration isolation, not an outbound network firewall: once manually paired, WAHA can communicate with WhatsApp and the Dashboard can send messages. Test-number-only use is an operator requirement, not automatic phone-number enforcement.

Stop without deleting data:
`docker compose -f .devcontainer/preview/compose.json stop`

To resume, run start.sh again. Its no-sessions smoke assertion will intentionally fail after pairing; review that state manually, do not remove existing data automatically. Test sessions and secrets persist in this Codespace. Stop the Codespace when finished to avoid ongoing compute usage.

## Validation and limits

The fork-only CI checks JSON isolation, Python/shell syntax, Compose configuration, authenticated Dashboard access, rejection of unauthenticated API/Dashboard access, and absence of sessions. CI generates disposable credentials and never pairs WhatsApp. Cleanup deletes only CI-owned test volumes on the disposable runner.

The image uses the official mutable latest tag; it is not pinned or a source build. CI checks whichever image is pulled at run time. A successful CI run does not verify live Codespaces visibility, QR pairing, or messaging. These require a real Codespace and a test phone.

Existing Cloudflare files and services are untouched. No upstream PR, deployment, merge, or production connection is part of this setup.

Official references reviewed:
- https://waha.devlike.pro/docs/how-to/install/
- https://waha.devlike.pro/docs/how-to/dashboard/
- https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace
