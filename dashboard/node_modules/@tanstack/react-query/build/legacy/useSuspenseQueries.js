"use client";
import { defaultThrowOnError } from "./suspense.js";
import { useQueries } from "./useQueries.js";
import { skipToken } from "@tanstack/query-core";
//#region src/useSuspenseQueries.ts
function useSuspenseQueries(options, queryClient) {
	return useQueries({
		...options,
		queries: options.queries.map((query) => {
			if (process.env.NODE_ENV !== "production") {
				if (query.queryFn === skipToken) console.error("skipToken is not allowed for useSuspenseQueries");
			}
			return {
				...query,
				suspense: true,
				throwOnError: defaultThrowOnError,
				enabled: true,
				placeholderData: void 0
			};
		})
	}, queryClient);
}
//#endregion
export { useSuspenseQueries };

//# sourceMappingURL=useSuspenseQueries.js.map