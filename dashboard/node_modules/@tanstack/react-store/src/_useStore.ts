import { useMemo } from 'react'
import { useSelector } from './useSelector'
import type { Store, StoreActionMap } from '@tanstack/store'
import type { UseSelectorOptions } from './useSelector'

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
/* eslint-disable react-hooks/rules-of-hooks, @eslint-react/rules-of-hooks -- experimental API with underscore prefix */
export function _useStore<
  TState,
  TActions extends StoreActionMap,
  TSelected = NoInfer<TState>,
>(
  store: Store<TState, TActions>,
  selector: (state: NoInfer<TState>) => TSelected,
  options?: UseSelectorOptions<TSelected>,
): [
  TSelected,
  [TActions] extends [never] ? Store<TState>['setState'] : TActions,
] {
  const selected = useSelector(store, selector, options)
  const actionsOrSetState = useMemo(
    () => (store.actions as StoreActionMap | undefined) ?? store.setState,
    [store],
  ) as [TActions] extends [never] ? Store<TState>['setState'] : TActions

  return [selected, actionsOrSetState]
}
