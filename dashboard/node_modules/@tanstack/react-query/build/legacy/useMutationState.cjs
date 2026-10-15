"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
const require_QueryClientProvider = require("./QueryClientProvider.cjs");
let react = require("react");
react = require_rolldown_runtime.__toESM(react, 1);
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/useMutationState.ts
/**
* The `useIsMutating` hook returns the `number` of mutations that your application currently has `pending`
* (useful for app-wide loading indicators).
*
* @param filters - The {@link MutationFilters} to narrow down the matched mutations.
* @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
* be used.
* @returns Will be the `number` of the mutations that your application currently has `pending`.
*
* @example
* ```tsx
* import { useIsMutating } from '@tanstack/react-query'
*
* function PostsMutatingIndicator() {
*   // How many mutations matching the posts prefix are in progress?
*   const isMutatingPosts = useIsMutating({ mutationKey: ['posts'] })
*
*   return isMutatingPosts ? <span>Saving posts...</span> : null
* }
* ```
*/
function useIsMutating(filters, queryClient) {
	const client = require_QueryClientProvider.useQueryClient(queryClient);
	return useMutationState({ filters: {
		...filters,
		status: "pending"
	} }, client).length;
}
function getResult(mutationCache, options) {
	return mutationCache.findAll(options.filters).map((mutation) => options.select ? options.select(mutation) : mutation.state);
}
/**
* `useMutationState` is a hook that gives you access to all mutations in the `MutationCache`. You can pass
* `filters` ({@link MutationFilters}) to narrow down your mutations, and `select` to transform the mutation
* state.
*
* @param options - The `filters` to narrow down matched mutations, and an optional `select` to transform the
* mutation state.
* @param queryClient - Use this to use a custom `QueryClient`. Otherwise, the one from the nearest context will
* be used.
* @returns Will be an Array of whatever `select` returns for each matching mutation.
*
* @example
* Get all variables of all running mutations:
* ```tsx
* import { useMutationState } from '@tanstack/react-query'
*
* function PendingPosts() {
*   const pendingVariables = useMutationState({
*     filters: { status: 'pending' },
*     select: (mutation) => mutation.state.variables,
*   })
*
*   return <>{pendingVariables.length} posts saving...</>
* }
* ```
*
* @example
* Get all data for specific mutations via the `mutationKey`:
* ```tsx
* import { useMutation, useMutationState } from '@tanstack/react-query'
*
* const mutationKey = ['posts']
*
* function Posts() {
*   // Some mutation that we want to get the state for
*   const mutation = useMutation({
*     mutationKey,
*     mutationFn: createPosts,
*   })
*
*   const savedPosts = useMutationState({
*     // this mutation key needs to match the mutation key of the given mutation (see above)
*     filters: { mutationKey, status: 'success' },
*     select: (mutation) => mutation.state.data,
*   })
*
*   return (
*     <button onClick={() => mutation.mutate(['New Post'])}>
*       Create post ({savedPosts.length} saved so far)
*     </button>
*   )
* }
* ```
*
* @example
* Access the latest successful mutation data via the `mutationKey`. Each invocation of `mutate` adds a new
* entry to the mutation cache for `gcTime` milliseconds — with the `status: 'success'` filter below, check the
* last item that `useMutationState` returns to get the latest successful invocation:
* ```tsx
* import { useMutationState } from '@tanstack/react-query'
*
* function LatestPost() {
*   const savedPosts = useMutationState({
*     filters: { mutationKey: ['posts'], status: 'success' },
*     select: (mutation) => mutation.state.data,
*   })
*
*   const latestSavedPost = savedPosts[savedPosts.length - 1]
*
*   return <>{latestSavedPost ? 'Saved' : 'Nothing saved yet'}</>
* }
* ```
*/
function useMutationState(options = {}, queryClient) {
	const mutationCache = require_QueryClientProvider.useQueryClient(queryClient).getMutationCache();
	const optionsRef = react.useRef(options);
	const result = react.useRef(null);
	if (result.current === null) result.current = getResult(mutationCache, options);
	react.useEffect(() => {
		optionsRef.current = options;
	});
	return react.useSyncExternalStore(react.useCallback((onStoreChange) => mutationCache.subscribe(() => {
		const nextResult = (0, _tanstack_query_core.replaceEqualDeep)(result.current, getResult(mutationCache, optionsRef.current));
		if (result.current !== nextResult) {
			result.current = nextResult;
			_tanstack_query_core.notifyManager.schedule(onStoreChange);
		}
	}), [mutationCache]), () => result.current, () => result.current);
}
//#endregion
exports.useIsMutating = useIsMutating;
exports.useMutationState = useMutationState;

//# sourceMappingURL=useMutationState.cjs.map