/* eslint-disable */
// Adapted from Alien Signals
// https://github.com/stackblitz/alien-signals/

import {
  DIRTY,
  MUTABLE,
  NONE,
  PENDING,
  RECURSED,
  RECURSED_CHECK,
  WATCHING,
  createReactiveSystem,
} from './alien'

import type { ReactiveNode } from './alien'

export { createReactiveSystem } from './alien'
export type { Link, ReactiveFlags, ReactiveNode } from './alien'

interface EffectNode extends ReactiveNode {
  fn(): void
}

interface ComputedNode<T = any> extends ReactiveNode {
  value: T | undefined
  getter: (previousValue?: T) => T
}

interface SignalNode<T = any> extends ReactiveNode {
  currentValue: T
  pendingValue: T
}

let cycle = 0
let batchDepth = 0
let notifyIndex = 0
let queuedLength = 0
let activeSub: ReactiveNode | undefined

const queued: (EffectNode | undefined)[] = []
const { link, unlink, propagate, checkDirty, shallowPropagate } =
  /* @__PURE__ */ createReactiveSystem({
    update(node: SignalNode | ComputedNode): boolean {
      if (node.depsTail !== undefined) {
        return updateComputed(node as ComputedNode)
      } else {
        return updateSignal(node as SignalNode)
      }
    },
    notify(effect: EffectNode) {
      let insertIndex = queuedLength
      let firstInsertedIndex = insertIndex

      do {
        queued[insertIndex++] = effect
        effect.flags &= ~WATCHING
        effect = effect.subs?.sub as EffectNode
        if (effect === undefined || !(effect.flags & WATCHING)) {
          break
        }
      } while (true)

      queuedLength = insertIndex

      while (firstInsertedIndex < --insertIndex) {
        const left = queued[firstInsertedIndex]
        queued[firstInsertedIndex++] = queued[insertIndex]
        queued[insertIndex] = left
      }
    },
    unwatched(node) {
      if (!(node.flags & MUTABLE)) {
        effectScopeOper.call(node)
      } else if (node.depsTail !== undefined) {
        node.depsTail = undefined
        node.flags = MUTABLE | DIRTY
        purgeDeps(node)
      }
    },
  })

export function getActiveSub(): ReactiveNode | undefined {
  return activeSub
}

export function setActiveSub(sub?: ReactiveNode) {
  const prevSub = activeSub
  activeSub = sub
  return prevSub
}

export function getBatchDepth(): number {
  return batchDepth
}

export function startBatch() {
  ++batchDepth
}

export function endBatch() {
  if (!--batchDepth) {
    flush()
  }
}

export function isSignal(fn: () => void): boolean {
  return fn.name === 'bound ' + signalOper.name
}

export function isComputed(fn: () => void): boolean {
  return fn.name === 'bound ' + computedOper.name
}

export function isEffect(fn: () => void): boolean {
  return fn.name === 'bound ' + effectOper.name
}

export function isEffectScope(fn: () => void): boolean {
  return fn.name === 'bound ' + effectScopeOper.name
}

export function signal<T>(): {
  (): T | undefined
  (value: T | undefined): void
}
export function signal<T>(initialValue: T): {
  (): T
  (value: T): void
}
export function signal<T>(initialValue?: T): {
  (): T | undefined
  (value: T | undefined): void
} {
  return signalOper.bind({
    currentValue: initialValue,
    pendingValue: initialValue,
    subs: undefined,
    subsTail: undefined,
    flags: MUTABLE,
  }) as () => T | undefined
}

export function computed<T>(getter: (previousValue?: T) => T): () => T {
  return computedOper.bind({
    value: undefined,
    subs: undefined,
    subsTail: undefined,
    deps: undefined,
    depsTail: undefined,
    flags: NONE,
    getter: getter as (previousValue?: unknown) => unknown,
  }) as () => T
}

export function effect(fn: () => void): () => void {
  const e: EffectNode = {
    fn,
    subs: undefined,
    subsTail: undefined,
    deps: undefined,
    depsTail: undefined,
    flags: WATCHING | RECURSED_CHECK,
  }
  const prevSub = setActiveSub(e)
  if (prevSub !== undefined) {
    link(e, prevSub, 0)
  }
  try {
    e.fn()
  } finally {
    activeSub = prevSub
    e.flags &= ~RECURSED_CHECK
  }
  return effectOper.bind(e)
}

export function effectScope(fn: () => void): () => void {
  const e: ReactiveNode = {
    deps: undefined,
    depsTail: undefined,
    subs: undefined,
    subsTail: undefined,
    flags: NONE,
  }
  const prevSub = setActiveSub(e)
  if (prevSub !== undefined) {
    link(e, prevSub, 0)
  }
  try {
    fn()
  } finally {
    activeSub = prevSub
  }
  return effectScopeOper.bind(e)
}

