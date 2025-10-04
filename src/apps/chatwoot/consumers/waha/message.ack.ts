import { Processor } from '@nestjs/bullmq';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { EventData } from '@waha/apps/chatwoot/consumers/types';
import {
  ChatWootWAHABaseConsumer,
  IMessageInfo,
} from '@waha/apps/chatwoot/consumers/waha/base';
import { WAHASessionAPI } from '@waha/apps/chatwoot/session/WAHASelf';
import { WhatsAppContactInfo } from '@waha/apps/chatwoot/contacts/WhatsAppContactInfo';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WAHAWebhookMessageAck } from '@waha/structures/webhooks.dto';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

@Processor(QueueName.WAHA_MESSAGE_READ, { concurrency: JOB_CONCURRENCY })
export class WAHAMessageReadConsumer extends ChatWootWAHABaseConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'WAHAMessageReadConsumer');
  }

  GetChatId(event: WAHAWebhookMessageAck): string {
    return event.payload.from;
  }

  async Process(
    job: Job<EventData, any, WAHAEvents>,
    info: IMessageInfo,
  ): Promise<any> {
    const container = await this.DIContainer(job, job.data.app);
    const event: WAHAWebhookMessageAck = job.data.event as any;
    const session = new WAHASessionAPI(event.session, container.WAHASelf());
    const handler = new MessageReadHandler(
      job,
      container.ContactConversationService(),
      container.Logger(),
      info,
      session,
      container.Locale(),
    );
    return await handler.handle(event);
  }
}

class MessageReadHandler {
  constructor(
    private job: Job,
    private contactConversationService: any,
    private logger: any,
    private info: IMessageInfo,
    private session: WAHASessionAPI,
    private l: any,
  ) {}

  async handle(event: WAHAWebhookMessageAck) {
    const payload = event.payload;
    
    // Only process READ acknowledgments
    if (payload.ack !== 3) { // WAMessageAck.READ = 3
      this.logger.debug(`Ignoring non-READ ack: ${payload.ack} for message ${payload.id}`);
      return;
    }
    
    try {
      // Create contact info from the chat ID
      const contactInfo = WhatsAppContactInfo(this.session, payload.from, this.l);
      
      // Get or create conversation for this contact
      const conversation = await this.contactConversationService.ConversationByContact(contactInfo);
      
      // Get the sourceId by searching for the contact
      const sourceId = await this.contactConversationService.getSourceIdByChatId(payload.from);
      if (!sourceId) {
        this.logger.error(`Contact not found for chatId: ${payload.from}`);
        return;
      }
      
      // Mark the conversation as read in Chatwoot
      await this.contactConversationService.markConversationAsRead(conversation.conversationId, sourceId);
      
      this.logger.info(
        `Marked conversation ${conversation.conversationId} as read for chatId: ${payload.from} (message: ${payload.id}, sourceId: ${sourceId})`,
      );
    } catch (err) {
      this.logger.error(
        `Error marking conversation as read for chatId ${payload.from}: ${err.message}`,
      );
      throw err;
    }
  }
}
