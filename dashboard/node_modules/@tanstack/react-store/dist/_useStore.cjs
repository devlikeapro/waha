const require_useSelector = require('./useSelector.cjs');
let react = require("react");

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
	return [require_useSelector.useSelector(store, selector, options), (0, react.useMemo)(() => store.actions ?? store.setState, [store])];
}

//#endregion
exports._useStore = _useStore;
//# sourceMappingURL=_useStore.cjs.map