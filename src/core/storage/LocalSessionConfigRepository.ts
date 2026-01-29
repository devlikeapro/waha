import * as fs from 'fs/promises';
import * as path from 'path';
import { SessionConfig } from '../../structures/sessions.dto';
import { ISessionConfigRepository } from './ISessionConfigRepository';
import { LocalStoreCore } from './LocalStoreCore';

export class LocalSessionConfigRepository implements ISessionConfigRepository {
  constructor(private store: LocalStoreCore) {}

  private getFilePath(sessionName: string): string {
    return path.join(this.store.getSessionDirectory(sessionName), 'config.json');
  }

  async init(): Promise<void> {
    await this.store.init();
  }

  async saveConfig(sessionName: string, config: SessionConfig): Promise<void> {
    await this.store.init(sessionName);
    const filepath = this.getFilePath(sessionName);
    if (!config) {
        // If config is null/undefined, maybe delete it?
        // Or write empty object? upsert logic says config?
        // Usually upsert means "save this".
        // But if config is undefined, we might just skipping?
        // Let's assume we save it if provided.
        return;
    }
    await fs.writeFile(filepath, JSON.stringify(config, null, 2));
  }

  async getConfig(sessionName: string): Promise<SessionConfig | null> {
    const filepath = this.getFilePath(sessionName);
    try {
      const data = await fs.readFile(filepath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }

  async deleteConfig(sessionName: string): Promise<void> {
    const filepath = this.getFilePath(sessionName);
    try {
      await fs.unlink(filepath);
    } catch (e) {
      // Ignore
    }
  }

  async exists(sessionName: string): Promise<boolean> {
    // We check if config file exists
    const filepath = this.getFilePath(sessionName);
    try {
        await fs.access(filepath);
        return true;
    } catch {
        return false;
    }
  }

  async getAllConfigs(): Promise<string[]> {
    const engineDir = this.store.getEngineDirectory();
    try {
      const files = await fs.readdir(engineDir, { withFileTypes: true });
      const sessions = [];
      for (const file of files) {
        if (file.isDirectory()) {
          const hasConfig = await this.exists(file.name);
          if (hasConfig) {
            sessions.push(file.name);
          }
        }
      }
      return sessions;
    } catch (e) {
      return [];
    }
  }

  async getConfigBySessions(
    sessionNames: string[],
  ): Promise<Map<string, SessionConfig | null>> {
    const map = new Map<string, SessionConfig | null>();
    for (const name of sessionNames) {
      const config = await this.getConfig(name);
      map.set(name, config);
    }
    return map;
  }
}
