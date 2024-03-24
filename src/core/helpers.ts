export function toVcard(data): string {
  if (data.vcard) {
    return data.vcard;
  }
  const parts = [];
  parts.push('BEGIN:VCARD');
  parts.push('VERSION:3.0');
  parts.push(`FN:${data.fullName}`);
  if (data.organization) {
    parts.push(`ORG:${data.organization};`);
  }
  if (data.whatsappId) {
    parts.push(
      `TEL;type=CELL;type=VOICE;waid=${data.whatsappId}:${data.phoneNumber}`,
    );
  } else {
    parts.push(`TEL;type=CELL;type=VOICE:${data.phoneNumber}`);
  }
  parts.push('END:VCARD');
  return parts.join('\n');
}
