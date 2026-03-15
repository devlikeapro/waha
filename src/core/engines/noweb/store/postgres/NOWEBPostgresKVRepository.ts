import {
    convertProtobufToPlainObject,
    replaceLongsWithNumber,
} from '@waha/core/engines/noweb/utils';
import { PostgresKVRepository } from '@waha/core/storage/postgres/PostgresKVRepository';
import esm from '@waha/vendor/esm';

export class NOWEBPostgresKVRepository<
    Entity,
> extends PostgresKVRepository<Entity> {
    protected stringify(data: any): string {
        return JSON.stringify(data, esm.b.BufferJSON.replacer);
    }

    public parse(row: any): any {
        return JSON.parse(row.data, esm.b.BufferJSON.reviver);
    }

    protected dump(entity: Entity) {
        const raw = convertProtobufToPlainObject(entity);
        replaceLongsWithNumber(raw);
        return super.dump(raw);
    }
}
