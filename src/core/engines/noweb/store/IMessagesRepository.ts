export interface IMessagesRepository {
  deleteAll(): Promise<void>;

  upsert(messages: any[]): Promise<void>;

  upsertOne(message: any): Promise<void>;

  getAllByJid(jid: string, limit: number): Promise<any[]>;

  getByJidById(jid: string, id: string): Promise<any | null>;

  updateByJidAndId(jid: string, id: string, update: any): Promise<boolean>;

  deleteByJidByIds(jid: string, ids: string[]): Promise<void>;

  deleteAllByJid(jid: string): Promise<void>;
}
