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
import { WebJSEngineConfigService } from '@waha/core/config/WebJSEngineConfigService';
import { WhatsappSessionGoWSCore } from '@waha/core/engines/gows/session.gows.core';
import { WebhookConductor } from '@waha/core/integrations/webhooks/WebhookConductor';
import { MediaStorageFactory } from '@waha/core/media/MediaStorageFactory';
import { getPinoLogLevel, LoggerBuilder } from '@waha/utils/logging';
import { promiseTimeout, sleep } from '@waha/utils/promiseTimeout';
import { PinoLogger } from 'nestjs-pino';
import { Observable, of } from 'rxjs';
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
import { WebhookConfig } from '../structures/webhooks.config.dto';
import { populateSessionInfo, SessionManager } from './abc/manager.abc';
import { SessionParams, WhatsappSession } from './abc/session.abc';
import { EngineConfigService } from './config/EngineConfigService';
import { WhatsappSessionNoWebCore } from './engines/noweb/session.noweb.core';
import { WhatsappSessionWebJSCore } from './engines/webjs/session.webjs.core';
import { getProxyConfig } from './helpers.proxy';
import { MediaManager } from './media/MediaManager';
import { LocalSessionAuthRepository } from './storage/LocalSessionAuthRepository';
import { LocalStoreCore } from './storage/LocalStoreCore';
import { CoreApiKeyRepository } from './storage/CoreApiKeyRepository';
import { LocalSessionConfigRepository } from './storage/LocalSessionConfigRepository';

@Injectable()
export class SessionManagerCore extends SessionManager implements OnModuleInit {
  SESSION_STOP_TIMEOUT = 3000;

  private sessions = new Map<string, WhatsappSession>();
  private sessionConfigs = new Map<string, SessionConfig>();
  DEFAULT = 'default';

  protected readonly EngineClass: typeof WhatsappSession;
  protected readonly engineBootstrap: EngineBootstrap;

  constructor(
    config: WhatsappConfigService,
    private engineConfigService: EngineConfigService,
    private webjsEngineConfigService: WebJSEngineConfigService,
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

    this.store = new LocalStoreCore(engineName.toLowerCase());
    this.sessionAuthRepository = new LocalSessionAuthRepository(this.store);
    this.sessionConfigRepository = new LocalSessionConfigRepository(this.store);
    this.clearStorage().catch((error) => {
      this.log.error({ error }, 'Error while clearing storage');
    });
  }

  protected getEngine(engine: WAHAEngine): typeof WhatsappSession {
    if (engine === WAHAEngine.WEBJS) {
      return WhatsappSessionWebJSCore;
    } else if (engine === WAHAEngine.NOWEB) {
      return WhatsappSessionNoWebCore;
    } else if (engine === WAHAEngine.GOWS) {
      return WhatsappSessionGoWSCore;
    } else {
      throw new NotFoundException(`Unknown whatsapp engine '${engine}'.`);
    }
  }

  async beforeApplicationShutdown(signal?: string) {
    // Stop all sessions
    for (const [name, session] of this.sessions) {
      await this.stop(name, true);
    }
    await this.engineBootstrap.shutdown();
  }

  async onApplicationBootstrap() {
    this.apiKeyRepository = new CoreApiKeyRepository();
    await this.engineBootstrap.bootstrap();
    this.startPredefinedSessions();
  }

