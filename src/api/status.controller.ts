import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import { NewMessageIDResponse } from '@waha/structures/chatting.dto';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  DeleteStatusRequest,
  ImageStatus,
  TextStatus,
  VideoStatus,
  VoiceStatus,
} from '../structures/status.dto';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/:session/status')
@ApiTags('🟢 Status')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Use, FromParam('session')))
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

  @Get('new-message-id')
  @SessionApiParam
  @ApiOperation({
    summary: 'Generate message ID you can use to batch contacts',
  })
  async getNewMessageId(
    @WorkingSessionParam session: WhatsappSession,
  ): Promise<NewMessageIDResponse> {
    const id = await session.generateNewMessageId();
    return { id: id };
  }
}

export { StatusController };
