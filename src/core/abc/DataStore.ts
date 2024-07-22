export abstract class DataStore {
  abstract init(sessionName?: string): Promise<void>;
}
