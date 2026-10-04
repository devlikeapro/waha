import { A as InfiniteData, V as InfiniteQueryPageParamsOptions, er as QueryBehavior } from "./hydration-Cq7QYAzB.js";
//#region src/infiniteQueryBehavior.d.ts
declare function infiniteQueryBehavior<TQueryFnData, TError, TData, TPageParam>(pages?: number): QueryBehavior<TQueryFnData, TError, InfiniteData<TData, TPageParam>>;
/**
 * Checks if there is a next page.
 */
declare function hasNextPage(options: InfiniteQueryPageParamsOptions<any, any>, data?: InfiniteData<unknown>): boolean;
/**
 * Checks if there is a previous page.
 */
declare function hasPreviousPage(options: InfiniteQueryPageParamsOptions<any, any>, data?: InfiniteData<unknown>): boolean;
//#endregion
export { hasNextPage, hasPreviousPage, infiniteQueryBehavior };
//# sourceMappingURL=infiniteQueryBehavior.d.ts.map