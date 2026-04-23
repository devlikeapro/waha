import { E164Parser } from './PhoneJidNormalizer';

describe('E164Parser.fromJid', () => {
  it('parses basic JID to +number', () => {
    expect(E164Parser.fromJid('14155552671@s.whatsapp.net')).toBe(
      '+14155552671',
    );
  });

  it('parses basic JID @c.us to +number', () => {
    expect(E164Parser.fromJid('14155552671@c.us')).toBe('+14155552671');
  });

  it('parses JID with device id +number', () => {
    expect(E164Parser.fromJid('14155552671:123@c.us')).toBe('+14155552671');
  });

  it('returns null for empty or missing local part', () => {
    expect(E164Parser.fromJid('')).toBeNull();
    expect(E164Parser.fromJid('@s.whatsapp.net')).toBeNull();
  });

  it('does not add 9 for BR landline (local starts with 2..5)', () => {
    expect(E164Parser.fromJid('558540423147@s.whatsapp.net')).toBe(
      '+558540423147',
    );
    expect(E164Parser.fromJid('558820181896@s.whatsapp.net')).toBe(
      '+558820181896',
    );
  });

  it('adds 9 for BR mobile/others (local not starting with 2..5)', () => {
    expect(E164Parser.fromJid('558591203123@s.whatsapp.net')).toBe(
      '+5585991203123',
    );
  });

  it('leaves non-Brazil numbers unchanged', () => {
    expect(E164Parser.fromJid('447911123456@s.whatsapp.net')).toBe(
      '+447911123456',
    );
  });
});
