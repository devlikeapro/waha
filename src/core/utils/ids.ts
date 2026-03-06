import type { WAMessageKey } from '@adiwajshing/baileys';
import { toJID } from '@waha/core/utils/jids';
import { MessageId } from '@wppconnect-team/wppconnect';

/**
 * Parse message id from WAHA to engine
 * false_11111111111@c.us_AAA
 * {id: "AAA", remoteJid: "11111111111@s.whatsapp.net", "fromMe": false}
 */
export function parseMessageIdSerialized(
  messageId: string,
  soft: boolean = false,
): WAMessageKey {
  if (!messageId.includes('_') && soft) {
    return { id: messageId };
  }

  const parts = messageId.split('_');
  if (parts.length != 3 && parts.length != 4) {
    throw new Error(
      'Message id be in format false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA[_participant]',
    );
  }
  const fromMe = parts[0] == 'true';
  const chatId = parts[1];
  const remoteJid = toJID(chatId);
  const id = parts[2];
  const participant = parts[3] ? toJID(parts[3]) : undefined;
  return {
    fromMe: fromMe,
    id: id,
    remoteJid: remoteJid,
    participant: participant,
  };
}

export function SerializeMessageKey(key: WAMessageKey) {
  const { fromMe, id, remoteJid, participant } = key;
  const participantStr = participant ? `_${participant}` : '';
  return `${fromMe ? 'true' : 'false'}_${remoteJid}_${id}${participantStr}`;
}

export function SerializeMsgKey(key: string | MessageId) {
  if (typeof key == 'string') {
    return key;
  }
  if (key._serialized) {
    return key._serialized;
  }
  const k: WAMessageKey = {
    id: key.id,
    fromMe: key.fromMe,
    remoteJid: key.remote?._serialized || (key.remote as any),
    participant: (key as any).participant,
  };
  return SerializeMessageKey(k);
}

export function Deserialized(
  value: string | { _serialized: string } | any,
): string | null {
  if (typeof value == 'string') {
    return value;
  }
  if (value?._serialized) {
    return value._serialized;
  }
  return null;
}
