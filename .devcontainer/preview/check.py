"""Validate the isolation contract without Docker, secrets, or network."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
config = json.loads((root / ".devcontainer/devcontainer.json").read_text())
compose = json.loads(Path(__file__).with_name("compose.json").read_text())
assert config["forwardPorts"] == [3000]
assert config["customizations"]["vscode"]["settings"]["remote.autoForwardPorts"] is False
assert set(compose["services"]) == {"waha"}
service = compose["services"]["waha"]
assert service["ports"] == ["127.0.0.1:3000:3000"]
assert service["image"] == "devlikeapro/waha:latest"
assert service["env_file"] == ["runtime.env"]
assert service["restart"] == "no"
assert service["volumes"] == ["test-sessions:/app/.sessions", "test-media:/app/.media"]
assert service["environment"]["WHATSAPP_RESTART_ALL_SESSIONS"] == "false"
assert not any("HOOK" in key or "START_SESSION" in key for key in service["environment"])
assert "runtime.env" in Path(__file__).with_name(".gitignore").read_text().splitlines()
start = Path(__file__).with_name("start.sh").read_text()
assert start.index("3000:private") < start.index("up -d")
assert "set -euo pipefail" in start
print("PASS: preview isolation configuration")
