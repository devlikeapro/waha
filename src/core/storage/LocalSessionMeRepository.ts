import { Sqlite3SchemaValidation } from '@waha/core/engines/noweb/store/sqlite3/Sqlite3SchemaValidation';
import { ISessionMeRepository } from '@waha/core/storage/ISessionMeRepository';
import { LocalStore } from '@waha/core/storage/LocalStore';
import { Field, Index, Schema } from '@waha/core/storage/sqlite3/Schema';
import { Sqlite3KVRepository } from '@waha/core/storage/sqlite3/Sqlite3KVRepository';
import { MeInfo } from '@waha/structures/sessions.dto';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Database = require('better-sqlite3');

const SCHEMA = new Schema(
  'me',
  [new Field('id', 'TEXT'), new Field('data', 'TEXT')],
  [new Index('me_id_index', ['id'])],
);

class SessionMeInfo {
  id: string;
  me?: MeInfo;
}

export class LocalSessionMeRepository
  extends Sqlite3KVRepository<SessionMeInfo>
  implements ISessionMeRepository
{
  constructor(store: LocalStore) {
    const db = store.getWAHADatabase();
    super(db, SCHEMA);
  }

  upsertMe(sessionName: string, me: MeInfo): Promise<void> {
    return this.upsertOne({ id: sessionName, me: me });
  }

  async getMe(sessionName: string): Promise<MeInfo | null> {
    const data = await this.getById(sessionName);
    return data?.me;
  }

  removeMe(sessionName: string): Promise<void> {
    return this.deleteById(sessionName);
  }

  async init(): Promise<void> {
    this.migrations();
    this.validateSchema();
  }

  private migrations() {
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS me (id TEXT PRIMARY KEY, data TEXT)',
    );
    this.db.exec('CREATE UNIQUE INDEX IF NOT EXISTS me_id_index ON me (id)');
  }

  private validateSchema() {
    new Sqlite3SchemaValidation(SCHEMA, this.db).validate();
  }
}
