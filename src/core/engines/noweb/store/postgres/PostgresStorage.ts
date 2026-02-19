import { ILabelAssociationRepository } from '@waha/core/engines/noweb/store/ILabelAssociationsRepository';
import { ILabelsRepository } from '@waha/core/engines/noweb/store/ILabelsRepository';
import { INowebLidPNRepository } from '@waha/core/engines/noweb/store/INowebLidPNRepository';
import { PostgresGroupRepository } from './PostgresGroupRepository';
import { PostgresLabelAssociationsRepository } from './PostgresLabelAssociationsRepository';
import { PostgresLabelsRepository } from './PostgresLabelsRepository';
import { PostgresLidPNRepository } from './PostgresLidPNRepository';
import { PostgresChatRepository } from './PostgresChatRepository';
import { PostgresContactRepository } from './PostgresContactRepository';
import { PostgresMessagesRepository } from './PostgresMessagesRepository';
import { PostgresStore } from '@waha/core/storage/PostgresStore';
import { INowebStorage } from '../INowebStorage';
import { Migrations } from '../schemas';

export class PostgresStorage extends INowebStorage {
    constructor(private store: PostgresStore) {
        super();
    }

    async init() {
        console.info('Initializing PostgresStorage and running migrations...');
        await this.migrate();
        console.info('PostgresStorage migrations completed.');
    }

    private async migrate() {
        const knex = this.store.getWAHADatabase();
        for (const migration of Migrations) {
            let sql = migration;
            // Postgres uses BIGINT for large integers (timestamps in ms can overflow Integer)
            sql = sql.replace(/"conversationTimestamp" INTEGER/g, '"conversationTimestamp" BIGINT');
            sql = sql.replace(/"messageTimestamp" INTEGER/g, '"messageTimestamp" BIGINT');
            // Use JSONB for data column to support JSON queries
            sql = sql.replace(/data TEXT/g, 'data JSONB');

            try {
                await knex.raw(sql);
            } catch (e: any) {
                // Ignore 'relation "x" already exists' errors
                // Postgres "42P07" code is duplicate_table
                if (!e.message.includes('already exists')) {
                    console.warn(`Migration error: ${e.message}`);
                }
            }
        }


    }

    async close() {
        // Manager handles closing the store
    }

    getContactsRepository() {
        return new PostgresContactRepository(this.store.getWAHADatabase());
    }

    getChatRepository() {
        return new PostgresChatRepository(this.store.getWAHADatabase());
    }

    getGroupRepository() {
        return new PostgresGroupRepository(this.store.getWAHADatabase());
    }

    getLabelsRepository(): ILabelsRepository {
        return new PostgresLabelsRepository(this.store.getWAHADatabase());
    }

    getLabelAssociationRepository(): ILabelAssociationRepository {
        return new PostgresLabelAssociationsRepository(this.store.getWAHADatabase());
    }

    getMessagesRepository() {
        return new PostgresMessagesRepository(this.store.getWAHADatabase());
    }

    getLidPNRepository(): INowebLidPNRepository {
        return new PostgresLidPNRepository(this.store.getWAHADatabase());
    }
}
