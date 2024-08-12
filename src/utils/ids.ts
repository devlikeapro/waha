export function generatePrefixedId(prefix: string) {
  const id = Math.random().toString(36).substring(7);
  return `${prefix}_${id}`;
}
