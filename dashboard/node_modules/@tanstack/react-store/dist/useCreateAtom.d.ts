import { Atom, AtomOptions, ReadonlyAtom } from "@tanstack/store";

//#region src/useCreateAtom.d.ts
/**
 * Creates a stable atom instance for the lifetime of the component.
 *
 * Pass an initial value to create a writable atom, or a getter function to
 * create a readonly derived atom. This hook mirrors the overloads from
 * {@link createAtom}, but ensures the atom is only created once per mount.
 *
 * @example
 * ```tsx
 * const countAtom = useCreateAtom(0)
 * ```
 */
declare function useCreateAtom<T>(getValue: (prev?: NoInfer<T>) => T, options?: AtomOptions<T>): ReadonlyAtom<T>;
declare function useCreateAtom<T>(initialValue: T, options?: AtomOptions<T>): Atom<T>;
//#endregion
export { useCreateAtom };
//# sourceMappingURL=useCreateAtom.d.ts.map