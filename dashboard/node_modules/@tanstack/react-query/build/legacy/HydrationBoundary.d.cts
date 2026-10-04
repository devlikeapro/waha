import * as React from "react";
import { DehydratedState, HydrateOptions, OmitKeyof, QueryClient } from "@tanstack/query-core";
//#region src/HydrationBoundary.d.ts
/**
 * The props accepted by `HydrationBoundary`.
 */
interface HydrationBoundaryProps {
  /**
   * The state to hydrate.
   */
  state: DehydratedState | null | undefined;
  /**
   * Optional. Note: unlike `hydrate`, `mutations` cannot be set here.
   */
  options?: OmitKeyof<HydrateOptions, 'defaultOptions'> & {
    defaultOptions?: OmitKeyof<Exclude<HydrateOptions['defaultOptions'], undefined>, 'mutations'>;
  };
  /**
   * The components to render — always rendered unconditionally, not gated on hydration. New queries are
   * hydrated into the cache during render; for queries that already exist in the cache, only newer dehydrated
   * data is hydrated, and that happens in an effect after commit, so `children` may render briefly before it
   * lands.
   */
  children?: React.ReactNode;
  /**
   * Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will be used.
   */
  queryClient?: QueryClient;
}
/**
 * `HydrationBoundary` adds a previously dehydrated state into the `queryClient` that would be returned by
 * `useQueryClient()`. If the client already contains data, the new queries will be intelligently merged based on
 * update timestamp.
 *
 * Note: Only `queries` can be dehydrated with an `HydrationBoundary`.
 *
 * @returns The provided `children`, rendered unconditionally. New queries in `state` are hydrated into the
 * cache during render; for queries already in the cache, only newer dehydrated data is hydrated, in an effect
 * after commit.
 *
 * @example
 * ```tsx
 * import { HydrationBoundary } from '@tanstack/react-query'
 *
 * function App() {
 *   return <HydrationBoundary state={dehydratedState}>...</HydrationBoundary>
 * }
 * ```
 *
 * @example
 * Server-side prefetch handed off to the client via `dehydrate`:
 * ```tsx
 * import { HydrationBoundary, dehydrate, noop } from '@tanstack/react-query'
 *
 * async function ServerComponent() {
 *   const queryClient = getQueryClient()
 *
 *   await queryClient
 *     .query({
 *       queryKey: ['posts'],
 *       queryFn: fetchPosts,
 *     })
 *     .catch(noop)
 *
 *   return (
 *     <HydrationBoundary state={dehydrate(queryClient)}>
 *       <Posts />
 *     </HydrationBoundary>
 *   )
 * }
 * ```
 */
declare const HydrationBoundary: ({ children, options, state, queryClient }: HydrationBoundaryProps) => React.ReactElement;
//#endregion
export { HydrationBoundary, HydrationBoundaryProps };
//# sourceMappingURL=HydrationBoundary.d.cts.map