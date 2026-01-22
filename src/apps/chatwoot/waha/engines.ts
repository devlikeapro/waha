import * as lodash from 'lodash';
import { WhatsAppMessage } from '@waha/apps/chatwoot/storage';
import { WAHAEngine } from '@waha/structures/enums.dto';
import { getEngineName } from '@waha/version';
import { Message as MessageInstance } from 'whatsapp-web.js/src/structures';
import { isLidUser, isPnUser, toCusFormat } from '@waha/core/utils/jids';
import { WAMessage } from '@waha/structures/responses.dto';
import { CallData } from '@waha/structures/calls.dto';

interface IEngineHelper {
  ChatID(message: WAMessage | any): string;

  CallChatID(call: CallData | any): string;

  WhatsAppMessageKeys(message: any): WhatsAppMessage;

  IterateMessages<T extends { timestamp: number }>(
    messages: AsyncGenerator<T>,
  ): AsyncGenerator<T>;

  ContactIsMy(contact);

  FilterChatIdsForMessages(chats: string[]): string[];

  SupportsAllChatForMessage(): boolean;
}

class NOWEBHelper implements IEngineHelper {
  ChatID(message: WAMessage): string {
    return message.from;
  }

  CallChatID(call: CallData): string {
    return call.from;
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
    return chats;
  }

  ContactIsMy(contact) {
    return true;
  }

  SupportsAllChatForMessage(): boolean {
    return true;
  }
}

class GOWSHelper implements IEngineHelper {
  ChatID(message: WAMessage): string {
    return message.from;
  }

  CallChatID(call: CallData): string {
    return call._data?.CallCreator || call.from;
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
    return chats;
  }

  SupportsAllChatForMessage(): boolean {
    return true;
  }

  ContactIsMy(contact) {
    return true;
  }
}

class WEBJSHelper implements IEngineHelper {
  ChatID(message: WAMessage): string {
    return message._data?.id?.remote || message.from;
  }

  CallChatID(call: CallData): string {
    return call.from;
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
    if (chats.length == 2) {
      const lidChat = chats.find(isLidUser);
      const cusChat = chats.find(isPnUser);
      if (lidChat && cusChat) {
        return [lidChat];
      }
      // WEBJS engine merges messages for @lid and @c.us
      // into single chat, so it's fine to pull only from one
    }
    // Otherwise - return the original
    return chats;
  }

  SupportsAllChatForMessage(): boolean {
    return false;
  }

  ContactIsMy(contact) {
    return contact.isMyContact;
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
  default:
    engineHelper = new WEBJSHelper(); // Default to WEBJS as it's the default engine
}

export const EngineHelper = engineHelper;
