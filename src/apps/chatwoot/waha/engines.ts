import * as lodash from 'lodash';
import type { proto } from '@adiwajshing/baileys';
import { WhatsAppMessage } from '@waha/apps/chatwoot/storage';
import { WAHAEngine } from '@waha/structures/enums.dto';
import { getEngineName } from '@waha/version';
import { Message as MessageInstance } from 'whatsapp-web.js/src/structures';
import { Jid } from '@waha/core/engines/const';
import { isLidUser, isPnUser, toCusFormat } from '@waha/core/utils/jids';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import { WAMessage } from '@waha/structures/responses.dto';
import { CallData } from '@waha/structures/calls.dto';
import { getContextInfo } from '@waha/core/utils/pwa';

export interface QuotedMedia {
  url?: string;
  directPath: string;
  mediaKey?: string;
  mimetype: string;
  mediaType: string;
}

interface IEngineHelper {
  ChatID(message: WAMessage | any): string;

  CallChatID(call: CallData | any): string;

  IsReplyToStatus(
    message: WAMessage,
    protoMessage: proto.Message | null,
  ): boolean;

  WhatsAppMessageKeys(message: any): WhatsAppMessage;

  IterateMessages<T extends { timestamp: number }>(
    messages: AsyncGenerator<T>,
  ): AsyncGenerator<T>;

  ContactIsMy(contact);

  FilterChatIdsForMessages(chats: string[]): string[];

  SupportsAllChatForMessage(): boolean;

  ExtractQuotedMedia(replyData: any): QuotedMedia | null;
}

class NOWEBHelper implements IEngineHelper {
  ChatID(message: WAMessage): string {
    return message.from;
  }

  CallChatID(call: CallData): string {
    return call.from;
  }

  IsReplyToStatus(
    message: WAMessage,
    protoMessage: proto.Message | null,
  ): boolean {
    void message;
    return getContextInfo(protoMessage)?.remoteJid === Jid.BROADCAST;
  }

  WhatsAppMessageKeys(message: any): WhatsAppMessage {
    const timestamp = parseInt(message.messageTimestamp) * 1000;
    return {
      timestamp: new Date(timestamp),
      from_me: message.key.fromMe,
      chat_id: toCusFormat(message.key.remoteJid),
      message_id: message.key.id,
      participant: message.key.participant,
    };
  }

  IterateMessages<T extends { timestamp: number }>(
    messages: AsyncGenerator<T>,
  ): AsyncGenerator<T> {
    return messages;
  }

  FilterChatIdsForMessages(chats: string[]): string[] {
    return preferPnChats(chats);
  }

  ContactIsMy(contact) {
    return true;
  }

  SupportsAllChatForMessage(): boolean {
    return true;
  }

  ExtractQuotedMedia(replyData: any): QuotedMedia | null {
    return extractProtoQuotedMedia(replyData);
  }
}

class GOWSHelper implements IEngineHelper {
  ChatID(message: WAMessage): string {
    return message.from;
  }

  CallChatID(call: CallData): string {
    return call._data?.CallCreator || call.from;
  }

  IsReplyToStatus(
    message: WAMessage,
    protoMessage: proto.Message | null,
  ): boolean {
    void message;
    return getContextInfo(protoMessage)?.remoteJid === Jid.BROADCAST;
  }

  /**
   * Parse API response and get the data
   * API Response depends on engine right now
   */
  WhatsAppMessageKeys(message: any): WhatsAppMessage {
    const Info = message._data.Info;
    const timestamp = new Date(Info.Timestamp).getTime();
    return {
      timestamp: new Date(timestamp),
      from_me: Info.IsFromMe,
      chat_id: toCusFormat(Info.Chat),
      message_id: Info.ID,
      participant: Info.Sender ? toCusFormat(Info.Sender) : null,
    };
  }

  IterateMessages<T extends { timestamp: number }>(
    messages: AsyncGenerator<T>,
  ): AsyncGenerator<T> {
    return messages;
  }

  FilterChatIdsForMessages(chats: string[]): string[] {
    return preferPnChats(chats);
  }

  SupportsAllChatForMessage(): boolean {
    return true;
  }

  ContactIsMy(contact) {
    return true;
  }

  ExtractQuotedMedia(replyData: any): QuotedMedia | null {
    return extractProtoQuotedMedia(replyData, true);
  }
}

class WEBJSHelper implements IEngineHelper {
  ChatID(message: WAMessage): string {
    return message._data?.id?.remote || message.from;
  }

  CallChatID(call: CallData): string {
    return call.from;
  }

  IsReplyToStatus(
    message: WAMessage,
    protoMessage: proto.Message | null,
  ): boolean {
    void protoMessage;
    return message._data?.quotedRemoteJid === Jid.BROADCAST;
  }

  /**
   * Parse API response and get the data for WEBJS engine
   */
  WhatsAppMessageKeys(message: MessageInstance): WhatsAppMessage {
    return {
      timestamp: new Date(message.timestamp * 1000),
      from_me: message.fromMe,
      chat_id: message.id.remote,
      message_id: message.id.id,
      participant: message.author || null,
    };
  }

