import { conversation_message_create } from '@figuro/chatwoot-sdk';
import type { generic_id } from '@figuro/chatwoot-sdk/dist/models/generic_id';
import type { message } from '@figuro/chatwoot-sdk/dist/models/message';
import { AppConsumer } from '@waha/apps/app_sdk/AppConsumer';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { JobLoggerWrapper } from '@waha/apps/app_sdk/JobLoggerWrapper';
import { HasBeenRetried } from '@waha/apps/app_sdk/JobUtils';
import { ContactConversationService } from '@waha/apps/chatwoot/client/ContactConversationService';
import { Conversation } from '@waha/apps/chatwoot/client/Conversation';
import { MessageType, SendAttachment } from '@waha/apps/chatwoot/client/types';
import { WhatsAppChatIdKey } from '@waha/apps/chatwoot/consumers/mutex';
import { EventData } from '@waha/apps/chatwoot/consumers/types';
import { WhatsAppContactInfo } from '@waha/apps/chatwoot/contacts/WhatsAppContactInfo';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { WAHASelf, WAHASessionAPI } from '@waha/apps/chatwoot/session/WAHASelf';
import {
  AppRepository,
  ChatwootMessage,
  MessageMappingService,
  WhatsAppMessage,
} from '@waha/apps/chatwoot/storage';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { MessageSource, WAMessageBase } from '@waha/structures/responses.dto';
import {
  WAHAWebhook,
  WAHAWebhookMessageRevoked,
} from '@waha/structures/webhooks.dto';
import { sleep } from '@waha/utils/promiseTimeout';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { isJidBroadcast, isJidGroup, toCusFormat } from '@waha/core/utils/jids';

export function ListenEventsForChatWoot() {
  return [
    WAHAEvents.MESSAGE_ANY,
    WAHAEvents.MESSAGE_REACTION,
    WAHAEvents.MESSAGE_EDITED,
    WAHAEvents.MESSAGE_REVOKED,
    WAHAEvents.MESSAGE_ACK,
    WAHAEvents.SESSION_STATUS,
  ];
}

/**
 * Base class for ChatWoot WAHA consumers
 * Contains common logic for all WAHA consumers
 */
export abstract class ChatWootWAHABaseConsumer extends AppConsumer {
  protected appRepository: AppRepository;

  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
    protected readonly consumerName: string,
  ) {
    super('ChatWoot', consumerName, log, rmutex);
  }

  protected ErrorHeaderKey(): TKey | null {
    return TKey.WHATSAPP_MESSAGE_RECEIVING_ERROR;
  }

  private async ProcessAndReportErrors(job) {
    const errorReportInfo = new MessageReportInfo();
    try {
      const result = await this.Process(job, errorReportInfo);
      await this.ReportErrorRecovered(errorReportInfo, job);
      return result;
    } catch (err) {
      await this.ReportErrorForMessage(errorReportInfo, job, err);
      throw err;
    }
  }

  /**
   * Gets the DIContainer for the specified app.
   */
  protected async DIContainer(job: Job, appId: string): Promise<DIContainer> {
    const knex = this.manager.store.getWAHADatabase();
    this.appRepository = new AppRepository(knex);
    const logger = new JobLoggerWrapper(job, this.logger);
    const app = await this.appRepository.getById(appId);
    return new DIContainer(app.pk, app.config, logger, knex);
  }

  abstract GetChatId(event: any): string;

  abstract Process(
    job: Job<EventData, any, WAHAEvents>,
    messageInfo: IMessageInfo,
  ): Promise<any>;

  async processJob(job: Job<EventData, any, WAHAEvents>): Promise<any> {
    const event: WAHAWebhookMessageRevoked = job.data.event as any;
    const key = WhatsAppChatIdKey(job.data.app, this.GetChatId(event));
    return await this.withMutex(job, key, () =>
      this.ProcessAndReportErrors(job),
    );
  }

  protected async ReportErrorForMessage(
    info: MessageReportInfo,
    job: Job,
    err: any,
  ) {
    const container = await this.DIContainer(job, job.data.app);
    let conversation: Conversation;
    if (info.conversationId) {
      conversation = container
        .ContactConversationService()
        .ConversationById(info.conversationId);
    } else {
      conversation = await container
        .ContactConversationService()
        .InboxNotifications();
    }

    const header: string = this.ErrorHeaderKey()
      ? container.Locale().key(this.ErrorHeaderKey()).render()
      : err.message || `${err}`;
    const reporter = container.ChatWootErrorReporter(job);
    await reporter.ReportError(
      conversation,
      header,
      info.type || MessageType.INCOMING,
      err,
    );
    throw err;
  }

  /**
   * Report a job as recovered after retries
   * This method will only send a report if the job has been retried (not on its first attempt)
   */
  protected async ReportErrorRecovered(info: MessageReportInfo, job: Job) {
    if (!HasBeenRetried(job)) {
      return;
    }

    const container = await this.DIContainer(job, job.data.app);
    let conversation: Conversation;
    if (info.conversationId) {
      conversation = container
        .ContactConversationService()
        .ConversationById(info.conversationId);
    } else {
      conversation = await container
        .ContactConversationService()
        .InboxNotifications();
    }

    const reporter = container.ChatWootErrorReporter(job);
    await reporter.ReportSucceeded(
      conversation,
      info.type || MessageType.INCOMING,
    );
  }
}

