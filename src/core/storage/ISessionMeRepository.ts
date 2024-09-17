import { MeInfo } from '../../structures/sessions.dto';

export abstract class ISessionMeRepository {
  abstract upsertMe(sessionName: string, me: MeInfo | null): Promise<void>;

  abstract getMe(sessionName: string): Promise<MeInfo | null>;

  abstract removeMe(sessionName: string): Promise<void>;

  abstract init(): Promise<void>;
}
