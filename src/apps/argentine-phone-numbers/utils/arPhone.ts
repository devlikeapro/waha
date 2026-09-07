/** Only international geographic numbers; never interpret local 011/15 forms. */
export function argentinePhoneCandidates(wid: string): string[] | null {
  const match = /^\+?(54(?:9)?[1-3]\d{9})(?:@(c\.us|s\.whatsapp\.net))?$/.exec(
    wid,
  );
  if (!match) {
    return null;
  }
  const digits = match[1];
  const alternate =
    digits.length === 13 ? `54${digits.slice(3)}` : `549${digits.slice(2)}`;
  return [digits, alternate];
}
