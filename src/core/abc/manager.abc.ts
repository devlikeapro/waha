import { OnApplicationShutdown } from '@nestjs/common';

import { WAHAEngine } from '../../structures/enums.dto';
import {
  SessionDTO,
  SessionLogoutRequest,
  SessionStartRequest,
  SessionStopRequest,
} from '../../structures/sessions.dto';
import { WhatsappSession } from './session.abc';
import { LocalSessionStorage, MediaStorage } from './storage.abc';
import { WebhookConductor } from './webhooks.abc';

export abstract class SessionManager implements OnApplicationShutdown {
  public sessionStorage: LocalSessionStorage;

  protected abstract getEngine(engine: WAHAEngine): typeof WhatsappSession;

  protected abstract get EngineClass(): typeof WhatsappSession;

  protected abstract get WebhookConductorClass(): typeof WebhookConductor;

  protected abstract get MediaStorageClass(): typeof MediaStorage;

  abstract onApplicationShutdown(signal?: string);

  //
  // API Methods
  //
  abstract start(request: SessionStartRequest): Promise<SessionDTO>;

  abstract stop(request: SessionStopRequest): Promise<void>;

  abstract logout(request: SessionLogoutRequest): Promise<void>;

  abstract getSession(name: string, error?: boolean): WhatsappSession;

  abstract getSessions(all: boolean): Promise<SessionDTO[]>;
}
