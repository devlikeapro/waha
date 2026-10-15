"use client";
import * as React from "react";
import { shouldThrowError } from "@tanstack/query-core";
//#region src/errorBoundaryUtils.ts
const ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
	const throwOnError = (query === null || query === void 0 ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
	if (options.suspense || throwOnError) {
		if (!errorResetBoundary.isReset()) options.retryOnMount = false;
	}
};
const useClearResetErrorBoundary = (errorResetBoundary) => {
	React.useEffect(() => {
		errorResetBoundary.clearReset();
	}, [errorResetBoundary]);
};
const getHasError = ({ result, errorResetBoundary, throwOnError, query, suspense }) => {
	return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
//#endregion
export { ensurePreventErrorBoundaryRetry, getHasError, useClearResetErrorBoundary };

//# sourceMappingURL=errorBoundaryUtils.js.map