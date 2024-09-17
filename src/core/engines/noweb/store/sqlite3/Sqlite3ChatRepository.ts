import { Chat } from '@adiwajshing/baileys';

import { IChatRepository } from '../IChatRepository';
import { NOWEBSqlite3KVRepository } from './NOWEBSqlite3KVRepository';

export class Sqlite3ChatRepository
  extends NOWEBSqlite3KVRepository<Chat>
  implements IChatRepository
{
  async getAllWithMessages(limit?: number, offset?: number): Promise<Chat[]> {
    // Get chats with conversationTimestamp is not Null
    let query = this.select()
      .whereNotNull('conversationTimestamp')
      .orderBy('conversationTimestamp', 'desc');
    if (limit != null) {
      query = query.limit(limit);
    }
    if (offset != null) {
      query = query.offset(offset);
    }
    return await this.all(query);
  }
}
