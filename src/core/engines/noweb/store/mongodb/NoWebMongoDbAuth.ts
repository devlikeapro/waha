import esm from '@waha/vendor/esm';
import { Collection, Db, Document } from 'mongodb';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncLock = require('async-lock');

function mongoKey(id: string) {
  // Replace . to -
  return id.replace(/\./g, '-');
}

type AuthDocument = Document & {
  key?: string;
  data?: any;
  type?: string;
  [key: string]: any;
};

export class NoWebMongoDbAuth {
  private collection: Collection<AuthDocument>;
  // Keep legacy aggregated document reference for gradual migration.
  private document: AuthDocument | null;
  private creds: any;

  private db: Db;
  private lock: any;

  constructor(db: Db) {
    this.db = db;
    this.collection = this.db.collection('auth');
    this.lock = new AsyncLock({
      timeout: 5_000,
      maxPending: Infinity,
      maxExecutionTime: 60_000,
    });
    this.document = null;
  }

  async init() {
    await this.ensureIndexes();
    this.document = await this.loadLegacyDocument();
    const creds = await this.readData('creds');
    // @ts-ignore:next-line
    this.creds = creds || (0, esm.b.initAuthCreds)();
  }

  private async ensureIndexes() {
    // Separate docs are keyed by "key", keep collection indexable for new format.
    await this.collection.createIndex({ key: 1 }, { unique: true });
  }

  private serialize(data: any) {
    return JSON.parse(JSON.stringify(data, esm.b.BufferJSON.replacer));
  }

  private deserialize(data: any) {
    if (data === null || data === undefined) {
      return null;
    }
    const json = JSON.stringify(data);
    if (!json) {
      return null;
    }
    return JSON.parse(json, esm.b.BufferJSON.reviver);
  }

  private async loadLegacyDocument(): Promise<AuthDocument | null> {
    // The old format stored everything in one doc; keep it for reads and migrate lazily.
    return this.collection.findOne({ data: { $exists: false } });
  }

  private async readFromLegacy(field: string, key: string) {
    if (!this.document) {
      return null;
    }
    if (!(key in this.document)) {
      return null;
    }

    try {
      const value = this.deserialize(this.document[key]);
      if (value === null || value === undefined) {
        return null;
      }
      await this.writeData(value, field);
      return value;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async writeData(data: any, field: string) {
    const key = mongoKey(field);
    await this.lock.acquire(key, async () => {
      await this.collection.updateOne(
        { key: key },
        {
          $set: {
            key: key,
            data: this.serialize(data),
            type: 'kv',
          },
        },
        { upsert: true },
      );
    });
  }

  async readData(field: string) {
    const key = mongoKey(field);
    try {
      const document = await this.collection.findOne({ key: key });
      if (document && 'data' in document) {
        return this.deserialize(document.data);
      }
    } catch (error) {
      console.error(error);
    }

    return this.readFromLegacy(field, key);
  }

  async removeData(field: string) {
    const key = mongoKey(field);
    try {
      await this.collection.deleteOne({ key: key });
    } catch (error) {
      console.error(error);
    }
  }

  isMyMainSession(id: string) {
    // Decode the jid
    const { user: meId } = esm.b.jidDecode(this.creds?.me?.id);
    return id == `${meId}.0`;
  }

  methods() {
    const creds = this.creds;
    return {
      state: {
        creds: creds,
        keys: {
          get: async (type, ids) => {
            const data = {};
            await Promise.all(
              ids.map(async (id) => {
                // Always reset my session and setup new session
                if (type === 'session' && this.isMyMainSession(id)) {
                  return;
                }
                let value = await this.readData(`${type}-${id}`);
                if (type === 'app-state-sync-key' && value) {
                  value =
                    esm.b.WAProto.Message.AppStateSyncKeyData.fromObject(value);
                }
                data[id] = value;
              }),
            );
            return data;
          },
          set: async (data) => {
            const tasks = [];
            for (const category of Object.keys(data)) {
              for (const id of Object.keys(data[category])) {
                const value = data[category][id];
                const key = `${category}-${id}`;
                const hasValue = !!value || value?.length === 0;
                if (hasValue) {
                  tasks.push(this.writeData(value, key));
                } else {
                  // Do not remove any keys for now
                  // Avoid removing pre-keys
                  // tasks.push(this.removeData(key));
                }
              }
            }
            await Promise.all(tasks);
          },
        },
      },
      saveCreds: () => {
        return this.writeData(this.creds, 'creds');
      },
      close: async () => {
        return;
      },
    };
  }
}
