import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NowebConfig } from '@waha/core/engines/noweb/session.noweb.core';

@Injectable()
export class NowebEngineConfigService {
  constructor(protected configService: ConfigService) {}

  getConfig(): NowebConfig {
    const waVersion = this.configService.get<string>(
      'WAHA_NOWEB_WA_VERSION',
      undefined,
    );
    return {
      waVersion: this.parseVersion(waVersion),
    };
  }

  private parseVersion(
    version: string | undefined,
  ): [number, number, number] | undefined {
    if (!version) {
      return undefined;
    }
    const parts = version.split('.').map((part) => parseInt(part, 10));
    if (parts.length !== 3 || parts.some((part) => isNaN(part))) {
      throw new Error(
        `Invalid WAHA_NOWEB_WA_VERSION '${version}', expected format 'X.Y.Z'`,
      );
    }
    return parts as [number, number, number];
  }
}
