import { PropsWithChildren, ReactElement } from "react";

//#region src/createStoreContext.d.ts
/**
 * Creates a typed React context for sharing a bundle of atoms and stores with a subtree.
 *
 * The returned `StoreProvider` only transports the provided object through
 * React context. Consumers destructure the contextual atoms and stores, then
 * compose them with the existing hooks like {@link useSelector},
 * {@link useSelector} and {@link useAtom}.
 *
 * The object shape is preserved exactly, so keyed atoms and stores remain fully
 * typed when read back with `useStoreContext()`.
 *
 * @example
 * ```tsx
 * const { StoreProvider, useStoreContext } = createStoreContext<{
 *   countAtom: Atom<number>
 *   totalsStore: Store<{ count: number }>
 * }>()
 *
 * function CountButton() {
 *   const { countAtom, totalsStore } = useStoreContext()
 *   const count = useSelector(countAtom)
 *   const total = useSelector(totalsStore, (state) => state.count)
 *
 *   return (
 *     <button
 *       type="button"
 *       onClick={() => totalsStore.setState((state) => ({ ...state, count: state.count + 1 }))}
 *     >
 *       {count} / {total}
 *     </button>
 *   )
 * }
 * ```
 *
 * @throws When `useStoreContext()` is called outside the matching `StoreProvider`.
 */
declare function createStoreContext<TValue extends object>(): {
  StoreProvider: (props: {
    value: TValue;
  } & PropsWithChildren) => ReactElement;
  useStoreContext: () => TValue;
};
//#endregion
export { createStoreContext };
//# sourceMappingURL=createStoreContext.d.cts.map