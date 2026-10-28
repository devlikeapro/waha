Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_QueryClientProvider = require("./QueryClientProvider.cjs");
const require_HydrationBoundary = require("./HydrationBoundary.cjs");
const require_IsRestoringProvider = require("./IsRestoringProvider.cjs");
const require_QueryErrorResetBoundary = require("./QueryErrorResetBoundary.cjs");
const require_useQueries = require("./useQueries.cjs");
const require_useQuery = require("./useQuery.cjs");
const require_useSuspenseQuery = require("./useSuspenseQuery.cjs");
const require_useSuspenseInfiniteQuery = require("./useSuspenseInfiniteQuery.cjs");
const require_useSuspenseQueries = require("./useSuspenseQueries.cjs");
const require_usePrefetchQuery = require("./usePrefetchQuery.cjs");
const require_usePrefetchInfiniteQuery = require("./usePrefetchInfiniteQuery.cjs");
const require_queryOptions = require("./queryOptions.cjs");
const require_infiniteQueryOptions = require("./infiniteQueryOptions.cjs");
const require_useIsFetching = require("./useIsFetching.cjs");
const require_useMutationState = require("./useMutationState.cjs");
const require_useMutation = require("./useMutation.cjs");
const require_mutationOptions = require("./mutationOptions.cjs");
const require_useInfiniteQuery = require("./useInfiniteQuery.cjs");
//#region src/index.ts
/* istanbul ignore file */
//#endregion
exports.HydrationBoundary = require_HydrationBoundary.HydrationBoundary;
exports.IsRestoringProvider = require_IsRestoringProvider.IsRestoringProvider;
exports.QueryClientContext = require_QueryClientProvider.QueryClientContext;
exports.QueryClientProvider = require_QueryClientProvider.QueryClientProvider;
exports.QueryErrorResetBoundary = require_QueryErrorResetBoundary.QueryErrorResetBoundary;
exports.infiniteQueryOptions = require_infiniteQueryOptions.infiniteQueryOptions;
exports.mutationOptions = require_mutationOptions.mutationOptions;
exports.queryOptions = require_queryOptions.queryOptions;
exports.useInfiniteQuery = require_useInfiniteQuery.useInfiniteQuery;
exports.useIsFetching = require_useIsFetching.useIsFetching;
exports.useIsMutating = require_useMutationState.useIsMutating;
exports.useIsRestoring = require_IsRestoringProvider.useIsRestoring;
exports.useMutation = require_useMutation.useMutation;
exports.useMutationState = require_useMutationState.useMutationState;
exports.usePrefetchInfiniteQuery = require_usePrefetchInfiniteQuery.usePrefetchInfiniteQuery;
exports.usePrefetchQuery = require_usePrefetchQuery.usePrefetchQuery;
exports.useQueries = require_useQueries.useQueries;
exports.useQuery = require_useQuery.useQuery;
exports.useQueryClient = require_QueryClientProvider.useQueryClient;
exports.useQueryErrorResetBoundary = require_QueryErrorResetBoundary.useQueryErrorResetBoundary;
exports.useSuspenseInfiniteQuery = require_useSuspenseInfiniteQuery.useSuspenseInfiniteQuery;
exports.useSuspenseQueries = require_useSuspenseQueries.useSuspenseQueries;
exports.useSuspenseQuery = require_useSuspenseQuery.useSuspenseQuery;
var _tanstack_query_core = require("@tanstack/query-core");
Object.keys(_tanstack_query_core).forEach(function(k) {
	if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function() {
			return _tanstack_query_core[k];
		}
	});
});

//# sourceMappingURL=index.cjs.map