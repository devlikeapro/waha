import {
  isJidBroadcast,
  isJidGroup,
  isJidMetaAI,
  isJidNewsletter,
  isLidUser,
} from '@waha/core/utils/jids';

const COUNTRY_CODE = '55';
const LANDLINE_FIRST_DIGIT = /^[2-5]/;
const MOBILE_FIRST_DIGIT = /^[6-9]/;

export const BR_PHONE_DDD_LOOKUP_MIN = 31;
export const BR_PHONE_DDD_LOOKUP_MAX = 99;

// Unverified best-guesses and confirmed-negatives live only in the in-memory
// cache with this short TTL, so a number registered later is re-checked soon.
export const BR_PHONE_NEGATIVE_CACHE_TTL_SECONDS = 10 * 60;

// A Brazil number (country code 55) must be 55 + DDD(2) + local(8 or 9) digits.
const BR_PHONE_MIN_LENGTH = 12;
const BR_PHONE_MAX_LENGTH = 13;

export function isBrazilCountryCode(digits: string): boolean {
  return digits.startsWith(COUNTRY_CODE);
}

export function isMalformedBrazilPhone(digits: string): boolean {
  if (!isBrazilCountryCode(digits)) {
    return false;
  }
  return (
    digits.length < BR_PHONE_MIN_LENGTH || digits.length > BR_PHONE_MAX_LENGTH
  );
}

export function extractPhoneDigits(value: string): string {
  if (!value) {
    return '';
  }
  const local = value.split('@')[0] ?? value;
  return local.split(':')[0].replace(/\D/g, '');
}

export function shouldSkipBrazilPhoneNormalization(chatId: string): boolean {
  if (!chatId) {
    return true;
  }
  if (isJidGroup(chatId)) {
    return true;
  }
  if (isJidBroadcast(chatId)) {
    return true;
  }
  if (isLidUser(chatId)) {
    return true;
  }
  if (isJidNewsletter(chatId)) {
    return true;
  }
  if (isJidMetaAI(chatId)) {
    return true;
  }
  if (chatId === 'me') {
    return true;
  }
  return false;
}

export function isBrazilPhone(digits: string): boolean {
  return digits.startsWith(COUNTRY_CODE) && digits.length >= 12;
}

export function getBrazilDdd(digits: string): number {
  return parseInt(digits.substring(2, 4), 10);
}

export function getBrazilLocalPart(digits: string): string {
  return digits.substring(4);
}

export function isBrazilLandline(digits: string): boolean {
  if (!isBrazilPhone(digits)) {
    return false;
  }
  const local = getBrazilLocalPart(digits);
  if (local.length !== 8) {
    return false;
  }
  return LANDLINE_FIRST_DIGIT.test(local);
}

export function isBrazilMobile(digits: string): boolean {
  if (!isBrazilPhone(digits) || isBrazilLandline(digits)) {
    return false;
  }
  const local = getBrazilLocalPart(digits);
  // 8-digit local: the legacy form, missing its 9. Only 6-9 tells it apart
  // from a landline - 2-5 is genuinely ambiguous and treated as a landline.
  if (local.length === 8) {
    return MOBILE_FIRST_DIGIT.test(local);
  }
  // 9-digit local starting with 9: unambiguously mobile. Brazil has no
  // 9-digit landline, and the digit after the leading 9 is unrestricted -
  // e.g. SP 11 9535-23741. Do not test it.
  if (local.length === 9 && local[0] === '9') {
    return true;
  }
  return false;
}

// Brazilian toll-free (0800) numbers are non-geographic: dialed as '0800' plus
// 7 subscriber digits. WhatsApp stores them under country code 55 with the
// leading 0 dropped ('08000464636' -> '558000464636'). Callers send the dialed
// form, so map it to the stored one. The rewrite is deterministic - no WhatsApp
// lookup, unlike the 9th-digit mobile case. Returns null when not a toll-free
// number in a dialed form (the stored form '55800...' already routes untouched).
const BR_TOLLFREE_DIALED = /^0800\d{7}$/;
const BR_TOLLFREE_DIALED_CC = /^550800\d{7}$/;

export function normalizeBrazilTollFreeDigits(digits: string): string | null {
  if (BR_TOLLFREE_DIALED.test(digits)) {
    return `${COUNTRY_CODE}${digits.slice(1)}`;
  }
  if (BR_TOLLFREE_DIALED_CC.test(digits)) {
    return `${COUNTRY_CODE}${digits.slice(3)}`;
  }
  return null;
}

export function needsBrazilWhatsAppLookup(digits: string): boolean {
  if (!isBrazilMobile(digits)) {
    return false;
  }
  const ddd = getBrazilDdd(digits);
  return ddd >= BR_PHONE_DDD_LOOKUP_MIN && ddd <= BR_PHONE_DDD_LOOKUP_MAX;
}

export function normalizeBrazilMobileForSendDigits(digits: string): string {
  if (!isBrazilMobile(digits)) {
    return digits;
  }
  const ddd = getBrazilDdd(digits);
  if (ddd >= BR_PHONE_DDD_LOOKUP_MIN) {
    return digits;
  }
  const local = getBrazilLocalPart(digits);
  if (local.length === 8 && MOBILE_FIRST_DIGIT.test(local)) {
    return `${COUNTRY_CODE}${ddd}9${local}`;
  }
  return digits;
}

export function generateBrazilMobileLookupCandidates(digits: string): string[] {
  if (!isBrazilMobile(digits)) {
    return [digits];
  }
  const ddd = digits.substring(2, 4);
  const local = getBrazilLocalPart(digits);
  let without9 = digits;
  let with9 = digits;

  if (local.length === 9 && local[0] === '9') {
    without9 = `${COUNTRY_CODE}${ddd}${local.substring(1)}`;
    with9 = `${COUNTRY_CODE}${ddd}${local}`;
  } else if (local.length === 8) {
    without9 = `${COUNTRY_CODE}${ddd}${local}`;
    with9 = `${COUNTRY_CODE}${ddd}9${local}`;
  }

  const candidates = [without9, with9];
  return [...new Set(candidates)];
}

export function getBrazilPhoneCacheKeys(digits: string): string[] {
  const candidates = generateBrazilMobileLookupCandidates(digits);
  return [...new Set([digits, ...candidates])];
}
