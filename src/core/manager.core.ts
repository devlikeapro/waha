import {
  ConsoleLogger,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { WhatsappConfigService } from '../config.service';
import { WhatsappEngine, WhatsappStatus } from '../structures/enums.dto';
import {
  SessionDTO,
  SessionLogoutRequest,
  SessionStartRequest,
  SessionStopRequest,
} from '../structures/sessions.dto';
import { SessionManager } from './abc/manager.abc';
import {
  ProxyConfig,
  WAHAInternalEvent,
  WhatsappSession,
  WhatsAppSessionConfig,
} from './abc/session.abc';
import { LocalSessionStorage } from './abc/storage.abc';
import { DOCS_URL } from './exceptions';
import { getProxyConfig } from './helpers.proxy';
import { WhatsappSessionNoWebCore } from './session.noweb.core';
import { WhatsappSessionVenomCore } from './session.venom.core';
import { WhatsappSessionWebJSCore } from './session.webjs.core';
import { MediaStorageCore, SessionStorageCore } from './storage.core';
import { WebhookConductorCore } from './webhooks.core';
import { WhatsappSessionNoWebMobileCore } from './session.noweb.mobile.core';

export class OnlyDefaultSessionIsAllowed extends UnprocessableEntityException {
  constructor() {
    super(
      `WAHA Core support only 'default' session. If you want to run more then one WhatsApp account - please get WAHA PLUS version. Check this out: ${DOCS_URL}`,
    );
  }
}

@Injectable()
export class SessionManagerCore extends SessionManager {
  private session: WhatsappSession;
  DEFAULT = 'default';

  // @ts-ignore
  protected MediaStorageClass = MediaStorageCore;
  // @ts-ignore
  protected WebhookConductorClass = WebhookConductorCore;
  protected readonly EngineClass: typeof WhatsappSession;
  protected sessionStorage: LocalSessionStorage;

  constructor(
    private config: WhatsappConfigService,
    private log: ConsoleLogger,
  ) {
    super();

    this.log.setContext('SessionManager');
    this.session = undefined;
    const engineName = this.config.getDefaultEngineName();
    this.EngineClass = this.getEngine(engineName);
    this.sessionStorage = new SessionStorageCore(engineName.toLowerCase());
    this.sessionStorage.init();

    this.startPredefinedSessions();
  }

  protected startPredefinedSessions() {
    const startSessions = this.config.startSessions;
    startSessions.forEach((sessionName) => {
      this.start({ name: sessionName });
    });
  }

  protected getEngine(engine: WhatsappEngine): typeof WhatsappSession {
    if (engine === WhatsappEngine.WEBJS) {
      return WhatsappSessionWebJSCore;
    } else if (engine === WhatsappEngine.VENOM) {
      return WhatsappSessionVenomCore;
    } else if (engine === WhatsappEngine.NOWEB) {
      return WhatsappSessionNoWebCore;
    } else if (engine === WhatsappEngine.NOWEB_MOBILE) {
      return WhatsappSessionNoWebMobileCore;
    } else {
      throw new NotFoundException(`Unknown whatsapp engine '${engine}'.`);
    }
  }

  private onlyDefault(name: string) {
    if (name !== this.DEFAULT) {
      throw new OnlyDefaultSessionIsAllowed();
    }
  }

  async onApplicationShutdown(signal?: string) {
    if (!this.session) {
      return;
    }
    await this.stop({ name: this.DEFAULT, logout: false });
  }

  //
  // API Methods
  //
  start(request: SessionStartRequest): SessionDTO {
    this.onlyDefault(request.name);

    const name = request.name;
    this.log.log(`'${name}' - starting session...`);
    const log = new ConsoleLogger(`WhatsappSession - ${name}`);
    const storage = new this.MediaStorageClass();
    const webhookLog = new ConsoleLogger(`Webhook - ${name}`);
    const webhook = new this.WebhookConductorClass(
      webhookLog,
      this.config.getWebhookUrl(),
      this.config.getWebhookEvents(),
    );

    const sessionConfig: WhatsAppSessionConfig = {
      name,
      storage,
      log,
      sessionStorage: this.sessionStorage,
      proxyConfig: this.getProxyConfig(),
    };
    // @ts-ignore
    const session = new this.EngineClass(sessionConfig);
    this.session = session;

    session.events.on(WAHAInternalEvent.engine_start, () =>
      webhook.configure(session),
    );
    session.start();
    return { name: session.name, status: session.status };
  }

  protected getProxyConfig(): ProxyConfig | undefined {
    return getProxyConfig(this.config, { [this.DEFAULT]: this.session });
  }

  async stop(request: SessionStopRequest): Promise<void> {
    this.onlyDefault(request.name);

    const name = request.name;
    this.log.log(`Stopping ${name} session...`);
    const session = this.getSession(name);
    await session.stop();
    this.log.log(`"${name}" has been stopped.`);
    this.session = undefined;
  }

  async logout(request: SessionLogoutRequest) {
    this.sessionStorage.clean(request.name);
  }

  getSession(name: string, error = true): WhatsappSession {
    this.onlyDefault(name);
    const session = this.session;
    if (!session) {
      if (error) {
        throw new NotFoundException(
          `We didn't find a session with name '${name}'. Please start it first by using POST /sessions/start request`,
        );
      }
      return;
    }
    return session;
  }

  getSessions(all: boolean): SessionDTO[] {
    if (!this.session) {
      return all
        ? [{ name: this.DEFAULT, status: WhatsappStatus.STOPPED }]
        : [];
    }
    return [{ name: this.session.name, status: this.session.status }];
  }
}
