import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { DataStore } from '@waha/core/abc/DataStore';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { PluginOptions } from '@waha/core/abc/session.plugin';

/**
 * Exact App service
 */
export interface IAppService {
  validate(app: App): void;

  beforeCreated(app: App): Promise<void>;

  /**
   * Called after the app record is saved to the database during creation.
   * Use this for side effects that must happen after the app exists in storage.
   */
  afterCreated(manager: SessionManager, app: App): Promise<void>;

  /**
   * Called only when the app transitions from disabled -> enabled.
   */
  beforeEnabled(
    manager: SessionManager,
    savedApp: App,
    newApp: App,
  ): Promise<void>;

  /**
   * Called only when the app transitions from enabled -> disabled.
   */
  beforeDisabled(
    manager: SessionManager,
    savedApp: App,
    newApp: App,
  ): Promise<void>;

  beforeUpdated(
    manager: SessionManager,
    savedApp: App,
    newApp: App,
  ): Promise<void>;

  beforeDeleted(manager: SessionManager, app: App): Promise<void>;

  /**
   * Deletes the app's stored data (database rows, caches) while keeping the app configured.
   * Apps without storage implement it as a no-op.
   */
  purge(manager: SessionManager, app: App): Promise<void>;

  /**
   * Called for each app before a bulk session deletion removes all app records.
   * Use this to clean up external resources tied to the app (e.g. API keys).
   */
  beforeSessionDeleted(manager: SessionManager, app: App): Promise<void>;

  /**
   * Called after reading an app from storage, before returning it to the caller.
   * Use this to populate transient fields that are not persisted (e.g. secret values).
   */
  enrich(manager: SessionManager, app: App): Promise<void>;

  /**
   * Session plugins contributed by this app. AppsEnabledService registers them with the app id,
   * and the session manager attaches their hooks and events before session.start().
   * store - the server data store, for apps whose plugins persist data.
   */
  plugins(
    app: App,
    session: WhatsappSession,
    store?: DataStore,
  ): PluginOptions[];

  beforeSessionStart(app: App, session: WhatsappSession): void;

  afterSessionStart(app: App, session: WhatsappSession): void;
}
