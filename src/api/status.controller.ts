import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  ImageStatus,
  TextStatus,
  VideoStatus,
  VoiceStatus,
} from '../structures/status.dto';
import { SessionApiParam, SessionParam } from './helpers';

@ApiSecurity('api_key')
@Controller('api/:session/status')
@ApiTags('status')
class StatusController {
  constructor(private manager: SessionManager) {}

  @Post('text')
  @SessionApiParam
  @ApiOperation({ summary: 'Send text status.' })
  sendTextStatus(
    @SessionParam session: WhatsappSession,
    @Body() status: TextStatus,
  ) {
    return session.sendTextStatus(status);
  }

  @Post('image')
  @SessionApiParam
  @ApiOperation({ summary: 'Send image status.' })
  sendImageStatus(
    @SessionParam session: WhatsappSession,
    @Body() status: ImageStatus,
  ) {
    return session.sendImageStatus(status);
  }

  @Post('voice')
  @SessionApiParam
  @ApiOperation({ summary: 'Send voice status.' })
  sendVoiceStatus(
    @SessionParam session: WhatsappSession,
    @Body() status: VoiceStatus,
  ) {
    return session.sendVoiceStatus(status);
  }

  @Post('video')
  @SessionApiParam
  @ApiOperation({ summary: 'Send video status.' })
  sendVideoStatus(
    @SessionParam session: WhatsappSession,
    @Body() status: VideoStatus,
  ) {
    return session.sendVideoStatus(status);
  }
}

export { StatusController };
