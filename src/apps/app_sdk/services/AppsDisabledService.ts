import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { IAppsService } from '@waha/apps/app_sdk/services/IAppsService';
import { DataStore } from '@waha/core/abc/DataStore';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { Knex } from 'knex';

import { App } from '../dto/app.dto';

class AppsIsDisabledError extends UnprocessableEntityException {
  constructor() {
    super(
      "Apps are disabled. Enable it by setting 'WAHA_APPS_ENABLED=True' environment variable.",
    );
  }
}

@Injectable()
export class AppsDisabledService implements IAppsService {
  async list(manager: SessionManager, session: string): Promise<App[]> {
    throw new AppsIsDisabledError();
  }

  async get(manager: SessionManager, appId: string): Promise<App | null> {
    throw new AppsIsDisabledError();
  }

  async create(manager: SessionManager, app: App): Promise<App> {
    throw new AppsIsDisabledError();
  }

  async upsert(manager: SessionManager, app: App): Promise<App> {
    throw new AppsIsDisabledError();
  }

  async update(manager: SessionManager, app: App): Promise<App> {
    throw new AppsIsDisabledError();
  }

  async delete(manager: SessionManager, appId: string): Promise<App> {
    throw new AppsIsDisabledError();
  }

  async removeBySession(manager: SessionManager, session: string) {
    return;
  }

  migrate(knex: Knex<any, any[]>): Promise<void> {
    return;
  }

  async beforeSessionStart(session: WhatsappSession, store: DataStore) {
    return;
  }

  async afterSessionStart(session: WhatsappSession, store: DataStore) {
    return;
  }

  async syncSessionApps(
    manager: SessionManager,
    sessionName: string,
    apps?: App[] | null,
  ): Promise<void> {
    throw new AppsIsDisabledError();
  }
}
