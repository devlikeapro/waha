import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WAHAEvents } from '@waha/structures/enums.dto';

import { parseBool } from './helpers';
import { WebhookConfig } from './structures/webhooks.config.dto';

@Injectable()
export class WhatsappConfigService {
  constructor(private configService: ConfigService) {}

  get schema() {
    return this.configService.get('WHATSAPP_API_SCHEMA', 'http');
  }

  get hostname(): string {
    return this.configService.get('WHATSAPP_API_HOSTNAME', 'localhost');
  }

  get port(): string {
    return this.configService.get('WHATSAPP_API_PORT', '3000');
  }

  get mimetypes(): string[] {
    if (!this.shouldDownloadMedia) {
      return ['mimetype/ignore-all-media'];
    }
    const types = this.configService.get('WHATSAPP_FILES_MIMETYPES', '');
    return types ? types.split(',') : [];
  }

  get shouldDownloadMedia(): boolean {
    const value = this.configService.get('WHATSAPP_DOWNLOAD_MEDIA', 'true');
    return parseBool(value);
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
    const single = this.configService.get<string>(
      'WHATSAPP_PROXY_SERVER',
      undefined,
    );
    const multipleValues = this.configService.get<string>(
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

  private getWebhookEvents(): WAHAEvents[] {
    const value = this.get('WHATSAPP_HOOK_EVENTS', '');
    return value ? value.split(',') : [];
  }

  getSessionMongoUrl(): string | undefined {
    return this.configService.get('WHATSAPP_SESSIONS_MONGO_URL', undefined);
  }

  get(name: string, defaultValue: any = undefined): any {
    return this.configService.get(name, defaultValue);
  }

  getApiKey(): string | undefined {
    return this.configService.get('WHATSAPP_API_KEY', '');
  }

  getExcludedPaths(): string[] {
    const value = this.configService.get('WHATSAPP_API_KEY_EXCLUDE_PATH', '');
    if (!value) {
      return [];
    }
    return value.split(',');
  }

  getHealthMediaFilesThreshold(): number {
    return this.configService.get<number>(
      'WHATSAPP_HEALTH_MEDIA_FILES_THRESHOLD_MB',
      100,
    );
  }

  getHealthSessionFilesThreshold(): number {
    return this.configService.get<number>(
      'WHATSAPP_HEALTH_SESSION_FILES_THRESHOLD_MB',
      100,
    );
  }

  getHealthMongoTimeout(): number {
    return this.configService.get<number>(
      'WHATSAPP_HEALTH_MONGO_TIMEOUT_MS',
      3000,
    );
  }
}
