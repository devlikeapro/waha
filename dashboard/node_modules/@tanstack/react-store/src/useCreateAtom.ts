import { useState } from 'react'
import { createAtom } from '@tanstack/store'
import type { Atom, AtomOptions, ReadonlyAtom } from '@tanstack/store'

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
export function useCreateAtom<T>(
  getValue: (prev?: NoInfer<T>) => T,
  options?: AtomOptions<T>,
): ReadonlyAtom<T>
export function useCreateAtom<T>(
  initialValue: T,
  options?: AtomOptions<T>,
): Atom<T>
export function useCreateAtom<T>(
  valueOrFn: T | ((prev?: T) => T),
  options?: AtomOptions<T>,
): Atom<T> | ReadonlyAtom<T> {
  const [atom] = useState<Atom<T> | ReadonlyAtom<T>>(() => {
    if (typeof valueOrFn === 'function') {
      return createAtom(valueOrFn as (prev?: NoInfer<T>) => T, options)
    }

    return createAtom(valueOrFn, options)
  })

  return atom
}
