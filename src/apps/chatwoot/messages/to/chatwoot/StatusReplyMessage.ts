import type { proto } from '@adiwajshing/baileys';
import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { WAHASelf, WAHASessionAPI } from '@waha/apps/app_sdk/waha/WAHASelf';
import { ChatWootMessagePartial } from '@waha/apps/chatwoot/consumers/waha/base';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { WhatsappToMarkdown } from '@waha/apps/chatwoot/messages/to/chatwoot/utils/markdown';
import { EngineHelper, QuotedMedia } from '@waha/apps/chatwoot/waha';
import { Jid } from '@waha/core/engines/const';
import { WAMessage } from '@waha/structures/responses.dto';
import { Job } from 'bullmq';
import { TextMessage } from './TextMessage';
import { isEmptyString } from './utils/text';
import { SendAttachment } from '@waha/apps/chatwoot/client/types';
import esm from '@waha/vendor/esm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-types');

type StatusReplyType = 'text' | 'image' | 'audio' | 'video' | 'unknown';

interface StatusQuotedMessageInfo {
  data?: any;
  id: string;
  type: StatusReplyType;
  text?: string;
}

export class StatusReplyMessage extends TextMessage {
  constructor(
    locale: Locale,
    logger: ILogger,
    waha: WAHASelf,
    job: Job,
    private readonly session: WAHASessionAPI,
  ) {
    super(locale, logger, waha, job);
  }

  async convert(
    payload: WAMessage,
    protoMessage: proto.Message | null,
  ): Promise<ChatWootMessagePartial | null> {
    if (!payload.replyTo?.id) {
      return null;
    }
    if (!EngineHelper.IsReplyToStatus(payload, protoMessage)) {
      return null;
    }

    let attachments: SendAttachment[] = [];
    const quoted = this.getStatusQuotedMessageInfo(payload);
    let wamessage = null; // aka "quoted from store"

    // Media - Use provided replyTo.media if present
    if (attachments.length === 0 && payload.replyTo.media) {
      const extension = mime.extension(payload.replyTo.media.mimetype);
      payload.replyTo.media.filename = `status-message.${extension}`;
      const quotedAttachments = await super.getAttachments(payload.replyTo);
      attachments = [...attachments, ...quotedAttachments];
    }

    // Media - fetch message by id from store and use it's "media"
    if (attachments.length == 0) {
      wamessage = await this.fetchStatusMessage(quoted.id);
      if (wamessage?.media?.url) {
        const extension = mime.extension(wamessage.media.mimetype);
        wamessage.media.filename = `status-message.${extension}`;
        const quotedAttachments = await super.getAttachments(wamessage);
        attachments = [...attachments, ...quotedAttachments];
      }
    }

    // Media - get media url, key and try to decrypt it
    if (attachments.length == 0) {
      const replyData = payload.replyTo._data;
      const quotedMedia = EngineHelper.ExtractQuotedMedia(replyData);
      if (quotedMedia) {
        const attachment =
          await this.downloadQuotedMediaAttachment(quotedMedia);
        if (attachment) {
          attachments.push(attachment);
        }
      }
    }

    // Act as regular text message, but we'll adjust some properties
    const msg = await super.convert(payload, protoMessage);
    // First goes Quoted attachments, then what sender sent
    msg.attachments = [...attachments, ...msg.attachments];

    // Wrap content with additional info
    const quotedText = quoted.text ?? wamessage?.body ?? payload.replyTo?.body;
    if (
      isEmptyString(quotedText) &&
      isEmptyString(msg.content) &&
      attachments.length === 0
    ) {
      // Nothing to send.
      // Must check msg.content before wrapping it in status reply
      return null;
    }

    msg.content = this.locale.r(TKey.WA_TO_CW_MESSAGE_STATUS_REPLY, {
      type: quoted.type,
      quotedText: WhatsappToMarkdown(quotedText),
      content: msg.content,
    });
    return msg;
  }

  private getStatusQuotedMessageInfo(
    payload: WAMessage,
  ): StatusQuotedMessageInfo {
    const replyData = payload.replyTo._data;
    const imageMessage =
      replyData?.imageMessage || this.getWebjsMediaData(replyData, 'image');
    if (imageMessage) {
      return {
        data: replyData,
        id: payload.replyTo.id,
        type: 'image',
        text: imageMessage.caption ?? payload.replyTo.body ?? replyData?.body,
      };
    }

    const videoMessage =
      replyData?.videoMessage || this.getWebjsMediaData(replyData, 'video');
    if (videoMessage) {
      return {
        data: replyData,
        id: payload.replyTo.id,
        type: 'video',
        text: videoMessage.caption ?? payload.replyTo.body ?? replyData?.body,
      };
    }

    const audioMessage =
      replyData?.audioMessage || this.getWebjsMediaData(replyData, 'audio');
    if (audioMessage) {
      return {
        data: replyData,
        id: payload.replyTo.id,
        type: 'audio',
        text: audioMessage.caption ?? payload.replyTo.body ?? replyData?.body,
      };
    }

    const quotedText =
      replyData?.extendedTextMessage?.text ??
      replyData?.conversation ??
      payload.replyTo.body ??
      replyData?.body;
    return {
      data: replyData,
      id: payload.replyTo.id,
      type: quotedText ? 'text' : 'unknown',
      text: quotedText,
    };
  }

  private getWebjsMediaData(
    replyData: any,
    expectedKind: 'image' | 'video' | 'audio',
  ): any | null {
    if (!replyData) {
      return null;
    }
    const kind = replyData.kind ?? replyData.type;
    if (kind !== expectedKind) {
      return null;
    }
    return replyData;
  }

  private async downloadQuotedMediaAttachment(
    quotedMedia: QuotedMedia,
  ): Promise<SendAttachment | null> {
    try {
      const decrypt = !!quotedMedia.mediaKey;
      const mediaKeyBuffer = decrypt
        ? Buffer.from(quotedMedia.mediaKey, 'base64')
        : undefined;
      const stream = await esm.b.downloadContentFromMessage(
        {
          mediaKey: mediaKeyBuffer,
          directPath: quotedMedia.directPath,
          url: quotedMedia.url,
        },
        quotedMedia.mediaType as any,
        {},
        decrypt,
      );
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const extension = mime.extension(quotedMedia.mimetype);
      const filename = `status-message.${extension}`;
      return {
        content: buffer.toString('base64'),
        filename: filename,
        encoding: 'base64',
      };
    } catch (error) {
      this.logger.warn('Failed to download quoted status media directly');
      this.logger.debug(error);
      return null;
    }
  }

  private async fetchStatusMessage(
    replyMessageId: string,
  ): Promise<WAMessage | null> {
    try {
      const quotedMessage = await this.session.getMessageById(
        Jid.BROADCAST,
        replyMessageId,
        true,
      );
      return quotedMessage || null;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch original status message '${replyMessageId}'`,
      );
      this.logger.debug(error);
      return null;
    }
  }
}
