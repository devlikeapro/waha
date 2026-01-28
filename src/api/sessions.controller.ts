import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
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
  AppsService,
  IAppsService,
} from '@waha/apps/app_sdk/services/IAppsService';
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

@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('🖥️ Sessions')
@UseGuards(PoliciesGuard)
class SessionsController {
  constructor(
    private manager: SessionManager,
    @Inject(AppsService) private appsService: IAppsService,
  ) {}

  private withLock(name: string, fn: () => any) {
    return this.manager.withLock(name, fn);
  }

  @Get('/')
  @ApiOperation({
    summary: 'List all sessions',
  })
  @CheckPolicies(CanSession(Action.List))
  @ApiOAuth2(['read:items'])
  async list(
    @Query(new WAHAValidationPipe()) query: ListSessionsQuery,
    @Req() req,
  ): Promise<SessionInfo[]> {
    let sessions = await this.manager.getSessions(query.all);
    if (!req.user.isAdmin) {
      sessions = FilterSessions(req.ability, Action.Read, sessions);
    }
    if (query.expand?.includes(SessionExpand.apps)) {
      for (const session of sessions) {
        session.apps = await this.appsService.list(this.manager, session.name);
      }
    }
    return sessions;
  }

  @Get('/:session')
  @ApiOperation({ summary: 'Get session information' })
  @SessionApiParam
  @CheckPolicies(CanSession(Action.Use, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async get(
    @Param('session') name: string,
    @Query() query: SessionInfoQuery,
  ): Promise<SessionInfo> {
    const session = await this.manager.getSessionInfo(name);
    if (session === null) {
      throw new NotFoundException('Session not found');
    }
    if (query.expand?.includes(SessionExpand.apps)) {
      session.apps = await this.appsService.list(this.manager, name);
    }
    return session;
  }

  @Get(':session/me')
  @SessionApiParam
  @ApiOperation({ summary: 'Get information about the authenticated account' })
  @CheckPolicies(CanSession(Action.Use, FromParam('session')))
  getMe(@SessionParam session: WhatsappSession): MeInfo | null {
    return session.getSessionMeInfo();
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
    const name = request.name || generatePrefixedId('session');
    await this.withLock(name, async () => {
      if (await this.manager.exists(name)) {
        const msg = `Session '${name}' already exists. Use PUT to update it.`;
        throw new UnprocessableEntityException(msg);
      }
      const config = request.config;
      const start = request.start || false;
      await this.manager.upsert(name, config);
      if (request.apps) {
        await this.appsService.syncSessionApps(
          this.manager,
          name,
          request.apps,
        );
      }
      if (start) {
        await this.manager.assign(name);
        await this.manager.start(name);
      }
    });
    const session = await this.manager.getSessionInfo(name);
    if (request.apps) {
      session.apps = await this.appsService.list(this.manager, name);
    }
    return session;
  }

  @Put(':session')
  @ApiOperation({
    summary: 'Update a session',
    description: '',
  })
  @SessionApiParam
  @ApiBody({ type: SessionUpdateRequest, examples: SessionExamples })
  @CheckPolicies(CanSession(Action.Use, FromParam('session')))
  @UsePipes(new WAHAValidationPipe({ forbidNonWhitelisted: false }))
  async update(
    @Param('session') name: string,
    @Body() request: SessionUpdateRequest,
  ): Promise<SessionDTO> {
    await this.withLock(name, async () => {
      if (!(await this.manager.exists(name))) {
        throw new NotFoundException('Session not found');
      }
      const config = request.config;
      const isRunning = this.manager.isRunning(name);
      await this.manager.stop(name, true);
      await this.manager.upsert(name, config);
      if (request.apps) {
        await this.appsService.syncSessionApps(
          this.manager,
          name,
          request.apps,
        );
      }
      if (isRunning) {
        await this.manager.start(name);
      }
    });
    const session = await this.manager.getSessionInfo(name);
    if (request.apps) {
      session.apps = await this.appsService.list(this.manager, name);
    }
    return session;
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
    await this.withLock(name, async () => {
      await this.manager.unassign(name);
      await this.manager.unpair(name);
      await this.manager.stop(name, true);
      await this.manager.logout(name);
      await this.manager.delete(name);
    });
  }

  @Post(':session/start')
  @SessionApiParam
  @ApiOperation({
    summary: 'Start the session',
    description:
      'Start the session with the given name. The session must exist. Idempotent operation.',
  })
  @CheckPolicies(CanSession(Action.Use, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async start(@Param('session') name: string): Promise<SessionDTO> {
    await this.withLock(name, async () => {
      const exists = await this.manager.exists(name);
      if (!exists) {
        throw new NotFoundException('Session not found');
      }
      await this.manager.assign(name);
      await this.manager.start(name);
    });
    return await this.manager.getSessionInfo(name);
  }

  @Post(':session/stop')
  @SessionApiParam
  @ApiOperation({
    summary: 'Stop the session',
    description: 'Stop the session with the given name. Idempotent operation.',
  })
  @CheckPolicies(CanSession(Action.Use, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async stop(@Param('session') name: string): Promise<SessionDTO> {
    await this.withLock(name, async () => {
      await this.manager.unassign(name);
      await this.manager.stop(name, false);
    });
    return await this.manager.getSessionInfo(name);
  }

  @Post(':session/logout')
  @SessionApiParam
  @ApiOperation({
    summary: 'Logout from the session',
    description: 'Logout the session, restart a session if it was not STOPPED',
  })
  @CheckPolicies(CanSession(Action.Use, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async logout(@Param('session') name: string): Promise<SessionDTO> {
    await this.withLock(name, async () => {
      const exists = await this.manager.exists(name);
      if (!exists) {
        throw new NotFoundException('Session not found');
      }
      const isRunning = this.manager.isRunning(name);
      await this.manager.unpair(name);
      await this.manager.stop(name, true);
      await this.manager.logout(name);
      if (isRunning) {
        await this.manager.start(name);
      }
    });
    return await this.manager.getSessionInfo(name);
  }

  @Post(':session/restart')
  @SessionApiParam
  @ApiOperation({
    summary: 'Restart the session',
    description: 'Restart the session with the given name.',
  })
  @CheckPolicies(CanSession(Action.Use, FromParam('session')))
  @UsePipes(new WAHAValidationPipe())
  async restart(@Param('session') name: string): Promise<SessionDTO> {
    await this.manager.restart(name);
    return await this.manager.getSessionInfo(name);
  }

  @Post('/start/')
  @ApiOperation({
    summary: 'Upsert and Start session',
    description:
      'Create session (if not exists) or update a config (if exists) and start it.',
    deprecated: true,
  })
  @CheckPolicies(CanSession(Action.Use, FromBody('name')))
  async DEPRACATED_start(
    @Body() request: SessionStartDeprecatedRequest,
  ): Promise<SessionDTO> {
    const name = request.name;
    if (!request.name) {
      throw new UnprocessableEntityException('Session name is required');
    }
    if (this.manager.isRunning(name)) {
      const msg = `Session '${name}' is already started.`;
      throw new UnprocessableEntityException(msg);
    }

    return await this.withLock(name, async () => {
      const config = request.config;
      await this.manager.upsert(name, config);
      await this.manager.assign(name);
      return await this.manager.start(name);
    });
  }

  @Post('/stop/')
  @ApiOperation({
    summary: 'Stop (and Logout if asked) session',
    description: 'Stop session and Logout by default.',
    deprecated: true,
  })
  @CheckPolicies(CanSession(Action.Use, FromBody('name')))
  async DEPRECATED_stop(
    @Body() request: SessionStopDeprecatedRequest,
  ): Promise<void> {
    if (!request.name) {
      throw new UnprocessableEntityException('Session name is required');
    }
    const name = request.name;
    if (request.logout) {
      // Old API did remove the session complete
      await this.withLock(name, async () => {
        await this.manager.unassign(name);
        await this.manager.unpair(name);
        await this.manager.stop(name, true);
        await this.manager.logout(name);
        await this.manager.delete(name);
      });
    } else {
      await this.withLock(name, async () => {
        await this.manager.unassign(name);
        await this.manager.stop(name, false);
      });
    }
    return;
  }

  @Post('/logout/')
  @ApiOperation({
    summary: 'Logout and Delete session.',
    description: 'Stop, Logout and Delete session.',
    deprecated: true,
  })
  @CheckPolicies(CanSession(Action.Use, FromBody('name')))
  async DEPRECATED_logout(
    @Body() request: SessionLogoutDeprecatedRequest,
  ): Promise<void> {
    if (!request.name) {
      throw new UnprocessableEntityException('Session name is required');
    }
    const name = request.name;
    await this.withLock(name, async () => {
      await this.manager.unassign(name);
      await this.manager.unpair(name);
      await this.manager.stop(name, true);
      await this.manager.logout(name);
      await this.manager.delete(name);
    });
    return;
  }
}

export { SessionsController };
