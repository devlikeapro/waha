import {
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import {
  AppsService,
  IAppsService,
} from '@waha/apps/app_sdk/services/IAppsService';
import { EngineBootstrap } from '@waha/core/abc/EngineBootstrap';
import { GowsEngineConfigService } from '@waha/core/config/GowsEngineConfigService';
import { NowebEngineConfigService } from '@waha/core/config/NowebEngineConfigService';
import { WPPEngineConfigService } from '@waha/core/config/WPPEngineConfigService';
import { WebJSEngineConfigService } from '@waha/core/config/WebJSEngineConfigService';
import { WhatsappSessionGoWSCore } from '@waha/core/engines/gows/session.gows.core';
import { WhatsappSessionNoWebCore } from '@waha/core/engines/noweb/session.noweb.core';
import { WhatsappSessionWPPCore } from '@waha/core/engines/wpp/session.wpp.core';
import { WhatsappSessionWebJSCore } from '@waha/core/engines/webjs/session.webjs.core';
import { getProxyConfig } from '@waha/core/helpers.proxy';
import { MediaManager } from '@waha/core/media/MediaManager';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';
import { LocalSessionAuthRepository } from '@waha/core/storage/LocalSessionAuthRepository';
import { LocalSessionConfigRepository } from '@waha/core/storage/LocalSessionConfigRepository';
import { LocalStoreCore } from '@waha/core/storage/LocalStoreCore';
import { MongoApiKeyRepository } from '@waha/core/storage/mongo/MongoApiKeyRepository';
import { MongoSessionAuthRepository } from '@waha/core/storage/mongo/MongoSessionAuthRepository';
import { MongoSessionConfigRepository } from '@waha/core/storage/mongo/MongoSessionConfigRepository';
import { MongoSessionMeRepository } from '@waha/core/storage/mongo/MongoSessionMeRepository';
import { MongoSessionWorkerRepository } from '@waha/core/storage/mongo/MongoSessionWorkerRepository';
import { MongoStore } from '@waha/core/storage/mongo/MongoStore';
import { parsePsql } from '@waha/core/storage/psql/PsqlConnectionConfig';
import { PsqlApiKeyRepository } from '@waha/core/storage/psql/PsqlApiKeyRepository';
import { PsqlSessionAuthRepository } from '@waha/core/storage/psql/PsqlSessionAuthRepository';
import { PsqlSessionConfigRepository } from '@waha/core/storage/psql/PsqlSessionConfigRepository';
import { PsqlSessionMeRepository } from '@waha/core/storage/psql/PsqlSessionMeRepository';
import { PsqlSessionWorkerRepository } from '@waha/core/storage/psql/PsqlSessionWorkerRepository';
import { PsqlStore } from '@waha/core/storage/psql/PsqlStore';
import { Sqlite3ApiKeyRepository } from '@waha/core/storage/sqlite3/Sqlite3ApiKeyRepository';
import { Sqlite3SessionMeRepository } from '@waha/core/storage/sqlite3/Sqlite3SessionMeRepository';
import { Sqlite3SessionWorkerRepository } from '@waha/core/storage/sqlite3/Sqlite3SessionWorkerRepository';
import { WAHAWebhookSessionStatus } from '@waha/structures/webhooks.dto';
import { DefaultMap } from '@waha/utils/DefaultMap';
import { getPinoLogLevel, LoggerBuilder } from '@waha/utils/logging';
import { promiseTimeout, sleep } from '@waha/utils/promiseTimeout';
import { complete } from '@waha/utils/reactive/complete';
import { SwitchObservable } from '@waha/utils/reactive/SwitchObservable';
import { getNamespace, getSessionNamespace } from '@waha/config';
import { getEngineName, VERSION } from '@waha/version';
import * as lodash from 'lodash';
import { MongoClient } from 'mongodb';
import { PinoLogger } from 'nestjs-pino';
import { merge, Observable, retry, share } from 'rxjs';
import { map } from 'rxjs/operators';

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
import { populateSessionInfo, SessionManager } from './abc/manager.abc';

import { SessionParams, WhatsappSession } from './abc/session.abc';
import { EngineConfigService } from './config/EngineConfigService';
import { SessionPluginsService } from '@waha/plugins/SessionPluginsService';

const ALL = '*';

@Injectable()
export class SessionManagerCore
  extends SessionManager
  implements OnModuleInit, OnApplicationBootstrap
{
  private SESSION_STOP_TIMEOUT = 3000;
  SESSION_UNPAIR_TIMEOUT = 1000;
  private readonly sessions: Record<string, WhatsappSession>;

  protected readonly EngineClass: typeof WhatsappSession;
  protected readonly engineBootstrap: EngineBootstrap;

  protected events2: DefaultMap<
    string,
    DefaultMap<WAHAEvents, SwitchObservable<any>>
  >;

  constructor(
    config: WhatsappConfigService,
    private engineConfigService: EngineConfigService,
    private webjsEngineConfigService: WebJSEngineConfigService,
    private wppEngineConfigService: WPPEngineConfigService,
    private nowebEngineConfigService: NowebEngineConfigService,
    gowsConfigService: GowsEngineConfigService,
    log: PinoLogger,
    private mediaStorageFactory: MediaStorageFactory,
    private sessionPlugins: SessionPluginsService,
    @Inject(AppsService)
    appsService: IAppsService,
  ) {
    super(log, config, gowsConfigService, appsService);
    this.sessions = {};
    const engineName = this.engineConfigService.getDefaultEngineName();
    this.EngineClass = this.getEngine(engineName);
    this.engineBootstrap = this.getEngineBootstrap(engineName);

    this.events2 = new DefaultMap(
      (session: string) =>
        new DefaultMap<WAHAEvents, SwitchObservable<any>>(
          (key) =>
            new SwitchObservable((obs$) => {
              return obs$.pipe(retry(), share());
            }),
        ),
    );
  }

  async onModuleInit() {
    await this.init();
  }

  async onApplicationBootstrap() {
    await this.engineBootstrap.bootstrap();
    await this.restartSessions();
  }

  async init() {
    const mongoUrl = this.config.getSessionMongoUrl();
    const postgresUrl = this.config.getSessionPostgresUrl();
    if (mongoUrl) {
      this.log.info('Using mongo storage for session info.');
      const mongo = new MongoClient(mongoUrl);
      this.log.info(`Connecting to mongo '${mongoUrl}'...`);
      await mongo.connect();
      this.log.info(`Connected to mongo '${mongoUrl}'!`);

      this.store = new MongoStore(mongo, getNamespace(), getSessionNamespace());
      await this.store.init();
      this.sessionAuthRepository = new MongoSessionAuthRepository(this.store);
      this.sessionConfigRepository = new MongoSessionConfigRepository(
        this.store,
      );
      this.sessionMeRepository = new MongoSessionMeRepository(this.store);
      this.sessionWorkerRepository = new MongoSessionWorkerRepository(
        this.store,
      );
      this.apiKeyRepository = new MongoApiKeyRepository(this.store);
    } else if (postgresUrl) {
      this.log.info('Using Postgres storage for session info.');
      const config = parsePsql(postgresUrl);
      const engine = getEngineName();
      config.application_name = `WAHA(${engine}) ${VERSION.version} - Manager`;
      this.store = new PsqlStore(config, getNamespace(), getSessionNamespace());
      await this.store.init();
      this.sessionAuthRepository = new PsqlSessionAuthRepository(this.store);
      this.sessionConfigRepository = new PsqlSessionConfigRepository(
        this.store,
      );
      this.sessionMeRepository = new PsqlSessionMeRepository(this.store);
      this.sessionWorkerRepository = new PsqlSessionWorkerRepository(
        this.store,
      );
      this.apiKeyRepository = new PsqlApiKeyRepository(this.store);
      const knex = this.store.getWAHADatabase();
      await this.appsService.migrate(knex);
    } else {
      this.log.info('Using local storage for session info.');
      this.store = new LocalStoreCore(getNamespace(), getSessionNamespace());
      await this.store.init();
      this.sessionAuthRepository = new LocalSessionAuthRepository(this.store);
      this.sessionConfigRepository = new LocalSessionConfigRepository(
        this.store,
      );
      this.sessionMeRepository = new Sqlite3SessionMeRepository(this.store);
      this.sessionWorkerRepository = new Sqlite3SessionWorkerRepository(
        this.store,
      );
      this.apiKeyRepository = new Sqlite3ApiKeyRepository(this.store);
      const knex = this.store.getWAHADatabase();
      await this.appsService.migrate(knex);
    }

    await this.sessionConfigRepository.init();
    await this.sessionMeRepository.init();
    await this.sessionWorkerRepository.init();
    await this.apiKeyRepository.init();
    this.listenEvents();
    await this.clearStorage();
  }

  async restartSessions() {
    let restartSessions: string[];
    if (this.config.shouldRestartAllSessions) {
      this.log.info(`Restarting ALL STOPPED sessions...`);
      restartSessions = await this.sessionConfigRepository.getAllConfigs();
    } else if (this.config.shouldRestartWorkerSessions) {
      this.log.info(`Starting sessions for the worker "${this.workerId}"...`);
      restartSessions = await this.sessionWorkerRepository.getSessionsByWorker(
        this.workerId,
      );
    }

    if (restartSessions != null) {
      this.restartStoppedSessions(restartSessions).catch((error) => {
        this.log.error(`Error while restarting STOPPED sessions: ${error}`);
        this.log.error(error.stack);
      });
    } else {
      this.log.info(`No sessions to restart.`);
    }

    this.startPredefinedSessions();
  }

  private listenEvents() {
    this.events2
      .get(ALL)
      .get(WAHAEvents.SESSION_STATUS)
      .subscribe(async (data: WAHAWebhookSessionStatus) => {
        if (data.me) {
          await this.sessionMeRepository.upsertMe(data.session, data.me);
        }
      });
  }

  protected async restartStoppedSessions(sessions: string[]) {
    // Wait until HTTP/WS server is ready
    await sleep(1000);

    const sleepS = this.config.autoStartDelaySeconds;
    this.log.info(`Restarting sessions with delay of ${sleepS} seconds...`);
    const sleepMs = this.config.autoStartDelaySeconds * 1000;
    for (const sessionName of sessions) {
      const log = this.log.logger.child({ session: sessionName });
      await this.withLock(sessionName, async () => {
        log.info(`Restarting STOPPED session...`);
        await this.start(sessionName).catch((error) => {
          log.error(`Failed to start STOPPED session: ${error}`);
          log.error(error.stack);
        });
      })
        // withLock() itself can reject (e.g. "Maximum execution time is exceeded"),
        // catch it so one stuck session doesn't abort restarting the rest
        .catch((error) => {
          log.error(`Failed to restart STOPPED session: ${error}`);
          log.error(error.stack);
        });
      await sleep(sleepMs);
    }
    this.log.info(`STOPPED sessions have been restarted.`);
  }

  protected getEngine(engine: WAHAEngine): typeof WhatsappSession {
    if (engine === WAHAEngine.WEBJS) {
      this.SESSION_STOP_TIMEOUT = 3_000;
      return WhatsappSessionWebJSCore;
    } else if (engine === WAHAEngine.WPP) {
      this.SESSION_STOP_TIMEOUT = 3_000;
      return WhatsappSessionWPPCore;
    } else if (engine === WAHAEngine.NOWEB) {
      this.SESSION_STOP_TIMEOUT = 1_000;
      return WhatsappSessionNoWebCore;
    } else if (engine === WAHAEngine.GOWS) {
      this.SESSION_STOP_TIMEOUT = 10;
      return WhatsappSessionGoWSCore;
    } else {
      throw new Error(`Unknown whatsapp engine '${engine}'.`);
    }
  }

  async beforeApplicationShutdown(signal?: string) {
    this.log.info('Stopping all sessions...');
    const promises = Object.keys(this.sessions).map(async (sessionName) => {
      await this.withLock(sessionName, async () => {
        await this.stop(sessionName, true);
      });
    });
    await Promise.all(promises);
    this.log.info('All sessions have been stopped.');

    this.stopEvents();
    await this.store?.close();
    await this.engineBootstrap.shutdown();
  }

  private async clearStorage() {
    const storage = await this.mediaStorageFactory.build(
      'all',
      this.log.logger.child({ name: 'Storage' }),
    );
    await storage.purge();
  }

  //
  // API Methods
  //
  async exists(name: string): Promise<boolean> {
    return await this.sessionConfigRepository.exists(name);
  }

  isRunning(name: string): boolean {
    return !!this.sessions[name];
  }

  async upsert(name: string, config?: SessionConfig): Promise<void> {
    this.log.info({ session: name }, `Saving session...`);
    await this.sessionAuthRepository.init(name);
    await this.sessionConfigRepository.saveConfig(name, config || {});
    this.log.info({ session: name }, `Session saved.`);
  }

  async delete(name: string): Promise<void> {
    this.log.info({ session: name }, `Deleting session...`);
    await this.appsService.removeBySession(this, name);
    await this.sessionConfigRepository.deleteConfig(name);
    await this.sessionAuthRepository.clean(name);
    await this.sessionMeRepository.removeMe(name);
    await this.sessionWorkerRepository.remove(name);
    this.log.info({ session: name }, `Session deleted.`);
  }

  async start(name: string): Promise<SessionDTO> {
    this.log.info({ session: name }, `Starting session...`);
    if (this.isRunning(name)) {
      this.log.info({ session: name }, `Session is already running.`);
      return;
    }

    const logger = this.log.logger.child({ session: name });
    const config = await this.sessionConfigRepository.getConfig(name);
    await this.sessionAuthRepository.init(name);
    logger.level = getPinoLogLevel(config?.debug);
    const loggerBuilder: LoggerBuilder = logger;

    const storage = await this.mediaStorageFactory.build(
      name,
      loggerBuilder.child({ name: 'Storage' }),
    );
    await storage.init();
    const mediaManager = new MediaManager(
      name,
      storage,
      loggerBuilder.child({ name: 'MediaManager' }),
    );
    const proxyConfig = this.getProxyConfig(name, config);
    const sessionConfig: SessionParams = {
      name,
      mediaManager,
      loggerBuilder,
      printQR: this.engineConfigService.shouldPrintQR,
      sessionStore: this.store,
      proxyConfig: proxyConfig,
      sessionConfig: config,
      ignore: this.ignoreChatsConfig(config),
      media: this.config.mediaConfig,
    };
    if (this.EngineClass === WhatsappSessionWebJSCore) {
      sessionConfig.engineConfig = this.webjsEngineConfigService.getConfig();
    } else if (this.EngineClass === WhatsappSessionWPPCore) {
      sessionConfig.engineConfig = this.wppEngineConfigService.getConfig();
    } else if (this.EngineClass === WhatsappSessionGoWSCore) {
      sessionConfig.engineConfig = this.gowsConfigService.getConfig();
    } else if (this.EngineClass === WhatsappSessionNoWebCore) {
      sessionConfig.engineConfig =
        await this.nowebEngineConfigService.getConfig();
    }
    // @ts-ignore
    const session = new this.EngineClass(sessionConfig);
    this.sessions[name] = session;
    this.updateSessions();

    // Plugins
    for (const options of this.sessionPlugins.plugins(session)) {
      session.plugins.add(options);
    }
    // Apps (may contribute their own plugins to the session)
    try {
      await this.appsService.beforeSessionStart(session, this.store);
    } catch (e) {
      logger.error(`Apps Error: ${e}`);
      session.status = WAHASessionStatus.FAILED;
    }

    session.plugins.attach();

    // start session
    if (session.status !== WAHASessionStatus.FAILED) {
      await session.start();
      logger.info('Session has been started.');
      // Apps
      await this.appsService.afterSessionStart(session, this.store);
    }

    return {
      name: session.name,
      status: session.status,
      config: session.sessionConfig,
    };
  }

  private updateSessions() {
    const sessions = Object.values(this.sessions);
    for (const eventName in WAHAEvents) {
      const event = WAHAEvents[eventName];
      const streams = [];
      for (const session of sessions) {
        const stream$ = session
          .getEventObservable(event)
          .pipe(map(populateSessionInfo(event, session)), share());
        this.events2.get(session.name).get(event).switch(stream$);
        streams.push(stream$);
      }
      this.events2
        .get(ALL)
        .get(event)
        .switch(merge(...streams));
    }
  }

  getSessionEvent(session: string, event: WAHAEvents): Observable<any> {
    return this.events2.get(session).get(event);
  }

  /**
   * Stop session
   * @param name
   * @param silent - if true, throw error if session is not stopped successfully
   */
  async stop(name: string, silent: boolean): Promise<void> {
    if (!this.isRunning(name)) {
      this.log.debug({ session: name }, `Session is not running.`);
      return;
    }

    this.log.info({ session: name }, `Stopping session...`);
    try {
      const session = this.getSession(name);
      await session.stop();
    } catch (err) {
      this.log.warn({ session: name }, `Error while stopping session`);
      if (!silent) {
        throw err;
      }
    }
    this.log.info({ session: name }, `Session has been stopped.`);
    delete this.sessions[name];
    this.updateSessions();
    await sleep(this.SESSION_STOP_TIMEOUT);
  }

  async unpair(name: string) {
    const session = this.sessions[name];
    if (!session) {
      return;
    }
    this.log.info({ session: name }, 'Unpairing the device from account...');
    await session.unpair().catch((err) => {
      this.log.warn(`Error while unpairing from device: ${err}`);
    });
    await sleep(this.SESSION_UNPAIR_TIMEOUT);
  }

  async logout(name: string): Promise<void> {
    this.log.info({ session: name }, `Logging out session...`);
    await this.sessionAuthRepository.clean(name);
    await this.sessionMeRepository.removeMe(name);
    this.log.info({ session: name }, `Session has been logged out.`);
  }

  /**
   * Get either session's or global proxy if defined
   */
  protected getProxyConfig(
    name: string,
    config?: SessionConfig,
  ): ProxyConfig | undefined {
    if (config?.proxy) {
      return config.proxy;
    }
    return getProxyConfig(this.config, this.sessions, name);
  }

  getSession(name: string): WhatsappSession {
    const session = this.sessions[name];
    if (!session) {
      throw new NotFoundException(
        `We didn't find a session with name '${name}'.\n` +
          `Please start it first by using POST /api/sessions/${name}/start request`,
      );
    }
    return session;
  }

  /**
   * Get all runtime sessions
   */
  private async getRuntimeSessions(
    name: string = null,
  ): Promise<SessionInfo[]> {
    let names = Object.keys(this.sessions);
    if (name) {
      names = names.filter((n) => n === name);
    }
    const sessions = names.map((sessionName) =>
      this.sessions[sessionName].getSessionInfo(),
    );
    return await Promise.all(sessions);
  }

  /**
   * Get all sessions
   * Even tho it's "offline", it usually contains both offline and online sessions
   **/
  private async getOfflineSessions(
    name: string = null,
  ): Promise<SessionInfo[]> {
    let names = await this.sessionConfigRepository.getAllConfigs();
    if (name) {
      names = names.filter((n) => n === name);
    }
    const configBySession =
      await this.sessionConfigRepository.getConfigBySessions(names);
    const meBySession = await this.sessionMeRepository.getMeBySessions(names);
    const sessions = names.map((sessionName) => {
      const status = WAHASessionStatus.STOPPED;
      return {
        name: sessionName,
        status: status,
        config: configBySession.get(sessionName) ?? null,
        me: meBySession.get(sessionName) ?? null,
        presence: null,
        timestamps: {
          activity: null,
        },
      };
    });
    return sessions;
  }

  async getSessions(all: boolean): Promise<SessionInfo[]> {
    const runtimeSessions = await this.getRuntimeSessions();
    let offlineSessions: SessionInfo[] = [];
    if (all) {
      offlineSessions = await this.getOfflineSessions();
    }
    // Merge runtime and offline by name
    // Runtime one will overwrite offline one
    const sessions = lodash.keyBy(
      [...offlineSessions, ...runtimeSessions],
      'name',
    );

    // Get assigned worker
    const workersInfo = await this.sessionWorkerRepository.getAll();
    const workerBySession = lodash.keyBy(workersInfo, 'id');
    Object.keys(sessions).forEach((sessionName) => {
      sessions[sessionName].assignedWorker =
        workerBySession[sessionName]?.worker;
    });

    return Object.values(sessions);
  }

  async getSessionInfo(name: string): Promise<SessionDetailedInfo | null> {
    let session: SessionDetailedInfo = null;

    // Try to find session in runtime sessions
    const runtimeSessions = await this.getRuntimeSessions(name);
    if (runtimeSessions.length === 1) {
      session = runtimeSessions[0];
    }

    // If session is not found in runtime sessions,
    // try to find it in offline sessions
    if (!session) {
      const offlineSessions = await this.getOfflineSessions(name);
      if (offlineSessions.length === 1) {
        session = offlineSessions[0];
      }
    }

    // No session found
    if (!session) {
      return null;
    }

    // If session is found, get engine info
    const engine = await this.fetchEngineInfo(name);
    return {
      ...session,
      engine: engine,
    };
  }

  private async fetchEngineInfo(sessionName: string) {
    // Get engine info
    if (!this.sessions[sessionName]) {
      return {};
    }
    const session = this.sessions[sessionName];
    let engineInfo = {};
    try {
      engineInfo = await promiseTimeout(3_000, session.getEngineInfo());
    } catch (error) {
      this.log.debug(
        { session: session.name, error: `${error}` },
        'Can not get engine info',
      );
    }

    return {
      engine: this.sessions[sessionName]?.engine,
      ...engineInfo,
    };
  }

  protected stopEvents() {
    for (const events of this.events2.values()) {
      complete(events);
    }
  }
}
