let react = require("react");
let react_jsx_runtime = require("react/jsx-runtime");

//#region src/createStoreContext.tsx
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
function createStoreContext() {
	const Context = (0, react.createContext)(null);
	Context.displayName = "StoreContext";
	function StoreProvider({ children, value }) {
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Context.Provider, {
			value,
			children
		});
	}
	function useStoreContext() {
		const value = (0, react.useContext)(Context);
		if (value === null) throw new Error("Missing StoreProvider for StoreContext");
		return value;
	}
	return {
		StoreProvider,
		useStoreContext
	};
}

//#endregion
exports.createStoreContext = createStoreContext;
//# sourceMappingURL=createStoreContext.cjs.map