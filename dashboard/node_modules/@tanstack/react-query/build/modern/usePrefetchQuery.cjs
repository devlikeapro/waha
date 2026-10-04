Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_QueryClientProvider = require("./QueryClientProvider.cjs");
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/usePrefetchQuery.tsx
/**
* `usePrefetchQuery` does not return anything, it should be used just to fire a prefetch during render, before
* a suspense boundary that wraps a component that uses `useSuspenseQuery`. You can pass everything to
* `usePrefetchQuery` that you can pass to `queryClient.query`, though `queryKey` is always required, and
* `queryFn` is required unless a default query function has been defined.
*
* The prefetch is skipped if the query already has any cached state — including a `pending`/`error` state left
* over from a previous attempt — so calling this on every render is cheap and won't refetch data that's
* already there or already in flight.
*
* @param options - The {@link UsePrefetchQueryOptions} to use — everything you can pass to `queryClient.query`.
* @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
* be used.
* @returns `void` — nothing is returned.
*
* @example
* ```tsx
* import { Suspense } from 'react'
* import { usePrefetchQuery } from '@tanstack/react-query'
*
* function App() {
*   // Fire the prefetch during render, before the suspense boundary below.
*   usePrefetchQuery({
*     queryKey: ['posts'],
*     queryFn: fetchPosts,
*   })
*
*   return (
*     <Suspense fallback={<h1>Loading posts...</h1>}>
*       <Posts />
*     </Suspense>
*   )
* }
* ```
*/
function usePrefetchQuery(options, queryClient) {
	const client = require_QueryClientProvider.useQueryClient(queryClient);
	if (!client.getQueryState(options.queryKey)) client.query(options).catch(_tanstack_query_core.noop);
}
//#endregion
exports.usePrefetchQuery = usePrefetchQuery;

//# sourceMappingURL=usePrefetchQuery.cjs.map