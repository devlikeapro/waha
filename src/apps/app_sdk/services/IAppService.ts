import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { WhatsappSession } from '@waha/core/abc/session.abc';

/**
 * Exact App service
 */
export interface IAppService {
  validate(app: App): void;

  beforeCreated(app: App): Promise<void>;

  /**
   * Called only when the app transitions from disabled -> enabled.
   */
  beforeEnabled(savedApp: App, newApp: App): Promise<void>;

  /**
   * Called only when the app transitions from enabled -> disabled.
   */
  beforeDisabled(savedApp: App, newApp: App): Promise<void>;

  beforeUpdated(savedApp: App, newApp: App): Promise<void>;

  beforeDeleted(app: App): Promise<void>;

  beforeSessionStart(app: App, session: WhatsappSession): void;

  afterSessionStart(app: App, session: WhatsappSession): void;
}
