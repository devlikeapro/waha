import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ChatIdApiParam } from '@waha/nestjs/params/ChatIdApiParam';
import { MessageIdApiParam } from '@waha/nestjs/params/MessageIdApiParam';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  ChatPictureQuery,
  ChatPictureResponse,
  ChatsPaginationParams,
  ChatSummary,
  GetChatMessageQuery,
  GetChatMessagesFilter,
  GetChatMessagesQuery,
  MessageSortField,
  OverviewBodyRequest,
  OverviewFilter,
  OverviewPaginationParams,
  PinMessageRequest,
  ReadChatMessagesQuery,
  ReadChatMessagesResponse,
  transformAck,
} from '../structures/chats.dto';
import { EditMessageRequest } from '../structures/chatting.dto';
import { SortOrder } from '@waha/structures/pagination.dto';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/:session/chats')
@ApiTags('💬 Chats')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Use, FromParam('session')))
class ChatsController {
  constructor(private manager: SessionManager) {}

  @Get('')
  @SessionApiParam
  @ApiOperation({ summary: 'Get chats' })
  getChats(
    @WorkingSessionParam session: WhatsappSession,
    @Query() pagination: ChatsPaginationParams,
  ) {
    return session.getChats(pagination);
  }

  @Get('overview')
  @SessionApiParam
  @ApiOperation({
    summary:
      'Get chats overview. Includes all necessary things to build UI "your chats overview" page - chat id, name, picture, last message. Sorting by last message timestamp',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getChatsOverview(
    @WorkingSessionParam session: WhatsappSession,
    @Query() pagination: OverviewPaginationParams,
    @Query() filter: OverviewFilter,
  ): Promise<ChatSummary[]> {
    return session.getChatsOverview(pagination, filter);
  }

  @Post('overview')
  @SessionApiParam
  @ApiOperation({
    summary:
      'Get chats overview. Use POST if you have too many "ids" params - GET can limit it',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  postChatsOverview(
    @WorkingSessionParam session: WhatsappSession,
    @Body() body: OverviewBodyRequest,
  ): Promise<ChatSummary[]> {
    return session.getChatsOverview(body.pagination, body.filter);
  }

  @Delete(':chatId')
  @SessionApiParam
  @ApiOperation({ summary: 'Deletes the chat' })
  @ChatIdApiParam
  deleteChat(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    return session.deleteChat(chatId);
  }

  @Get(':chatId/picture')
  @SessionApiParam
  @ApiOperation({ summary: 'Gets chat picture' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getChatPicture(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Query() query: ChatPictureQuery,
  ): Promise<ChatPictureResponse> {
    const url = await session.getContactProfilePicture(chatId, query.refresh);
    return { url: url };
  }

  @Get(':chatId/messages')
  @SessionApiParam
  @ApiOperation({ summary: 'Gets messages in the chat' })
  @ChatIdApiParam
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getChatMessages(
    @Query() query: GetChatMessagesQuery,
    @Query() filter: GetChatMessagesFilter,
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    if (query.sortBy == MessageSortField.MESSAGE_TIMESTAMP) {
      query.sortBy = MessageSortField.TIMESTAMP;
    }
    query.sortBy = query.sortBy || MessageSortField.TIMESTAMP;
    query.sortOrder = query.sortOrder || SortOrder.DESC;
    filter = transformAck(filter);
    return session.getChatMessages(chatId, query, filter);
  }

  @Post(':chatId/messages/read')
  @SessionApiParam
  @ApiOperation({ summary: 'Read unread messages in the chat' })
  @ChatIdApiParam
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  readChatMessages(
    @Query() query: ReadChatMessagesQuery,
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ): Promise<ReadChatMessagesResponse> {
    return session.readChatMessages(chatId, query);
  }

  @Get(':chatId/messages/:messageId')
  @SessionApiParam
  @ApiOperation({ summary: 'Gets message by id' })
  @ChatIdApiParam
  async getChatMessage(
    @Query() query: GetChatMessageQuery,
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    const message = await session.getChatMessage(chatId, messageId, query);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  @Post(':chatId/messages/:messageId/pin')
  @SessionApiParam
  @ApiOperation({ summary: 'Pins a message in the chat' })
  @ChatIdApiParam
  async pinMessage(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @Body() body: PinMessageRequest,
  ) {
    const result = await session.pinMessage(chatId, messageId, body.duration);
    return { success: result };
  }

  @Post(':chatId/messages/:messageId/unpin')
  @SessionApiParam
  @ApiOperation({ summary: 'Unpins a message in the chat' })
  @ChatIdApiParam
  async unpinMessage(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    const result = await session.unpinMessage(chatId, messageId);
    return { success: result };
  }

  @Delete(':chatId/messages')
  @SessionApiParam
  @ApiOperation({ summary: 'Clears all messages from the chat' })
  @ChatIdApiParam
  clearMessages(
    @WorkingSessionParam session: WhatsappSession,
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
    @WorkingSessionParam session: WhatsappSession,
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
    @WorkingSessionParam session: WhatsappSession,
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
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    return session.chatsArchiveChat(chatId);
  }

  @Post(':chatId/unarchive')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({ summary: 'Unarchive the chat' })
  unarchiveChat(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    return session.chatsUnarchiveChat(chatId);
  }

  @Post(':chatId/unread')
  @SessionApiParam
  @ChatIdApiParam
  @ApiOperation({ summary: 'Unread the chat' })
  unreadChat(
    @WorkingSessionParam session: WhatsappSession,
    @Param('chatId') chatId: string,
  ) {
    return session.chatsUnreadChat(chatId);
  }
}

export { ChatsController };
