import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { parseBool } from '../../helpers';
import { WAHAEngine } from '../../structures/enums.dto';
import { getEngineName } from '../../version';

@Injectable()
export class EngineConfigService {
  private logger: Logger;

  constructor(protected configService: ConfigService) {
    this.logger = new Logger('EngineConfigService');
  }

  getDefaultEngineName(): WAHAEngine {
    const value = getEngineName();
    if (value in WAHAEngine) {
      return WAHAEngine[value];
    }
    this.logger.warn(
      `Unknown WhatsApp default engine WHATSAPP_DEFAULT_ENGINE=${value}. Using WEBJS`,
    );
    return WAHAEngine.WEBJS;
  }

  get shouldPrintQR(): boolean {
    const value = this.configService.get('WAHA_PRINT_QR', true);
    return parseBool(value);
  }
}
