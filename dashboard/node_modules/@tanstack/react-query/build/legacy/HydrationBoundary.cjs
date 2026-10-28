"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
const require_QueryClientProvider = require("./QueryClientProvider.cjs");
let react = require("react");
react = require_rolldown_runtime.__toESM(react, 1);
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/HydrationBoundary.tsx
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
const HydrationBoundary = ({ children, options = {}, state, queryClient }) => {
	const client = require_QueryClientProvider.useQueryClient(queryClient);
	const optionsRef = react.useRef(options);
	react.useEffect(() => {
		optionsRef.current = options;
	});
	const hydrationQueue = react.useMemo(() => {
		if (state) {
			if (typeof state !== "object") return;
			const queryCache = client.getQueryCache();
			const queries = state.queries || [];
			const newQueries = [];
			const existingQueries = [];
			for (const dehydratedQuery of queries) {
				const existingQuery = queryCache.get(dehydratedQuery.queryHash);
				if (!existingQuery) newQueries.push(dehydratedQuery);
				else if (dehydratedQuery.state.dataUpdatedAt > existingQuery.state.dataUpdatedAt || dehydratedQuery.promise && existingQuery.state.status !== "pending" && existingQuery.state.fetchStatus !== "fetching" && dehydratedQuery.dehydratedAt > existingQuery.state.dataUpdatedAt) existingQueries.push(dehydratedQuery);
			}
			if (newQueries.length > 0) (0, _tanstack_query_core.hydrate)(client, { queries: newQueries }, optionsRef.current);
			if (existingQueries.length > 0) return existingQueries;
		}
	}, [client, state]);
	react.useEffect(() => {
		if (hydrationQueue) (0, _tanstack_query_core.hydrate)(client, { queries: hydrationQueue }, optionsRef.current);
	}, [client, hydrationQueue]);
	return children;
};
//#endregion
exports.HydrationBoundary = HydrationBoundary;

//# sourceMappingURL=HydrationBoundary.cjs.map