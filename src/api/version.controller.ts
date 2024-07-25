import { Controller, Get } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { WAHAEnvironment } from '../structures/environment.dto';
import { VERSION } from '../version';

@ApiSecurity('api_key')
@Controller('api/version')
@ApiTags('other')
export class VersionController {
  @Get('')
  @ApiOperation({ summary: 'Get the version of the server' })
  get(): WAHAEnvironment {
    return VERSION;
  }
}
