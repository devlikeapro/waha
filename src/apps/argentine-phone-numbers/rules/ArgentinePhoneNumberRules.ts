import { PhoneNumberRule } from '@waha/apps/phone-numbers/rules/PhoneNumberRule';
import { RegexpPhoneNumberRule } from '@waha/apps/phone-numbers/rules/RegexpPhoneNumberRule';

/**
 * Argentina: mobiles have a 9 after the country code, callers send either form - check the supplied one first.
 * 54 + area code (1-3...) + number, 10 digits, international form only
 */
export function ArgentinePhoneNumberRules(): PhoneNumberRule[] {
  return [
    new RegexpPhoneNumberRule('^54([1-3]\\d{9})$', '549$1'),
    new RegexpPhoneNumberRule('^549([1-3]\\d{9})$', '54$1'),
  ];
}
