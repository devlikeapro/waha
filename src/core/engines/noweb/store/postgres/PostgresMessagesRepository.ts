import { NowebMessagesMetadata } from '@waha/core/engines/noweb/store/metadata';
import { NowebMessagesSchema } from '@waha/core/engines/noweb/store/schemas';
import { SqlMessagesMethods } from '@waha/core/engines/noweb/store/sql/SqlMessagesMethods';
import { GetChatMessagesFilter } from '@waha/structures/chats.dto';
import { PaginationParams } from '@waha/structures/pagination.dto';

import { IMessagesRepository } from '../IMessagesRepository';
import { NOWEBPostgresKVRepository } from './NOWEBPostgresKVRepository';

export class PostgresMessagesRepository
    extends NOWEBPostgresKVRepository<any>
    implements IMessagesRepository {
    get schema() {
        return NowebMessagesSchema;
    }

    get methods() {
        return new SqlMessagesMethods(this);
    }

    get metadata() {
        return NowebMessagesMetadata;
    }

    upsert(messages: any[]): Promise<void> {
        return this.methods.upsert(messages);
    }

    async getAllByJid(
        jid: string,
        filter: GetChatMessagesFilter,
        pagination: PaginationParams,
    ): Promise<any[]> {
        return this.methods.getAllByJid(jid, filter, pagination);
    }

    async getByJidById(jid: string, id: string): Promise<any> {
        return this.methods.getByJidById(jid, id);
    }

    async updateByJidAndId(
        jid: string,
        id: string,
        update: any,
    ): Promise<boolean> {
        return this.methods.updateByJidAndId(jid, id, update);
    }

    async deleteByJidByIds(jid: string, ids: string[]): Promise<void> {
        return this.methods.deleteByJidByIds(jid, ids);
    }

    deleteAllByJid(jid: string): Promise<void> {
        return this.methods.deleteAllByJid(jid);
    }
}
