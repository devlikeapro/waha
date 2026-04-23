import * as crypto from 'crypto';

/**
 * Tests for HMAC signature verification logic.
 * Tests the actual crypto operations without mocking.
 */
describe('HMAC Signature Verification (No Mocks)', () => {
  const SECRET = 'test-secret-key';

  function computeSignature(payload: Buffer | string): string {
    return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  }

  function verifySignature(payload: Buffer, signature: string): boolean {
    const expected = computeSignature(payload);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    
    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  }

  describe('computeSignature', () => {
    it('produces consistent signatures for same input', () => {
      const payload = Buffer.from('{"event":"message"}');
      const sig1 = computeSignature(payload);
      const sig2 = computeSignature(payload);
      expect(sig1).toBe(sig2);
    });

    it('produces different signatures for different inputs', () => {
      const sig1 = computeSignature(Buffer.from('payload1'));
      const sig2 = computeSignature(Buffer.from('payload2'));
      expect(sig1).not.toBe(sig2);
    });

    it('produces 64-character hex string', () => {
      const sig = computeSignature(Buffer.from('test'));
      expect(sig).toHaveLength(64);
      expect(sig).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe('verifySignature (timing-safe)', () => {
    it('accepts valid signature', () => {
      const payload = Buffer.from('{"event":"message","id":"123"}');
      const signature = computeSignature(payload);
      expect(verifySignature(payload, signature)).toBe(true);
    });

    it('rejects invalid signature', () => {
      const payload = Buffer.from('{"event":"message"}');
      expect(verifySignature(payload, 'invalid-signature')).toBe(false);
    });

    it('rejects tampered payload', () => {
      const original = Buffer.from('{"amount":100}');
      const signature = computeSignature(original);
      const tampered = Buffer.from('{"amount":999}');
      expect(verifySignature(tampered, signature)).toBe(false);
    });

    it('rejects signature with different length', () => {
      const payload = Buffer.from('test');
      expect(verifySignature(payload, 'short')).toBe(false);
      expect(verifySignature(payload, 'a'.repeat(100))).toBe(false);
    });

    it('handles empty payload', () => {
      const payload = Buffer.from('');
      const signature = computeSignature(payload);
      expect(verifySignature(payload, signature)).toBe(true);
    });

    it('handles unicode payload', () => {
      const payload = Buffer.from('{"name":"José García"}');
      const signature = computeSignature(payload);
      expect(verifySignature(payload, signature)).toBe(true);
    });
  });

  describe('replay protection logic', () => {
    const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

    function isReplayAttack(timestamp: number): boolean {
      return Date.now() - timestamp > MAX_AGE_MS;
    }

    it('accepts recent timestamp', () => {
      const recent = Date.now() - 1000; // 1 second ago
      expect(isReplayAttack(recent)).toBe(false);
    });

    it('rejects old timestamp', () => {
      const old = Date.now() - 10 * 60 * 1000; // 10 minutes ago
      expect(isReplayAttack(old)).toBe(true);
    });

    it('accepts timestamp at boundary', () => {
      const atBoundary = Date.now() - MAX_AGE_MS + 1000; // Just under 5 min
      expect(isReplayAttack(atBoundary)).toBe(false);
    });
  });
});
