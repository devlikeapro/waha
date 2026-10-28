/* eslint-disable */
// Adapted from Alien Signals
// https://github.com/stackblitz/alien-signals/

export interface ReactiveNode {
  deps?: Link
  depsTail?: Link
  subs?: Link
  subsTail?: Link
  flags: ReactiveFlags
}

export interface Link {
  version: number
  dep: ReactiveNode
  sub: ReactiveNode
  prevSub: Link | undefined
  nextSub: Link | undefined
  prevDep: Link | undefined
  nextDep: Link | undefined
}

interface Stack<T> {
  value: T
  prev: Stack<T> | undefined
}

export type ReactiveFlags = number

export const NONE = 0
export const MUTABLE = 1
export const WATCHING = 2
export const RECURSED_CHECK = 4
export const RECURSED = 8
export const DIRTY = 16
export const PENDING = 32
/*@__NO_SIDE_EFFECTS__*/
export function createReactiveSystem({
  update,
  notify,
  unwatched,
}: {
  update(sub: ReactiveNode): boolean
  notify(sub: ReactiveNode): void
  unwatched(sub: ReactiveNode): void
}) {
  return {
    link,
    unlink,
    propagate,
    checkDirty,
    shallowPropagate,
  }

  function link(dep: ReactiveNode, sub: ReactiveNode, version: number): void {
    const prevDep = sub.depsTail
    if (prevDep !== undefined && prevDep.dep === dep) {
      return
    }
    const nextDep = prevDep !== undefined ? prevDep.nextDep : sub.deps
    if (nextDep !== undefined && nextDep.dep === dep) {
      nextDep.version = version
      sub.depsTail = nextDep
      return
    }
    const prevSub = dep.subsTail
    if (
      prevSub !== undefined &&
      prevSub.version === version &&
      prevSub.sub === sub
    ) {
      return
    }
    const newLink =
      (sub.depsTail =
      dep.subsTail =
        {
          version,
          dep,
          sub,
          prevDep,
          nextDep,
          prevSub,
          nextSub: undefined,
        })
    if (nextDep !== undefined) {
      nextDep.prevDep = newLink
    }
    if (prevDep !== undefined) {
      prevDep.nextDep = newLink
    } else {
      sub.deps = newLink
    }
    if (prevSub !== undefined) {
      prevSub.nextSub = newLink
    } else {
      dep.subs = newLink
    }
  }

  function unlink(link: Link, sub = link.sub): Link | undefined {
    const dep = link.dep
    const prevDep = link.prevDep
    const nextDep = link.nextDep
    const nextSub = link.nextSub
    const prevSub = link.prevSub
    if (nextDep !== undefined) {
      nextDep.prevDep = prevDep
    } else {
      sub.depsTail = prevDep
    }
    if (prevDep !== undefined) {
      prevDep.nextDep = nextDep
    } else {
      sub.deps = nextDep
    }
    if (nextSub !== undefined) {
      nextSub.prevSub = prevSub
    } else {
      dep.subsTail = prevSub
    }
    if (prevSub !== undefined) {
      prevSub.nextSub = nextSub
    } else if ((dep.subs = nextSub) === undefined) {
      unwatched(dep)
    }
    return nextDep
  }

  function propagate(link: Link): void {
    let next = link.nextSub
    let stack: Stack<Link | undefined> | undefined

    top: do {
      const sub = link.sub
      let flags = sub.flags

      if (!(flags & (RECURSED_CHECK | RECURSED | DIRTY | PENDING))) {
        sub.flags = flags | PENDING
      } else if (!(flags & (RECURSED_CHECK | RECURSED))) {
        flags = NONE
      } else if (!(flags & RECURSED_CHECK)) {
        sub.flags = (flags & ~RECURSED) | PENDING
      } else if (!(flags & (DIRTY | PENDING)) && isValidLink(link, sub)) {
        sub.flags = flags | (RECURSED | PENDING)
        flags &= MUTABLE
      } else {
        flags = NONE
      }

      if (flags & WATCHING) {
        notify(sub)
      }

      if (flags & MUTABLE) {
        const subSubs = sub.subs
        if (subSubs !== undefined) {
          const nextSub = (link = subSubs).nextSub
          if (nextSub !== undefined) {
            stack = { value: next, prev: stack }
            next = nextSub
          }
          continue
        }
      }

      if ((link = next!) !== undefined) {
        next = link.nextSub
        continue
      }

      while (stack !== undefined) {
        link = stack.value!
        stack = stack.prev
        if (link !== undefined) {
          next = link.nextSub
          continue top
        }
      }

      break
    } while (true)
  }

  function checkDirty(link: Link, sub: ReactiveNode): boolean {
    let stack: Stack<Link> | undefined
    let checkDepth = 0
    let dirty = false

    top: do {
      const dep = link.dep
      const flags = dep.flags

      if (sub.flags & DIRTY) {
        dirty = true
      } else if ((flags & (MUTABLE | DIRTY)) === (MUTABLE | DIRTY)) {
        if (update(dep)) {
          const subs = dep.subs!
          if (subs.nextSub !== undefined) {
            shallowPropagate(subs)
          }
          dirty = true
        }
      } else if ((flags & (MUTABLE | PENDING)) === (MUTABLE | PENDING)) {
        if (link.nextSub !== undefined || link.prevSub !== undefined) {
          stack = { value: link, prev: stack }
        }
        link = dep.deps!
        sub = dep
        ++checkDepth
        continue
      }

      if (!dirty) {
        const nextDep = link.nextDep
        if (nextDep !== undefined) {
          link = nextDep
          continue
        }
      }

      while (checkDepth--) {
        const firstSub = sub.subs!
        const hasMultipleSubs = firstSub.nextSub !== undefined
        if (hasMultipleSubs) {
          link = stack!.value
          stack = stack!.prev
        } else {
          link = firstSub
        }
        if (dirty) {
          if (update(sub)) {
            if (hasMultipleSubs) {
              shallowPropagate(firstSub)
            }
            sub = link.sub
            continue
          }
          dirty = false
        } else {
          sub.flags &= ~PENDING
        }
        sub = link.sub
        const nextDep = link.nextDep
        if (nextDep !== undefined) {
          link = nextDep
          continue top
        }
      }

      return dirty
    } while (true)
  }

  function shallowPropagate(link: Link): void {
    do {
      const sub = link.sub
      const flags = sub.flags
      if ((flags & (PENDING | DIRTY)) === PENDING) {
        sub.flags = flags | DIRTY
        if ((flags & (WATCHING | RECURSED_CHECK)) === WATCHING) {
          notify(sub)
        }
      }
    } while ((link = link.nextSub!) !== undefined)
  }

  function isValidLink(checkLink: Link, sub: ReactiveNode): boolean {
    let link = sub.depsTail
    while (link !== undefined) {
      if (link === checkLink) {
        return true
      }
      link = link.prevDep
    }
    return false
  }
}
