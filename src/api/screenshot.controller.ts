import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Readable } from 'stream';

import { SessionManager } from '../core/abc/manager.abc';
import { SessionQuery } from '../structures/base.dto';

@ApiSecurity('api_key')
@Controller('api')
@ApiTags('screenshot')
export class ScreenshotController {
  constructor(private manager: SessionManager) {}

  @Get('/screenshot')
  async screenshot(
    @Res({ passthrough: true }) res: Response,
    @Query() sessionQuery: SessionQuery,
  ) {
    const whatsappService = this.manager.getSession(sessionQuery.session);
    const buffer = await whatsappService.getScreenshot();
    const file = new StreamableFile(buffer);
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    });
    return file;
  }
}
