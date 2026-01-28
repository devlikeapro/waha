import * as inspector from 'node:inspector';
import * as v8 from 'node:v8';
import { Readable } from 'node:stream';

import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Query,
  StreamableFile,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WhatsappConfigService } from '@waha/config.service';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';
import {
  BrowserTraceQuery,
  CpuProfileQuery,
} from '@waha/structures/server.debug.dto';
import { createReadStream } from 'fs';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanServer } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/server/debug')
@ApiTags('🔍 Observability')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanServer(Action.Manage))
export class ServerDebugController {
  private logger: Logger;
  private readonly enabled: boolean;

  constructor(
    private config: WhatsappConfigService,
    private manager: SessionManager,
  ) {
    this.logger = new Logger('ServerDebugController');
    this.enabled = this.config.debugModeEnabled;
  }

  @Get('cpu')
  @ApiOperation({
    summary: 'Collect and return a CPU profile for the current nodejs process',
    description: 'Uses the Node.js inspector profiler to capture a .cpuprofile',
  })
  @UsePipes(new WAHAValidationPipe())
  async cpuProfile(@Query() query: CpuProfileQuery) {
    if (!this.enabled) {
      throw new NotFoundException('WAHA_DEBUG_MODE is disabled');
    }
    const { seconds } = query;
    this.logger.log(`Collecting CPU profile for ${seconds}s...`);

    const session = new inspector.Session();
    session.connect();

    const profile = await new Promise<inspector.Profiler.Profile>(
      (resolve, reject) => {
        session.post('Profiler.enable', (enableError) => {
          if (enableError) {
            session.disconnect();
            return reject(enableError);
          }
          session.post('Profiler.start', (startError) => {
            if (startError) {
              session.disconnect();
              return reject(startError);
            }
            setTimeout(() => {
              session.post('Profiler.stop', (stopError, params) => {
                session.disconnect();
                if (stopError) {
                  return reject(stopError);
                }
                resolve(params.profile);
              });
            }, seconds * 1000);
          });
        });
      },
    );

    const filename = `CPU.${Date.now()}.${process.pid}.cpuprofile`;
    const stream = Readable.from([JSON.stringify(profile)]);
    return new StreamableFile(stream, {
      type: 'application/json',
      disposition: `attachment; filename=${filename}`,
    });
  }

  @Get('heapsnapshot')
  @ApiOperation({
    summary: 'Return a heapsnapshot for the current nodejs process',
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

  @Get('browser/trace/:session')
  @ApiOperation({
    summary: 'Collect and get a trace.json for Chrome DevTools ',
    description: 'Uses https://pptr.dev/api/puppeteer.tracing',
  })
  @SessionApiParam
  @UsePipes(new WAHAValidationPipe())
  async browserTrace(
    @WorkingSessionParam session: WhatsappSession,
    @Query() query: BrowserTraceQuery,
  ) {
    if (!this.enabled) {
      throw new NotFoundException('WAHA_DEBUG_MODE is disabled');
    }
    const filepath = await session.browserTrace(query);
    const stream = createReadStream(filepath);
    const filename = `trace - ${session.name} - ${new Date()}.json`;
    return new StreamableFile(stream, {
      type: 'application/octet-stream',
      disposition: `attachment; filename=${filename}`,
    });
  }
}
