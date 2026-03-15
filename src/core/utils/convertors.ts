import type { WAMessageKey } from '@adiwajshing/baileys';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import { isJidGroup, toJID } from '@waha/core/utils/jids';
import {
  GetChatMessagesFilter,
  GetChatMessagesQuery,
  ReadChatMessagesQuery,
} from '@waha/structures/chats.dto';
import { SendSeenRequest } from '@waha/structures/chatting.dto';
import { WAMessageAck } from '@waha/structures/enums.dto';

export function ExtractMessageKeysForRead(
  request: SendSeenRequest,
): WAMessageKey[] {
  const jid = toJID(request.chatId);
  const defaults = {
    remoteJid: jid,
    participant: request.participant,
  };
  const ids = request.messageIds || [];
  if (request.messageId) {
    ids.push(request.messageId);
  }
  const keys: WAMessageKey[] = [];
  for (const messageId of ids) {
    const parsed = parseMessageIdSerialized(messageId, false);
    if (parsed.fromMe) {
      continue;
    }
    const key: WAMessageKey = {
      id: parsed.id,
      remoteJid: parsed.remoteJid
        ? toJID(parsed.remoteJid)
        : defaults.remoteJid,
      participant: parsed.participant
        ? toJID(parsed.participant)
        : defaults.participant,
    };
    keys.push(key);
  }
  return keys;
}

function daysToMs(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

export function MessagesForRead(
  chatId: string,
  request: ReadChatMessagesQuery,
): {
  query: GetChatMessagesQuery;
  filter: GetChatMessagesFilter;
} {
  const limit = request.messages || isJidGroup(chatId) ? 100 : 30;
  const query: GetChatMessagesQuery = {
    offset: 0,
    limit: limit,
    downloadMedia: false,
    merge: true,
  };
  const afterMs = Date.now() - daysToMs(request.days);
  const after = Math.floor(afterMs / 1000);
  const filter: GetChatMessagesFilter = {
    'filter.ack': WAMessageAck.DEVICE,
    'filter.fromMe': false,
    'filter.timestamp.gte': after,
  };
  return {
    query: query,
    filter: filter,
  };
}
