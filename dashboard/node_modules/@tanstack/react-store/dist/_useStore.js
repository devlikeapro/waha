import { useSelector } from "./useSelector.js";
import { useMemo } from "react";

//#region src/_useStore.ts
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
function _useStore(store, selector, options) {
	return [useSelector(store, selector, options), useMemo(() => store.actions ?? store.setState, [store])];
}

//#endregion
export { _useStore };
//# sourceMappingURL=_useStore.js.map