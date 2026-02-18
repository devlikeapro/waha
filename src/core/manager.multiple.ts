// @ts-ignore
import * as fs from 'fs';
// @ts-ignore
import * as path from 'path';
declare const process: any;
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
import { DefaultMap } from '@waha/utils/DefaultMap';
import { getPinoLogLevel, LoggerBuilder } from '@waha/utils/logging';
import { promiseTimeout, sleep } from '@waha/utils/promiseTimeout';
import { complete } from '@waha/utils/reactive/complete';
import { SwitchObservable } from '@waha/utils/reactive/SwitchObservable';
import { PinoLogger } from 'nestjs-pino';
import { Observable, retry, share } from 'rxjs';
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

import { PostgresStoreCore } from './storage/PostgresStoreCore';
import { PostgresSessionAuthRepository } from './storage/postgres/PostgresSessionAuthRepository';

@Injectable()
export class SessionManagerMultiple extends SessionManager implements OnModuleInit {
    SESSION_STOP_TIMEOUT = 3000;

    private sessions: Map<string, WhatsappSession> = new Map();
    private sessionConfigs: Map<string, SessionConfig> = new Map();

    protected readonly EngineClass: typeof WhatsappSession;
    protected events2: DefaultMap<WAHAEvents, SwitchObservable<any>>;
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

        // Keep events2 for backward compatibility if something uses it globally, 
        // but ideally we should expose events per session.
        // For now we will just not use it or maybe switch to the latest session? 
        // Implementing proper global event bus for multi-session is complex without more changes.
        // We'll initialize it to avoid crashes but it might only reflect one session or be empty.
        this.events2 = new DefaultMap<WAHAEvents, SwitchObservable<any>>(
            (key) =>
                new SwitchObservable((obs$) => {
                    return obs$.pipe(retry(), share());
                }),
        );

        const storageEngine = process.env.WAHA_STORAGE_ENGINE || (process.env.WHATSAPP_SESSIONS_POSTGRESQL_URL ? 'postgres' : 'sqlite3');
        if (storageEngine === 'postgres') {
            const postgresStore = new PostgresStoreCore();
            this.store = postgresStore;
            this.sessionAuthRepository = new PostgresSessionAuthRepository(postgresStore);
        } else {
            const localStore = new LocalStoreCore(engineName.toLowerCase());
            this.store = localStore;
            this.sessionAuthRepository = new LocalSessionAuthRepository(localStore);
        }

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
        const promises = Array.from(this.sessions.keys()).map(name => this.stop(name, true));
        await Promise.all(promises);
        this.stopEvents();
        await this.engineBootstrap.shutdown();
    }

    async onApplicationBootstrap() {
        this.apiKeyRepository = new CoreApiKeyRepository();
        await this.engineBootstrap.bootstrap();
        await this.scanSessions();
        this.startPredefinedSessions();
    }

    private async scanSessions() {
        const engine = this.engineConfigService.getDefaultEngineName();
        this.log.info(`Scanning sessions for engine '${engine}'...`);
        const base = process.env.WAHA_LOCAL_STORE_BASE_DIR || './.sessions';

        if (engine === WAHAEngine.WEBJS) {
            const dir = path.join(base, 'webjs', 'default');
            try {
                const files = await fs.promises.readdir(dir, { withFileTypes: true });
                for (const file of files) {
                    if (file.isDirectory() && file.name.startsWith('session-')) {
                        const sessionName = file.name.replace('session-', '');
                        if (!this.sessions.has(sessionName) && !this.sessionConfigs.has(sessionName)) {
                            this.log.info(`Found session '${sessionName}'`);
                            this.sessionConfigs.set(sessionName, {});
                        }
                    }
                }
            } catch (e) {
                this.log.warn(`Failed to scan sessions in ${dir}: ${e.message}`);
            }
        } else if (engine === WAHAEngine.NOWEB) {
            const dir = path.join(base, 'noweb');
            try {
                const files = await fs.promises.readdir(dir, { withFileTypes: true });
                for (const file of files) {
                    if (file.isDirectory()) {
                        const sessionName = file.name;
                        // Ignore internal files/folders if any
                        if (sessionName.startsWith('.')) continue;

                        if (!this.sessions.has(sessionName) && !this.sessionConfigs.has(sessionName)) {
                            this.log.info(`Found session '${sessionName}'`);
                            this.sessionConfigs.set(sessionName, {});
                        }
                    }
                }
            } catch (e) {
                this.log.warn(`Failed to scan sessions in ${dir}: ${e.message}`);
            }
        }
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
        return this.sessions.has(name) || this.sessionConfigs.has(name);
    }

    isRunning(name: string): boolean {
        return this.sessions.has(name);
    }

    async upsert(name: string, config?: SessionConfig): Promise<void> {
        this.sessionConfigs.set(name, config);
    }

    async start(name: string): Promise<SessionDTO> {
        if (this.sessions.has(name)) {
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
        const sessionConfig: SessionParams = {
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
            sessionConfig.engineConfig = this.webjsEngineConfigService.getConfig();
        } else if (this.EngineClass === WhatsappSessionGoWSCore) {
            sessionConfig.engineConfig = this.gowsConfigService.getConfig();
        }
        await this.sessionAuthRepository.init(name);
        // @ts-ignore
        const session = new this.EngineClass(sessionConfig);
        this.sessions.set(name, session);
        // We skip updating global events2 for every session to avoid conflict in this simple implementation

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
            return new Observable(subscriber => {
                subscriber.complete();
            });
        }
        return session
            .getEventObservable(event)
            .pipe(map(populateSessionInfo(event, session)));
    }

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
            this.log.warn(`Error while stopping session '${name}'`);
            if (!silent) {
                throw err;
            }
        }
        this.sessions.delete(name);
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
        if (this.sessions.has(name)) {
            await this.stop(name, true);
        }
        this.sessionConfigs.delete(name);
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
    protected getProxyConfig(name?: string): ProxyConfig | undefined {
        // If name is provided, check that session config first
        if (name) {
            const sessionConfig = this.sessionConfigs.get(name);
            if (sessionConfig?.proxy) {
                return sessionConfig.proxy;
            }
        }

        // Fallback to global proxy config logic
        // We can't access "this.session" directly as in Core, so we pass current sessions map
        // getProxyConfig helper usually expects a map of sessions
        // cast to any to match expected type if needed or just pass the map
        const sessionsObj: { [key: string]: WhatsappSession } = {};
        this.sessions.forEach((val, key) => { sessionsObj[key] = val; });

        // If we are starting a session 'name', it might not be in sessionsObj yet if not started
        // But getProxyConfig mainly uses existing sessions to assign rotation index
        return getProxyConfig(this.config, sessionsObj, name || 'default');
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

        // Add running sessions
        for (const [name, session] of this.sessions.entries()) {
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

        if (all) {
            // Add stopped sessions (in config but not running)
            for (const [name, config] of this.sessionConfigs.entries()) {
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

            // If no sessions at all, logic in Core was returning empty or Stopped default
            // We'll just return what we have.
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
        if (!this.exists(name)) {
            return null;
        }

        let session = this.sessions.get(name);
        let engine = {};

        if (session) {
            engine = await this.fetchEngineInfo(session);
            const me = session.getSessionMeInfo();
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
        } else {
            // Stopped session
            const config = this.sessionConfigs.get(name);
            return {
                name: name,
                status: WAHASessionStatus.STOPPED,
                config: config,
                me: null,
                presence: null,
                timestamps: {
                    activity: null,
                },
                engine: {}, // Unknown if stopped
            };
        }
    }

    protected stopEvents() {
        complete(this.events2);
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
