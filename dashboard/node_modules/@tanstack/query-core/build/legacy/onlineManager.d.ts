import { t as Subscribable } from "./subscribable-CbifVTKz.js";
//#region src/onlineManager.d.ts
type Listener = (online: boolean) => void;
type SetupFn = (setOnline: Listener) => (() => void) | undefined;
/**
 * The `OnlineManager` manages the online state within TanStack Query. It can
 * be used to change the default event listeners or to manually change the
 * online state.
 *
 * By default, the `onlineManager` assumes an active network connection, and
 * listens to the `online` and `offline` events on the `window` object to
 * detect changes.
 */
declare class OnlineManager extends Subscribable<Listener> {
  #private;
  constructor();
  protected onSubscribe(): void;
  protected onUnsubscribe(): void;
  /**
   * `setEventListener` can be used to set a custom event listener that will
   * be used to determine the online state. The provided `setup` function
   * receives a `setOnline` callback that should be called with a `boolean`
   * whenever the online state changes.
   *
   * @example
   * ```ts
   * import NetInfo from '@react-native-community/netinfo'
   * import { onlineManager } from '@tanstack/query-core'
   *
   * onlineManager.setEventListener((setOnline) => {
   *   return NetInfo.addEventListener((state) => {
   *     setOnline(!!state.isConnected)
   *   })
   * })
   * ```
   */
  setEventListener(setup: SetupFn): void;
  /**
   * `setOnline` can be used to manually set the online state.
   *
   * @example
   * ```ts
   * import { onlineManager } from '@tanstack/query-core'
   *
   * // Set to online
   * onlineManager.setOnline(true)
   *
   * // Set to offline
   * onlineManager.setOnline(false)
   * ```
   */
  setOnline(online: boolean): void;
  /**
   * `isOnline` can be used to get the current online state.
   */
  isOnline(): boolean;
}
/**
 * Singleton instance of {@link OnlineManager}, used to manage and observe the online state within TanStack Query.
 */
declare const onlineManager: OnlineManager;
//#endregion
export { OnlineManager, onlineManager };
//# sourceMappingURL=onlineManager.d.ts.map