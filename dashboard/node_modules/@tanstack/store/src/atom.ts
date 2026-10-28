import {
  DIRTY,
  MUTABLE,
  NONE,
  PENDING,
  RECURSED_CHECK,
  WATCHING,
  createReactiveSystem,
} from './alien'

import type { ReactiveNode } from './alien'
import type {
  Atom,
  AtomOptions,
  Observer,
  ReadonlyAtom,
  Subscription,
} from './types'

export function toObserver<T>(
  nextHandler?: Observer<T> | ((value: T) => void),
  errorHandler?: (error: any) => void,
  completionHandler?: () => void,
): Observer<T> {
  const isObserver = typeof nextHandler === 'object'
  const self = isObserver ? nextHandler : undefined

  return {
    next: (isObserver ? nextHandler.next : nextHandler)?.bind(self),
    error: (isObserver ? nextHandler.error : errorHandler)?.bind(self),
    complete: (isObserver ? nextHandler.complete : completionHandler)?.bind(
      self,
    ),
  }
}

interface InternalAtom<T> extends ReactiveNode {
  _snapshot: T
  _update: (getValue?: T | ((snapshot: T) => T)) => boolean
  get: () => T
  subscribe: (observerOrFn: Observer<T> | ((value: T) => void)) => Subscription
}

const queuedEffects: Array<Effect | undefined> = []
let cycle = 0
const { link, unlink, propagate, checkDirty, shallowPropagate } =
  createReactiveSystem({
    update(atom: InternalAtom<any>): boolean {
      return atom._update()
    },
    // eslint-disable-next-line no-shadow
    notify(effect: Effect): void {
      queuedEffects[queuedEffectsLength++] = effect
      effect.flags &= ~WATCHING
    },
    unwatched(atom: InternalAtom<any>): void {
      if (atom.depsTail !== undefined) {
        atom.depsTail = undefined
        atom.flags = MUTABLE | DIRTY
        purgeDeps(atom)
      }
    },
  })

let notifyIndex = 0
let queuedEffectsLength = 0
let activeSub: ReactiveNode | undefined
let batchDepth = 0

export function batch(fn: () => void) {
  try {
    ++batchDepth
    fn()
  } finally {
    if (!--batchDepth) {
      flush()
    }
  }
}

function purgeDeps(sub: ReactiveNode) {
  const depsTail = sub.depsTail
  let dep = depsTail !== undefined ? depsTail.nextDep : sub.deps
  while (dep !== undefined) {
    dep = unlink(dep, sub)
  }
}

export function flush(): void {
  if (batchDepth > 0) {
    return
  }
  while (notifyIndex < queuedEffectsLength) {
    // eslint-disable-next-line no-shadow
    const effect = queuedEffects[notifyIndex]!
    queuedEffects[notifyIndex++] = undefined
    effect.notify()
  }
  notifyIndex = 0
  queuedEffectsLength = 0
}

type AsyncAtomState<TData, TError = unknown> =
  | { status: 'pending' }
  | { status: 'done'; data: TData }
  | { status: 'error'; error: TError }

export function createAsyncAtom<T>(
  getValue: () => Promise<T>,
  options?: AtomOptions<AsyncAtomState<T>>,
): ReadonlyAtom<AsyncAtomState<T>> {
  const ref: { current?: InternalAtom<AsyncAtomState<T>> } = {}
  const atom = createAtom<AsyncAtomState<T>>(() => {
    getValue().then(
      (data) => {
        const internalAtom = ref.current!
        if (internalAtom._update({ status: 'done', data })) {
          const subs = internalAtom.subs
          if (subs !== undefined) {
            propagate(subs)
            shallowPropagate(subs)
            flush()
          }
        }
      },
      (error) => {
        const internalAtom = ref.current!
        if (internalAtom._update({ status: 'error', error })) {
          const subs = internalAtom.subs
          if (subs !== undefined) {
            propagate(subs)
            shallowPropagate(subs)
            flush()
          }
        }
      },
    )

    return { status: 'pending' }
  }, options)
  ref.current = atom as unknown as InternalAtom<AsyncAtomState<T>>

  return atom
}

