import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { parseBool } from '../../helpers';

@Injectable()
export class EngineConfigService {
  constructor(protected configService: ConfigService) {}

  get shouldPrintQR(): boolean {
    const value = this.configService.get('WAHA_PRINT_QR', true);
    return parseBool(value);
  }
}
