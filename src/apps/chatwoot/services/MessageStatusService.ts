import { ContactConversationService } from '@waha/apps/chatwoot/client/ContactConversationService';
import { MessageMappingService } from '@waha/apps/chatwoot/storage/MessageMappingService';
import { MessageAckRepository } from '@waha/apps/chatwoot/storage/MessageAckRepository';
import { ChatwootMessage } from '@waha/apps/chatwoot/storage/types';
import { WAMessageAck } from '@waha/structures/enums.dto';

export class MessageStatusService {
  constructor(
    private readonly mappings: MessageMappingService,
    private readonly acknowledgements: MessageAckRepository,
    private readonly conversations: ContactConversationService,
  ) {}

  async sync(
    message: Pick<
      ChatwootMessage,
      'conversation_id' | 'message_id' | 'expected_parts'
    >,
  ) {
    // Historical/imported mappings do not say whether all parts were sent.
    if (!message.expected_parts) {
      return null;
    }
    const parts = await this.mappings.getWhatsAppMessage(message);
    if (parts.length !== message.expected_parts) {
      return null;
    }
    const ack = await this.acknowledgements.minimumAck(
      parts.map((part) => part.message_id),
    );
    if (ack < WAMessageAck.DEVICE) {
      return null;
    }
    const status = ack >= WAMessageAck.READ ? 'read' : 'delivered';
    // Use the mapped conversation, never the newest conversation for a contact.
    await this.conversations
      .ConversationById(message.conversation_id)
      .updateMessageStatus(message.message_id, status);
    return status;
  }
}
