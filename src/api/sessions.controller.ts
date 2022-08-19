import {Body, Controller, Get, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {WhatsappSessionManager} from "../whatsapp.service";
import {SessionRequest} from "./all.dto";


@Controller('api/sessions')
@ApiTags('sessions')
export class SessionsController {
    constructor(private whatsappSessionManager: WhatsappSessionManager) {
    }


    @Post('/start/')
    async start(@Body() request: SessionRequest) {
        this.whatsappSessionManager.startSession(request.sessionName)
        return
    }

    @Post('/stop/')
    async stop(@Body() request: SessionRequest) {
        this.whatsappSessionManager.stopSession(request.sessionName)
        return
    }

    @Get('/')
    async list() {
        return this.whatsappSessionManager.getAllSessions()
    }
}

