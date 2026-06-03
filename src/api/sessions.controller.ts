import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import {
  ApiBody,
  ApiOAuth2,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
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

import { WhatsappSession } from '../core/abc/session.abc';
import {
  ListSessionsQuery,
  MeInfo,
  SessionCreateRequest,
  SessionDTO,
  SessionExpand,
  SessionInfo,
  SessionInfoQuery,
  SessionUpdateRequest,
} from '../structures/sessions.dto';
import { SessionExamples } from './sessions.examples';
import { FilterSessions } from '../core/auth/casl.ability';
import { CheckPolicies } from '../core/auth/policies.decorator';
import { PoliciesGuard } from '../core/auth/policies.guard';
import { CanSession, FromBody, FromParam } from '../core/auth/policies';
import { Action } from '@waha/core/auth/casl.types';
import { SessionService } from '@waha/core/services/SessionService';

@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('🖥️ Sessions')
@UseGuards(PoliciesGuard)
class SessionsController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('/')
  @ApiOperation({ summary: 'List all sessions' })
  @CheckPolicies(CanSession(Action.List))
  @ApiOAuth2(['read:items'])
  async list(
    @Query(new WAHAValidationPipe()) query: ListSessionsQuery,
    @Req() req,
  ): Promise<SessionInfo[]> {
    let sessions = await this.sessionService.getSessions(query.all);
    if (!req.user?.isAdmin) {
      sessions = FilterSessions(req.ability, Action.Retrieve, sessions);
    }
    if (query.expand?.includes(SessionExpand.apps)) {
      await this.sessionService.expandSessionApps(sessions);
    }
    return sessions;
  }

  @Get('/:session')
  @ApiOperation({ summary: 'Get session information' })
  @SessionApiParam
  @CheckPolicies(CanSession(Action.Read, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async get(
    @Param('session') name: string,
    @Query() query: SessionInfoQuery,
  ): Promise<SessionInfo> {
    const session = await this.sessionService.getSession(name);
    if (query.expand?.includes(SessionExpand.apps)) {
      await this.sessionService.expandSessionApps([session]);
    }
    return session;
  }

  @Get(':session/me')
  @SessionApiParam
  @ApiOperation({ summary: 'Get information about the authenticated account' })
  @CheckPolicies(CanSession(Action.Read, FromParam('session')))
  getMe(@SessionParam session: WhatsappSession): MeInfo | null {
    return this.sessionService.getSessionMe(session);
  }

  @Post('')
  @ApiOperation({
    summary: 'Create a session',
    description:
      'Create session a new session (and start it at the same time if required).',
  })
  @ApiBody({ type: SessionCreateRequest, examples: SessionExamples })
  @CheckPolicies(CanSession(Action.Create))
  @UsePipes(new WAHAValidationPipe())
  async create(@Body() request: SessionCreateRequest): Promise<SessionDTO> {
    return this.sessionService.createSession(request);
  }

  @Put(':session')
  @ApiOperation({ summary: 'Update a session' })
  @SessionApiParam
  @ApiBody({ type: SessionUpdateRequest, examples: SessionExamples })
  @CheckPolicies(CanSession(Action.Setting, FromParam('session')))
  @UsePipes(new WAHAValidationPipe({ forbidNonWhitelisted: false }))
  async update(
    @Param('session') name: string,
    @Body() request: SessionUpdateRequest,
  ): Promise<SessionDTO> {
    return this.sessionService.updateSession(name, request);
  }

  @Delete(':session')
  @SessionApiParam
  @ApiOperation({
    summary: 'Delete the session',
    description:
      'Delete the session with the given name. Stop and logout as well. Idempotent operation.',
  })
  @CheckPolicies(CanSession(Action.Delete, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async delete(@Param('session') name: string): Promise<void> {
    return this.sessionService.deleteSession(name);
  }

  @Post(':session/start')
  @SessionApiParam
  @ApiOperation({
    summary: 'Start the session',
    description:
      'Start the session with the given name. The session must exist. Idempotent operation.',
  })
  @CheckPolicies(CanSession(Action.Control, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async start(@Param('session') name: string): Promise<SessionDTO> {
    return this.sessionService.startSession(name);
  }

  @Post(':session/stop')
  @SessionApiParam
  @ApiOperation({
    summary: 'Stop the session',
    description: 'Stop the session with the given name. Idempotent operation.',
  })
  @CheckPolicies(CanSession(Action.Control, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async stop(@Param('session') name: string): Promise<SessionDTO> {
    return this.sessionService.stopSession(name);
  }

  @Post(':session/logout')
  @SessionApiParam
  @ApiOperation({
    summary: 'Logout from the session',
    description: 'Logout the session, restart a session if it was not STOPPED',
  })
  @CheckPolicies(CanSession(Action.Control, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async logout(@Param('session') name: string): Promise<SessionDTO> {
    return this.sessionService.logoutSession(name);
  }

  @Post(':session/restart')
  @SessionApiParam
  @ApiOperation({
    summary: 'Restart the session',
    description: 'Restart the session with the given name.',
  })
  @CheckPolicies(CanSession(Action.Control, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async restart(@Param('session') name: string): Promise<SessionDTO> {
    return this.sessionService.restartSession(name);
  }

  @Post('/start/')
  @ApiOperation({
    summary: 'Upsert and Start session',
    description:
      'Create session (if not exists) or update a config (if exists) and start it.',
    deprecated: true,
  })
  @CheckPolicies(CanSession(Action.Control, FromBody('name')))
  async DEPRACATED_start(
    @Body() request: SessionStartDeprecatedRequest,
  ): Promise<SessionDTO> {
    if (!request.name) {
      throw new UnprocessableEntityException('Session name is required');
    }
    if (this.sessionService.isSessionRunning(request.name)) {
      throw new UnprocessableEntityException(
        `Session '${request.name}' is already started.`,
      );
    }
    return this.sessionService.upsertAndStartSession(
      request.name,
      request.config,
    );
  }

  @Post('/stop/')
  @ApiOperation({
    summary: 'Stop (and Logout if asked) session',
    description: 'Stop session and Logout by default.',
    deprecated: true,
  })
  @CheckPolicies(CanSession(Action.Control, FromBody('name')))
  async DEPRECATED_stop(
    @Body() request: SessionStopDeprecatedRequest,
  ): Promise<void> {
    if (!request.name) {
      throw new UnprocessableEntityException('Session name is required');
    }
    if (request.logout) {
      await this.sessionService.deleteSession(request.name);
    } else {
      await this.sessionService.stopSession(request.name);
    }
  }

  @Post('/logout/')
  @ApiOperation({
    summary: 'Logout and Delete session.',
    description: 'Stop, Logout and Delete session.',
    deprecated: true,
  })
  @CheckPolicies(CanSession(Action.Control, FromBody('name')))
  async DEPRECATED_logout(
    @Body() request: SessionLogoutDeprecatedRequest,
  ): Promise<void> {
    if (!request.name) {
      throw new UnprocessableEntityException('Session name is required');
    }
    await this.sessionService.deleteSession(request.name);
  }
}

export { SessionsController };
