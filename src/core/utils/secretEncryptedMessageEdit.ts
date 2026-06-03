/**
 * Decrypt secret-encrypted message edits (secretEncType MESSAGE_EDIT).
 *
 * Mirrors whatsmeow's generateMsgSecretKey + gcmutil.Decrypt for EncSecretMessageEdit.
 * @see https://github.com/tulir/whatsmeow/blob/main/msgsecret.go
 *
 * Key derivation uses Baileys' own hkdf (whatsapp-rust-bridge), which passes nil/undefined
 * salt = 32-byte zeros, matching Go's golang.org/x/crypto/hkdf with nil salt.
 */
import { aesDecryptGCM, hkdf, proto } from '@adiwajshing/baileys';

const ENC_SECRET_MESSAGE_EDIT = 'Message Edit';

export function jidToNonAD(jid: string): string {
  if (!jid || !jid.includes('@')) {
    return jid;
  }
  const [user, server] = jid.split('@', 2);
  return `${user.split(':')[0]}@${server || ''}`;
}

/**
 * Mirrors whatsmeow getOrigSenderFromKey — resolves the JID used as the
 * "origMsgSender" slot in the HKDF info block.
 */
export function getOrigSenderJidForMsgSecret(
  editMessageInfo: { Chat?: string; Sender?: string },
  targetMessageKey: {
    fromMe?: boolean;
    FromMe?: boolean;
    remoteJID?: string;
    RemoteJID?: string;
    participant?: string;
    Participant?: string;
  },
): string {
  const chat = editMessageInfo.Chat || '';
  const server = chat.includes('@') ? chat.split('@')[1] : '';
  const sender = editMessageInfo.Sender || '';

  const fromMe =
    targetMessageKey.fromMe === true || targetMessageKey.FromMe === true;
  const remoteJid =
    targetMessageKey.remoteJID || targetMessageKey.RemoteJID || '';
  const participant =
    targetMessageKey.participant || targetMessageKey.Participant || '';

  if (fromMe) {
    return jidToNonAD(sender);
  }
  if (server === 's.whatsapp.net' || server === 'lid') {
    return jidToNonAD(remoteJid);
  }
  return jidToNonAD(participant);
}

/**
 * Derives the AES-256-GCM key for a MESSAGE_EDIT secret-encrypted payload.
 *
 * Matches whatsmeow's generateMsgSecretKey:
 *   useCaseSecret = msgId + origSenderJid + modSenderJid + "Message Edit"
 *   key = HKDF-SHA256(ikm=origMsgSecret, salt=nil→32×0, info=useCaseSecret)
 */
export function generateMsgSecretKeyForMessageEdit(
  origMsgId: string,
  origSenderJid: string,
  modificationSenderJid: string,
  origMsgSecret: Uint8Array,
): Buffer {
  const useCaseInfo = Buffer.concat([
    Buffer.from(origMsgId, 'utf8'),
    Buffer.from(jidToNonAD(origSenderJid), 'utf8'),
    Buffer.from(jidToNonAD(modificationSenderJid), 'utf8'),
    Buffer.from(ENC_SECRET_MESSAGE_EDIT, 'utf8'),
  ]);
  // No salt → Rust bridge uses 32 zero bytes, matching whatsmeow nil salt.
  // info must be passed as latin1 string so each byte maps 1:1 (same as binary concat).
  return Buffer.from(
    hkdf(origMsgSecret, 32, { info: useCaseInfo.toString('latin1') }),
  );
}

/**
 * Decrypts a secretEncryptedMessage (MESSAGE_EDIT) payload and decodes the
 * resulting proto.Message. Throws on AES-GCM auth failure or proto decode error.
 */
export function decryptSecretEncryptedMessageEditProto(params: {
  encPayload: Uint8Array;
  encIv: Uint8Array;
  origMsgId: string;
  origSenderJid: string;
  modificationSenderJid: string;
  origMsgSecret: Uint8Array;
}): proto.Message {
  const {
    encPayload,
    encIv,
    origMsgId,
    origSenderJid,
    modificationSenderJid,
    origMsgSecret,
  } = params;
  const secretKey = generateMsgSecretKeyForMessageEdit(
    origMsgId,
    origSenderJid,
    modificationSenderJid,
    origMsgSecret,
  );
  // MESSAGE_EDIT uses an empty additionalData (unlike Poll Vote which uses msgId+voterJid)
  const plaintext = aesDecryptGCM(
    encPayload,
    secretKey,
    encIv,
    Buffer.alloc(0),
  );
  return proto.Message.decode(plaintext);
}
