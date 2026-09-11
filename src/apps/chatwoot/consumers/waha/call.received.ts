import { Processor } from '@nestjs/bullmq';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { WAHASessionAPI } from '@waha/apps/app_sdk/waha/WAHASelf';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { EventData } from '@waha/apps/chatwoot/consumers/types';
import {
  ChatWootMessagePartial,
  ChatWootWAHABaseConsumer,
  IMessageInfo,
  MessageBaseHandler,
  MessageBaseHandlerPayload,
} from '@waha/apps/chatwoot/consumers/waha/base';
import {
  BuildCallMessagePayload,
  CallMessagePayload,
  ShouldProcessCall,
} from '@waha/apps/chatwoot/consumers/waha/call.0.base';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { EngineHelper } from '@waha/apps/chatwoot/waha';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WAHAWebhookCallReceived } from '@waha/structures/webhooks.dto';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { CallData } from '@waha/structures/calls.dto';
import { WhatsappToMarkdown } from '@waha/apps/chatwoot/messages/to/chatwoot/utils/markdown';

@Processor(QueueName.WAHA_CALL_RECEIVED, { concurrency: JOB_CONCURRENCY })
export class WAHACallReceivedConsumer extends ChatWootWAHABaseConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'WAHACallReceivedConsumer');
  }

  ShouldProcess(event: WAHAWebhookCallReceived): boolean {
    return ShouldProcessCall(event);
  }

  GetChatId(event: WAHAWebhookCallReceived): string {
    return EngineHelper.CallChatID(event.payload as any);
  }

  async Process(
    job: Job<EventData, any, WAHAEvents>,
    info: IMessageInfo,
  ): Promise<any> {
    const container = await this.DIContainer(job, job.data.app);
    const event = job.data.event as WAHAWebhookCallReceived;
    const locale = container.Locale();
    const handler = new CallReceivedMessageHandler(
      job,
      container.MessageMappingService(),
      container.ContactConversationService(),
      container.Logger(),
      info,
      new WAHASessionAPI(event.session, container.WAHASelf()),
      locale,
      container.WAHASelf(),
      container.OutgoingMode(),
    );
    const msg = BuildCallMessagePayload(
      event.payload,
      event.event as WAHAEvents.CALL_RECEIVED,
    );
    return await handler.handle(msg);
  }
}

export class CallReceivedMessageHandler extends MessageBaseHandler<CallMessagePayload> {
  protected async getMessage(
    payload: MessageBaseHandlerPayload & CallData,
  ): Promise<ChatWootMessagePartial> {
    const content = this.l
      .key(TKey.WA_TO_CW_CALL_RECEIVED)
      .render({ call: payload });
    return {
      content: WhatsappToMarkdown(content),
      attachments: [],
      private: false,
    };
  }

  getReplyToWhatsAppID(
    payload: MessageBaseHandlerPayload & CallData,
  ): string | undefined {
    // No reply required for the first call received
    return undefined;
  }
}
