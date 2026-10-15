"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_useBaseQuery = require("./useBaseQuery.cjs");
let _tanstack_query_core = require("@tanstack/query-core");
//#region src/useQuery.ts
function useQuery(options, queryClient) {
	return require_useBaseQuery.useBaseQuery(options, _tanstack_query_core.QueryObserver, queryClient);
}
//#endregion
exports.useQuery = useQuery;

//# sourceMappingURL=useQuery.cjs.map