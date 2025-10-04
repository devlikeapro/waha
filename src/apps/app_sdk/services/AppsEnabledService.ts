import { Injectable, NotFoundException } from '@nestjs/common';
import { migrate } from '@waha/apps/app_sdk/migrations';
import { IAppService } from '@waha/apps/app_sdk/services/IAppService';
import { IAppsService } from '@waha/apps/app_sdk/services/IAppsService';
import { ChatWootAppService } from '@waha/apps/chatwoot/services/ChatWootAppService';
import { DataStore } from '@waha/core/abc/DataStore';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { generatePrefixedId } from '@waha/utils/ids';
import { Knex } from 'knex';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { App, AppName } from '../dto/app.dto';
import { AppRepository } from '../storage/AppRepository';

@Injectable()
export class AppsEnabledService implements IAppsService {
  constructor(
    protected readonly chatwootService: ChatWootAppService,
    @InjectPinoLogger('AppsService')
    protected logger: PinoLogger,
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

    // Validate only one Chatwoot app per session
    if (app.app === AppName.chatwoot) {
      const existingApps = await repo.getAllBySession(app.session);
      const existingChatwootApp = existingApps.find(
        (existingApp) => existingApp.app === AppName.chatwoot,
      );

      if (existingChatwootApp) {
        throw new Error(
          `Only one Chatwoot app is allowed per session. Session '${app.session}' already has a Chatwoot app with ID '${existingChatwootApp.id}'.`,
        );
      }
    }

    const service = this.getAppService(app);
    service.validate(app);
    // Only run beforeCreated when app is enabled (default true if omitted)
    if (app.enabled !== false) {
      await service.beforeCreated(app);
    }

    const result = await repo.save(app);
    if (app.enabled) {
      await this.restartIfRunning(manager, app.session);
    }
    delete result.pk;
    return result;
  }

  async get(manager: SessionManager, appId: string): Promise<App> {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const app = await repo.getById(appId);
    if (!app) {
      throw new NotFoundException(`App '${appId}' not found`);
    }
    delete (app as any).pk;
    return app;
  }

  async update(manager: SessionManager, app: App): Promise<App> {
    await this.checkSessionExists(manager, app.session);
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const savedApp = await repo.getById(app.id);
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
    await this.restartIfRunning(manager, app.session);

    const updated = await repo.getById(app.id);
    delete (updated as any)?.pk;
    return updated!;
  }

  async delete(manager: SessionManager, appId: string) {
    const knex = manager.store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const app = await repo.getById(appId);
    if (!app) {
      throw new NotFoundException(`App '${appId}' not found`);
    }
    const service = this.getAppService(app);
    await service.beforeDeleted(app);
    await repo.delete(app.id);
    await this.restartIfRunning(manager, app.session);
    return;
  }

  async beforeSessionStart(session: WhatsappSession, store: DataStore) {
    const knex = store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const apps = await repo.getEnabledBySession(session.name);
    for (const app of apps) {
      const service = this.getAppService(app);
      service.beforeSessionStart(app, session);
    }
  }

  async afterSessionStart(session: WhatsappSession, store: DataStore) {
    const knex = store.getWAHADatabase();
    const repo = new AppRepository(knex);
    const apps = await repo.getEnabledBySession(session.name);
    for (const app of apps) {
      const service = this.getAppService(app);
      service.afterSessionStart(app, session);
    }
  }

  async migrate(knex: Knex): Promise<void> {
    await migrate(knex);
  }

  private restartIfRunning(manager: SessionManager, session: string) {
    const isRunning = manager.isRunning(session);
    if (!isRunning) {
      return;
    }
    return manager.restart(session);
  }

  private getAppService(app: App): IAppService {
    switch (app.app) {
      case AppName.chatwoot:
        return this.chatwootService;
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
