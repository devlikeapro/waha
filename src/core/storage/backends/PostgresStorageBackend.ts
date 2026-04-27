import { Schema } from '@waha/core/storage/Schema';
import { Migration } from '@waha/core/storage/sql/SqlKVRepository';
import { IStorageBackend } from '@waha/core/storage/backends/IStorageBackend';
import Knex from 'knex';

const KNEX_PG_CLIENT = 'pg';

/**
 * PostgreSQL storage backend for WAHA multi-account hosting.
 * Suitable for high-concurrency deployments with multiple WhatsApp accounts.
 */
export class PostgresStorageBackend implements IStorageBackend {
  readonly type = 'postgresql' as const;

  private knex: Knex.Knex;

  constructor(
    private connectionUrl: string,
    private namespace: string = 'waha',
  ) {
    this.knex = Knex({
      client: KNEX_PG_CLIENT,
      connection: this.connectionUrl,
      pool: {
        min: 2,
        max: 20,
        idleTimeoutMillis: 30_000,
      },
    });
  }

  async init(): Promise<void> {
    // Create schema if not exists
    await this.knex.raw(`CREATE SCHEMA IF NOT EXISTS "${this.namespace}"`);
    await this.knex.raw(`SET search_path TO "${this.namespace}"`);
  }

  async close(): Promise<void> {
    await this.knex.destroy();
  }

  getKnex(): Knex.Knex {
    return this.knex;
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.knex.raw('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Run database migrations for PostgreSQL schema.
   */
  async runMigrations(schema: Schema, migrations: Migration[]): Promise<void> {
    for (const migration of migrations) {
      await this.knex.raw(migration);
    }
  }
}
