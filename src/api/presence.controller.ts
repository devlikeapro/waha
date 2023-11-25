import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import { WAHAPresenceStatus } from '../structures/enums.dto';
import {
  WAHAChatPresences,
  WAHASessionPresence,
} from '../structures/presence.dto';
import { SessionApiParam, SessionParam } from './helpers';

@ApiSecurity('api_key')
@Controller('api/:session/presence')
@ApiTags('presence')
export class PresenceController {
  constructor(private manager: SessionManager) {}

  @Post('')
  @SessionApiParam
  @ApiOperation({ summary: 'Set session presence' })
  setPresence(
    @SessionParam session: WhatsappSession,
    @Body() request: WAHASessionPresence,
  ) {
    // Validate request
    const presencesWithoutChatId = [
      WAHAPresenceStatus.ONLINE,
      WAHAPresenceStatus.OFFLINE,
    ];
    const requiresNoChatId = presencesWithoutChatId.includes(request.presence);
    const requiresChatId = !requiresNoChatId;

    if (requiresNoChatId && request.chatId) {
      const msg = {
        detail: `'${request.presence}' presence works on the global scope and doesn't require 'chatId' field.`,
      };
      throw new BadRequestException(msg);
    } else if (requiresChatId && !request.chatId) {
      const msg = {
        detail: `'${request.presence}' presence requires 'chatId' field.`,
      };
      throw new BadRequestException(msg);
    }

    return session.setPresence(request.presence, request.chatId);
  }

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
