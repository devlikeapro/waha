#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
: "${CODESPACE_NAME:?Run inside the intended GitHub Codespace}"
if [[ "${WAHA_TEST_NUMBER_ONLY:-}" != "yes" ]]; then
  echo 'Confirm test-number-only use: WAHA_TEST_NUMBER_ONLY=yes bash .devcontainer/preview/start.sh'
  exit 1
fi
python3 check.py
python3 init.py
# Fail closed: WAHA is not started if the private-port operation fails.
gh codespace ports visibility 3000:private -c "$CODESPACE_NAME"
docker compose -f compose.json config --quiet
docker compose -f compose.json up -d
python3 smoke.py
echo 'Open port 3000 /dashboard. Verify PORTS shows Private before logging in.'
