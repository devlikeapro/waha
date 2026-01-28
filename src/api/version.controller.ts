import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { WAHAEnvironment } from '../structures/environment.dto';
import { VERSION } from '../version';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanServer } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/version')
@ApiTags('🔍 Observability')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanServer(Action.Read))
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
