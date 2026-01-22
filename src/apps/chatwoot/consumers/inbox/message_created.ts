import { Processor } from '@nestjs/bullmq';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { MessageAttachment } from '@waha/apps/chatwoot/client/types';
import {
  ChatWootInboxMessageConsumer,
  LookupAndCheckChatId,
} from '@waha/apps/chatwoot/consumers/inbox/base';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { DIContainer } from '@waha/apps/chatwoot/di/DIContainer';
import { EngineHelper } from '@waha/apps/chatwoot/waha';
import { WAHASessionAPI } from '@waha/apps/app_sdk/waha/WAHASelf';
import {
  ChatwootMessage,
  MessageMapping,
  MessageMappingService,
} from '@waha/apps/chatwoot/storage';
import { MarkdownToWhatsApp } from '@waha/apps/chatwoot/messages/to/whatsapp/markdown';
import { parseMentionsFromText } from '@waha/apps/chatwoot/messages/to/whatsapp/mentions';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import {
  MessageFileRequest,
  MessageImageRequest,
  MessageTextRequest,
  MessageVideoRequest,
  MessageVoiceRequest,
} from '@waha/structures/chatting.dto';
import { sleep } from '@waha/utils/promiseTimeout';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';

import { SerializeWhatsAppKey } from '../../client/ids';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import {
  ChatWootConfig,
  LinkPreview,
} from '@waha/apps/chatwoot/dto/config.dto';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { isJidGroup } from '@waha/core/utils/jids';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-types');

@Processor(QueueName.INBOX_MESSAGE_CREATED, { concurrency: JOB_CONCURRENCY })
export class ChatWootInboxMessageCreatedConsumer extends ChatWootInboxMessageConsumer {
  constructor(
    protected readonly manager: SessionManager,
    log: PinoLogger,
    rmutex: RMutexService,
  ) {
    super(manager, log, rmutex, 'ChatWootInboxMessageCreatedConsumer');
  }

  ErrorHeaderKey(): TKey | null {
    return TKey.WHATSAPP_MESSAGE_SENDING_ERROR;
  }

  protected async Process(container: DIContainer, body, job: Job) {
    const waha = container.WAHASelf();
    const session = new WAHASessionAPI(job.data.session, waha);
    const handler = new MessageHandler(
      container.MessageMappingService(),
      container.Logger(),
      session,
      container.ChatWootConfig(),
      container.Locale(),
    );
    return await handler.handle(body);
  }
}

export class MessageHandler {
  constructor(
    private mappingService: MessageMappingService,
    private logger: ILogger,
    private session: WAHASessionAPI,
    private config: ChatWootConfig,
    private l: Locale,
  ) {}

  async handle(body: any) {
    const chatId = await LookupAndCheckChatId(this.session, body);
    const message = body;
    if (
      message.content_type != 'text' &&
      message.content_type != 'input_csat'
    ) {
      this.logger.info(
        `Message content type not supported. Content type: ${message.content_type}`,
      );
      return;
    }

    let content: string = message.content;
    let mentions: null | string[] = null;
    if (isJidGroup(chatId)) {
      // Parse any mention in the text and get a new clean text if required
      const parsed = parseMentionsFromText(message.content);
      content = parsed.text;
      mentions = parsed.mentions;
    }

    content = MarkdownToWhatsApp(content);
    const results = [];
    let part = 0; // Start from 0 and increment before each send/check
    const replyTo = await this.getReplyTo(message).catch((err) => {
      this.logger.error(
        `ChatWoot => WhatsApp: error getting reply to message ID: ${err}`,
      );
      return undefined;
    });

    // Send text (Part 1 if present)
    const attachments = message.attachments || [];
    const sendText = content && attachments.length !== 1;
    if (sendText) {
      part += 1; // Text is the first possible part
      const exists = await this.getMapping(message, part);
      if (exists) {
        this.logger.warn(
          `Skip part ${part}: mapping exists for Chatwoot message ${message.id}`,
        );
      } else {
        const textTemplate = this.l.key(TKey.CW_TO_WA_MESSAGE_TEXT);
        const text = textTemplate.render({
          content: content,
          chatwoot: body,
        });
        const msg = await this.sendTextMessage(chatId, text, replyTo, mentions);
        results.push(msg);
        await this.saveMapping(message, msg, part);
        this.logger.info(`Text message sent: ${msg.id}`);
      }
    }

    // Send files
    const captionTemplate = this.l.key(TKey.CW_TO_WA_MESSAGE_MEDIA_CAPTION);
    for (const file of attachments) {
      part += 1; // Increment before each attachment send/check
      const exists = await this.getMapping(message, part);
      if (exists) {
        this.logger.warn(
          `Skip part ${part}: mapping exists for Chatwoot message ${message.id}`,
        );
        continue;
      }
      const caption = captionTemplate.render({
        content: content,
        chatwoot: body,
        singleAttachment: attachments.length == 1,
      });
      const msg = await this.sendFile(chatId, caption, replyTo, mentions, file);
      this.logger.info(
        `File message sent: ${msg.id} - ${file.data_url} - ${file.file_type}`,
      );
      results.push(msg);
      await this.saveMapping(message, msg, part);
    }
    return results;
  }

