import {
  BeforeApplicationShutdown,
  NotFoundException,
  OnApplicationBootstrap,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IAppsService } from '@waha/apps/app_sdk/services/IAppsService';
import { WhatsappConfigService } from '@waha/config.service';
import {
  EngineBootstrap,
  NoopEngineBootstrap,
} from '@waha/core/abc/EngineBootstrap';
import { GowsEngineConfigService } from '@waha/core/config/GowsEngineConfigService';
import { GowsBootstrap } from '@waha/core/engines/gows/GowsBootstrap';
import { ISessionMeRepository } from '@waha/core/storage/ISessionMeRepository';
import { ISessionWorkerRepository } from '@waha/core/storage/ISessionWorkerRepository';
import { IgnoreJidConfig } from '@waha/core/utils/jids';
import { WAHAWebhook } from '@waha/structures/webhooks.dto';
import { waitUntil } from '@waha/utils/promiseTimeout';
import { VERSION } from '@waha/version';
import * as lodash from 'lodash';
import { PinoLogger } from 'nestjs-pino';
import { merge, Observable, of } from 'rxjs';

import {
  WAHAEngine,
  WAHAEvents,
  WAHASessionStatus,
} from '../../structures/enums.dto';
import {
  SessionConfig,
  SessionDetailedInfo,
  SessionDTO,
  SessionInfo,
} from '../../structures/sessions.dto';
import { ISessionAuthRepository } from '../storage/ISessionAuthRepository';
import { ISessionConfigRepository } from '../storage/ISessionConfigRepository';
import { WhatsappSession } from './session.abc';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncLock = require('async-lock');

