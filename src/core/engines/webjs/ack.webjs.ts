import type { proto } from '@adiwajshing/baileys';
import type { BinaryNode } from '@adiwajshing/baileys';
import { isJidGroup, isJidStatusBroadcast } from '@waha/core/utils/jids';
import { WAMessageAck } from '@waha/structures/enums.dto';
import esm from '@waha/vendor/esm';

const MAX_ACK_REASON_LENGTH = 256;

function toAckReason(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) {
    return value.trim().slice(0, MAX_ACK_REASON_LENGTH);
  }
  if (value && typeof value === 'object') {
    return toAckReason((value as { message?: unknown }).message);
  }
  return undefined;
}

/**
 * WebJS exposes the useful send failure details on the raw message when they
 * are available. Keep this extraction narrow because the raw object contains
 * internal and potentially sensitive WhatsApp state.
 */
export function getWebjsAckReason(
  message: any,
  ack: number,
): string | undefined {
  if (ack !== WAMessageAck.ERROR) {
    return undefined;
  }

  const data = message?.rawData ?? message?._data ?? message;
  const candidates = [
    data?.errorMessage,
    data?.error,
    data?.sendError,
    data?.sendResult?.error,
    data?.sendResult?.message,
    data?.lastError,
  ];
  for (const candidate of candidates) {
    const reason = toAckReason(candidate);
    if (reason) {
      return reason;
    }
  }

  return 'WhatsApp returned ACK_ERROR before delivery';
}

export function getWebjsMessageAck(message: any, eventAck?: number): number {
  return eventAck ?? message?.ack;
}

export interface ReceiptEvent {
  key: proto.IMessageKey;
  participant?: string;
  messageIds: string[];
  status: number;
  _node: any;
}

interface Me {
  id: string;
  lid?: string;
}

export function jid(field: any) {
  if (!field) {
    return field;
  }
  const data = field['$1'];
  if (!data) {
    return data;
  }

  let server = data.server;
  if (!server) {
    server =
      data.domainType === 0 || data.domainType === 128
        ? 's.whatsapp.net'
        : 'lid';
  }
  return esm.b.jidEncode(data.user, server, data.device);
}

export function TagReceiptNodeToReceiptEvent(
  node: BinaryNode,
  me: Me,
): ReceiptEvent[] {
  const { attrs, content } = node;
  const status = esm.b.getStatusFromReceiptType(attrs.type);
  if (status == null) {
    return [];
  }

  const from = esm.b.jidNormalizedUser(jid(attrs.from));
  const participant = esm.b.jidNormalizedUser(jid(attrs.participant));
  const recipient = esm.b.jidNormalizedUser(jid(attrs.recipient));

  const isLid = from.includes('lid');
  const isNodeFromMe = esm.b.areJidsSameUser(
    participant || from,
    isLid ? me?.lid : me?.id,
  );
  const remoteJid = !isNodeFromMe || isJidGroup(from) ? from : recipient;
  const fromMe = !recipient || (attrs.type === 'retry' && isNodeFromMe);

  // basically, we only want to know when a message from us has been delivered to/read by the other person
  // or another device of ours has read some messages
  if (status < esm.b.proto.WebMessageInfo.Status.SERVER_ACK && isNodeFromMe) {
    return [];
  }

  const key: proto.IMessageKey = {
    remoteJid: remoteJid,
    id: '',
    fromMe: fromMe,
  };

  const ids = [attrs.id];
  if (Array.isArray(content)) {
    const items = esm.b.getBinaryNodeChildren(content[0], 'item');
    ids.push(...items.map((i) => i.attrs.id));
  }

  if (isJidGroup(remoteJid) || isJidStatusBroadcast(remoteJid)) {
    if (participant) {
      key.participant = fromMe ? (isLid ? me.lid : me.id) : recipient;
      const eventParticipant = fromMe ? participant : isLid ? me.lid : me.id;
      return [
        {
          key: key,
          messageIds: ids,
          status: status as any,
          participant: eventParticipant,
          _node: node,
        },
      ];
    } else {
      // Handle grouped receipts
      return handleGroupedReceipts(node, key, status, fromMe, isLid, me);
    }
  }

  return [
    {
      key: key,
      messageIds: ids,
      status: status as any,
      _node: node,
    },
  ];
}

function handleGroupedReceipts(
  node: BinaryNode,
  key: proto.IMessageKey,
  status: number,
  fromMe: boolean,
  isLid: boolean,
  me: Me,
): ReceiptEvent[] {
  const { content } = node;
  if (!Array.isArray(content)) {
    return [];
  }
  const participantsTags = content.filter((c) => c.tag === 'participants');
  if (participantsTags.length === 0) {
    return [];
  }

  const receiptEvents: ReceiptEvent[] = [];

  for (const participants of participantsTags) {
    const participantKey = participants.attrs?.key;
    if (!participantKey) continue;

    const users = esm.b.getBinaryNodeChildren(participants, 'user');
    for (const user of users) {
      const userAttrs = user.attrs;
      if (!userAttrs) continue;

      const userJid = esm.b.jidNormalizedUser(jid(userAttrs.jid));
      if (!userJid) continue;

      key.participant = fromMe ? (isLid ? me.lid : me.id) : userJid;
      const eventParticipant = fromMe ? userJid : isLid ? me.lid : me.id;
      const receiptEvent: ReceiptEvent = {
        key: {
          ...key,
          id: participantKey,
        },
        messageIds: [participantKey],
        status: status as any,
        participant: eventParticipant,
        _node: node,
      };

      receiptEvents.push(receiptEvent);
    }
  }

  return receiptEvents;
}
