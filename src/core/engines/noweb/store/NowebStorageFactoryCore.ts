import { DataStore } from '../../../abc/DataStore';
import { INowebStorage } from './INowebStorage';
import { Sqlite3Storage } from './sqlite3/Sqlite3Storage';

export class NowebStorageFactoryCore {
  createStorage(store: DataStore, name: string): INowebStorage {
    return new Sqlite3Storage(':memory:');
  }
}
