import { Processor } from '@nestjs/bullmq';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { EventData } from '@waha/apps/chatwoot/consumers/types';
import {
  ChatWootMessagePartial,
  ChatWootWAHABaseConsumer,
  IMessageInfo,
  MessageBaseHandler,
} from '@waha/apps/chatwoot/consumers/waha/base';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { WAHAEvents } from '@waha/structures/enums.dto';
import {
  WAHAWebhookMessageEdited,
  WAMessageEditedBody,
} from '@waha/structures/webhooks.dto';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { WAHASessionAPI } from '../../../app_sdk/waha/WAHASelf';
import {
  MessageEdited,
  MessageToChatWootConverter,
  resolveProtoMessage,
} from '@waha/apps/chatwoot/messages/to/chatwoot';
import { EngineHelper } from '@waha/apps/chatwoot/waha';

@Processor(QueueName.WAHA_MESSAGE_EDITED, { concurrency: JOB_CONCURRENCY })
export class WAHAMessageEditedConsumer extends ChatWootWAHABaseConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'WAHAMessageEditedConsumer');
  }

  GetChatId(event: WAHAWebhookMessageEdited): string {
    return EngineHelper.ChatID(event.payload);
  }

  async Process(
    job: Job<EventData, any, WAHAEvents>,
    info: IMessageInfo,
  ): Promise<any> {
    const container = await this.DIContainer(job, job.data.app);
    const event: WAHAWebhookMessageEdited = job.data.event as any;
    const session = new WAHASessionAPI(event.session, container.WAHASelf());
    const handler = new MessageEditedHandler(
      job,
      container.MessageMappingService(),
      container.ContactConversationService(),
      container.Logger(),
      info,
      session,
      container.Locale(),
      container.WAHASelf(),
      container.OutgoingMode(),
    );
    return await handler.handle(event.payload);
  }
}

class MessageEditedHandler extends MessageBaseHandler<WAMessageEditedBody> {
  protected async getMessage(
    payload: WAMessageEditedBody,
  ): Promise<ChatWootMessagePartial> {
    const protoMessage = resolveProtoMessage(payload._data);
    const converter: MessageToChatWootConverter = new MessageEdited(this.l);
    return converter.convert(payload, protoMessage);
  }

  getReplyToWhatsAppID(payload: WAMessageEditedBody): string {
    return payload.editedMessageId;
  }
}
