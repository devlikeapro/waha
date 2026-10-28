"use client";
import { useQueryClient } from "./QueryClientProvider.js";
import { useIsRestoring } from "./IsRestoringProvider.js";
import { useQueryErrorResetBoundary } from "./QueryErrorResetBoundary.js";
import { ensurePreventErrorBoundaryRetry, getHasError, useClearResetErrorBoundary } from "./errorBoundaryUtils.js";
import { ensureSuspenseTimers, fetchOptimistic, shouldSuspend } from "./suspense.js";
import * as React from "react";
import { QueriesObserver, QueryObserver, noop, notifyManager } from "@tanstack/query-core";
//#region src/useQueries.ts
/**
* The `useQueries` hook can be used to fetch a variable number of queries.
*
* The `queries` key accepts an array with query option objects mostly identical to `useQuery` — the top-level
* `subscribed` option isn't accepted per query (see `placeholderData` below for another difference). A custom
* `QueryClient` is supplied once, as `useQueries`' own top-level second argument, rather than per query.
*
* Having the same query key more than once in the array of query objects may cause some data to be shared
* between queries. To avoid this, consider de-duplicating the queries and map the results back to the desired
* structure.
*
* The `combine` option can be used to combine the results of the queries into a single value. The result will
* be structurally shared to be as referentially stable as possible.
*
* @remarks The `combine` function only re-runs if it changed referentially, or if any of the query results
* changed. An inlined `combine` function, as shown in the example below, therefore runs on every render — wrap
* it in `useCallback`, or extract it to a stable function reference if it doesn't have any dependencies, to
* avoid that.
*
* Unlike `useQuery`, `useQueries` cannot infer the `data` argument of an _inline_ `select` from its sibling
* `queryFn`. Because `useQueries` infers the type of the whole `queries` array at once, the `select` parameter
* of a query object written inline cannot be contextually typed from that same object's `queryFn`, so it falls
* back to `unknown` — a [known TypeScript limitation](https://github.com/TanStack/query/issues/6556). Annotate
* the `select` parameter explicitly, or define the query with {@link queryOptions}, which resolves its types in
* a single object _before_ it reaches `useQueries`, to work around this — see the example below. The same
* limitation applies to {@link useSuspenseQueries}.
*
* `placeholderData` is supported here too, but unlike `useQuery`, it doesn't receive information from
* previously rendered queries, because the number of queries can differ between renders.
* @param queryClient - Use this to provide a custom `QueryClient`. Otherwise, the one from the nearest context
* will be used.
* @returns The combined result. Without `combine`, this is an array with all the query results, in the same
* order as the input. When `combine` is provided, this is the value returned by `combine` instead.
*
* @example
* ```tsx
* import { useQueries } from '@tanstack/react-query'
*
* function Posts({ ids }: { ids: Array<number> }) {
*   const postQueries = useQueries({
*     queries: ids.map((id) => ({
*       queryKey: ['post', id],
*       queryFn: () => fetchPost(id),
*       staleTime: Infinity,
*     })),
*   })
*
*   return (
*     <ul>
*       {postQueries.map((query, index) => {
*         if (query.isPending) return <li key={ids[index]}>Loading...</li>
*         if (query.isError) return <li key={ids[index]}>Error: {query.error.message}</li>
*         return <li key={ids[index]}>{query.data.title}</li>
*       })}
*     </ul>
*   )
* }
* ```
*
* @example
* Combining results into a single value:
* ```tsx
* import { useQueries } from '@tanstack/react-query'
*
* function Posts({ ids }: { ids: Array<number> }) {
*   const { data, isPending, isError } = useQueries({
*     queries: ids.map((id) => ({
*       queryKey: ['post', id],
*       queryFn: () => fetchPost(id),
*     })),
*     combine: (postQueries) => {
*       return {
*         data: postQueries.map((query) => query.data),
*         isPending: postQueries.some((query) => query.isPending),
*         isError: postQueries.some((query) => query.isError),
*       }
*     },
*   })
*
*   if (isPending) return 'Loading...'
*   if (isError) return 'Error loading posts'
*
*   return (
*     <ul>
*       {data.map((post) => (
*         <li key={post?.id}>{post?.title}</li>
*       ))}
*     </ul>
*   )
* }
* ```
*
* @example
* Typing `select` via {@link queryOptions}. Note that spreading a `queryOptions` result and overriding
* `select` inline still falls back to `unknown` — wrap the spread in `queryOptions` again so the override is
* resolved before it reaches `useQueries`:
* ```tsx
* import { queryOptions, useQueries } from '@tanstack/react-query'
*
* const postOptions = (id: number) =>
*   queryOptions({
*     queryKey: ['post', id],
*     queryFn: () => fetchPost(id),
*   })
*
* function PostTitle({ id }: { id: number }) {
*   const [{ data: broken }] = useQueries({
*     queries: [
*       {
*         ...postOptions(id),
*         // ❌ `data` is `unknown` here
*         select: (data) => data.title,
*       },
*     ],
*   })
*
*   const [{ data: fixed }] = useQueries({
*     queries: [
*       queryOptions({
*         ...postOptions(id),
*         // ✅ `data` is `Post`
*         select: (data) => data.title,
*       }),
*     ],
*   })
*
*   return <h1>{fixed}</h1>
* }
* ```
*/
function useQueries({ queries, ...options }, queryClient) {
	const client = useQueryClient(queryClient);
	const isRestoring = useIsRestoring();
	const errorResetBoundary = useQueryErrorResetBoundary();
	const subscribed = options.subscribed !== false;
	const defaultedQueries = React.useMemo(() => queries.map((opts) => {
		const defaultedOptions = client.defaultQueryOptions(opts);
		defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : subscribed ? "optimistic" : void 0;
		return defaultedOptions;
	}), [
		queries,
		client,
		isRestoring,
		subscribed
	]);
	defaultedQueries.forEach((queryOptions) => {
		ensureSuspenseTimers(queryOptions);
		const query = client.getQueryCache().get(queryOptions.queryHash);
		ensurePreventErrorBoundaryRetry(queryOptions, errorResetBoundary, query);
	});
	useClearResetErrorBoundary(errorResetBoundary);
	const [observer] = React.useState(() => new QueriesObserver(client, defaultedQueries, options));
	const [optimisticResult, getCombinedResult, trackResult] = observer.getOptimisticResult(defaultedQueries, options.combine);
	const shouldSubscribe = !isRestoring && subscribed;
	React.useSyncExternalStore(React.useCallback((onStoreChange) => shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	React.useEffect(() => {
		observer.setQueries(defaultedQueries, options);
	}, [
		defaultedQueries,
		options,
		observer
	]);
	const suspensePromises = optimisticResult.some((result, index) => shouldSuspend(defaultedQueries[index], result)) ? optimisticResult.flatMap((result, index) => {
		const opts = defaultedQueries[index];
		if (opts && shouldSuspend(opts, result)) {
			const queryObserver = new QueryObserver(client, opts);
			return fetchOptimistic(opts, queryObserver, errorResetBoundary);
		}
		return [];
	}) : [];
	if (suspensePromises.length > 0) throw Promise.all(suspensePromises);
	const firstSingleResultWhichShouldThrow = optimisticResult.find((result, index) => {
		const query = defaultedQueries[index];
		return query && getHasError({
			result,
			errorResetBoundary,
			throwOnError: query.throwOnError,
			query: client.getQueryCache().get(query.queryHash),
			suspense: query.suspense
		});
	});
	if (firstSingleResultWhichShouldThrow) throw firstSingleResultWhichShouldThrow.error;
	return getCombinedResult(trackResult());
}
//#endregion
export { useQueries };

//# sourceMappingURL=useQueries.js.map