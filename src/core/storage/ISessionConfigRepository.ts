import { SessionConfig } from '../../structures/sessions.dto';

export abstract class ISessionConfigRepository {
  abstract saveConfig(
    sessionName: string,
    config: SessionConfig,
  ): Promise<void>;

  abstract getConfig(sessionName: string): Promise<SessionConfig | null>;

  abstract getConfigBySessions(
    sessionNames: string[],
  ): Promise<Map<string, SessionConfig | null>>;

  abstract exists(sessionName: string): Promise<boolean>;

  abstract deleteConfig(sessionName: string): Promise<void>;

  abstract getAllConfigs(): Promise<string[]>;

  abstract init(): Promise<void>;
}
