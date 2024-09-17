import { IMessagesRepository } from '../IMessagesRepository';
import { NOWEBSqlite3KVRepository } from './NOWEBSqlite3KVRepository';

export class Sqlite3MessagesRepository
  extends NOWEBSqlite3KVRepository<any>
  implements IMessagesRepository
{
  upsert(messages: any[]): Promise<void> {
    return this.upsertMany(messages);
  }

  getAllByJid(jid: string, limit: number): Promise<any[]> {
    const query = this.select()
      .where({ jid: jid })
      .limit(limit)
      .orderBy('messageTimestamp', 'DESC');
    return this.all(query);
  }

  async getByJidById(jid: string, id: string): Promise<any> {
    return this.getBy({ jid: jid, id: id });
  }

  async updateByJidAndId(
    jid: string,
    id: string,
    update: any,
  ): Promise<boolean> {
    const entity = await this.getByJidById(jid, id);
    if (!entity) {
      return false;
    }
    Object.assign(entity, update);
    await this.upsertOne(entity);
  }

  async deleteByJidByIds(jid: string, ids: string[]): Promise<void> {
    const query = `DELETE
                   FROM ${this.table}
                   WHERE jid = ?
                     AND id IN (${ids.map(() => '?').join(', ')})`;
    this.db.prepare(query).run([jid, ...ids]);
  }

  deleteAllByJid(jid: string): Promise<void> {
    return this.deleteBy({ jid: jid });
  }
}
