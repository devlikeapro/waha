import { useSelector } from "./useSelector.js";

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
const useStore = (source, selector = (s) => s, compare) => useSelector(source, selector, { compare });

//#endregion
export { useStore };
//# sourceMappingURL=useStore.js.map