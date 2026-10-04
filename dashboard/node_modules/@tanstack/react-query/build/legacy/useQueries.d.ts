import { DefinedUseQueryResult, UseQueryOptions, UseQueryResult } from "./types.js";
import { DefaultError, OmitKeyof, QueriesPlaceholderDataFunction, QueryClient, QueryFunction, QueryKey, ThrowOnError } from "@tanstack/query-core";
//#region src/useQueries.d.ts
type UseQueryOptionsForUseQueries<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = OmitKeyof<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'placeholderData' | 'subscribed'> & {
  placeholderData?: TQueryFnData | QueriesPlaceholderDataFunction<TQueryFnData>;
};
type MAXIMUM_DEPTH = 20;
type SkipTokenForUseQueries = symbol;
type GetUseQueryOptionsForUseQueries<T> = T extends {
  queryFnData: infer TQueryFnData;
  error?: infer TError;
  data: infer TData;
} ? UseQueryOptionsForUseQueries<TQueryFnData, TError, TData> : T extends {
  queryFnData: infer TQueryFnData;
  error?: infer TError;
} ? UseQueryOptionsForUseQueries<TQueryFnData, TError> : T extends {
  data: infer TData;
  error?: infer TError;
} ? UseQueryOptionsForUseQueries<unknown, TError, TData> : T extends [infer TQueryFnData, infer TError, infer TData] ? UseQueryOptionsForUseQueries<TQueryFnData, TError, TData> : T extends [infer TQueryFnData, infer TError] ? UseQueryOptionsForUseQueries<TQueryFnData, TError> : T extends [infer TQueryFnData] ? UseQueryOptionsForUseQueries<TQueryFnData> : T extends {
  queryFn?: QueryFunction<infer TQueryFnData, infer TQueryKey> | SkipTokenForUseQueries;
  select?: (data: any) => infer TData;
  throwOnError?: ThrowOnError<any, infer TError, any, any>;
} ? UseQueryOptionsForUseQueries<TQueryFnData, unknown extends TError ? DefaultError : TError, unknown extends TData ? TQueryFnData : TData, TQueryKey> : UseQueryOptionsForUseQueries;
type GetDefinedOrUndefinedQueryResult<T, TData, TError = unknown> = T extends {
  initialData?: infer TInitialData;
} ? unknown extends TInitialData ? UseQueryResult<TData, TError> : TInitialData extends TData ? DefinedUseQueryResult<TData, TError> : TInitialData extends (() => infer TInitialDataResult) ? unknown extends TInitialDataResult ? UseQueryResult<TData, TError> : TInitialDataResult extends TData ? DefinedUseQueryResult<TData, TError> : UseQueryResult<TData, TError> : UseQueryResult<TData, TError> : UseQueryResult<TData, TError>;
type GetUseQueryResult<T> = T extends {
  queryFnData: any;
  error?: infer TError;
  data: infer TData;
} ? GetDefinedOrUndefinedQueryResult<T, TData, TError> : T extends {
  queryFnData: infer TQueryFnData;
  error?: infer TError;
} ? GetDefinedOrUndefinedQueryResult<T, TQueryFnData, TError> : T extends {
  data: infer TData;
  error?: infer TError;
} ? GetDefinedOrUndefinedQueryResult<T, TData, TError> : T extends [any, infer TError, infer TData] ? GetDefinedOrUndefinedQueryResult<T, TData, TError> : T extends [infer TQueryFnData, infer TError] ? GetDefinedOrUndefinedQueryResult<T, TQueryFnData, TError> : T extends [infer TQueryFnData] ? GetDefinedOrUndefinedQueryResult<T, TQueryFnData> : T extends {
  queryFn?: QueryFunction<infer TQueryFnData, any> | SkipTokenForUseQueries;
  select?: (data: any) => infer TData;
  throwOnError?: ThrowOnError<any, infer TError, any, any>;
} ? GetDefinedOrUndefinedQueryResult<T, unknown extends TData ? TQueryFnData : TData, unknown extends TError ? DefaultError : TError> : UseQueryResult;
/**
 * The `queries` array accepted by `useQueries`. Recursively unwraps each tuple element so every entry's
 * `queryFn`/`select`/`throwOnError` are inferred individually, up to 20 elements. An opaque array (e.g.
 * `unknown[]`) is returned as-is; a non-tuple array of a known element type, or a tuple past 20 elements, falls
 * back to a single homogeneous options type.
 *
 * @template T - The type of the `queries` array as written at the call site.
 * @template TResults - The internal accumulator that this type builds during recursion. It is not meant
 * to be set explicitly.
 * @template TDepth - The internal recursion-depth counter, checked against the 20-element limit. It is not
 * meant to be set explicitly.
 */
