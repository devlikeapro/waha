import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

import { SessionConfig } from '../structures/sessions.dto';
import {
  LocalSessionStorage,
  SessionConfigRepository,
} from './abc/storage.abc';

class LocalSessionConfigRepository extends SessionConfigRepository {
  FILENAME = '.waha.session.config.json';

  constructor(private storage: LocalSessionStorage) {
    super();
  }

  async get(sessionName: string): Promise<SessionConfig | null> {
    const filepath = this.getFilePath(sessionName);
    // Check file exists
    try {
      await fs.access(filepath, fs.constants.F_OK);
    } catch (error) {
      return null;
    }

    // Try to load config
    let content;
    try {
      content = await fs.readFile(filepath, 'utf-8');
    } catch (error) {
      return null;
    }

    return JSON.parse(content);
  }

  async save(sessionName: string, config: SessionConfig | null) {
    // Create folder if not exist
    const folder = this.storage.getFolderPath(sessionName);
    await fs.mkdir(folder, { recursive: true });
    // Save config
    const filepath = this.getFilePath(sessionName);
    const content = JSON.stringify(config || null);
    await fs.writeFile(filepath, content);
  }

  private getFilePath(sessionName): string {
    const folder = this.storage.getFolderPath(sessionName);
    return path.join(folder, this.FILENAME);
  }
}

export class SessionStorageCore extends LocalSessionStorage {
  public sessionsFolder: string;

  constructor(engine: string) {
    super(engine);
    this.sessionsFolder = path.join(os.tmpdir(), 'waha-sessions');
  }

  get engineFolder() {
    return path.join(this.sessionsFolder, this.engine);
  }

  async init(sessionName?: string) {
    const folder = sessionName
      ? this.getFolderPath(sessionName)
      : this.engineFolder;
    await fs.mkdir(folder, { recursive: true });
  }

  getFolderPath(name: string): string {
    const suffix = crypto.createHash('md5').update(name).digest('hex');
    return path.join(this.engineFolder, `${name}-${suffix}`);
  }

  async clean(sessionName: string) {
    const folder = this.getFolderPath(sessionName);
    await fs.rm(folder, { recursive: true });
  }

  async getAll(): Promise<string[]> {
    await this.init();
    const content = await fs.readdir(this.engineFolder, {
      withFileTypes: true,
    });
    return content
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  }

  get configRepository(): LocalSessionConfigRepository {
    return new LocalSessionConfigRepository(this);
  }
}
