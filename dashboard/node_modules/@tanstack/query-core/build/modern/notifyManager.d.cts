//#region src/notifyManager.d.ts
type NotifyCallback = () => void;
type NotifyFunction = (callback: () => void) => void;
type BatchNotifyFunction = (callback: () => void) => void;
type BatchCallsCallback<T extends Array<unknown>> = (...args: T) => void;
type ScheduleFunction = (callback: () => void) => void;
/**
 * Default scheduling function used by the notify manager.
 * Schedules the callback with the system's `setTimeout(callback, 0)`.
 */
declare const defaultScheduler: ScheduleFunction;
declare function createNotifyManager(): {
  /**
   * Batches all updates scheduled inside the passed callback.
   * This is mainly used internally to optimize query client updating.
   * Batches can be nested; the queue is only flushed once the outermost `batch` call finishes.
   * The return value of `callback` is passed through.
   */
  readonly batch: <T>(callback: () => T) => T;
  /**
   * All calls to the wrapped function will be batched.
   */
  readonly batchCalls: <T extends Array<unknown>>(callback: BatchCallsCallback<T>) => BatchCallsCallback<T>;
  /**
   * Schedules a function to be run on the next batch.
   * By default, the batch is run with a `setTimeout`, but this can be configured via `setScheduler`.
   */
  readonly schedule: (callback: NotifyCallback) => void;
  /**
   * Use this method to set a custom notify function.
   * This can be used to for example wrap notifications with `React.act` while running tests.
   */
  readonly setNotifyFunction: (fn: NotifyFunction) => void;
  /**
   * Use this method to set a custom function to batch notifications together into a single tick.
   * Framework adapters use this to plug in their own batching primitive, so that a single query
   * update only triggers one re-render instead of one per subscriber.
   *
   * @example
   * ```ts
   * import { notifyManager } from '@tanstack/query-core'
   * import { batch } from 'solid-js'
   *
   * notifyManager.setBatchNotifyFunction(batch)
   * ```
   */
  readonly setBatchNotifyFunction: (fn: BatchNotifyFunction) => void;
  /**
   * Configures a custom callback that schedules when the next batch runs.
   * The default behavior is `setTimeout(callback, 0)`.
   *
   * @example
   * ```ts
   * import { notifyManager } from '@tanstack/query-core'
   *
   * // Schedule batches in the next microtask
   * notifyManager.setScheduler(queueMicrotask)
   *
   * // Schedule batches before the next frame is rendered
   * notifyManager.setScheduler(requestAnimationFrame)
   *
   * // Schedule batches some time in the future
   * notifyManager.setScheduler((cb) => setTimeout(cb, 10))
   * ```
   */
  readonly setScheduler: (fn: ScheduleFunction) => void;
};
/**
 * Handles scheduling and batching callbacks in TanStack Query.
 */
declare const notifyManager: {
  /**
   * Batches all updates scheduled inside the passed callback.
   * This is mainly used internally to optimize query client updating.
   * Batches can be nested; the queue is only flushed once the outermost `batch` call finishes.
   * The return value of `callback` is passed through.
   */
  readonly batch: <T>(callback: () => T) => T;
  /**
   * All calls to the wrapped function will be batched.
   */
  readonly batchCalls: <T extends Array<unknown>>(callback: BatchCallsCallback<T>) => BatchCallsCallback<T>;
  /**
   * Schedules a function to be run on the next batch.
   * By default, the batch is run with a `setTimeout`, but this can be configured via `setScheduler`.
   */
  readonly schedule: (callback: NotifyCallback) => void;
  /**
   * Use this method to set a custom notify function.
   * This can be used to for example wrap notifications with `React.act` while running tests.
   */
  readonly setNotifyFunction: (fn: NotifyFunction) => void;
  /**
   * Use this method to set a custom function to batch notifications together into a single tick.
   * Framework adapters use this to plug in their own batching primitive, so that a single query
   * update only triggers one re-render instead of one per subscriber.
   *
   * @example
   * ```ts
   * import { notifyManager } from '@tanstack/query-core'
   * import { batch } from 'solid-js'
   *
   * notifyManager.setBatchNotifyFunction(batch)
   * ```
   */
  readonly setBatchNotifyFunction: (fn: BatchNotifyFunction) => void;
  /**
   * Configures a custom callback that schedules when the next batch runs.
   * The default behavior is `setTimeout(callback, 0)`.
   *
   * @example
   * ```ts
   * import { notifyManager } from '@tanstack/query-core'
   *
   * // Schedule batches in the next microtask
   * notifyManager.setScheduler(queueMicrotask)
   *
   * // Schedule batches before the next frame is rendered
   * notifyManager.setScheduler(requestAnimationFrame)
   *
   * // Schedule batches some time in the future
   * notifyManager.setScheduler((cb) => setTimeout(cb, 10))
   * ```
   */
  readonly setScheduler: (fn: ScheduleFunction) => void;
};
//#endregion
export { createNotifyManager, defaultScheduler, notifyManager };
//# sourceMappingURL=notifyManager.d.cts.map