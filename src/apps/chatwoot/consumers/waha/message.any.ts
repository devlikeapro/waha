import type { proto } from '@adiwajshing/baileys';
import { Processor } from '@nestjs/bullmq';
import { JOB_CONCURRENCY } from '@waha/apps/app_sdk/constants';
import { SendAttachment } from '@waha/apps/chatwoot/client/types';
import { QueueName } from '@waha/apps/chatwoot/consumers/QueueName';
import { EventData } from '@waha/apps/chatwoot/consumers/types';
import {
  ChatWootMessagePartial,
  ChatWootWAHABaseConsumer,
  IMessageInfo,
  MessageBaseHandler,
} from '@waha/apps/chatwoot/consumers/waha/base';
import { WAHASessionAPI } from '@waha/apps/chatwoot/session/WAHASelf';
import { WhatsappToMarkdown } from '@waha/apps/chatwoot/text';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { parseMessageIdSerialized } from '@waha/core/utils/ids';
import { RMutexService } from '@waha/modules/rmutex/rmutex.service';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WAMessage } from '@waha/structures/responses.dto';
import { WAHAWebhookMessageAny } from '@waha/structures/webhooks.dto';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { JobLink } from '@waha/apps/app_sdk/JobUtils';
import * as lodash from 'lodash';
import { parseVCardV3, SimpleVCardInfo } from '@waha/core/vcard';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-types');

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
    return event.payload.from;
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
    return await handler.handle(event);
  }
}

function isEmptyString(content: string) {
  if (!content) {
    return true;
  }
  return content == '' || content == '\n';
}

class MessageAnyHandler extends MessageBaseHandler<WAMessage> {
  protected async getMessage(
    payload: WAMessage,
  ): Promise<ChatWootMessagePartial> {
    const protoMessage = this.getProtoMessage(payload);
    
    // Check for Facebook Ad first - but let it use the normal flow
    if (this.isFacebookAd(payload, protoMessage)) {
      return this.getFacebookAdMessage(payload, protoMessage);
    }
    
    let msg = await this.getTextMessage(payload, protoMessage);
    if (msg) {
      return msg;
    }
    msg = this.getLocationMessage(payload, protoMessage);
    if (msg) {
      return msg;
    }
    msg = this.getShareContactMessage(payload, protoMessage);
    if (msg) {
      return msg;
    }
    return this.getUnsupportedMessage();
  }

  protected async getTextMessage(
    payload: WAMessage,
    _: proto.Message | null,
  ): Promise<ChatWootMessagePartial | null> {
    const attachments = await this.getAttachments(payload);
    let content = this.l
      .key(TKey.WA_TO_CW_MESSAGE)
      .render({ payload: payload });
    if (isEmptyString(content) && attachments.length == 0) {
      return null;
    }
    if (isEmptyString(content)) {
      content = null;
    }
    return {
      content: WhatsappToMarkdown(content),
      attachments: attachments,
      private: undefined,
    };
  }

  private getLocationMessage(
    payload: WAMessage,
    message: proto.Message | null,
  ): ChatWootMessagePartial | null {
    const hasLocation = !lodash.isEmpty(message?.locationMessage);
    const hasLiveLocation = !lodash.isEmpty(message?.liveLocationMessage);
    if (!hasLocation && !hasLiveLocation) {
      return null;
    }
    const location = this.l.key(TKey.WA_TO_CW_MESSAGE_LOCATION).r({
      payload,
      message,
    });
    if (isEmptyString(location)) {
      return null;
    }
    return {
      content: location,
      attachments: [],
      private: undefined,
    };
  }

  private getShareContactMessage(
    _payload: WAMessage,
    message: proto.Message | null,
  ): ChatWootMessagePartial | null {
    let vcards: string[] = [];

    if (!lodash.isEmpty(message?.contactsArrayMessage?.contacts)) {
      vcards = message!.contactsArrayMessage!.contacts.map((c) => c.vcard);
    } else if (!lodash.isEmpty(message?.contactMessage?.vcard)) {
      vcards = [message!.contactMessage!.vcard];
    }
    if (vcards.length === 0) {
      return null;
    }
    const attachments: SendAttachment[] = vcards.map((v, i) => ({
      content: Buffer.from(v, 'utf8').toString('base64'),
      encoding: 'base64',
      filename: `vcard-${i + 1}.vcf`,
    }));
    let contacts: SimpleVCardInfo[] = [];
    try {
      contacts = vcards.map(parseVCardV3);
    } catch (err) {
      this.logger.error(
        `Error parsing some vcards: vcards=${vcards}, err=${err}`,
      );
    }
    const msg = this.l.key(TKey.WA_TO_CW_MESSAGE_CONTACTS).r({ contacts });
    if (contacts.length === 0 && attachments.length === 0) {
      return null;
    }

    return {
      content: msg,
      attachments: attachments,
      private: undefined,
    };
  }

