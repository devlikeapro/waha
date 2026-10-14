import { MediaManager } from '@waha/core/media/MediaManager';

const logger: any = {
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  error: jest.fn(),
};

// A media storage keeping the saved files in memory
function memoryStorage() {
  const files = new Set<string>();
  const storage: any = {
    files: files,
    exists: jest.fn(async (data) => files.has(data.message.id)),
    save: jest.fn(async (buffer, data) => {
      files.add(data.message.id);
      return true;
    }),
    getStorageData: jest.fn(async (data) => ({
      url: `http://localhost/${data.message.id}`,
    })),
    removeMessagesMedia: jest.fn(async (session, ids: string[]) => {
      let removed = 0;
      for (const id of ids) {
        if (files.delete(id)) {
          removed += 1;
        }
      }
      return removed;
    }),
    close: jest.fn(async () => undefined),
  };
  return storage;
}

function processor(download: () => Promise<any>): any {
  return {
    hasMedia: () => true,
    getFilename: () => null,
    getMimetype: () => 'image/jpeg',
    getMessageId: (message) => message.id,
    getChatId: () => '22670000000@c.us',
    getMediaContent: jest.fn(download),
  };
}

describe('MediaManager and deleted chats', () => {
  it('removes a file whose chat was deleted during its download', async () => {
    const storage = memoryStorage();
    const manager = new MediaManager('default', storage, logger);
    let finish: (content: any) => void;
    const slow = processor(() => new Promise((resolve) => (finish = resolve)));

    const download = manager.processMedia(slow, { id: 'AAA' }, {
      download: true,
      mimetypes: [],
    } as any);
    await new Promise((resolve) => setImmediate(resolve));
    expect(await manager.removeMessagesMedia(['AAA'])).toBe(0);
    finish({ buffer: Buffer.from('x') });
    const media = await download;

    expect(media.url).toBeNull();
    expect(storage.files.has('AAA')).toBe(false);
  });

  it('does not download the media of a message removed with its chat', async () => {
    const storage = memoryStorage();
    const manager = new MediaManager('default', storage, logger);
    const fast = processor(async () => ({ buffer: Buffer.from('x') }));

    await manager.removeMessagesMedia(['AAA']);
    const media = await manager.processMedia(fast, { id: 'AAA' }, {
      download: true,
      mimetypes: [],
    } as any);

    expect(media.url).toBeNull();
    expect(fast.getMediaContent).not.toHaveBeenCalled();
    expect(storage.files.size).toBe(0);
  });

  it('still downloads the media of other messages', async () => {
    const storage = memoryStorage();
    const manager = new MediaManager('default', storage, logger);
    const fast = processor(async () => ({ buffer: Buffer.from('x') }));

    await manager.removeMessagesMedia(['AAA']);
    const media = await manager.processMedia(fast, { id: 'BBB' }, {
      download: true,
      mimetypes: [],
    } as any);

    expect(media.url).toBe('http://localhost/BBB');
    expect(storage.files.has('BBB')).toBe(true);
  });
});
