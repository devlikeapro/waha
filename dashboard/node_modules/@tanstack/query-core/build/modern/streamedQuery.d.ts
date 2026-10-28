import { Ct as QueryKey, St as QueryFunctionContext, xt as QueryFunction } from "./hydration-Cq7QYAzB.js";
//#region src/streamedQuery.d.ts
type BaseStreamedQueryParams<TQueryFnData, TQueryKey extends QueryKey> = {
  /** The function that returns an `AsyncIterable` to stream data from. */
  streamFn: (context: QueryFunctionContext<TQueryKey>) => AsyncIterable<TQueryFnData> | Promise<AsyncIterable<TQueryFnData>>;
  /**
   * Defines how refetches are handled.
   * - `'reset'` (default): erases all data and puts the query back into `pending` state.
   * - `'append'`: appends new data to the existing data.
   * - `'replace'`: writes all data to the cache once the stream ends.
   */
  refetchMode?: 'append' | 'reset' | 'replace';
};
type SimpleStreamedQueryParams<TQueryFnData, TQueryKey extends QueryKey> = BaseStreamedQueryParams<TQueryFnData, TQueryKey> & {
  reducer?: never;
  initialValue?: never;
};
type ReducibleStreamedQueryParams<TQueryFnData, TData, TQueryKey extends QueryKey> = BaseStreamedQueryParams<TQueryFnData, TQueryKey> & {
  /**
   * Reduces streamed chunks into the final data shape. Required whenever `TData` is not an
   * array, since there is no default way to accumulate non-array chunks.
   */
  reducer: (acc: TData, chunk: TQueryFnData) => TData;
  /**
   * The value used while the first chunk is being fetched, and returned if the stream yields no
   * values. Required together with a custom `reducer`.
   */
  initialValue: TData;
};
type StreamedQueryParams<TQueryFnData, TData, TQueryKey extends QueryKey> = SimpleStreamedQueryParams<TQueryFnData, TQueryKey> | ReducibleStreamedQueryParams<TQueryFnData, TData, TQueryKey>;
/**
 * This is a helper function to create a query function that streams data from an AsyncIterable.
 * Data will be an Array of all the chunks received.
 * The query will be in a 'pending' state until the first chunk of data is received, but will go to 'success' after that.
 * The query will stay in fetchStatus 'fetching' until the stream ends.
 * @param streamFn - The function that returns an AsyncIterable to stream data from.
 * @param refetchMode - Defines how re-fetches are handled.
 * Defaults to `'reset'`, erases all data and puts the query back into `pending` state.
 * Set to `'append'` to append new data to the existing data.
 * Set to `'replace'` to write all data to the cache once the stream ends.
 * @param reducer - A function to reduce the streamed chunks into the final data.
 * Defaults to a function that appends chunks to the end of the array.
 * @param initialValue - Initial value to be used while the first chunk is being fetched, and returned if the stream yields no values.
 * @example
 * ```ts
 * await queryClient.query({
 *   queryKey: ['data'],
 *   queryFn: streamedQuery({
 *     streamFn: fetchDataInChunks,
 *   }),
 * })
 * ```
 */
declare function streamedQuery<TQueryFnData = unknown, TData = Array<TQueryFnData>, TQueryKey extends QueryKey = QueryKey>({ streamFn, refetchMode, reducer, initialValue }: StreamedQueryParams<TQueryFnData, TData, TQueryKey>): QueryFunction<TData, TQueryKey>;
//#endregion
export { streamedQuery };
//# sourceMappingURL=streamedQuery.d.ts.map