import {
  extractPhoneDigits,
  generateBrazilMobileLookupCandidates,
  isBrazilCountryCode,
  isBrazilLandline,
  isBrazilMobile,
  isMalformedBrazilPhone,
  needsBrazilWhatsAppLookup,
  normalizeBrazilMobileForSendDigits,
  normalizeBrazilTollFreeDigits,
  shouldSkipBrazilPhoneNormalization,
} from './brPhone';

describe('brPhone', () => {
  it('skips groups and lids', () => {
    expect(shouldSkipBrazilPhoneNormalization('123@g.us')).toBe(true);
    expect(shouldSkipBrazilPhoneNormalization('123@lid')).toBe(true);
  });

  it('detects BR country code', () => {
    expect(isBrazilCountryCode('558591203123')).toBe(true);
    expect(isBrazilCountryCode('5491123456789')).toBe(false);
  });

  it('flags malformed BR numbers and accepts valid lengths', () => {
    expect(isMalformedBrazilPhone('55859912')).toBe(true);
    expect(isMalformedBrazilPhone('558591203123')).toBe(false);
    expect(isMalformedBrazilPhone('5585991203123')).toBe(false);
    // not a BR number, not our concern
    expect(isMalformedBrazilPhone('123')).toBe(false);
  });

  it('detects BR landline numbers', () => {
    expect(isBrazilLandline('558540423147')).toBe(true);
    expect(isBrazilMobile('558540423147')).toBe(false);
  });

  it('detects BR mobile numbers', () => {
    expect(isBrazilMobile('558591203123')).toBe(true);
    expect(isBrazilMobile('5585991203123')).toBe(true);
  });

  it('accepts any digit after the leading 9 on a 9-digit local', () => {
    // Brazil has no 9-digit landline, so '9' + 8 digits is always mobile.
    // The old rule required 6-9 right after the 9 and rejected real SP lines.
    expect(isBrazilMobile('5511953523741')).toBe(true);
    expect(isBrazilLandline('5511953523741')).toBe(false);
    expect(isBrazilMobile('5511912345678')).toBe(true);
    expect(isBrazilMobile('5511902345678')).toBe(true);
  });

  it('keeps 9-digit mobiles out of the lookup range untouched', () => {
    // DDD 11 is below the lookup range: no candidates, no WhatsApp lookup.
    expect(needsBrazilWhatsAppLookup('5511953523741')).toBe(false);
    expect(normalizeBrazilMobileForSendDigits('5511953523741')).toBe(
      '5511953523741',
    );
  });

  it('detects landlines in both DDD ranges', () => {
    expect(isBrazilLandline('551151923057')).toBe(true);
    expect(isBrazilLandline('558540428310')).toBe(true);
    expect(isBrazilMobile('551151923057')).toBe(false);
    expect(isBrazilMobile('558540428310')).toBe(false);
  });

  it('rewrites toll-free (0800) numbers to the stored form', () => {
    // Dialed '0800' + 7 digits -> stored '55800' + 7 digits (leading 0 dropped,
    // country code added). Both the bare and the 55-prefixed dialed forms map
    // to the same stored number the server resolves them to.
    expect(normalizeBrazilTollFreeDigits('08000464636')).toBe('558000464636');
    expect(normalizeBrazilTollFreeDigits('5508000464636')).toBe('558000464636');
  });

  it('leaves non-toll-free and already-stored numbers untouched', () => {
    // Already-stored form routes through normally, so no rewrite here.
    expect(normalizeBrazilTollFreeDigits('558000464636')).toBeNull();
    expect(normalizeBrazilTollFreeDigits('5585991203123')).toBeNull();
    expect(normalizeBrazilTollFreeDigits('551151923057')).toBeNull();
    // 0300/0500/0900 share the shape but are not handled here.
    expect(normalizeBrazilTollFreeDigits('03001234567')).toBeNull();
  });

  it('requires lookup only for DDD 31-99 mobile numbers', () => {
    expect(needsBrazilWhatsAppLookup('5511987654321')).toBe(false);
    expect(needsBrazilWhatsAppLookup('558591203123')).toBe(true);
    expect(needsBrazilWhatsAppLookup('558540423147')).toBe(false);
  });

  it('keeps send heuristic without 9 for DDD 31-99 until lookup resolves', () => {
    expect(normalizeBrazilMobileForSendDigits('558591203123')).toBe(
      '558591203123',
    );
    expect(normalizeBrazilMobileForSendDigits('555399034520')).toBe(
      '555399034520',
    );
  });

  it('normalizes low DDD mobile numbers for send with 9 digits', () => {
    expect(normalizeBrazilMobileForSendDigits('551198765432')).toBe(
      '5511998765432',
    );
  });

  it('generates with and without 9 candidates', () => {
    expect(generateBrazilMobileLookupCandidates('558591203123')).toEqual([
      '558591203123',
      '5585991203123',
    ]);
    expect(generateBrazilMobileLookupCandidates('5585991203123')).toEqual([
      '558591203123',
      '5585991203123',
    ]);
  });

  it('extracts digits from chat ids', () => {
    expect(extractPhoneDigits('558591203123@c.us')).toBe('558591203123');
    expect(extractPhoneDigits('+558591203123')).toBe('558591203123');
  });
});
