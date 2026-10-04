import { ReadonlyStore, Store, StoreActionMap, StoreActionsFactory } from "@tanstack/store";

//#region src/useCreateStore.d.ts
type NonFunction<T> = T extends ((...args: Array<any>) => any) ? never : T;
/**
 * Creates a stable store instance for the lifetime of the component.
 *
 * Pass an initial value to create a writable store, or a getter function to
 * create a readonly derived store. This hook mirrors the overloads from
 * {@link createStore}, but ensures the store is only created once per mount.
 *
 * @example
 * ```tsx
 * const counterStore = useCreateStore({ count: 0 })
 * ```
 */
declare function useCreateStore<T>(getValue: (prev?: NoInfer<T>) => T): ReadonlyStore<T>;
declare function useCreateStore<T>(initialValue: T): Store<T>;
declare function useCreateStore<T, TActions extends StoreActionMap>(initialValue: NonFunction<T>, actions: StoreActionsFactory<T, TActions>): Store<T, TActions>;
//#endregion
export { useCreateStore };
//# sourceMappingURL=useCreateStore.d.cts.map