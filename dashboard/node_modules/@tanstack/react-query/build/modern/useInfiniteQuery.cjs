"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_useBaseQuery = require("./useBaseQuery.cjs");
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/useInfiniteQuery.ts
function useInfiniteQuery(options, queryClient) {
	return require_useBaseQuery.useBaseQuery(options, _tanstack_query_core.InfiniteQueryObserver, queryClient);
}
//#endregion
exports.useInfiniteQuery = useInfiniteQuery;

//# sourceMappingURL=useInfiniteQuery.cjs.map