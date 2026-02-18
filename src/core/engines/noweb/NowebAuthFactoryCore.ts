import { DataStore } from '../../abc/DataStore';
import { LocalStore } from '../../storage/LocalStore';
import { PostgresStore } from '../../storage/PostgresStore'; // Import
import { useMultiFileAuthState } from './useMultiFileAuthState';
import { usePostgresAuthState } from './store/postgres/usePostgresAuthState'; // Import

export class NowebAuthFactoryCore {
  buildAuth(store: DataStore, name: string) {
    if (store instanceof LocalStore) return this.buildLocalAuth(store, name);
    if (store instanceof PostgresStore) return this.buildPostgresAuth(store, name);
    throw new Error(`Unsupported store type '${store.constructor.name}'`);
  }

  protected async buildLocalAuth(store: LocalStore, name: string) {
    await store.init(name);
    const authFolder = store.getSessionDirectory(name);
    const { state, saveCreds, close } = await useMultiFileAuthState(authFolder);
    return { state, saveCreds, close };
  }

  protected async buildPostgresAuth(store: PostgresStore, name: string) {
    await store.init(name);
    const knex = store.getWAHADatabase();
    const { state, saveCreds, close } = await usePostgresAuthState(knex, name);
    return { state, saveCreds, close };
  }
}
