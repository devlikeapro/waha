/**
 * Trim string, leave other values as is
 * @param value
 * @constructor
 */
export function TrimString({ value }: { value: any }) {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}

/**
 * Trim every string in the array, leave other values as is
 * @param value
 * @constructor
 */
export function TrimStrings({ value }: { value: any }) {
  if (Array.isArray(value)) {
    return value.map((item) => TrimString({ value: item }));
  }
  return value;
}
