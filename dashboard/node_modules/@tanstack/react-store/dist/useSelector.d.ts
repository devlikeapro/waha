//#region src/useSelector.d.ts
interface UseSelectorOptions<TSelected> {
  compare?: (a: TSelected, b: TSelected) => boolean;
}
type SelectionSource<T> = {
  get: () => T;
  subscribe: (listener: (value: T) => void) => {
    unsubscribe: () => void;
  };
};
/**
 * Selects a slice of state from an atom or store and subscribes the component
 * to that selection.
 *
 * This is the primary React read hook for TanStack Store. It works with any
 * source that exposes `get()` and `subscribe()`, including atoms, readonly
 * atoms, stores, and readonly stores.
 *
 * Omit the selector to subscribe to the whole value.
 *
 * @example
 * ```tsx
 * const count = useSelector(counterStore, (state) => state.count)
 * ```
 *
 * @example
 * ```tsx
 * const value = useSelector(countAtom)
 * ```
 */
declare function useSelector<TSource, TSelected = NoInfer<TSource>>(source: SelectionSource<TSource>, selector?: (snapshot: TSource) => TSelected, options?: UseSelectorOptions<TSelected>): TSelected;
//#endregion
export { UseSelectorOptions, useSelector };
//# sourceMappingURL=useSelector.d.ts.map