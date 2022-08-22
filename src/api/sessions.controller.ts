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
        // Do not wait it, because we get venom instance only after scanning QR code
        this.whatsappSessionManager.startSession(request.sessionName)
    }

    @Post('/stop/')
    async stop(@Body() request: SessionRequest) {
        await this.whatsappSessionManager.stopSession(request.sessionName)
    }

    @Get('/')
    async list() {
        return this.whatsappSessionManager.getAllSessions()
    }
}

