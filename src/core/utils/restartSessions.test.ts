import { restartStoppedSessionsLoop } from '@waha/core/utils/restartSessions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncLock = require('async-lock');

/**
 * Regression test: a single STOPPED session that takes longer than the lock's
 * maxExecutionTime to start used to abort restartStoppedSessions() entirely,
 * so every session after it in the list never got restarted.
 */

function buildLock() {
  // Same options as SessionManager in manager.abc.ts, just a faster ceiling.
  return new AsyncLock({
    timeout: 5_000,
    maxPending: Infinity,
    maxExecutionTime: 50, // production uses 30_000
  });
}

describe('restartStoppedSessionsLoop', () => {
  it('restarts every session even when one exceeds the lock max execution time', async () => {
    const lock = buildLock();
    const started: string[] = [];
    const errors: string[] = [];

    await restartStoppedSessionsLoop({
      sessions: ['alpha', 'regional', 'beta', 'gamma'],
      sleepMs: 0,
      withLock: (name, fn) => lock.acquire(name, fn),
      start: async (name: string) => {
        if (name === 'regional') {
          // Simulates a session stuck reconnecting after being disconnected
          // for a long time - never settles, same as the real-world report.
          await new Promise(() => undefined);
        }
        started.push(name);
      },
      loggerFor: () => ({
        info: () => undefined,
        error: (msg: string) => errors.push(msg),
      }),
    });

    expect(started).toEqual(['alpha', 'beta', 'gamma']);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Maximum execution time is exceeded'),
      ]),
    );
  });

  it('restarts all sessions normally when none get stuck', async () => {
    const lock = buildLock();
    const started: string[] = [];

    await restartStoppedSessionsLoop({
      sessions: ['alpha', 'beta', 'gamma'],
      sleepMs: 0,
      withLock: (name, fn) => lock.acquire(name, fn),
      start: async (name: string) => {
        started.push(name);
      },
      loggerFor: () => ({ info: () => undefined, error: () => undefined }),
    });

    expect(started).toEqual(['alpha', 'beta', 'gamma']);
  });
});
