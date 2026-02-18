import { GroupMetadata } from '@adiwajshing/baileys/lib/Types/GroupMetadata';
import { IGroupRepository } from '@waha/core/engines/noweb/store/IGroupRepository';
import { NowebGroupsSchema } from '@waha/core/engines/noweb/store/schemas';
import { KnexPaginator } from '@waha/utils/Paginator';

import { NOWEBPostgresKVRepository } from './NOWEBPostgresKVRepository';

class Paginator extends KnexPaginator {
    indexes = ['id'];
}

export class PostgresGroupRepository
    extends NOWEBPostgresKVRepository<GroupMetadata>
    implements IGroupRepository {
    protected Paginator = Paginator;

    get schema() {
        return NowebGroupsSchema;
    }
}
