import { validate } from 'class-validator';

import { IsDuration, parseDurationMs } from './IsDuration';

describe('parseDurationMs', () => {
  it('parses human duration strings into milliseconds', () => {
    expect(parseDurationMs('1s')).toBe(1000);
    expect(parseDurationMs('30m')).toBe(30 * 60 * 1000);
    expect(parseDurationMs('24h')).toBe(24 * 60 * 60 * 1000);
    expect(parseDurationMs('7d')).toBe(7 * 24 * 60 * 60 * 1000);
    expect(parseDurationMs('7 days')).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('parses bare numbers as milliseconds', () => {
    expect(parseDurationMs('500')).toBe(500);
  });

  it('rejects invalid values', () => {
    expect(parseDurationMs('junk')).toBeNull();
    expect(parseDurationMs('')).toBeNull();
    expect(parseDurationMs('   ')).toBeNull();
    expect(parseDurationMs(null)).toBeNull();
    expect(parseDurationMs(undefined)).toBeNull();
    expect(parseDurationMs(123)).toBeNull();
    expect(parseDurationMs({})).toBeNull();
  });

  it('rejects negative durations', () => {
    expect(parseDurationMs('-1h')).toBeNull();
    expect(parseDurationMs('-5')).toBeNull();
  });
});

class TestDto {
  @IsDuration()
  ttl: string;
}

async function validateTtl(ttl: any) {
  const dto = new TestDto();
  dto.ttl = ttl;
  return await validate(dto);
}

describe('IsDuration', () => {
  it('accepts valid duration strings', async () => {
    expect(await validateTtl('30m')).toHaveLength(0);
    expect(await validateTtl('24h')).toHaveLength(0);
    expect(await validateTtl('7d')).toHaveLength(0);
  });

  it('rejects invalid values with a helpful message', async () => {
    const errors = await validateTtl('junk');

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({
      isDuration: 'must be a duration string like "30m", "24h" or "7d".',
    });
  });

  it('rejects negative durations and non-strings', async () => {
    expect(await validateTtl('-1h')).toHaveLength(1);
    expect(await validateTtl(3600)).toHaveLength(1);
    expect(await validateTtl(undefined)).toHaveLength(1);
  });
});
