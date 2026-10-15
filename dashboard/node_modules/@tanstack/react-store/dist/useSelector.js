import { useCallback } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

//#region src/useSelector.ts
function defaultCompare(a, b) {
	return a === b;
}
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
function useSelector(source, selector = (s) => s, options) {
	const compare = options?.compare ?? defaultCompare;
	const subscribe = useCallback((handleStoreChange) => {
		const { unsubscribe } = source.subscribe(handleStoreChange);
		return unsubscribe;
	}, [source]);
	const getSnapshot = useCallback(() => source.get(), [source]);
	return useSyncExternalStoreWithSelector(subscribe, getSnapshot, getSnapshot, selector, compare);
}

//#endregion
export { useSelector };
//# sourceMappingURL=useSelector.js.map