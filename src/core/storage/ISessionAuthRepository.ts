export abstract class ISessionAuthRepository {
  abstract init(sessionName?: string): Promise<void>;

  abstract clean(sessionName: string): Promise<void>;
}