export function trigger(fn: () => void) {
  const sub: ReactiveNode = {
    deps: undefined,
    depsTail: undefined,
    flags: WATCHING,
  }
  const prevSub = setActiveSub(sub)
  try {
    fn()
  } finally {
    activeSub = prevSub
    let link = sub.deps
    while (link !== undefined) {
      const dep = link.dep
      link = unlink(link, sub)
      const subs = dep.subs
      if (subs !== undefined) {
        sub.flags = NONE
        propagate(subs)
        shallowPropagate(subs)
      }
    }
    if (!batchDepth) {
      flush()
    }
  }
}

function updateComputed(c: ComputedNode): boolean {
  ++cycle
  c.depsTail = undefined
  c.flags = MUTABLE | RECURSED_CHECK
  const prevSub = setActiveSub(c)
  try {
    const oldValue = c.value
    return oldValue !== (c.value = c.getter(oldValue))
  } finally {
    activeSub = prevSub
    c.flags &= ~RECURSED_CHECK
    purgeDeps(c)
  }
}

function updateSignal(s: SignalNode): boolean {
  s.flags = MUTABLE
  return s.currentValue !== (s.currentValue = s.pendingValue)
}

function run(e: EffectNode): void {
  const flags = e.flags
  if (flags & DIRTY || (flags & PENDING && checkDirty(e.deps!, e))) {
    ++cycle
    e.depsTail = undefined
    e.flags = WATCHING | RECURSED_CHECK
    const prevSub = setActiveSub(e)
    try {
      ;(e as EffectNode).fn()
    } finally {
      activeSub = prevSub
      e.flags &= ~RECURSED_CHECK
      purgeDeps(e)
    }
  } else {
    e.flags = WATCHING
  }
}

function flush(): void {
  try {
    while (notifyIndex < queuedLength) {
      const effect = queued[notifyIndex]!
      queued[notifyIndex++] = undefined
      run(effect)
    }
  } finally {
    while (notifyIndex < queuedLength) {
      const effect = queued[notifyIndex]!
      queued[notifyIndex++] = undefined
      effect.flags |= WATCHING | RECURSED
    }
    notifyIndex = 0
    queuedLength = 0
  }
}

function computedOper<T>(this: ComputedNode<T>): T {
  const flags = this.flags
  if (
    flags & DIRTY ||
    (flags & PENDING &&
      (checkDirty(this.deps!, this) ||
        ((this.flags = flags & ~PENDING), false)))
  ) {
    if (updateComputed(this)) {
      const subs = this.subs
      if (subs !== undefined) {
        shallowPropagate(subs)
      }
    }
  } else if (!flags) {
    this.flags = MUTABLE | RECURSED_CHECK
    const prevSub = setActiveSub(this)
    try {
      this.value = this.getter()
    } finally {
      activeSub = prevSub
      this.flags &= ~RECURSED_CHECK
    }
  }
  const sub = activeSub
  if (sub !== undefined) {
    link(this, sub, cycle)
  }
  return this.value!
}

function signalOper<T>(this: SignalNode<T>, ...value: [T]): T | void {
  if (value.length) {
    if (this.pendingValue !== (this.pendingValue = value[0])) {
      this.flags = MUTABLE | DIRTY
      const subs = this.subs
      if (subs !== undefined) {
        propagate(subs)
        if (!batchDepth) {
          flush()
        }
      }
    }
  } else {
    if (this.flags & DIRTY) {
      if (updateSignal(this)) {
        const subs = this.subs
        if (subs !== undefined) {
          shallowPropagate(subs)
        }
      }
    }
    let sub = activeSub
    while (sub !== undefined) {
      if (sub.flags & (MUTABLE | WATCHING)) {
        link(this, sub, cycle)
        break
      }
      sub = sub.subs?.sub
    }
    return this.currentValue
  }
}

function effectOper(this: EffectNode): void {
  effectScopeOper.call(this)
}

function effectScopeOper(this: ReactiveNode): void {
  this.depsTail = undefined
  this.flags = NONE
  purgeDeps(this)
  const sub = this.subs
  if (sub !== undefined) {
    unlink(sub)
  }
}

function purgeDeps(sub: ReactiveNode) {
  const depsTail = sub.depsTail
  let dep = depsTail !== undefined ? depsTail.nextDep : sub.deps
  while (dep !== undefined) {
    dep = unlink(dep, sub)
  }
}
