import { Knex } from 'knex';

import { App } from '../dto/app.dto';
import { AppDB } from './types';

export class AppRepository {
  static tableName = 'apps';

  constructor(private readonly knex: Knex) {}

  get tableName() {
    return AppRepository.tableName;
  }

  /**
   * Saves an app to the database
   */
  async save(app: Omit<App, 'pk'>): Promise<AppDB> {
    const appToSave: any = { ...app };
    if (appToSave.config && typeof appToSave.config === 'object') {
      appToSave.config = JSON.stringify(appToSave.config);
    }
    const [pk] = await this.knex(this.tableName)
      .insert(appToSave)
      .returning('pk');
    return { ...app, pk: pk };
  }

  private deserialize(app: AppDB): AppDB {
    const parsedConfig =
      typeof app.config === 'string' ? JSON.parse(app.config) : app.config;

    // Ensure 'enabled' is boolean (SQLite may return 0/1)
    let enabled: boolean;
    switch (app.enabled as any) {
      case undefined:
      case true:
      case 1:
      case '1':
        enabled = true;
        break;
      case false:
      case 0:
        enabled = false;
        break;
      default:
        enabled = true;
    }

    return { ...(app as any), enabled: enabled, config: parsedConfig } as AppDB;
  }

  private serialize<T extends Partial<App>>(app: T): T {
    const appCopy = { ...app };
    if (appCopy.config && typeof appCopy.config === 'object') {
      appCopy.config = JSON.stringify(appCopy.config);
    }
    return appCopy;
  }

  /**
   * Gets an app by its id
   */
  async getById(id: string): Promise<AppDB | null> {
    const app = await this.knex(this.tableName).where('id', id).first();
    if (!app) {
      return null;
    }
    return this.deserialize(app);
  }

  /**
   * Gets an enabled app by id, or null if not found or disabled.
   */
  async findEnabledAppById(id: string): Promise<AppDB | null> {
    const app = await this.knex(this.tableName)
      .where('id', id)
      .andWhere('enabled', true)
      .first();
    if (!app) {
      return null;
    }
    return this.deserialize(app);
  }

  /**
   * Gets the enabled app of the given type for a session.
   * Intended for unique-per-session apps - returns the first match.
   */
  async getEnabledBySessionAndApp(
    session: string,
    appName: string,
  ): Promise<AppDB | null> {
    const app = await this.knex(this.tableName)
      .where('session', session)
      .andWhere('app', appName)
      .andWhere('enabled', true)
      .first();
    if (!app) {
      return null;
    }
    return this.deserialize(app);
  }

  /**
   * Gets all apps
   */
  async getAllBySession(session: string): Promise<AppDB[]> {
    return this.knex(this.tableName)
      .select('*')
      .where('session', session)
      .orderBy('id', 'asc')
      .then((apps) => apps.map((app) => this.deserialize(app)));
  }

  /**
   * Gets only enabled apps for a session.
   */
  async getEnabledBySession(session: string): Promise<AppDB[]> {
    return this.knex(this.tableName)
      .select('*')
      .where('session', session)
      .andWhere('enabled', true)
      .orderBy('id', 'asc')
      .then((apps) => apps.map((app) => this.deserialize(app)));
  }

  /**
   * Updates an app
   */
  async update(id: string, app: Partial<Omit<App, 'id'>>): Promise<void> {
    const appToUpdate: any = this.serialize(app);
    if (appToUpdate.enabled === undefined) {
      delete appToUpdate.enabled; // keep current value
    }
    await this.knex(this.tableName).where('id', id).update(appToUpdate);
  }

  /**
   * Deletes an app
   */
  async delete(id: string): Promise<void> {
    await this.knex(this.tableName).where('id', id).delete();
  }

  /**
   * Deletes all apps for a session
   */
  async deleteBySession(session: string): Promise<void> {
    await this.knex(this.tableName).where('session', session).delete();
  }
}
