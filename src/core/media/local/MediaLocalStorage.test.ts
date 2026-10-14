import { getMediaFileMessageId } from '@waha/core/media/IMediaStorage';
import { MediaLocalStorage } from '@waha/core/media/local/MediaLocalStorage';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const logger: any = {
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

describe('getMediaFileMessageId', () => {
  it('strips the extension only', () => {
    expect(getMediaFileMessageId('3EB0AA.jpeg')).toBe('3EB0AA');
    expect(getMediaFileMessageId('false_1@c.us_3EB0AA.ogg')).toBe(
      'false_1@c.us_3EB0AA',
    );
    expect(getMediaFileMessageId('3EB0AA')).toBeNull();
    expect(getMediaFileMessageId('3EB0AA.')).toBeNull();
    expect(getMediaFileMessageId('.jpeg')).toBeNull();
  });
});

describe('MediaLocalStorage.removeMessagesMedia', () => {
  let folder: string;
  let storage: MediaLocalStorage;

  function touch(...parts: string[]) {
    const file = path.join(folder, ...parts);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'x');
  }

  function exists(...parts: string[]) {
    return fs.existsSync(path.join(folder, ...parts));
  }

  beforeEach(() => {
    folder = fs.mkdtempSync(path.join(os.tmpdir(), 'waha-media-test-'));
    // lifetime 0 - no removal timers
    storage = new MediaLocalStorage(logger, folder, 'http://localhost/', 0);
    touch('default', 'AAA.jpeg');
    touch('default', 'BBB.ogg');
    touch('default', 'AAA0.jpeg');
    touch('default', 'AAA');
    touch('default', 'CCC.pdf');
    touch('default', 'nested', 'AAA.jpeg');
    touch('other', 'AAA.jpeg');
  });

  afterEach(() => {
    fs.rmSync(folder, { recursive: true, force: true });
  });

  it('removes only the files of the messages in the session folder', async () => {
    const removed = await storage.removeMessagesMedia('default', [
      'AAA',
      'BBB',
      'MISSING',
    ]);

    expect(removed).toBe(2);
    expect(exists('default', 'AAA.jpeg')).toBe(false);
    expect(exists('default', 'BBB.ogg')).toBe(false);
    expect(exists('default', 'AAA0.jpeg')).toBe(true);
    expect(exists('default', 'AAA')).toBe(true);
    expect(exists('default', 'CCC.pdf')).toBe(true);
    expect(exists('default', 'nested', 'AAA.jpeg')).toBe(true);
    expect(exists('other', 'AAA.jpeg')).toBe(true);
  });

  it('never leaves the files folder', async () => {
    expect(await storage.removeMessagesMedia('../x', ['AAA'])).toBe(0);
    expect(await storage.removeMessagesMedia('default/nested', ['AAA'])).toBe(
      0,
    );
    expect(await storage.removeMessagesMedia('.', ['AAA'])).toBe(0);
    expect(exists('default', 'nested', 'AAA.jpeg')).toBe(true);
  });

  it('accepts a session without files', async () => {
    expect(await storage.removeMessagesMedia('empty', ['AAA'])).toBe(0);
    expect(await storage.removeMessagesMedia('default', [])).toBe(0);
  });
});
