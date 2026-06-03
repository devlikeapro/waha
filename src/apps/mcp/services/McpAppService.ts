import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { IAppService } from '@waha/apps/app_sdk/services/IAppService';
import { AppRepository } from '@waha/apps/app_sdk/storage/AppRepository';
import { McpAppConfig } from '@waha/apps/mcp/dto/config.dto';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { ApiKeyService } from '@waha/core/services/ApiKeyService';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class McpAppService implements IAppService {
  constructor(
    @InjectPinoLogger('McpAppService')
    private readonly logger: PinoLogger,
  ) {}

  validate(app: App<McpAppConfig>): void {
    if (!app.config) {
      app.config = new McpAppConfig();
    }
    delete app.config.key_id;
    delete app.config.key;
  }

  async beforeCreated(app: App<McpAppConfig>): Promise<void> {
    void app;
  }

  async afterCreated(
    manager: SessionManager,
    app: App<McpAppConfig>,
  ): Promise<void> {
    const keyDto = await new ApiKeyService(manager).createForApp(
      {
        isAdmin: false,
        session: app.session,
        isActive: true,
        actions: app.config?.actions ?? null,
      },
      app.id,
    );
    const updatedConfig = {
      ...(app.config ?? {}),
      key_id: keyDto.id,
    } as McpAppConfig;
    const repo = new AppRepository(manager.store.getWAHADatabase());
    await repo.update(app.id, { config: updatedConfig });
    app.config = updatedConfig;
  }

  async beforeEnabled(
    manager: SessionManager,
    savedApp: App<McpAppConfig>,
    newApp: App<McpAppConfig>,
  ): Promise<void> {
    await this.requireKeyExists(manager, savedApp);
    await this.syncKeyActions(manager, savedApp, newApp);
    await this.setKeyActive(manager, savedApp, true);
    newApp.config = {
      ...(newApp.config ?? {}),
      key_id: savedApp.config?.key_id,
    } as McpAppConfig;
  }

  async beforeDisabled(
    manager: SessionManager,
    savedApp: App<McpAppConfig>,
    newApp: App<McpAppConfig>,
  ): Promise<void> {
    await this.setKeyActive(manager, savedApp, false);
    newApp.config = {
      ...(newApp.config ?? {}),
      key_id: savedApp.config?.key_id,
    } as McpAppConfig;
  }

  async beforeUpdated(
    manager: SessionManager,
    savedApp: App<McpAppConfig>,
    newApp: App<McpAppConfig>,
  ): Promise<void> {
    await this.requireKeyExists(manager, savedApp);
    await this.syncKeyActions(manager, savedApp, newApp);
    newApp.config = {
      ...(newApp.config ?? {}),
      key_id: savedApp.config?.key_id,
    } as McpAppConfig;
  }

  async beforeDeleted(
    manager: SessionManager,
    app: App<McpAppConfig>,
  ): Promise<void> {
    await this.deleteKey(manager, app);
  }

  async beforeSessionDeleted(
    manager: SessionManager,
    app: App<McpAppConfig>,
  ): Promise<void> {
    await this.deleteKey(manager, app);
  }

  async enrich(manager: SessionManager, app: App<McpAppConfig>): Promise<void> {
    const keyId = app.config?.key_id;
    if (!keyId) {
      return;
    }
    const keyDto = await new ApiKeyService(manager).getById(keyId);
    if (!keyDto) {
      return;
    }
    app.config = { ...(app.config ?? {}), key: keyDto.key } as McpAppConfig;
  }

  beforeSessionStart(app: App<McpAppConfig>, session: WhatsappSession): void {
    void app;
    void session;
  }

  afterSessionStart(app: App<McpAppConfig>, session: WhatsappSession): void {
    void app;
    void session;
  }

  private async requireKeyExists(
    manager: SessionManager,
    app: App<McpAppConfig>,
  ): Promise<void> {
    const keyId = app.config?.key_id;
    if (!keyId) {
      throw new UnprocessableEntityException(
        'MCP app has no associated API key. Delete this app and create a new one.',
      );
    }
    const existing = await new ApiKeyService(manager).getById(keyId);
    if (!existing) {
      throw new UnprocessableEntityException(
        `The API key for this MCP app no longer exists. Delete this app and create a new one.`,
      );
    }
  }

  private async syncKeyActions(
    manager: SessionManager,
    savedApp: App<McpAppConfig>,
    newApp: App<McpAppConfig>,
  ): Promise<void> {
    const keyId = savedApp.config?.key_id;
    if (!keyId) {
      return;
    }
    await new ApiKeyService(manager).updateForApp(keyId, {
      actions: newApp.config?.actions ?? null,
    });
  }

  private async setKeyActive(
    manager: SessionManager,
    app: App<McpAppConfig>,
    isActive: boolean,
  ): Promise<void> {
    const keyId = app.config?.key_id;
    if (!keyId) {
      return;
    }
    await new ApiKeyService(manager).updateForApp(keyId, {
      isActive: isActive,
    });
  }

  private async deleteKey(
    manager: SessionManager,
    app: App<McpAppConfig>,
  ): Promise<void> {
    const keyId = app.config?.key_id;
    if (!keyId) {
      return;
    }
    await new ApiKeyService(manager).deleteForApp(keyId);
  }
}
