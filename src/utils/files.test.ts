import { requireModule } from '@waha/__tests__/esm';
import { detectMimetype } from '@waha/utils/files';

jest.mock('file-type', () => requireModule('file-type'), { virtual: true });

function bytes(...parts: Array<number[] | string | Buffer>): Buffer {
  return Buffer.concat(
    parts.map((part) => {
      if (Buffer.isBuffer(part)) {
        return part;
      }
      if (typeof part === 'string') {
        return Buffer.from(part, 'ascii');
      }
      return Buffer.from(part);
    }),
  );
}

describe('detectMimetype', () => {
  describe('images', () => {
    it('detects jpeg', async () => {
      const buffer = bytes([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10], 'JFIF', [0]);
      expect(await detectMimetype(buffer)).toBe('image/jpeg');
    });

    it('detects png', async () => {
      const buffer = bytes(
        [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
        [0, 0, 0, 0x0d],
        'IHDR',
      );
      expect(await detectMimetype(buffer)).toBe('image/png');
    });

    it('detects gif', async () => {
      expect(await detectMimetype(bytes('GIF89a'))).toBe('image/gif');
      expect(await detectMimetype(bytes('GIF87a'))).toBe('image/gif');
    });

    it('detects webp (stickers)', async () => {
      const buffer = bytes('RIFF', [0, 0, 0, 0], 'WEBPVP8 ');
      expect(await detectMimetype(buffer)).toBe('image/webp');
    });
  });

  describe('documents', () => {
    it('detects pdf', async () => {
      expect(await detectMimetype(bytes('%PDF-1.4\n'))).toBe('application/pdf');
    });

    it('detects zip', async () => {
      const buffer = bytes([0x50, 0x4b, 0x03, 0x04], Buffer.alloc(12));
      expect(await detectMimetype(buffer)).toBe('application/zip');
    });
  });

  describe('audio', () => {
    it('detects ogg opus (voice messages)', async () => {
      const buffer = bytes('OggS', Buffer.alloc(24), 'OpusHead');
      expect(await detectMimetype(buffer)).toBe('audio/ogg; codecs=opus');
    });

    it('detects mp3 from a frame header', async () => {
      const buffer = bytes([0xff, 0xfb, 0x90, 0x00], Buffer.alloc(12));
      expect(await detectMimetype(buffer)).toBe('audio/mpeg');
    });

    it('detects mp3 with an ID3 tag', async () => {
      const buffer = bytes(
        'ID3',
        [0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0xff, 0xfb, 0x90, 0x00],
        Buffer.alloc(12),
      );
      expect(await detectMimetype(buffer)).toBe('audio/mpeg');
    });

    it('detects wav', async () => {
      const buffer = bytes('RIFF', [0, 0, 0, 0], 'WAVEfmt ');
      expect(await detectMimetype(buffer)).toBe('audio/wav');
    });
  });

  describe('video', () => {
    it('detects mp4', async () => {
      const buffer = bytes([0, 0, 0, 0x18], 'ftypisom', Buffer.alloc(8));
      expect(await detectMimetype(buffer)).toBe('video/mp4');
    });
  });

  describe('fallback', () => {
    it('returns application/octet-stream for unknown content', async () => {
      const buffer = bytes('hello world');
      expect(await detectMimetype(buffer)).toBe('application/octet-stream');
    });

    it('returns application/octet-stream for an empty buffer', async () => {
      expect(await detectMimetype(Buffer.alloc(0))).toBe(
        'application/octet-stream',
      );
    });

    it('returns the custom fallback for unknown content', async () => {
      const buffer = bytes('hello world');
      expect(await detectMimetype(buffer, 'text/plain')).toBe('text/plain');
    });

    it('ignores the fallback when the type is detected', async () => {
      const buffer = bytes('%PDF-1.4\n');
      expect(await detectMimetype(buffer, 'text/plain')).toBe(
        'application/pdf',
      );
    });
  });
});
