import {ConsoleLogger, Injectable, NotFoundException, UnprocessableEntityException} from "@nestjs/common";
import {SessionManager} from "./abc/manager.abc";
import {WAHAInternalEvent, WhatsappSession} from "./abc/session.abc";
import {WhatsappEngine} from "../structures/enums.dto";
import {SessionDTO, SessionStartRequest, SessionStopRequest} from "../structures/sessions.dto";
import {WhatsappConfigService} from "../config.service";
import {WhatsappSessionVenomCore} from "./session.venom.core";
import {WhatsappSessionWebJSCore} from "./session.webjs.core";
import {DOCS_URL} from "./exceptions";
import {WebhookConductorCore} from "./webhooks.core";
import {MediaStorageCore} from "./storage.core";
import {WhatsappSessionNoWebCore} from "./session.noweb.core";

export class OnlyDefaultSessionIsAllowed extends UnprocessableEntityException {
    constructor() {
        super(`WAHA Core support only 'default' session. If you want to run more then one WhatsApp account - please get WAHA PLUS version. Check this out: ${DOCS_URL}`);
    }
}

@Injectable()
export class SessionManagerCore extends SessionManager {
    private session: WhatsappSession;
    DEFAULT = "default"

    // @ts-ignore
    protected MediaStorageClass = MediaStorageCore
    // @ts-ignore
    protected WebhookConductorClass = WebhookConductorCore
    protected readonly EngineClass: typeof WhatsappSession;


    constructor(
        private config: WhatsappConfigService,
        private log: ConsoleLogger,
    ) {
        super()

        this.log.setContext('SessionManager')
        this.session = undefined
        this.EngineClass = this.getEngine(this.config.getDefaultEngineName())

        // Start session from the start
        if (config.startSession) {
            this.start({name: config.startSession})
        }
    }

    protected getEngine(engine: WhatsappEngine): typeof WhatsappSession {
        if (engine === WhatsappEngine.WEBJS) {
            return WhatsappSessionWebJSCore
        } else if (engine === WhatsappEngine.VENOM) {
            return WhatsappSessionVenomCore
        } else if (engine === WhatsappEngine.NOWEB) {
            return WhatsappSessionNoWebCore
        } else {
            throw new NotFoundException(`Unknown whatsapp engine '${engine}'.`)
        }

    }

    private onlyDefault(name: string) {
        if (name !== this.DEFAULT) {
            throw new OnlyDefaultSessionIsAllowed()
        }
    }

    getSession(name: string): WhatsappSession {
        this.onlyDefault(name)
        if (!this.session) {
            throw new NotFoundException(
                `We didn't find a session with name '${name}'. Please start it first by using POST /sessions/start request`,
            );
        }
        return this.session
    }

    getSessions(): SessionDTO[] {
        return [];
    }

    async onApplicationShutdown(signal?: string) {
        if (!this.session){
            return
        }
        await this.stop({name: this.DEFAULT})
    }

    start(request: SessionStartRequest): SessionDTO {
        this.onlyDefault(request.name)

        const name = request.name
        this.log.log(`'${name}' - starting session...`)
        const log = new ConsoleLogger(`WhatsappSession - ${name}`)
        const storage = new this.MediaStorageClass()
        const webhookLog = new ConsoleLogger(`Webhook - ${name}`)
        const webhook = new this.WebhookConductorClass(
            webhookLog,
            this.config.getWebhookUrl(),
            this.config.getWebhookEvents()
        )

        // @ts-ignore
        const session = new this.EngineClass(name, storage, log)
        this.session = session

        session.events.on(WAHAInternalEvent.engine_start, () => webhook.configure(session))
        session.start()
        return {name: session.name, status: session.status}
    }

    async stop(request: SessionStopRequest): Promise<void> {
        const name = request.name
        this.log.log(`Stopping ${name} session...`)
        const session = this.getSession(name)
        await session.stop()
        this.log.log(`"${name}" has been stopped.`)
        this.session = undefined
    }

}
