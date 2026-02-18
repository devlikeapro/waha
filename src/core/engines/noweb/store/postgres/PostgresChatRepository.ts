import { Chat } from '@adiwajshing/baileys';
import { NowebChatSchema } from '@waha/core/engines/noweb/store/schemas';
import { SqlChatMethods } from '@waha/core/engines/noweb/store/sql/SqlChatMethods';
import { OverviewFilter } from '@waha/structures/chats.dto';
import { PaginationParams } from '@waha/structures/pagination.dto';
import { KnexPaginator } from '@waha/utils/Paginator';

import { IChatRepository } from '../IChatRepository';
import { NOWEBPostgresKVRepository } from './NOWEBPostgresKVRepository';

class ChatPaginator extends KnexPaginator {
    indexes = ['id', 'conversationTimestamp'];
}

export class PostgresChatRepository
    extends NOWEBPostgresKVRepository<Chat>
    implements IChatRepository {
    protected Paginator = ChatPaginator;

    get schema() {
        return NowebChatSchema;
    }

    get methods() {
        return new SqlChatMethods(this);
    }

    getAllWithMessages(
        pagination: PaginationParams,
        broadcast: boolean,
        filter?: OverviewFilter,
    ): Promise<Chat[]> {
        return this.methods.getAllWithMessages(pagination, broadcast, filter);
    }
}