type QueriesOptions<T extends Array<any>, TResults extends Array<any> = [], TDepth extends ReadonlyArray<number> = []> = TDepth['length'] extends MAXIMUM_DEPTH ? Array<UseQueryOptionsForUseQueries> : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseQueryOptionsForUseQueries<Head>] : T extends [infer Head, ...infer Tails] ? QueriesOptions<[...Tails], [...TResults, GetUseQueryOptionsForUseQueries<Head>], [...TDepth, 1]> : ReadonlyArray<unknown> extends T ? T : T extends Array<UseQueryOptionsForUseQueries<infer TQueryFnData, infer TError, infer TData, infer TQueryKey>> ? Array<UseQueryOptionsForUseQueries<TQueryFnData, TError, TData, TQueryKey>> : Array<UseQueryOptionsForUseQueries>;
/**
 * The result type returned by `useQueries`, when no `combine` is provided. Mirrors {@link QueriesOptions}: each
 * tuple element's result type is inferred individually, up to 20 elements. A non-tuple array is mapped
 * per-element instead, still inferring each entry individually; only past 20 elements does this fall back to a
 * single homogeneous {@link UseQueryResult} type.
 *
 * @template T - The type of the `queries` array, as inferred by {@link QueriesOptions}.
 * @template TResults - The internal accumulator that this type builds during recursion. It is not meant
 * to be set explicitly.
 * @template TDepth - The internal recursion-depth counter, checked against the 20-element limit. It is not
 * meant to be set explicitly.
 */
