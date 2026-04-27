import { Sqlite3SchemaValidation } from '@waha/core/engines/noweb/store/sqlite3/Sqlite3SchemaValidation';
import {
  ApiKey,
  IApiKeyRepository,
} from '@waha/core/storage/IApiKeyRepository';
import { LocalStore } from '@waha/core/storage/LocalStore';
import {
  SQLApiKeyMigrations,
  SQLApiKeySchema,
} from '@waha/core/storage/sql/schemas';
import { Sqlite3KVRepository } from '@waha/core/storage/sqlite3/Sqlite3KVRepository';

export class CoreApiKeyRepository extends Sqlite3KVRepository<ApiKey>
  implements IApiKeyRepository {
  get schema() {
    return SQLApiKeySchema;
  }

  get migrations() {
    return SQLApiKeyMigrations;
  }

  get metadata(): Map<string, (entity: ApiKey) => any> {
    return new Map<string, (entity: ApiKey) => any>([
      ['isActive', (entity) => (entity.isActive ? 1 : 0)],
      ['session', (entity) => entity.session ?? null],
    ]);
  }

  constructor(store: LocalStore) {
    const knex = store.getWAHADatabase();
    super(knex);
  }

  list(): Promise<ApiKey[]> {
    return this.getAll();
  }

  async upsert(key: ApiKey): Promise<ApiKey> {
    await this.upsertOne(key);
    return key;
  }

  getActiveByKey(key: string): Promise<ApiKey | null> {
    return this.getBy({ key: key, isActive: 1 });
  }

  getById(id: string): Promise<ApiKey | null> {
    return super.getById(id);
  }

  getByKey(key: string): Promise<ApiKey | null> {
    return this.getBy({ key: key });
  }

  deleteById(id: string): Promise<void> {
    return super.deleteById(id);
  }

  deleteBySession(session: string): Promise<void> {
    return this.deleteBy({ session: session });
  }

  public parse(row: any): ApiKey {
    const apiKey = super.parse(row) as ApiKey;
    return {
      id: apiKey.id,
      key: apiKey.key,
      isActive: apiKey.isActive ?? Boolean(row.isActive),
      isAdmin: apiKey.isAdmin ?? false,
      session: apiKey.session ?? row.session ?? null,
      rules: apiKey.rules ?? null,
    };
  }

  protected async validateSchema() {
    const validation = new Sqlite3SchemaValidation(this.schema, this.knex);
    await validation.validate();
  }
}
