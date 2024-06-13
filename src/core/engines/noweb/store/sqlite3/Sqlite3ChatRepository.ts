import { Chat } from '@adiwajshing/baileys';

import { IChatRepository } from '../IChatRepository';
import { Sqlite3KVRepository } from './Sqlite3KVRepository';

export class Sqlite3ChatRepository
  extends Sqlite3KVRepository<Chat>
  implements IChatRepository
{
  getAllWithMessages(): Promise<Chat[]> {
    // Get chats with conversationTimestamp is not Null
    const query = this.select()
      .whereNotNull('conversationTimestamp')
      .orderBy('conversationTimestamp', 'desc');
    return this.all(query);
  }
}
