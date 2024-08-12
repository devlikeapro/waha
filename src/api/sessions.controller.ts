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
import {
  SessionLogoutDeprecatedRequest,
  SessionStartDeprecatedRequest,
  SessionStopDeprecatedRequest,
} from '@waha/structures/sessions.deprecated.dto';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  ListSessionsQuery,
  MeInfo,
  SessionDTO,
  SessionInfo,
} from '../structures/sessions.dto';

@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('sessions')
class SessionsController {
  constructor(private manager: SessionManager) {}

  @Get('/')
  @ApiOperation({ summary: 'List all sessions' })
  list(
    @Query(new WAHAValidationPipe()) query: ListSessionsQuery,
  ): Promise<SessionInfo[]> {
    return this.manager.getSessions(query.all);
  }

  @Get('/:session')
  @ApiOperation({ summary: 'Get session information' })
  @UsePipes(new WAHAValidationPipe())
  async get(@Param('session') name: string): Promise<SessionInfo> {
    const session = this.manager.getSessionInfo(name);
    if (session === null) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  @Get(':session/me')
  @SessionApiParam
  @ApiOperation({ summary: 'Get information about the authenticated account' })
  getMe(@SessionParam session: WhatsappSession): MeInfo | null {
    return session.getSessionMeInfo();
  }
}

@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('sessions')
class SessionsDeprecatedController {
  constructor(private manager: SessionManager) {}

  @Post('/start/')
  @ApiOperation({
    summary: 'Upsert and Start session',
    description:
      'Create session (if not exists) or update a config (if exists) and start it.',
    deprecated: true,
  })
  @UsePipes(new WAHAValidationPipe())
  async start(
    @Body() request: SessionStartDeprecatedRequest,
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
  @ApiOperation({
    summary: 'Stop (and Logout if asked) session',
    description: 'Stop session and Logout by default.',
    deprecated: true,
  })
  @UsePipes(new WAHAValidationPipe())
  async stop(@Body() request: SessionStopDeprecatedRequest): Promise<void> {
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
  @ApiOperation({
    summary: 'Logout and Delete session.',
    description: 'Stop, Logout and Delete session.',
    deprecated: true,
  })
  @UsePipes(new WAHAValidationPipe())
  async logout(@Body() request: SessionLogoutDeprecatedRequest): Promise<void> {
    const name = request.name;
    await this.manager.stop(name, true);
    await this.manager.logout(name);
    await this.manager.delete(name);
    return;
  }
}

export { SessionsController, SessionsDeprecatedController };
