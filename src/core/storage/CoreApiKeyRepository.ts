import { AvailableInPlusVersionAll } from '@waha/core/exceptions';
import {
  ApiKey,
  IApiKeyRepository,
} from '@waha/core/storage/IApiKeyRepository';

export class CoreApiKeyRepository implements IApiKeyRepository {
  async init() {
    return;
  }

  list(): Promise<ApiKey[]> {
    return Promise.resolve([]);
  }

  getActiveByKey(key: string): Promise<ApiKey | null> {
    void key;
    return Promise.resolve(null);
  }

  getById(id: string): Promise<ApiKey | null> {
    void id;
    return Promise.resolve(null);
  }

  getByKey(key: string): Promise<ApiKey | null> {
    void key;
    return Promise.resolve(null);
  }

  async upsert(key: ApiKey): Promise<ApiKey> {
    void key;
    throw new AvailableInPlusVersionAll('API key management');
  }

  async deleteById(id: string): Promise<void> {
    void id;
    throw new AvailableInPlusVersionAll('API key management');
  }

  async deleteBySession(session: string): Promise<void> {
    void session;
    throw new AvailableInPlusVersionAll('API key management');
  }
}
