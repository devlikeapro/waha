"""Create independent preview secrets once, without reading production environment."""
import os
from pathlib import Path
import secrets

target = Path(__file__).with_name("runtime.env")
if target.exists():
    if target.stat().st_mode & 0o077:
        raise SystemExit("runtime.env must have mode 600")
else:
    values = {
        "WAHA_API_KEY": secrets.token_hex(32),
        "WAHA_DASHBOARD_USERNAME": "preview",
        "WAHA_DASHBOARD_PASSWORD": secrets.token_hex(32),
    }
    fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w") as stream:
        stream.write("".join(f"{key}={value}\n" for key, value in values.items()))
print("Preview secrets ready; kept only in ignored runtime.env.")
