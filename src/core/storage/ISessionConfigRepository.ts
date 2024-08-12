import { SessionConfig } from '../../structures/sessions.dto';

export abstract class ISessionConfigRepository {
  abstract save(
    sessionName: string,
    config: SessionConfig | null,
  ): Promise<void>;

  abstract get(sessionName: string): Promise<SessionConfig | null>;

  abstract exists(sessionName: string): Promise<boolean>;

  abstract delete(sessionName: string): Promise<void>;

  abstract getAll(): Promise<string[]>;
}
