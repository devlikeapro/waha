import {
  parseGowsConnectFailure,
  parseGowsLoggedOut,
  parseGowsTemporaryBan,
} from '@waha/core/engines/gows/failurereason';

describe('parseGowsLoggedOut', () => {
  it('logout pushed while connected has no code', () => {
    expect(parseGowsLoggedOut({ OnConnect: false, Reason: 0 })).toEqual({
      type: 'LOGGED_OUT',
      code: null,
    });
  });

  it('maps the connect failure code on connect', () => {
    expect(parseGowsLoggedOut({ OnConnect: true, Reason: 401 })).toEqual({
      type: 'LOGGED_OUT',
      code: 401,
    });
    expect(parseGowsLoggedOut({ OnConnect: true, Reason: 403 }).type).toBe(
      'MAIN_DEVICE_GONE',
    );
    expect(parseGowsLoggedOut({ OnConnect: true, Reason: 406 }).type).toBe(
      'UNKNOWN_LOGOUT',
    );
  });

  it('defaults to LOGGED_OUT on an empty payload', () => {
    expect(parseGowsLoggedOut({})).toEqual({ type: 'LOGGED_OUT', code: null });
  });
});

describe('parseGowsTemporaryBan', () => {
  const now = Date.UTC(2026, 9, 16, 12, 0, 0);

  it('parses the ban reason and converts Expire (ns) to unix seconds', () => {
    const reason = parseGowsTemporaryBan(
      { Code: 102, Expire: 3600 * 1e9 },
      now,
    );
    expect(reason).toEqual({
      type: 'TEMPORARY_BAN',
      code: 402,
      banCode: 102,
      banExpiresAt: now / 1000 + 3600,
    });
  });

  it('treats a zero Expire as unknown', () => {
    const reason = parseGowsTemporaryBan({ Code: 101, Expire: 0 }, now);
    expect(reason.banExpiresAt).toBeNull();
  });

  it('keeps unknown ban codes', () => {
    expect(parseGowsTemporaryBan({ Code: 199 }, now).banCode).toBe(199);
  });
});

describe('parseGowsConnectFailure', () => {
  it('keeps the raw code and message for unknown failures', () => {
    expect(parseGowsConnectFailure({ Reason: 499, Message: 'boom' })).toEqual({
      type: 'CONNECT_FAILURE',
      code: 499,
      message: 'boom',
    });
  });

  it('maps known codes', () => {
    expect(parseGowsConnectFailure({ Reason: 405 }).type).toBe(
      'CLIENT_OUTDATED',
    );
  });
});
