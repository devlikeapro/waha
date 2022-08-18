import {Body, Controller, Get, Post, Query, Res} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {Readable} from "stream";
import {Response} from 'express';
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

    @Get('/qr')
    async qr(
        @Res() res: Response,
        @Query('sessionName') sessionName: string,
    ) {
        const buffer = this.whatsappSessionManager.getQR(sessionName)
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        res.set({
            'Content-Type': 'image/png',
            'Content-Length': buffer.length,
        });
        stream.pipe(res)
    }

    @Get('/')
    async list() {
        return this.whatsappSessionManager.getAllSessions()
    }
}

