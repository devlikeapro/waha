import {WhatsappStatus} from "./enums.dto";

export class SessionStartRequest {
    name = "default"
}

export class SessionStopRequest {
    name = "default"
}

export class SessionDTO {
    name = "default"
    status: WhatsappStatus
}
