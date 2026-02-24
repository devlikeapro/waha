import { ChatWootMessagePartial } from '@waha/apps/chatwoot/consumers/waha/base';
import { Locale } from '@waha/apps/chatwoot/i18n/locale';
import { TKey } from '@waha/apps/chatwoot/i18n/templates';
import { MessageToChatWootConverter } from '@waha/apps/chatwoot/messages/to/chatwoot';
import { isEmptyString } from '@waha/apps/chatwoot/messages/to/chatwoot/utils/text';
import { WhatsappToMarkdown } from '@waha/apps/chatwoot/messages/to/chatwoot/utils/markdown';
import type { proto } from '@adiwajshing/baileys';
import { WAMessage } from '@waha/structures/responses.dto';

export class EventMessage implements MessageToChatWootConverter {
  constructor(private readonly l: Locale) { }

  convert(
    payload: WAMessage,
    protoMessage: proto.Message | null,
  ): ChatWootMessagePartial | null {
    const eventMessage = protoMessage?.eventMessage;
    if (!eventMessage) {
      return null;
    }

    const formattedEventMessage = {
      ...eventMessage,
      startTime: this.l.FormatTimestamp(eventMessage.startTime as any),
      endTime: this.l.FormatTimestamp(eventMessage.endTime as any),
    };

    const content = this.l.key(TKey.WA_TO_CW_MESSAGE_EVENT).r({
      payload,
      message: {
        eventMessage: formattedEventMessage,
      },
    });

    if (isEmptyString(content)) {
      return null;
    }

    return {
      content: WhatsappToMarkdown(content),
      attachments: [],
      private: undefined,
    };
  }
}
