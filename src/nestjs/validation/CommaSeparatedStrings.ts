/**
 * Convert a query param to a list of strings.
 * Accepts:
 * - single value: ?a=x => ['x']
 * - repeated form: ?a=x&a=y => ['x', 'y']
 * - comma separated form: ?a=x,y => ['x', 'y']
 * Values are trimmed, empty ones are removed.
 * @param value
 * @constructor
 */
export function CommaSeparatedStrings({ value }: { value: any }) {
  if (value == null) {
    return value;
  }
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((item: string) => String(item).split(','))
    .map((item: string) => item.trim())
    .filter(Boolean);
}
