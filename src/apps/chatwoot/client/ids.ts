import { AttributeKey, INBOX_CONTACT_CHAT_ID } from '@waha/apps/chatwoot/const';
import * as lodash from 'lodash';
import { WhatsAppMessage } from '@waha/apps/chatwoot/storage';
import { buildMessageId } from '@waha/core/engines/noweb/session.noweb.core';
import { isLidUser } from '@waha/core/utils/jids';

export function GetJID(contact: any): string | null {
  return contact?.custom_attributes?.[AttributeKey.WA_JID];
}

export function GetLID(contact: any): string | null {
  return contact?.custom_attributes?.[AttributeKey.WA_LID];
}

export function GetChatID(contact: any): string | null {
  return contact?.custom_attributes?.[AttributeKey.WA_CHAT_ID];
}

export function GetAllChatIDs(contact: any): Array<string> {
  const attrs = contact?.custom_attributes || {};
  const ids = [
    attrs[AttributeKey.WA_CHAT_ID],
    attrs[AttributeKey.WA_JID],
    attrs[AttributeKey.WA_LID],
  ];
  return lodash.uniq(ids.filter(Boolean));
}

export function FindChatID(contact: any): string | null {
  if (GetChatID(contact)) {
    return GetChatID(contact);
  }
  if (GetJID(contact)) {
    return GetJID(contact);
  }
  if (GetLID(contact)) {
    return GetLID(contact);
  }
  return null;
}

export function SerializeWhatsAppKey(message: WhatsAppMessage): string {
  const key = {
    id: message.message_id,
    remoteJid: message.chat_id,
    fromMe: Boolean(message.from_me),
    participant: message.participant,
  };
  return buildMessageId(key);
}

export function ContactAttr(chatId: string): AttributeKey {
  if (isLidUser(chatId)) {
    return AttributeKey.WA_LID;
  } else {
    return AttributeKey.WA_JID;
  }
}

export function IsCommandsChat(body): boolean {
  const sender = body?.conversation?.meta?.sender;
  const chatId = FindChatID(sender);
  return chatId === INBOX_CONTACT_CHAT_ID;
}
