import { Contact } from '@adiwajshing/baileys';
import { NowebContactSchema } from '@waha/core/engines/noweb/store/schemas';
import { KnexPaginator } from '@waha/utils/Paginator';

import { IContactRepository } from '../IContactRepository';
import { NOWEBPostgresKVRepository } from './NOWEBPostgresKVRepository';

class ContactPaginator extends KnexPaginator {
    indexes = ['id'];
}

export class PostgresContactRepository
    extends NOWEBPostgresKVRepository<Contact>
    implements IContactRepository {
    protected Paginator = ContactPaginator;

    get schema() {
        return NowebContactSchema;
    }
}
