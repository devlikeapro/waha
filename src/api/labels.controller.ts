import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Label } from '@waha/structures/labels.dto';

import { SessionManager } from '../core/abc/manager.abc';
import { SessionQuery } from '../structures/base.dto';

@ApiSecurity('api_key')
@Controller('api/labels')
@ApiTags('labels')
export class LabelsController {
  constructor(private manager: SessionManager) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all labels' })
  getAll(@Query() query: SessionQuery): Promise<Label[]> {
    const whatsapp = this.manager.getSession(query.session);
    return whatsapp.getLabels();
  }
}
