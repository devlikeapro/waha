import { AckToStatus } from '@waha/core/utils/acks';
import {
  buildAckError,
  normalizeRestriction,
} from '@waha/core/engines/noweb/restriction';
import { WAMessageAck } from '@waha/structures/enums.dto';
import { SessionRestriction } from '@waha/structures/sessions.dto';

const ERROR_STATUS = AckToStatus(WAMessageAck.ERROR); // WAProto status 0
const SERVER_STATUS = AckToStatus(WAMessageAck.SERVER); // WAProto status 2

const RESTRICTION: SessionRestriction = {
  active: true,
  until: '2026-06-26T23:45:00.000Z',
  enforcementType: 'DEFAULT',
};

describe('normalizeRestriction', () => {
  it('returns null when not active', () => {
    expect(normalizeRestriction({ isActive: false })).toBeNull();
    expect(normalizeRestriction({})).toBeNull();
    expect(normalizeRestriction(undefined as any)).toBeNull();
  });

  it('maps active state with a window end', () => {
    const end = new Date('2026-06-26T23:45:00.000Z');
    expect(
      normalizeRestriction({
        isActive: true,
        timeEnforcementEnds: end,
        enforcementType: 'BIZ_QUALITY',
      }),
    ).toEqual({
      active: true,
      until: '2026-06-26T23:45:00.000Z',
      enforcementType: 'BIZ_QUALITY',
    });
  });

  it('keeps until null when the window end is missing', () => {
    expect(normalizeRestriction({ isActive: true })).toEqual({
      active: true,
      until: null,
      enforcementType: undefined,
    });
  });

  it('keeps until null when the window end is an invalid date', () => {
    // Baileys builds the Date from a server string, so it can be Invalid Date
    expect(
      normalizeRestriction({
        isActive: true,
        timeEnforcementEnds: new Date(NaN),
      }),
    ).toEqual({
      active: true,
      until: null,
      enforcementType: undefined,
    });
    expect(
      normalizeRestriction({
        isActive: true,
        timeEnforcementEnds: 'not-a-date',
      }),
    ).toEqual({
      active: true,
      until: null,
      enforcementType: undefined,
    });
  });
});

describe('buildAckError', () => {
  it('returns null for non-error acks', () => {
    expect(buildAckError({ status: SERVER_STATUS }, null)).toBeNull();
    expect(buildAckError({ status: undefined }, null)).toBeNull();
    expect(buildAckError(undefined, null)).toBeNull();
  });

  it('maps a 463 account-restriction ack as blocked with the window', () => {
    const update = {
      status: ERROR_STATUS,
      messageStubParameters: ['463', 'Your account has been restricted'],
    };
    expect(buildAckError(update, RESTRICTION)).toEqual({
      code: '463',
      blocked: true,
      reason: 'account_restricted',
      until: '2026-06-26T23:45:00.000Z',
      enforcementType: 'DEFAULT',
    });
  });

  it('maps a 463 ack with no known window (until null)', () => {
    const update = { status: ERROR_STATUS, messageStubParameters: ['463'] };
    expect(buildAckError(update, null)).toEqual({
      code: '463',
      blocked: true,
      reason: 'account_restricted',
      until: null,
      enforcementType: undefined,
    });
  });

  it('maps a non-restriction error ack (e.g. 479) as not blocked', () => {
    const update = { status: ERROR_STATUS, messageStubParameters: ['479'] };
    expect(buildAckError(update, RESTRICTION)).toEqual({
      code: '479',
      blocked: false,
    });
  });

  it('handles an error ack with no stub parameters', () => {
    expect(buildAckError({ status: ERROR_STATUS }, null)).toEqual({
      code: null,
      blocked: false,
    });
  });
});
