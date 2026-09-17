import knex, { Knex } from 'knex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const initApps = require('../../app_sdk/migrations/001_init_apps');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const phoneNumbers = require('../migrations/001_init_app');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const argentine = require('../../argentine-phone-numbers/migrations/001_init_app');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const brazilian = require('../../brazilian-phone-numbers/migrations/001_init_brazilian_phone_numbers');

describe('migrations_001_init_cache', () => {
  let db: Knex;

  beforeEach(async () => {
    db = knex({
      client: 'sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });
    await initApps.up(db);
  });

  afterEach(async () => {
    await db.destroy();
  });

  it('every phone numbers app gets its own table', async () => {
    await phoneNumbers.up(db);
    await argentine.up(db);
    await brazilian.up(db);

    expect(await db.schema.hasTable('app_phone_numbers_cache')).toBe(true);
    expect(await db.schema.hasTable('app_argentine_phone_numbers_cache')).toBe(
      true,
    );
    expect(await db.schema.hasTable('app_brazilian_phone_numbers_cache')).toBe(
      true,
    );

    await brazilian.down(db);
    expect(await db.schema.hasTable('app_brazilian_phone_numbers_cache')).toBe(
      false,
    );
    expect(await db.schema.hasTable('app_phone_numbers_cache')).toBe(true);
  });
});
