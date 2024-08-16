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
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { getApp, getAppModuleInstance } from '@waha/main';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import { WAHAEnvironment } from '@waha/structures/environment.dto';
import {
  EnvironmentQuery,
  ServerStatusResponse,
  StopRequest,
} from '@waha/structures/server.dto';
import { VERSION } from '@waha/version';
import * as lodash from 'lodash';

@Controller('api/server')
@ApiTags('other')
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
    const appModule = await getAppModuleInstance();
    if (!appModule) {
      throw new UnprocessableEntityException('AppModule not found');
    }
    const now = Date.now();
    const startTimestamp = appModule.startTimestamp;
    return {
      startTimestamp: startTimestamp,
      uptime: now - startTimestamp,
    };
  }

  @Post('stop')
  @ApiOperation({ summary: 'Stop the server' })
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