type QueriesResults<T extends Array<any>, TResults extends Array<any> = [], TDepth extends ReadonlyArray<number> = []> = TDepth['length'] extends MAXIMUM_DEPTH ? Array<UseQueryResult> : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseQueryResult<Head>] : T extends [infer Head, ...infer Tails] ? QueriesResults<[...Tails], [...TResults, GetUseQueryResult<Head>], [...TDepth, 1]> : { [K in keyof T]: GetUseQueryResult<T[K]>; };
/**
 * The `useQueries` hook can be used to fetch a variable number of queries.
 *
 * The `queries` key accepts an array with query option objects mostly identical to `useQuery` — the top-level
 * `subscribed` option isn't accepted per query (see `placeholderData` below for another difference). A custom
 * `QueryClient` is supplied once, as `useQueries`' own top-level second argument, rather than per query.
 *
 * Having the same query key more than once in the array of query objects may cause some data to be shared
 * between queries. To avoid this, consider de-duplicating the queries and map the results back to the desired
 * structure.
 *
 * The `combine` option can be used to combine the results of the queries into a single value. The result will
 * be structurally shared to be as referentially stable as possible.
 *
 * @remarks The `combine` function only re-runs if it changed referentially, or if any of the query results
 * changed. An inlined `combine` function, as shown in the example below, therefore runs on every render — wrap
 * it in `useCallback`, or extract it to a stable function reference if it doesn't have any dependencies, to
 * avoid that.
 *
 * Unlike `useQuery`, `useQueries` cannot infer the `data` argument of an _inline_ `select` from its sibling
 * `queryFn`. Because `useQueries` infers the type of the whole `queries` array at once, the `select` parameter
 * of a query object written inline cannot be contextually typed from that same object's `queryFn`, so it falls
 * back to `unknown` — a [known TypeScript limitation](https://github.com/TanStack/query/issues/6556). Annotate
 * the `select` parameter explicitly, or define the query with {@link queryOptions}, which resolves its types in
 * a single object _before_ it reaches `useQueries`, to work around this — see the example below. The same
 * limitation applies to {@link useSuspenseQueries}.
 *
 * `placeholderData` is supported here too, but unlike `useQuery`, it doesn't receive information from
 * previously rendered queries, because the number of queries can differ between renders.
 * @param queryClient - Use this to provide a custom `QueryClient`. Otherwise, the one from the nearest context
 * will be used.
 * @returns The combined result. Without `combine`, this is an array with all the query results, in the same
 * order as the input. When `combine` is provided, this is the value returned by `combine` instead.
 *
 * @example
 * ```tsx
 * import { useQueries } from '@tanstack/react-query'
 *
 * function Posts({ ids }: { ids: Array<number> }) {
 *   const postQueries = useQueries({
 *     queries: ids.map((id) => ({
 *       queryKey: ['post', id],
 *       queryFn: () => fetchPost(id),
 *       staleTime: Infinity,
 *     })),
 *   })
 *
 *   return (
 *     <ul>
 *       {postQueries.map((query, index) => {
 *         if (query.isPending) return <li key={ids[index]}>Loading...</li>
 *         if (query.isError) return <li key={ids[index]}>Error: {query.error.message}</li>
 *         return <li key={ids[index]}>{query.data.title}</li>
 *       })}
 *     </ul>
 *   )
 * }
 * ```
 *
 * @example
 * Combining results into a single value:
 * ```tsx
 * import { useQueries } from '@tanstack/react-query'
 *
 * function Posts({ ids }: { ids: Array<number> }) {
 *   const { data, isPending, isError } = useQueries({
 *     queries: ids.map((id) => ({
 *       queryKey: ['post', id],
 *       queryFn: () => fetchPost(id),
 *     })),
 *     combine: (postQueries) => {
 *       return {
 *         data: postQueries.map((query) => query.data),
 *         isPending: postQueries.some((query) => query.isPending),
 *         isError: postQueries.some((query) => query.isError),
 *       }
 *     },
 *   })
 *
 *   if (isPending) return 'Loading...'
 *   if (isError) return 'Error loading posts'
 *
 *   return (
 *     <ul>
 *       {data.map((post) => (
 *         <li key={post?.id}>{post?.title}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 *
 * @example
 * Typing `select` via {@link queryOptions}. Note that spreading a `queryOptions` result and overriding
 * `select` inline still falls back to `unknown` — wrap the spread in `queryOptions` again so the override is
 * resolved before it reaches `useQueries`:
 * ```tsx
 * import { queryOptions, useQueries } from '@tanstack/react-query'
 *
 * const postOptions = (id: number) =>
 *   queryOptions({
 *     queryKey: ['post', id],
 *     queryFn: () => fetchPost(id),
 *   })
 *
 * function PostTitle({ id }: { id: number }) {
 *   const [{ data: broken }] = useQueries({
 *     queries: [
 *       {
 *         ...postOptions(id),
 *         // ❌ `data` is `unknown` here
 *         select: (data) => data.title,
 *       },
 *     ],
 *   })
 *
 *   const [{ data: fixed }] = useQueries({
 *     queries: [
 *       queryOptions({
 *         ...postOptions(id),
 *         // ✅ `data` is `Post`
 *         select: (data) => data.title,
 *       }),
 *     ],
 *   })
 *
 *   return <h1>{fixed}</h1>
 * }
 * ```
 */
declare function useQueries<T extends Array<any>, TCombinedResult = QueriesResults<T>>({ queries, ...options }: {
  /**
   * An array with query option objects, mostly identical to `useQuery` — except that `queryClient` and
   * `subscribed` aren't accepted per-query (`subscribed` is a top-level option here instead), and
   * `placeholderData` accepts a {@link QueriesPlaceholderDataFunction}, which is called with `previousData`
   * and `previousQuery` always `undefined`, rather than `useQuery`'s placeholder function.
   */
  queries: readonly [...QueriesOptions<T>] | readonly [...{ [K in keyof T]: GetUseQueryOptionsForUseQueries<T[K]>; }];
  /**
   * Use this to combine the results of the queries into a single value. The result will be structurally
   * shared to be as referentially stable as possible.
   */
  combine?: (result: QueriesResults<T>) => TCombinedResult;
  /**
   * Set this to `false` to unsubscribe this observer from updates to the query cache.
   *
   * @defaultValue true
   */
  subscribed?: boolean;
}, queryClient?: QueryClient): TCombinedResult;
//#endregion
export { QueriesOptions, QueriesResults, useQueries };
//# sourceMappingURL=useQueries.d.ts.map