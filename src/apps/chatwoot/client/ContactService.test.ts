import {
  IsRawName,
  sanitizeName,
} from '@waha/apps/chatwoot/client/ContactService';

describe('sanitizeName', () => {
  it('should return the same name', () => {
    const name = 'John Doe';
    expect(sanitizeName(name)).toBe(name);
  });
  it('should return 254 symbols max', () => {
    const name = 'a'.repeat(300);
    expect(sanitizeName(name)).toBe('a'.repeat(255));
  });

  it('should remove bidi characters and trim the name', () => {
    const name =
      '‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪‏‪+123123‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏‬‏';
    expect(sanitizeName(name)).toBe('+123123');
  });

  it('should not remove bidi characters if within limit', () => {
    const name = 'محمد +123';
    expect(sanitizeName(name)).toBe(name);
  });
});

describe('IsRawName', () => {
  const placeholders = [
    '11111111111@c.us',
    '11111111111@c.us',
    '011111111111111@lid',
    '+11111111111',
    '+11111111111',
    'Johnny',
  ];
  const cases: Array<{ name: string; expected: boolean }> = [
    { name: '', expected: true },
    { name: '   ', expected: true },
    { name: '11111111111@c.us', expected: true },
    { name: '11111111111', expected: true },
    { name: '+11111111111', expected: true },
    { name: '011111111111111@lid', expected: true },
    { name: '011111111111111', expected: true },
    { name: 'Johnny', expected: true },
    { name: ' johnny ', expected: true },
    { name: 'John Doe', expected: false },
    { name: 'John (Sales)', expected: false },
  ];

  it.each(cases)('$name', ({ name, expected }) => {
    expect(IsRawName(name, placeholders)).toBe(expected);
  });

  it('treats a nameless contact with no ids as placeholder', () => {
    expect(IsRawName('', [null, undefined])).toBe(true);
    expect(IsRawName('John', [null, undefined])).toBe(false);
  });
});
