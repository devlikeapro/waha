import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  SessionApiParam,
  SessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import { WAHAValidationPipe } from '@waha/nestjs/pipes/WAHAValidationPipe';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  ListSessionsQuery,
  MeInfo,
  SessionDTO,
  SessionInfo,
  SessionLogoutRequest,
  SessionStartRequest,
  SessionStopRequest,
} from '../structures/sessions.dto';

@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('sessions')
class SessionsController {
  constructor(private manager: SessionManager) {}

  @Post('/start/')
  @UsePipes(new WAHAValidationPipe())
  async start(@Body() request: SessionStartRequest): Promise<SessionDTO> {
    const result = await this.manager.start(request);
    await this.manager.sessionConfigRepository.save(
      request.name,
      request.config || null,
    );
    return result;
  }

  @Post('/stop/')
  @UsePipes(new WAHAValidationPipe())
  @ApiOperation({ summary: 'Stop session' })
  async stop(@Body() request: SessionStopRequest): Promise<void> {
    if (request.logout) {
      await this.manager.logout(request);
    } else {
      await this.manager.stop(request);
    }
    return;
  }

  @Post('/logout/')
  @UsePipes(new WAHAValidationPipe())
  @ApiOperation({ summary: 'Logout from session.' })
  clean(@Body() request: SessionLogoutRequest): Promise<void> {
    return this.manager.logout(request);
  }

  @Get('/')
  list(
    @Query(new WAHAValidationPipe()) query: ListSessionsQuery,
  ): Promise<SessionInfo[]> {
    return this.manager.getSessions(query.all);
  }

  @Get('/:session')
  @UsePipes(new WAHAValidationPipe())
  async get(@Param('session') name: string): Promise<SessionInfo> {
    const session = this.manager.getSessionInfo(name);
    if (session === null) {
      throw new NotFoundException('Session not found');
    }
    return session;
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
  getMe(@SessionParam session: WhatsappSession): MeInfo | null {
    return session.getSessionMeInfo();
  }
}

export { SessionController, SessionsController };
