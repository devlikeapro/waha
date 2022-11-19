import {WAEvents, WhatsappStatus} from "../../structures/enums.dto";
import {ConsoleLogger} from "@nestjs/common";
import {
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
    MessageTextRequest,
    MessageVoiceRequest
} from "../../structures/chatting.dto";
import {MediaStorage} from "./storage.abc";
import {MessageId} from "whatsapp-web.js";

export abstract class WhatsappSession {
    public status: WhatsappStatus;

    public constructor(public name: string, protected storage: MediaStorage, protected log: ConsoleLogger) {
        this.name = name
        this.status = WhatsappStatus.STARTING
        this.log = log
    }

    getBrowserExecutablePath(){
        return "/usr/bin/google-chrome-stable"
    }

    getBrowserArgsForPuppeteer() {
        // Run optimized version of Chrome
        // References:
        // https://github.com/pedroslopez/whatsapp-web.js/issues/1420
        // https://www.bannerbear.com/blog/ways-to-speed-up-puppeteer-screenshots/
        return [
            '--no-sandbox',
            '--disable-client-side-phishing-detection',
            '--disable-setuid-sandbox',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-popup-blocking',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-speech-api',
            '--hide-scrollbars',
            '--mute-audio',
            '--disable-extensions',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-default-browser-check',
            '--no-pings',
            '--password-store=basic',
            '--use-mock-keychain',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }


    /** Start the session */
    abstract start()

    /** Stop the session */
    abstract stop(): void

    /** Subscribe the handler to specific hook */
    abstract subscribe(hook: WAEvents | string, handler: (message) => void)

    /**
     * START - Methods for API
     */
    abstract getScreenshot(): Promise<Buffer | string>

    abstract checkNumberStatus(request: CheckNumberStatusQuery)

    abstract sendText(request: MessageTextRequest)

    abstract sendContactVCard(request: MessageContactVcardRequest)

    abstract sendTextButtons(request: MessageTextButtonsRequest)

    abstract sendLocation(request: MessageLocationRequest)

    abstract sendLinkPreview(request: MessageLinkPreviewRequest)

    abstract sendImage(request: MessageImageRequest)

    abstract sendFile(request: MessageFileRequest)

    abstract sendVoice(request: MessageVoiceRequest)

    abstract reply(request: MessageReplyRequest)

    abstract sendSeen(chat: ChatRequest)

    abstract startTyping(chat: ChatRequest)

    abstract stopTyping(chat: ChatRequest)

    abstract setReaction(request: MessageReactionRequest)

    /**
     * END - Methods for API
     */

    /**
     * Add WhatsApp suffix (@c.us) to the phone number if it doesn't have it yet
     * @param phone
     */
    protected ensureSuffix(phone) {
        const suffix = "@c.us"
        if (phone.includes("@")) {
            return phone
        }
        return phone + suffix
    }

    protected deserializeId(messageId: string): MessageId {
        const parts = messageId.split("_")
        return {
            "fromMe": parts[0] === "true",
            "remote": parts[1],
            "id": parts[2],
            "_serialized": messageId
        }
    }

}


