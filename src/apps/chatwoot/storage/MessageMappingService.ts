import { Knex } from 'knex';

import { ChatwootMessageRepository } from './ChatwootMessageRepository';
import { MessageMappingRepository } from './MessageMappingRepository';
import {
  ChatWootCombinedKey,
  ChatwootMessage,
  MessageMapping,
  WhatsAppMessage,
} from './types';
import { WhatsAppMessageRepository } from './WhatsAppMessageRepository';

export class MessageMappingService {
  constructor(
    private readonly knex: Knex,
    private whatsAppMessageRepository: WhatsAppMessageRepository,
    private chatwootMessageRepository: ChatwootMessageRepository,
    private messageMappingRepository: MessageMappingRepository,
  ) {}

  /**
   * Cleans up messages older than the specified date
   * @param removeAfter Date before which messages should be removed
   * @returns Object containing the number of deleted WhatsApp and Chatwoot messages
   */
  async cleanup(removeAfter: Date): Promise<number> {
    const trx = await this.knex.transaction();
    try {
      // Delete WhatsApp messages older than removeAfter
      const whatsapp =
        await this.whatsAppMessageRepository.deleteMessagesOlderThan(
          trx,
          removeAfter,
        );
      const chatwoot =
        await this.chatwootMessageRepository.deleteMessagesOlderThan(
          trx,
          removeAfter,
        );
      await trx.commit();
      return whatsapp + chatwoot;
    } finally {
      await trx.commit();
    }
  }

  /**
   * Deletes all stored messages and mappings for the app.
   */
  async purge(): Promise<number> {
    const trx = await this.knex.transaction();
    try {
      const mappings =
        await this.messageMappingRepository.deleteAllWithTrx(trx);
      const chatwoot =
        await this.chatwootMessageRepository.deleteAllWithTrx(trx);
      const whatsapp =
        await this.whatsAppMessageRepository.deleteAllWithTrx(trx);
      await trx.commit();
      return mappings + chatwoot + whatsapp;
    } catch (e) {
      await trx.rollback();
      throw e;
    }
  }

  async map(
    chatwoot: ChatwootMessage,
    whatsapp: WhatsAppMessage,
    part?: number,
  ): Promise<MessageMapping> {
    const trx = await this.knex.transaction();
    try {
      const chatwootMessage =
        await this.chatwootMessageRepository.upsertWithTrx(trx, chatwoot);
      chatwoot.id = chatwootMessage.id;
      const whatsappMessage =
        await this.whatsAppMessageRepository.upsertWithTrx(trx, whatsapp);
      whatsapp.id = whatsappMessage.id;
      const mapping = await this.messageMappingRepository.upsertMappingWithTrx(
        trx,
        chatwootMessage,
        whatsappMessage,
        part ?? 1,
      );
      return mapping;
    } catch (e) {
      await trx.rollback();
      throw e;
    } finally {
      await trx.commit();
    }
  }

  async getChatWootMessage(
    whatsapp: Pick<WhatsAppMessage, 'chat_id' | 'message_id'>,
  ): Promise<ChatwootMessage | null> {
    const message = await this.whatsAppMessageRepository.getByMessageId(
      whatsapp.message_id,
    );
    if (!message) {
      return null;
    }
    const mapping = await this.messageMappingRepository.getByWhatsAppMessageId(
      message.id,
    );
    if (!mapping) {
      return null;
    }
    const chatwoot = await this.chatwootMessageRepository.getById(
      mapping.chatwoot_message_id,
    );
    if (!chatwoot) {
      return null;
    }
    return chatwoot;
  }

  async getWhatsAppMessage(
    chatwoot: ChatWootCombinedKey,
  ): Promise<WhatsAppMessage[]> {
    const messages =
      await this.chatwootMessageRepository.getByCombinedKey(chatwoot);
    if (!messages) {
      return [];
    }
    const mappings = [];
    for (const message of messages) {
      const mapping =
        await this.messageMappingRepository.getByChatwootMessageId(message.id);
      if (mapping) {
        mappings.push(mapping);
      }
    }
    const whatsapp = [];
    for (const mapping of mappings) {
      const message = await this.whatsAppMessageRepository.getById(
        mapping.whatsapp_message_id,
      );
      if (message) {
        whatsapp.push(message);
      }
    }
    return whatsapp;
  }

  async getMappingByChatwootCombinedKeyAndPart(
    chatwoot: ChatWootCombinedKey,
    part: number,
  ): Promise<MessageMapping | null> {
    const chatwootMessages =
      await this.chatwootMessageRepository.getByCombinedKey(chatwoot);
    if (!chatwootMessages || chatwootMessages.length === 0) {
      return null;
    }
    for (const cw of chatwootMessages) {
      const mapping =
        await this.messageMappingRepository.getByChatwootMessageIdAndPart(
          cw.id,
          part,
        );
      if (mapping) {
        return mapping;
      }
    }
    return null;
  }
}
