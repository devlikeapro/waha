import { Processor } from '@nestjs/bullmq';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { SendAttachment } from '@waha/apps/chatwoot/client/types';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { EventData } from '@waha/apps/chatwoot/consumers/types';
import {
  ChatWootMessagePartial,
  ChatWootWAHABaseConsumer,
  IMessageInfo,
} from '@waha/apps/chatwoot/consumers/waha/base';
import { MessageBaseHandler } from '@waha/apps/chatwoot/consumers/waha/base';
import { WAHASessionAPI } from '@waha/apps/app_sdk/waha/WAHASelf';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { WAHAEngine, WAHAEvents } from '@waha/structures/enums.dto';
import { WAMessageReaction, WAReaction } from '@waha/structures/responses.dto';
import { WAHAWebhookMessageReaction } from '@waha/structures/webhooks.dto';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { EngineHelper } from '@waha/apps/chatwoot/waha';

@Processor(QueueName.WAHA_MESSAGE_REACTION, { concurrency: JOB_CONCURRENCY })
export class WAHAMessageReactionConsumer extends ChatWootWAHABaseConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'WAHAMessageReactionConsumer');
  }

  GetChatId(event: WAHAWebhookMessageReaction): string {
    if (
      event.environment?.engine == WAHAEngine.WEBJS ||
      event.environment?.engine == WAHAEngine.WPP
    ) {
      // chat in "to" field for WEBJS for message.reaction
      // probably we need to set it to "from"
      // but for backward compatability we do this
      return event.payload.to;
    }
    return EngineHelper.ChatID(event.payload);
  }

  async Process(
    job: Job<EventData, any, WAHAEvents>,
    info: IMessageInfo,
  ): Promise<any> {
    const container = await this.DIContainer(job, job.data.app);
    const event: WAHAWebhookMessageReaction = job.data.event as any;
    const session = new WAHASessionAPI(event.session, container.WAHASelf());
    const handler = new MessageReactionHandler(
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

export class MessageReactionHandler extends MessageBaseHandler<WAMessageReaction> {
  protected async getMessage(
    payload: WAMessageReaction,
  ): Promise<ChatWootMessagePartial> {
    const reaction = payload.reaction as WAReaction;
    const emoji = reaction.text;
    let content: string;
    if (emoji) {
      content = this.l.key(TKey.WHATSAPP_REACTION_ADDED).render({
        emoji: emoji,
      });
    } else {
      content = this.l.key(TKey.WHATSAPP_REACTION_REMOVED).render();
    }
    return {
      content: content,
      attachments: [],
      private: undefined,
    };
  }

  getReplyToWhatsAppID(payload: WAMessageReaction) {
    const reaction = payload.reaction as WAReaction;
    const messageId = reaction.messageId;
    const key = parseMessageIdSerialized(messageId, false);
    return key.id;
  }
}
