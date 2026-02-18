import { Label } from '@adiwajshing/baileys/lib/Types/Label';
import { ILabelsRepository } from '@waha/core/engines/noweb/store/ILabelsRepository';
import { NowebLabelsSchema } from '@waha/core/engines/noweb/store/schemas';

import { NOWEBPostgresKVRepository } from './NOWEBPostgresKVRepository';

export class PostgresLabelsRepository
    extends NOWEBPostgresKVRepository<Label>
    implements ILabelsRepository {
    get schema() {
        return NowebLabelsSchema;
    }
}
