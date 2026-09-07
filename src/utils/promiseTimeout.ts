/**
 * An errors which gets raised when the timeout
 * exceeded
 *
 * @internal
 */
export class TimeoutError extends Error {}

/**
 * Executes a promise in the given timeout. If the promise
 * does not finish in the given timeout, it will
 * raise a TimeoutError
 *
 * @param {number} ms The timeout in milliseconds
 * @param {Promise<any>} promise The promise which should get executed
 *
 * @internal
 */
export const promiseTimeout = function (
  ms: number,
  promise: Promise<any>,
): Promise<any> {
  // the promise may reject after the timeout already won the race - do not treat it as unhandled
  promise?.catch?.(() => undefined);
  let timer: NodeJS.Timeout;
  return Promise.race([
    promise,
    new Promise(
      (_, reject) =>
        (timer = setTimeout(
          () => reject(new TimeoutError(`Timed out in ${ms}ms.`)),
          ms,
        )),
    ),
  ]).finally(() => clearTimeout(timer));
};

export async function sleep(ms: number) {
  if (ms == 0) {
    return;
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitUntil(
  condition: () => Promise<boolean>,
  everyMs: number,
  timeoutMs: number,
): Promise<boolean> {
  const startTime = Date.now();
  let result = await condition();
  while (!result && Date.now() - startTime < timeoutMs) {
    await sleep(everyMs);
    result = await condition();
  }
  return result;
}

/**
 * Handle setTimeout 32-bit overflow
 */
export class LongTimeout {
  private static readonly MAX_DELAY = 2_147_483_647; // ~24.8 days

  private timeout?: ReturnType<typeof setTimeout>;
  private unrefed: boolean = false;

  constructor(
    private callback: () => void,
    delayMs: number,
  ) {
    this.schedule(delayMs);
  }

  private schedule(delayMs: number) {
    if (delayMs > LongTimeout.MAX_DELAY) {
      this.timeout = setTimeout(
        () => this.schedule(delayMs - LongTimeout.MAX_DELAY),
        LongTimeout.MAX_DELAY,
      );
    } else {
      this.timeout = setTimeout(this.callback, delayMs);
    }
    if (this.unrefed) {
      this.timeout.unref?.();
    }
  }

  /**
   * Do not keep the process alive just for this timer
   */
  unref(): LongTimeout {
    this.unrefed = true;
    this.timeout?.unref?.();
    return this;
  }

  clear() {
    clearTimeout(this.timeout);
  }
}

export function setLongTimeout(callback: () => void, delayMs: number) {
  return new LongTimeout(callback, delayMs);
}
