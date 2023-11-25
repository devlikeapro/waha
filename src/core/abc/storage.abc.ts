import { SessionConfig } from '../../structures/sessions.dto';

abstract class SessionConfigRepository {
  abstract save(
    sessionName: string,
    config: SessionConfig | null,
  ): Promise<void>;

  abstract get(sessionName: string): Promise<SessionConfig | null>;
}

abstract class SessionStorage {
  protected constructor(public engine: string) {
    this.engine = engine;
  }

  abstract init(sessionName?: string): Promise<void>;

  abstract clean(sessionName: string): Promise<void>;

  abstract getAll(): Promise<string[]>;

  //
  // Repositories
  //
  abstract get configRepository(): SessionConfigRepository;
}

abstract class LocalSessionStorage extends SessionStorage {
  public sessionsFolder: string;

  abstract getFolderPath(sessionName: string): string;
}

export { LocalSessionStorage, SessionConfigRepository };
