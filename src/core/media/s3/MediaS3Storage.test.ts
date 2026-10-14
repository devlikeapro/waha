import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { MediaS3Storage } from '@waha/core/media/s3/MediaS3Storage';

const logger: any = { debug: jest.fn() };

// A bucket answering ListObjectsV2 by prefix (2 keys per page) and DeleteObjects
function fakeBucket(keys: string[], failing: string[] = []) {
  const listed: any[] = [];
  const deleted: string[][] = [];
  let running = 0;
  let most = 0;
  const client: any = {
    send: jest.fn(async (command) => {
      running += 1;
      most = Math.max(most, running);
      await new Promise((resolve) => setTimeout(resolve, 1));
      running -= 1;
      if (command instanceof ListObjectsV2Command) {
        listed.push(command.input);
        const matching = keys.filter((key) =>
          key.startsWith(command.input.Prefix),
        );
        const start = Number(command.input.ContinuationToken ?? 0);
        const page = matching.slice(start, start + 2);
        const more = start + 2 < matching.length;
        return {
          Contents: page.map((key) => ({ Key: key })),
          IsTruncated: more,
          NextContinuationToken: more ? String(start + 2) : undefined,
        };
      }
      if (command instanceof DeleteObjectsCommand) {
        const batch = command.input.Delete.Objects.map((object) => object.Key);
        deleted.push(batch);
        expect(command.input.Delete.Quiet).toBe(true);
        return {
          Errors: batch
            .filter((key) => failing.includes(key))
            .map((key) => ({ Key: key, Code: 'AccessDenied', Message: 'no' })),
        };
      }
      throw new Error('unexpected command');
    }),
  };
  return {
    client: client,
    listed: listed,
    deleted: deleted,
    most: () => most,
  };
}

const KEYS = [
  'default/AAA.jpeg',
  'default/AAA0.jpeg',
  'default/AAA.0.jpeg',
  'default/BBB.ogg',
  'default/nested/AAA.jpeg',
  'default/AAA',
  'other/AAA.jpeg',
];

describe('MediaS3Storage.removeMessagesMedia', () => {
  it('lists a few messages by their own prefix', async () => {
    const bucket = fakeBucket(KEYS);
    const storage = new MediaS3Storage(bucket.client, null, 'bucket', logger);

    const removed = await storage.removeMessagesMedia('default', [
      'AAA',
      'BBB',
    ]);

    expect(removed).toBe(2);
    expect(bucket.listed.map((input) => input.Prefix).sort()).toEqual([
      'default/AAA.',
      'default/BBB.',
    ]);
    expect(bucket.deleted).toEqual([['default/AAA.jpeg', 'default/BBB.ogg']]);
  });

  it('lists the session once for many messages, deletes 1000 at a time', async () => {
    const ids = Array.from({ length: 1500 }, (_, i) => `ID${i}`);
    const keys = [
      ...ids.map((id) => `default/${id}.jpeg`),
      'default/nested/ID1.jpeg',
      'default/UNKNOWN.jpeg',
      'other/ID1.jpeg',
    ];
    const bucket = fakeBucket(keys);
    const storage = new MediaS3Storage(bucket.client, null, 'bucket', logger);

    const removed = await storage.removeMessagesMedia('default', ids);

    expect(removed).toBe(1500);
    expect(new Set(bucket.listed.map((input) => input.Prefix))).toEqual(
      new Set(['default/']),
    );
    expect(bucket.deleted.map((batch) => batch.length)).toEqual([1000, 500]);
    expect(bucket.deleted.flat()).not.toContain('default/nested/ID1.jpeg');
    expect(bucket.deleted.flat()).not.toContain('default/UNKNOWN.jpeg');
  });

  it('sends at most 5 requests at once', async () => {
    const ids = Array.from({ length: 20 }, (_, i) => `ID${i}`);
    const bucket = fakeBucket(ids.map((id) => `default/${id}.jpeg`));
    const storage = new MediaS3Storage(bucket.client, null, 'bucket', logger);

    expect(await storage.removeMessagesMedia('default', ids)).toBe(20);
    expect(bucket.listed).toHaveLength(20);
    expect(bucket.most()).toBeLessThanOrEqual(5);
  });

  it('fails when an object could not be deleted', async () => {
    const bucket = fakeBucket(KEYS, ['default/BBB.ogg']);
    const storage = new MediaS3Storage(bucket.client, null, 'bucket', logger);

    await expect(
      storage.removeMessagesMedia('default', ['AAA', 'BBB']),
    ).rejects.toThrow(/default\/BBB\.ogg.*AccessDenied/);
  });

  it('does not call S3 without messages or objects', async () => {
    const bucket = fakeBucket([]);
    const storage = new MediaS3Storage(bucket.client, null, 'bucket', logger);

    expect(await storage.removeMessagesMedia('default', [])).toBe(0);
    expect(bucket.client.send).not.toHaveBeenCalled();
    expect(await storage.removeMessagesMedia('default', ['AAA'])).toBe(0);
    expect(bucket.deleted).toEqual([]);
  });
});
