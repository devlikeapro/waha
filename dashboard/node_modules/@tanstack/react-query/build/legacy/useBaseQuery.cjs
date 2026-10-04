"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
const require_QueryClientProvider = require("./QueryClientProvider.cjs");
const require_IsRestoringProvider = require("./IsRestoringProvider.cjs");
const require_QueryErrorResetBoundary = require("./QueryErrorResetBoundary.cjs");
const require_errorBoundaryUtils = require("./errorBoundaryUtils.cjs");
const require_suspense = require("./suspense.cjs");
let react = require("react");
react = require_rolldown_runtime.__toESM(react, 1);
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/useBaseQuery.ts
function useBaseQuery(options, Observer, queryClient) {
	if (process.env.NODE_ENV !== "production") {
		if (typeof options !== "object" || Array.isArray(options)) throw new Error("Bad argument type. Starting with v5, only the \"Object\" form is allowed when calling query related functions. Please use the error stack to find the culprit call. More info here: https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#supports-a-single-signature-one-object");
	}
	const isRestoring = require_IsRestoringProvider.useIsRestoring();
	const errorResetBoundary = require_QueryErrorResetBoundary.useQueryErrorResetBoundary();
	const client = require_QueryClientProvider.useQueryClient(queryClient);
	const defaultedOptions = client.defaultQueryOptions(options);
	const query = client.getQueryCache().get(defaultedOptions.queryHash);
	if (process.env.NODE_ENV !== "production") {
		if (!defaultedOptions.queryFn) console.error(`[${defaultedOptions.queryHash}]: No queryFn was passed as an option, and no default queryFn was found. The queryFn parameter is only optional when using a default queryFn. More info here: https://tanstack.com/query/latest/docs/framework/react/guides/default-query-function`);
	}
	const subscribed = options.subscribed !== false;
	defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : subscribed ? "optimistic" : void 0;
	require_suspense.ensureSuspenseTimers(defaultedOptions);
	require_errorBoundaryUtils.ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
	require_errorBoundaryUtils.useClearResetErrorBoundary(errorResetBoundary);
	const [observer] = react.useState(() => new Observer(client, defaultedOptions));
	const result = observer.getOptimisticResult(defaultedOptions);
	const shouldSubscribe = !isRestoring && subscribed;
	react.useSyncExternalStore(react.useCallback((onStoreChange) => {
		const unsubscribe = shouldSubscribe ? observer.subscribe(_tanstack_query_core.notifyManager.batchCalls(onStoreChange)) : _tanstack_query_core.noop;
		observer.updateResult();
		return unsubscribe;
	}, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	react.useEffect(() => {
		observer.setOptions(defaultedOptions);
	}, [defaultedOptions, observer]);
	if (require_suspense.shouldSuspend(defaultedOptions, result)) throw require_suspense.fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
	if (require_errorBoundaryUtils.getHasError({
		result,
		errorResetBoundary,
		throwOnError: defaultedOptions.throwOnError,
		query,
		suspense: defaultedOptions.suspense
	})) throw result.error;
	return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
//#endregion
exports.useBaseQuery = useBaseQuery;

//# sourceMappingURL=useBaseQuery.cjs.map