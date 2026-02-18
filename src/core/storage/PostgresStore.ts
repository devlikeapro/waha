import Knex from 'knex';
import { DataStore } from '../abc/DataStore';

export class PostgresStore extends DataStore {
    private knex: Knex.Knex;

    constructor() {
        super();
    }

    async init(sessionName?: string): Promise<void> {
        if (!this.knex) {
            const connection = process.env.WHATSAPP_SESSIONS_POSTGRESQL_URL || {
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
        }
        // Test connection
        try {
            await this.knex.raw('SELECT 1');
        } catch (error) {
            console.error('Failed to connect to Postgres:', error);
            throw error;
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
