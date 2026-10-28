import { Atom, ReadonlyAtom, ReadonlyStore, Store } from "@tanstack/store";
//#region src/core/reactivity/coreReactivityFeature.utils.d.ts
/**
 * Converts a writable atom to the store-compatible shape expected by core.
 *
 * @example
 * ```ts
 * const store = atomToStore(atom)
 * ```
 */
declare function atomToStore<T>(atom: Atom<T>): Store<T>;
/**
 * Converts a readonly atom to a readonly store-compatible shape.
 *
 * @example
 * ```ts
 * const store = atomToStore(atom)
 * ```
 */
declare function atomToStore<T>(atom: ReadonlyAtom<T>): ReadonlyStore<T>;
//#endregion
export { atomToStore };