import { OnApplicationShutdown } from "@nestjs/common";
import {
  SessionLogoutRequest,
  SessionDTO,
  SessionStartRequest,
  SessionStopRequest
} from "../../structures/sessions.dto";
import { WhatsappSession } from "./session.abc";
import { WhatsappEngine } from "../../structures/enums.dto";
import { MediaStorage } from "./storage.abc";
import { WebhookConductor } from "./webhooks.abc";

export abstract class SessionManager implements OnApplicationShutdown {

  protected abstract getEngine(engine: WhatsappEngine): typeof WhatsappSession

  protected abstract get EngineClass(): typeof WhatsappSession

  protected abstract get WebhookConductorClass(): typeof WebhookConductor

  protected abstract get MediaStorageClass(): typeof MediaStorage

  abstract onApplicationShutdown(signal ?: string)

  //
  // API Methods
  //
  abstract start(request: SessionStartRequest): SessionDTO

  abstract stop(request: SessionStopRequest): Promise<void>

  abstract logout(request: SessionLogoutRequest): Promise<void>

  abstract getSession(name: string, error?: boolean): WhatsappSession

  abstract getSessions(all: boolean): SessionDTO[]
}

