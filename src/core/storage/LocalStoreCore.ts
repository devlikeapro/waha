import { safeJoin } from '@waha/utils/files';
import * as fs from 'fs/promises';
import Knex from 'knex';
import * as path from 'path';

import { LocalStore } from './LocalStore';
import { KNEX_SQLITE_CLIENT } from '@waha/core/env';

export class LocalStoreCore extends LocalStore {
  protected readonly baseDirectory: string =
    process.env.WAHA_LOCAL_STORE_BASE_DIR || './.sessions';

  private readonly namespace: string;
  private readonly sessionNamespace: string;
  private knex: Knex.Knex;

  constructor(namespace: string, sessionNamespace: string) {
    super();
    this.namespace = namespace;
    this.sessionNamespace = sessionNamespace;
  }

  async init(sessionName?: string) {
    await fs.mkdir(this.getMainDirectory(), { recursive: true });
    await fs.mkdir(this.getEngineDirectory(), { recursive: true });
    if (!this.knex) {
      this.knex = this.buildKnex();
      await this.knex.raw('PRAGMA journal_mode = WAL;');
      await this.knex.raw('PRAGMA foreign_keys = ON;');
      await this.knex.raw('PRAGMA busy_timeout = 5000;');
    }
    if (sessionName) {
      await fs.mkdir(this.getSessionDirectory(sessionName), {
        recursive: true,
      });
    }
  }

  /**
   * Get the directory where all the engines and sessions are stored
   */
  getBaseDirectory() {
    return path.resolve(this.baseDirectory);
  }

  /**
   * Get the directory where the main WAHA database (SQLite) is stored
   */
  getMainDirectory() {
    return safeJoin(this.baseDirectory, this.namespace);
  }

  /**
   * Get the directory where the engine sessions are stored
   */
  getEngineDirectory() {
    return safeJoin(this.baseDirectory, this.sessionNamespace);
  }

  getSessionDirectory(name: string): string {
    return this.getDirectoryPath(name);
  }

  getFilePath(session: string, file: string): string {
    return safeJoin(this.getSessionDirectory(session), file);
  }

  protected getDirectoryPath(name: string): string {
    return safeJoin(this.getEngineDirectory(), name);
  }

  getWAHADatabase(): Knex.Knex {
    if (!this.knex) {
      throw new Error('Knex is not initialized, call LocalStore.init() first');
    }
    return this.knex;
  }

  buildKnex(): Knex.Knex {
    const mainDir = this.getMainDirectory();
    const database = path.join(mainDir, 'waha.sqlite3');
    return Knex({
      client: KNEX_SQLITE_CLIENT,
      connection: { filename: database },
      useNullAsDefault: true,
      acquireConnectionTimeout: 120_000,
      pool: {
        min: 1,
        max: 10,
        idleTimeoutMillis: 60_000,
        createTimeoutMillis: 120_000,
        acquireTimeoutMillis: 120_000,
      },
    });
  }

  async close() {
    await this.knex.destroy();
  }
}
