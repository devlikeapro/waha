import type { proto } from '@adiwajshing/baileys';
import esm from '@waha/vendor/esm';

export function extractMediaContent(
  content: any | proto.IMessage | null | undefined,
) {
  content = esm.b.extractMessageContent(content);
  const mediaContent =
    content?.documentMessage ||
    content?.imageMessage ||
    content?.videoMessage ||
    content?.audioMessage ||
    content?.ptvMessage ||
    content?.stickerMessage;
  if (mediaContent) {
    return mediaContent;
  }
  if (content?.associatedChildMessage?.message) {
    return extractMediaContent(content.associatedChildMessage.message);
  }
  return null;
}

interface Long {
  low: number;
  high: number;
  unsigned: boolean;

  toNumber?(): number;
}

type AnyObject = { [key: string]: any };

export const replaceLongsWithNumber = (obj: AnyObject): void => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isObjectALong(obj[key])) {
        obj[key] = toNumber(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        replaceLongsWithNumber(obj[key]);
      }
    }
  }
};

export function convertProtobufToPlainObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Ignore Buffer
  if (
    Buffer.isBuffer(obj) ||
    obj?.type == 'Buffer' ||
    obj instanceof Uint8Array
  ) {
    return obj;
  }

  // Remove empty array
  if (Array.isArray(obj) && obj.length === 0) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertProtobufToPlainObject(item));
  }

  const plainObject: any = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    plainObject[key] = convertProtobufToPlainObject(value);
  });

  return { ...plainObject };
}

const isObjectALong = (value: any): value is Long => {
  return (
    value &&
    typeof value === 'object' &&
    'low' in value &&
    'high' in value &&
    'unsigned' in value
  );
};

export function ensureNumber(value: number | Long | string | null): number {
  if (!value) {
    // @ts-ignore
    return value;
  }
  if (typeof value === 'string') {
    return Number.parseInt(value, 10);
  }
  if (isObjectALong(value)) {
    return toNumber(value);
  }
  // number
  return value;
}

const toNumber = (longValue: Long): number => {
  const { low, high, unsigned } = longValue;
  const result = unsigned ? low >>> 0 : low + high * 0x100000000;
  return result;
};
