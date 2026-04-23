import { normalizeJid } from '@waha/core/utils/jids';

type RewriteRule = {
  name: string;
  re: RegExp;
  replace: string;
};

/**
 * Convert JID to Phone Number if possible
 * Applies some formatting rules
 */
export class PhoneJidNormalizer {
  constructor(private rules: RewriteRule[] = []) {}

  /**
   * jid like "553188888888@s.whatsapp.net" → "+553188888888"
   */
  private parseFromJid(jid: string): string | null {
    if (!jid) {
      return null;
    }
    jid = normalizeJid(jid);
    const local = jid.split('@', 1)[0] ?? '';
    if (!local) {
      return null;
    }
    return `+${local}`;
  }

  /**
   * Apply rewrite rules
   */
  private rewrite(number: string): string {
    for (const rule of this.rules) {
      if (rule.re.test(number)) {
        number = number.replace(rule.re, rule.replace);
        return number;
      }
    }
    return number;
  }

  /**
   * Converts a JID (Jabber ID) into an E.164 formatted phone number string.
   * Applies rules if any
   */
  fromJid(jid: string): string | null {
    let number = this.parseFromJid(jid);
    if (!number) {
      return null;
    }
    number = this.rewrite(number);
    return number;
  }
}

const RULES = [
  // Brazil landline (fixed line) heuristic:
  // +55 <DDD:2> <local:8> where local[0] is 2..5 => do NOT add extra 9
  {
    name: 'br-no-add-9-for-landline',
    re: /^\+55(\d{2})([2-5]\d{7})$/,
    replace: '+55$1$2',
  },
  // Brazil mobile/others:
  // +55 <DDD:2> <local:8> => add extra 9 after DDD
  {
    name: 'br-add-9-after-ddd',
    re: /^\+55(\d{2})(\d{8})$/,
    replace: '+55$19$2',
  },
];

export const E164Parser = new PhoneJidNormalizer(RULES);
