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
import { WAMedia } from '@waha/structures/media.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mime = require('mime-types');

export class TextMessage implements MessageToChatWootConverter {
  constructor(
    protected readonly locale: Locale,
    protected readonly logger: ILogger,
    protected readonly waha: WAHASelf,
    protected readonly job: Job,
  ) {}

  async convert(
    payload: WAMessage,
    protoMessage: proto.Message | null,
  ): Promise<ChatWootMessagePartial | null> {
    void protoMessage;
    const attachments = await this.getAttachments(payload);
    let content = this.locale.key(TKey.WA_TO_CW_MESSAGE).render({ payload });
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

  protected async getAttachments(payload: {
    media?: WAMedia;
  }): Promise<SendAttachment[]> {
    const hasMedia = payload.media?.url;
    if (!hasMedia) {
      return [];
    }

    const media = payload.media!;
    this.logger.debug(`Downloading media from '${media.url}'...`);
    const buffer = await this.waha.fetch(media.url);
    const fileContent = buffer.toString('base64');
    let filename = media.filename;
    if (!filename) {
      const extension = mime.extension(media.mimetype);
      filename = `no-filename.${extension}`;
    }

    const attachment: SendAttachment = {
      content: fileContent,
      filename,
      encoding: 'base64',
    };
    this.logger.info(`Downloaded media from '${media.url}' as '${filename}'`);
    return [attachment];
  }
}
