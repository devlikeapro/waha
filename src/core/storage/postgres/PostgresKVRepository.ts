import { SqlKVRepository } from '@waha/core/storage/sql/SqlKVRepository';
import { PostgresJSONQuery } from './PostgresJSONQuery';
import Knex from 'knex';

export class PostgresKVRepository<Entity> extends SqlKVRepository<Entity> {
    protected jsonQuery = new PostgresJSONQuery();

    constructor(knex: Knex.Knex) {
        super(knex);
    }

    // Override upsertBatch to possibly handle Postgres specifics if needed,
    // but keeping it default for now assuming knex.raw handles '?'
}
