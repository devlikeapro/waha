import { LocalStore } from '@waha/core/storage/LocalStore';

import { PostgresStore } from '@waha/core/storage/PostgresStore';

import { DataStore } from '../../../abc/DataStore';
import { INowebStorage } from './INowebStorage';
import { Sqlite3Storage } from './sqlite3/Sqlite3Storage';
import { PostgresStorage } from './postgres/PostgresStorage';

export class NowebStorageFactoryCore {
  createStorage(store: DataStore, name: string): INowebStorage {
    if (store instanceof LocalStore) {
      return this.buildStorageSqlite3(store, name);
    }
    if (store instanceof PostgresStore) {
      return this.buildStoragePostgres(store, name);
    }
    throw new Error(`Unsupported store type '${store.constructor.name}'`);
  }

  private buildStorageSqlite3(store: LocalStore, name: string) {
    const filePath = store.getFilePath(name, 'store.sqlite3');
    return new Sqlite3Storage(filePath);
  }

  private buildStoragePostgres(store: PostgresStore, name: string) {
    return new PostgresStorage(store);
  }
}
