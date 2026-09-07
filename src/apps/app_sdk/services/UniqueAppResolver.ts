import { Injectable, NotFoundException } from '@nestjs/common';
import { AppRepository } from '@waha/apps/app_sdk/storage/AppRepository';
import { AppDB } from '@waha/apps/app_sdk/storage/types';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { SessionPlugin } from '@waha/core/abc/session.plugin';

/**
 * Resolves the single instance of a unique-per-session app ('definition.unique') by session name,
 * so app controllers can expose session-keyed routes ('api/apps/{app}/{session}/...') instead of app-id ones.
 * Uniqueness is guaranteed at write time by AppsEnabledService, so the first enabled row is the instance.
 * Must not import 'apps/registry.ts' or 'apps/definition.ts' - controllers import this resolver,
 * and the registry imports app modules (with their controllers), which would create a require cycle.
 */
@Injectable()
export class UniqueAppResolver {
  constructor(private readonly manager: SessionManager) {}

  /**
   * Enabled app row for the session; 404 if the app is missing or disabled.
   * Does not require the session to be running - persistent app data stays accessible for stopped sessions.
   */
  async getEnabledApp(sessionName: string, appName: string): Promise<AppDB> {
    const knex = this.manager.store.getWAHADatabase();
    const repository = new AppRepository(knex);
    const app = await repository.getEnabledBySessionAndApp(
      sessionName,
      appName,
    );
    if (!app) {
      throw new NotFoundException(
        `App '${appName}' is not enabled for session '${sessionName}'`,
      );
    }
    return app;
  }

  /**
   * Live plugin instance for the app, or null when the session is not running (best-effort access).
   */
  getPlugin<Plugin extends SessionPlugin<any, any>>(
    app: AppDB,
    PluginClass: abstract new (...args: any[]) => Plugin,
  ): Plugin | null {
    if (!this.manager.isRunning(app.session)) {
      return null;
    }
    let session;
    try {
      session = this.manager.getSession(app.session);
    } catch {
      return null;
    }
    return session.plugins.get(PluginClass, app.id);
  }
}
