import { parseVCardV3 } from './vcard';

describe('parseVCardV3', () => {
  it('parses vcard with waid', () => {
    const vcard =
      'BEGIN:VCARD\nVERSION:3.0\nFN:Jane Doe\nORG:Company Name;\nTEL;type=CELL;type=VOICE;waid=911111111111:+91 11111 11111\nEND:VCARD';
    const result = parseVCardV3(vcard);
    expect(result.fullName).toBe('Jane Doe');
    expect(result.phoneNumbers).toEqual(['+91 11111 11111']);
    expect(result.whatsappId).toBe('911111111111');
  });

  it('parses vcard without waid', () => {
    const vcard =
      'BEGIN:VCARD\nVERSION:3.0\nFN:Jane Doe\nTEL;type=CELL;type=VOICE:+91 11111 11111\nEND:VCARD';
    const result = parseVCardV3(vcard);
    expect(result.fullName).toBe('Jane Doe');
    expect(result.phoneNumbers).toEqual(['+91 11111 11111']);
    expect(result.whatsappId).toBeNull();
  });
});
