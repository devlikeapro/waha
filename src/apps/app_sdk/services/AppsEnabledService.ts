import {
  Injectable,
  NotFoundException,
  Optional,
  UnprocessableEntityException,
} from '@nestjs/common';
import { migrate } from '@waha/apps/app_sdk/migrations';
import { IAppService } from '@waha/apps/app_sdk/services/IAppService';
import { IAppsService } from '@waha/apps/app_sdk/services/IAppsService';
import { ChatWootAppService } from '@waha/apps/chatwoot/services/ChatWootAppService';
import { CallsAppService } from '@waha/apps/calls/services/CallsAppService';
import { DataStore } from '@waha/core/abc/DataStore';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { generatePrefixedId } from '@waha/utils/ids';
import { Knex } from 'knex';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { App } from '../dto/app.dto';
import { AppRepository } from '../storage/AppRepository';
import { AppName } from '@waha/apps/app_sdk/apps/name';
import { AppRuntimeConfig } from '@waha/apps/app_sdk/apps/AppRuntime';

export class AppDisableError extends UnprocessableEntityException {
  constructor(app: string) {
    super(
      `App '${app}' is disabled in runtime configuration - adjust WAHA_APPS_ON / WAHA_APPS_OFF environment variables to enable it.`,
    );
  }
}

@Injectable()
export class AppsEnabledService implements IAppsService {
  constructor(
    @InjectPinoLogger('AppsService')
    protected logger: PinoLogger,
    @Optional() protected readonly chatwootService: ChatWootAppService,
    @Optional() protected readonly callsAppService: CallsAppService,
  ) {}

  async list(manager: SessionManager, session: string): Promise<App[]> {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const apps = await repo.getAllBySession(session);
    apps.forEach((app) => {
      delete app.pk;
    });
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

    let existingApps: App[] = [];
    if (app.app === AppName.chatwoot || app.app === AppName.calls) {
      existingApps = await repo.getAllBySession(app.session);
    }
    // Validate only one Chatwoot app per session
    if (app.app === AppName.chatwoot) {
      const existingChatwootApp = existingApps.find(
        (existingApp) => existingApp.app === AppName.chatwoot,
      );

      if (existingChatwootApp) {
        throw new Error(
          `Only one Chatwoot app is allowed per session. Session '${app.session}' already has a Chatwoot app with ID '${existingChatwootApp.id}'.`,
        );
      }
    }
    // Validate only one Calls app per session
    if (app.app === AppName.calls) {
      const existingCallsApp = existingApps.find(
        (existingApp) => existingApp.app === AppName.calls,
      );

      if (existingCallsApp) {
        throw new Error(
          `Only one Calls app is allowed per session. Session '${app.session}' already has a Calls app with ID '${existingCallsApp.id}'.`,
        );
      }
    }

    const service = this.getAppService(app);
    if (!service && !AppRuntimeConfig.HasApp(app.app)) {
      throw new AppDisableError(app.app);
    }
    service.validate(app);
    // Only run beforeCreated when app is enabled (default true if omitted)
    if (app.enabled !== false) {
      await service.beforeCreated(app);
    }

    const result = await repo.save(app);
    delete result.pk;
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
    if (!service && !AppRuntimeConfig.HasApp(app.app)) {
      throw new AppDisableError(app.app);
    }
    service.validate(app);

    const hasEnabledChange = savedApp.enabled !== app.enabled;

    if (hasEnabledChange) {
      if (app.enabled) {
        await service.beforeEnabled(savedApp, app);
      } else {
        await service.beforeDisabled(savedApp, app);
      }
    } else {
      await service.beforeUpdated(savedApp, app);
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
    await service?.beforeDeleted(app);
    await repo.delete(app.id);
    delete app.pk;
    return app;
  }

  async removeBySession(manager: SessionManager, session: string) {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
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
    switch (app.app) {
      case AppName.chatwoot:
        return this.chatwootService;
      case AppName.calls:
        return this.callsAppService;
      default:
        throw new Error(`App '${app.app}' not supported`);
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
