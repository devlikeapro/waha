import { QueryErrorResetBoundaryValue } from "./QueryErrorResetBoundary.js";
import { DefaultedQueryObserverOptions, Query, QueryKey, QueryObserverResult, ThrowOnError } from "@tanstack/query-core";
//#region src/errorBoundaryUtils.d.ts
declare const ensurePreventErrorBoundaryRetry: <TQueryFnData, TError, TData, TQueryData, TQueryKey extends QueryKey>(options: DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>, errorResetBoundary: QueryErrorResetBoundaryValue, query: Query<TQueryFnData, TError, TQueryData, TQueryKey> | undefined) => void;
declare const useClearResetErrorBoundary: (errorResetBoundary: QueryErrorResetBoundaryValue) => void;
declare const getHasError: <TData, TError, TQueryFnData, TQueryData, TQueryKey extends QueryKey>({ result, errorResetBoundary, throwOnError, query, suspense }: {
  result: QueryObserverResult<TData, TError>;
  errorResetBoundary: QueryErrorResetBoundaryValue;
  throwOnError: ThrowOnError<TQueryFnData, TError, TQueryData, TQueryKey>;
  query: Query<TQueryFnData, TError, TQueryData, TQueryKey> | undefined;
  suspense: boolean | undefined;
}) => boolean | undefined;
//#endregion
export { ensurePreventErrorBoundaryRetry, getHasError, useClearResetErrorBoundary };
//# sourceMappingURL=errorBoundaryUtils.d.ts.map