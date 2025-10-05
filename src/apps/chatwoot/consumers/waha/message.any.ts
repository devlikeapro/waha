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
    msg = this.getPollMessage(payload, protoMessage);
    if (msg) {
      return msg;
    }
    msg = this.getEventMessage(payload, protoMessage);
    if (msg) {
      return msg;
    }
    msg = this.getPixMessage(payload, protoMessage);
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

  private getPollMessage(
    payload: WAMessage,
    message: proto.Message | null,
  ): ChatWootMessagePartial | null {
    const hasPoll = !lodash.isEmpty(message?.pollCreationMessageV3);
    if (!hasPoll) {
      return null;
    }
    const poll = this.l.key(TKey.WA_TO_CW_MESSAGE_POLL).r({
      payload,
      message,
    });
    if (isEmptyString(poll)) {
      return null;
    }
    return {
      content: WhatsappToMarkdown(poll),
      attachments: [],
      private: undefined,
    };
  }

  private getEventMessage(
    payload: WAMessage,
    message: proto.Message | null,
  ): ChatWootMessagePartial | null {
    const hasEvent = !lodash.isEmpty(message?.eventMessage);
    if (!hasEvent) {
      return null;
    }

    // Converter timestamps Unix para datas legíveis
    const eventData = message.eventMessage;
    const formatTimestamp = (timestamp: number | string | any | undefined): string | undefined => {
      if (!timestamp) return undefined;
      
      // Converter Long para number se necessário
      let ts: number;
      if (typeof timestamp === 'object' && timestamp.toNumber) {
        ts = timestamp.toNumber();
      } else if (typeof timestamp === 'string') {
        ts = parseInt(timestamp);
      } else {
        ts = timestamp as number;
      }
      
      if (isNaN(ts)) return undefined;
      
      // Converter de segundos para milissegundos se necessário
      const date = new Date(ts > 10000000000 ? ts : ts * 1000);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
    };

    const event = this.l.key(TKey.WA_TO_CW_MESSAGE_EVENT).r({
      payload,
      message: {
        ...message,
        eventMessage: eventData,
        // Adicionar campos formatados separadamente para o template
        formattedStartTime: formatTimestamp(eventData.startTime),
        formattedEndTime: formatTimestamp(eventData.endTime),
      },
    });
    if (isEmptyString(event)) {
      return null;
    }
    return {
      content: WhatsappToMarkdown(event),
      attachments: [],
      private: undefined,
    };
  }

  private getPixMessage(
    payload: WAMessage,
    message: proto.Message | null,
  ): ChatWootMessagePartial | null {
    // Verificar se há dados PIX no payload
    const pixData = this.extractPixData(payload);
    if (!pixData) {
      return null;
    }

    const pix = this.l.key(TKey.WA_TO_CW_MESSAGE_PIX).r({
      payload,
      message,
      pixData,
    });
    if (isEmptyString(pix)) {
      return null;
    }
    return {
      content: WhatsappToMarkdown(pix),
      attachments: [],
      private: undefined,
    };
  }

  private extractPixData(payload: WAMessage): any | null {
    try {
      this.logger.info('Starting PIX data extraction...');
      
      // Tentar primeiro em Message, depois em RawMessage
      const messageData = payload._data?.Message || payload._data?.RawMessage;
      this.logger.info(`Message data found: ${!!messageData}`);
      
      // Log da estrutura completa para debug
      this.logger.info(`Message data structure: ${JSON.stringify(messageData, null, 2).substring(0, 500)}...`);
      
      if (!messageData?.interactiveMessage?.InteractiveMessage?.NativeFlowMessage?.buttons) {
        this.logger.warn('No interactive message buttons found');
        this.logger.info(`Available keys in messageData: ${Object.keys(messageData || {}).join(', ')}`);
        if (messageData?.interactiveMessage) {
          this.logger.info(`interactiveMessage keys: ${Object.keys(messageData.interactiveMessage).join(', ')}`);
        }
        return null;
      }

      const buttons = messageData.interactiveMessage.InteractiveMessage.NativeFlowMessage.buttons;
      this.logger.info(`Found ${buttons.length} buttons`);
      
      const paymentButton = buttons.find((btn: any) => btn.name === 'payment_info');
      this.logger.info(`Payment button found: ${!!paymentButton}`);
      
      if (!paymentButton?.buttonParamsJSON) {
        this.logger.warn('No buttonParamsJSON found');
        return null;
      }

      this.logger.info(`ButtonParamsJSON: ${paymentButton.buttonParamsJSON.substring(0, 100)}...`);
      
      const pixInfo = JSON.parse(paymentButton.buttonParamsJSON);
      const pixSettings = pixInfo.payment_settings?.find((setting: any) => setting.type === 'pix_static_code');
      
      if (!pixSettings?.pix_static_code) {
        this.logger.warn('No PIX static code settings found');
        return null;
      }

      const pixCode = pixSettings.pix_static_code;
      const result = {
        merchantName: pixCode.merchant_name,
        key: pixCode.key,
        keyType: pixCode.key_type,
        currency: pixInfo.currency,
        totalAmount: pixInfo.total_amount?.value || 0,
        referenceId: pixInfo.reference_id,
      };
      
      this.logger.info(`PIX data extracted successfully: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.warn(`Failed to extract PIX data: ${error}`);
      return null;
    }
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
    //
    // WAHA
    //
    const hasMedia = payload.media?.url;
    if (!hasMedia) {
      return [];
    }

    const attachments: SendAttachment[] = [];
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
    return attachments;
  }
}
