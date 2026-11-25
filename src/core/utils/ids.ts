import type { WAMessageKey } from '@adiwajshing/baileys';
import { toJID } from '@waha/core/utils/jids';
import { MessageId } from '@wppconnect-team/wppconnect';

/**
 * Parse one string (serialized) message id to a message key
 *
 * {fromMe}_{chatId}_{id}[_{participant}]
 * - {chatId} never contains "_"
 * - {id} may contain "_" (batched status: 0123ABCD__part__abcdefgh)
 * - {participant} is the last part, only when it is a jid (has "@")
 *
 *   false_11111111111@c.us_AAA =>
 *   {fromMe: false, remoteJid: "11111111111@s.whatsapp.net", id: "AAA"}
 *
 *   true_123@g.us_AAA_111@lid =>
 *   {fromMe: true, remoteJid: "123@g.us", id: "AAA", participant: "111@lid"}
 *
 *   false_status@broadcast_AAA__part__abc_111@lid =>
 *   {fromMe: false, remoteJid: "status@broadcast", id: "AAA__part__abc", participant: "111@lid"}
 *
 *   AAA (soft only)           => {id: "AAA"}
 */
export function parseMessageIdSerialized(
  messageId: string,
  soft: boolean = false,
): WAMessageKey {
  // false_status@broadcast_AAA__part__abc_111@lid
  // => fromMe: "false", chatId: "status@broadcast", rest: ["AAA", "", "part", "", "abc", "111@lid"]
  const [fromMe, chatId, ...rest] = messageId.split('_');

  // rest: ["AAA", "", "part", "", "abc", "111@lid"] => participant: "111@lid"
  let participant: string | undefined;
  if (rest.length > 1 && rest[rest.length - 1].includes('@')) {
    participant = rest.pop();
  }

  // rest: ["AAA", "", "part", "", "abc"] => id: "AAA__part__abc"
  const id = rest.join('_');

  let valid = true;
  if (fromMe !== 'true' && fromMe !== 'false') {
    valid = false;
  }
  if (!chatId) {
    valid = false;
  }
  if (!id) {
    valid = false;
  }
  if (!valid && soft) {
    return { id: messageId };
  }
  if (!valid) {
    throw new Error(
      'Message id be in format false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA[_participant]',
    );
  }
  return {
    fromMe: fromMe === 'true',
    id: id,
    remoteJid: toJID(chatId),
    participant: participant ? toJID(participant) : undefined,
  };
}

/**
 * Batched status stanza id "<id>__part__<suffix>" => "<id>", the id the status is stored by
 */
export function normalizeStatusStanzaId(id: string): string {
  const idx = id.indexOf('__part__');
  if (idx <= 0) {
    return id;
  }
  return id.slice(0, idx);
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
