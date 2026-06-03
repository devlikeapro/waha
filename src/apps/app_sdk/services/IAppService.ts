import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';

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
   * Called for each app before a bulk session deletion removes all app records.
   * Use this to clean up external resources tied to the app (e.g. API keys).
   */
  beforeSessionDeleted(manager: SessionManager, app: App): Promise<void>;

  /**
   * Called after reading an app from storage, before returning it to the caller.
   * Use this to populate transient fields that are not persisted (e.g. secret values).
   */
  enrich(manager: SessionManager, app: App): Promise<void>;

  beforeSessionStart(app: App, session: WhatsappSession): void;

  afterSessionStart(app: App, session: WhatsappSession): void;
}
