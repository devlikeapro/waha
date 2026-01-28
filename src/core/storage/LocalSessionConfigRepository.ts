// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');

import { fileExists } from '@waha/utils/files';

import { SessionConfig } from '../../structures/sessions.dto';
import { ISessionConfigRepository } from './ISessionConfigRepository';
import { LocalStore } from './LocalStore';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const writeFileAtomic = require('write-file-atomic');

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

  async getConfig(sessionName: string): Promise<SessionConfig | null> {
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

  async getConfigBySessions(
    sessionNames: string[],
  ): Promise<Map<string, SessionConfig | null>> {
    const result = new Map<string, SessionConfig | null>();
    const uniqueNames = Array.from(new Set(sessionNames));
    if (uniqueNames.length === 0) {
      return result;
    }
    const items = await Promise.all(
      uniqueNames.map(async (sessionName) => ({
        sessionName,
        config: await this.getConfig(sessionName),
      })),
    );
    for (const item of items) {
      result.set(item.sessionName, item.config ?? null);
    }
    return result;
  }

  async saveConfig(sessionName: string, config: SessionConfig) {
    // Create a folder if not exist
    const folder = this.store.getSessionDirectory(sessionName);
    await fs.mkdir(folder, { recursive: true });
    // Save config
    const filepath = this.getFilePath(sessionName);
    const content = JSON.stringify(config || {});
    await writeFileAtomic(filepath, content);
  }

  private getFilePath(sessionName): string {
    return this.store.getFilePath(sessionName, this.FILENAME);
  }

  async deleteConfig(sessionName: string): Promise<void> {
    const sessionDirectory = this.store.getSessionDirectory(sessionName);
    await fs.remove(sessionDirectory);
  }

  async getAllConfigs(): Promise<string[]> {
    await this.store.init();
    const content = await fs.readdir(this.store.getEngineDirectory(), {
      withFileTypes: true,
    });
    return content
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  }

  async init() {
    return;
  }
}
