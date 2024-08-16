import * as process from 'node:process';

import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { getApp } from '@waha/main';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import { WAHAEnvironment } from '@waha/structures/environment.dto';
import {
  EnvironmentQuery,
  ServerStatusResponse,
  StopRequest,
} from '@waha/structures/server.dto';
import { VERSION } from '@waha/version';
import * as lodash from 'lodash';

@ApiSecurity('api_key')
@Controller('api/server')
@ApiTags('🔍 Observability')
export class ServerController {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ServerController');
  }

  @Get('version')
  @ApiOperation({ summary: 'Get the version of the server' })
  get(): WAHAEnvironment {
    return VERSION;
  }

  @Get('environment')
  @ApiOperation({ summary: 'Return the server environment' })
  environment(
    @Query(new WAHAValidationPipe()) query: EnvironmentQuery,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): object {
    let result = process.env;
    if (!query.all) {
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

  @Get('status')
  @ApiOperation({ summary: 'The server status' })
  async status(): Promise<ServerStatusResponse> {
    const now = Date.now();
    const uptime = Math.floor(process.uptime() * 1000);
    const startTimestamp = now - uptime;
    return {
      startTimestamp: startTimestamp,
      uptime: uptime,
    };
  }

  @Post('stop')
  @ApiOperation({
    summary: 'Stop (and restart) the server',
    description:
      "If you're using docker, after calling this endpoint Docker will start a new container, " +
      'so you can use this endpoint to restart the server',
  })
  @UsePipes(new WAHAValidationPipe())
  async stop(@Body() request: StopRequest) {
    const timeout = 1_000;
    if (request.force) {
      this.logger.log(`Force stopping the server in ${timeout}ms`);
      setTimeout(() => {
        this.logger.log('Force stopping the server');
        process.kill(process.pid, 'SIGKILL');
      }, timeout);
    } else {
      this.logger.log(`Gracefully stopping the server in ${timeout}ms`);
      setTimeout(async () => {
        this.logger.log('Gracefully closing the application...');
        const app = getApp();
        if (app) {
          await app.close();
        }
        this.logger.log('Application closed');
        process.exit(0);
      }, timeout);
    }
  }
}
