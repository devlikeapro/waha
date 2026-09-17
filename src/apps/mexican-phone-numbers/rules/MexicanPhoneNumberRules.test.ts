import { MexicanPhoneNumberRules } from './MexicanPhoneNumberRules';

describe('MexicanPhoneNumberRules', () => {
  const rules = MexicanPhoneNumberRules();

  function resolve(digits: string) {
    const rule = rules.find((r) => r.matches(digits));
    return rule?.resolve(digits) ?? null;
  }

  it.each([
    ['525512345678', ['525512345678', '5215512345678']],
    ['5215512345678', ['5215512345678', '525512345678']],
    ['523312345678', ['523312345678', '5213312345678']],
    ['5216641234567', ['5216641234567', '526641234567']],
  ])('keeps the supplied form first for %s', (digits, expected) => {
    expect(resolve(digits)).toEqual({ candidates: expected, fallback: digits });
  });

  it.each([
    '5512345678',
    '0445512345678',
    '52551234567',
    '525512345678901',
    '521551234567',
    '5491112345678',
    '5511912345678',
    '',
  ])('does not match %s', (digits) => {
    expect(resolve(digits)).toBeNull();
  });
});
