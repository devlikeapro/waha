import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { parseBool } from '../../helpers';

@Injectable()
export class SwaggerConfigServiceCore {
  constructor(
    protected configService: ConfigService,
    @InjectPinoLogger('SwaggerConfigService')
    protected logger: PinoLogger,
  ) {}

  get advancedConfigEnabled(): boolean {
    const value = this.configService.get(
      'WHATSAPP_SWAGGER_CONFIG_ADVANCED',
      false,
    );
    return parseBool(value);
  }
}
