import { z } from 'zod';
import { DtoToZod } from '@waha/apps/mcp/schemas/DtoToZod';
import {
  ChatRequest,
  MessageButtonReply,
  MessageContactVcardRequest,
  MessageFileRequest,
  MessageForwardRequest,
  MessageImageRequest,
  MessageLinkCustomPreviewRequest,
  MessageLocationRequest,
  MessagePollRequest,
  MessagePollVoteRequest,
  MessageReactionRequest,
  MessageStarRequest,
  MessageTextRequest,
  MessageVideoRequest,
  MessageVoiceRequest,
  SendSeenRequest,
} from '@waha/structures/chatting.dto';
import { SendButtonsRequest } from '@waha/structures/chatting.buttons.dto';
import { SendListRequest } from '@waha/structures/chatting.list.dto';
import { EventMessage } from '@waha/structures/events.dto';

export const SendTextInput = DtoToZod(MessageTextRequest);
export const SendImageInput = DtoToZod(MessageImageRequest);
export const SendFileInput = DtoToZod(MessageFileRequest);
export const SendVoiceInput = DtoToZod(MessageVoiceRequest);
export const SendVideoInput = DtoToZod(MessageVideoRequest);
export const SendLinkCustomPreviewInput = DtoToZod(
  MessageLinkCustomPreviewRequest,
);
export const SendButtonsInput = DtoToZod(SendButtonsRequest);
export const SendListInput = DtoToZod(SendListRequest);
export const SendSeenInput = DtoToZod(SendSeenRequest);
export const SendPollInput = DtoToZod(MessagePollRequest);
export const SendPollVoteInput = DtoToZod(MessagePollVoteRequest);
export const SendLocationInput = DtoToZod(MessageLocationRequest);
export const SendContactVcardInput = DtoToZod(MessageContactVcardRequest);
export const SendButtonsReplyInput = DtoToZod(MessageButtonReply);
export const ForwardMessageInput = DtoToZod(MessageForwardRequest);
export const TypingInput = DtoToZod(ChatRequest);
export const SetReactionInput = DtoToZod(MessageReactionRequest);
export const SetStarInput = DtoToZod(MessageStarRequest);
export const NewMessageIdInput = z.object({
  session: z.string().describe('Session name'),
});

export const SendEventInput = DtoToZod(EventMessage).extend({
  session: z.string().describe('Session name'),
  chatId: z.string().describe('Chat ID (e.g. 11111@c.us)'),
  reply_to: z.string().optional().describe('Message ID to reply to'),
});
