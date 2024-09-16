import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { ChatIdApiParam } from '@waha/nestjs/params/ChatIdApiParam';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import { Label, SetLabelsRequest } from '@waha/structures/labels.dto';

import { SessionManager } from '../core/abc/manager.abc';

@ApiSecurity('api_key')
@Controller('api/:session/labels')
@ApiTags('🏷️ Labels')
export class LabelsController {
  constructor(private manager: SessionManager) {}

  @Get('/')
  @SessionApiParam
  @ApiOperation({ summary: 'Get all labels' })
  getAll(@WorkingSessionParam session: WhatsappSession): Promise<Label[]> {
    return session.getLabels();
  }

  @Get('/chats/:chatId')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({ summary: 'Get labels for the chat' })
  getChatLabels(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ): Promise<Label[]> {
    return session.getChatLabels(chatId);
  }

  @Put('/chats/:chatId')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({ summary: 'Save labels for the chat' })
  putChatLabels(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Body() request: SetLabelsRequest,
  ) {
    return session.putLabelsToChat(chatId, request.labels);
  }

  @Get('/:labelId/chats')
  @SessionApiParam
  @ApiOperation({ summary: 'Get chats by label' })
  getChatsByLabel(
    @WorkingSessionParam session: WhatsappSession,
    @Param('labelId') labelId: string,
  ) {
    return session.getChatsByLabelId(labelId);
  }
}
