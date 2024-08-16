import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import {
  SessionApiParam,
  SessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import { Label, LabelID, SetLabelsRequest } from '@waha/structures/labels.dto';

import { SessionManager } from '../core/abc/manager.abc';

@ApiSecurity('api_key')
@Controller('api/:session/labels')
@ApiTags('🏷️ Labels')
export class LabelsController {
  constructor(private manager: SessionManager) {}

  @Get('/')
  @SessionApiParam
  @ApiOperation({ summary: 'Get all labels' })
  getAll(@SessionParam session: WhatsappSession): Promise<Label[]> {
    return session.getLabels();
  }

  @Get('/chats/:chatId')
  @SessionApiParam
  @ApiOperation({ summary: 'Get labels for the chat' })
  getChatLabels(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ): Promise<Label[]> {
    return session.getChatLabels(chatId);
  }

  @Put('/chats/:chatId')
  @SessionApiParam
  @ApiOperation({ summary: 'Save labels for the chat' })
  putChatLabels(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Body() request: SetLabelsRequest,
  ) {
    return session.putLabelsToChat(chatId, request.labels);
  }

  @Get('/:labelId/chats')
  @SessionApiParam
  @ApiOperation({ summary: 'Get chats by label' })
  getChatsByLabel(
    @SessionParam session: WhatsappSession,
    @Param('labelId') labelId: string,
  ) {
    return session.getChatsByLabelId(labelId);
  }
}
