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
import { WAHASessionStatus } from '@waha/structures/enums.dto';
import {
  SessionLogoutDeprecatedRequest,
  SessionStartDeprecatedRequest,
  SessionStopDeprecatedRequest,
} from '@waha/structures/sessions.deprecated.dto';
import { generatePrefixedId } from '@waha/utils/ids';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  ListSessionsQuery,
  MeInfo,
  SessionCreateRequest,
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
  @SessionApiParam
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

  @Post('')
  @ApiOperation({
    summary: 'Create a session',
    description:
      'Create session a new session (and start it at the same time if required).',
  })
  @UsePipes(new WAHAValidationPipe())
  async create(@Body() request: SessionCreateRequest): Promise<SessionDTO> {
    const name = request.name || generatePrefixedId('session');
    if (this.manager.isRunning(name)) {
      const msg = `Session '${name}' is already started.`;
      throw new UnprocessableEntityException(msg);
    }

    if (await this.manager.exists(name)) {
      const msg = `Session '${name}' already exists. Use PUT to update it.`;
      throw new UnprocessableEntityException(msg);
    }

    const config = request.config;
    const start = request.start || false;
    await this.manager.upsert(name, config);
    if (start) {
      await this.manager.start(name);
    }
    return await this.manager.getSessionInfo(name);
  }

  @Post(':session/start')
  @SessionApiParam
  @ApiOperation({
    summary: 'Start a session',
    description: 'Start a session with the given name.',
  })
  @UsePipes(new WAHAValidationPipe())
  async start(@Param('session') name: string): Promise<SessionDTO> {
    const exists = await this.manager.exists(name);
    if (!exists) {
      throw new NotFoundException('Session not found');
    }
    return await this.manager.start(name);
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
