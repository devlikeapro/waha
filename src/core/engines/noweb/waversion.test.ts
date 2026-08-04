import {
  formatWaVersion,
  isWaVersionHigher,
  parseWaVersion,
} from '@waha/core/engines/noweb/waversion';

describe('parseWaVersion', () => {
  it('parses a valid version', () => {
    expect(parseWaVersion('2.3000.1043857760')).toEqual([2, 3000, 1043857760]);
  });

  it('trims whitespace', () => {
    expect(parseWaVersion(' 2.3000.1 ')).toEqual([2, 3000, 1]);
  });

  it.each(['', '2.3000', '2.3000.1.2', '2.3000.abc', 'latest'])(
    "returns null for invalid value '%s'",
    (value) => {
      expect(parseWaVersion(value)).toBeNull();
    },
  );
});

describe('formatWaVersion', () => {
  it('formats a version', () => {
    expect(formatWaVersion([2, 3000, 1043857760])).toBe('2.3000.1043857760');
  });
});

describe('isWaVersionHigher', () => {
  it('compares by the last part', () => {
    expect(isWaVersionHigher([2, 3000, 2], [2, 3000, 1])).toBe(true);
    expect(isWaVersionHigher([2, 3000, 1], [2, 3000, 2])).toBe(false);
  });

  it('compares by the middle part first', () => {
    expect(isWaVersionHigher([2, 3001, 1], [2, 3000, 999])).toBe(true);
    expect(isWaVersionHigher([2, 3000, 999], [2, 3001, 1])).toBe(false);
  });

  it('returns false for equal versions', () => {
    expect(isWaVersionHigher([2, 3000, 1], [2, 3000, 1])).toBe(false);
  });
});
