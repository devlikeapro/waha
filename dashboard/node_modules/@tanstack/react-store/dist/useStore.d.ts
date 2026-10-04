//#region src/useStore.d.ts
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
declare const useStore: <TSource, TSelected = NoInfer<TSource>>(source: {
  get: () => TSource;
  subscribe: (listener: (value: TSource) => void) => {
    unsubscribe: () => void;
  };
}, selector?: (snapshot: TSource) => TSelected, compare?: (a: TSelected, b: TSelected) => boolean) => TSelected;
//#endregion
export { useStore };
//# sourceMappingURL=useStore.d.ts.map