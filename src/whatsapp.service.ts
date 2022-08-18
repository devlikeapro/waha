import {create, Message, Whatsapp} from "venom-bot";
import {ConsoleLogger, Injectable, OnApplicationShutdown} from "@nestjs/common";
import * as path from "path";
import {WhatsappConfigService} from "./config.service";
import request = require('requestretry');
import mime = require('mime-types');
import fs = require('fs');
import del = require("del");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {promisify} = require('util')
const writeFileAsync = promisify(fs.writeFile)


const SECOND = 1000;

const ONMESSAGE_HOOK = "onMessage"
const HOOKS = [
    ONMESSAGE_HOOK,
    "onStateChange",
    "onAck",
    // TODO: IMPLEMENTED THESE TOO
    // "onLiveLocation",
    // "onParticipantsChanged",
    "onAddedToGroup"
]
const ENV_PREFIX = "WHATSAPP_HOOK_"


export class WhatsappService {
    readonly filesFolder: string
    readonly mimetypes: string[] | null
    readonly filesLifetime: number
    private RETRY_DELAY = 15
    private RETRY_ATTEMPTS = 3;
    private log: ConsoleLogger;

    constructor(
        public whatsapp: Whatsapp,
        private config: WhatsappConfigService,
    ) {
        this.log = new ConsoleLogger()
        this.log.setContext('WhatsappService')
        this.filesFolder = this.config.filesFolder
        this.mimetypes = this.config.mimetypes
        this.filesLifetime = this.config.filesLifetime * SECOND

        this.log.log('Configuring webhooks...')
        for (const hook of HOOKS) {
            const env_name = ENV_PREFIX + hook.toUpperCase()
            const url = config.get(env_name)
            if (!url) {
                this.log.log(`Hook '${hook}' is disabled. Set ${env_name} environment variable to url if you want to enabled it.`)
                continue
            }

            if (hook === ONMESSAGE_HOOK) {
                this.whatsapp[hook](data => this.onMessageHook(data, url))
            } else {
                this.whatsapp[hook](data => this.callWebhook(data, url))
            }
            this.log.log(`Hook '${hook}' was enabled to url: ${url}`)
        }
        this.log.log('Webhooks were configured.')
    }


    private callWebhook(data, url) {
        this.log.log(`Sending POST to ${url}...`)
        this.log.debug(`POST DATA: ${JSON.stringify(data)}`)

        // TODO: Use HttpModule with retry
        request.post(
            url,
            {
                json: data,
                maxAttempts: this.RETRY_ATTEMPTS,
                retryDelay: this.RETRY_DELAY * SECOND,
                retryStrategy: request.RetryStrategies.HTTPOrNetworkError
            },
            (error, res, body) => {
                if (error) {
                    this.log.error(error)
                    return
                }
                this.log.log(`POST request was sent with status code: ${res.statusCode}`)
                this.log.verbose(`Response: ${JSON.stringify(body)}`)
            })
    }

    private async onMessageHook(message: Message, url: string) {
        if (message.isMMS || message.isMedia) {
            this.downloadAndDecryptMedia(message).then(
                (data) => this.callWebhook(data, url)
            );
        } else {
            this.callWebhook(message, url);
        }
    }

    private async downloadAndDecryptMedia(message: Message) {
        return this.whatsapp.decryptFile(message).then(async (buffer) => {
            // Download only certain mimetypes
            if (this.mimetypes !== null && !this.mimetypes.some((type) => message.mimetype.startsWith(type))) {
                this.log.log(`The message ${message.id} has ${message.mimetype} media, skip it.`);
                message.clientUrl = ""
                return message
            }

            this.log.log(`The message ${message.id} has media, downloading it...`);
            const fileName = `${message.id}.${mime.extension(message.mimetype)}`;
            const filePath = path.resolve(`${this.filesFolder}/${fileName}`)
            this.log.verbose(`Writing file to ${filePath}...`)
            await writeFileAsync(filePath, buffer);
            this.log.log(`The file from ${message.id} has been saved to ${filePath}`);

            message.clientUrl = this.config.filesURL + fileName
            this.removeFile(filePath)
            return message
        });
    }

    private removeFile(file: string) {
        setTimeout(() => fs.unlink(file, () => {
            this.log.log(`File ${file} was removed`)
        }), this.filesLifetime)
    }
}

@Injectable()
export class WhatsappSessionManager implements OnApplicationShutdown {
    readonly filesFolder: string
    private readonly sessions: Record<string, WhatsappService>;
    private sessionsQR: Record<string, string>;

    constructor(
        private config: WhatsappConfigService,
        private log: ConsoleLogger,
    ) {
        this.log.setContext('WhatsappSessionManager')
        this.filesFolder = this.config.filesFolder
        this.cleanDownloadsFolder()
        this.sessions = {}
        this.sessionsQR = {}
    }

    async startSession(name: string) {
        this.log.log(`Starting ${name} session...`)
        const whatsapp = await create('sessionName',
            (base64Qrimg, asciiQR, attempts, urlCode) => {
                this.saveQR(name, base64Qrimg)
                console.log('Number of attempts to read the qrcode: ', attempts);
                console.log('Terminal qrcode: ', asciiQR);
            },
            undefined,
            {
                headless: true,
                devtools: false,
                useChrome: true,
                debug: false,
                logQR: true,
                browserArgs: ["--no-sandbox"],
                autoClose: 60000,
                createPathFileToken: true,
                puppeteerOptions: {},
                multidevice: false,
            }
        )
        this.sessions[name] = new WhatsappService(whatsapp, this.config)
        this.deleteQR(name)
    }

    getQR(name: string) {
        let qrBase64 = this.sessionsQR[name]
        qrBase64 = qrBase64.replace(/^data:image\/png;base64,/, '');
        return Buffer.from(qrBase64, "base64")
    }

    saveQR(name, base64Qrimg) {
        this.sessionsQR[name] = base64Qrimg
        console.log('base64 image string qrcode: ', base64Qrimg);
    }

    deleteQR(name) {
        delete this.sessionsQR[name]
    }

    getSession(name: string): Whatsapp {
        // TODO: Check session exists
        return this.sessions[name].whatsapp
    }

    stopSession(name: string) {
        this.log.log(`Stopping ${name} session...`)
        this.log.log(`"${name}" has been stopped.`)
    }

    getAllSessions() {
        return Object.keys(this.sessions) as Array<string>
    }

    onApplicationShutdown(signal ?: string): any {
        this.log.log('Close a browser...')
        // TODO: Stop all sessions
    }

    private cleanDownloadsFolder() {
        if (fs.existsSync(this.filesFolder)) {
            del([`${this.filesFolder}/*`], {force: true}).then((paths) =>
                console.log('Deleted files and directories:\n', paths.join('\n'))
            )
        } else {
            fs.mkdirSync(this.filesFolder)
            this.log.log(`Directory '${this.filesFolder}' created from scratch`)
        }
    }
}

const SUFFIX_DIRECT_MESSAGE = "@c.us"

/**
 * Add WhatsApp suffix (@c.us) to the phone number if it doesn't have it yet
 * @param phone
 */
export function ensureSuffix(phone) {
    if (phone.endsWith(SUFFIX_DIRECT_MESSAGE)) {
        return phone
    }
    return phone + SUFFIX_DIRECT_MESSAGE
}