  /**
   * WEBJS API lacks server-side sorting hooks, so we buffer and sort by the unix timestamp in memory.
   */
  async *IterateMessages<T extends { timestamp: number }>(
    messages: AsyncGenerator<T>,
  ): AsyncGenerator<T> {
    const buffer: T[] = [];

    for await (const message of messages) {
      buffer.push(message);
    }

    const sorted = lodash.sortBy(buffer, (item) => item.timestamp);

    for (const message of sorted) {
      yield message;
    }
  }

  FilterChatIdsForMessages(chats: string[]): string[] {
    return preferPnChats(chats);
  }

  SupportsAllChatForMessage(): boolean {
    return false;
  }

  ContactIsMy(contact) {
    return contact.isMyContact;
  }

  ExtractQuotedMedia(replyData: any): QuotedMedia | null {
    return extractBrowserQuotedMedia(replyData);
  }
}

class WPPHelper implements IEngineHelper {
  ChatID(message: WAMessage): string {
    return toCusFormat(parseMessageIdSerialized(message.id as any).remoteJid);
  }

  CallChatID(call: CallData): string {
    return call.from;
  }

  IsReplyToStatus(
    message: WAMessage,
    protoMessage: proto.Message | null,
  ): boolean {
    void protoMessage;
    return message._data?.quotedRemoteJid === Jid.BROADCAST;
  }

  /**
   * Parse API response and get the data for WPP engine.
   * WPP returns message.id as a composite string "fromMe_chatId_msgId".
   */
  WhatsAppMessageKeys(message: any): WhatsAppMessage {
    const parsed = parseMessageIdSerialized(message.id);
    return {
      timestamp: new Date(message.timestamp * 1000),
      from_me: parsed.fromMe,
      chat_id: toCusFormat(parsed.remoteJid),
      message_id: parsed.id,
      participant: message.author || null,
    };
  }

  /**
   * WPP API lacks server-side sorting hooks, so we buffer and sort by the unix timestamp in memory.
   */
  async *IterateMessages<T extends { timestamp: number }>(
    messages: AsyncGenerator<T>,
  ): AsyncGenerator<T> {
    const buffer: T[] = [];

    for await (const message of messages) {
      buffer.push(message);
    }

    const sorted = lodash.sortBy(buffer, (item) => item.timestamp);

    for (const message of sorted) {
      yield message;
    }
  }

  FilterChatIdsForMessages(chats: string[]): string[] {
    return preferPnChats(chats);
  }

  SupportsAllChatForMessage(): boolean {
    return false;
  }

  ContactIsMy(contact) {
    return contact.isMyContact;
  }

  ExtractQuotedMedia(replyData: any): QuotedMedia | null {
    return extractBrowserQuotedMedia(replyData);
  }
}

// Choose the right EngineHelper based on getEngineName() function
let engineHelper: IEngineHelper;

switch (getEngineName()) {
  case WAHAEngine.NOWEB:
    engineHelper = new NOWEBHelper();
    break;
  case WAHAEngine.GOWS:
    engineHelper = new GOWSHelper();
    break;
  case WAHAEngine.WEBJS:
    engineHelper = new WEBJSHelper();
    break;
  case WAHAEngine.WPP:
    engineHelper = new WPPHelper();
    break;
  default:
    engineHelper = new WEBJSHelper(); // Default to WEBJS as it's the default engine
}

export const EngineHelper = engineHelper;

//
// Quoted media extraction helpers
//

function extractProtoQuotedMedia(
  replyData: any,
  capitalUrl = false,
): QuotedMedia | null {
  if (!replyData) {
    return null;
  }
  const mediaTypes: Array<[string, string]> = [
    ['imageMessage', 'image'],
    ['videoMessage', 'video'],
    ['audioMessage', 'audio'],
  ];
  for (const [key, mediaType] of mediaTypes) {
    const msg = replyData[key];
    if (!msg) {
      continue;
    }
    const url: string | undefined = capitalUrl ? msg.URL ?? msg.url : msg.url;
    const directPath: string = msg.directPath;
    const mimetype: string = msg.mimetype;
    if (!directPath || !mimetype) {
      continue;
    }
    return {
      url: url,
      directPath: directPath,
      mediaKey: msg.mediaKey,
      mimetype: mimetype,
      mediaType: mediaType,
    };
  }
  return null;
}

function extractBrowserQuotedMedia(replyData: any): QuotedMedia | null {
  if (!replyData) {
    return null;
  }
  const kind: string = replyData.kind ?? replyData.type;
  if (kind !== 'image' && kind !== 'video' && kind !== 'audio') {
    return null;
  }
  const directPath: string = replyData.directPath;
  const mimetype: string = replyData.mimetype;
  if (!directPath || !mimetype) {
    return null;
  }
  return {
    url: replyData.deprecatedMms3Url,
    directPath: directPath,
    mediaKey: replyData.mediaKey,
    mimetype: mimetype,
    mediaType: kind,
  };
}

function preferPnChats(chats: string[]): string[] {
  const unique = lodash.uniq(chats ?? []);
  const hasPn = unique.some(isPnUser);
  const hasLid = unique.some(isLidUser);
  if (hasPn && hasLid) {
    // Prefer @c.us / phone chats when both formats exist to avoid duplicate fetches.
    return unique.filter(isPnUser);
  }
  return unique;
}
