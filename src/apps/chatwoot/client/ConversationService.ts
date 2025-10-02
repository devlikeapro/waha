import ChatwootClient, { contact_conversations } from '@figuro/chatwoot-sdk';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import {
  ChatWootAPIConfig,
  ChatWootInboxAPI,
} from '@waha/apps/chatwoot/client/interfaces';
import type { conversation } from '@figuro/chatwoot-sdk/dist/models/conversation';
import { ConversationSelector } from '@waha/apps/chatwoot/services/ConversationSelector';

export type ConversationResult = Pick<conversation, 'id' | 'account_id'>;

export interface ContactIds {
  id: number;
  sourceId: string;
}

export class ConversationService {
  constructor(
    private config: ChatWootAPIConfig,
    private accountAPI: ChatwootClient,
    private inboxAPI: ChatWootInboxAPI,
    private selector: ConversationSelector,
    private logger: ILogger,
  ) {}

  private async find(contact: ContactIds): Promise<ConversationResult | null> {
    const result: { payload: contact_conversations } =
      (await this.accountAPI.contacts.listConversations({
        accountId: this.config.accountId,
        id: contact.id,
      })) as any;
    const conversations = result.payload;
    return this.selector.select(conversations);
  }

  private async create(contact: ContactIds): Promise<ConversationResult> {
    const conversation = await this.inboxAPI.conversations.create({
      inboxIdentifier: this.config.inboxIdentifier,
      contactIdentifier: contact.sourceId,
    });
    this.logger.info(
      `Created conversation.id: ${conversation.id} for contact.id: ${contact.id}, contact.sourceId: ${contact.sourceId}`,
    );
    return conversation;
  }

  async upsert(contact: ContactIds): Promise<ConversationResult> {
    let conversation = await this.find(contact);
    if (!conversation) {
      conversation = await this.create(contact);
    }
    this.logger.info(
      `Using conversation.id: ${conversation.id} for contact.id: ${contact.id}, contact.sourceId: ${contact.sourceId}`,
    );
    return conversation;
  }

  async markAsRead(conversationId: number, sourceId: string): Promise<void> {
    try {
      // Call the update_last_seen endpoint using direct HTTP request
      // since the SDK doesn't have this method
      const axios = require('axios');
      const response = await axios.post(
        `${this.config.url}/public/api/v1/inboxes/${this.config.inboxIdentifier}/contacts/${sourceId}/conversations/${conversationId}/update_last_seen`,
        {},
        {
          headers: {
            'api_access_token': this.config.inboxIdentifier,
            'Content-Type': 'application/json',
          },
        }
      );
      
      this.logger.info(
        `Marked conversation.id: ${conversationId} as read in inbox: ${this.config.inboxIdentifier} for contact: ${sourceId}`,
      );
    } catch (err) {
      this.logger.error(
        `Error marking conversation.id: ${conversationId} as read: ${err.message}`,
      );
      throw err;
    }
  }
}
