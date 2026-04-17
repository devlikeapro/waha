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
import { WAHASessionAPI } from '@waha/apps/app_sdk/waha/WAHASelf';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WAMessage } from '@waha/structures/responses.dto';
import { WAHAWebhookMessageAny } from '@waha/structures/webhooks.dto';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import {
  FacebookAdMessage,
  EventMessage,
  PixMessage,
  LocationMessage,
  MessageToChatWootConverter,
  PollMessage,
  ListMessage,
  ShareContactMessage,
  StatusReplyMessage,
  TextMessage,
  UnsupportedMessage,
  AlbumMessage,
  resolveProtoMessage,
} from '@waha/apps/chatwoot/messages/to/chatwoot';
import { EngineHelper } from '@waha/apps/chatwoot/waha';
import { HasMediaWithNoMediaMessage } from '@waha/apps/chatwoot/messages/to/chatwoot/HasMediaWithNoMediaMessage';

@Processor(QueueName.WAHA_MESSAGE_ANY, { concurrency: JOB_CONCURRENCY })
export class WAHAMessageAnyConsumer extends ChatWootWAHABaseConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'WAHAMessageAnyConsumer');
  }

  GetChatId(event: WAHAWebhookMessageAny): string {
    return EngineHelper.ChatID(event.payload);
  }

  async Process(
    job: Job<EventData, any, WAHAEvents>,
    info: IMessageInfo,
  ): Promise<any> {
    const container = await this.DIContainer(job, job.data.app);
    const event: WAHAWebhookMessageAny = job.data.event as any;
    const session = new WAHASessionAPI(event.session, container.WAHASelf());
    const handler = new MessageAnyHandler(
      job,
      container.MessageMappingService(),
      container.ContactConversationService(),
      container.Logger(),
      info,
      session,
      container.Locale(),
      container.WAHASelf(),
    );
    return await handler.handle(event.payload);
  }
}

export class MessageAnyHandler extends MessageBaseHandler<WAMessage> {
  public shouldLogUnsupported: boolean = false;

  protected async getMessage(
    payload: WAMessage,
  ): Promise<ChatWootMessagePartial> {
    let converter: MessageToChatWootConverter;
    let msg: ChatWootMessagePartial;
    const protoMessage = resolveProtoMessage(payload._data);

    // Check for Facebook Ad first - but let it use the normal flow later
    converter = new FacebookAdMessage(this.l, this.logger);
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new StatusReplyMessage(
      this.l,
      this.logger,
      this.waha,
      this.job,
      this.session,
    );
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new TextMessage(this.l, this.logger, this.waha, this.job);
    msg = await converter.convert(payload, null);
    if (msg) {
      return msg;
    }

    converter = new LocationMessage(this.l);
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new ShareContactMessage(this.l, this.logger);
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new PollMessage(this.l);
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new ListMessage(this.l);
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new EventMessage(this.l);
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new PixMessage(this.l, this.logger);
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new AlbumMessage(this.l);
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new HasMediaWithNoMediaMessage(this.l, this.job);
    msg = await converter.convert(payload, protoMessage);
    if (msg) {
      return msg;
    }

    converter = new UnsupportedMessage(this.l, this.job);
    msg = await converter.convert(payload, protoMessage);
    if (this.shouldLogUnsupported) {
      this.logger.warn(
        `UnsupportedMessage:\n${JSON.stringify(payload, null, 2)}`,
      );
    }
    return msg;
  }

  getReplyToWhatsAppID(payload: WAMessage): string {
    const replyTo = payload.replyTo;
    if (!replyTo) {
      return undefined;
    }
    if (!replyTo.id) {
      return undefined;
    }
    const key = parseMessageIdSerialized(replyTo.id, true);
    return key.id;
  }
}
