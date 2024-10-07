import { Sqlite3SchemaValidation } from '@waha/core/engines/noweb/store/sqlite3/Sqlite3SchemaValidation';
import {
  ISessionWorkerRepository,
  SessionWorkerInfo,
} from '@waha/core/storage/ISessionWorkerRepository';
import { LocalStore } from '@waha/core/storage/LocalStore';
import { Field, Index, Schema } from '@waha/core/storage/sqlite3/Schema';
import { Sqlite3KVRepository } from '@waha/core/storage/sqlite3/Sqlite3KVRepository';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Database = require('better-sqlite3');

const SCHEMA = new Schema(
  'session_worker',
  [
    new Field('id', 'TEXT'),
    new Field('worker', 'TEXT'),
    new Field('data', 'TEXT'),
  ],
  [
    new Index('session_worker_id_idx', ['id']),
    new Index('session_worker_worker_idx', ['worker']),
  ],
);

export class LocalSessionWorkerRepository
  extends Sqlite3KVRepository<SessionWorkerInfo>
  implements ISessionWorkerRepository
{
  constructor(store: LocalStore) {
    const db = store.getWAHADatabase();
    super(db, SCHEMA);
  }

  assign(session: string, worker: string): Promise<void> {
    return this.upsertOne({ id: session, worker: worker });
  }

  unassign(session: string, worker: string): Promise<void> {
    return this.deleteBy({ id: session, worker: worker });
  }

  remove(session: string) {
    return this.deleteById(session);
  }

  async getSessionsByWorker(worker: string): Promise<string[]> {
    const data = await this.getAllBy({ worker: worker });
    return data.map((d) => d.id);
  }

  async init(): Promise<void> {
    this.migrations();
    this.validateSchema();
  }

  private migrations() {
    this.db.exec(
      'CREATE TABLE IF NOT EXISTS session_worker (id TEXT, worker TEXT, data TEXT)',
    );
    // Session can have only one record
    this.db.exec(
      'CREATE UNIQUE INDEX IF NOT EXISTS session_worker_id_idx ON session_worker (id)',
    );
    // Worker can have multiple records
    this.db.exec(
      'CREATE INDEX IF NOT EXISTS session_worker_worker_idx ON session_worker (worker)',
    );
  }

  private validateSchema() {
    new Sqlite3SchemaValidation(SCHEMA, this.db).validate();
  }
}
