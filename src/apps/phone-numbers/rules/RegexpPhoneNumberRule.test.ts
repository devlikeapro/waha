import { RegexpPhoneNumberRule } from './RegexpPhoneNumberRule';

describe('RegexpPhoneNumberRule', () => {
  it('matches by regexp and checks the number as is', () => {
    const rule = new RegexpPhoneNumberRule('^52');
    expect(rule.matches('5212345678901')).toBe(true);
    expect(rule.matches('12132132130')).toBe(false);
    expect(rule.resolve('5212345678901')).toEqual({
      candidates: ['5212345678901'],
      fallback: '5212345678901',
    });
  });

  it('adds the replaced form as a candidate', () => {
    const rule = new RegexpPhoneNumberRule('^52(\\d{10})$', '521$1');
    expect(rule.resolve('521234567890').candidates).toEqual([
      '521234567890',
      '5211234567890',
    ]);
    // Replacement that changes nothing is not repeated
    const same = new RegexpPhoneNumberRule('^52', '52');
    expect(same.resolve('521234567890').candidates).toEqual(['521234567890']);
  });

  it('handles everything with .*', () => {
    const rule = new RegexpPhoneNumberRule('.*');
    expect(rule.matches('12132132130')).toBe(true);
  });
});
