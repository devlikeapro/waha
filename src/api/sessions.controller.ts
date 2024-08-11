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
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
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
  async start_DEPRECATED(
    @Body() request: SessionStartRequest,
  ): Promise<SessionDTO> {
    const name = request.name;
    if (this.manager.isRunning(name)) {
      const msg = `Session '${name}' is already started.`;
      throw new UnprocessableEntityException(msg);
    }

    const config = request.config;
    if (config) {
      await this.manager.upsert(name, config);
    }
    return await this.manager.start(name);
  }

  @Post('/stop/')
  @UsePipes(new WAHAValidationPipe())
  @ApiOperation({ summary: 'Stop session' })
  async stop_DEPRECATED(@Body() request: SessionStopRequest): Promise<void> {
    const name = request.name;
    if (request.logout) {
      // Old API did remove the session complete
      await this.manager.stop(name, true);
      await this.manager.logout(name);
      await this.manager.delete(name);
    } else {
      await this.manager.stop(name, false);
    }
    return;
  }

  @Post('/logout/')
  @UsePipes(new WAHAValidationPipe())
  @ApiOperation({ summary: 'Logout from session.' })
  async logout_DEPRECATED(
    @Body() request: SessionLogoutRequest,
  ): Promise<void> {
    const name = request.name;
    await this.manager.stop(name, true);
    await this.manager.logout(name);
    await this.manager.delete(name);
    return;
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
