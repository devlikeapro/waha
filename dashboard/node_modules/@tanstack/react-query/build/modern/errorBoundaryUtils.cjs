"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
let react = require("react");
react = require_rolldown_runtime.__toESM(react, 1);
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/errorBoundaryUtils.ts
const ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
	const throwOnError = query?.state.error && typeof options.throwOnError === "function" ? (0, _tanstack_query_core.shouldThrowError)(options.throwOnError, [query.state.error, query]) : options.throwOnError;
	if (options.suspense || throwOnError) {
		if (!errorResetBoundary.isReset()) options.retryOnMount = false;
	}
};
const useClearResetErrorBoundary = (errorResetBoundary) => {
	react.useEffect(() => {
		errorResetBoundary.clearReset();
	}, [errorResetBoundary]);
};
const getHasError = ({ result, errorResetBoundary, throwOnError, query, suspense }) => {
	return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || (0, _tanstack_query_core.shouldThrowError)(throwOnError, [result.error, query]));
};
//#endregion
exports.ensurePreventErrorBoundaryRetry = ensurePreventErrorBoundaryRetry;
exports.getHasError = getHasError;
exports.useClearResetErrorBoundary = useClearResetErrorBoundary;

//# sourceMappingURL=errorBoundaryUtils.cjs.map