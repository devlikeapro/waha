import * as crypto from 'crypto';
import { ulid } from 'ulid';

/**
 * Generate prefix uuid (but remove -)
 * @param prefix
 */
export function generatePrefixedId(prefix: string) {
  return `${prefix}_${ulid().toLowerCase()}`;
}

const SECRET_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateSecret(length: number = 32) {
  const bytes = crypto.randomBytes(length);
  let secret = '';
  for (let i = 0; i < length; i += 1) {
    secret += SECRET_CHARS[bytes[i % bytes.length] % SECRET_CHARS.length];
  }
  return secret;
}
