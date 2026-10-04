import { useSelector } from './useSelector'
import type { Atom } from '@tanstack/store'
import type { UseSelectorOptions } from './useSelector'

/**
 * Returns the current atom value together with a stable setter.
 *
 * This is the writable-atom convenience hook for components that need to both
 * read and update the same atom.
 *
 * @example
 * ```tsx
 * const [count, setCount] = useAtom(countAtom)
 * ```
 */
export function useAtom<TValue>(
  atom: Atom<TValue>,
  options?: UseSelectorOptions<TValue>,
): [TValue, Atom<TValue>['set']] {
  const value = useSelector(atom, undefined, options)

  return [value, atom.set]
}
