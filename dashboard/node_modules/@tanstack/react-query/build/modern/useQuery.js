"use client";
import { useBaseQuery } from "./useBaseQuery.js";
import { QueryObserver } from "@tanstack/query-core";
//#region src/useQuery.ts
function useQuery(options, queryClient) {
	return useBaseQuery(options, QueryObserver, queryClient);
}
//#endregion
export { useQuery };

//# sourceMappingURL=useQuery.js.map