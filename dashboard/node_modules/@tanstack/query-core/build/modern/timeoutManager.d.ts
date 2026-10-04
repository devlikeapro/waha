//#region src/timeoutManager.d.ts
/**
 * {@link TimeoutManager} does not support passing arguments to the callback.
 *
 * `(_: void)` is the argument type inferred by TypeScript's default typings for
 * `setTimeout(cb, number)`.
 * If we don't accept a single void argument, then
 * `new Promise(resolve => timeoutManager.setTimeout(resolve, N))` is a type error.
 */
type TimeoutCallback = (_: void) => void;
/**
 * Wrapping `setTimeout` is awkward from a typing perspective because platform
 * typings may extend the return type of `setTimeout`. For example, NodeJS
 * typings add `NodeJS.Timeout`; but a non-default `timeoutManager` may not be
 * able to return such a type.
 */
type ManagedTimerId = number | {
  [Symbol.toPrimitive]: () => number;
};
/**
 * Backend for timer functions.
 *
 * Timers are performance-sensitive: short-lived timers (delays under a few seconds) tend to be
 * latency-sensitive, while long-lived ones may benefit more from coalescing — batching timers
 * with similar deadlines together — which the default provider (backed by the platform's global
 * `setTimeout`/`setInterval`) does not do. A custom provider can implement coalescing, and can
 * also support delays longer than the ~24-day maximum of the global `setTimeout`.
 */
type TimeoutProvider<TTimerId extends ManagedTimerId = ManagedTimerId> = {
  readonly setTimeout: (callback: TimeoutCallback, delay: number) => TTimerId;
  readonly clearTimeout: (timeoutId: TTimerId | undefined) => void;
  readonly setInterval: (callback: TimeoutCallback, delay: number) => TTimerId;
  readonly clearInterval: (intervalId: TTimerId | undefined) => void;
};
declare const defaultTimeoutProvider: TimeoutProvider;
/**
 * Allows customization of how timeouts are created.
 *
 * @tanstack/query-core makes liberal use of timeouts to implement `staleTime`
 * and `gcTime`. The default TimeoutManager provider uses the platform's global
 * `setTimeout` implementation, which is known to have scalability issues with
 * thousands of timeouts on the event loop.
 *
 * If you hit this limitation, consider providing a custom TimeoutProvider that
 * coalesces timeouts.
 */
declare class TimeoutManager implements Omit<TimeoutProvider, 'name'> {
  #private;
  /**
   * `setTimeoutProvider` can be used to set a custom implementation of the
   * `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` functions,
   * called a `TimeoutProvider`.
   *
   * This may be useful if you notice event loop performance issues with
   * thousands of queries. A custom TimeoutProvider could also support timer
   * delays longer than the global `setTimeout` maximum delay value of about
   * 24 days.
   *
   * It is important to call `setTimeoutProvider` before creating a
   * QueryClient or queries, so that the same provider is used consistently
   * for all timers in the application, since different TimeoutProviders
   * cannot cancel each others' timers.
   *
   * @example
   * ```ts
   * import { timeoutManager, QueryClient } from '@tanstack/query-core'
   * import { CustomTimeoutProvider } from './CustomTimeoutProvider'
   *
   * timeoutManager.setTimeoutProvider(new CustomTimeoutProvider())
   *
   * export const queryClient = new QueryClient()
   * ```
   */
  setTimeoutProvider<TTimerId extends ManagedTimerId>(provider: TimeoutProvider<TTimerId>): void;
  /**
   * `setTimeout` schedules a callback to run after approximately `delay`
   * milliseconds, like the global `setTimeout` function. The callback can be
   * canceled with `clearTimeout`.
   *
   * It returns a timer ID, which may be a number or an object that can be
   * coerced to a number via `Symbol.toPrimitive`.
   *
   * @example
   * ```ts
   * import { timeoutManager } from '@tanstack/query-core'
   *
   * const timeoutId = timeoutManager.setTimeout(
   *   () => console.log('ran at:', new Date()),
   *   1000,
   * )
   *
   * const timeoutIdNumber: number = Number(timeoutId)
   * ```
   */
  setTimeout(callback: TimeoutCallback, delay: number): ManagedTimerId;
  /**
   * `clearTimeout` cancels a timeout callback scheduled with `setTimeout`,
   * like the global `clearTimeout` function. It should be called with a
   * timer ID returned by `setTimeout`.
   *
   * @example
   * ```ts
   * import { timeoutManager } from '@tanstack/query-core'
   *
   * const timeoutId = timeoutManager.setTimeout(
   *   () => console.log('ran at:', new Date()),
   *   1000,
   * )
   *
   * timeoutManager.clearTimeout(timeoutId)
   * ```
   */
  clearTimeout(timeoutId: ManagedTimerId | undefined): void;
  /**
   * `setInterval` schedules a callback to be called approximately every
   * `delay` milliseconds, like the global `setInterval` function.
   *
   * Like `setTimeout`, it returns a timer ID, which may be a number or an
   * object that can be coerced to a number via `Symbol.toPrimitive`.
   *
   * @example
   * ```ts
   * import { timeoutManager } from '@tanstack/query-core'
   *
   * const intervalId = timeoutManager.setInterval(
   *   () => console.log('ran at:', new Date()),
   *   1000,
   * )
   * ```
   */
  setInterval(callback: TimeoutCallback, delay: number): ManagedTimerId;
  /**
   * `clearInterval` can be used to cancel an interval, like the global
   * `clearInterval` function. It should be called with an interval ID
   * returned by `setInterval`.
   *
   * @example
   * ```ts
   * import { timeoutManager } from '@tanstack/query-core'
   *
   * const intervalId = timeoutManager.setInterval(
   *   () => console.log('ran at:', new Date()),
   *   1000,
   * )
   *
   * timeoutManager.clearInterval(intervalId)
   * ```
   */
  clearInterval(intervalId: ManagedTimerId | undefined): void;
}
/**
 * Singleton instance of {@link TimeoutManager}, used throughout TanStack Query to schedule and cancel timers.
 */
declare const timeoutManager: TimeoutManager;
/**
 * In many cases code wants to delay to the next event loop tick; this is not
 * mediated by {@link timeoutManager}.
 *
 * This function is provided to make auditing the `tanstack/query-core` for
 * incorrect use of system `setTimeout` easier.
 */
declare function systemSetTimeoutZero(callback: TimeoutCallback): void;
//#endregion
export { ManagedTimerId, TimeoutCallback, TimeoutManager, TimeoutProvider, defaultTimeoutProvider, systemSetTimeoutZero, timeoutManager };
//# sourceMappingURL=timeoutManager.d.ts.map