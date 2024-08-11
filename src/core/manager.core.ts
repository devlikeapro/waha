import {
  ConsoleLogger,
  Injectable,
  LogLevel,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { getPinoLogLevel, LoggerBuilder } from '@waha/utils/logging';
import { promiseTimeout } from '@waha/utils/promiseTimeout';
import { EventEmitter } from 'events';
import { PinoLogger } from 'nestjs-pino';

import { WhatsappConfigService } from '../config.service';
import {
  WAHAEngine,
  WAHAEvents,
  WAHASessionStatus,
} from '../structures/enums.dto';
import {
  ProxyConfig,
  SessionDTO,
  SessionInfo,
  SessionLogoutRequest,
  SessionStartRequest,
  SessionStopRequest,
} from '../structures/sessions.dto';
import { WebhookConfig } from '../structures/webhooks.config.dto';
import { SessionManager } from './abc/manager.abc';
import { SessionParams, WhatsappSession } from './abc/session.abc';
import { EngineConfigService } from './config/EngineConfigService';
import { WhatsappSessionNoWebCore } from './engines/noweb/session.noweb.core';
import { WhatsappSessionVenomCore } from './engines/venom/session.venom.core';
import { WhatsappSessionWebJSCore } from './engines/webjs/session.webjs.core';
import { DOCS_URL } from './exceptions';
import { getProxyConfig } from './helpers.proxy';
import { CoreMediaManager, MediaStorageCore } from './media.core';
import { LocalSessionAuthRepository } from './storage/LocalSessionAuthRepository';
import { LocalSessionConfigRepository } from './storage/LocalSessionConfigRepository';
import { LocalStoreCore } from './storage/LocalStoreCore';
import { WebhookConductorCore } from './webhooks.core';

export class OnlyDefaultSessionIsAllowed extends UnprocessableEntityException {
  constructor() {
    super(
      `WAHA Core support only 'default' session. If you want to run more then one WhatsApp account - please get WAHA PLUS version. Check this out: ${DOCS_URL}`,
    );
  }
}

@Injectable()
export class SessionManagerCore extends SessionManager {
  private session?: WhatsappSession;
  DEFAULT = 'default';

  // @ts-ignore
  protected WebhookConductorClass = WebhookConductorCore;
  protected readonly EngineClass: typeof WhatsappSession;

  constructor(
    private config: WhatsappConfigService,
    private engineConfigService: EngineConfigService,
    private log: PinoLogger,
  ) {
    super();
    this.events = new EventEmitter();
    this.log.setContext(SessionManagerCore.name);
    this.session = undefined;
    const engineName = this.engineConfigService.getDefaultEngineName();
    this.EngineClass = this.getEngine(engineName);
    this.store = new LocalStoreCore(engineName.toLowerCase());
    this.sessionAuthRepository = new LocalSessionAuthRepository(this.store);
    this.sessionConfigRepository = new LocalSessionConfigRepository(this.store);
    this.startPredefinedSessions();
  }

  protected startPredefinedSessions() {
    const startSessions = this.config.startSessions;
    startSessions.forEach((sessionName) => {
      this.start({ name: sessionName });
    });
  }

  protected getEngine(engine: WAHAEngine): typeof WhatsappSession {
    if (engine === WAHAEngine.WEBJS) {
      return WhatsappSessionWebJSCore;
    } else if (engine === WAHAEngine.VENOM) {
      return WhatsappSessionVenomCore;
    } else if (engine === WAHAEngine.NOWEB) {
      return WhatsappSessionNoWebCore;
    } else {
      throw new NotFoundException(`Unknown whatsapp engine '${engine}'.`);
    }
  }

  private onlyDefault(name: string) {
    if (name !== this.DEFAULT) {
      //throw new OnlyDefaultSessionIsAllowed();
    }
  }

  async beforeApplicationShutdown(signal?: string) {
    if (!this.session) {
      return;
    }
    await this.stop({ name: this.DEFAULT, logout: false });
  }

  //
  // API Methods
  //
  async start(request: SessionStartRequest): Promise<SessionDTO> {
    //this.onlyDefault(request.name);
    // if (this.session) {
    //   throw new UnprocessableEntityException(
    //     `Session '${this.DEFAULT}' is already started.`,
    //   );
    // }

    const name = request.name;
    this.log.info(`'${name}' - starting session...`);
    const mediaManager = new CoreMediaManager(
      new MediaStorageCore(),
      this.config.mimetypes,
    );
    const logger = this.log.logger.child({ session: name });
    logger.level = getPinoLogLevel(request.config?.debug);
    const loggerBuilder: LoggerBuilder = logger;

    const webhook = new this.WebhookConductorClass(loggerBuilder);
    const proxyConfig = this.getProxyConfig(request);
    const sessionConfig: SessionParams = {
      name,
      mediaManager,
      loggerBuilder,
      printQR: this.engineConfigService.shouldPrintQR,
      sessionStore: this.store,
      proxyConfig: proxyConfig,
      sessionConfig: request.config,
    };
    await this.sessionAuthRepository.init(name);
    // @ts-ignore
    const session = new this.EngineClass(sessionConfig);
    this.session = session;

    // configure webhooks
    const webhooks = this.getWebhooks(request);
    webhook.configure(session, webhooks);

    // configure events
    session.events.on(
      WAHAEvents.SESSION_STATUS,
      this.handleSessionEvent(WAHAEvents.SESSION_STATUS, session),
    );

    // start session
    await session.start();
    return {
      name: session.name,
      status: session.status,
      config: session.sessionConfig,
    };
  }

  /**
   * Combine per session and global webhooks
   */
  private getWebhooks(request: SessionStartRequest) {
    let webhooks: WebhookConfig[] = [];
    if (request.config?.webhooks) {
      webhooks = webhooks.concat(request.config.webhooks);
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
  protected getProxyConfig(
    request: SessionStartRequest,
  ): ProxyConfig | undefined {
    if (request.config?.proxy) {
      return request.config.proxy;
    }
    if (!this.session) {
      return undefined;
    }
    const sessions = { [request.name]: this.session };
    return getProxyConfig(this.config, sessions, request.name);
  }

  async stop(request: SessionStopRequest): Promise<void> {
    //this.onlyDefault(request.name);

    const name = request.name;
    this.log.info(`Stopping ${name} session...`);
    const session = this.getSession(name);
    await session.stop();
    this.log.info(`"${name}" has been stopped.`);
    this.session = undefined;
  }

  async logout(request: SessionLogoutRequest) {
    const name = request.name;
    //this.onlyDefault(request.name);
    this.stop({ name: name, logout: false })
      .then(() => {
        this.log.info(`Session '${name}' has been stopped.`);
      })
      .catch((err) => {
        this.log.error(
          `Error while stopping session '${name}' while logging out`,
          err,
        );
      });
    await this.sessionAuthRepository.clean(request.name);
  }

  getSession(name: string): WhatsappSession {
    //this.onlyDefault(name);
    const session = this.session;
    if (!session) {
      throw new NotFoundException(
        `We didn't find a session with name '${name}'. Please start it first by using POST /sessions/start request`,
      );
    }
    return session;
  }

  async getSessions(all: boolean): Promise<SessionInfo[]> {
    if (!this.session) {
      if (!all) {
        return [];
      }
      return [
        {
          name: this.DEFAULT,
          status: WAHASessionStatus.STOPPED,
          config: undefined,
          me: null,
        },
      ];
    }
    const me = this.session.getSessionMeInfo();
    // Get engine info
    let engineInfo = {};
    if (this.session) {
      try {
        engineInfo = await promiseTimeout(10, this.session.getEngineInfo());
      } catch (e) {
        this.log.warn(
          { session: this.session },
          'Error while getting engine info',
        );
      }
    }
    const engine = {
      engine: this.session?.engine,
      ...engineInfo,
    };
    return [
      {
        name: this.session.name,
        status: this.session.status,
        config: this.session.sessionConfig,
        me: me,
        engine: engine,
      },
    ];
  }

  async getSessionInfo(name: string): Promise<SessionInfo | null> {
    if (name !== this.DEFAULT) {
      return null;
    }
    return this.getSessions(true).then((sessions) => sessions[0]);
  }
}
