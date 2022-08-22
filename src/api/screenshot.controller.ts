import {Controller, Get, Query, Res} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {Readable} from "stream";
import {Response} from 'express';
import {WhatsappSessionManager} from "../whatsapp.service";
import {SessionQuery} from "./all.dto";


@Controller('api')
@ApiTags('screenshot')
export class ScreenshotController {
    constructor(private whatsappSessionManager: WhatsappSessionManager) {
    }

    @Get('/screenshot')
    async screenshot(
        @Res() res: Response,
        @Query() sessionQuery: SessionQuery,
    ) {
        const whatsappService = this.whatsappSessionManager.getService(sessionQuery.sessionName)
        const buffer = await whatsappService.getScreenshotOrQRCode();
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        res.set({
            'Content-Type': 'image/png',
            'Content-Length': buffer.length,
        });
        stream.pipe(res)
    }
}

