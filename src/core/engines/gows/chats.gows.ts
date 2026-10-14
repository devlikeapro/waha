import * as grpc from '@grpc/grpc-js';
import { UnprocessableEntityException } from '@nestjs/common';
import { NotImplementedByEngineError } from '@waha/core/exceptions';
import { isJidGroup, toCusFormat } from '@waha/core/utils/jids';
import {
  DeleteChatRange,
  DeleteChatResponse,
} from '@waha/structures/chats.dto';

// A direct chat: digits, then its phone number or LID server
const DELETABLE_DIRECT_CHAT = /^\d+@(c\.us|s\.whatsapp\.net|lid)$/;
// A group: digits, or "creator-timestamp" for old groups
const DELETABLE_GROUP = /^\d+(-\d+)?@g\.us$/;

/**
 * Direct chats and groups only. A deletion stays in the app state for good,
 * so "abc" or "x@bot" are refused rather than turned into a phone number.
 */
export function assertDeletableChatId(chatId: string) {
  if (
    typeof chatId === 'string' &&
    (DELETABLE_DIRECT_CHAT.test(chatId) || DELETABLE_GROUP.test(chatId))
  ) {
    return;
  }
  throw new UnprocessableEntityException(
    `Chat '${chatId}' can not be deleted: only direct chats ` +
      `('123@c.us', '123@lid') and groups ('123@g.us') can be deleted`,
  );
}

/**
 * GOWS DeleteChat errors: refused id or group still joined => 422, no DeleteChat => 501
 */
export function toDeleteChatError(error: any): any {
  switch (error?.code) {
    case grpc.status.INVALID_ARGUMENT:
    case grpc.status.FAILED_PRECONDITION:
      return new UnprocessableEntityException(error.details ?? error.message);
    case grpc.status.UNIMPLEMENTED:
      return new NotImplementedByEngineError(
        'This GOWS can not delete chats (no DeleteChat method), update it.',
      );
    default:
      return error;
  }
}

/**
 * Converts the GOWS DeleteChatResponse to what DELETE /chats/{chatId} returns
 */
export function toDeleteChatResponse(
  chatId: string,
  deleteMedia: boolean,
  response: any,
): DeleteChatResponse {
  const ranges: any[] = response?.ranges ?? [];
  return {
    success: true,
    id: chatId,
    deleteMedia: deleteMedia,
    purge: Boolean(response?.purge),
    confirmed: Boolean(response?.confirmed),
    ranges: ranges.map(toDeleteChatRange),
  };
}

function toDeleteChatRange(range: any): DeleteChatRange {
  let lastMessage = null;
  if (range.lastMessageId) {
    lastMessage = {
      id: toMessageId(
        range.jid,
        range.lastMessageSender,
        range.lastMessageId,
        Boolean(range.lastMessageFromMe),
      ),
      timestamp: Number(range.lastMessageSentAt),
    };
  }
  return {
    chatId: toCusFormat(range.jid),
    lastMessageTimestamp: Number(range.lastMessageTimestamp),
    lastMessage: lastMessage,
  };
}

// The WAHA id of a GOWS message: "{fromMe}_{chat}_{id}", then "_{sender}" in a group
function toMessageId(
  chat: string,
  sender: string,
  id: string,
  fromMe: boolean,
): string {
  const messageId = `${fromMe}_${toCusFormat(chat)}_${id}`;
  if (isJidGroup(chat)) {
    return `${messageId}_${toCusFormat(sender)}`;
  }
  return messageId;
}
