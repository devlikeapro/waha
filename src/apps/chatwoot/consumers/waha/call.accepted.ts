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
} from '@waha/apps/chatwoot/consumers/waha/base';
import {
  BuildCallMessagePayload,
  BuildFakeCallMessageId,
  CallMessagePayload,
  ShouldProcessCall,
} from '@waha/apps/chatwoot/consumers/waha/call.0.base';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { EngineHelper } from '@waha/apps/chatwoot/waha';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WAHAWebhookCallAccepted } from '@waha/structures/webhooks.dto';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { WhatsappToMarkdown } from '@waha/apps/chatwoot/messages/to/chatwoot/utils/markdown';

@Processor(QueueName.WAHA_CALL_ACCEPTED, { concurrency: JOB_CONCURRENCY })
export class WAHACallAcceptedConsumer extends ChatWootWAHABaseConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'WAHACallAcceptedConsumer');
  }

  ShouldProcess(event: WAHAWebhookCallAccepted): boolean {
    return ShouldProcessCall(event);
  }

  GetChatId(event: WAHAWebhookCallAccepted): string {
    return EngineHelper.CallChatID(event.payload as any);
  }

  async Process(
    job: Job<EventData, any, WAHAEvents>,
    info: IMessageInfo,
  ): Promise<any> {
    const container = await this.DIContainer(job, job.data.app);
    const event = job.data.event as WAHAWebhookCallAccepted;
    const locale = container.Locale();
    const handler = new CallAcceptedMessageHandler(
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
      WAHAEvents.CALL_ACCEPTED,
    );
    return await handler.handle(msg);
  }
}

export class CallAcceptedMessageHandler extends MessageBaseHandler<CallMessagePayload> {
  protected async getMessage(
    payload: CallMessagePayload,
  ): Promise<ChatWootMessagePartial> {
    const content = this.l
      .key(TKey.WA_TO_CW_CALL_ACCEPTED)
      .render({ call: payload });
    return {
      content: WhatsappToMarkdown(content),
      attachments: [],
      private: true,
    };
  }

  getReplyToWhatsAppID(payload: CallMessagePayload): string | undefined {
    return BuildFakeCallMessageId(payload.callId, WAHAEvents.CALL_RECEIVED);
  }
}
