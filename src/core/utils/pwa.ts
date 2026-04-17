/**
 * Proto WhatsApp Utils
 */

import { normalizeMessageContent, proto } from '@adiwajshing/baileys';
import esm from '@waha/vendor/esm';

export function IsEditedMessage(message: proto.IMessage): boolean {
  message = normalizeMessageContent(message);
  if (!message) {
    return false;
  }
  if (
    message?.protocolMessage?.type !==
    proto.Message.ProtocolMessage.Type.MESSAGE_EDIT
  ) {
    return false;
  }
  if (message?.protocolMessage?.editedMessage == null) {
    return false;
  }
  return true;
}

export function IsHistorySyncNotification(message: proto.IMessage): boolean {
  message = normalizeMessageContent(message);
  if (!message) {
    return false;
  }
  if (
    message?.protocolMessage?.type !==
    proto.Message.ProtocolMessage.Type.HISTORY_SYNC_NOTIFICATION
  ) {
    return false;
  }
  if (message?.protocolMessage?.historySyncNotification == null) {
    return false;
  }
  return true;
}

export function getContextInfo(
  protoMessage: proto.Message | null,
): proto.IContextInfo | null {
  const type = esm.b.getContentType(protoMessage);
  const message = protoMessage[type] as any;
  return message?.contextInfo;
}
