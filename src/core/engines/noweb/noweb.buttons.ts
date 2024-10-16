import { generateWAMessageFromContent, proto } from '@adiwajshing/baileys';
import { Button, ButtonType } from '@waha/structures/chatting.buttons.dto';

function toName(type: ButtonType) {
  switch (type) {
    case ButtonType.REPLY:
      return 'quick_reply';
    case ButtonType.URL:
      return 'cta_url';
    case ButtonType.CALL:
      return 'cta_call';
    case ButtonType.COPY:
      return 'cta_copy';
  }
}

export function randomId() {
  // generate 16 random digits
  return Math.random().toString().slice(2, 18);
}

export function buttonToJson(button: Button) {
  const name = toName(button.type);
  const buttonParams: any = {
    display_text: button.text,
    id: button.id || randomId(),
    disabled: false,
  };
  switch (button.type) {
    case ButtonType.REPLY:
      break;
    case ButtonType.CALL:
      buttonParams.phone_number = button.phoneNumber;
      break;
    case ButtonType.COPY:
      buttonParams.copy_code = button.copyCode;
      break;
    case ButtonType.URL:
      buttonParams.url = button.url;
      buttonParams.merchant_url = button.url;
      break;
  }
  return {
    name: name,
    buttonParamsJson: JSON.stringify(buttonParams),
  };
}

export async function sendButtonMessage(
  sock: any,
  chatId: string,
  buttons: Button[],
  header?: string,
  headerImage?: any,
  body?: string,
  footer?: string,
) {
  const data = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
        },
        interactiveMessage: {
          body: undefined,
          header: undefined,
          footer: undefined,
          nativeFlowMessage: {
            buttons: buttons.map(buttonToJson),
            messageParamsJson: JSON.stringify({
              from: 'api',
              templateId: randomId(),
            }),
          },
        },
      },
    },
  };

  if (header || headerImage) {
    data.viewOnceMessage.message.interactiveMessage.header = {
      title: header,
      hasMediaAttachment: !!headerImage,
      imageMessage: headerImage,
    };
  }
  if (body) {
    data.viewOnceMessage.message.interactiveMessage.body = {
      text: body,
    };
  }
  if (footer) {
    data.viewOnceMessage.message.interactiveMessage.footer = {
      text: footer,
    };
  }

  const msg = proto.Message.fromObject(data);
  const fullMessage = generateWAMessageFromContent(chatId, msg, {
    userJid: sock?.user?.id,
  });
  await sock.relayMessage(chatId, fullMessage.message, {
    messageId: fullMessage.key.id,
  });
  return fullMessage;
}
