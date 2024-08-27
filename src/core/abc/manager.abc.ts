import { BeforeApplicationShutdown } from '@nestjs/common';
import { WAHAWebhook } from '@waha/structures/webhooks.dto';
import { VERSION } from '@waha/version';
import { EventEmitter } from 'events';

import { WAHAEngine, WAHAEvents } from '../../structures/enums.dto';
import {
  SessionConfig,
  SessionDTO,
  SessionInfo,
} from '../../structures/sessions.dto';
import { ISessionAuthRepository } from '../storage/ISessionAuthRepository';
import { ISessionConfigRepository } from '../storage/ISessionConfigRepository';
import { WhatsappSession } from './session.abc';
import { WebhookConductor } from './webhooks.abc';

export abstract class SessionManager implements BeforeApplicationShutdown {
  public store: any;
  public sessionAuthRepository: ISessionAuthRepository;
  public sessionConfigRepository: ISessionConfigRepository;
  public events: EventEmitter;

  protected abstract getEngine(engine: WAHAEngine): typeof WhatsappSession;

  protected abstract get EngineClass(): typeof WhatsappSession;

  protected abstract get WebhookConductorClass(): typeof WebhookConductor;

  abstract beforeApplicationShutdown(signal?: string);

  //
  // API Methods
  //
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

  abstract getSession(name: string): WhatsappSession;

  abstract getSessionInfo(name: string): Promise<SessionInfo | null>;

  abstract getSessions(all: boolean): Promise<SessionInfo[]>;

  handleSessionEvent(event: WAHAEvents, session: WhatsappSession) {
    return (payload: any) => {
      const me = session.getSessionMeInfo();
      const data: WAHAWebhook = {
        event: event,
        session: session.name,
        metadata: session.sessionConfig?.metadata,
        me: me,
        payload: payload,
        engine: session.engine,
        environment: VERSION,
      };
      this.events.emit(event, data);
    };
  }
}
