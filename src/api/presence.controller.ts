import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import { WAHAChatPresences } from '../structures/presence.dto';
import { SessionApiParam, SessionParam } from './helpers';

@ApiSecurity('api_key')
@Controller('api/:session/presence')
@ApiTags('presence')
export class PresenceController {
  constructor(private manager: SessionManager) {}

  @Get('')
  @SessionApiParam
  @ApiOperation({ summary: 'Get all subscribed presence information.' })
  getPresenceAll(
    @SessionParam session: WhatsappSession,
  ): Promise<WAHAChatPresences[]> {
    return session.getPresences();
  }

  @Get(':chatId')
  @SessionApiParam
  @ApiOperation({
    summary:
      "Get the presence for the chat id. If it hasn't been subscribed - it also subscribes to it.",
  })
  getPresence(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ): Promise<WAHAChatPresences> {
    return session.getPresence(chatId);
  }

  @Post(':chatId/subscribe')
  @SessionApiParam
  @ApiOperation({
    summary: 'Subscribe to presence events for the chat.',
  })
  subscribe(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ): Promise<void> {
    return session.subscribePresence(chatId);
  }
}
