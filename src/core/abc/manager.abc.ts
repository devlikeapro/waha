import {
  BeforeApplicationShutdown,
  OnApplicationShutdown,
} from '@nestjs/common';
import { WAHAWebhook } from '@waha/structures/webhooks.dto';
import { VERSION } from '@waha/version';
import { EventEmitter } from 'events';

import { WAHAEngine, WAHAEvents } from '../../structures/enums.dto';
import {
  SessionDTO,
  SessionInfo,
  SessionLogoutRequest,
  SessionStartRequest,
  SessionStopRequest,
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
  abstract start(request: SessionStartRequest): Promise<SessionDTO>;

  abstract stop(request: SessionStopRequest): Promise<void>;

  abstract logout(request: SessionLogoutRequest): Promise<void>;

  abstract getSession(name: string): WhatsappSession;

  abstract getSessionInfo(name: string): Promise<SessionInfo | null>;

  abstract getSessions(all: boolean): Promise<SessionInfo[]>;

  handleSessionEvent(event: WAHAEvents, session: WhatsappSession) {
    return async (payload: any) => {
      const me = await session.getSessionMeInfo().catch((err) => null);
      const data: WAHAWebhook = {
        event: event,
        session: session.name,
        me: me,
        payload: payload,
        engine: session.engine,
        environment: VERSION,
      };
      this.events.emit(event, data);
    };
  }
}
