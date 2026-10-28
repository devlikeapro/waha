"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
const require_QueryClientProvider = require("./QueryClientProvider.cjs");
let react = require("react");
react = require_rolldown_runtime.__toESM(react, 1);
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/useIsFetching.ts
/**
* The `useIsFetching` hook returns the `number` of the queries that your application is loading or fetching in
* the background (useful for app-wide loading indicators).
*
* @param filters - The {@link QueryFilters} to narrow down the matched queries.
* @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
* be used.
* @returns Will be the `number` of the queries that your application is currently loading or fetching in the
* background.
*
* @example
* ```tsx
* import { useIsFetching } from '@tanstack/react-query'
*
* function PostsFetchingIndicator() {
*   // How many queries matching the posts prefix are fetching?
*   const isFetchingPosts = useIsFetching({ queryKey: ['posts'] })
*
*   return isFetchingPosts ? <span>Refreshing posts...</span> : null
* }
* ```
*
* @example
* A global loading indicator for any query fetching in the background, not just the ones on screen:
* ```tsx
* import { useIsFetching } from '@tanstack/react-query'
*
* function GlobalLoadingIndicator() {
*   const isFetching = useIsFetching()
*
*   return isFetching ? (
*     <div>Queries are fetching in the background...</div>
*   ) : null
* }
* ```
*/
function useIsFetching(filters, queryClient) {
	const client = require_QueryClientProvider.useQueryClient(queryClient);
	const queryCache = client.getQueryCache();
	return react.useSyncExternalStore(react.useCallback((onStoreChange) => queryCache.subscribe(_tanstack_query_core.notifyManager.batchCalls(onStoreChange)), [queryCache]), () => client.isFetching(filters), () => client.isFetching(filters));
}
//#endregion
exports.useIsFetching = useIsFetching;

//# sourceMappingURL=useIsFetching.cjs.map