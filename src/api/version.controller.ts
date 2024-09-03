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
@ApiTags('🔍 Observability')
export class VersionController {
  @Get('')
  @ApiOperation({
    summary: 'Get the server version ',
    deprecated: true,
    description: "Use 'GET /api/server/version' instead ",
  })
  get(): WAHAEnvironment {
    return VERSION;
  }
}
