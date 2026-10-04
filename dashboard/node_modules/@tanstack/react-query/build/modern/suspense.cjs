Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/suspense.ts
const defaultThrowOnError = (_error, query) => query.state.data === void 0;
const ensureSuspenseTimers = (defaultedOptions) => {
	if (defaultedOptions.suspense) {
		const MIN_SUSPENSE_TIME_MS = 1e3;
		const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
		const originalStaleTime = defaultedOptions.staleTime;
		defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
		if (typeof defaultedOptions.gcTime === "number") defaultedOptions.gcTime = Math.max(defaultedOptions.gcTime, MIN_SUSPENSE_TIME_MS);
	}
};
const shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
const fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
	errorResetBoundary.clearReset();
});
//#endregion
exports.defaultThrowOnError = defaultThrowOnError;
exports.ensureSuspenseTimers = ensureSuspenseTimers;
exports.fetchOptimistic = fetchOptimistic;
exports.shouldSuspend = shouldSuspend;

//# sourceMappingURL=suspense.cjs.map