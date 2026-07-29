import type { proto, WAVersion } from '@adiwajshing/baileys';
import { fetchLatestBaileysVersion } from '@adiwajshing/baileys';
import type { ILogger } from '@adiwajshing/baileys/lib/Utils/logger';
import esm from '@waha/vendor/esm';

/**
 * The WhatsApp Web version baked into the bundled Baileys fork can go stale
 * whenever WhatsApp bumps the version its servers accept, breaking every
 * NOWEB session at once (connections stuck in STARTING -> FAILED). Resolve
 * it in priority order so operators aren't stuck waiting for a WAHA release:
 *   1. WAHA_NOWEB_WA_VERSION env var, e.g. "2,3000,1037641644"
 *   2. Auto-detected latest version (cached per process; Baileys itself
 *      falls back to its bundled default if the fetch fails)
 */
const AUTO_VERSION_TTL_MS = 60 * 60 * 1000; // 1h
let cachedAutoVersion: { version: WAVersion; fetchedAt: number } | null =
  null;

export async function resolveWaVersion(
  logger: ILogger,
): Promise<WAVersion | undefined> {
  const envVersion = process.env.WAHA_NOWEB_WA_VERSION;
  if (envVersion) {
    const parsed = envVersion.split(',').map((part) => Number(part.trim()));
    if (parsed.length === 3 && parsed.every((n) => Number.isFinite(n))) {
      logger.info(
        { version: parsed },
        'Using WhatsApp Web version from WAHA_NOWEB_WA_VERSION',
      );
      return parsed as WAVersion;
    }
    logger.warn(
      `Ignoring WAHA_NOWEB_WA_VERSION="${envVersion}" - expected "major,minor,patch", e.g. "2,3000,1037641644"`,
    );
  }

  const now = Date.now();
  if (
    cachedAutoVersion &&
    now - cachedAutoVersion.fetchedAt < AUTO_VERSION_TTL_MS
  ) {
    logger.debug(
      { version: cachedAutoVersion.version },
      'Using cached auto-detected WhatsApp Web version',
    );
    return cachedAutoVersion.version;
  }

  try {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    cachedAutoVersion = { version, fetchedAt: now };
    if (isLatest) {
      logger.info({ version }, 'Auto-detected latest WhatsApp Web version');
    } else {
      logger.warn(
        { version },
        'Could not auto-detect the latest WhatsApp Web version, using the bundled default - set WAHA_NOWEB_WA_VERSION to pin one explicitly',
      );
    }
    return version;
  } catch (err) {
    logger.warn(
      { err },
      'Failed to resolve WhatsApp Web version, falling back to the Baileys default',
    );
    return undefined;
  }
}

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
    content?.stickerMessage ||
    content?.templateMessage?.hydratedTemplate?.imageMessage ||
    content?.templateMessage?.hydratedTemplate?.videoMessage ||
    content?.templateMessage?.interactiveMessageTemplate?.header
      ?.imageMessage ||
    content?.templateMessage?.interactiveMessageTemplate?.header?.videoMessage;
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
