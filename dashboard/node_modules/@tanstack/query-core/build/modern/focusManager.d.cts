import { t as Subscribable } from "./subscribable-CbifVTKz.cjs";
//#region src/focusManager.d.ts
type Listener = (focused: boolean) => void;
type SetupFn = (setFocused: (focused?: boolean) => void) => (() => void) | undefined;
/**
 * The `FocusManager` manages the focus state within TanStack Query.
 *
 * It can be used to change the default event listeners or to manually change the focus state.
 */
declare class FocusManager extends Subscribable<Listener> {
  #private;
  constructor();
  protected onSubscribe(): void;
  protected onUnsubscribe(): void;
  /**
   * `setEventListener` can be used to set a custom event listener that will
   * be used to determine the focus state. The provided `setup` function
   * receives a `setFocused` callback: call it with a `boolean` to manually
   * set the focus state, or with no arguments to re-evaluate the current
   * focus state and notify subscribers.
   *
   * @example
   * ```ts
   * import { focusManager } from '@tanstack/query-core'
   *
   * focusManager.setEventListener((handleFocus) => {
   *   const listener = () => handleFocus()
   *   // Listen to visibilitychange
   *   if (typeof window !== 'undefined' && window.addEventListener) {
   *     window.addEventListener('visibilitychange', listener, false)
   *   }
   *
   *   return () => {
   *     // Be sure to unsubscribe if a new handler is set
   *     window.removeEventListener('visibilitychange', listener)
   *   }
   * })
   * ```
   */
  setEventListener(setup: SetupFn): void;
  /**
   * `setFocused` can be used to manually set the focus state. Set `undefined`
   * to fall back to the default focus check.
   *
   * @example
   * ```ts
   * import { focusManager } from '@tanstack/query-core'
   *
   * // Set focused
   * focusManager.setFocused(true)
   *
   * // Set unfocused
   * focusManager.setFocused(false)
   *
   * // Fallback to the default focus check
   * focusManager.setFocused(undefined)
   * ```
   */
  setFocused(focused?: boolean): void;
  /**
   * `onFocus` notifies all subscribed listeners with the current focus state.
   */
  onFocus(): void;
  /**
   * `isFocused` can be used to get the current focus state.
   */
  isFocused(): boolean;
}
/**
 * Singleton instance of {@link FocusManager}, used to manage and observe the focus state within TanStack Query.
 */
declare const focusManager: FocusManager;
//#endregion
export { FocusManager, focusManager };
//# sourceMappingURL=focusManager.d.cts.map