import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('app_chatwoot_chatwoot_messages', (table) => {
    // Only native outbound sends know how many WhatsApp parts to expect.
    table.integer('expected_parts').nullable();
  });
  await knex.schema.createTable('app_chatwoot_message_acks', (table) => {
    table
      .integer('app_pk')
      .references('pk')
      .inTable('apps')
      .onDelete('CASCADE');
    table.string('message_id', 64);
    table.integer('ack').notNullable();
    table.datetime('timestamp').notNullable();
    table.primary(['app_pk', 'message_id']);
    table.index(['app_pk', 'timestamp']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('app_chatwoot_message_acks');
  await knex.schema.alterTable('app_chatwoot_chatwoot_messages', (table) => {
    table.dropColumn('expected_parts');
  });
}
