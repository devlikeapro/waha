import ChatwootClient from '@figuro/chatwoot-sdk';
import type { conversation_message_create } from '@figuro/chatwoot-sdk/dist/models/conversation_message_create';
import type { conversation_message_update } from '@figuro/chatwoot-sdk/dist/models/conversation_message_update';
import { MessageType } from '@waha/apps/chatwoot/client/types';

export class Conversation {
  public onError: (e: any) => void;
  public overrideIncoming: any = null;

  constructor(
    private accountAPI: ChatwootClient,
    private accountId: number,
    public conversationId: number,
    public sourceId: string | null = null,
  ) {}

  public async send(data: conversation_message_create) {
    if (data.message_type === MessageType.INCOMING && this.overrideIncoming) {
      data = { ...data, ...this.overrideIncoming };
    }
    try {
      const message = await this.accountAPI.messages.create({
        accountId: this.accountId,
        conversationId: this.conversationId,
        data: data,
      });
      return message;
    } catch (err) {
      if (this.onError) {
        this.onError(err);
      }
      throw err;
    }
  }

  public async incoming(text: string) {
    let data: conversation_message_create = {
      content: text,
      message_type: MessageType.INCOMING as any,
    };
    if (this.overrideIncoming) {
      data = { ...data, ...this.overrideIncoming };
    }
    return this.send(data);
  }

  public async updateMessageStatus(
    messageId: number,
    status: 'delivered' | 'read',
  ) {
    // The SDK supports PATCH but its generated model omits Chatwoot's status field.
    const data: conversation_message_update & { status: 'delivered' | 'read' } =
      {
        status: status,
      };
    return this.accountAPI.messages.update({
      accountId: this.accountId,
      conversationId: this.conversationId,
      messageId: messageId,
      data: data,
    });
  }

  public async activity(text: string) {
    const data: conversation_message_create = {
      content: text,
      message_type: MessageType.ACTIVITY as any,
    };
    return this.send(data);
  }

  public async note(text: string) {
    const data: conversation_message_create = {
      content: text,
      private: true,
      message_type: MessageType.OUTGOING as any,
    };
    return this.send(data);
  }

  /**
   * Force a note message (private outgoing) for all communications
   */
  public forceNote() {
    this.overrideIncoming = {
      private: true,
      message_type: MessageType.OUTGOING as any,
    };
  }
}
