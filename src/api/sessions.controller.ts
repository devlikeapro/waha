import {Body, Controller, Get, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {WhatsappSessionManager} from "../whatsapp.service";
import {Session} from "./all.dto";


@Controller('api/sessions')
@ApiTags('sessions')
export class SessionsController {
    constructor(private whatsappSessionManager: WhatsappSessionManager) {
    }


    @Post('/start/')
    async start(@Body() query: Session) {
        this.whatsappSessionManager.startSession(query.sessionName)
        return
    }

    @Post('/stop/')
    async stop(@Body() query: Session) {
        this.whatsappSessionManager.stopSession(query.sessionName)
        return
    }

    @Get('/')
    async list() {
        return this.whatsappSessionManager.getAllSessions()
    }
}

