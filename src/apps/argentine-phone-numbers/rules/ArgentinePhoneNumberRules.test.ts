import { ArgentinePhoneNumberRules } from './ArgentinePhoneNumberRules';

describe('ArgentinePhoneNumberRules', () => {
  const rules = ArgentinePhoneNumberRules();

  function resolve(digits: string) {
    const rule = rules.find((r) => r.matches(digits));
    return rule?.resolve(digits) ?? null;
  }

  it.each([
    ['541112345678', ['541112345678', '5491112345678']],
    ['5491112345678', ['5491112345678', '541112345678']],
    ['543511234567', ['543511234567', '5493511234567']],
    ['5492920123456', ['5492920123456', '542920123456']],
  ])('keeps the supplied form first for %s', (digits, expected) => {
    expect(resolve(digits)).toEqual({ candidates: expected, fallback: digits });
  });

  it.each([
    '0111512345678',
    '1112345678',
    '91112345678',
    '54111512345678',
    '548001234567',
    '54911123',
    '54911123456789',
    '5511912345678',
    '',
  ])('does not match %s', (digits) => {
    expect(resolve(digits)).toBeNull();
  });
});
