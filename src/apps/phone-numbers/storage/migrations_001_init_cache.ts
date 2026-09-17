import { Knex } from 'knex';

export interface CacheDbNames {
  // 'app_brazilian_phone_numbers_cache'
  table: string;
  // 'brphone' => 'brphone_app_idx'
  index: string;
}

/**
 * The resolved numbers cache table of a phone numbers app
 */
export function migrations_001_init_cache(names: CacheDbNames) {
  return {
    up: function (knex: Knex) {
      return knex.schema
        .createTable(names.table, function (table) {
          table.increments('id');
          table.integer('app_pk');
          table
            .foreign('app_pk')
            .references('pk')
            .inTable('apps')
            .onDelete('CASCADE');
          // Phone number digits the caller may address the chat by
          table.string('key', 32);
          // The chat id the number resolved to ('5585...@c.us' or '...@lid')
          table.string('chat_id', 64);
          table.boolean('verified');
          table.datetime('resolved_at');
        })
        .table(names.table, function (table) {
          table.unique(['app_pk', 'key'], {
            indexName: `${names.index}_app_key_unique`,
          });
          table.index(['app_pk'], `${names.index}_app_idx`);
          table.index(
            ['app_pk', 'resolved_at'],
            `${names.index}_app_resolved_idx`,
          );
        });
    },
    down: function (knex: Knex) {
      return knex.schema.dropTable(names.table);
    },
  };
}
