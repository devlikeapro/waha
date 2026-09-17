import { PhoneNumberRule } from '@waha/apps/phone-numbers/rules/PhoneNumberRule';
import { RegexpPhoneNumberRule } from '@waha/apps/phone-numbers/rules/RegexpPhoneNumberRule';

/**
 * Mexico: since 2019 numbers are dialed as 52 + 10 digits, but accounts registered before that are still stored
 * on WhatsApp with the old mobile 1 after the country code - check the supplied form first, then the other one
 */
export function MexicanPhoneNumberRules(): PhoneNumberRule[] {
  return [
    new RegexpPhoneNumberRule('^52([2-9]\\d{9})$', '521$1'),
    new RegexpPhoneNumberRule('^521(\\d{10})$', '52$1'),
  ];
}
