import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { parseBool } from './helpers';
import { WAHAEngine } from './structures/enums.dto';
import { WebhookConfig } from './structures/webhooks.dto';

@Injectable()
export class WhatsappConfigService {
  public files_uri = '/api/files';
  public schema = 'http';

  constructor(private configService: ConfigService) {}

  get filesURL(): string {
    return `${this.schema}://${this.hostname}:${this.port}${this.files_uri}/`;
  }

  get hostname(): string {
    return this.configService.get('WHATSAPP_API_HOSTNAME', 'localhost');
  }

  get port(): string {
    return this.configService.get('WHATSAPP_API_PORT', '3000');
  }

  get filesFolder(): string {
    return this.configService.get(
      'WHATSAPP_FILES_FOLDER',
      '/tmp/whatsapp-files',
    );
  }

  get filesLifetime(): number {
    return this.configService.get<number>('WHATSAPP_FILES_LIFETIME', 180);
  }

  get mimetypes(): string[] | null {
    const types = this.configService.get('WHATSAPP_FILES_MIMETYPES', '');
    return types ? types.split(',') : null;
  }

  get startSessions(): string[] {
    const value: string = this.configService.get('WHATSAPP_START_SESSION', '');
    if (!value) {
      return [];
    }
    return value.split(',');
  }

  get shouldRestartAllSessions(): boolean {
    const value: string = this.configService.get(
      'WHATSAPP_RESTART_ALL_SESSIONS',
      'false',
    );
    return parseBool(value);
  }

  get proxyServer(): string[] | string | undefined {
    const single = this.configService.get('WHATSAPP_PROXY_SERVER', undefined);
    const multipleValues = this.configService.get(
      'WHATSAPP_PROXY_SERVER_LIST',
      undefined,
    );
    const multiple = multipleValues ? multipleValues.split(',') : undefined;
    return single ? single : multiple;
  }

  get proxyServerIndexPrefix(): string | undefined {
    return this.configService.get(
      'WHATSAPP_PROXY_SERVER_INDEX_PREFIX',
      undefined,
    );
  }

  get proxyServerUsername(): string | undefined {
    return this.configService.get('WHATSAPP_PROXY_SERVER_USERNAME', undefined);
  }

  get proxyServerPassword(): string | undefined {
    return this.configService.get('WHATSAPP_PROXY_SERVER_PASSWORD', undefined);
  }

  getWebhookConfig(): WebhookConfig | undefined {
    const url = this.getWebhookUrl();
    const events = this.getWebhookEvents();
    if (!url || events.length === 0) {
      return undefined;
    }
    return { url: url, events: events };
  }

  private getWebhookUrl(): string | undefined {
    return this.get('WHATSAPP_HOOK_URL');
  }

  private getWebhookEvents(): string[] {
    const value = this.get('WHATSAPP_HOOK_EVENTS', '');
    return value ? value.split(',') : [];
  }

  getDefaultEngineName(): WAHAEngine {
    const value = this.get('WHATSAPP_DEFAULT_ENGINE', WAHAEngine.WEBJS);
    if (value in WAHAEngine) {
      return WAHAEngine[value];
    }
    console.log(
      `Unknown WhatsApp default engine, using WEBJS. WHATSAPP_DEFAULT_ENGINE=${value}`,
    );
  }

  get(name: string, defaultValue = undefined): any {
    return this.configService.get(name, defaultValue);
  }

  getApiKey(): string | undefined {
    return this.configService.get('WHATSAPP_API_KEY', '');
  }

  getSwaggerUsernamePassword(): [string, string] | undefined {
    const user = this.configService.get('WHATSAPP_SWAGGER_USERNAME', undefined);
    const password = this.configService.get(
      'WHATSAPP_SWAGGER_PASSWORD',
      undefined,
    );
    if (!user && !password) {
      console.log(
        'Please set up both WHATSAPP_SWAGGER_USERNAME and WHATSAPP_SWAGGER_PASSWORD ' +
          'to enable swagger authentication.',
      );
      return undefined;
    }
    return [user, password];
  }

  getSwaggerAdvancedConfigEnabled(): boolean {
    return this.configService.get('WHATSAPP_SWAGGER_CONFIG_ADVANCED', false);
  }
}
