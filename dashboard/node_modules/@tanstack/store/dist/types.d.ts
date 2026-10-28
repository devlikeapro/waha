import { ReactiveNode } from "./alien.js";

//#region src/types.d.ts
type Selection<TSelected> = Readable<TSelected>;
interface InteropSubscribable<T> {
  subscribe: (observer: Observer<T>) => Subscription;
}
type Observer<T> = {
  next?: (value: T) => void;
  error?: (err: unknown) => void;
  complete?: () => void;
};
interface Subscription {
  unsubscribe: () => void;
}
interface Subscribable<T> extends InteropSubscribable<T> {
  subscribe: ((observer: Observer<T>) => Subscription) & ((next: (value: T) => void, error?: (error: any) => void, complete?: () => void) => Subscription);
}
interface Readable<T> extends Subscribable<T> {
  get: () => T;
}
interface BaseAtom<T> extends Subscribable<T>, Readable<T> {}
interface InternalBaseAtom<T> extends Subscribable<T>, Readable<T> {
  /** @internal */
  _snapshot: T;
  /** @internal */
  _update: (getValue?: T | ((snapshot: T) => T)) => boolean;
}
interface Atom<T> extends BaseAtom<T> {
  /** Sets the value of the atom using a function. */
  set: ((fn: (prevVal: T) => T) => void) & ((value: T) => void);
}
interface AtomOptions<T> {
  compare?: (prev: T, next: T) => boolean;
}
type AnyAtom = BaseAtom<any>;
interface InternalReadonlyAtom<T> extends InternalBaseAtom<T>, ReactiveNode {}
/**
 * An atom that is read-only and cannot be set.
 *
 * @example
 *
 * ```ts
 * const atom = createAtom(() => 42);
 * // @ts-expect-error - Cannot set a readonly atom
 * atom.set(43);
 * ```
 */
interface ReadonlyAtom<T> extends BaseAtom<T> {}
//#endregion
export { AnyAtom, Atom, AtomOptions, BaseAtom, InternalBaseAtom, InternalReadonlyAtom, InteropSubscribable, Observer, Readable, ReadonlyAtom, Selection, Subscribable, Subscription };
//# sourceMappingURL=types.d.ts.map