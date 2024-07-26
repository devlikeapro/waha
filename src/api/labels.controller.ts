import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SessionApiParam, SessionParam } from '@waha/api/helpers';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { Label } from '@waha/structures/labels.dto';

import { SessionManager } from '../core/abc/manager.abc';

@ApiSecurity('api_key')
@Controller('api/:session/labels')
@ApiTags('labels')
export class LabelsController {
  constructor(private manager: SessionManager) {}

  @Get('/')
  @SessionApiParam
  @ApiOperation({ summary: 'Get all labels' })
  getAll(@SessionParam session: WhatsappSession): Promise<Label[]> {
    return session.getLabels();
  }
}
