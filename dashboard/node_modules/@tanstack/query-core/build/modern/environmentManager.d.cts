//#region src/environmentManager.d.ts
type IsServerValue = () => boolean;
/**
 * Returns whether the current runtime should be treated as a server environment.
 */
declare const isServer: () => boolean;
/**
 * Manages how TanStack Query detects whether the current runtime should be treated as
 * server-side, which disables scheduling refetch timers and changes the default `retry` count
 * and `gcTime`. By default, the detection treats a missing `window` (or the presence of a
 * `Deno` global) as server.
 *
 * Override this for runtimes where that default detection would give the wrong answer — for
 * example, a Service Worker, where `window` is undefined even though the environment should
 * behave like a client.
 *
 * @example
 * ```ts
 * import { environmentManager } from '@tanstack/query-core'
 *
 * environmentManager.setIsServer(() => false)
 * ```
 */
declare const environmentManager: {
  isServer: () => boolean;
  /**
   * Overrides the server check globally.
   */
  setIsServer(isServerValue: IsServerValue): void;
};
//#endregion
export { IsServerValue, environmentManager, isServer };
//# sourceMappingURL=environmentManager.d.cts.map