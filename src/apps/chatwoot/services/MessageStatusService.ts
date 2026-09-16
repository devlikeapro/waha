import { ContactConversationService } from '@waha/apps/chatwoot/client/ContactConversationService';
import { MessageStatus } from '@waha/apps/chatwoot/client/types';
import { MessageMappingService } from '@waha/apps/chatwoot/storage/MessageMappingService';
import { WhatsAppAckRepository } from '@waha/apps/chatwoot/storage/WhatsAppAckRepository';
import { ChatwootMessage } from '@waha/apps/chatwoot/storage/types';
import { WAMessageAck } from '@waha/structures/enums.dto';

export type ChatwootMessageStatusKey = Pick<
  ChatwootMessage,
  'conversation_id' | 'message_id' | 'parts'
>;

/**
 * Mirrors WhatsApp acks for messages sent from Chatwoot into Chatwoot message status
 */
export class MessageStatusService {
  constructor(
    private readonly mappingService: MessageMappingService,
    private readonly ackRepository: WhatsAppAckRepository,
    private readonly contactConversationService: ContactConversationService,
  ) {}

  /**
   * Saves the ack for a WhatsApp message, keeps the highest one
   */
  async record(
    messageId: string,
    ack: WAMessageAck,
    timestamp: Date,
  ): Promise<void> {
    await this.ackRepository.record(messageId, ack, timestamp);
  }

  /**
   * Pushes the status to Chatwoot once every part has an ack, uses the lowest one
   * @returns the status sent to Chatwoot, null if nothing to update yet
   */
  async sync(message: ChatwootMessageStatusKey): Promise<MessageStatus | null> {
    // Messages mirrored from WhatsApp (and old rows) do not know how many parts were sent
    if (!message.parts) {
      return null;
    }
    const parts = await this.mappingService.getWhatsAppMessage(message);
    if (parts.length !== message.parts) {
      return null;
    }
    const ack = await this.ackRepository.minimumAck(
      parts.map((part) => part.message_id),
    );
    if (ack === null || ack < WAMessageAck.DEVICE) {
      return null;
    }
    let status = MessageStatus.DELIVERED;
    if (ack >= WAMessageAck.READ) {
      status = MessageStatus.READ;
    }
    // Chatwoot only moves status forward, so re-sending the same status is harmless
    await this.contactConversationService
      .ConversationById(message.conversation_id)
      .updateMessageStatus(message.message_id, status);
    return status;
  }

  cleanup(removeAfter: Date): Promise<number> {
    return this.ackRepository.deleteOlderThan(removeAfter);
  }

  purge(): Promise<number> {
    return this.ackRepository.deleteAll();
  }
}
