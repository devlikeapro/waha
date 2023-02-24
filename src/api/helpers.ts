import {ApiParam} from "@nestjs/swagger";
import {Injectable, Param, PipeTransform} from "@nestjs/common";
import {SessionManager} from "../core/abc/manager.abc";
import {WhatsappSession} from "../core/abc/session.abc";

/**
 * Get session name and return Whatsapp session back (if exists)
 * use it as
 @Param('session', SessionPipe) session: WhatsappSession,
 */
@Injectable()
export class SessionPipe implements PipeTransform<WhatsappSession> {
    constructor(private manager: SessionManager) {
    }

    async transform(value: any) {
        return this.manager.getSession(value)
    }
}

/**
 * Decorator for a method that uses SessionPipe above
 */
export const SessionApiParam = ApiParam({
    name: 'session',
    required: true,
    type: "string",
    description: "WhatsApp session name",
})

/**
 * Session param
 @SessionParam session: WhatsappSession,
 */
export const SessionParam = Param('session', SessionPipe)
