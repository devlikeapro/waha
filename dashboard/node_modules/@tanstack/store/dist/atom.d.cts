import { Atom, AtomOptions, Observer, ReadonlyAtom } from "./types.cjs";

//#region src/atom.d.ts
declare function toObserver<T>(nextHandler?: Observer<T> | ((value: T) => void), errorHandler?: (error: any) => void, completionHandler?: () => void): Observer<T>;
declare function batch(fn: () => void): void;
declare function flush(): void;
type AsyncAtomState<TData, TError = unknown> = {
  status: 'pending';
} | {
  status: 'done';
  data: TData;
} | {
  status: 'error';
  error: TError;
};
declare function createAsyncAtom<T>(getValue: () => Promise<T>, options?: AtomOptions<AsyncAtomState<T>>): ReadonlyAtom<AsyncAtomState<T>>;
declare function createAtom<T>(getValue: (prev?: NoInfer<T>) => T, options?: AtomOptions<T>): ReadonlyAtom<T>;
declare function createAtom<T>(initialValue: T, options?: AtomOptions<T>): Atom<T>;
//#endregion
export { batch, createAsyncAtom, createAtom, flush, toObserver };
//# sourceMappingURL=atom.d.cts.map