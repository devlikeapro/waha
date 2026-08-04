import type { WAVersion } from '@adiwajshing/baileys';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NowebConfig } from '@waha/core/engines/noweb/session.noweb.core';
import {
  isWaVersionHigher,
  parseWaVersion,
} from '@waha/core/engines/noweb/waversion';
import { parseBool } from '@waha/helpers';
import esm from '@waha/vendor/esm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class NowebEngineConfigService {
  private config: NowebConfig | null = null;

  constructor(
    protected configService: ConfigService,
    @InjectPinoLogger('NowebEngineConfigService')
    protected logger: PinoLogger,
  ) {}

  getConfig(): NowebConfig {
    if (!this.config) {
      const version = this.resolveWaVersion();
      this.config = { waVersion: version };
    }
    return this.config;
  }

  /**
   * Resolves the WhatsApp Web version to use for NOWEB engine.
   * Returns undefined when the built-in Baileys version should be used.
   */
  private resolveWaVersion(): WAVersion {
    const value = this.configService.get<string>('WAHA_NOWEB_WA_VERSION', '');
    const envVersion = parseWaVersion(value);
    const version = esm.b.DEFAULT_CONNECTION_CONFIG.version as WAVersion;
    const force = parseBool(
      this.configService.get('WAHA_NOWEB_WA_VERSION_FORCE', 'false'),
    );

    if (!envVersion && value) {
      this.logger.warn(
        `WAHA_NOWEB_WA_VERSION='${value}' - invalid format, expected 'x.y.z'.`,
      );
      return version;
    }

    if (!envVersion && force) {
      this.logger.warn(
        `WAHA_NOWEB_WA_VERSION_FORCE is set, but WAHA_NOWEB_WA_VERSION is not.`,
      );
      return version;
    }

    if (!envVersion) {
      return version;
    }

    if (force && envVersion) {
      this.logger.debug(
        `Using WAHA_NOWEB_WA_VERSION because of WAHA_NOWEB_WA_VERSION_FORCE.`,
      );
      return envVersion;
    }

    if (isWaVersionHigher(version, envVersion)) {
      this.logger.debug(
        `Built-in wa.version is higher than WAHA_NOWEB_WA_VERSION, using built-in version.`,
      );
      return version;
    }
    return envVersion;
  }
}
