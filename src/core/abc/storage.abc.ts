import { SessionConfig } from '../../structures/sessions.dto';

abstract class MediaStorage {
  abstract save(
    messageId: string,
    mimetype: string,
    buffer: Buffer,
  ): Promise<string>;
}

abstract class SessionConfigRepository {
  abstract save(sessionName: string, config: SessionConfig): Promise<void>;

  abstract get(sessionName: string): Promise<SessionConfig>;
}

abstract class SessionStorage {
  protected constructor(public engine: string) {
    this.engine = engine;
  }

  abstract init(): Promise<void>;

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

export { LocalSessionStorage, MediaStorage, SessionConfigRepository };
