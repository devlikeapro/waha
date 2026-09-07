import { Knex } from 'knex';

import { WhatsAppMessage } from './types';

export class WhatsAppMessageRepository {
  static tableName = 'app_chatwoot_whatsapp_messages';

  constructor(
    private readonly knex: Knex,
    private readonly appPk: number,
  ) {}

  get tableName() {
    return WhatsAppMessageRepository.tableName;
  }

  async upsertWithTrx(
    trx: Knex.Transaction,
    message: Omit<WhatsAppMessage, 'id'>,
  ): Promise<WhatsAppMessage> {
    const [id] = await trx(this.tableName)
      .insert({
        ...message,
        app_pk: this.appPk,
      })
      .onConflict(['app_pk', 'chat_id', 'message_id'])
      .merge()
      .returning('id');

    return { ...message, ...id };
  }

  /**
   * Gets a message by its id
   */
  async getById(id: number): Promise<WhatsAppMessage | null> {
    return this.knex(this.tableName)
      .where({
        app_pk: this.appPk,
        id: id,
      })
      .orderBy('id', 'desc')
      .first();
  }

  async getByMessageId(messageId: string): Promise<WhatsAppMessage | null> {
    return this.knex(this.tableName)
      .where({
        app_pk: this.appPk,
        message_id: messageId,
      })
      .orderBy('id', 'desc')
      .first();
  }

  /**
   * Deletes messages older than the specified date
   * @param date Date before which messages should be removed
   * @param trx Optional transaction object
   * @returns Number of deleted messages
   */
  async deleteMessagesOlderThan(
    trx: Knex.Transaction,
    date: Date,
  ): Promise<number> {
    const result = await trx(this.tableName)
      .where('app_pk', this.appPk)
      .andWhere('timestamp', '<', date)
      .del();
    return result;
  }

  /**
   * Deletes all rows for the app.
   */
  async deleteAllWithTrx(trx: Knex.Transaction): Promise<number> {
    return await trx(this.tableName).where({ app_pk: this.appPk }).delete();
  }
}
