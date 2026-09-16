import { Knex } from 'knex';

exports.up = async function (knex: Knex) {
  await knex.schema.alterTable('app_chatwoot_chatwoot_messages', (table) => {
    table.integer('parts').nullable();
  });
  // WhatsApp acks for our messages, kept apart from mappings because an ack can arrive before the mapping
  await knex.schema.createTable('app_chatwoot_whatsapp_acks', (table) => {
    table.increments('id');
    table.integer('app_pk');
    table
      .foreign('app_pk')
      .references('pk')
      .inTable('apps')
      .onDelete('CASCADE');
    table.string('message_id', 64);
    table.integer('ack');
    table.datetime('timestamp');
    table.unique(['app_pk', 'message_id'], {
      indexName: 'wa_ack_app_msg_unique',
    });
    table.index(['app_pk', 'timestamp'], 'wa_ack_app_ts_idx');
  });
};

exports.down = async function (knex: Knex) {
  await knex.schema.dropTable('app_chatwoot_whatsapp_acks');
  await knex.schema.alterTable('app_chatwoot_chatwoot_messages', (table) => {
    table.dropColumn('parts');
  });
};
