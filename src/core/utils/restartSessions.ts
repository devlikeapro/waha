import { sleep } from '@waha/utils/promiseTimeout';
import { Logger } from 'pino';

interface RestartStoppedSessionsOptions {
  sessions: string[];
  withLock: (name: string, fn: () => any) => Promise<any>;
  start: (name: string) => Promise<unknown>;
  loggerFor: (name: string) => Pick<Logger, 'info' | 'error'>;
  sleepMs: number;
}

/**
 * Restarts STOPPED sessions one by one, with a delay in between.
 *
 * Lives outside manager.core.ts so it can be unit tested - importing
 * manager.core.ts pulls in every engine (and baileys, which Jest can't parse).
 */
export async function restartStoppedSessionsLoop(
  options: RestartStoppedSessionsOptions,
): Promise<void> {
  const { sessions, withLock, start, loggerFor, sleepMs } = options;
  for (const sessionName of sessions) {
    const log = loggerFor(sessionName);
    // A single session stuck past the lock's maxExecutionTime rejects
    // withLock() itself (not caught by start()'s own .catch() below), which
    // would otherwise bubble up and abort this loop - skipping every
    // session after it. Catch it here so one bad session can't block the rest.
    await withLock(sessionName, async () => {
      log.info(`Restarting STOPPED session...`);
      await start(sessionName).catch((error) => {
        log.error(`Failed to start STOPPED session: ${error}`);
        log.error(error.stack);
      });
    }).catch((error) => {
      log.error(`Failed to restart STOPPED session: ${error}`);
      log.error(error.stack);
    });
    await sleep(sleepMs);
  }
}
