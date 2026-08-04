import {
  ReachoutTimelockData,
  ReachoutTimelockEnforcementType,
} from '@waha/structures/sessions.dto';
import { EnsureSeconds } from '@waha/utils/timehelper';

/**
 * Normalize whatsmeow's events.NotifyAccountReachoutTimelock payload.
 */
export function parseGowsReachoutTimelock(data: any): ReachoutTimelockData {
  // 'time_enforcement_ends' is a unix seconds string, absent when zero (Go's omitzero)
  let timeEnforcementEnds: number | null = null;
  if (data?.time_enforcement_ends) {
    const parsed = parseInt(data.time_enforcement_ends, 10);
    timeEnforcementEnds = Number.isNaN(parsed) ? null : EnsureSeconds(parsed);
  }
  const enforcementType =
    data?.enforcement_type ?? ReachoutTimelockEnforcementType.DEFAULT;
  return {
    enforcementType: enforcementType as ReachoutTimelockEnforcementType,
    // 'is_active' is absent when false (Go's omitempty)
    isActive: data?.is_active === true,
    timeEnforcementEnds: timeEnforcementEnds,
  };
}
