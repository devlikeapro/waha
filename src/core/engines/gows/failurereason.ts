import {
  SessionFailureReason,
  SessionFailureReasonType,
} from '@waha/structures/sessions.dto';

// whatsmeow events.ConnectFailureReason
const CONNECT_FAILURE_TYPES: Record<number, SessionFailureReasonType> = {
  401: SessionFailureReasonType.LOGGED_OUT,
  402: SessionFailureReasonType.TEMPORARY_BAN,
  403: SessionFailureReasonType.MAIN_DEVICE_GONE,
  405: SessionFailureReasonType.CLIENT_OUTDATED,
  406: SessionFailureReasonType.UNKNOWN_LOGOUT,
};

function typeFromCode(
  code: number | null,
  fallback: SessionFailureReasonType,
): SessionFailureReasonType {
  return (code !== null && CONNECT_FAILURE_TYPES[code]) || fallback;
}

function toNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Normalize whatsmeow's events.LoggedOut payload - { OnConnect, Reason }.
 * 'Reason' is only meaningful when 'OnConnect' is true (logout on a connect
 * failure); a logout pushed while connected (stream error) has no code.
 */
export function parseGowsLoggedOut(data: any): SessionFailureReason {
  const code = data?.OnConnect ? toNumber(data?.Reason) : null;
  return {
    type: typeFromCode(code, SessionFailureReasonType.LOGGED_OUT),
    code: code,
  };
}

/**
 * Normalize whatsmeow's events.TemporaryBan payload - { Code, Expire }.
 * 'Expire' is a Go time.Duration, so it's serialized in nanoseconds.
 */
export function parseGowsTemporaryBan(
  data: any,
  now: number = Date.now(),
): SessionFailureReason {
  const expireNs = toNumber(data?.Expire);
  let banExpiresAt: number | null = null;
  if (expireNs !== null && expireNs > 0) {
    banExpiresAt = Math.floor((now + expireNs / 1e6) / 1000);
  }
  return {
    type: SessionFailureReasonType.TEMPORARY_BAN,
    code: 402,
    banCode: toNumber(data?.Code),
    banExpiresAt: banExpiresAt,
  };
}

/**
 * Normalize whatsmeow's events.ConnectFailure payload - { Reason, Message }.
 * whatsmeow emits it for connect failures it doesn't handle itself.
 */
export function parseGowsConnectFailure(data: any): SessionFailureReason {
  const code = toNumber(data?.Reason);
  return {
    type: typeFromCode(code, SessionFailureReasonType.CONNECT_FAILURE),
    code: code,
    message: data?.Message || null,
  };
}
