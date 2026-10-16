import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import {
  AppsService,
  IAppsService,
} from '@waha/apps/app_sdk/services/IAppsService';
import { WhatsappConfigService } from '@waha/config.service';
import { generatePrefixedId } from '@waha/utils/ids';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WhatsappSession } from '@waha/core/abc/session.abc';
import {
  MeInfo,
  SessionConfig,
  SessionCreateRequest,
  SessionDTO,
  SessionInfo,
  SessionLogoutRequest,
  SessionProxy,
  SessionUpdateRequest,
} from '@waha/structures/sessions.dto';

export const PROXY_PASSWORD_MASK = '********';

const PROXY_MASK_WITHOUT_PASSWORD =
  'The proxy password is the mask from a session response, but there is no saved password - send the real password.';

const PROXY_MASK_ON_CHANGE =
  'The proxy server or username changed - send the real password instead of the mask.';

/**
 * Session responses never carry the proxy password, only the mask.
 */
export function hideProxyPassword<T extends SessionDTO>(session: T): T {
  const proxy = session?.config?.proxy;
  if (!proxy?.password) {
    return session;
  }
  return {
    ...session,
    config: {
      ...session.config,
      proxy: { ...proxy, password: PROXY_PASSWORD_MASK },
    },
  };
}

@Injectable()
export class SessionService {
  constructor(
    private readonly manager: SessionManager,
    @Inject(AppsService) private readonly appsService: IAppsService,
    private readonly config: WhatsappConfigService,
  ) {}

  async getSessions(all: boolean): Promise<SessionInfo[]> {
    const sessions = await this.manager.getSessions(all);
    return sessions.map((session) => hideProxyPassword(session));
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
    return hideProxyPassword(session);
  }

  getSessionMe(session: WhatsappSession): MeInfo | null {
    return session.getSessionMeInfo();
  }

  checkSessionProxy(session: WhatsappSession): Promise<SessionProxy> {
    return session.checkProxy({
      timeoutMs: this.config.proxyCheckTimeoutSeconds * 1000,
      ipUrl: this.config.proxyCheckIpUrl,
    });
  }

  async createSession(request: SessionCreateRequest): Promise<SessionDTO> {
    const name = request.name || generatePrefixedId('session');
    if (request.config?.proxy?.password === PROXY_PASSWORD_MASK) {
      throw new UnprocessableEntityException(PROXY_MASK_WITHOUT_PASSWORD);
    }
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
    const session = hideProxyPassword(await this.manager.getSessionInfo(name));
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
      await this.keepSavedProxyPassword(name, request.config);
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
    const session = hideProxyPassword(await this.manager.getSessionInfo(name));
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
    return hideProxyPassword(await this.manager.getSessionInfo(name));
  }

  async stopSession(name: string): Promise<SessionDTO> {
    await this.manager.withLock(name, async () => {
      await this.manager.unassign(name);
      await this.manager.stop(name, false);
    });
    return hideProxyPassword(await this.manager.getSessionInfo(name));
  }

  async logoutSession(
    name: string,
    request?: SessionLogoutRequest,
  ): Promise<SessionDTO> {
    await this.manager.withLock(name, async () => {
      if (!(await this.manager.exists(name))) {
        throw new NotFoundException('Session not found');
      }
      const isRunning = this.manager.isRunning(name);
      await this.manager.unpair(name);
      await this.manager.stop(name, true);
      await this.manager.logout(name);
      if (request?.apps?.purge === true) {
        await this.appsService.purgeBySession(this.manager, name);
      }
      if (isRunning) {
        await this.manager.start(name);
      }
    });
    return hideProxyPassword(await this.manager.getSessionInfo(name));
  }

  async restartSession(name: string): Promise<SessionDTO> {
    await this.manager.restart(name);
    return hideProxyPassword(await this.manager.getSessionInfo(name));
  }

  isSessionRunning(name: string): boolean {
    return this.manager.isRunning(name);
  }

  async upsertAndStartSession(name: string, config: any): Promise<SessionDTO> {
    return this.manager.withLock(name, async () => {
      await this.keepSavedProxyPassword(name, config);
      await this.manager.upsert(name, config);
      await this.manager.assign(name);
      return hideProxyPassword(await this.manager.start(name));
    });
  }

  /**
   * The mask sent back from a session response means "keep the saved password".
   */
  private async keepSavedProxyPassword(
    name: string,
    config?: SessionConfig,
  ): Promise<void> {
    if (config?.proxy?.password !== PROXY_PASSWORD_MASK) {
      return;
    }
    const saved = await this.manager.getSessionInfo(name);
    const savedProxy = saved?.config?.proxy;
    if (!savedProxy?.password) {
      throw new UnprocessableEntityException(PROXY_MASK_WITHOUT_PASSWORD);
    }
    // Never hand the saved password to another proxy or account
    const sameServer =
      (config.proxy.server ?? '').trim() === (savedProxy.server ?? '').trim();
    const sameUser =
      (config.proxy.username ?? '') === (savedProxy.username ?? '');
    if (!sameServer || !sameUser) {
      throw new UnprocessableEntityException(PROXY_MASK_ON_CHANGE);
    }
    config.proxy.password = savedProxy.password;
  }
}
