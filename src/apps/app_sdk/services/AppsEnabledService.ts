import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { migrate } from '@waha/apps/app_sdk/migrations';
import { IAppService } from '@waha/apps/app_sdk/services/IAppService';
import { IAppsService } from '@waha/apps/app_sdk/services/IAppsService';
import { DataStore } from '@waha/core/abc/DataStore';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { generatePrefixedId } from '@waha/utils/ids';
import { Knex } from 'knex';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { App } from '../dto/app.dto';
import { AppRepository } from '../storage/AppRepository';
import { AppRuntimeConfig } from '@waha/apps/app_sdk/apps/AppRuntime';
import {
  findDuplicateUniqueApp,
  isUniqueApp,
} from '@waha/apps/app_sdk/apps/definition';
import { GetApp } from '@waha/apps/app_sdk/apps/registry';

export class AppDisableError extends UnprocessableEntityException {
  constructor(app: string) {
    super(
      `App '${app}' is disabled in runtime configuration - adjust WAHA_APPS_ON / WAHA_APPS_OFF environment variables to enable it.`,
    );
  }
}

export class AppUniquePerSessionError extends UnprocessableEntityException {
  constructor(app: string, session: string, existingAppId: string) {
    super(
      `Only one '${app}' app is allowed per session. ` +
        `Session '${session}' already has a '${app}' app with ID '${existingAppId}'.`,
    );
  }
}

@Injectable()
export class AppsEnabledService implements IAppsService {
  constructor(
    @InjectPinoLogger('AppsService')
    protected logger: PinoLogger,
    private readonly moduleRef: ModuleRef,
  ) {}

  async list(manager: SessionManager, session: string): Promise<App[]> {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const apps = await repo.getAllBySession(session);
    for (const app of apps) {
      delete app.pk;
      const service = this.getAppService(app);
      await service?.enrich(manager, app);
    }
    return apps;
  }

  async create(manager: SessionManager, app: App): Promise<App> {
    await this.checkSessionExists(manager, app.session);
    app.id = app.id || generatePrefixedId('app');

    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);

    const existingApp = await repo.getById(app.id);
    if (existingApp) {
      throw new Error(`App with ID '${app.id}' already exists.`);
    }

    // Validate only one instance of a unique app per session
    if (isUniqueApp(app.app)) {
      const existingApps = await repo.getAllBySession(app.session);
      const duplicateApp = existingApps.find(
        (existingApp) => existingApp.app === app.app,
      );
      if (duplicateApp) {
        throw new AppUniquePerSessionError(
          app.app,
          app.session,
          duplicateApp.id,
        );
      }
    }

    const service = this.getAppService(app);
    if (app.enabled && !service && !AppRuntimeConfig.HasApp(app.app)) {
      throw new AppDisableError(app.app);
    }
    service?.validate(app);
    // Only run beforeCreated when app is enabled (default true if omitted)
    if (app.enabled !== false) {
      await service.beforeCreated(app);
    }

