import * as crypto from 'crypto';

export abstract class IApiKeyAuth {
  abstract isValid(plain: string): boolean;
}

export class NoAuth implements IApiKeyAuth {
  isValid(plain: string): boolean {
    return true;
  }
}

export class PlainApiKeyAuth implements IApiKeyAuth {
  constructor(private key: string) {}

  isValid(plain: string): boolean {
    return compare(plain, this.key);
  }
}

export class HashAuth implements IApiKeyAuth {
  constructor(
    private hash: string,
    private algorithm: string,
  ) {}

  isValid(plain: string): boolean {
    if (!plain) {
      return false;
    }
    const hash = crypto.createHash(this.algorithm).update(plain).digest('hex');
    return compare(hash, this.hash);
  }
}

/**
 * Securely compare 2 strings
 */
export function compare(provided: string, stored: string | undefined): boolean {
  if (!stored || !provided) {
    return false;
  }

  try {
    // Convert strings to buffers for constant-time comparison
    const providedBuffer = Buffer.from(provided);
    const storedBuffer = Buffer.from(stored);

    // If lengths are different, return false but use a dummy comparison to prevent timing attacks
    if (providedBuffer.length !== storedBuffer.length) {
      // Create a dummy buffer of the same length as the provided key
      const dummyBuffer = Buffer.alloc(providedBuffer.length);
      // Perform comparison with dummy buffer to maintain constant time
      crypto.timingSafeEqual(providedBuffer, dummyBuffer);
      return false;
    }

    // Perform constant-time comparison
    return crypto.timingSafeEqual(providedBuffer, storedBuffer);
  } catch (error) {
    return false;
  }
}
