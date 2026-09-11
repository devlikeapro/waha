import { Knex } from 'knex';

export class MessageAckRepository {
  private readonly table = 'app_chatwoot_message_acks';

  constructor(
    private readonly knex: Knex,
    private readonly appPk: number,
  ) {}

  async record(messageId: string, ack: number, timestamp: Date): Promise<void> {
    const key = { app_pk: this.appPk, message_id: messageId };
    // An ACK can arrive before saveMapping finishes. Keep it independently.
    await this.knex(this.table)
      .insert({ ...key, ack: ack, timestamp: timestamp })
      .onConflict(['app_pk', 'message_id'])
      .ignore();
    await this.knex(this.table)
      .where(key)
      .where('ack', '<', ack)
      .update({ ack: ack });
  }

  async minimumAck(messageIds: string[]): Promise<number> {
    const rows = await this.knex(this.table)
      .where({ app_pk: this.appPk })
      .whereIn('message_id', messageIds)
      .select('ack');
    if (rows.length !== messageIds.length || rows.length === 0) {
      return 0;
    }
    return Math.min(...rows.map((row) => row.ack));
  }

  async cleanup(removeAfter: Date): Promise<number> {
    return this.knex(this.table)
      .where({ app_pk: this.appPk })
      .where('timestamp', '<', removeAfter)
      .del();
  }
}
