import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ChatIdApiParam } from '@waha/nestjs/params/ChatIdApiParam';
import { MessageIdApiParam } from '@waha/nestjs/params/MessageIdApiParam';
import {
  SessionApiParam,
  SessionParam,
} from '@waha/nestjs/params/SessionApiParam';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import { parseBool } from '../helpers';
import { GetChatMessagesQuery, GetChatsQuery } from '../structures/chats.dto';
import { EditMessageRequest } from '../structures/chatting.dto';

@ApiSecurity('api_key')
@Controller('api/:session/chats')
@ApiTags('💬 Chats')
@UsePipes(new ValidationPipe({ transform: true }))
class ChatsController {
  constructor(private manager: SessionManager) {}

  @Get('')
  @SessionApiParam
  @ApiOperation({ summary: 'Get chats' })
  getChats(
    @SessionParam session: WhatsappSession,
    @Query() query: GetChatsQuery,
  ) {
    return session.getChats(query);
  }

  @Delete(':chatId')
  @SessionApiParam
  @ApiOperation({ summary: 'Deletes the chat' })
  deleteChat(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    return session.deleteChat(chatId);
  }

  @Get(':chatId/messages')
  @SessionApiParam
  @ApiOperation({ summary: 'Gets messages in the chat' })
  getChatMessages(
    @Query() query: GetChatMessagesQuery,
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    const downloadMedia = parseBool(query.downloadMedia);
    return session.getChatMessages(chatId, query.limit, downloadMedia);
  }

  @Delete(':chatId/messages')
  @SessionApiParam
  @ApiOperation({ summary: 'Clears all messages from the chat' })
  clearMessages(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    return session.clearMessages(chatId);
  }

  @Delete(':chatId/messages/:messageId')
  @SessionApiParam
  @ChatIdApiParam
  @MessageIdApiParam
  @ApiOperation({ summary: 'Deletes a message from the chat' })
  deleteMessage(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    return session.deleteMessage(chatId, messageId);
  }

  @Put(':chatId/messages/:messageId')
  @SessionApiParam
  @ChatIdApiParam
  @MessageIdApiParam
  @ApiOperation({ summary: 'Edits a message in the chat' })
  editMessage(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @Body() body: EditMessageRequest,
  ) {
    return session.editMessage(chatId, messageId, body);
  }

  @Post(':chatId/archive')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({ summary: 'Archive the chat' })
  archiveChat(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    return session.chatsArchiveChat(chatId);
  }

  @Post(':chatId/unarchive')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({ summary: 'Unarchive the chat' })
  unarchiveChat(
    @SessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    return session.chatsUnarchiveChat(chatId);
  }
}

export { ChatsController };
