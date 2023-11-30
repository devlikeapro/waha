import {
  Controller,
  Get,
  Query,
  Res,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { SessionManager } from '../core/abc/manager.abc';
import { SessionQuery } from '../structures/base.dto';
import { BufferResponseInterceptor } from './BufferResponseInterceptor';
import { ApiFileAcceptHeader } from './helpers';

@ApiSecurity('api_key')
@Controller('api')
@ApiTags('screenshot')
export class ScreenshotController {
  constructor(private manager: SessionManager) {}

  @Get('/screenshot')
  @UseInterceptors(new BufferResponseInterceptor())
  @ApiFileAcceptHeader()
  async screenshot(
    @Res({ passthrough: true }) res: Response,
    @Query() sessionQuery: SessionQuery,
  ) {
    const whatsappService = this.manager.getSession(sessionQuery.session);
    return await whatsappService.getScreenshot();
  }
}
