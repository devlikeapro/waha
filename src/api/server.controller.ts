import * as process from 'node:process';
import * as v8 from 'node:v8';

import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Post,
  Query,
  StreamableFile,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WhatsappConfigService } from '@waha/config.service';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import { WAHAEnvironment } from '@waha/structures/environment.dto';
import {
  EnvironmentQuery,
  ServerStatusResponse,
  StopRequest,
  StopResponse,
} from '@waha/structures/server.dto';
import { sleep } from '@waha/utils/promiseTimeout';
import { VERSION } from '@waha/version';
import * as lodash from 'lodash';

@ApiSecurity('api_key')
@Controller('api/server')
@ApiTags('🔍 Observability')
export class ServerController {
  private logger: Logger;

  constructor(private config: WhatsappConfigService) {
    this.logger = new Logger('ServerController');
  }

  @Get('version')
  @ApiOperation({ summary: 'Get the version of the server' })
  get(): WAHAEnvironment {
    return VERSION;
  }

  @Get('environment')
  @ApiOperation({ summary: 'Get the server environment' })
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
  @ApiOperation({ summary: 'Get the server status' })
  async status(): Promise<ServerStatusResponse> {
    const now = Date.now();
    const uptime = Math.floor(process.uptime() * 1000);
    const startTimestamp = now - uptime;
    return {
      startTimestamp: startTimestamp,
      uptime: uptime,
      worker: {
        id: this.config.workerId,
      },
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
  async stop(@Body() request: StopRequest): Promise<StopResponse> {
    const timeout = 1_000;
    if (request.force) {
      this.logger.log(`Force stopping the server in ${timeout}ms`);
      setTimeout(() => {
        this.logger.log('Force stopping the server');
        process.kill(process.pid, 'SIGKILL');
        process.exit(0);
      }, timeout);
    } else {
      this.logger.log(`Gracefully stopping the server in ${timeout}ms`);
      setTimeout(async () => {
        this.logger.log('Gracefully closing the application...');
        process.kill(process.pid, 'SIGTERM');
        await sleep(10_000);
        process.exit(0);
      }, timeout);
    }
    return { stopping: true };
  }
}

@ApiSecurity('api_key')
@Controller('api/server/debug')
@ApiTags('🔍 Observability')
export class ServerDebugController {
  private logger: Logger;
  private readonly enabled: boolean;

  constructor(protected config: WhatsappConfigService) {
    this.logger = new Logger('ServerDebugController');
    this.enabled = this.config.debugModeEnabled;
  }

  @Get('heapsnapshot')
  @ApiOperation({
    summary: 'Return a heapsnapshot',
    description: "Return a heapsnapshot of the server's memory",
  })
  async heapsnapshot() {
    if (!this.enabled) {
      throw new NotFoundException('WAHA_DEBUG_MODE is disabled');
    }
    this.logger.log('Creating a heap snapshot...');
    const heap = v8.getHeapSnapshot();
    const fileName = `${Date.now()}.heapsnapshot`;
    return new StreamableFile(heap, {
      type: 'application/octet-stream',
      disposition: `attachment; filename=${fileName}`,
    });
  }
}
