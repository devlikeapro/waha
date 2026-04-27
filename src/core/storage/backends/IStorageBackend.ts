import Knex from 'knex';

/**
 * Storage backend interface for WAHA multi-account hosting.
 * Supports SQLite, PostgreSQL, and MongoDB backends.
 */
export interface IStorageBackend {
  /** Backend type identifier */
  readonly type: 'sqlite' | 'postgresql' | 'mongodb';

  /** Initialize the storage backend */
  init(): Promise<void>;

  /** Close connections and cleanup */
  close(): Promise<void>;

  /** Get Knex instance for SQL backends */
  getKnex?(): Knex.Knex | null;

  /** Health check */
  isHealthy(): Promise<boolean>;
}
