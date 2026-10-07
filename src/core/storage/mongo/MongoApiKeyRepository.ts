import {
  ApiKey,
  IApiKeyRepository,
} from '@waha/core/storage/IApiKeyRepository';
import { Collection } from 'mongodb';

import { MongoStore } from './MongoStore';

export class MongoApiKeyRepository implements IApiKeyRepository {
  private collection: Collection<ApiKey>;

  constructor(store: MongoStore) {
    this.collection = store.getMainDb().collection('api_key');
  }

  async init(): Promise<void> {
    await this.collection.createIndex({ id: 1 }, { unique: true });
    await this.collection.createIndex({ key: 1 }, { unique: true });
    await this.collection.createIndex({ session: 1 });
  }

  async list(): Promise<ApiKey[]> {
    const keys = await this.collection.find().toArray();
    return keys.map((key) => this.stripId(key));
  }

  async upsert(key: ApiKey): Promise<ApiKey> {
    await this.collection.replaceOne({ id: key.id }, key, { upsert: true });
    return key;
  }

  async getActiveByKey(key: string): Promise<ApiKey | null> {
    if (typeof key !== 'string') {
      return null;
    }
    const data = await this.collection.findOne({ key: key, isActive: true });
    return data ? this.stripId(data) : null;
  }

  async getById(id: string): Promise<ApiKey | null> {
    const data = await this.collection.findOne({ id: id });
    return data ? this.stripId(data) : null;
  }

  async getByKey(key: string): Promise<ApiKey | null> {
    if (typeof key !== 'string') {
      return null;
    }
    const data = await this.collection.findOne({ key: key });
    return data ? this.stripId(data) : null;
  }

  async deleteById(id: string): Promise<void> {
    await this.collection.deleteOne({ id: id });
  }

  async deleteBySession(session: string): Promise<void> {
    await this.collection.deleteMany({ session: session });
  }

  private stripId(key: ApiKey): ApiKey {
    if ('_id' in key) {
      delete (key as { _id?: unknown })._id;
    }
    return key;
  }
}
