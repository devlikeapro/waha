export function parseBool(value: any): boolean {
  if (!value) {
    return false;
  }
  if (value.toLowerCase() === 'true' || value.toLowerCase() === '1') {
    return true;
  }
  if (value.toLowerCase() === 'false' || value.toLowerCase() === '0') {
    return false;
  }

  console.error(
    'parseBool got an unexpected value:',
    value,
    '(accepted values : "true", "false")',
  );
  throw new Error(
    'Error: parseBool got unexpected value - use "true" or "false" values',
  );
}
