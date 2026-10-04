import { useSelector } from './useSelector'

/**
 * Deprecated alias for {@link useSelector}.
 *
 * @example
 * ```tsx
 * const count = useStore(counterStore, (state) => state.count)
 * ```
 *
 * @deprecated Use `useSelector` instead.
 */
export const useStore = <TSource, TSelected = NoInfer<TSource>>(
  source: {
    get: () => TSource
    subscribe: (listener: (value: TSource) => void) => {
      unsubscribe: () => void
    }
  },
  selector: (snapshot: TSource) => TSelected = (s) => s as unknown as TSelected,
  compare?: (a: TSelected, b: TSelected) => boolean,
) => useSelector(source, selector, { compare })
