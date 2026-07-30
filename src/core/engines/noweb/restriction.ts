import { AckToStatus } from '@waha/core/utils/acks';
import { WAMessageAck } from '@waha/structures/enums.dto';
import { SessionRestriction } from '@waha/structures/sessions.dto';
import { WAMessageAckError } from '@waha/structures/webhooks.dto';

// Server error code for a 1:1 message rejected due to account restriction
// (missing tctoken / "reachout timelock"). Arrives as a bad ack with status ERROR.
export const ACCOUNT_RESTRICTED_CODE = '463';

// Baileys reachout-timelock state (connection.update / fetchAccountReachoutTimelock)
export interface ReachoutTimelockState {
  isActive?: boolean;
  timeEnforcementEnds?: Date | string | number;
  enforcementType?: string;
}

// Normalize a Baileys reachout-timelock state into a SessionRestriction.
// Returns null when the account is not restricted.
export function normalizeRestriction(
  state: ReachoutTimelockState,
): SessionRestriction | null {
  if (!state?.isActive) {
    return null;
  }
  let until: string | null = null;
  if (state.timeEnforcementEnds) {
    // The server value is parsed upstream, so it can be an Invalid Date -
    // toISOString() would throw on it.
    const end = new Date(state.timeEnforcementEnds);
    if (!isNaN(end.getTime())) {
      until = end.toISOString();
    }
  }
  return {
    active: true,
    until: until,
    enforcementType: state.enforcementType,
  };
}

// Build the error block for an ack update. Returns null unless it is an error
// ack (status ERROR). For account restriction (463) it attaches the block
// window taken from the given restriction state.
export function buildAckError(
  update: any,
  restriction: SessionRestriction | null,
): WAMessageAckError | null {
  if (update?.status !== AckToStatus(WAMessageAck.ERROR)) {
    return null;
  }
  const params = update.messageStubParameters || [];
  const code = params[0] != null ? String(params[0]) : null;
  const blocked = code === ACCOUNT_RESTRICTED_CODE;
  const error: WAMessageAckError = {
    code: code,
    blocked: blocked,
  };
  if (blocked) {
    error.reason = 'account_restricted';
    error.until = restriction?.until ?? null;
    error.enforcementType = restriction?.enforcementType;
  }
  return error;
}
