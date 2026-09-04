import { Knex } from 'knex';

import { ChatWootCombinedKey, ChatwootMessage } from './types';

export class ChatwootMessageRepository {
  static tableName = 'app_chatwoot_chatwoot_messages';

  constructor(
    private readonly knex: Knex,
    private readonly appPk: number,
  ) {}

  get tableName() {
    return ChatwootMessageRepository.tableName;
  }

  async upsertWithTrx(
    trx: Knex.Transaction,
    message: Omit<ChatwootMessage, 'id'>,
  ): Promise<ChatwootMessage> {
    const [id] = await trx(this.tableName)
      .insert({
        ...message,
        app_pk: this.appPk,
      })
      .onConflict(['app_pk', 'conversation_id', 'message_id'])
      .merge()
      .returning('id');

    return { ...message, ...id };
  }

  /**
   * Gets a message by its id
   */
  async getById(id: number): Promise<ChatwootMessage | null> {
    return this.knex(this.tableName)
      .where({
        app_pk: this.appPk,
        id: id,
      })
      .orderBy('id', 'desc')
      .first();
  }

  async getByCombinedKey(key: ChatWootCombinedKey): Promise<ChatwootMessage[]> {
    return this.knex(this.tableName)
      .where({
        app_pk: this.appPk,
        conversation_id: key.conversation_id,
        message_id: key.message_id,
      })
      .select('*');
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
