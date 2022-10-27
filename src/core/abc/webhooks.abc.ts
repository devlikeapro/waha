import {WhatsappSession} from "./session.abc";

export abstract class WebhookConductor {
    abstract configure(session: WhatsappSession)
}
