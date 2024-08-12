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
