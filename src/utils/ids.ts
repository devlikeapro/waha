import { v4 as uuid4 } from 'uuid';

/**
 * Generate prefix uuid (but remove -)
 * @param prefix
 */
export function generatePrefixedId(prefix: string) {
  const id = uuid4().replace(/-/g, '');
  return `${prefix}_${id}`;
}
