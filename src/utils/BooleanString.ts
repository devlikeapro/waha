/**
 * Convert string to boolean
 * @param value
 * @constructor
 */
export function BooleanString({ value }: { value: any }) {
  switch (value) {
    case 'true':
      return true;
    case 'True':
      return true;
    case '1':
      return true;
    case 'false':
      return false;
    case 'False':
      return false;
    case '0':
      return false;
    default:
      return value;
  }
}
