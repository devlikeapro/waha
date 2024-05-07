export function noSlashAtTheEnd(value: string): string {
  if (!value) {
    return value;
  }
  if (value.startsWith('/')) {
    return value.slice(1);
  }
  return value;
}
