import knex, { Knex } from 'knex';

import { BrazilianPhoneCacheRepository } from './BrazilianPhoneCacheRepository';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const initApps = require('../../app_sdk/migrations/001_init_apps');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const initCache = require('../migrations/001_init_brazilian_phone_numbers');

const DAY_MS = 24 * 60 * 60 * 1000;

describe('BrazilianPhoneCacheRepository', () => {
  let db: Knex;
  let appPk: number;
  let repository: BrazilianPhoneCacheRepository;

  beforeAll(async () => {
    db = knex({
      client: 'sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });
    await initApps.up(db);
    await initCache.up(db);
    const [pk] = await db('apps')
      .insert({
        id: 'app_test',
        session: 'default',
        app: 'brazilian-phone-numbers',
        config: '{}',
      })
      .returning('pk');
    appPk = typeof pk === 'object' ? pk.pk : pk;
  });

  afterAll(async () => {
    await db.destroy();
  });

  beforeEach(async () => {
    repository = new BrazilianPhoneCacheRepository(db, appPk, 31 * DAY_MS);
    await repository.purge();
  });

  it('stores and reads a resolution under multiple keys', async () => {
    await repository.setMany(
      ['558591203123', '5585991203123'],
      '558591203123@c.us',
      true,
      new Date(),
    );

    const byShortForm = await repository.get('558591203123');
    const byLongForm = await repository.get('5585991203123');

    expect(byShortForm?.chatId).toBe('558591203123@c.us');
    expect(byShortForm?.verified).toBe(true);
    expect(byLongForm?.chatId).toBe('558591203123@c.us');
  });

  it('upserts on conflict instead of duplicating keys', async () => {
    await repository.setMany(['558591203123'], 'old@c.us', true, new Date());
    await repository.setMany(
      ['558591203123'],
      '77820596330581@lid',
      true,
      new Date(),
    );

    const entry = await repository.get('558591203123');
    const stats = await repository.stats();

    expect(entry?.chatId).toBe('77820596330581@lid');
    expect(stats.total).toBe(1);
  });

  it('does not return expired entries', async () => {
    const expired = new Date(Date.now() - 40 * DAY_MS);
    await repository.setMany(
      ['558591203123'],
      '558591203123@c.us',
      true,
      expired,
    );

    const entry = await repository.get('558591203123');

    expect(entry).toBeNull();
  });

  it('purges only entries older than the given date', async () => {
    const old = new Date(Date.now() - 10 * DAY_MS);
    await repository.setMany(['558591203123'], '558591203123@c.us', true, old);
    await repository.setMany(
      ['5511998765432'],
      '5511998765432@c.us',
      true,
      new Date(),
    );

    const deleted = await repository.purge(new Date(Date.now() - 5 * DAY_MS));

    expect(deleted).toBe(1);
    expect(await repository.get('558591203123')).toBeNull();
    expect(await repository.get('5511998765432')).not.toBeNull();
  });

  it('purges everything when no date is given', async () => {
    await repository.setMany(
      ['558591203123', '5585991203123'],
      '558591203123@c.us',
      true,
      new Date(),
    );

    const deleted = await repository.purge();

    expect(deleted).toBe(2);
    expect((await repository.stats()).total).toBe(0);
  });

  it('reports total and verified counts', async () => {
    await repository.setMany(
      ['558591203123', '5585991203123'],
      '558591203123@c.us',
      true,
      new Date(),
    );

    const stats = await repository.stats();

    expect(stats.total).toBe(2);
    expect(stats.verified).toBe(2);
  });
});
