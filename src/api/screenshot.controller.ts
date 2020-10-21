import {Controller, Get, Inject, Res} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {Whatsapp} from "venom-bot";
import {Readable} from "stream";
import {Response} from 'express';


@Controller('api')
@ApiTags('screenshot')
export class ScreenshotController {
    constructor(@Inject('WHATSAPP') private whatsapp: Whatsapp) {
    }

    @Get('/screenshot')
    async screenshot(@Res() res: Response,) {
        const buffer = await this.whatsapp.page.screenshot();
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