export abstract class SessionManager
  implements BeforeApplicationShutdown, OnApplicationBootstrap
{
  public store: any;
  public sessionAuthRepository: ISessionAuthRepository;
  public sessionConfigRepository: ISessionConfigRepository;
  protected sessionMeRepository: ISessionMeRepository;
  protected sessionWorkerRepository: ISessionWorkerRepository;
  private lock: any;

  WAIT_SESSION_RUNNING_INTERVAL = 500;
  WAIT_SESSION_RUNNING_TIMEOUT = 5_000;
  WAIT_STATUS_INTERVAL = 500;
  WAIT_STATUS_TIMEOUT = 10_000;

  protected constructor(
    protected log: PinoLogger,
    protected config: WhatsappConfigService,
    protected gowsConfigService: GowsEngineConfigService,
    protected readonly appsService: IAppsService,
  ) {
    this.lock = new AsyncLock({
      timeout: 5_000,
      maxPending: Infinity,
      maxExecutionTime: 30_000,
    });
    this.log.setContext(SessionManager.name);
  }

  protected startPredefinedSessions() {
    const startSessions = this.config.startSessions;
    startSessions.forEach((sessionName) => {
      this.withLock(sessionName, async () => {
        const log = this.log.logger.child({ session: sessionName });
        log.info(`Restarting PREDEFINED session...`);
        await this.start(sessionName).catch((error) => {
          log.error(`Failed to start PREDEFINED session: ${error}`);
          log.error(error.stack);
        });
      });
    });
  }

  public withLock(name: string, fn: () => any) {
    return this.lock.acquire(name, fn);
  }

  protected abstract getEngine(engine: WAHAEngine): typeof WhatsappSession;

  protected abstract get EngineClass(): typeof WhatsappSession;

  public getSessionEvent(session: string, event: WAHAEvents): Observable<any> {
    return of();
  }

  public getSessionEvents(
    session: string,
    events: WAHAEvents[],
  ): Observable<any> {
    return merge(
      ...events.map((event) => this.getSessionEvent(session, event)),
    );
  }

  //
  // API Methods
  //
  restart(name: string) {
    return this.withLock(name, async () => {
      const exists = await this.exists(name);
      if (!exists) {
        throw new NotFoundException('Session not found');
      }
      await this.assign(name);
      await this.stop(name, true);
      await this.start(name);
    });
  }

  /**
   * Either create or update
   */
  abstract exists(name: string): Promise<boolean>;

  abstract isRunning(name: string): boolean;

  abstract upsert(name: string, config?: SessionConfig): Promise<void>;

  abstract delete(name: string): Promise<void>;

  abstract start(name: string): Promise<SessionDTO>;

  abstract stop(name: string, silent: boolean): Promise<void>;

  abstract logout(name: string): Promise<void>;

  abstract unpair(name: string): Promise<void>;

  abstract getSession(name: string): WhatsappSession;

  abstract getSessionInfo(name: string): Promise<SessionDetailedInfo | null>;

  abstract getSessions(all: boolean): Promise<SessionInfo[]>;

  get workerId() {
    return this.config.workerId;
  }

  async assign(name: string) {
    await this.sessionWorkerRepository?.assign(name, this.workerId);
  }

  async unassign(name: string) {
    await this.sessionWorkerRepository?.unassign(name, this.workerId);
  }

  async getWorkingSession(sessionName: string): Promise<WhatsappSession> {
    return this.waitUntilStatus(sessionName, [WAHASessionStatus.WORKING]);
  }

  /**
   * Wait until session is in expected status
   */
  async waitUntilStatus(
    sessionName: string,
    expected: WAHASessionStatus[],
  ): Promise<WhatsappSession> {
    if (!sessionName) {
      throw new UnprocessableEntityException({
        error: `Session name is required`,
        session: sessionName,
      });
    }
    const running = await waitUntil(
      async () => this.isRunning(sessionName),
      this.WAIT_SESSION_RUNNING_INTERVAL,
      this.WAIT_SESSION_RUNNING_TIMEOUT,
    );

    if (!running) {
      const exists = await this.exists(sessionName);
      if (!exists) {
        throw new UnprocessableEntityException({
          error: `Session "${sessionName}" does not exist`,
          session: sessionName,
        });
      }

      const msg = {
        error:
          'Session status is not as expected. Try again later or restart the session',
        session: sessionName,
        status: 'STOPPED',
        expected: expected,
      };
      throw new UnprocessableEntityException(msg);
    }

    const session = this.getSession(sessionName);
    const valid = await waitUntil(
      async () => expected.includes(session.status),
      this.WAIT_STATUS_INTERVAL,
      this.WAIT_STATUS_TIMEOUT,
    );
    if (!valid) {
      const msg = {
        error:
          'Session status is not as expected. Try again later or restart the session',
        session: sessionName,
        status: session.status,
        expected: expected,
      };
      throw new UnprocessableEntityException(msg);
    }
    return session;
  }

  beforeApplicationShutdown(signal?: string) {
    return;
  }

  onApplicationBootstrap(): any {
    return;
  }

  protected getEngineBootstrap(engine: WAHAEngine): EngineBootstrap {
    const logger = this.log.logger.child({ engine: engine.toLowerCase() });
    if (engine === WAHAEngine.GOWS) {
      const config = this.gowsConfigService.getBootstrapConfig();
      return new GowsBootstrap(logger, config);
    }
    return new NoopEngineBootstrap();
  }

  protected ignoreChatsConfig(config: SessionConfig) {
    const ignore: IgnoreJidConfig = this.config.getIgnoreChatsConfig();
    // Given the default, overwrite from the config if any
    return lodash.defaults({}, config?.ignore, ignore);
  }
}

export function populateSessionInfo(
  event: WAHAEvents,
  session: WhatsappSession,
) {
  return (payload: any): WAHAWebhook => {
    const id = payload._eventId;
    const timestampMs = payload._timestampMs;
    const data = { ...payload };
    delete data._eventId;
    delete data._timestampMs;
    const me = session.getSessionMeInfo();
    return {
      id: id,
      timestamp: timestampMs,
      event: event,
      session: session.name,
      metadata: session.sessionConfig?.metadata,
      me: me,
      payload: data,
      engine: session.engine,
      environment: VERSION,
    };
  };
}
