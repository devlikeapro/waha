import { ILogger } from '@waha/apps/app_sdk/ILogger';
import { SendAttachment } from '@waha/apps/chatwoot/client/types';
import { ChatWootMessagePartial } from '@waha/apps/chatwoot/consumers/waha/base';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { isEmptyString } from './utils/text';
import type { proto } from '@adiwajshing/baileys';
import { WAMessage } from '@waha/structures/responses.dto';
import { MessageToChatWootConverter } from '@waha/apps/chatwoot/messages/to/chatwoot';
import { WhatsappToMarkdown } from '@waha/apps/chatwoot/messages/to/chatwoot/utils/markdown';
import { JobLink } from '@waha/apps/app_sdk/JobUtils';
import { Job } from 'bullmq';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-types');

type StatusReplyType = 'text' | 'image' | 'audio' | 'video' | 'unknown';

interface StatusReplyMediaDetails {
  url: string;
  mimetype?: string;
  type: 'image' | 'audio' | 'video';
}

interface StatusReplyDetails {
  statusType: StatusReplyType;
  quotedText?: string;
  media?: StatusReplyMediaDetails;
}

export class TextMessage implements MessageToChatWootConverter {
  constructor(
    private readonly locale: Locale,
    private readonly logger: ILogger,
    private readonly waha: WAHASelf,
    private readonly job: Job,
  ) {}

  async convert(
    payload: WAMessage,
    protoMessage: proto.Message | null,
  ): Promise<ChatWootMessagePartial | null> {
    void protoMessage;
    const statusReplyDetails = this.getStatusReplyDetails(payload);
    const attachments = await this.getAttachments(payload, statusReplyDetails);
    let content = this.locale.key(TKey.WA_TO_CW_MESSAGE).render({ payload });
    if (statusReplyDetails) {
      content = this.wrapStatusReplyContent(content, statusReplyDetails);
    }
    if (isEmptyString(content) && attachments.length === 0) {
      // No media, no content - return null so we can process it later
      return null;
    }
    if (isEmptyString(content)) {
      // There's some media, but no content
      // force content to be null for nice UI in ChatWoot
      content = null;
    }
    if (attachments.length == 0 && payload.hasMedia) {
      // Has media flag, but we couldn't find any media
      // Add a warning at the end of content
      content = this.locale.r(
        'whatsapp.to.chatwoot.message.has.media.no.media',
        {
          content: content,
          details: JobLink(this.job),
        },
      );
    }
    return {
      content: WhatsappToMarkdown(content),
      attachments: attachments,
      private: undefined,
    };
  }

  private async getAttachments(
    payload: WAMessage,
    statusReplyDetails: StatusReplyDetails | null,
  ): Promise<SendAttachment[]> {
    const attachments: SendAttachment[] = [];
    const media = payload.media;
    if (media?.url) {
      const attachment = await this.downloadAttachment(media.url, media.filename, {
        fallbackBaseName: 'no-filename',
        mimetype: media.mimetype,
      });
      if (attachment) {
        attachments.push(attachment);
      }
    }

    const statusMedia = statusReplyDetails?.media;
    if (!statusMedia?.url) {
      return attachments;
    }

    const statusAttachment = await this.downloadAttachment(
      statusMedia.url,
      undefined,
      {
        fallbackBaseName: `status-reply-${statusMedia.type}`,
        mimetype: statusMedia.mimetype,
      },
    );
    if (statusAttachment) {
      attachments.push(statusAttachment);
    }
    return attachments;
  }

  private async downloadAttachment(
    url: string,
    filename: string | undefined,
    options: {
      fallbackBaseName: string;
      mimetype?: string;
    },
  ): Promise<SendAttachment | null> {
    this.logger.debug(`Downloading media from '${url}'...`);
    const buffer = await this.waha.fetch(url);
    const fileContent = buffer.toString('base64');
    const resolvedFilename = this.resolveFilename(
      filename,
      options.fallbackBaseName,
      options.mimetype,
    );
    const attachment: SendAttachment = {
      content: fileContent,
      filename: resolvedFilename,
      encoding: 'base64',
    };
    this.logger.info(`Downloaded media from '${url}' as '${resolvedFilename}'`);
    return attachment;
  }

  private resolveFilename(
    filename: string | undefined,
    fallbackBaseName: string,
    mimetype: string | undefined,
  ): string {
    if (!isEmptyString(filename)) {
      return filename!;
    }
    const extensionFromMime = mimetype ? mime.extension(mimetype) : false;
    const extension = extensionFromMime || 'bin';
    return `${fallbackBaseName}.${extension}`;
  }

  private wrapStatusReplyContent(
    content: string | null,
    statusReplyDetails: StatusReplyDetails,
  ): string {
    const contentWithFallback = content ?? '';
    if (statusReplyDetails.quotedText) {
      return this.locale.r(TKey.WA_TO_CW_MESSAGE_STATUS_REPLY_WITH_TEXT, {
        type: statusReplyDetails.statusType,
        quotedText: statusReplyDetails.quotedText,
        content: contentWithFallback,
      });
    }

    return this.locale.r(TKey.WA_TO_CW_MESSAGE_STATUS_REPLY_WITHOUT_TEXT, {
      type: statusReplyDetails.statusType,
      content: contentWithFallback,
    });
  }

  private getStatusReplyDetails(payload: WAMessage): StatusReplyDetails | null {
    if (!payload.replyTo) {
      return null;
    }

    const contextInfo = (payload as any)?._data?.Message?.extendedTextMessage
      ?.contextInfo;
    const remoteJid = contextInfo?.remoteJID ?? contextInfo?.remoteJid;
    if (remoteJid !== 'status@broadcast') {
      return null;
    }

    const replyData = (payload.replyTo as any)?._data;
    if (!replyData) {
      return {
        statusType: 'unknown',
      };
    }

    const imageMessage = replyData.imageMessage;
    if (imageMessage) {
      return {
        statusType: 'image',
        media: this.getStatusReplyMediaDetails('image', imageMessage),
      };
    }

    const audioMessage = replyData.audioMessage;
    if (audioMessage) {
      return {
        statusType: 'audio',
        media: this.getStatusReplyMediaDetails('audio', audioMessage),
      };
    }

    const videoMessage = replyData.videoMessage;
    if (videoMessage) {
      return {
        statusType: 'video',
        media: this.getStatusReplyMediaDetails('video', videoMessage),
      };
    }

    const extendedTextMessage = replyData.extendedTextMessage;
    if (extendedTextMessage) {
      return {
        statusType: 'text',
        quotedText: extendedTextMessage.text,
      };
    }

    const conversation = replyData.conversation;
    if (conversation) {
      return {
        statusType: 'text',
        quotedText: conversation,
      };
    }

    return {
      statusType: 'unknown',
    };
  }

  private getStatusReplyMediaDetails(
    type: 'image' | 'audio' | 'video',
    data: any,
  ): StatusReplyMediaDetails | undefined {
    const url = data?.URL ?? data?.url;
    if (!url) {
      return undefined;
    }
    return {
      type: type,
      url: url,
      mimetype: data?.mimetype,
    };
  }
}
