from pprint import pprint

import requests
from flask import Flask
from flask import request

app = Flask(__name__)


@app.route("/")
def whatsapp_echo():
    return "WhatsApp HTTP API Echo server is ready!"


@app.route("/message", methods=["GET", "POST"])
def whatsapp_webhook():
    data = request.get_json()
    if not data:
        return "WhatsApp HTTP API Echo server is ready!"
    pprint(data)
    if data['event'] != "message":
        return f"Unknown event {data['event']}"

    payload = data["payload"]
    # The text
    text = payload["body"]
    # Number in format 791111111@c.us
    from_ = payload["from"]

    if payload.get("mediaUrl", None):
        # Download file and set text to path
        client_url = payload["mediaUrl"]
        filename = client_url.split("/")[-1]
        path = "/tmp/" + filename
        r = requests.get(client_url)
        open(path, "wb").write(r.content)
        text = f"We have downloaded file here: {path}"

    # Send a text back via WhatsApp HTTP API
    response = requests.post(
        "http://localhost:3000/api/sendText", json={"chatId": from_, "text": text}
    )
    response.raise_for_status()
    return "OK"
