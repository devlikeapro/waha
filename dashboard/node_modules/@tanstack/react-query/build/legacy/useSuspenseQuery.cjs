"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_suspense = require("./suspense.cjs");
const require_useBaseQuery = require("./useBaseQuery.cjs");
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/useSuspenseQuery.ts
/**
* The options for `useSuspenseQuery` are the same as for `useQuery`, except for `throwOnError`, `enabled`, and
* `placeholderData` — and `queryFn` may not be `skipToken`, since Suspense hooks can't render a "disabled" state.
*
* Caveat: cancellation does not work.
*
* @remarks Multiple `useSuspenseQuery` calls in the same component suspend serially, causing a request
* waterfall — each one blocks rendering until it resolves, so the next doesn't even start fetching until then.
* Use {@link useSuspenseQueries} instead when you have more than one suspenseful query in a component, so they
* fetch in parallel.
* @param options - The {@link UseSuspenseQueryOptions} to use — the same options as `useQuery`, minus the ones listed above.
* @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
* be used.
* @returns The same object as `useQuery`, except that `data` is guaranteed to be defined, `isPlaceholderData`
* is missing, and `status` is either `success` or `error` (with the derived flags set accordingly).
*
* @example
* The query error is thrown if the fetch fails and no cached data exists yet, so an error boundary is
* required around `<Suspense>`. A failed background refetch instead continues to render the cached data.
* Use {@link QueryErrorResetBoundary} to let the user retry after such an error:
* ```tsx
* import { Suspense } from 'react'
* import { ErrorBoundary } from 'react-error-boundary'
* import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
*
* function Posts() {
*   // `data` is guaranteed to be defined here — no `isPending` check needed.
*   const { data, isFetching } = useSuspenseQuery({
*     queryKey: ['posts'],
*     queryFn: fetchPosts,
*   })
*
*   return (
*     <div>
*       <h1>Posts {isFetching ? '(refreshing...)' : null}</h1>
*       <ul>
*         {data.map((post) => (
*           <li key={post.id}>{post.title}</li>
*         ))}
*       </ul>
*     </div>
*   )
* }
*
* function App() {
*   return (
*     <QueryErrorResetBoundary>
*       {({ reset }) => (
*         <ErrorBoundary
*           onReset={reset}
*           fallbackRender={({ resetErrorBoundary }) => (
*             <div>
*               There was an error!
*               <button onClick={() => resetErrorBoundary()}>Try again</button>
*             </div>
*           )}
*         >
*           <Suspense fallback={<h1>Loading posts...</h1>}>
*             <Posts />
*           </Suspense>
*         </ErrorBoundary>
*       )}
*     </QueryErrorResetBoundary>
*   )
* }
* ```
*/
function useSuspenseQuery(options, queryClient) {
	if (process.env.NODE_ENV !== "production") {
		if (options.queryFn === _tanstack_query_core.skipToken) console.error("skipToken is not allowed for useSuspenseQuery");
	}
	return require_useBaseQuery.useBaseQuery({
		...options,
		enabled: true,
		suspense: true,
		throwOnError: require_suspense.defaultThrowOnError,
		placeholderData: void 0
	}, _tanstack_query_core.QueryObserver, queryClient);
}
//#endregion
exports.useSuspenseQuery = useSuspenseQuery;

//# sourceMappingURL=useSuspenseQuery.cjs.map