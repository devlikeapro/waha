import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ChatIdApiParam } from '@waha/nestjs/params/ChatIdApiParam';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import { WAHAPresenceStatus } from '../structures/enums.dto';
import {
  WAHAChatPresences,
  WAHASessionPresence,
} from '../structures/presence.dto';

@ApiSecurity('api_key')
@Controller('api/:session/presence')
@ApiTags('✅ Presence')
export class PresenceController {
  constructor(private manager: SessionManager) {}

  @Post('')
  @SessionApiParam
  @ApiOperation({ summary: 'Set session presence' })
  setPresence(
    @WorkingSessionParam session: WhatsappSession,
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
    @WorkingSessionParam session: WhatsappSession,
  ): Promise<WAHAChatPresences[]> {
    return session.getPresences();
  }

  @Get(':chatId')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({
    summary:
      "Get the presence for the chat id. If it hasn't been subscribed - it also subscribes to it.",
  })
  getPresence(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ): Promise<WAHAChatPresences> {
    return session.getPresence(chatId);
  }

  @Post(':chatId/subscribe')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({
    summary: 'Subscribe to presence events for the chat.',
  })
  subscribe(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ): Promise<void> {
    return session.subscribePresence(chatId);
  }
}
