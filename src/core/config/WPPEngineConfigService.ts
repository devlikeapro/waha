import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WPPConfig } from '@waha/core/engines/wpp/WppConfig';

@Injectable()
export class WPPEngineConfigService {
  constructor(protected configService: ConfigService) {}

  getConfig(): WPPConfig {
    let webVersion = this.configService.get<string>(
      'WAHA_WPP_WEB_VERSION',
      undefined,
    );
    if (!webVersion) {
      webVersion = this.configService.get<string>(
        'WAHA_WEBJS_WEB_VERSION',
        undefined,
      );
    }
    return {
      webVersion: webVersion,
      puppeteerArgs: this.getPuppeterArgs(),
    };
  }

  getPuppeterArgs(): string[] {
    let args = this.configService.get<string>('WAHA_WPP_PUPPETER_ARGS', '');
    if (!args) {
      args = this.configService.get<string>('WAHA_WEBJS_PUPPETER_ARGS', '');
    }
    return args
      .split(' ')
      .map((arg) => arg.trim())
      .filter(Boolean);
  }
}
