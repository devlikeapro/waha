import ChatwootClient, {
  ApiError as ChatWootAPIError,
  public_contact_create_update_payload,
} from '@figuro/chatwoot-sdk';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import {
  AvatarUpdateMode,
  ContactService,
} from '@waha/apps/chatwoot/client/ContactService';
import { Conversation } from '@waha/apps/chatwoot/client/Conversation';
import {
  ContactIds,
  ConversationResult,
  ConversationService,
} from '@waha/apps/chatwoot/client/ConversationService';
import { ChatWootAPIConfig } from '@waha/apps/chatwoot/client/interfaces';
import { InboxContactInfo } from '@waha/apps/chatwoot/contacts/InboxContactInfo';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';

import { CacheForConfig } from '../cache/ConversationCache';
import { IConversationCache } from '../cache/IConversationCache';
import { AttributeKey } from '@waha/apps/chatwoot/const';

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

  private async getByContactInfo(
    contactInfo: ContactInfo,
    upsert: boolean,
  ): Promise<ContactIds | null> {
    const chatId = contactInfo.ChatId();

    // Check cache for chat id
    if (this.cache.has(chatId)) {
      return this.cache.get(chatId);
    }

    let [cwContact, created] =
      await this.contactService.findOrCreateContact(contactInfo);

    // Update custom attributes - always
    this.logger.debug(
      `Updating if required contact custom attributes for chat.id: ${chatId}, contact.id: ${cwContact.data.id}`,
    );
    const attributes = await contactInfo.Attributes();
    // Keep the current chat id in sync to reply using the latest address.
    attributes[AttributeKey.WA_CHAT_ID] = chatId;
    await this.contactService.upsertCustomAttributes(
      cwContact.data,
      attributes,
    );
    await this.contactService.updateAvatar(
      cwContact,
      contactInfo,
      AvatarUpdateMode.IF_MISSING,
    );
    this.logger.debug(
      `Using contact for chat.id: ${chatId}, contact.id: ${cwContact.data.id}, contact.sourceId: ${cwContact.sourceId}`,
    );

    //
    // Get or create a conversation for this inbox
    //
    const contactIds = {
      id: cwContact.data.id,
      sourceId: cwContact.sourceId,
    };
    let conversation: ConversationResult;
    if (upsert) {
      conversation = await this.conversationService.upsert(contactIds);
    } else {
      conversation = await this.conversationService.find(contactIds);
      if (!conversation) {
        // Nothing found, do not save it in cache
        return null;
      }
    }

    this.logger.debug(
      `Using conversation for chat.id: ${chatId}, conversation.id: ${conversation.id}, contact.id: ${cwContact.sourceId}`,
    );

    // Save to cache
    const ids = {
      id: conversation.id,
      sourceId: cwContact.sourceId,
    };
    this.cache.set(chatId, ids);
    return ids;
  }

  private async conversationByContact(
    contactInfo: ContactInfo,
    upsert: boolean,
  ): Promise<Conversation | null> {
    const chatId = contactInfo.ChatId();
    const ids = await this.getByContactInfo(contactInfo, upsert);
    if (!ids) {
      return null;
    }
    const conversation = new Conversation(
      this.accountAPI,
      this.config.accountId,
      ids.id,
      ids.sourceId,
    );
    conversation.onError = (err) => {
      if (err instanceof ChatWootAPIError) {
        // invalidate cache
        this.cache.delete(chatId);
        this.logger.error(`ApiError: ${err.message}`);
        this.logger.error(
          `ApiError occurred, invalidating cache for chat.id: ${chatId}, conversation.id: ${ids.id}, source.id: ${ids.sourceId}`,
        );
      }
    };
    return conversation;
  }

  /**
   * Find or create if not exists conversation for the contact
   */
  public async ConversationByContact(contactInfo: ContactInfo) {
    const conversation = await this.conversationByContact(contactInfo, true);
    if (!conversation) {
      // Shouldn't happen, but for type safety
      throw new Error('Conversation could not be created or found');
    }
    return conversation;
  }

  /**
   * Find suitable conversation for the contact (based on filters)
   * If nothing found - it doesn't create a new one
   */
  public async FindConversationByContact(contactInfo: ContactInfo) {
    return this.conversationByContact(contactInfo, false);
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
    this.logger.debug(`Resetting cache chat ids: ${chatIds.join(', ')}`);
    for (const chatId of chatIds) {
      this.cache.delete(chatId);
    }
  }

  public ResetMismatchedCache(chatIds: Array<string>, contactId: number) {
    for (const chatId of chatIds) {
      if (!this.cache.has(chatId)) {
        continue;
      }
      const current = this.cache.get(chatId);
      if (current.id !== contactId) {
        this.logger.debug(
          `Resetting cache for chat id: ${chatId}, value changed from ${current} to ${contactId}`,
        );
        this.cache.delete(chatId);
      }
    }
  }

  public async markConversationAsRead(
    conversationId: number,
    sourceId: string,
  ): Promise<void> {
    await this.conversationService.markAsRead(conversationId, sourceId);
  }
}
