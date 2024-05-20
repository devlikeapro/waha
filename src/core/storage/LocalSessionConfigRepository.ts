import * as fs from 'fs/promises';
import * as path from 'path';

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

  private async fileExists(filepath: string) {
    try {
      await fs.access(filepath, fs.constants.F_OK);
    } catch (error) {
      return false;
    }
    return true;
  }

  async get(sessionName: string): Promise<SessionConfig | null> {
    const filepath = this.getFilePath(sessionName);
    // Check file exists
    if (!(await this.fileExists(filepath))) {
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
    const filepath = this.getFilePath(sessionName);
    if (!(await this.fileExists(filepath))) {
      return;
    }
    await fs.unlink(filepath);
  }
}
