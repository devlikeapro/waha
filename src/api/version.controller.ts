import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { WAHAEnvironment } from '../structures/environment.dto';
import { VERSION } from '../version';

@ApiSecurity('api_key')
@Controller('api/version')
@ApiTags('other')
export class VersionController {
  @Get('')
  get(): WAHAEnvironment {
    return VERSION;
  }
}
