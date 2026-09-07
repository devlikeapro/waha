import { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema
    .createTable('app_brazilian_phone_numbers_cache', function (table) {
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
    .table('app_brazilian_phone_numbers_cache', function (table) {
      table.unique(['app_pk', 'key'], { indexName: 'brphone_app_key_unique' });
      table.index(['app_pk'], 'brphone_app_idx');
      table.index(['app_pk', 'resolved_at'], 'brphone_app_resolved_idx');
    });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('app_brazilian_phone_numbers_cache');
};
