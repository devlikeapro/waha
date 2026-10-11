import esm from '@waha/vendor/esm';
import { PsqlNowebAuthRepository } from '@waha/core/engines/noweb/store/psql/PsqlAuthRepository';
import Knex from 'knex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncLock = require('async-lock');

export class NoWebPsqlAuth {
  private creds: any;
  private repository: PsqlNowebAuthRepository;
  private lock: any;

  constructor(private knex: Knex.Knex) {
    this.repository = new PsqlNowebAuthRepository(knex);
    this.lock = new AsyncLock({
      timeout: 5_000,
      maxPending: Infinity,
      maxExecutionTime: 60_000,
    });
  }

  async init() {
    await this.repository.init();
    this.creds = await this.repository.getCreds();
    if (!this.creds) {
      this.creds = esm.b.initAuthCreds();
    }
  }

  methods() {
    return {
      state: {
        creds: this.creds,
        keys: {
          get: async (type, ids) => {
            const data = {};
            await Promise.all(
              ids.map(async (id) => {
                // Always reset my session and setup new session
                if (type === 'session' && this.isMyMainSession(id)) {
                  return;
                }
                let value = await this.repository.getCategory(type, id);
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
                const hasValue = !!value || value?.length === 0;
                if (hasValue) {
                  tasks.push(this.repository.saveCategory(category, id, value));
                } else {
                  // Do not remove any keys for now
                  // Avoid removing pre-keys
                  // tasks.push(this.removeData(key));
                }
              }
            }
            await Promise.all(tasks);
            return;
          },
        },
      },
      saveCreds: () => {
        return this.lock.acquire('creds', async () => {
          await this.repository.saveCreds(this.creds);
        });
      },
      close: async () => {
        return await this.knex.destroy();
      },
    };
  }

  isMyMainSession(id: string) {
    // Decode the jid
    const { user: meId } = esm.b.jidDecode(this.creds?.me?.id);
    return id == `${meId}.0`;
  }
}
