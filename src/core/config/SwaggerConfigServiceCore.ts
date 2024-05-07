import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { parseBool } from '../../helpers';

@Injectable()
export class SwaggerConfigServiceCore {
  constructor(protected configService: ConfigService) {}

  get advancedConfigEnabled(): boolean {
    const value = this.configService.get(
      'WHATSAPP_SWAGGER_CONFIG_ADVANCED',
      false,
    );
    return parseBool(value);
  }
}
