import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { DataStore } from '@waha/core/abc/DataStore';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { Knex } from 'knex';

export interface IAppsService {
  list(manager: SessionManager, session: string): Promise<App[]>;

  get(manager: SessionManager, appId: string): Promise<App | null>;

  create(manager: SessionManager, app: App): Promise<App>;

  upsert(manager: SessionManager, app: App): Promise<App>;

  update(manager: SessionManager, app: App): Promise<App>;

  delete(manager: SessionManager, appId: string): Promise<App>;

  removeBySession(manager: SessionManager, session: string): Promise<void>;

  beforeSessionStart(session: WhatsappSession, store: DataStore): Promise<void>;

  afterSessionStart(session: WhatsappSession, store: DataStore): Promise<void>;

  syncSessionApps(
    manager: SessionManager,
    sessionName: string,
    apps?: App[] | null,
  ): Promise<void>;

  migrate(knex: Knex): Promise<void>;
}

export const AppsService = Symbol('AppsService');
