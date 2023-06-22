import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { parseBool } from '../helpers';
import {
  ListSessionsQuery,
  SessionDTO,
  SessionLogoutRequest,
  SessionStartRequest,
  SessionStopRequest,
} from '../structures/sessions.dto';

@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('sessions')
export class SessionsController {
  constructor(private manager: SessionManager) {}

  @Post('/start/')
  async start(@Body() request: SessionStartRequest): Promise<SessionDTO> {
    const result = await this.manager.start(request);
    await this.manager.sessionStorage.configRepository.save(
      request.name,
      request.config,
    );
    return result;
  }

  @Post('/stop/')
  @ApiOperation({ summary: 'Stop session' })
  async stop(@Body() request: SessionStopRequest): Promise<void> {
    await this.manager.stop(request);
    if (request.logout) {
      await this.manager.logout(request);
    }
    return;
  }

  @Post('/logout/')
  @ApiOperation({ summary: 'Logout from session.' })
  clean(@Body() request: SessionLogoutRequest): Promise<void> {
    const session = this.manager.getSession(request.name, false);
    if (session) {
      throw new UnprocessableEntityException(
        `Can not clean running session, please stop it first. You can set 'clean' field to 'True' in stop request so it stops and cleans at the same time.`,
      );
    }
    return this.manager.logout(request);
  }

  @Get('/')
  async list(@Query() query: ListSessionsQuery): Promise<SessionDTO[]> {
    const all = parseBool(query.all);
    return this.manager.getSessions(all);
  }
}
