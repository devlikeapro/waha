import { UseBaseQueryOptions } from "./types.cjs";
import { QueryClient, QueryKey, QueryObserver, QueryObserverResult } from "@tanstack/query-core";
//#region src/useBaseQuery.d.ts
declare function useBaseQuery<TQueryFnData, TError, TData, TQueryData, TQueryKey extends QueryKey>(options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>, Observer: typeof QueryObserver, queryClient?: QueryClient): QueryObserverResult<TData, TError>;
//#endregion
export { useBaseQuery };
//# sourceMappingURL=useBaseQuery.d.cts.map