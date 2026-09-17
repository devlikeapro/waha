import {
  PhoneNumberResolution,
  PhoneNumberRule,
} from '@waha/apps/phone-numbers/rules/PhoneNumberRule';

/**
 * Numbers matching the regexp, resolved to the chat id WhatsApp knows.
 * With "replace" the replaced form is checked too - "^54([1-3]\d{9})$" => "549$1"
 */
export class RegexpPhoneNumberRule implements PhoneNumberRule {
  readonly regexp: RegExp;
  readonly replace: string | null;

  constructor(regexp: RegExp | string, replace: string | null = null) {
    if (typeof regexp === 'string') {
      regexp = new RegExp(regexp);
    }
    this.regexp = regexp;
    this.replace = replace;
  }

  matches(digits: string): boolean {
    return this.regexp.test(digits);
  }

  resolve(digits: string): PhoneNumberResolution {
    const candidates = [digits];
    if (this.replace !== null) {
      candidates.push(digits.replace(this.regexp, this.replace));
    }
    return { candidates: [...new Set(candidates)], fallback: digits };
  }
}