  private getUnsupportedMessage(): ChatWootMessagePartial {
    const unsupported = this.l
      .key(TKey.WA_TO_CW_MESSAGE_UNSUPPORTED)
      .render({ details: JobLink(this.job) });
    return {
      content: unsupported,
      attachments: [],
      private: true,
    };
  }

  private isFacebookAd(payload: WAMessage, protoMessage: proto.Message | null): boolean {
    // Check GOWS engine structure (_data with PascalCase)
    const gowsExtendedText = payload._data?.Message?.extendedTextMessage;
    if (gowsExtendedText?.contextInfo?.externalAdReply) {
      return true;
    }
    
    // Check other engines structure (protoMessage with camelCase)
    if (protoMessage?.extendedTextMessage?.contextInfo?.externalAdReply) {
      return true;
    }
    
    return false;
  }

  private extractAdReply(payload: WAMessage, protoMessage: proto.Message | null): any {
    // First try: GOWS engine structure (_data with PascalCase)
    const gowsExtendedText = payload._data?.Message?.extendedTextMessage;
    if (gowsExtendedText?.contextInfo?.externalAdReply) {
      return gowsExtendedText.contextInfo.externalAdReply;
    }
    
    // Second try: Other engines structure (protoMessage with camelCase)
    if (protoMessage?.extendedTextMessage?.contextInfo?.externalAdReply) {
      return protoMessage.extendedTextMessage.contextInfo.externalAdReply;
    }
    
    return null;
  }

  private extractAdData(adReply: any): any {
    return {
      title: adReply.title || '',
      body: adReply.body || '',
      thumbnailURL: adReply.thumbnailURL || adReply.thumbnailUrl || '',
      originalImageURL: adReply.originalImageURL || adReply.originalImageUrl || '',
      sourceURL: adReply.sourceURL || adReply.sourceUrl || '',
      sourceID: adReply.sourceID || adReply.sourceId || '',
    };
  }

  private async getFacebookAdMessage(
    payload: WAMessage,
    protoMessage: proto.Message | null,
  ): Promise<ChatWootMessagePartial> {
    const adReply = this.extractAdReply(payload, protoMessage);
    const adData = this.extractAdData(adReply);

    // Create caption using the Facebook Ad template (reuse existing media caption system)
    const content = this.l
      .key(TKey.WA_TO_CW_MESSAGE_FACEBOOK_AD)
      .render({ 
        payload: payload,
        adData: adData
      });

    // Download Facebook Ad image and create attachment (reuse existing media flow)
    const attachments: SendAttachment[] = [];
    const imageURL = adData.originalImageURL || adData.thumbnailURL;
    
    if (imageURL) {
      try {
        this.logger.info(`Downloading Facebook Ad image from '${imageURL}'...`);
        const buffer = await this.waha.fetch(imageURL);
        const fileContent = buffer.toString('base64');
        
        const attachment: SendAttachment = {
          content: fileContent,
          filename: 'facebook-ad-image.jpg',
          encoding: 'base64',
        };
        attachments.push(attachment);
        this.logger.info(`Downloaded Facebook Ad image from '${imageURL}'`);
      } catch (error) {
        this.logger.error(`Failed to download Facebook Ad image: ${error.message}`);
      }
    }

    // Return as image with caption (same pattern as regular media messages)
    return {
      content: WhatsappToMarkdown(content), // This becomes the caption
      attachments: attachments, // This becomes the image attachment
      private: undefined,
    };
  }

  private getProtoMessage(payload: WAMessage): proto.Message | null {
    // GOWS
    if (payload._data.Message) {
      return payload._data.Message;
    }
    // NOWEB
    if (payload._data.message) {
      return payload._data.message;
    }
    // WEBJS - not available
    return null;
  }

  getReplyToWhatsAppID(payload: WAMessage): string {
    const replyTo = payload.replyTo;
    if (!replyTo) {
      return undefined;
    }
    const key = parseMessageIdSerialized(replyTo.id, true);
    return key.id;
  }

  async getAttachments(payload: WAMessage): Promise<SendAttachment[]> {
    const attachments: SendAttachment[] = [];
    
    // Handle regular media attachments
    const hasMedia = payload.media?.url;
    if (hasMedia) {
      const media = payload.media;
      this.logger.info(`Downloading media from '${media.url}'...`);
      const buffer = await this.waha.fetch(media.url);
      const fileContent = buffer.toString('base64');
      let filename = media.filename;
      if (!filename) {
        const extension = mime.extension(media.mimetype);
        filename = `no-filename.${extension}`;
      }

      const attachment: SendAttachment = {
        content: fileContent,
        filename: filename,
        encoding: 'base64',
      };
      attachments.push(attachment);
      this.logger.info(`Downloaded media from '${media.url}' as '${filename}'`);
    }
    // Facebook Ad images are handled directly in getFacebookAdMessage method
    // This method only handles regular media attachments

    return attachments;
  }
}
