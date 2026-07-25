import {
  MessageCappingData,
  MessageCappingStatus,
} from '@waha/structures/sessions.dto';
import { EnsureSeconds } from '@waha/utils/timehelper';

function parseCappingTimestamp(value: any): number | null {
  if (!value) {
    return null;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : EnsureSeconds(parsed);
}

/**
 * Normalize gows' MessageCapping payload (xwa2_message_capping_info).
 */
export function parseGowsMessageCapping(data: any): MessageCappingData {
  const cappingStatus = (data?.capping_status ??
    MessageCappingStatus.NONE) as MessageCappingStatus;
  return {
    cappingStatus: cappingStatus,
    // total/used quota are Go ints, so numbers here; -1 total means "no cap"
    totalQuota: typeof data?.total_quota === 'number' ? data.total_quota : -1,
    usedQuota: typeof data?.used_quota === 'number' ? data.used_quota : 0,
    // cycle timestamps are unix seconds strings, absent when zero (Go's omitzero)
    cycleStart: parseCappingTimestamp(data?.cycle_start_timestamp),
    cycleEnd: parseCappingTimestamp(data?.cycle_end_timestamp),
    mvStatus: data?.mv_status ?? null,
    oteStatus: data?.ote_status ?? null,
  };
}
