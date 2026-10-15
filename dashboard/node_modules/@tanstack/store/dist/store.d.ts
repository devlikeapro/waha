import { Observer, Subscription } from "./types.js";

//#region src/store.d.ts
type StoreAction = (...args: Array<any>) => any;
type StoreActionMap = Record<string, StoreAction>;
type StoreActionsFactory<T, TActions extends StoreActionMap> = (store: {
  setState: Store<T>['setState'];
  get: Store<T>['get'];
}) => TActions;
type NonFunction<T> = T extends ((...args: Array<any>) => any) ? never : T;
declare class Store<T, TActions extends StoreActionMap = never> {
  private atom;
  readonly actions: TActions;
  constructor(getValue: (prev?: NoInfer<T>) => T);
  constructor(initialValue: T);
  constructor(initialValue: NonFunction<T>, actionsFactory: StoreActionsFactory<T, TActions>);
  setState(updater: (prev: T) => T): void;
  get state(): T;
  get(): T;
  subscribe(observerOrFn: Observer<T> | ((value: T) => void)): Subscription;
}
declare class ReadonlyStore<T> implements Omit<Store<T>, 'setState' | 'actions'> {
  private atom;
  constructor(getValue: (prev?: NoInfer<T>) => T);
  constructor(initialValue: T);
  get state(): T;
  get(): T;
  subscribe(observerOrFn: Observer<T> | ((value: T) => void)): Subscription;
}
declare function createStore<T>(getValue: (prev?: NoInfer<T>) => T): ReadonlyStore<T>;
declare function createStore<T>(initialValue: T): Store<T>;
declare function createStore<T, TActions extends StoreActionMap>(initialValue: NonFunction<T>, actions: StoreActionsFactory<T, TActions>): Store<T, TActions>;
//#endregion
export { ReadonlyStore, Store, StoreAction, StoreActionMap, StoreActionsFactory, createStore };
//# sourceMappingURL=store.d.ts.map