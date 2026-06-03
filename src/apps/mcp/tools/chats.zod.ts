import { z } from 'zod';

import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  ChatPictureQuery,
  GetChatMessageQuery,
  GetChatMessagesFilter,
  GetChatMessagesQuery,
  GetChatsOverviewParams,
  GetChatsParams,
  OverviewFilter,
  PinMessageRequest,
  ReadChatMessagesQuery,
} from '@waha/structures/chats.dto';

const SessionField = z.string().describe('Session name');
const ChatIdField = z.string().describe('Chat ID (e.g. 11111@c.us)');
const MessageIdField = z.string().describe('Message ID');

export const ChatsListInput = DtoToZod(GetChatsParams).extend({
  session: SessionField,
});

export const ChatsOverviewInput = DtoToZod(GetChatsOverviewParams)
  .merge(DtoToZod(OverviewFilter))
  .extend({ session: SessionField });

export const ChatInput = z.object({
  session: SessionField,
  chatId: ChatIdField,
});

export const ChatPictureInput = DtoToZod(ChatPictureQuery).extend({
  session: SessionField,
  chatId: ChatIdField,
});

export const ChatMessagesInput = DtoToZod(GetChatMessagesQuery)
  .merge(DtoToZod(GetChatMessagesFilter))
  .extend({
    session: SessionField,
    chatId: z.string().describe('Chat ID'),
    _data: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        'Include raw _data field in messages. When false (default), _data is stripped from each message and from replyTo.',
      ),
  });

export const ReadChatMessagesInput = DtoToZod(ReadChatMessagesQuery).extend({
  session: SessionField,
  chatId: ChatIdField,
});

export const ChatMessageInput = DtoToZod(GetChatMessageQuery).extend({
  session: SessionField,
  chatId: ChatIdField,
  messageId: MessageIdField,
});

export const PinMessageInput = DtoToZod(PinMessageRequest).extend({
  session: SessionField,
  chatId: ChatIdField,
  messageId: MessageIdField,
});

export const UnpinMessageInput = z.object({
  session: SessionField,
  chatId: ChatIdField,
  messageId: MessageIdField,
});

export const DeleteMessageInput = z.object({
  session: SessionField,
  chatId: ChatIdField,
  messageId: MessageIdField,
});

export const EditMessageInput = z.object({
  session: SessionField,
  chatId: ChatIdField,
  messageId: MessageIdField,
  text: z.string().describe('New text'),
  linkPreview: z.boolean().optional().default(true),
});

export const ChatsOverviewBodyInput = z.object({
  session: SessionField,
  pagination: DtoToZod(GetChatsOverviewParams),
  filter: DtoToZod(OverviewFilter),
});