    const result = await repo.save(app);
    delete result.pk;
    if (app.enabled !== false) {
      await service?.afterCreated(manager, result);
    }
    return result;
  }

  async get(manager: SessionManager, appId: string): Promise<App | null> {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const app = await repo.getById(appId);
    if (!app) {
      return null;
    }
    delete (app as any).pk;
    const service = this.getAppService(app);
    await service?.enrich(manager, app);
    return app;
  }

  async upsert(manager: SessionManager, app: App) {
    return await this.update(manager, app, true);
  }

  async update(
    manager: SessionManager,
    app: App,
    upsert: boolean = false,
  ): Promise<App> {
    await this.checkSessionExists(manager, app.session);
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const savedApp = await repo.getById(app.id);
    if (!savedApp && upsert) {
      return this.create(manager, app);
    }

    if (!savedApp) {
      throw new NotFoundException(`App '${app.id}' not found`);
    }
    if (savedApp.app != app.app) {
      throw new Error(
        `Can not change app type. Delete and create a new app. Before type: '${savedApp.app}' After type: '${app.app}'`,
      );
    }
    if (savedApp.session != app.session) {
      throw new Error(
        `Can not change session. Delete and create a new app. Before session: '${savedApp.session}' After session: '${app.session}'`,
      );
    }

    const service = this.getAppService(app);
    if (app.enabled && !service && !AppRuntimeConfig.HasApp(app.app)) {
      throw new AppDisableError(app.app);
    }
    service?.validate(app);

    const hasEnabledChange = savedApp.enabled !== app.enabled;

    if (hasEnabledChange) {
      if (app.enabled) {
        await service?.beforeEnabled(manager, savedApp, app);
      } else {
        await service?.beforeDisabled(manager, savedApp, app);
      }
    } else {
      await service?.beforeUpdated(manager, savedApp, app);
    }
    await repo.update(app.id, app);
    const updated = await repo.getById(app.id);
    delete (updated as any)?.pk;
    return updated!;
  }

  async delete(manager: SessionManager, appId: string): Promise<App> {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const app = await repo.getById(appId);
    if (!app) {
      throw new NotFoundException(`App '${appId}' not found`);
    }
    const service = this.getAppService(app);
    await service?.beforeDeleted(manager, app);
    await repo.delete(app.id);
    delete app.pk;
    return app;
  }

  async purge(manager: SessionManager, appId: string): Promise<App> {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const app = await repo.getById(appId);
    if (!app) {
      throw new NotFoundException(`App '${appId}' not found`);
    }
    const service = this.getAppService(app);
    if (!service) {
      throw new AppDisableError(app.app);
    }
    await service.purge(manager, app);
    delete app.pk;
    return app;
  }

  async purgeBySession(manager: SessionManager, session: string) {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const apps = await repo.getAllBySession(session);
    for (const app of apps) {
      const service = this.getAppService(app);
      if (!service) {
        continue;
      }
      await service.purge(manager, app);
    }
  }

  async removeBySession(manager: SessionManager, session: string) {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const apps = await repo.getAllBySession(session);
    for (const app of apps) {
      const service = this.getAppService(app);
      await service?.beforeSessionDeleted(manager, app);
    }
    await repo.deleteBySession(session);
  }

  async beforeSessionStart(session: WhatsappSession, store: DataStore) {
    const knex = store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const apps = await repo.getEnabledBySession(session.name);
    for (const app of apps) {
      const service = this.getAppService(app);
      if (!service && !AppRuntimeConfig.HasApp(app.app)) {
        throw new AppDisableError(app.app);
      }
      const plugins = service.plugins(app, session, store);
      for (const options of plugins) {
        session.plugins.add(options, app.id);
      }
      service.beforeSessionStart(app, session);
    }
  }

  async afterSessionStart(session: WhatsappSession, store: DataStore) {
    const knex = store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const apps = await repo.getEnabledBySession(session.name);
    for (const app of apps) {
      const service = this.getAppService(app);
      if (!service && !AppRuntimeConfig.HasApp(app.app)) {
        throw new AppDisableError(app.app);
      }
      service.afterSessionStart(app, session);
    }
  }

  async syncSessionApps(
    manager: SessionManager,
    session: string,
    apps: App[],
  ): Promise<void> {
    // Reject duplicate unique apps in the payload before any writes,
    // otherwise the by-type matching below binds them to the same app
    const duplicateUniqueApp = findDuplicateUniqueApp(apps);
    if (duplicateUniqueApp !== null) {
      throw new UnprocessableEntityException(
        `Only one '${duplicateUniqueApp}' app is allowed per session - remove duplicate entries from 'apps'.`,
      );
    }

    const existing = await this.list(manager, session);
    const ids = new Set<string>();

    // Upsert provided apps
    for (const app of apps) {
      if (!app.id) {
        //  Try to find the app by type
        const found = existing.find((a) => a.app === app.app);
        if (found) {
          app.id = found.id;
        }
      }
      // Force session
      app.session = session;
      await this.upsert(manager, app);
      ids.add(app.id);
    }

    // Remove apps that are not in the provided list
    for (const app of existing) {
      if (ids.has(app.id)) {
        continue;
      }
      await this.delete(manager, app.id);
    }
  }

  async migrate(knex: Knex): Promise<void> {
    await migrate(knex);
  }

  private getAppService(app: App): IAppService | null {
    const appModule = GetApp(app.app);
    if (!appModule) {
      throw new Error(`App '${app.app}' not supported`);
    }
    try {
      return this.moduleRef.get(appModule.Service, { strict: false });
    } catch {
      // Provider is not registered - app is disabled via WAHA_APPS_ON / WAHA_APPS_OFF
      return null;
    }
  }

  private async checkSessionExists(
    manager: SessionManager,
    sessionName: string,
  ) {
    const session = await manager.exists(sessionName);
    if (session === null) {
      throw new NotFoundException('Session not found');
    }
  }
}
