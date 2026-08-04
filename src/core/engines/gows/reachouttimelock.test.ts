import { parseGowsReachoutTimelock } from '@waha/core/engines/gows/reachouttimelock';

describe('parseGowsReachoutTimelock', () => {
  it('parses a full payload', () => {
    const timelock = parseGowsReachoutTimelock({
      enforcement_type: 'RESTRICT_ALL_COMPANIONS',
      is_active: true,
      time_enforcement_ends: '1784477333',
    });
    expect(timelock).toEqual({
      enforcementType: 'RESTRICT_ALL_COMPANIONS',
      isActive: true,
      timeEnforcementEnds: 1784477333,
    });
  });

  it('treats absent is_active as inactive (omitempty)', () => {
    const timelock = parseGowsReachoutTimelock({
      enforcement_type: 'RESTRICT_ALL_COMPANIONS',
    });
    expect(timelock.isActive).toBe(false);
  });

  it('treats absent time_enforcement_ends as null (omitzero)', () => {
    const timelock = parseGowsReachoutTimelock({
      enforcement_type: 'RESTRICT_ALL_COMPANIONS',
      is_active: true,
    });
    expect(timelock.timeEnforcementEnds).toBeNull();
  });

  it('defaults enforcement type on an empty payload', () => {
    const timelock = parseGowsReachoutTimelock({});
    expect(timelock).toEqual({
      enforcementType: 'DEFAULT',
      isActive: false,
      timeEnforcementEnds: null,
    });
  });

  it('returns null for a non numeric time_enforcement_ends', () => {
    const timelock = parseGowsReachoutTimelock({
      is_active: true,
      time_enforcement_ends: 'not-a-number',
    });
    expect(timelock.timeEnforcementEnds).toBeNull();
  });
});
