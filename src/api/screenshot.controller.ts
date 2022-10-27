import {Controller, Get, Query, Res} from '@nestjs/common';
import {ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Readable} from "stream";
import {Response} from 'express';
import {SessionQuery} from "../structures/chatting.dto";
import {SessionManager} from "../core/abc/manager.abc";


@ApiSecurity('api_key')
@Controller('api')
@ApiTags('screenshot')
export class ScreenshotController {
    constructor(private manager: SessionManager) {
    }

    @Get('/screenshot')
    async screenshot(
        @Res() res: Response,
        @Query() sessionQuery: SessionQuery,
    ) {
        const whatsappService = this.manager.getSession(sessionQuery.sessionName)
        const buffer = await whatsappService.getScreenshot();
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

