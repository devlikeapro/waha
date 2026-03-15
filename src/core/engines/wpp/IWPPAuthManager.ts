export interface IWPPAuthManager {
  /**
   * Called BEFORE WPP browser starts.
   * Downloads and extracts any existing remote session to userDataDir.
   */
  beforeStart(): Promise<void>;

  /**
   * Called AFTER the session reaches WORKING status.
   * Waits for stabilization, saves first snapshot, then starts periodic backup.
   */
  afterConnected(): Promise<void>;

  /**
   * Stops the periodic backup runner.
   */
  stop(): Promise<void>;
}
