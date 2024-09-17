import { BufferJSON } from '@adiwajshing/baileys/lib/Utils';
import {
  convertProtobufToPlainObject,
  replaceLongsWithNumber,
} from '@waha/core/engines/noweb/utils';
import { Sqlite3KVRepository } from '@waha/core/storage/sqlite3/Sqlite3KVRepository';

/**
 * Key value repository with extra metadata
 * Add support for converting protobuf to plain object
 */
export class NOWEBSqlite3KVRepository<
  Entity,
> extends Sqlite3KVRepository<Entity> {
  protected stringify(data: any): string {
    return JSON.stringify(data, BufferJSON.replacer);
  }

  protected parse(row: any): any {
    return JSON.parse(row.data, BufferJSON.reviver);
  }

  protected dump(entity: Entity) {
    const raw = convertProtobufToPlainObject(entity);
    replaceLongsWithNumber(raw);
    return super.dump(raw);
  }
}
