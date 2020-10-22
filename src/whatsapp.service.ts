import {create, Whatsapp} from "venom-bot";
import {Inject, Injectable, Logger, OnApplicationShutdown} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('requestretry');
const SECOND = 1000;

export const whatsappProvider = {
    provide: 'WHATSAPP',
    useFactory: async (config: ConfigService) => create('sessionName',
        (base64Qr, asciiQR) => {
            console.log(asciiQR);
        },
        (statusFind) => {
            console.log(statusFind);
        },
        {
            headless: true,
            devtools: false,
            useChrome: true,
            debug: false,
            logQR: true,
            browserArgs: ["--no-sandbox"],
            autoClose: 60000,
            disableSpins: true,
            createPathFileToken: true,
            puppeteerOptions: {},
        }
    ),
}

const HOOKS = [
    "onMessage",
    "onStateChange",
    "onAck",
    // TODO: IMPLEMENTED THESE TOO
    // "onLiveLocation",
    // "onParticipantsChanged",
    "onAddedToGroup"
]
const ENV_PREFIX = "WHATSAPP_HOOK_"


@Injectable()
export class WhatsappService implements OnApplicationShutdown {
    // TODO: Use environment variables
    private RETRY_DELAY = 15
    private RETRY_ATTEMPTS = 3;

    constructor(
        @Inject('WHATSAPP') private whatsapp: Whatsapp,
        private config: ConfigService,
        private log: Logger,
    ) {
        this.log.setContext('WhatsappService')
        this.log.log('Configuring webhooks...')
        for (const hook of HOOKS) {
            const env_name = ENV_PREFIX + hook.toUpperCase()
            const url = config.get(env_name)
            if (url) {
                this.whatsapp[hook](data => this.callWebhook(data, url))
                this.log.log(`Hook '${hook}' was enabled to url: ${url}`)
            } else {
                this.log.log(`Hook '${hook}' is disabled. Set ${env_name} environment variable to url if you want to enabled it.`)
            }
        }
        this.log.log('Webhooks were configured.')
    }

    callWebhook(data, url) {
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

    onApplicationShutdown(signal ?: string): any {
        this.log.log('Close a browser...')
        return this.whatsapp.close()
    }

}