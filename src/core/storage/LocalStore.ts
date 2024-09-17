import { DataStore } from '../abc/DataStore';

export abstract class LocalStore extends DataStore {
  abstract init(sessionName?: string): Promise<void>;

  /**
   * Get the directory where all the engines and sessions are stored
   */
  abstract getBaseDirectory(): string;

  /**
   * Get the directory where the engine sessions are stored
   */
  abstract getEngineDirectory(): string;

  /**
   * Get the directory where the session data is stored
   */
  abstract getSessionDirectory(name: string): string;

  /**
   * Get the file path for a session
   */
  abstract getFilePath(session: string, file: string): string;

  abstract getWAHADatabase(): any;
}
