import Knex from 'knex';
import { DataStore } from '../abc/DataStore';

declare const process: any;

const MIGRATIONS: string[] = [
    // Session Config
    `CREATE TABLE IF NOT EXISTS session_config (
    id TEXT PRIMARY KEY,
    data TEXT
  )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS session_config_id_index ON session_config (id)`,

    // Me
    `CREATE TABLE IF NOT EXISTS me (
    id TEXT PRIMARY KEY,
    data TEXT
  )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS me_id_index ON me (id)`,

    // Session Worker
    `CREATE TABLE IF NOT EXISTS session_worker (
    id TEXT UNIQUE,
    worker TEXT,
    data TEXT
  )`,
    `CREATE INDEX IF NOT EXISTS session_worker_worker_idx ON session_worker (worker)`,

    // API Key
    `CREATE TABLE IF NOT EXISTS api_key (
    id TEXT PRIMARY KEY,
    "key" TEXT,
    "isActive" INTEGER,
    session TEXT,
    data TEXT
  )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS api_key_id_index ON api_key (id)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS api_key_key_idx ON api_key ("key")`,
    `CREATE INDEX IF NOT EXISTS api_key_session_idx ON api_key (session)`,

    // Auth (used by PostgresSessionAuthRepository)
    `CREATE TABLE IF NOT EXISTS waha_auth (
    session_id TEXT PRIMARY KEY,
    data TEXT
  )`,
];

export class PostgresStore extends DataStore {
    private knex: Knex.Knex;

    constructor() {
        super();
    }

    async init(sessionName?: string): Promise<void> {
        if (!this.knex) {
            const connection =
                process.env.WHATSAPP_SESSIONS_POSTGRESQL_URL || {
                    host: process.env.WAHA_POSTGRES_HOST || 'localhost',
                    port: parseInt(process.env.WAHA_POSTGRES_PORT || '5432'),
                    user: process.env.WAHA_POSTGRES_USER || 'postgres',
                    password: process.env.WAHA_POSTGRES_PASSWORD || 'postgres',
                    database: process.env.WAHA_POSTGRES_DB || 'waha',
                };

            this.knex = Knex({
                client: 'pg',
                connection: connection,
                pool: {
                    min: 2,
                    max: 10,
                },
            });

            // Test connection
            try {
                await this.knex.raw('SELECT 1');
            } catch (error) {
                console.error('Failed to connect to Postgres:', error);
                throw error;
            }

            // Run migrations to ensure all tables exist
            await this.runMigrations();
        }
    }

    private async runMigrations(): Promise<void> {
        for (const sql of MIGRATIONS) {
            try {
                await this.knex.raw(sql);
            } catch (error) {
                console.error(`Migration failed: ${sql}\nError: ${error}`);
                throw error;
            }
        }
    }

    async close(): Promise<any> {
        await this.knex?.destroy();
    }

    getWAHADatabase(): Knex.Knex {
        if (!this.knex) {
            throw new Error('Knex is not initialized, call PostgresStore.init() first');
        }
        return this.knex;
    }
}
