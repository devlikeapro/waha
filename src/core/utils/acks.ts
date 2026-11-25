import { WAMessageAck, WAMessageAckName } from '@waha/structures/enums.dto';

export function StatusToAck(status: number): WAMessageAck {
  return status - 1;
}

export function AckToStatus(ack: number): number {
  return ack + 1;
}

export function StatusStringToStatus(status: number | string): number {
  switch (status) {
    case WAMessageAckName.ERROR:
      return AckToStatus(WAMessageAck.ERROR);
    case WAMessageAckName.PENDING:
      return AckToStatus(WAMessageAck.PENDING);
    case WAMessageAckName.SERVER:
      return AckToStatus(WAMessageAck.SERVER);
    case WAMessageAckName.READ:
      return AckToStatus(WAMessageAck.READ);
    case WAMessageAckName.PLAYED:
      return AckToStatus(WAMessageAck.PLAYED);
    default:
      return status as any;
  }
}

interface UserReceipt {
  userJid?: string;
  receiptTimestamp?: unknown;
  readTimestamp?: unknown;
  playedTimestamp?: unknown;
}

/**
 * Highest ack reached by any member in group receipts (NOWEB userReceipt), same as GOWS.
 */
export function ReceiptsToAck(
  receipts: UserReceipt[] | null,
): WAMessageAck | null {
  let ack: WAMessageAck | null = null;
  for (const receipt of receipts ?? []) {
    let level: WAMessageAck | null = null;
    if (receipt.playedTimestamp) {
      level = WAMessageAck.PLAYED;
    } else if (receipt.readTimestamp) {
      level = WAMessageAck.READ;
    } else if (receipt.receiptTimestamp) {
      level = WAMessageAck.DEVICE;
    }
    if (level !== null && (ack === null || level > ack)) {
      ack = level;
    }
  }
  return ack;
}
