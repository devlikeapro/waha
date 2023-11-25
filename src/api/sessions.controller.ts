import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import { parseBool } from '../helpers';
import {
  ListSessionsQuery,
  MeInfo,
  SessionDTO,
  SessionInfo,
  SessionLogoutRequest,
  SessionStartRequest,
  SessionStopRequest,
} from '../structures/sessions.dto';
import { SessionApiParam, SessionParam } from './helpers';

@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('sessions')
class SessionsController {
  constructor(private manager: SessionManager) {}

  @Post('/start/')
  async start(@Body() request: SessionStartRequest): Promise<SessionDTO> {
    const result = await this.manager.start(request);
    await this.manager.sessionStorage.configRepository.save(
      request.name,
      request.config || null,
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
    return this.manager.logout(request);
  }

  @Get('/')
  async list(@Query() query: ListSessionsQuery): Promise<SessionInfo[]> {
    const all = parseBool(query.all);
    return this.manager.getSessions(all);
  }
}

@ApiSecurity('api_key')
@Controller('api/sessions/:session')
@ApiTags('sessions')
class SessionController {
  constructor(private manager: SessionManager) {}

  @Get('me')
  @SessionApiParam
  @ApiOperation({ summary: 'Get information about the authenticated account' })
  getMe(@SessionParam session: WhatsappSession): Promise<MeInfo | null> {
    return session.getSessionMeInfo();
  }
}

export { SessionController, SessionsController };
