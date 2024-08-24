import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { sleep } from '@waha/utils/promiseTimeout';

import { SessionManager } from '../core/abc/manager.abc';
import { WhatsappSession } from '../core/abc/session.abc';
import {
  ListSessionsQuery,
  MeInfo,
  SessionCreateRequest,
  SessionDTO,
  SessionInfo,
  SessionUpdateRequest,
} from '../structures/sessions.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncLock = require('async-lock');

@ApiSecurity('api_key')
@Controller('api/sessions')
@ApiTags('🖥️ Sessions')
class SessionsController {
  private lock: any;

  constructor(private manager: SessionManager) {
    this.lock = new AsyncLock({ maxPending: Infinity });
  }

  private withLock(name: string, fn: () => any) {
    return this.lock.acquire(name, fn);
  }

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
    await this.withLock(name, async () => {
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
    });
    return await this.manager.getSessionInfo(name);
  }

  @Put(':session')
  @ApiOperation({
    summary: 'Update a session',
    description: '',
  })
  @SessionApiParam
  @UsePipes(new WAHAValidationPipe())
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
      if (isRunning) {
        await this.manager.start(name);
      }
    });
    return await this.manager.getSessionInfo(name);
  }

  @Delete(':session')
  @SessionApiParam
  @ApiOperation({
    summary: 'Delete the session',
    description:
      'Delete the session with the given name. Stop and logout as well. Idempotent operation.',
  })
  @UsePipes(new WAHAValidationPipe())
  async delete(@Param('session') name: string): Promise<void> {
    await this.withLock(name, async () => {
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
      'Start the session with the given name. The session must exist. Identity operation.',
  })
  @UsePipes(new WAHAValidationPipe())
  async start(@Param('session') name: string): Promise<SessionDTO> {
    await this.withLock(name, async () => {
      const exists = await this.manager.exists(name);
      if (!exists) {
        throw new NotFoundException('Session not found');
      }
      const isRunning = this.manager.isRunning(name);
      if (!isRunning) {
        await this.manager.start(name);
      }
    });
    return await this.manager.getSessionInfo(name);
  }

  @Post(':session/stop')
  @SessionApiParam
  @ApiOperation({
    summary: 'Stop the session',
    description: 'Stop the session with the given name. Idempotent operation.',
  })
  @UsePipes(new WAHAValidationPipe())
  async stop(@Param('session') name: string): Promise<SessionDTO> {
    await this.withLock(name, async () => {
      const exists = await this.manager.exists(name);
      if (!exists) {
        throw new NotFoundException('Session not found');
      }
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
  @UsePipes(new WAHAValidationPipe())
  async logout(@Param('session') name: string): Promise<SessionDTO> {
    await this.withLock(name, async () => {
      const exists = await this.manager.exists(name);
      if (!exists) {
        throw new NotFoundException('Session not found');
      }
      const isRunning = this.manager.isRunning(name);
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
  @UsePipes(new WAHAValidationPipe())
  async restart(@Param('session') name: string): Promise<SessionDTO> {
    await this.withLock(name, async () => {
      const exists = await this.manager.exists(name);
      if (!exists) {
        throw new NotFoundException('Session not found');
      }
      await this.manager.stop(name, true);
      await this.manager.start(name);
    });

    return await this.manager.getSessionInfo(name);
  }

  @Post('/start/')
  @ApiOperation({
    summary: 'Upsert and Start session',
    description:
      'Create session (if not exists) or update a config (if exists) and start it.',
    deprecated: true,
  })
  async DEPRACATED_start(
    @Body() request: SessionStartDeprecatedRequest,
  ): Promise<SessionDTO> {
    const name = request.name;
    if (this.manager.isRunning(name)) {
      const msg = `Session '${name}' is already started.`;
      throw new UnprocessableEntityException(msg);
    }

    return await this.withLock(name, async () => {
      const config = request.config;
      if (config) {
        await this.manager.upsert(name, config);
      }
      return await this.manager.start(name);
    });
  }

  @Post('/stop/')
  @ApiOperation({
    summary: 'Stop (and Logout if asked) session',
    description: 'Stop session and Logout by default.',
    deprecated: true,
  })
  async DEPRECATED_stop(
    @Body() request: SessionStopDeprecatedRequest,
  ): Promise<void> {
    const name = request.name;
    if (request.logout) {
      // Old API did remove the session complete
      await this.withLock(name, async () => {
        await this.manager.stop(name, true);
        await this.manager.logout(name);
        await this.manager.delete(name);
      });
    } else {
      await this.withLock(name, async () => {
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
  async DEPRECATED_logout(
    @Body() request: SessionLogoutDeprecatedRequest,
  ): Promise<void> {
    const name = request.name;
    await this.withLock(name, async () => {
      await this.manager.stop(name, true);
      await this.manager.logout(name);
      await this.manager.delete(name);
    });
    return;
  }
}

export { SessionsController };
