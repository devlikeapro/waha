import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { IAppService } from '@waha/apps/app_sdk/services/IAppService';
import { UniqueAppResolver } from '@waha/apps/app_sdk/services/UniqueAppResolver';
import { AppDB } from '@waha/apps/app_sdk/storage/types';
import {
  DEFAULT_PERSISTENT_TTL,
  PhoneNumbersBaseConfig,
} from '@waha/apps/phone-numbers/dto/config.dto';
import { PhoneNumbersCorePlugin } from '@waha/apps/phone-numbers/plugins/PhoneNumbersCorePlugin';
import { PhoneNumbersGowsPlugin } from '@waha/apps/phone-numbers/plugins/PhoneNumbersGowsPlugin';
import { PhoneNumbersNowebPlugin } from '@waha/apps/phone-numbers/plugins/PhoneNumbersNowebPlugin';
import { PhoneNumberRule } from '@waha/apps/phone-numbers/rules/PhoneNumberRule';
import { PhoneNumbersCacheRepository } from '@waha/apps/phone-numbers/storage/PhoneNumbersCacheRepository';
import { DataStore } from '@waha/core/abc/DataStore';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { PluginOptions } from '@waha/core/abc/session.plugin';
import { parseDurationMs } from '@waha/nestjs/validation/IsDuration';
import { WAHAEngine } from '@waha/structures/enums.dto';
import { Knex } from 'knex';
import * as ms from 'ms';

// Engines with a local contact/LID store get their own tier; the rest run the
// core pipeline (cache + static rule + WhatsApp lookup).
const PLUGINS: Record<WAHAEngine, typeof PhoneNumbersCorePlugin> = {
  [WAHAEngine.WEBJS]: PhoneNumbersCorePlugin,
  [WAHAEngine.WPP]: PhoneNumbersCorePlugin,
  [WAHAEngine.GOWS]: PhoneNumbersGowsPlugin,
  [WAHAEngine.NOWEB]: PhoneNumbersNowebPlugin,
};

/**
 * Everything a phone numbers app needs except which numbers it handles
 */
export abstract class PhoneNumbersAppServiceBase<
  Config extends PhoneNumbersBaseConfig,
> implements IAppService
{
  protected readonly Repository = PhoneNumbersCacheRepository;

  protected constructor(protected readonly resolver: UniqueAppResolver) {}

  protected abstract rules(config: Config): PhoneNumberRule[];

  validate(app: App<Config>): void {
    void app;
    return;
  }

  async beforeCreated(app: App<Config>): Promise<void> {
    void app;
    return;
  }

  async beforeEnabled(
    manager: SessionManager,
    savedApp: App<Config>,
    newApp: App<Config>,
  ): Promise<void> {
    void manager;
    void savedApp;
    void newApp;
  }

  async beforeDisabled(
    manager: SessionManager,
    savedApp: App<Config>,
    newApp: App<Config>,
  ): Promise<void> {
    void manager;
    void savedApp;
    void newApp;
  }

  async beforeUpdated(
    manager: SessionManager,
    savedApp: App<Config>,
    newApp: App<Config>,
  ): Promise<void> {
    void manager;
    void savedApp;
    void newApp;
  }

  async beforeDeleted(
    manager: SessionManager,
    app: App<Config>,
  ): Promise<void> {
    void manager;
    void app;
  }

  async afterCreated(manager: SessionManager, app: App<Config>): Promise<void> {
    void manager;
    void app;
  }

  async beforeSessionDeleted(
    manager: SessionManager,
    app: App<Config>,
  ): Promise<void> {
    void manager;
    void app;
  }

  async purge(manager: SessionManager, app: App<Config>): Promise<void> {
    await this.purgeCache(manager, app as AppDB);
  }

  /**
   * Deletes all persistent cache entries and clears the in-memory tier when the session is running.
   */
  async purgeCache(manager: SessionManager, app: AppDB): Promise<number> {
    const knex = manager.store.getWAHADatabase();
    const deleted = await this.repository(knex, app).purge();
    this.resolver.getPlugin(app, PhoneNumbersCorePlugin)?.clearMemoryCache();
    return deleted;
  }

  persistentEnabled(app: AppDB): boolean {
    const config = app.config as Config;
    return config?.cache?.persistent ?? true;
  }

  repository(knex: Knex, app: AppDB): PhoneNumbersCacheRepository {
    const config = app.config as Config;
    const ttlMs =
      parseDurationMs(config?.cache?.persistentTtl) ??
      ms(DEFAULT_PERSISTENT_TTL);
    return new this.Repository(knex, app.pk, ttlMs);
  }

  async enrich(manager: SessionManager, app: App<Config>): Promise<void> {
    void manager;
    void app;
  }

  plugins(
    app: App<Config>,
    session: WhatsappSession,
    store?: DataStore,
  ): PluginOptions[] {
    const config = app.config ?? ({} as Config);
    let repository: PhoneNumbersCacheRepository | null = null;
    const appDb = app as AppDB;
    if (this.persistentEnabled(appDb) && store && appDb.pk) {
      repository = this.repository(store.getWAHADatabase(), appDb);
    }
    const Plugin = PLUGINS[session.engine];
    return [
      Plugin.with(config, {
        repository: repository,
        rules: this.rules(config),
      }),
    ];
  }

  beforeSessionStart(app: App<Config>, session: WhatsappSession): void {
    void app;
    void session;
    return;
  }

  afterSessionStart(app: App<Config>, session: WhatsappSession): void {
    void app;
    void session;
    return;
  }
}
