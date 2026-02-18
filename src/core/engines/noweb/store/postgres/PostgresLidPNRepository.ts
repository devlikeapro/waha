import { NowebLidMapSchema } from '@waha/core/engines/noweb/store/schemas';
import { LimitOffsetParams } from '@waha/structures/pagination.dto';
import { KnexPaginator } from '@waha/utils/Paginator';

import { INowebLidPNRepository, LidToPN } from '../INowebLidPNRepository';
import { NOWEBPostgresKVRepository } from './NOWEBPostgresKVRepository';

export class LidPaginator extends KnexPaginator {
    indexes = ['id', 'pn'];
}

export class PostgresLidPNRepository
    extends NOWEBPostgresKVRepository<LidToPN>
    implements INowebLidPNRepository {
    get schema() {
        return NowebLidMapSchema;
    }

    saveLids(lids: LidToPN[]): Promise<void> {
        return this.upsertMany(lids);
    }

    getAllLids(pagination?: LimitOffsetParams): Promise<LidToPN[]> {
        return this.getAll(pagination);
    }

    getLidsCount(): Promise<number> {
        return this.getCount();
    }

    async findLidByPN(pn: string): Promise<string | null> {
        const value = await this.getBy({ pn: pn });
        return value?.id || null;
    }

    async findPNByLid(lid: string): Promise<string | null> {
        const value = await this.getBy({ id: lid });
        return value?.pn || null;
    }
}
