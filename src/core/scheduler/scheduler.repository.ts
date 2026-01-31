import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { SessionManager } from '../abc/manager.abc';
import { ScheduleMessageRequest } from './scheduler.dto';

@Injectable()
export class SchedulerRepository {
    private tableName = 'scheduled_jobs';
    private knex: Knex;

    constructor(private sessionManager: SessionManager) {}

    async init() {
        const store = this.sessionManager.store;
        // Ensure store is initialized (idempotent)
        if (store.init) {
            await store.init();
        }

        if (store && typeof store.getWAHADatabase === 'function') {
            this.knex = store.getWAHADatabase();
        } else {
             throw new Error('Could not access WAHA Database from SessionManager.store');
        }

        const exists = await this.knex.schema.hasTable(this.tableName);
        if (!exists) {
            await this.knex.schema.createTable(this.tableName, (table) => {
                table.string('id').primary();
                table.string('executeAt').notNullable();
                table.string('type').notNullable();
                table.json('payload').notNullable();
                table.bigInteger('createdAt').defaultTo(Date.now());
            });
        }
    }

    async save(job: ScheduleMessageRequest) {
        await this.knex(this.tableName)
            .insert({
                id: job.id,
                executeAt: job.executeAt,
                type: job.type,
                payload: JSON.stringify(job.payload),
                createdAt: Date.now()
            })
            .onConflict('id')
            .merge(); // Upsert
    }

    async delete(id: string) {
        await this.knex(this.tableName).where('id', id).delete();
    }

    async getAll(): Promise<ScheduleMessageRequest[]> {
        const rows = await this.knex(this.tableName).select('*');
        return rows.map(row => ({
            id: row.id,
            executeAt: row.executeAt,
            type: row.type,
            // SQLite stores JSON as string usually, unless using json type support in better-sqlite3 which handles it automatically?
            // Knex with sqlite3 usually returns string for json columns unless parsed.
            // Let's safe parse.
            payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload
        }));
    }
}
