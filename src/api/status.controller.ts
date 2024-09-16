import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  DeleteStatusRequest,
  ImageStatus,
  TextStatus,
  VideoStatus,
  VoiceStatus,
} from '../structures/status.dto';

@ApiSecurity('api_key')
@Controller('api/:session/status')
@ApiTags('🟢 Status')
class StatusController {
  constructor(private manager: SessionManager) {}

  @Post('text')
  @SessionApiParam
  @ApiOperation({ summary: 'Send text status' })
  sendTextStatus(
    @WorkingSessionParam session: WhatsappSession,
    @Body() status: TextStatus,
  ) {
    return session.sendTextStatus(status);
  }

  @Post('image')
  @SessionApiParam
  @ApiOperation({ summary: 'Send image status' })
  sendImageStatus(
    @WorkingSessionParam session: WhatsappSession,
    @Body() status: ImageStatus,
  ) {
    return session.sendImageStatus(status);
  }

  @Post('voice')
  @SessionApiParam
  @ApiOperation({ summary: 'Send voice status' })
  sendVoiceStatus(
    @WorkingSessionParam session: WhatsappSession,
    @Body() status: VoiceStatus,
  ) {
    return session.sendVoiceStatus(status);
  }

  @Post('video')
  @SessionApiParam
  @ApiOperation({ summary: 'Send video status' })
  sendVideoStatus(
    @WorkingSessionParam session: WhatsappSession,
    @Body() status: VideoStatus,
  ) {
    return session.sendVideoStatus(status);
  }

  @Post('delete')
  @SessionApiParam
  @ApiOperation({ summary: 'DELETE sent status' })
  deleteStatus(
    @WorkingSessionParam session: WhatsappSession,
    @Body() status: DeleteStatusRequest,
  ) {
    return session.deleteStatus(status);
  }
}

export { StatusController };
