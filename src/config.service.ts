import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaDownloadOptions } from '@waha/core/media/IMediaManager';
import { IgnoreJidConfig } from '@waha/core/utils/jids';
import * as lodash from 'lodash';

import { parseBool } from './helpers';
import { Auth } from '@waha/core/auth/config';

@Injectable()
export class WhatsappConfigService {
  private logger: Logger;

  constructor(private configService: ConfigService) {
    this.logger = new Logger('WhatsappConfigService');
  }

  get schema() {
    return this.configService.get('WHATSAPP_API_SCHEMA', 'http');
  }

  get hostname(): string {
    return this.configService.get('WHATSAPP_API_HOSTNAME', 'localhost');
  }

  get port(): string {
    if (this.configService.get('PORT')) {
      return this.configService.get('PORT');
    }
    return this.configService.get('WHATSAPP_API_PORT', '3000');
  }

  get baseUrl(): string {
    let baseUrl = this.configService.get('WAHA_BASE_URL', '');
    if (!baseUrl) {
      // combine schema+hostname+port
      baseUrl = `${this.schema}://${this.hostname}:${this.port}`;
    }
    // remove / at the end
    return baseUrl.replace(/\/$/, '');
  }

  get workerId(): string {
    return this.configService.get('WAHA_WORKER_ID', '');
  }

  get shouldRestartWorkerSessions(): boolean {
    const value = this.configService.get(
      'WAHA_WORKER_RESTART_SESSIONS',
      'true',
    );
    return parseBool(value);
  }

  get autoStartDelaySeconds(): number {
    const value = this.configService.get('WAHA_AUTO_START_DELAY_SECONDS', '0');
    try {
      return parseInt(value, 10);
    } catch (error) {
      return 0;
    }
  }

  private get mediaGlobalParams() {
    return {
      download: this.configService.get('WHATSAPP_DOWNLOAD_MEDIA', 'true'),
      mimetypes: this.configService.get('WHATSAPP_FILES_MIMETYPES', ''),
    };
  }

  private get mediaApiConfig(): MediaDownloadOptions {
    const params = {
      download: this.configService.get('WAHA_API_DOWNLOAD_MEDIA'),
      mimetypes: this.configService.get('WAHA_API_DOWNLOAD_MEDIA_MIMETYPES'),
    };
    const config = lodash.defaults({}, params, this.mediaGlobalParams);
    return this.parseMediaDownloadOptions(config);
  }

  private get mediaEventsConfig(): MediaDownloadOptions {
    const params = {
      download: this.configService.get('WAHA_EVENTS_DOWNLOAD_MEDIA'),
      mimetypes: this.configService.get('WAHA_EVENTS_DOWNLOAD_MEDIA_MIMETYPES'),
    };
    const config = lodash.defaults({}, params, this.mediaGlobalParams);
    return this.parseMediaDownloadOptions(config);
  }

  private parseMediaDownloadOptions(config: {
    download: string;
    mimetypes: string;
  }): MediaDownloadOptions {
    const types = config.mimetypes;
    const mimetypes = types
      ? types.split(',').map((type: string) => type.trim())
      : [];
    return {
      download: parseBool(config.download),
      mimetypes: mimetypes,
    };
  }

  get mediaConfig() {
    return {
      api: this.mediaApiConfig,
      events: this.mediaEventsConfig,
    };
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

  getSessionMongoUrl(): string | undefined {
    return this.configService.get('WHATSAPP_SESSIONS_MONGO_URL', undefined);
  }

  getSessionPostgresUrl(): string | undefined {
    return this.configService.get(
      'WHATSAPP_SESSIONS_POSTGRESQL_URL',
      undefined,
    );
  }

  get(name: string, defaultValue: any = undefined): any {
    return this.configService.get(name, defaultValue);
  }

  getApiKey(): string | undefined {
    return Auth.key.value;
  }

  getExcludedPaths(): string[] {
    const value = this.configService.get('WHATSAPP_API_KEY_EXCLUDE_PATH', '');
    if (!value) {
      return [];
    }
    return value.split(',').filter(Boolean);
  }

  getExcludedFullPaths(): string[] {
    const paths = this.getExcludedPaths();
    return paths.map((path) => (path.startsWith('/') ? path : `/${path}`));
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

  get debugModeEnabled(): boolean {
    const value = this.configService.get('WAHA_DEBUG_MODE', 'false');
    return parseBool(value);
  }

  /**
   * Global default "ignore settings" for chats.
   * If not defined, defaults to false (do not ignore anything).
   */
  getIgnoreChatsConfig(): IgnoreJidConfig {
    const status = parseBool(
      this.configService.get('WAHA_SESSION_CONFIG_IGNORE_STATUS', 'false'),
    );
    const groups = parseBool(
      this.configService.get('WAHA_SESSION_CONFIG_IGNORE_GROUPS', 'false'),
    );
    const channels = parseBool(
      this.configService.get('WAHA_SESSION_CONFIG_IGNORE_CHANNELS', 'false'),
    );
    const broadcast = parseBool(
      this.configService.get('WAHA_SESSION_CONFIG_IGNORE_BROADCAST', 'false'),
    );
    return { status, groups, channels, broadcast };
  }
}
