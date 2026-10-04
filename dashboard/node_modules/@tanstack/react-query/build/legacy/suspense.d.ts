import { QueryErrorResetBoundaryValue } from "./QueryErrorResetBoundary.js";
import { DefaultError, DefaultedQueryObserverOptions, Query, QueryKey, QueryObserver, QueryObserverResult } from "@tanstack/query-core";
//#region src/suspense.d.ts
declare const defaultThrowOnError: <TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(_error: TError, query: Query<TQueryFnData, TError, TData, TQueryKey>) => boolean;
declare const ensureSuspenseTimers: (defaultedOptions: DefaultedQueryObserverOptions<any, any, any, any, any>) => void;
declare const shouldSuspend: (defaultedOptions: DefaultedQueryObserverOptions<any, any, any, any, any> | undefined, result: QueryObserverResult<any, any>) => boolean | undefined;
declare const fetchOptimistic: <TQueryFnData, TError, TData, TQueryData, TQueryKey extends QueryKey>(defaultedOptions: DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>, observer: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>, errorResetBoundary: QueryErrorResetBoundaryValue) => Promise<void | QueryObserverResult<TData, TError>>;
//#endregion
export { defaultThrowOnError, ensureSuspenseTimers, fetchOptimistic, shouldSuspend };
//# sourceMappingURL=suspense.d.ts.map