export function createAtom<T>(
  getValue: (prev?: NoInfer<T>) => T,
  options?: AtomOptions<T>,
): ReadonlyAtom<T>
export function createAtom<T>(
  initialValue: T,
  options?: AtomOptions<T>,
): Atom<T>
export function createAtom<T>(
  valueOrFn: T | ((prev?: T) => T),
  options?: AtomOptions<T>,
): Atom<T> | ReadonlyAtom<T> {
  const isComputed = typeof valueOrFn === 'function'
  const getter = valueOrFn as (prev?: T) => T

  // Create plain object atom
  const atom: InternalAtom<T> = {
    _snapshot: isComputed ? undefined! : valueOrFn,

    subs: undefined,
    subsTail: undefined,
    deps: undefined,
    depsTail: undefined,
    flags: isComputed ? NONE : MUTABLE,

    get(): T {
      if (activeSub !== undefined) {
        link(atom, activeSub, cycle)
      }
      return atom._snapshot
    },

    subscribe(observerOrFn: Observer<T> | ((value: T) => void)) {
      const obs = toObserver(observerOrFn)
      const observed = { current: false }
      const e = effect(() => {
        atom.get()
        if (!observed.current) {
          observed.current = true
        } else {
          obs.next?.(atom._snapshot)
        }
      })

      return {
        unsubscribe: () => {
          e.stop()
        },
      }
    },
    _update(getValue?: T | ((snapshot: T) => T)): boolean {
      const prevSub = activeSub
      const compare = options?.compare ?? Object.is
      if (isComputed) {
        activeSub = atom
        ++cycle
        atom.depsTail = undefined
      } else if (getValue === undefined) {
        // Mutable atoms can be marked dirty by the reactive graph, but they should
        // never be recomputed without an explicit value/updater.
        return false
      }
      if (isComputed) {
        atom.flags = MUTABLE | RECURSED_CHECK
      }
      try {
        const oldValue = atom._snapshot
        const newValue =
          typeof getValue === 'function'
            ? (getValue as (snapshot: T) => T)(oldValue)
            : getValue === undefined && isComputed
              ? getter(oldValue)
              : getValue!
        if (oldValue === undefined || !compare(oldValue, newValue)) {
          atom._snapshot = newValue
          return true
        }
        return false
      } finally {
        activeSub = prevSub
        if (isComputed) {
          atom.flags &= ~RECURSED_CHECK
        }
        purgeDeps(atom)
      }
    },
  }

  if (isComputed) {
    atom.flags = MUTABLE | DIRTY
    atom.get = function (): T {
      const flags = atom.flags
      if (flags & DIRTY || (flags & PENDING && checkDirty(atom.deps!, atom))) {
        if (atom._update()) {
          const subs = atom.subs
          if (subs !== undefined) {
            shallowPropagate(subs)
          }
        }
      } else if (flags & PENDING) {
        atom.flags = flags & ~PENDING
      }
      if (activeSub !== undefined) {
        link(atom, activeSub, cycle)
      }
      return atom._snapshot
    }
  } else {
    ;(atom as unknown as Atom<T>).set = function (
      // eslint-disable-next-line no-shadow
      valueOrFn: T | ((prev: T) => T),
    ): void {
      if (atom._update(valueOrFn)) {
        const subs = atom.subs
        if (subs !== undefined) {
          propagate(subs)
          shallowPropagate(subs)
          flush()
        }
      }
    }
  }

  return atom as unknown as Atom<T> | ReadonlyAtom<T>
}

interface Effect extends ReactiveNode {
  notify: () => void
  stop: () => void
}

function effect<T>(fn: () => T): Effect {
  const run = (): T => {
    const prevSub = activeSub
    activeSub = effectObj
    ++cycle
    effectObj.depsTail = undefined
    effectObj.flags = WATCHING | RECURSED_CHECK
    try {
      return fn()
    } finally {
      activeSub = prevSub
      effectObj.flags &= ~RECURSED_CHECK
      purgeDeps(effectObj)
    }
  }
  const effectObj: Effect = {
    deps: undefined,
    depsTail: undefined,
    subs: undefined,
    subsTail: undefined,
    flags: WATCHING | RECURSED_CHECK,

    notify(): void {
      const flags = this.flags
      if (flags & DIRTY || (flags & PENDING && checkDirty(this.deps!, this))) {
        run()
      } else {
        this.flags = WATCHING
      }
    },

    stop(): void {
      this.flags = NONE
      this.depsTail = undefined
      purgeDeps(this)
    },
  }

  run()

  return effectObj
}
