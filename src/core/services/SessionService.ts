import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import {
  AppsService,
  IAppsService,
} from '@waha/apps/app_sdk/services/IAppsService';
import { generatePrefixedId } from '@waha/utils/ids';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import {
  MeInfo,
  SessionCreateRequest,
  SessionDTO,
  SessionInfo,
  SessionUpdateRequest,
} from '@waha/structures/sessions.dto';

@Injectable()
export class SessionService {
  constructor(
    private readonly manager: SessionManager,
    @Inject(AppsService) private readonly appsService: IAppsService,
  ) {}

  async getSessions(all: boolean): Promise<SessionInfo[]> {
    return this.manager.getSessions(all);
  }

  async expandSessionApps(sessions: SessionInfo[]): Promise<void> {
    for (const session of sessions) {
      session.apps = await this.appsService.list(this.manager, session.name);
    }
  }

  async getSession(name: string): Promise<SessionInfo> {
    const session = await this.manager.getSessionInfo(name);
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  getSessionMe(session: WhatsappSession): MeInfo | null {
    return session.getSessionMeInfo();
  }

  async createSession(request: SessionCreateRequest): Promise<SessionDTO> {
    const name = request.name || generatePrefixedId('session');
    await this.manager.withLock(name, async () => {
      if (await this.manager.exists(name)) {
        throw new UnprocessableEntityException(
          `Session '${name}' already exists. Use PUT to update it.`,
        );
      }
      await this.manager.upsert(name, request.config);
      if (request.apps) {
        await this.appsService.syncSessionApps(
          this.manager,
          name,
          request.apps,
        );
      }
      if (request.start) {
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

  async updateSession(
    name: string,
    request: SessionUpdateRequest,
  ): Promise<SessionDTO> {
    await this.manager.withLock(name, async () => {
      if (!(await this.manager.exists(name))) {
        throw new NotFoundException('Session not found');
      }
      const isRunning = this.manager.isRunning(name);
      await this.manager.stop(name, true);
      await this.manager.upsert(name, request.config);
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

  async deleteSession(name: string): Promise<void> {
    await this.manager.withLock(name, async () => {
      await this.manager.unassign(name);
      await this.manager.unpair(name);
      await this.manager.stop(name, true);
      await this.manager.logout(name);
      await this.manager.delete(name);
    });
  }

  async startSession(name: string): Promise<SessionDTO> {
    await this.manager.withLock(name, async () => {
      if (!(await this.manager.exists(name))) {
        throw new NotFoundException('Session not found');
      }
      await this.manager.assign(name);
      await this.manager.start(name);
    });
    return this.manager.getSessionInfo(name);
  }

  async stopSession(name: string): Promise<SessionDTO> {
    await this.manager.withLock(name, async () => {
      await this.manager.unassign(name);
      await this.manager.stop(name, false);
    });
    return this.manager.getSessionInfo(name);
  }

  async logoutSession(name: string): Promise<SessionDTO> {
    await this.manager.withLock(name, async () => {
      if (!(await this.manager.exists(name))) {
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
    return this.manager.getSessionInfo(name);
  }

  async restartSession(name: string): Promise<SessionDTO> {
    await this.manager.restart(name);
    return this.manager.getSessionInfo(name);
  }

  isSessionRunning(name: string): boolean {
    return this.manager.isRunning(name);
  }

  async upsertAndStartSession(name: string, config: any): Promise<SessionDTO> {
    return this.manager.withLock(name, async () => {
      await this.manager.upsert(name, config);
      await this.manager.assign(name);
      return this.manager.start(name);
    });
  }
}
