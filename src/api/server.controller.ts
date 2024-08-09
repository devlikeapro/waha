import * as process from 'node:process';

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { parseBool } from '@waha/helpers';
import { WAHAEnvironment } from '@waha/structures/environment.dto';
import { EnvironmentQuery } from '@waha/structures/server.dto';
import { VERSION } from '@waha/version';
import * as lodash from 'lodash';

interface EnvironmentVariables {
  [key: string]: string;
}

@Controller('api/server')
@ApiTags('other')
export class ServerController {
  @Get('version')
  @ApiOperation({ summary: 'Get the version of the server' })
  get(): WAHAEnvironment {
    return VERSION;
  }

  @Get('environment')
  @ApiOperation({ summary: 'Return the server environment' })
  // eslint-disable-next-line @typescript-eslint/ban-types
  environment(@Query() query: EnvironmentQuery): object {
    let result = process.env;
    const all = parseBool(query.all);
    if (!all) {
      result = lodash.pickBy(result, (value, key) => {
        return (
          key.startsWith('WAHA_') ||
          key.startsWith('WHATSAPP_') ||
          key === 'DEBUG'
        );
      });
    }
    const map = new Map<string, string>();
    // sort and set
    Object.keys(result)
      .sort()
      .forEach((key) => {
        map.set(key, result[key]);
      });
    return Object.fromEntries(map);
  }
}
