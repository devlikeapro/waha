import * as fs from 'fs/promises';

import { ISessionAuthRepository } from './ISessionAuthRepository';
import { LocalStore } from './LocalStore';

export class LocalSessionAuthRepository extends ISessionAuthRepository {
  private store: LocalStore;

  constructor(store: LocalStore) {
    super();
    this.store = store;
  }

  async init(sessionName?: string) {
    await this.store.init(sessionName);
  }

  async clean(sessionName: string) {
    const folder = this.store.getSessionDirectory(sessionName);
    await fs.rm(folder, { recursive: true });
  }
}
