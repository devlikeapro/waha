"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_suspense = require("./suspense.cjs");
const require_useQueries = require("./useQueries.cjs");
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/useSuspenseQueries.ts
function useSuspenseQueries(options, queryClient) {
	return require_useQueries.useQueries({
		...options,
		queries: options.queries.map((query) => {
			if (process.env.NODE_ENV !== "production") {
				if (query.queryFn === _tanstack_query_core.skipToken) console.error("skipToken is not allowed for useSuspenseQueries");
			}
			return {
				...query,
				suspense: true,
				throwOnError: require_suspense.defaultThrowOnError,
				enabled: true,
				placeholderData: void 0
			};
		})
	}, queryClient);
}
//#endregion
exports.useSuspenseQueries = useSuspenseQueries;

//# sourceMappingURL=useSuspenseQueries.cjs.map