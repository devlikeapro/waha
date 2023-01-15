import {WhatsappSession} from "./abc/session.abc";
import {
    Button,
    ChatRequest,
    CheckNumberStatusQuery,
    MessageContactVcardRequest,
    MessageFileRequest,
    MessageImageRequest,
    MessageLinkPreviewRequest,
    MessageLocationRequest,
    MessageReactionRequest,
    MessageReplyRequest,
    MessageTextButtonsRequest,
    MessageTextRequest
} from "../structures/chatting.dto";
import {WAMessage, WANumberExistResult} from "../structures/responses.dto";
import {create, Message, Whatsapp} from "venom-bot";
import {WAEvents, WhatsappStatus} from "../structures/enums.dto";
import {NotImplementedByEngineError} from "./exceptions";
import {MediaStorage} from "./abc/storage.abc";
import {UnprocessableEntityException} from "@nestjs/common/exceptions/unprocessable-entity.exception";
import {ConsoleLogger} from "@nestjs/common";
import {ContactQuery} from "../structures/contacts.dto";

class QR {
    private base64: string;

    save(base64) {
        this.base64 = base64.replace(/^data:image\/png;base64,/, '');
    }

    get(): Buffer {
        return Buffer.from(this.base64, "base64")
    }

}

export class WhatsappSessionVenomCore extends WhatsappSession {
    whatsapp: Whatsapp;
    private qr: QR

    public constructor(public name: string, protected storage: MediaStorage, protected log: ConsoleLogger) {
        super(name, storage, log);
        this.qr = new QR()
    }

    protected buildClient() {
        return create(this.name,
            this.getCatchQR(),
            undefined,
            {
                headless: true,
                devtools: false,
                useChrome: true,
                debug: false,
                logQR: true,
                browserArgs: this.getBrowserArgsForPuppeteer(),
                autoClose: 60000,
                puppeteerOptions: {},
                multidevice: true,
            }
        )
    }

    protected getCatchQR() {
        return (base64Qrimg, asciiQR, attempts, urlCode) => {
            this.qr.save(base64Qrimg)
            this.status = WhatsappStatus.SCAN_QR_CODE
            this.log.debug('Number of attempts to read the qrcode: ', attempts);
            this.log.log('Terminal qrcode:');
            // Log QR image in console without this.log to make it pretty
            console.log(asciiQR);
        };
    }

    async start() {
        try {
            this.whatsapp = await this.buildClient()
        } catch (error) {
            this.status = WhatsappStatus.FAILED
            this.log.error(error)
            this.qr.save("")
            return
        }

        this.status = WhatsappStatus.WORKING
        return this
    }


    stop() {
        return this.whatsapp.close()
    }

    subscribe(event: WAEvents | string, handler: (message) => void) {
        if (event === WAEvents.MESSAGE) {
            return this.whatsapp.onMessage((message: Message) => this.processIncomingMessage(message).then(handler))
        } else if (event === WAEvents.MESSAGE_ANY) {
            return this.whatsapp.onAnyMessage((message: Message) => this.processIncomingMessage(message).then(handler))
        } else if (event === WAEvents.STATE_CHANGE) {
            return this.whatsapp.onStateChange(handler)
        } else if (event === WAEvents.MESSAGE_ACK) {
            return this.whatsapp.onAck(handler)
        } else if (event === WAEvents.GROUP_JOIN) {
            return this.whatsapp.onAddedToGroup(handler)
        } else {
            throw new NotImplementedByEngineError(`Engine does not support webhook event: ${event}`)
        }
    }


    /**
     * START - Methods for API
     */
    getScreenshot(): Promise<Buffer | string> {
        if (this.status === WhatsappStatus.STARTING) {
            throw new UnprocessableEntityException(`The session is starting, please try again after few seconds`);
        } else if (this.status === WhatsappStatus.SCAN_QR_CODE) {
            return Promise.resolve(this.qr.get())
        } else if (this.status === WhatsappStatus.WORKING) {
            return this.whatsapp.page.screenshot()
        } else {
            throw new UnprocessableEntityException(`Unknown status - ${this.status}`);
        }
    }

    async checkNumberStatus(request: CheckNumberStatusQuery): Promise<WANumberExistResult> {
        try {
            return  await this.whatsapp.checkNumberStatus(this.ensureSuffix(request.phone))
        } catch (error) {
            // Catch number doesn't exist error and return it as is
            if (error.status === 404 && !error.numberExists){
                return error
            }
            throw error
        }
    }

    sendContactVCard(request: MessageContactVcardRequest) {
        return this.whatsapp.sendContactVcard(request.chatId, request.contactsId, request.name)
    }

    sendText(request: MessageTextRequest) {
        return this.whatsapp.sendText(this.ensureSuffix(request.chatId), request.text)
    }

    reply(request: MessageReplyRequest) {
        return this.whatsapp.reply(request.chatId, request.text, request.reply_to)
    }

    sendFile(request: MessageFileRequest) {
        throw new NotImplementedByEngineError()
    }

    sendImage(request: MessageImageRequest) {
        throw new NotImplementedByEngineError()
    }

    async sendVoice(request) {
        throw new NotImplementedByEngineError()
    }

    sendLinkPreview(request: MessageLinkPreviewRequest) {
        return this.whatsapp.sendLinkPreview(request.chatId, request.url, request.title)
    }

    sendLocation(request: MessageLocationRequest) {
        return this.whatsapp.sendLocation(request.chatId, String(request.latitude), String(request.longitude), request.title)
    }

    sendSeen(chat: ChatRequest) {
        return this.whatsapp.sendSeen(chat.chatId)
    }

    sendTextButtons(request: MessageTextButtonsRequest) {
        const buttons = request.buttons.map((button: Button) => {
            return {
                buttonId: button.id,
                buttonText: {
                    displayText: button.body
                }
            }
        })
        return this.whatsapp.sendButtons(this.ensureSuffix(request.chatId), request.title, buttons, request.text)
    }

    startTyping(chat: ChatRequest) {
        return this.whatsapp.startTyping(chat.chatId)
    }

    stopTyping(chat: ChatRequest) {
        return this.whatsapp.stopTyping(chat.chatId)
    }

    setReaction(request: MessageReactionRequest) {
        throw new NotImplementedByEngineError()
    }

    /**
     * END - Methods for API
     */

    protected async downloadAndDecryptMedia(message: Message) {
        if (!message.isMMS || !message.isMedia) {
            return message
        }
        // @ts-ignore
        message.mediaUrl = await this.storage.save(message.id, "", undefined)
        return message
    }

    private processIncomingMessage(message: Message) {
        return this.downloadAndDecryptMedia(message).then(this.toWAMessage)
    }

    protected toWAMessage(message: Message): Promise<WAMessage> {
        // @ts-ignore
        return Promise.resolve({
            id: message.id,
            timestamp: message.timestamp,
            from: message.from,
            fromMe: message.fromMe,
            to: message.to,
            body: message.body,
            // @ts-ignore
            hasMedia: Boolean(message.mediaUrl),
            // @ts-ignore
            mediaUrl: message.mediaUrl,
            // @ts-ignore
            ack: message.ack,
            location: undefined,
            vCards: undefined,
            _data: message,
        })
    }
}
