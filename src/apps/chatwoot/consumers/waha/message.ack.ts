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
import {
  WAHAWebhookMessageAck,
  WAMessageAckBody,
} from '@waha/structures/webhooks.dto';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { MultipleErrors } from '@waha/utils/errors';
import {
  ShouldMarkAsReadInChatWoot,
  ShouldProcessAckInChatWoot,
} from '@waha/apps/chatwoot/consumers/waha/message.ack.utils';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import {
  ChatwootMessage,
  MessageMappingService,
} from '@waha/apps/chatwoot/storage';
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
    return ShouldProcessAckInChatWoot(event);
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
    const conversations = container.ChatWootConfig().conversations;
    const config: MessageAckHandlerConfig = {
      markAsRead: conversations.markAsRead,
      syncMessageStatus: conversations.syncMessageStatus,
    };
    const handler = new MessageAckHandler(
      config,
      container.ContactConversationService(),
      container.MessageMappingService(),
      container.Logger(),
      info,
      session,
      container.Locale(),
      container.MessageStatusService(),
    );
    try {
      await handler.handle(event);
    } catch (e) {
      // TODO: Investigate errors
      // https://github.com/devlikeapro/waha/issues/1492
      this.logger.error(e);
    }
  }
}

interface MessageAckHandlerConfig {
  markAsRead: boolean;
  syncMessageStatus: boolean;
}

class MessageAckHandler {
  constructor(
    private readonly config: MessageAckHandlerConfig,
    private readonly contactConversationService: ContactConversationService,
    protected mappingService: MessageMappingService,
    private readonly logger: ILogger,
    private readonly info: IMessageInfo,
    private readonly session: WAHASessionAPI,
    private readonly locale: Locale,
    private readonly statusService: MessageStatusService,
  ) {}

  async handle(event: WAHAWebhookMessageAck): Promise<void> {
    const promises: Promise<void>[] = [];
    if (this.config.syncMessageStatus) {
      promises.push(this.syncMessageStatus(event));
    }
    if (this.config.markAsRead && ShouldMarkAsReadInChatWoot(event)) {
      promises.push(this.markConversationAsRead(event));
    }
    const results = await Promise.allSettled(promises);
    const errors = results
      .filter((result) => result.status === 'rejected')
      .map((result: PromiseRejectedResult) => result.reason);
    if (errors.length > 0) {
      throw new MultipleErrors(errors);
    }
  }

  /**
   * No chatwoot message - old message or some service ack, nothing to do
   */
  private async getChatWootMessage(
    payload: WAMessageAckBody,
  ): Promise<ChatwootMessage | null> {
    const key = parseMessageIdSerialized(payload.id);
    return this.mappingService.getChatWootMessage({
      chat_id: null,
      message_id: key.id,
    });
  }

  private async syncMessageStatus(event: WAHAWebhookMessageAck) {
    const payload = event.payload;
    const key = parseMessageIdSerialized(payload.id);
    // Save the ack first, then look up the mapping.
    await this.statusService.record(
      key.id,
      payload.ack,
      new Date(event.timestamp),
    );
    const chatwoot = await this.getChatWootMessage(payload);
    if (!chatwoot) {
      return;
    }
    await this.statusService.sync(chatwoot);
  }

  private async markConversationAsRead(event: WAHAWebhookMessageAck) {
    const payload = event.payload;
    const chatwoot = await this.getChatWootMessage(payload);
    if (!chatwoot) {
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
    this.info.onConversationId(conversation.conversationId);

    const sourceId = conversation.sourceId;
    if (!sourceId) {
      this.logger.warn(
        `Contact not found for chat.id: ${payload.from}. Skipping read update for message ${payload.id}`,
      );
      return;
    }

    try {
      await this.contactConversationService.markConversationAsRead(
        conversation.conversationId,
        sourceId,
      );
      this.logger.info(
        `Marked conversation ${conversation.conversationId} as read for chat.id: ${payload.from} (message: ${payload.id}, sourceId: ${sourceId})`,
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error marking conversation ${conversation.conversationId} as read for chat.id: ${payload.from}. Reason: ${reason}`,
      );
      throw error;
    }
  }
}
