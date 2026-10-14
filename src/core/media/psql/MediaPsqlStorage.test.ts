import { MediaPsqlStorage } from '@waha/core/media/psql/MediaPsqlStorage';
import Knex from 'knex';

const logger: any = { debug: jest.fn(), info: jest.fn(), warn: jest.fn() };

describe('MediaPsqlStorage.removeMessagesMedia', () => {
  it('deletes the files named after the messages', async () => {
    const storage = new MediaPsqlStorage(
      {} as any,
      'http://localhost/',
      logger,
    );
    const repository = {
      deleteByNames: jest.fn(async () => ['AAA.jpeg', 'BBB.ogg']),
    };
    storage.repository = repository as any;

    const removed = await storage.removeMessagesMedia('default', [
      'AAA',
      'BBB',
    ]);

    expect(removed).toBe(2);
    expect(repository.deleteByNames).toHaveBeenCalledWith(['AAA', 'BBB']);
  });

  it('compares the name without its extension, without LIKE', () => {
    const knex = Knex({ client: 'pg' });
    const storage = new MediaPsqlStorage(knex, 'http://localhost/', logger);

    const queries: any[] = [];
    knex.on('query', (query) => queries.push(query));
    const table = (storage.repository as any).table.bind(storage.repository);
    (storage.repository as any).table = () => {
      const builder = table();
      builder.then = (resolve) => {
        queries.push(builder.toSQL().toNative());
        return resolve([]);
      };
      return builder;
    };

    return storage.removeMessagesMedia('default', ['A', 'B']).then(() => {
      expect(queries).toEqual([
        {
          sql: `delete from "media" where substring(fullpath from '^(.+)\\.[^.]+$') = ANY($1::text[]) returning "fullpath"`,
          bindings: [['A', 'B']],
        },
      ]);
    });
  });
});

// Runs on a real PostgreSQL when WAHA_TEST_PG_URL is set
const pgUrl = process.env.WAHA_TEST_PG_URL;
(pgUrl ? describe : describe.skip)('MediaPsqlStorage on PostgreSQL', () => {
  let knex: Knex.Knex;

  beforeAll(() => {
    knex = Knex({ client: 'pg', connection: pgUrl });
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('removes exactly the files of the messages, whatever the extension', async () => {
    const storage = new MediaPsqlStorage(knex, 'http://localhost/', logger);
    await storage.init();
    await knex('media').del();
    const names = [
      'AAA.jpeg',
      'AAA0.jpeg',
      'AAA.0.jpeg',
      'AAA',
      'AAA.',
      '.jpeg',
      'A%B.ogg',
      'AxB.ogg',
      'C_D.pdf',
      'CxD.pdf',
      'E\\F.pdf',
      "G'H.webp",
      'BBB.ogg',
    ];
    for (const name of names) {
      await storage.repository.save(name, Buffer.from('x'));
    }
    const ids = ['AAA', 'A%B', 'C_D', 'E\\F', "G'H", 'BBB', 'MISSING'];

    const removed = await storage.removeMessagesMedia('default', ids);

    expect(removed).toBe(6);
    const left = (await knex('media').select('fullpath')).map(
      (row) => row.fullpath,
    );
    expect(left.sort()).toEqual(
      [
        'AAA0.jpeg',
        'AAA.0.jpeg',
        'AAA',
        'AAA.',
        '.jpeg',
        'AxB.ogg',
        'CxD.pdf',
      ].sort(),
    );
  });
});
