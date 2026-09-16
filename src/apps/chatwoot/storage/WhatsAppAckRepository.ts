import { Knex } from 'knex';

export class WhatsAppAckRepository {
  static tableName = 'app_chatwoot_whatsapp_acks';

  constructor(
    private readonly knex: Knex,
    private readonly appPk: number,
  ) {}

  get tableName() {
    return WhatsAppAckRepository.tableName;
  }

  /**
   * Saves the ack for a WhatsApp message, keeps the highest one
   */
  async record(messageId: string, ack: number, timestamp: Date): Promise<void> {
    const key = { app_pk: this.appPk, message_id: messageId };
    await this.knex(this.tableName)
      .insert({ ...key, ack: ack, timestamp: timestamp })
      .onConflict(['app_pk', 'message_id'])
      .ignore();
    await this.knex(this.tableName)
      .where(key)
      .where('ack', '<', ack)
      .update({ ack: ack });
  }

  /**
   * The lowest ack across the messages, null if any message has no ack yet
   */
  async minimumAck(messageIds: string[]): Promise<number | null> {
    if (messageIds.length === 0) {
      return null;
    }
    const rows = await this.knex(this.tableName)
      .where({ app_pk: this.appPk })
      .whereIn('message_id', messageIds)
      .select('ack');
    if (rows.length !== messageIds.length) {
      return null;
    }
    return Math.min(...rows.map((row) => row.ack));
  }

  async deleteOlderThan(date: Date): Promise<number> {
    return this.knex(this.tableName)
      .where('app_pk', this.appPk)
      .andWhere('timestamp', '<', date)
      .del();
  }

  /**
   * Deletes all rows for the app.
   */
  async deleteAll(): Promise<number> {
    return this.knex(this.tableName).where({ app_pk: this.appPk }).delete();
  }
}
