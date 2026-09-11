import { Processor } from '@nestjs/bullmq';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { ContactConversationService } from '@waha/apps/chatwoot/client/ContactConversationService';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { EventData } from '@waha/apps/chatwoot/consumers/types';
import {
  ChatWootWAHABaseConsumer,
  IMessageInfo,
} from '@waha/apps/chatwoot/consumers/waha/base';
import { WhatsAppContactInfo } from '@waha/apps/chatwoot/contacts/WhatsAppContactInfo';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { WAHASessionAPI } from '@waha/apps/app_sdk/waha/WAHASelf';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WAHAWebhookMessageAck } from '@waha/structures/webhooks.dto';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import {
  ShouldMarkAsReadInChatWoot,
  ShouldUpdateMessageStatusInChatWoot,
} from '@waha/apps/chatwoot/consumers/waha/message.ack.utils';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import { MessageMappingService } from '@waha/apps/chatwoot/storage';
import { MessageAckRepository } from '@waha/apps/chatwoot/storage/MessageAckRepository';
import { MessageStatusService } from '@waha/apps/chatwoot/services/MessageStatusService';

@Processor(QueueName.WAHA_MESSAGE_ACK, { concurrency: JOB_CONCURRENCY })
export class WAHAMessageAckConsumer extends ChatWootWAHABaseConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'WAHAMessageAckConsumer');
  }

  ShouldProcess(event: any): boolean {
    return ShouldUpdateMessageStatusInChatWoot(event);
  }

  GetChatId(event: WAHAWebhookMessageAck): string {
    return event.payload.from;
  }

  async Process(
    job: Job<EventData, any, WAHAEvents>,
    info: IMessageInfo,
  ): Promise<void> {
    const container = await this.DIContainer(job, job.data.app);
    const event = job.data.event as WAHAWebhookMessageAck;
    const session = new WAHASessionAPI(event.session, container.WAHASelf());
    const handler = new MessageAckHandler(
      container.ContactConversationService(),
      container.MessageMappingService(),
      container.Logger(),
      info,
      session,
      container.Locale(),
      container.MessageAckRepository(),
      container.MessageStatusService(),
      container.ChatWootConfig().conversations.markAsRead,
    );
    // Let the existing queue retry API/storage failures instead of losing ACKs.
    await handler.handle(event);
  }
}

export class MessageAckHandler {
  constructor(
    private readonly contactConversationService: ContactConversationService,
    protected mappingService: MessageMappingService,
    private readonly logger: ILogger,
    private readonly info: IMessageInfo,
    private readonly session: WAHASessionAPI,
    private readonly locale: Locale,
    private readonly acknowledgements: MessageAckRepository,
    private readonly statusService: MessageStatusService,
    private readonly markAsRead: boolean,
  ) {}

  async handle(event: WAHAWebhookMessageAck): Promise<void> {
    const payload = event.payload;

    const key = parseMessageIdSerialized(payload.id);
    await this.acknowledgements.record(
      key.id,
      payload.ack,
      new Date(event.timestamp),
    );
    const chatwoot = await this.mappingService.getChatWootMessage({
      chat_id: null,
      message_id: key.id,
    });
    // No chatwoot message found, so we don't mark it as read
    // Filters out old messages and some service ack messages
    if (!chatwoot) {
      return;
    }

    this.info.onConversationId(chatwoot.conversation_id);
    const status = await this.statusService.sync(chatwoot);
    if (!this.markAsRead || !ShouldMarkAsReadInChatWoot(event)) {
      return;
    }
    if (chatwoot.expected_parts && status !== 'read') {
      return;
    }

    const contactInfo = WhatsAppContactInfo(
      this.session,
      payload.from,
      this.locale,
    );
    const conversation =
      await this.contactConversationService.FindConversationByContact(
        contactInfo,
      );

    if (!conversation) {
      this.logger.debug(
        `No suitable conversation found to mark as read for chat.id: ${payload.from}`,
      );
      return;
    }

    const sourceId = conversation.sourceId;
    if (!sourceId) {
      this.logger.warn(
        `Contact not found for chat.id: ${payload.from}. Skipping read update for message ${payload.id}`,
      );
      return;
    }

    try {
      await this.contactConversationService.markConversationAsRead(
        chatwoot.conversation_id,
        sourceId,
      );
      this.logger.info(
        `Marked conversation ${chatwoot.conversation_id} as read for chat.id: ${payload.from} (message: ${payload.id}, sourceId: ${sourceId})`,
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error marking conversation ${chatwoot.conversation_id} as read for chat.id: ${payload.from}. Reason: ${reason}`,
      );
      throw error;
    }
  }
}
