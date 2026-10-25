"""Read-only local smoke checks; never create sessions or send messages."""
import base64
from pathlib import Path
import time
import urllib.error
import urllib.request

values = dict(line.split("=", 1) for line in Path(__file__).with_name("runtime.env").read_text().splitlines())
base = "http://127.0.0.1:3000"

def status(path, headers=None):
    try:
        with urllib.request.urlopen(urllib.request.Request(base + path, headers=headers or {}), timeout=5) as response:
            return response.status
    except urllib.error.HTTPError as error:
        return error.code

for attempt in range(60):
    try:
        if status("/api/sessions") == 401:
            break
    except (OSError, TimeoutError):
        pass
    time.sleep(2)
else:
    raise SystemExit("WAHA did not become ready with API authentication enabled")

assert status("/dashboard/") == 401, "Dashboard must require authentication"
token = base64.b64encode((values["WAHA_DASHBOARD_USERNAME"] + ":" + values["WAHA_DASHBOARD_PASSWORD"]).encode()).decode()
assert status("/dashboard/", {"Authorization": "Basic " + token}) == 200
request = urllib.request.Request(base + "/api/sessions?all=true", headers={"X-Api-Key": values["WAHA_API_KEY"]})
with urllib.request.urlopen(request, timeout=10) as response:
    import json
    assert json.load(response) == [], "Expected no sessions; use fresh test volumes"
print("PASS: API and Dashboard protected, authenticated Dashboard available, no sessions.")
