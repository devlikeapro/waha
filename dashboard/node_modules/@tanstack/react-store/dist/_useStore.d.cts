import { UseSelectorOptions } from "./useSelector.cjs";
import { Store, StoreActionMap } from "@tanstack/store";

//#region src/_useStore.d.ts
/**
 * Experimental combined read+write hook for stores, mirroring useAtom's tuple
 * pattern.
 *
 * Returns `[selected, actions]` when the store has an actions factory, or
 * `[selected, setState]` for plain stores.
 *
 * @example
 * ```tsx
 * // Store with actions
 * const [cats, { addCat }] = _useStore(petStore, (s) => s.cats)
 *
 * // Store without actions
 * const [count, setState] = _useStore(plainStore, (s) => s)
 * setState((prev) => prev + 1)
 * ```
 */
declare function _useStore<TState, TActions extends StoreActionMap, TSelected = NoInfer<TState>>(store: Store<TState, TActions>, selector: (state: NoInfer<TState>) => TSelected, options?: UseSelectorOptions<TSelected>): [TSelected, [TActions] extends [never] ? Store<TState>['setState'] : TActions];
//#endregion
export { _useStore };
//# sourceMappingURL=_useStore.d.cts.map