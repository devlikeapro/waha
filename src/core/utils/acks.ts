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
