export interface PhoneNumberResolution {
  /**
   * Forms to check on WhatsApp, preferred first. Empty - no lookup, send the fallback
   */
  candidates: string[];

  /**
   * The form to send when none of the candidates exist on WhatsApp
   */
  fallback: string;
}

/**
 * Which phone numbers the app handles and how to resolve them. Works on digits only, no '+' or '@c.us'
 */
export interface PhoneNumberRule {
  /**
   * Whether the number belongs to this rule
   */
  matches(digits: string): boolean;

  /**
   * How to resolve the number, null - malformed, rejected on send
   */
  resolve(digits: string): PhoneNumberResolution | null;
}
