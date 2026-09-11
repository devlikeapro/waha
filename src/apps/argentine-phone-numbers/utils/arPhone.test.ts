import { argentinePhoneCandidates } from './arPhone';

describe('Argentine phone candidates', () => {
  it.each([
    ['541112345678', ['541112345678', '5491112345678']],
    ['+5491112345678@c.us', ['5491112345678', '541112345678']],
    ['543511234567@s.whatsapp.net', ['543511234567', '5493511234567']],
    ['5492920123456', ['5492920123456', '542920123456']],
  ])('keeps the original first for %s', (input, expected) => {
    expect(argentinePhoneCandidates(input)).toEqual(expected);
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
    '5491112345678@lid',
    '5491112345678@g.us',
    '5491112345678@newsletter',
    '5491112345678@broadcast',
    '5491112345678:2@s.whatsapp.net',
    'me',
    '',
  ])('does not interpret %s as an international geographic phone', (input) => {
    expect(argentinePhoneCandidates(input)).toBeNull();
  });
});