  protected startPredefinedSessions() {
    const startSessions = this.config.startSessions;
    const allSessions = new Set(startSessions);
    // Add sessions from local storage
    for (const [name] of this.sessionConfigs) {
      allSessions.add(name);
    }

    allSessions.forEach((sessionName) => {
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
    return this.sessions.has(name);
  }

  isRunning(name: string): boolean {
    const session = this.sessions.get(name);
    return session && session.status !== WAHASessionStatus.STOPPED;
  }

  async upsert(name: string, config?: SessionConfig): Promise<void> {
    this.sessionConfigs.set(name, config);
    await this.sessionConfigRepository.saveConfig(name, config);
  }

  async start(name: string): Promise<SessionDTO> {
    const existingSession = this.sessions.get(name);
    if (existingSession && existingSession.status !== WAHASessionStatus.STOPPED) {
      throw new UnprocessableEntityException(
        `Session '${name}' is already started.`,
      );
    }

    this.log.info({ session: name }, `Starting session...`);
    const sessionConfigData = this.sessionConfigs.get(name);
    const logger = this.log.logger.child({ session: name });
    logger.level = getPinoLogLevel(sessionConfigData?.debug);
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

    const webhook = new WebhookConductor(loggerBuilder);
    const proxyConfig = this.getProxyConfig(name);
    const sessionParams: SessionParams = {
      name,
      mediaManager,
      loggerBuilder,
      printQR: this.engineConfigService.shouldPrintQR,
      sessionStore: this.store,
      proxyConfig: proxyConfig,
      sessionConfig: sessionConfigData,
      ignore: this.ignoreChatsConfig(sessionConfigData),
    };
    if (this.EngineClass === WhatsappSessionWebJSCore) {
      sessionParams.engineConfig = this.webjsEngineConfigService.getConfig();
    } else if (this.EngineClass === WhatsappSessionGoWSCore) {
      sessionParams.engineConfig = this.gowsConfigService.getConfig();
    }
    await this.sessionAuthRepository.init(name);
    // @ts-ignore
    const session = new this.EngineClass(sessionParams);
    this.sessions.set(name, session);

    // configure webhooks
    const webhooks = this.getWebhooks(name);
    webhook.configure(session, webhooks);

    // Apps
    try {
      await this.appsService.beforeSessionStart(session, this.store);
    } catch (e) {
      logger.error(`Apps Error: ${e}`);
      session.status = WAHASessionStatus.FAILED;
    }

    // start session
    if (session.status !== WAHASessionStatus.FAILED) {
      await session.start();
      logger.info('Session has been started.');
      // Apps
      await this.appsService.afterSessionStart(session, this.store);
    }

    // Apps
    await this.appsService.afterSessionStart(session, this.store);

    return {
      name: session.name,
      status: session.status,
      config: session.sessionConfig,
    };
  }

  getSessionEvent(sessionName: string, event: WAHAEvents): Observable<any> {
    const session = this.sessions.get(sessionName);
    if (!session) {
      return of();
    }
    return session
      .getEventObservable(event)
      .pipe(map(populateSessionInfo(event, session)));
  }

  async stop(name: string, silent: boolean): Promise<void> {
    const session = this.sessions.get(name);
    if (!session) {
      this.log.debug({ session: name }, `Session does not exist.`);
      return;
    }
    if (session.status === WAHASessionStatus.STOPPED) {
      this.log.debug({ session: name }, `Session is already stopped.`);
      return;
    }

    this.log.info({ session: name }, `Stopping session...`);
    try {
      await session.stop();
    } catch (err) {
      this.log.warn(`Error while stopping session '${name}'`);
      if (!silent) {
        throw err;
      }
    }
    this.log.info({ session: name }, `Session has been stopped.`);
    await sleep(this.SESSION_STOP_TIMEOUT);
  }

  async unpair(name: string) {
    const session = this.sessions.get(name);
    if (!session) {
      return;
    }

    this.log.info({ session: name }, 'Unpairing the device from account...');
    await session.unpair().catch((err) => {
      this.log.warn(`Error while unpairing from device: ${err}`);
    });
    await sleep(1000);
  }

  async logout(name: string): Promise<void> {
    await this.sessionAuthRepository.clean(name);
  }

  async delete(name: string): Promise<void> {
    await this.appsService.removeBySession(this, name);
    this.sessions.delete(name);
    this.sessionConfigs.delete(name);
    await this.sessionConfigRepository.deleteConfig(name);
  }

  /**
   * Combine per session and global webhooks
   */
  private getWebhooks(name: string) {
    let webhooks: WebhookConfig[] = [];
    const sessionConfig = this.sessionConfigs.get(name);
    if (sessionConfig?.webhooks) {
      webhooks = webhooks.concat(sessionConfig.webhooks);
    }
    const globalWebhookConfig = this.config.getWebhookConfig();
    if (globalWebhookConfig) {
      webhooks.push(globalWebhookConfig);
    }
    return webhooks;
  }

  /**
   * Get either session's or global proxy if defined
   */
  protected getProxyConfig(name: string): ProxyConfig | undefined {
    const sessionConfig = this.sessionConfigs.get(name);
    if (sessionConfig?.proxy) {
      return sessionConfig.proxy;
    }
    const session = this.sessions.get(name);
    if (!session) {
      return undefined;
    }
    // Backward compatibility for getProxyConfig helper which expects a map of sessions
    // but here we just need to pass the session we have.
    // However, getProxyConfig logic in helpers.proxy might check all sessions?
    // Let's check the helper implementation if possible.
    // For now, we construct a partial map.
    const sessions = { [name]: session };
    return getProxyConfig(this.config, sessions, name);
  }

  getSession(name: string): WhatsappSession {
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
    const result: SessionInfo[] = [];
    // Iterate over sessions in memory
    for (const [name, session] of this.sessions) {
      if (!all && session.status === WAHASessionStatus.STOPPED) {
        continue;
      }
      const me = session?.getSessionMeInfo();
      result.push({
        name: session.name,
        status: session.status,
        config: session.sessionConfig,
        me: me,
        presence: session.presence,
        timestamps: {
          activity: session?.getLastActivityTimestamp(),
        },
      });
    }

    // If all=true, we should also include sessions that are configured but not in memory (not started yet)?
    // With current implementation, start() adds to sessions map.
    // upsert() adds to sessionConfigs map.
    // If a session is configured but never started, it is NOT in this.sessions map.
    if (all) {
        for (const [name, config] of this.sessionConfigs) {
            if (!this.sessions.has(name)) {
                result.push({
                    name: name,
                    status: WAHASessionStatus.STOPPED,
                    config: config,
                    me: null,
                    presence: null,
                    timestamps: {
                        activity: null,
                    },
                });
            }
        }
    }
    return result;
  }

  private async fetchEngineInfo(session: WhatsappSession) {
    // Get engine info
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
    const engine = {
      engine: session?.engine,
      ...engineInfo,
    };
    return engine;
  }

  async getSessionInfo(name: string): Promise<SessionDetailedInfo | null> {
    const session = this.sessions.get(name);

    // If not found in active sessions, check configs
    if (!session) {
        if (this.sessionConfigs.has(name)) {
             return {
                name: name,
                status: WAHASessionStatus.STOPPED,
                config: this.sessionConfigs.get(name),
                me: null,
                presence: null,
                timestamps: {
                    activity: null,
                },
                engine: {},
             };
        }
        return null;
    }

    const me = session?.getSessionMeInfo();
    const engine = await this.fetchEngineInfo(session);
    return {
      name: session.name,
      status: session.status,
      config: session.sessionConfig,
      me: me,
      presence: session.presence,
      timestamps: {
        activity: session?.getLastActivityTimestamp(),
      },
      engine: engine,
    };
  }

  protected stopEvents() {
    // No-op or clean up per session
  }

  async onModuleInit() {
    await this.init();
  }

  async init() {
    await this.store.init();
    await this.sessionConfigRepository.init();
    // Load sessions
    const sessions = await this.sessionConfigRepository.getAllConfigs();
    for (const name of sessions) {
      const config = await this.sessionConfigRepository.getConfig(name);
      this.sessionConfigs.set(name, config);
    }

    const knex = this.store.getWAHADatabase();
    await this.appsService.migrate(knex);
  }
}
