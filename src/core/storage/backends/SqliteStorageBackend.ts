import { LocalStoreCore } from '@waha/core/storage/LocalStoreCore';
import { IStorageBackend } from './IStorageBackend';

/**
 * SQLite storage backend for WAHA.
 * Extends LocalStoreCore to implement IStorageBackend.
 */
export class SqliteStorageBackend
  extends LocalStoreCore
  implements IStorageBackend
{
  readonly type = 'sqlite' as const;

  constructor(namespace: string, sessionNamespace: string) {
    super(namespace, sessionNamespace);
  }

  async isHealthy(): Promise<boolean> {
    try {
      const knex = this.getWAHADatabase();
      await knex.raw('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
