// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');

import { fileExists } from '@waha/utils/files';

import { SessionConfig } from '../../structures/sessions.dto';
import { ISessionConfigRepository } from './ISessionConfigRepository';
import { LocalStore } from './LocalStore';

export class LocalSessionConfigRepository extends ISessionConfigRepository {
  FILENAME = '.waha.session.config.json';
  private store: LocalStore;

  constructor(store: LocalStore) {
    super();
    this.store = store;
  }

  async exists(sessionName: string): Promise<boolean> {
    const filepath = this.getFilePath(sessionName);
    const exists = await fileExists(filepath);
    if (!exists) {
      // check directory exist for empty config sessions
      const folder = this.store.getSessionDirectory(sessionName);
      return await fileExists(folder);
    }
    return true;
  }

  async get(sessionName: string): Promise<SessionConfig | null> {
    const filepath = this.getFilePath(sessionName);
    // Check file exists
    if (!(await fileExists(filepath))) {
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
    const folder = this.store.getSessionDirectory(sessionName);
    await fs.mkdir(folder, { recursive: true });
    // Save config
    const filepath = this.getFilePath(sessionName);
    const content = JSON.stringify(config || null);
    await fs.writeFile(filepath, content);
  }

  private getFilePath(sessionName): string {
    return this.store.getFilePath(sessionName, this.FILENAME);
  }

  async delete(sessionName: string): Promise<void> {
    const sessionDirectory = this.store.getSessionDirectory(sessionName);
    await fs.remove(sessionDirectory);
  }

  async getAll(): Promise<string[]> {
    await this.store.init();
    const content = await fs.readdir(this.store.getEngineDirectory(), {
      withFileTypes: true,
    });
    return content
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  }
}
