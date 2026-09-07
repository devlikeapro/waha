import type { WAVersion } from '@adiwajshing/baileys';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NowebConfig } from '@waha/core/engines/noweb/session.noweb.core';
import {
  formatWaVersion,
  isWaVersionHigher,
  parseWaVersion,
} from '@waha/core/engines/noweb/waversion';
import { parseBool } from '@waha/helpers';
import esm from '@waha/vendor/esm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export enum WAVersionAutoMode {
  WEB = 'auto-web',
  BAILEYS = 'auto-baileys',
}

const FETCH_WA_VERSION_TIMEOUT_MS = 15_000;

@Injectable()
export class NowebEngineConfigService {
  private config: NowebConfig | null = null;

  constructor(
    protected configService: ConfigService,
    @InjectPinoLogger('NowebEngineConfigService')
    protected logger: PinoLogger,
  ) {}

  async getConfig(): Promise<NowebConfig> {
    if (!this.config) {
      const version = await this.resolveWaVersion();
      this.config = { waVersion: version };
    }
    return this.config;
  }

  /**
   * Resolves the WhatsApp Web version to use for NOWEB engine.
   * Returns the built-in Baileys version when WAHA_NOWEB_WA_VERSION is not set, invalid, can not be fetched
   * or is lower than the built-in one (unless WAHA_NOWEB_WA_VERSION_FORCE is set).
   */
  private async resolveWaVersion(): Promise<WAVersion> {
    const env = this.configService.get<string>('WAHA_NOWEB_WA_VERSION', '');
    const wahaversion = esm.b.DEFAULT_CONNECTION_CONFIG.version as WAVersion;
    const force = parseBool(
      this.configService.get('WAHA_NOWEB_WA_VERSION_FORCE', 'false'),
    );
    const options = {
      signal: AbortSignal.timeout(FETCH_WA_VERSION_TIMEOUT_MS),
    };

    let version: WAVersion | null = null;
    switch (env) {
      case WAVersionAutoMode.WEB: {
        const value = await esm.b.fetchLatestWaWebVersion(options);
        if (!value.isLatest) {
          this.logger.warn(
            `WAHA_NOWEB_WA_VERSION='${env}' - failed to fetch the latest WhatsApp Web version: ${value.error}`,
          );
          return wahaversion;
        }
        this.logger.info(
          `WAHA_NOWEB_WA_VERSION='${env}' - fetched the latest WhatsApp Web version: ${formatWaVersion(
            value.version,
          )}`,
        );
        version = value.version;
        break;
      }
      case WAVersionAutoMode.BAILEYS: {
        const value = await esm.b.fetchLatestBaileysVersion(options);
        if (!value.isLatest) {
          this.logger.warn(
            `WAHA_NOWEB_WA_VERSION='${env}' - failed to fetch the latest WhatsApp Web version: ${value.error}`,
          );
          return wahaversion;
        }
        this.logger.info(
          `WAHA_NOWEB_WA_VERSION='${env}' - fetched the latest WhatsApp Web version: ${formatWaVersion(
            value.version,
          )}`,
        );
        version = value.version;
        break;
      }
      case '':
        break;
      default:
        version = parseWaVersion(env);
    }

    if (!version && env) {
      this.logger.warn(
        `WAHA_NOWEB_WA_VERSION='${env}' - invalid format, expected 'x.y.z', '${WAVersionAutoMode.WEB}' or '${WAVersionAutoMode.BAILEYS}'.`,
      );
      return wahaversion;
    }

    if (!version && force) {
      this.logger.warn(
        `WAHA_NOWEB_WA_VERSION_FORCE is set, but WAHA_NOWEB_WA_VERSION is not.`,
      );
      return wahaversion;
    }

    if (!version) {
      return wahaversion;
    }

    if (force && version) {
      this.logger.debug(
        `Using WAHA_NOWEB_WA_VERSION because of WAHA_NOWEB_WA_VERSION_FORCE.`,
      );
      return version;
    }

    if (isWaVersionHigher(wahaversion, version)) {
      this.logger.debug(
        `Built-in wa.version is higher than WAHA_NOWEB_WA_VERSION, using built-in version.`,
      );
      return wahaversion;
    }
    return version;
  }
}
