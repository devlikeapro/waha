import { UnprocessableEntityException } from '@nestjs/common';
import { DOCS_URL } from '@waha/core/exceptions';
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
    throw new UnprocessableEntityException(
      `API key management is not available in this edition. See ${DOCS_URL}`,
    );
  }

  async deleteById(id: string): Promise<void> {
    void id;
    throw new UnprocessableEntityException(
      `API key management is not available in this edition. See ${DOCS_URL}`,
    );
  }

  async deleteBySession(session: string): Promise<void> {
    void session;
    throw new UnprocessableEntityException(
      `API key management is not available in this edition. See ${DOCS_URL}`,
    );
  }
}
