import ChatwootClient, {
  ApiError as ChatWootAPIError,
  public_contact_create_update_payload,
} from '@figuro/chatwoot-sdk';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { ContactService } from '@waha/apps/chatwoot/client/ContactService';
import { Conversation } from '@waha/apps/chatwoot/client/Conversation';
import { ConversationService } from '@waha/apps/chatwoot/client/ConversationService';
import { ChatWootAPIConfig } from '@waha/apps/chatwoot/client/interfaces';
import { InboxContactInfo } from '@waha/apps/chatwoot/contacts/InboxContactInfo';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';

import { CacheForConfig } from '../cache/ConversationCache';
import {
  ConversationId,
  IConversationCache,
} from '../cache/IConversationCache';

export interface ContactInfo {
  ChatId(): string;

  AvatarUrl(): Promise<string | null>;

  Attributes(): Promise<any>;

  PublicContactCreate(): Promise<public_contact_create_update_payload>;
}

export class ContactConversationService {
  private cache: IConversationCache;

  constructor(
    private config: ChatWootAPIConfig,
    private contactService: ContactService,
    private conversationService: ConversationService,
    private accountAPI: ChatwootClient,
    private logger: ILogger,
    private l: Locale,
  ) {
    this.cache = CacheForConfig(config);
  }

  private async upsertByContactInfo(
    contactInfo: ContactInfo,
  ): Promise<ConversationId> {
    const chatId = contactInfo.ChatId();

    // Check cache for chat id
    if (this.cache.has(chatId)) {
      return this.cache.get(chatId);
    }

    //
    // Find or create contact
    //
    let contact = await this.contactService.searchByAnyID(chatId);
    if (!contact) {
      const request = await contactInfo.PublicContactCreate();
      contact = await this.contactService.create(chatId, request);
    }

    // Update custom attributes - always
    const attributes = await contactInfo.Attributes();
    this.logger.info(
      `Updating if required contact custom attributes for chat.id: ${chatId}, contact.id: ${contact.data.id}`,
    );
    await this.contactService.upsertCustomAttributes(contact.data, attributes);

    // Update Avatar if nothing, but keep the original one if any
    if (!contact.data.thumbnail) {
      const avatarUrl = await contactInfo.AvatarUrl().catch((err) => {
        this.logger.warn(
          `Error getting avatar for chat.id from WhatsApp: ${chatId}`,
        );
        this.logger.warn(err);
        return null;
      });
      if (avatarUrl) {
        this.contactService.updateAvatarUrlSafe(contact.data.id, avatarUrl);
      }
    }

    this.logger.info(
      `Using contact for chat.id: ${chatId}, contact.id: ${contact.data.id}, contact.sourceId: ${contact.sourceId}`,
    );

    //
    // Get or create a conversation for this inbox
    //
    const conversation = await this.conversationService.upsert({
      id: contact.data.id,
      sourceId: contact.sourceId,
    });
    this.logger.info(
      `Using conversation for chat.id: ${chatId}, conversation.id: ${conversation.id}, contact.id: ${contact.sourceId}`,
    );

    // Save to cache
    this.cache.set(chatId, conversation.id);
    return conversation.id;
  }

  public async ConversationByContact(
    contactInfo: ContactInfo,
  ): Promise<Conversation> {
    const chatId = contactInfo.ChatId();
    const conversationId = await this.upsertByContactInfo(contactInfo);
    const conversation = new Conversation(
      this.accountAPI,
      this.config.accountId,
      conversationId,
    );
    conversation.onError = (err) => {
      if (err instanceof ChatWootAPIError) {
        // invalidate cache
        this.cache.delete(chatId);
        this.logger.error(`ApiError: ${err.message}`);
        this.logger.error(
          `ApiError occurred, invalidating cache for chat.id: ${chatId}, conversation.id: ${conversationId}`,
        );
      }
    };
    return conversation;
  }

  public ConversationById(conversationId: number): Conversation {
    return new Conversation(
      this.accountAPI,
      this.config.accountId,
      conversationId,
    );
  }

  /**
   * Build specific contact for inbox notifications
   * @constructor
   */
  public async InboxNotifications() {
    return this.ConversationByContact(new InboxContactInfo(this.l));
  }

  public ResetCache(chatIds: Array<string>) {
    this.logger.info(`Resetting cache chat ids: ${chatIds.join(', ')}`);
    for (const chatId of chatIds) {
      this.cache.delete(chatId);
    }
  }

  public ResetMismatchedCache(chatIds: Array<string>, value: ConversationId) {
    for (const chatId of chatIds) {
      if (!this.cache.has(chatId)) {
        continue;
      }
      const current = this.cache.get(chatId);
      if (current !== value) {
        this.logger.info(
          `Resetting cache for chat id: ${chatId}, value changed from ${current} to ${value}`,
        );
        this.cache.delete(chatId);
      }
    }
  }

  public async markConversationAsRead(conversationId: number, sourceId: string): Promise<void> {
    await this.conversationService.markAsRead(conversationId, sourceId);
  }

  public async getSourceIdByChatId(chatId: string): Promise<string | null> {
    const contact = await this.contactService.searchByAnyID(chatId);
    return contact ? contact.sourceId : null;
  }
}
