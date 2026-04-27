import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AppsService,
  IAppsService,
} from '@waha/apps/app_sdk/services/IAppsService';
import { EngineBootstrap } from '@waha/core/abc/EngineBootstrap';
import { GowsEngineConfigService } from '@waha/core/config/GowsEngineConfigService';
import { WPPEngineConfigService } from '@waha/core/config/WPPEngineConfigService';
import { WebJSEngineConfigService } from '@waha/core/config/WebJSEngineConfigService';
import { WhatsappSessionGoWSCore } from '@waha/core/engines/gows/session.gows.core';
import { WebhookConductor } from '@waha/core/integrations/webhooks/WebhookConductor';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';
import { LocalSessionConfigRepository } from '@waha/core/storage/LocalSessionConfigRepository';
import { Sqlite3SessionMeRepository } from '@waha/core/storage/sqlite3/Sqlite3SessionMeRepository';
import { Sqlite3SessionWorkerRepository } from '@waha/core/storage/sqlite3/Sqlite3SessionWorkerRepository';
import { safeJoin } from '@waha/utils/files';
import { DefaultMap } from '@waha/utils/DefaultMap';
import { getPinoLogLevel, LoggerBuilder } from '@waha/utils/logging';
import { promiseTimeout, sleep } from '@waha/utils/promiseTimeout';
import { complete } from '@waha/utils/reactive/complete';
import { SwitchObservable } from '@waha/utils/reactive/SwitchObservable';
import { PinoLogger } from 'nestjs-pino';
import { EMPTY, merge, Observable, retry, share, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { getNamespace, getSessionNamespace } from '../config';
import { WhatsappConfigService } from '../config.service';
import {
  WAHAEngine,
  WAHAEvents,
  WAHASessionStatus,
} from '../structures/enums.dto';
import {
  ProxyConfig,
  SessionConfig,
  SessionDetailedInfo,
  SessionDTO,
  SessionInfo,
} from '../structures/sessions.dto';
import { WebhookConfig } from '../structures/webhooks.config.dto';
import { populateSessionInfo, SessionManager } from './abc/manager.abc';
import { SessionParams, WhatsappSession } from './abc/session.abc';
import { EngineConfigService } from './config/EngineConfigService';
import { WhatsappSessionNoWebCore } from './engines/noweb/session.noweb.core';
import { WhatsappSessionWPPCore } from './engines/wpp/session.wpp.core';
import { WhatsappSessionWebJSCore } from './engines/webjs/session.webjs.core';
import { getProxyConfig } from './helpers.proxy';
import { MediaManager } from './media/MediaManager';
import { LocalSessionAuthRepository } from './storage/LocalSessionAuthRepository';
import { LocalStoreCore } from './storage/LocalStoreCore';
import { CoreApiKeyRepository } from './storage/CoreApiKeyRepository';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');

@Injectable()
export class SessionManagerCore extends SessionManager implements OnModuleInit {
  SESSION_STOP_TIMEOUT = 3000;

  private readonly DEFAULT = 'default';
  private readonly SESSION_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;
  private readonly SESSION_NAME_MAX_LENGTH = 54;

  protected readonly EngineClass: typeof WhatsappSession;
  protected readonly engineBootstrap: EngineBootstrap;
  protected events: DefaultMap<
    string,
    DefaultMap<WAHAEvents, SwitchObservable<any>>
  >;

  private sessions: Map<string, WhatsappSession>;
  private removedSessions: Set<string>;
  private sessionSubscriptions: Map<string, Subscription[]>;

  constructor(
    config: WhatsappConfigService,
    private engineConfigService: EngineConfigService,
    private webjsEngineConfigService: WebJSEngineConfigService,
    private wppEngineConfigService: WPPEngineConfigService,
    gowsConfigService: GowsEngineConfigService,
    log: PinoLogger,
    private mediaStorageFactory: MediaStorageFactory,
    @Inject(AppsService)
    appsService: IAppsService,
  ) {
    super(log, config, gowsConfigService, appsService);
    const engineName = this.engineConfigService.getDefaultEngineName();
    this.EngineClass = this.getEngine(engineName);
    this.engineBootstrap = this.getEngineBootstrap(engineName);
    this.sessions = new Map<string, WhatsappSession>();
    this.removedSessions = new Set<string>();
    this.sessionSubscriptions = new Map<string, Subscription[]>();
    this.events = new DefaultMap<
      string,
      DefaultMap<WAHAEvents, SwitchObservable<any>>
    >((sessionName) => {
      void sessionName;
      return new DefaultMap<WAHAEvents, SwitchObservable<any>>(
        (event) =>
          new SwitchObservable((obs$) => {
            void event;
            return obs$.pipe(retry(), share());
          }),
      );
    });

    this.store = new LocalStoreCore(getNamespace(), getSessionNamespace());
    this.sessionAuthRepository = new LocalSessionAuthRepository(this.store);
    this.sessionConfigRepository = new LocalSessionConfigRepository(this.store);
    if (this.config.shouldClearStorageOnBoot) {
      this.clearStorage().catch((error) => {
        this.log.error({ error }, 'Error while clearing storage');
      });
    }
  }

  async clearStorage(): Promise<void> {
    const storage = await this.mediaStorageFactory.build(
      'all',
      this.log.logger.child({ name: 'Storage' }),
    );
    await storage.purge();
  }

  protected getEngine(engine: WAHAEngine): typeof WhatsappSession {
    if (engine === WAHAEngine.WEBJS) {
      return WhatsappSessionWebJSCore;
    } else if (engine === WAHAEngine.WPP) {
      return WhatsappSessionWPPCore;
    } else if (engine === WAHAEngine.NOWEB) {
      return WhatsappSessionNoWebCore;
    } else if (engine === WAHAEngine.GOWS) {
      return WhatsappSessionGoWSCore;
    } else {
      throw new NotFoundException(`Unknown whatsapp engine '${engine}'.`);
    }
  }

  private validateSessionName(name: string) {
    if (
      !name ||
      !this.SESSION_NAME_REGEX.test(name) ||
      name.length > this.SESSION_NAME_MAX_LENGTH
    ) {
      throw new UnprocessableEntityException(
        'Session name can only contain alphanumeric characters, hyphens, and underscores (a-z, A-Z, 0-9, -, _) and must be 54 characters or less',
      );
    }
  }

  async beforeApplicationShutdown(signal?: string) {
    void signal;
    for (const name of Array.from(this.sessions.keys())) {
      await this.stop(name, true);
    }
    this.stopEvents();
    await this.engineBootstrap.shutdown();
  }

  async onApplicationBootstrap() {
    await this.store.init();
    this.sessionWorkerRepository = new Sqlite3SessionWorkerRepository(
      this.store,
    );
    this.sessionMeRepository = new Sqlite3SessionMeRepository(this.store);
    this.apiKeyRepository = new CoreApiKeyRepository(this.store);
    await this.sessionConfigRepository.init();
    await this.sessionWorkerRepository.init();
    await this.sessionMeRepository.init();
    await this.apiKeyRepository.init();
    await this.engineBootstrap.bootstrap();
    this.startStoredSessions();
  }

  private async startStoredSessions() {
    const sessionNames = await this.getStartupSessionNames();
    sessionNames.forEach((sessionName) => {
      this.withLock(sessionName, async () => {
        const log = this.log.logger.child({ session: sessionName });
        log.info('Restarting stored session...');
        const exists = await this.exists(sessionName);
        if (!exists) {
          log.warn('Stored session does not exist anymore, skipping start');
          return;
        }
        await this.assign(sessionName);
        await this.start(sessionName).catch((error) => {
          log.error(`Failed to start stored session: ${error}`);
          log.error(error.stack);
        });
      });
    });
  }

  private async getStartupSessionNames(): Promise<string[]> {
    const configured = this.config.startSessions;
    if (configured.length > 0) {
      return configured;
    }
    return await this.sessionConfigRepository.getAllConfigs();
  }

  //
  // API Methods
  //
  async exists(name: string): Promise<boolean> {
    this.validateSessionName(name);
    if (this.removedSessions.has(name)) {
      return false;
    }
    if (this.sessions.has(name)) {
      return true;
    }
    if (name === this.DEFAULT) {
      return true;
    }
    return await this.sessionConfigRepository.exists(name);
  }

  isRunning(name: string): boolean {
    this.validateSessionName(name);
    return this.sessions.has(name);
  }

  async upsert(name: string, config?: SessionConfig): Promise<void> {
    this.validateSessionName(name);
    this.removedSessions.delete(name);
    await this.sessionConfigRepository.saveConfig(name, config);
  }

  async start(name: string): Promise<SessionDTO> {
    this.validateSessionName(name);
    if (this.sessions.has(name)) {
      throw new UnprocessableEntityException(
        `Session '${name}' is already started.`,
      );
    }
    const exists = await this.exists(name);
    if (!exists) {
      throw new NotFoundException('Session not found');
    }

    this.log.info({ session: name }, 'Starting session...');
    const sessionConfig = await this.sessionConfigRepository.getConfig(name);
    const session = await this.buildSession(name, sessionConfig);
    this.sessions.set(name, session);
    this.updateSessionEvents(session);
    this.watchSession(session);

    const webhook = new WebhookConductor(session.loggerBuilder);
    const webhooks = this.getWebhooks(sessionConfig);
    webhook.configure(session, webhooks);

    try {
      await this.appsService.beforeSessionStart(session, this.store);
    } catch (error) {
      session.logger.error(`Apps Error: ${error}`);
      session.status = WAHASessionStatus.FAILED;
    }

    if (session.status !== WAHASessionStatus.FAILED) {
      await session.start();
      session.logger.info('Session has been started.');
      await this.appsService.afterSessionStart(session, this.store);
      await this.persistSessionMe(session);
    }

    return this.toSessionDTO(session);
  }

  private async buildSession(
    name: string,
    sessionConfig: SessionConfig | null,
  ): Promise<WhatsappSession> {
    const logger = this.log.logger.child({ session: name });
    logger.level = getPinoLogLevel(sessionConfig?.debug);
    const loggerBuilder: LoggerBuilder = logger;

    const storage = await this.mediaStorageFactory.build(
      name,
      loggerBuilder.child({ name: 'Storage' }),
    );
    await storage.init();
    const mediaManager = new MediaManager(
      storage,
      this.config.mimetypes,
      loggerBuilder.child({ name: 'MediaManager' }),
    );
    const proxyConfig = this.getProxyConfig(name, sessionConfig);
    const params: SessionParams = {
      name: name,
      mediaManager: mediaManager,
      loggerBuilder: loggerBuilder,
      printQR: this.engineConfigService.shouldPrintQR,
      sessionStore: this.store,
      proxyConfig: proxyConfig,
      sessionConfig: sessionConfig,
      ignore: this.ignoreChatsConfig(sessionConfig),
    };
    this.applyEngineConfig(params);
    await this.sessionAuthRepository.init(name);
    // @ts-ignore
    return new this.EngineClass(params);
  }

  private applyEngineConfig(params: SessionParams) {
    if (this.EngineClass === WhatsappSessionWebJSCore) {
      params.engineConfig = this.webjsEngineConfigService.getConfig();
    } else if (this.EngineClass === WhatsappSessionWPPCore) {
      params.engineConfig = this.wppEngineConfigService.getConfig();
    } else if (this.EngineClass === WhatsappSessionGoWSCore) {
      params.engineConfig = this.gowsConfigService.getConfig();
    }
  }

  private updateSessionEvents(session: WhatsappSession) {
    const events = this.events.get(session.name);
    for (const eventName in WAHAEvents) {
      const event = WAHAEvents[eventName];
      const stream$ = session
        .getEventObservable(event)
        .pipe(map(populateSessionInfo(event, session)));
      events.get(event).switch(stream$);
    }
  }

  private clearSessionEvents(name: string) {
    const events = this.events.get(name);
    for (const eventName in WAHAEvents) {
      const event = WAHAEvents[eventName];
      events.get(event).switch(EMPTY);
    }
  }

  private watchSession(session: WhatsappSession) {
    const sub = session
      .getEventObservable(WAHAEvents.SESSION_STATUS)
      .subscribe(() => {
        this.persistSessionMe(session).catch((error) => {
          this.log.warn(
            { session: session.name, error: `${error}` },
            'Failed to persist session account info',
          );
        });
      });
    this.sessionSubscriptions.set(session.name, [sub]);
  }

  private unwatchSession(name: string) {
    const subscriptions = this.sessionSubscriptions.get(name) || [];
    subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.sessionSubscriptions.delete(name);
  }

  private async persistSessionMe(session: WhatsappSession) {
    const me = session.getSessionMeInfo();
    if (!me) {
      return;
    }
    await this.sessionMeRepository?.upsertMe(session.name, me);
  }

  getSessionEvent(session: string, event: WAHAEvents): Observable<any> {
    if (session === '*') {
      const streams = Array.from(this.sessions.keys()).map((name) =>
        this.events.get(name).get(event),
      );
      return streams.length > 0 ? merge(...streams) : EMPTY;
    }
    this.validateSessionName(session);
    return this.events.get(session).get(event);
  }

  async stop(name: string, silent: boolean): Promise<void> {
    this.validateSessionName(name);
    if (!this.sessions.has(name)) {
      this.log.debug({ session: name }, 'Session is not running.');
      return;
    }

    this.log.info({ session: name }, 'Stopping session...');
    const session = this.sessions.get(name);
    try {
      await session.stop();
    } catch (error) {
      this.log.warn(`Error while stopping session '${name}'`);
      if (!silent) {
        throw error;
      }
    }
    this.log.info({ session: name }, 'Session has been stopped.');
    this.sessions.delete(name);
    this.unwatchSession(name);
    this.clearSessionEvents(name);
    await sleep(this.SESSION_STOP_TIMEOUT);
  }

  async unpair(name: string) {
    this.validateSessionName(name);
    const session = this.sessions.get(name);
    if (!session) {
      return;
    }

    this.log.info({ session: name }, 'Unpairing the device from account...');
    await session.unpair().catch((error) => {
      this.log.warn(`Error while unpairing from device: ${error}`);
    });
    await sleep(1000);
  }

  async logout(name: string): Promise<void> {
    this.validateSessionName(name);
    await this.sessionAuthRepository.clean(name);
    await this.cleanEngineAuth(name);
    await this.sessionMeRepository?.removeMe(name);
  }

  async delete(name: string): Promise<void> {
    this.validateSessionName(name);
    await this.appsService.removeBySession(this, name);
    this.sessions.delete(name);
    this.unwatchSession(name);
    this.clearSessionEvents(name);
    await this.sessionConfigRepository.deleteConfig(name);
    await this.cleanEngineAuth(name);
    await this.sessionMeRepository?.removeMe(name);
    await this.sessionWorkerRepository?.remove(name);
    await this.apiKeyRepository?.deleteBySession(name);
    if (name === this.DEFAULT) {
      this.removedSessions.add(name);
    }
  }

  private async cleanEngineAuth(name: string) {
    if (this.EngineClass !== WhatsappSessionWebJSCore) {
      return;
    }
    const base = process.env.WAHA_LOCAL_STORE_BASE_DIR || './.sessions';
    const authFolder = safeJoin(`${base}/webjs/default`, `session-${name}`);
    await fs.remove(authFolder);
  }

  private getWebhooks(sessionConfig: SessionConfig | null): WebhookConfig[] {
    let webhooks: WebhookConfig[] = [];
    if (sessionConfig?.webhooks) {
      webhooks = webhooks.concat(sessionConfig.webhooks);
    }
    const globalWebhookConfig = this.config.getWebhookConfig();
    if (globalWebhookConfig) {
      webhooks.push(globalWebhookConfig);
    }
    return webhooks;
  }

  protected getProxyConfig(
    name: string,
    sessionConfig: SessionConfig | null,
  ): ProxyConfig | undefined {
    if (sessionConfig?.proxy) {
      return sessionConfig.proxy;
    }
    return getProxyConfig(this.config, this.getSessionsRecord(), name);
  }

  private getSessionsRecord(): Record<string, WhatsappSession> {
    const sessions: Record<string, WhatsappSession> = {};
    for (const [name, session] of this.sessions.entries()) {
      sessions[name] = session;
    }
    return sessions;
  }

  getSession(name: string): WhatsappSession {
    this.validateSessionName(name);
    const session = this.sessions.get(name);
    if (!session) {
      throw new NotFoundException(
        `We didn't find a session with name '${name}'.\n` +
          `Please start it first by using POST /api/sessions/${name}/start request`,
      );
    }
    return session;
  }

  async getSessions(all: boolean): Promise<SessionInfo[]> {
    if (!all) {
      return Array.from(this.sessions.values()).map((session) =>
        this.toSessionInfo(session),
      );
    }

    const names = await this.getAllKnownSessionNames();
    const configs = await this.sessionConfigRepository.getConfigBySessions(
      names,
    );
    const me = await this.sessionMeRepository?.getMeBySessions(names);
    const workers = await this.getAssignedWorkers();
    return names.map((name) => {
      const session = this.sessions.get(name);
      if (session) {
        const info = this.toSessionInfo(session);
        info.assignedWorker = workers.get(name);
        return info;
      }
      return {
        name: name,
        status: WAHASessionStatus.STOPPED,
        config: configs.get(name) ?? null,
        me: me?.get(name) ?? null,
        assignedWorker: workers.get(name),
        presence: null,
        timestamps: {
          activity: null,
        },
      };
    });
  }

  private async getAllKnownSessionNames(): Promise<string[]> {
    const names = new Set<string>(
      await this.sessionConfigRepository.getAllConfigs(),
    );
    for (const name of this.sessions.keys()) {
      names.add(name);
    }
    if (!this.removedSessions.has(this.DEFAULT)) {
      names.add(this.DEFAULT);
    }
    return Array.from(names).sort();
  }

  private async getAssignedWorkers(): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    const workers = (await this.sessionWorkerRepository?.getAll()) || [];
    workers.forEach((worker) => {
      result.set(worker.id, worker.worker);
    });
    return result;
  }

  private toSessionDTO(session: WhatsappSession): SessionDTO {
    return {
      name: session.name,
      status: session.status,
      config: session.sessionConfig,
    };
  }

  private toSessionInfo(session: WhatsappSession): SessionInfo {
    const me = session.getSessionMeInfo();
    return {
      name: session.name,
      status: session.status,
      config: session.sessionConfig,
      me: me,
      presence: session.presence,
      timestamps: {
        activity: session.getLastActivityTimestamp(),
      },
    };
  }

  private async fetchEngineInfo(name: string) {
    const session = this.sessions.get(name);
    let engineInfo = {};
    if (session) {
      try {
        engineInfo = await promiseTimeout(1000, session.getEngineInfo());
      } catch (error) {
        this.log.debug(
          { session: session.name, error: `${error}` },
          'Can not get engine info',
        );
      }
    }
    return {
      engine: session?.engine,
      ...engineInfo,
    };
  }

  async getSessionInfo(name: string): Promise<SessionDetailedInfo | null> {
    this.validateSessionName(name);
    const exists = await this.exists(name);
    if (!exists) {
      return null;
    }
    const sessions = await this.getSessions(true);
    const session = sessions.find((item) => item.name === name);
    if (!session) {
      return null;
    }
    const engine = await this.fetchEngineInfo(name);
    return {
      ...session,
      engine: engine,
    };
  }

  protected stopEvents() {
    for (const events of this.events.values()) {
      complete(events);
    }
  }

  async onModuleInit() {
    await this.init();
  }

  async init() {
    await this.store.init();
    const knex = this.store.getWAHADatabase();
    await this.appsService.migrate(knex);
  }
}