export interface IMessageInfo {
  onConversationId(id: number): void;

  onMessageType(type: MessageType): void;
}

class MessageReportInfo implements IMessageInfo {
  public conversationId: number | null = null;
  public type: MessageType | null = null;

  onConversationId(id: number) {
    this.conversationId = id;
  }

  onMessageType(type: MessageType) {
    this.type = type;
  }
}

export interface ChatWootMessagePartial {
  content: string;
  attachments: SendAttachment[];
  private?: boolean;
}

export abstract class MessageBaseHandler<Payload extends WAMessageBase> {
  constructor(
    protected job: Job,
    protected mappingService: MessageMappingService,
    protected repo: ContactConversationService,
    protected logger: ILogger,
    protected info: IMessageInfo,
    protected session: WAHASessionAPI,
    protected l: Locale,
    protected waha: WAHASelf,
  ) {}

  protected abstract getMessage(
    payload: Payload,
  ): Promise<ChatWootMessagePartial>;

  abstract getReplyToWhatsAppID(payload: Payload): string | undefined;

  async handle(data: WAHAWebhook<Payload>) {
    const payload = data.payload;
    // Find the type as soon as possible for error reporting
    const type = payload.fromMe ? MessageType.OUTGOING : MessageType.INCOMING;
    this.info.onMessageType(type);

    // Check if we have that message already in ChatWoot to avoid duplication
    // It also handles messages fromMe and ChatWoot (but does not if send via API)
    if (payload.fromMe && payload.source === MessageSource.API) {
      // Sleep a few seconds to save it to a database
      await sleep(3_000);
    }

    const key = parseMessageIdSerialized(payload.id);
    const chatwoot = await this.mappingService.getChatWootMessage({
      chat_id: toCusFormat(key.remoteJid),
      message_id: key.id,
    });
    if (chatwoot) {
      this.logger.info(
        `Message '${payload.id}' already in ChatWoot: conversation.id=${chatwoot.conversation_id}, message.id=${chatwoot.message_id}`,
      );
      return;
    }

    const contactInfo = WhatsAppContactInfo(this.session, payload.from, this.l);
    const conversation = await this.repo.ConversationByContact(contactInfo);
    this.info.onConversationId(conversation.conversationId);

    const message = await this.buildChatWootMessage(payload);
    const response = await conversation.send(message);
    this.logger.info(
      `Created message as '${message.message_type}' from WhatsApp: ${response.id}`,
    );
    await this.saveMapping(response, payload);
    return message;
  }

  private async saveMapping(
    chatwootMessage: generic_id & message,
    whatsappMessage: WAMessageBase,
  ) {
    const chatwoot: Omit<ChatwootMessage, 'id'> = {
      timestamp: new Date(chatwootMessage.created_at * 1000),
      conversation_id: chatwootMessage.conversation_id,
      message_id: chatwootMessage.id,
    };
    const key = parseMessageIdSerialized(whatsappMessage.id);
    const whatsapp: WhatsAppMessage = {
      timestamp: new Date(whatsappMessage.timestamp * 1000),
      chat_id: toCusFormat(key.remoteJid),
      message_id: key.id,
      from_me: key.fromMe,
      participant: null,
    };
    await this.mappingService.map(chatwoot, whatsapp, 1);
    return;
  }

  private async buildChatWootMessage(
    payload: Payload,
  ): Promise<conversation_message_create> {
    const message = await this.getMessage(payload);
    let content = message.content;

    // Format the content if the message from me
    if (payload.fromMe && payload.source === MessageSource.APP) {
      const key = TKey.MESSAGE_FROM_WHATSAPP;
      content = this.l.key(key).render({ text: content });
    } else if (payload.fromMe && payload.source === MessageSource.API) {
      const key = TKey.MESSAGE_FROM_API;
      content = this.l.key(key).render({ text: content });
    }

    const chatId = payload.from;

    // Add participant name to group messages
    const manyParticipants = isJidGroup(chatId) || isJidBroadcast(chatId);
    if (!payload.fromMe && manyParticipants) {
      const key = parseMessageIdSerialized(payload.id, true);
      let participant = toCusFormat(key.participant);
      const contact: any = await this.session.getContact(key.participant);
      const name = contact?.name || contact?.pushName || contact?.pushname;
      if (name) {
        participant = `${name} (${participant})`;
      }
      content = this.l.key(TKey.WHATSAPP_GROUP_MESSAGE).render({
        text: content,
        participant: participant,
      });
    }
    const replyTo = await this.getReplyToChatWootMessageID(payload).catch(
      (err) => {
        this.logger.error(
          `WhatsApp => ChatWoot - error getting reply to message ID: ${err}`,
        );
        return undefined;
      },
    );

    const type = payload.fromMe ? MessageType.OUTGOING : MessageType.INCOMING;
    return {
      content: content,
      message_type: type,
      private: message.private ?? payload.fromMe,
      attachments: message.attachments as any,
      content_attributes: {
        in_reply_to: replyTo,
      },
    };
  }

  async getReplyToChatWootMessageID(
    payload: Payload,
  ): Promise<number | undefined> {
    const replyToWhatsAppID = this.getReplyToWhatsAppID(payload);
    if (!replyToWhatsAppID) {
      return;
    }
    const chatwoot = await this.mappingService.getChatWootMessage({
      chat_id: payload.from,
      message_id: replyToWhatsAppID,
    });
    return chatwoot?.message_id;
  }
}