  private async saveMapping(
    chatwootMessage: any,
    whatsappMessage: any,
    part: number,
  ): Promise<void> {
    const chatwoot: Omit<ChatwootMessage, 'id'> = {
      timestamp: new Date(chatwootMessage.created_at),
      conversation_id: chatwootMessage.conversation.id,
      message_id: chatwootMessage.id,
    };
    const whatsapp = EngineHelper.WhatsAppMessageKeys(whatsappMessage);
    await this.mappingService.map(chatwoot, whatsapp, part);
  }

  private async getMapping(
    message: any,
    part: number,
  ): Promise<MessageMapping | null> {
    return this.mappingService.getMappingByChatwootCombinedKeyAndPart(
      {
        conversation_id: message.conversation.id,
        message_id: message.id,
      },
      part,
    );
  }

  async getReplyTo(message): Promise<string | undefined> {
    const message_id = message.content_attributes.in_reply_to;
    if (!message_id) {
      return;
    }
    const messages = await this.mappingService.getWhatsAppMessage({
      conversation_id: message.conversation.id,
      message_id: message_id,
    });
    if (!messages || messages.length == 0) {
      return;
    }
    const whatsapp = messages[0];
    return SerializeWhatsAppKey(whatsapp);
  }

  private async sendTextMessage(
    chatId: string,
    content: string,
    replyTo: string,
    mentions: string[] | null,
  ) {
    const request: MessageTextRequest = {
      session: '',
      chatId: chatId,
      text: content,
      reply_to: replyTo,
      linkPreview: [LinkPreview.LQ, LinkPreview.HQ].includes(
        this.config.linkPreview,
      ),
      linkPreviewHighQuality: this.config.linkPreview == LinkPreview.HQ,
      mentions: mentions,
    };
    const session = this.session;
    await session.readMessages(chatId);
    await session.startTyping({ chatId: chatId, session: '' });
    await sleep(2000);
    await session.stopTyping({ chatId: chatId, session: '' });
    const msg = await session.sendText(request);
    return msg;
  }

  private async sendFile(
    chatId: string,
    content: string,
    replyTo: string,
    mentions: string[] | null,
    file: MessageAttachment,
  ) {
    const url = file.data_url;
    let filename = url.split('/').pop();
    if (filename) {
      filename = decodeURIComponent(filename);
    }
    const mimetype = mime.lookup(filename);
    const session = this.session;

    switch (file.file_type) {
      case 'image':
        if (mimetype != 'image/jpeg' && mimetype != 'image/png') {
          // Send it as a file
          break;
        }
        const imageRequest: MessageImageRequest = {
          session: '',
          caption: content,
          chatId: chatId,
          reply_to: replyTo,
          file: {
            url: url,
            mimetype: mimetype,
          },
          mentions: mentions,
        };
        return session.sendImage(imageRequest);
      case 'video':
        if (mimetype != 'video/mp4') {
          break;
        }
        const videoRequest: MessageVideoRequest = {
          session: '',
          caption: content,
          chatId: chatId,
          reply_to: replyTo,
          file: {
            url: url,
            mimetype: mimetype,
            filename: filename,
          },
          convert: true,
          mentions: mentions,
        };
        return session.sendVideo(videoRequest);
      case 'audio':
        const voiceRequest: MessageVoiceRequest = {
          session: '',
          chatId: chatId,
          file: {
            url: url,
            mimetype: mimetype,
            filename: filename,
          },
          convert: true,
        };
        return session.sendVoice(voiceRequest);
    }
    // Fallback and send as file (attachment)
    const fileRequest: MessageFileRequest = {
      session: '',
      caption: content,
      chatId: chatId,
      reply_to: replyTo,
      file: {
        filename: filename,
        url: url,
        mimetype: mimetype,
      },
      mentions: mentions,
    };
    return session.sendFile(fileRequest);
  }
}
