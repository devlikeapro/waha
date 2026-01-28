import {
  Controller,
  Get,
  Query,
  Res,
  StreamableFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiFileAcceptHeader } from '@waha/nestjs/ApiFileAcceptHeader';
import { Response } from 'express';

import { SessionManager } from '../core/abc/manager.abc';
import { BufferResponseInterceptor } from '../nestjs/BufferResponseInterceptor';
import { SessionQuery } from '../structures/base.dto';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromQuery } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api')
@ApiTags('📱 Pairing')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Use, FromQuery('session')))
export class ScreenshotController {
  constructor(private manager: SessionManager) {}

  @Get('/screenshot')
  @ApiOperation({
    summary:
      'Get a screenshot of the current WhatsApp session (**WEBJS** only)',
  })
  @UseInterceptors(new BufferResponseInterceptor('image/jpeg'))
  @ApiFileAcceptHeader('image/jpeg')
  async screenshot(
    @Res({ passthrough: true }) res: Response,
    @Query() sessionQuery: SessionQuery,
  ) {
    const whatsappService = this.manager.getSession(sessionQuery.session);
    return await whatsappService.getScreenshot();
  }
}
