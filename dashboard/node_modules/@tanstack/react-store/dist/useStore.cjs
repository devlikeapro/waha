const require_useSelector = require('./useSelector.cjs');

//#region src/useStore.ts
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
const useStore = (source, selector = (s) => s, compare) => require_useSelector.useSelector(source, selector, { compare });

//#endregion
exports.useStore = useStore;
//# sourceMappingURL=useStore.cjs.map