import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

import { LocalStore } from './LocalStore';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Database = require('better-sqlite3');

export class LocalStoreCore extends LocalStore {
  protected readonly baseDirectory: string = path.join(
    os.tmpdir(),
    'waha-sessions',
  );

  private readonly engine: string;
  private db: any;

  constructor(engine: string) {
    super();
    this.engine = engine;
  }

  async init(sessionName?: string) {
    await fs.mkdir(this.getEngineDirectory(), { recursive: true });
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
    return path.join(this.baseDirectory);
  }

  /**
   * Get the directory where the engine sessions are stored
   */
  getEngineDirectory() {
    return path.join(this.baseDirectory, this.engine);
  }

  getSessionDirectory(name: string): string {
    return this.getDirectoryPath(name);
  }

  getFilePath(session: string, file: string): string {
    return path.join(this.getSessionDirectory(session), file);
  }

  protected getDirectoryPath(name: string): string {
    const suffix = crypto.createHash('md5').update(name).digest('hex');
    return path.join(this.getEngineDirectory(), `${name}-${suffix}`);
  }

  getWAHADatabase(): any {
    if (!this.db) {
      const engineDir = this.getEngineDirectory();
      const database = path.join(engineDir, 'waha.sqlite3');
      this.db = new Database(database);
    }
    return this.db;
  }

  async close() {
    this.db?.close();
  }
}
