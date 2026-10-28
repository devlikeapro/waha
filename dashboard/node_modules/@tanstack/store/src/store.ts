import { createAtom, toObserver } from './atom'
import type { Atom, Observer, Subscription } from './types'

export type StoreAction = (...args: Array<any>) => any

export type StoreActionMap = Record<string, StoreAction>

export type StoreActionsFactory<T, TActions extends StoreActionMap> = (store: {
  setState: Store<T>['setState']
  get: Store<T>['get']
}) => TActions

type NonFunction<T> = T extends (...args: Array<any>) => any ? never : T

export class Store<T, TActions extends StoreActionMap = never> {
  private atom: Atom<T>
  public readonly actions!: TActions
  constructor(getValue: (prev?: NoInfer<T>) => T)
  constructor(initialValue: T)
  constructor(
    initialValue: NonFunction<T>,
    actionsFactory: StoreActionsFactory<T, TActions>,
  )
  constructor(
    valueOrFn: T | ((prev?: T) => T),
    actionsFactory?: StoreActionsFactory<T, TActions>,
  ) {
    // createAtom has overloads that return ReadonlyAtom<T> for functions and Atom<T> for values
    // Store always needs Atom<T> for setState, so we assert the return type
    this.atom = createAtom(
      valueOrFn as T | ((prev?: NoInfer<T>) => T),
    ) as Atom<T>

    // bind for safe destructuring
    this.get = this.get.bind(this)
    this.setState = this.setState.bind(this)
    this.subscribe = this.subscribe.bind(this)

    if (actionsFactory) {
      this.actions = actionsFactory(this)
    }
  }
  public setState(updater: (prev: T) => T) {
    this.atom.set(updater)
  }
  public get state() {
    return this.atom.get()
  }
  public get() {
    return this.state
  }
  public subscribe(
    observerOrFn: Observer<T> | ((value: T) => void),
  ): Subscription {
    return this.atom.subscribe(toObserver(observerOrFn))
  }
}

export class ReadonlyStore<T> implements Omit<
  Store<T>,
  'setState' | 'actions'
> {
  private atom: Atom<T>
  constructor(getValue: (prev?: NoInfer<T>) => T)
  constructor(initialValue: T)
  constructor(valueOrFn: T | ((prev?: T) => T)) {
    // createAtom has overloads that return ReadonlyAtom<T> for functions and Atom<T> for values
    // Store always needs Atom<T> for setState, so we assert the return type
    this.atom = createAtom(
      valueOrFn as T | ((prev?: NoInfer<T>) => T),
    ) as Atom<T>
  }
  public get state() {
    return this.atom.get()
  }
  public get() {
    return this.state
  }
  public subscribe(
    observerOrFn: Observer<T> | ((value: T) => void),
  ): Subscription {
    return this.atom.subscribe(toObserver(observerOrFn))
  }
}

export function createStore<T>(
  getValue: (prev?: NoInfer<T>) => T,
): ReadonlyStore<T>
export function createStore<T>(initialValue: T): Store<T>
export function createStore<T, TActions extends StoreActionMap>(
  initialValue: NonFunction<T>,
  actions: StoreActionsFactory<T, TActions>,
): Store<T, TActions>
export function createStore<T, TActions extends StoreActionMap>(
  valueOrFn: T | ((prev?: T) => T),
  actions?: StoreActionsFactory<T, TActions>,
): Store<T, TActions> | Store<T> | ReadonlyStore<T> {
  if (typeof valueOrFn === 'function') {
    return new ReadonlyStore(valueOrFn as (prev?: NoInfer<T>) => T)
  }
  if (actions) {
    return new Store(valueOrFn as NonFunction<T>, actions)
  }
  return new Store(valueOrFn)
}
