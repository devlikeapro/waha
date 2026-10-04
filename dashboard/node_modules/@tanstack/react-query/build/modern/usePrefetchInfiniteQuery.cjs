Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_QueryClientProvider = require("./QueryClientProvider.cjs");
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/usePrefetchInfiniteQuery.tsx
/**
* `usePrefetchInfiniteQuery` does not return anything, it should be used just to fire a prefetch during render,
* before a suspense boundary that wraps a component that uses `useSuspenseInfiniteQuery`. You can pass
* everything to `usePrefetchInfiniteQuery` that you can pass to `queryClient.infiniteQuery`, though
* `queryKey`, `initialPageParam`, and `getNextPageParam` are always required, and `queryFn` is required unless
* a default query function has been defined.
*
* `getNextPageParam` receives both the last page of the infinite list of data and the full array of all pages,
* as well as pageParam information, and should return a single variable that will be passed to your query
* function as `context.pageParam`. Return `undefined` or `null` to indicate there is no next page available.
*
* The prefetch is skipped if the query already has any cached state — including a `pending`/`error` state left
* over from a previous attempt — so calling this on every render is cheap and won't refetch data that's
* already there or already in flight.
*
* @param options - The {@link UsePrefetchInfiniteQueryOptions} to use — everything you can pass to `queryClient.infiniteQuery`.
* @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
* be used.
* @returns `void` — nothing is returned.
*
* @example
* ```tsx
* import { Suspense } from 'react'
* import { infiniteQueryOptions, usePrefetchInfiniteQuery } from '@tanstack/react-query'
*
* const projectsOptions = infiniteQueryOptions({
*   queryKey: ['projects'],
*   queryFn: ({ pageParam }) => fetchProjects(pageParam),
*   initialPageParam: 0,
*   getNextPageParam: (lastPage) => lastPage.nextId,
* })
*
* function App() {
*   // Fire the prefetch during render, before the suspense boundary below.
*   usePrefetchInfiniteQuery(projectsOptions)
*
*   return (
*     <Suspense fallback={<h1>Loading projects...</h1>}>
*       <Projects />
*     </Suspense>
*   )
* }
* ```
*/
function usePrefetchInfiniteQuery(options, queryClient) {
	const client = require_QueryClientProvider.useQueryClient(queryClient);
	if (!client.getQueryState(options.queryKey)) client.infiniteQuery(options).catch(_tanstack_query_core.noop);
}
//#endregion
exports.usePrefetchInfiniteQuery = usePrefetchInfiniteQuery;

//# sourceMappingURL=usePrefetchInfiniteQuery.cjs.map