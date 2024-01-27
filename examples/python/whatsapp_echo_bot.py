import random
from pprint import pprint
from time import sleep

import requests
from flask import Flask
from flask import request

app = Flask(__name__)


def send_message(chat_id, text):
    """
    Send message to chat_id.
    :param chat_id: Phone number + "@c.us" suffix - 1231231231@c.us
    :param text: Message for the recipient
    """
    # Send a text back via WhatsApp HTTP API
    response = requests.post(
        "http://localhost:3000/api/sendText",
        json={
            "chatId": chat_id,
            "text": text,
            "session": "default",
        },
    )
    response.raise_for_status()

def reply(chat_id, message_id, text):
    response = requests.post(
        "http://localhost:3000/api/reply",
        json={
            "chatId": chat_id,
            "text": text,
            "reply_to": message_id,
            "session": "default",
        },
    )
    response.raise_for_status()


def send_seen(chat_id, message_id, participant):
    response = requests.post(
        "http://localhost:3000/api/sendSeen",
        json={
            "session": "default",
            "chatId": chat_id,
            "messageId": message_id,
            "participant": participant,
        },
    )
    response.raise_for_status()

def start_typing(chat_id):
    response = requests.post(
        "http://localhost:3000/api/startTyping",
        json={
            "session": "default",
            "chatId": chat_id,
        },
    )
    response.raise_for_status()

def stop_typing(chat_id):
    response = requests.post(
        "http://localhost:3000/api/stopTyping",
        json={
            "session": "default",
            "chatId": chat_id,
        },
    )
    response.raise_for_status()

def typing(chat_id, seconds):
    start_typing(chat_id=chat_id)
    sleep(seconds)
    stop_typing(chat_id=chat_id)

@app.route("/")
def whatsapp_echo():
    return "WhatsApp Echo Bot is ready!"


@app.route("/bot", methods=["GET", "POST"])
def whatsapp_webhook():
    if request.method == "GET":
        return "WhatsApp Echo Bot is ready!"

    data = request.get_json()
    pprint(data)
    if data["event"] != "message":
        # We can't process other event yet
        return f"Unknown event {data['event']}"

    # Payload that we've got
    payload = data["payload"]
    # The text
    text = payload.get("body")
    if not text:
        # We can't process non-text messages yet
        print("No text in message")
        print(payload)
        return "OK"
    # Number in format 1231231231@c.us or @g.us for group
    chat_id = payload["from"]
    # Message ID - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    message_id = payload['id']
    # For groups - who sent the message
    participant = payload.get('participant')
    # IMPORTANT - Always send seen before sending new message
    send_seen(chat_id=chat_id, message_id=message_id, participant=participant)


    # Send a text back via WhatsApp HTTP API
    typing(chat_id=chat_id, seconds=random.random() * 3)
    send_message(chat_id=chat_id, text=text)

    # OR reply on the message
    typing(chat_id=chat_id, seconds=random.random() * 3)
    reply(chat_id=chat_id, message_id=message_id, text=text)

    # Send OK back
    return "OK"
