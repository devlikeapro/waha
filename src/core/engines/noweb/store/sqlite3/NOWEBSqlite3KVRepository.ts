import {
  convertProtobufToPlainObject,
  replaceLongsWithNumber,
} from '@waha/core/engines/noweb/utils';
import { Sqlite3KVRepository } from '@waha/core/storage/sqlite3/Sqlite3KVRepository';
import esm from '@waha/vendor/esm';

/**
 * Key value repository with extra metadata
 * Add support for converting protobuf to plain object
 */
export class NOWEBSqlite3KVRepository<
  Entity,
> extends Sqlite3KVRepository<Entity> {
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
