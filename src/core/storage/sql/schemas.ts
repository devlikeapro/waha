import { Field, Index, Schema } from '@waha/core/storage/Schema';
import { Migration } from '@waha/core/storage/sql/SqlKVRepository';

/**
 * Session Config
 */
export const SQLSessionConfigSchema = new Schema(
  'session_config',
  [new Field('id', 'TEXT'), new Field('data', 'TEXT')],
  [new Index('session_config_id_index', ['id'])],
);

export const SQLSessionConfigMigrations: Migration[] = [
  'CREATE TABLE IF NOT EXISTS session_config (id TEXT PRIMARY KEY, data TEXT)',
  'CREATE UNIQUE INDEX IF NOT EXISTS session_config_id_index ON session_config (id)',
];

/**
 * Me
 */
export const SQLMeSchema = new Schema(
  'me',
  [new Field('id', 'TEXT'), new Field('data', 'TEXT')],
  [new Index('me_id_index', ['id'])],
);

export const SQLMeMigrations: Migration[] = [
  'CREATE TABLE IF NOT EXISTS me (id TEXT PRIMARY KEY, data TEXT)',
  'CREATE UNIQUE INDEX IF NOT EXISTS me_id_index ON me (id)',
];

/**
 * Worker
 */
export const SQLSessionWorkerSchema = new Schema(
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

export const SQLSessionWorkerMigrations: Migration[] = [
  'CREATE TABLE IF NOT EXISTS session_worker (id TEXT, worker TEXT, data TEXT)',
  // Session can have only one record
  'CREATE UNIQUE INDEX IF NOT EXISTS session_worker_id_idx ON session_worker (id)',
  // Worker can have multiple records
  'CREATE INDEX IF NOT EXISTS session_worker_worker_idx ON session_worker (worker)',
];

/**
 * Api Keys
 */
export const SQLApiKeySchema = new Schema(
  'api_key',
  [
    new Field('id', 'TEXT'),
    new Field('key', 'TEXT'),
    new Field('isActive', 'INTEGER'),
    new Field('session', 'TEXT'),
    new Field('data', 'TEXT'),
  ],
  [
    new Index('api_key_id_index', ['id']),
    new Index('api_key_key_idx', ['key']),
    new Index('api_key_session_idx', ['session']),
  ],
);

export const SQLApiKeyMigrations: Migration[] = [
  'CREATE TABLE IF NOT EXISTS api_key (id TEXT PRIMARY KEY, "key" TEXT, "isActive" INTEGER, session TEXT, data TEXT)',
  'CREATE UNIQUE INDEX IF NOT EXISTS api_key_id_index ON api_key (id)',
  'CREATE UNIQUE INDEX IF NOT EXISTS api_key_key_idx ON api_key ("key")',
  'CREATE INDEX IF NOT EXISTS api_key_session_idx ON api_key (session)',
];
