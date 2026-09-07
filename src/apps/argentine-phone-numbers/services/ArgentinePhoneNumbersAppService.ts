import { Injectable } from '@nestjs/common';
import { App } from '@waha/apps/app_sdk/dto/app.dto';
import { IAppService } from '@waha/apps/app_sdk/services/IAppService';
import { PluginOptions } from '@waha/core/abc/session.plugin';
import { ArgentinePhoneNumbersAppConfig } from '@waha/apps/argentine-phone-numbers/dto/config.dto';
import { ArgentinePhonePlugin } from '@waha/apps/argentine-phone-numbers/plugins/ArgentinePhonePlugin';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';

@Injectable()
export class ArgentinePhoneNumbersAppService implements IAppService {
  validate(app: App<ArgentinePhoneNumbersAppConfig>): void {
    // The DTO validation covers structure; no extra validation rules.
    void app;
    return;
  }

  async beforeCreated(app: App<ArgentinePhoneNumbersAppConfig>): Promise<void> {
    void app;
    return;
  }

  async beforeEnabled(
    manager: SessionManager,
    savedApp: App<ArgentinePhoneNumbersAppConfig>,
    newApp: App<ArgentinePhoneNumbersAppConfig>,
  ): Promise<void> {
    void manager;
    void savedApp;
    void newApp;
  }

  async beforeDisabled(
    manager: SessionManager,
    savedApp: App<ArgentinePhoneNumbersAppConfig>,
    newApp: App<ArgentinePhoneNumbersAppConfig>,
  ): Promise<void> {
    void manager;
    void savedApp;
    void newApp;
  }

  async beforeUpdated(
    manager: SessionManager,
    savedApp: App<ArgentinePhoneNumbersAppConfig>,
    newApp: App<ArgentinePhoneNumbersAppConfig>,
  ): Promise<void> {
    void manager;
    void savedApp;
    void newApp;
  }

  async beforeDeleted(
    manager: SessionManager,
    app: App<ArgentinePhoneNumbersAppConfig>,
  ): Promise<void> {
    void manager;
    void app;
  }

  async afterCreated(
    manager: SessionManager,
    app: App<ArgentinePhoneNumbersAppConfig>,
  ): Promise<void> {
    void manager;
    void app;
  }

  async beforeSessionDeleted(
    manager: SessionManager,
    app: App<ArgentinePhoneNumbersAppConfig>,
  ): Promise<void> {
    void manager;
    void app;
  }

  async purge(
    manager: SessionManager,
    app: App<ArgentinePhoneNumbersAppConfig>,
  ): Promise<void> {
    void manager;
    void app;
  }

  async enrich(
    manager: SessionManager,
    app: App<ArgentinePhoneNumbersAppConfig>,
  ): Promise<void> {
    void manager;
    void app;
  }

  plugins(
    app: App<ArgentinePhoneNumbersAppConfig>,
    session: WhatsappSession,
  ): PluginOptions[] {
    void session;
    return [ArgentinePhonePlugin.with(app.config, null)];
  }

  beforeSessionStart(
    app: App<ArgentinePhoneNumbersAppConfig>,
    session: WhatsappSession,
  ): void {
    void app;
    void session;
    return;
  }

  afterSessionStart(
    app: App<ArgentinePhoneNumbersAppConfig>,
    session: WhatsappSession,
  ): void {
    void app;
    void session;
    return;
  }
}
