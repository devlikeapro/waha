from pprint import pprint

import requests
from flask import Flask
from flask import request

app = Flask(__name__)


@app.route("/")
def whatsapp_echo():
    return "WhatsApp Echo server is ready!"


@app.route("/message", methods=["GET", "POST"])
def whatsapp_webhook():
    data = request.get_json()
    pprint(data)
    # The text
    body = data['body']
    # Number in format 791111111@c.us
    from_ = data['from']
    # Send a text back via WhatsApp HTTP API
    response = requests.post('http://localhost:3000/api/sendText', json={
        "chatId": from_,
        "text": body
    })
    response.raise_for_status()
    return "OK"
