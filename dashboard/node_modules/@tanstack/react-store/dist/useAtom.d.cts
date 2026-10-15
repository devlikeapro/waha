import { UseSelectorOptions } from "./useSelector.cjs";
import { Atom } from "@tanstack/store";

//#region src/useAtom.d.ts
/**
 * Returns the current atom value together with a stable setter.
 *
 * This is the writable-atom convenience hook for components that need to both
 * read and update the same atom.
 *
 * @example
 * ```tsx
 * const [count, setCount] = useAtom(countAtom)
 * ```
 */
declare function useAtom<TValue>(atom: Atom<TValue>, options?: UseSelectorOptions<TValue>): [TValue, Atom<TValue>['set']];
//#endregion
export { useAtom };
//# sourceMappingURL=useAtom.d.cts.map