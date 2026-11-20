import { Migrations } from '@waha/core/engines/noweb/store/schemas';
import { Sqlite3LidPNRepository } from '@waha/core/engines/noweb/store/sqlite3/Sqlite3LidPNRepository';
import { Sqlite3MessagesRepository } from '@waha/core/engines/noweb/store/sqlite3/Sqlite3MessagesRepository';
import { SortOrder } from '@waha/structures/pagination.dto';
import esm from '@waha/vendor/esm';
import knex, { Knex } from 'knex';

// The session module pulls in ESM-only Baileys; only ALL_JID is needed here.
jest.mock('@waha/core/engines/noweb/session.noweb.core', () => ({
  ALL_JID: 'all@s.whatsapp.net',
}));

const PN = '111@s.whatsapp.net';
const LID = '222@lid';
const OTHER = '333@s.whatsapp.net';

function page(limit: number, offset = 0) {
  return {
    limit: limit,
    offset: offset,
    sortBy: 'messageTimestamp',
    sortOrder: SortOrder.DESC,
  };
}

describe('SqlMessagesMethods', () => {
  let db: Knex;
  let repo: Sqlite3MessagesRepository;
  let sqls: string[];

  beforeAll(async () => {
    // Baileys is ESM-only; these rows hold no Buffers.
    esm.b = { BufferJSON: {} } as any;
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });
    for (const migration of Migrations) {
      await db.raw(migration);
    }
    await db('lid_map').insert({ id: LID, pn: PN });
    // PN chat: older messages under the PN jid, newer ones under its LID.
    const rows = [];
    for (let ts = 1; ts <= 10; ts++) {
      rows.push(message(ts <= 6 ? PN : LID, `m${ts}`, ts));
    }
    rows.push(message(OTHER, 'o1', 5), message(OTHER, 'o2', 11));
    await db('messages').insert(rows);
    repo = new Sqlite3MessagesRepository(db, new Sqlite3LidPNRepository(db));
    db.on('query', (q) => sqls.push(q.sql));
  });

  beforeEach(() => {
    sqls = [];
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('merges PN and LID messages in timestamp order', async () => {
    const result = await repo.getAllByJid(PN, {}, page(4));
    expect(ids(result)).toEqual(['m10', 'm9', 'm8', 'm7']);
  });

  it('applies offset across the merged jids', async () => {
    const result = await repo.getAllByJid(PN, {}, page(4, 3));
    expect(ids(result)).toEqual(['m7', 'm6', 'm5', 'm4']);
  });

  it('resolves a LID to its PN chat', async () => {
    const result = await repo.getAllByJid(LID, {}, page(3, 4));
    expect(ids(result)).toEqual(['m6', 'm5', 'm4']);
  });

  it('applies timestamp filters to every jid', async () => {
    const filter = { 'filter.timestamp.gte': 5, 'filter.timestamp.lte': 8 };
    const result = await repo.getAllByJid(PN, filter, page(10));
    expect(ids(result)).toEqual(['m8', 'm7', 'm6', 'm5']);
  });

  it('reads a chat without LID with a single indexed query', async () => {
    const result = await repo.getAllByJid(OTHER, {}, page(10));
    expect(ids(result)).toEqual(['o2', 'o1']);
    const messageSql = sqls.filter((sql) => sql.includes('from `messages`'));
    expect(messageSql).toHaveLength(1);
    expect(messageSql[0]).not.toMatch(/ or |union/i);
  });

  it('sorts by the messageTimestamp column, not the JSON payload', async () => {
    await repo.getAllByJid(PN, {}, page(4));
    const messageSql = sqls.find((sql) => sql.includes('from `messages`'));
    expect(messageSql).toMatch(/order by `messageTimestamp` desc/);
    expect(messageSql).not.toMatch(/ or |json/i);
  });

  it('keeps the exact jid when merge is off', async () => {
    const result = await repo.getAllByJid(PN, {}, page(10), false);
    expect(ids(result)).toEqual(['m6', 'm5', 'm4', 'm3', 'm2', 'm1']);
  });

  it('finds a LID-stored message by its PN chat', async () => {
    const result = await repo.getByJidById(PN, 'm9');
    expect(result.key.id).toBe('m9');
  });
});

/** A minimal stored NOWEB message row. */
function message(jid: string, id: string, ts: number) {
  const data = { key: { remoteJid: jid, id: id }, messageTimestamp: ts };
  return {
    jid: jid,
    id: id,
    messageTimestamp: ts,
    data: JSON.stringify(data),
  };
}

/** Message ids in result order. */
function ids(messages: any[]): string[] {
  return messages.map((m) => m.key.id);
}
