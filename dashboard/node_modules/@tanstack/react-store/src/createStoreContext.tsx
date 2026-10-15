import { createContext, useContext } from 'react'
import type { PropsWithChildren, ReactElement } from 'react'

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
export function createStoreContext<TValue extends object>(): {
  StoreProvider: (
    props: {
      value: TValue
    } & PropsWithChildren,
  ) => ReactElement
  useStoreContext: () => TValue
} {
  const Context = createContext<TValue | null>(null)
  Context.displayName = 'StoreContext'

  // eslint-disable-next-line @eslint-react/component-hook-factories
  function StoreProvider({
    children,
    value,
  }: PropsWithChildren<{
    value: TValue
  }>) {
    // eslint-disable-next-line @eslint-react/no-context-provider
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  // eslint-disable-next-line @eslint-react/component-hook-factories
  function useStoreContext() {
    // eslint-disable-next-line @eslint-react/no-use-context
    const value = useContext(Context)

    if (value === null) {
      throw new Error('Missing StoreProvider for StoreContext')
    }

    return value
  }

  return {
    StoreProvider,
    useStoreContext,
  }
}
