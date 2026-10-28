import { t as Subscribable } from "./subscribable-CbifVTKz.js";
import { $n as Query, At as QueryObserverOptions, Pt as QueryObserverResult, on as QueryClient, rr as QueryObserver } from "./hydration-Cq7QYAzB.js";
//#region src/queriesObserver.d.ts
type QueriesObserverListener = (result: Array<QueryObserverResult>) => void;
type CombineFn<TCombinedResult> = (result: Array<QueryObserverResult>) => TCombinedResult;
interface QueriesObserverOptions<TCombinedResult = Array<QueryObserverResult>> {
  /**
   * A function that combines the array of `QueryObserverResult`s (one per
   * observed query) into a single value. The combined value is memoized and
   * only recomputed when one of the underlying results, the query hashes, or
   * the `combine` function itself changes.
   *
   * Defaults to returning the array of `QueryObserverResult`s unchanged.
   */
  combine?: CombineFn<TCombinedResult>;
}
/**
 * A `QueriesObserver` watches an array of queries at once, exposing them as
 * a single array of `QueryObserverResult`s (or, when a `combine` option is
 * given, as a combined value derived from that array). It manages one
 * internal `QueryObserver` per query, and is the primitive that framework
 * adapters (e.g. `useQueries`) build their hooks on top of.
 *
 * @example
 * ```ts
 * const observer = new QueriesObserver(queryClient, [
 *   { queryKey: ['post', 1], queryFn: fetchPost },
 *   { queryKey: ['post', 2], queryFn: fetchPost },
 * ])
 *
 * const unsubscribe = observer.subscribe((result) => {
 *   console.log(result)
 * })
 * ```
 */
declare class QueriesObserver<TCombinedResult = Array<QueryObserverResult>> extends Subscribable<QueriesObserverListener> {
  #private;
  constructor(client: QueryClient, queries: Array<QueryObserverOptions<any, any, any, any, any>>, options?: QueriesObserverOptions<TCombinedResult>);
  protected onSubscribe(): void;
  protected onUnsubscribe(): void;
  /**
   * Stops observing all queries: clears all listeners and destroys every
   * underlying `QueryObserver` this observer manages.
   */
  destroy(): void;
  /**
   * Replaces the set of queries being observed. Existing `QueryObserver`s
   * are reused for queries that match an already-observed query hash;
   * observers for queries that are no longer present are destroyed, and new
   * observers are created and subscribed to for newly added queries.
   *
   * @example
   * ```ts
   * observer.setQueries([
   *   { queryKey: ['post', 1], queryFn: fetchPost },
   *   { queryKey: ['post', 3], queryFn: fetchPost },
   * ])
   * ```
   */
  setQueries(queries: Array<QueryObserverOptions>, options?: QueriesObserverOptions<TCombinedResult>): void;
  /**
   * Returns the most recently computed array of `QueryObserverResult`s, one
   * per observed query, in the same order as the queries passed to the
   * constructor or `setQueries`.
   *
   * @example
   * ```ts
   * const results = observer.getCurrentResult()
   * const data = results.map((result) => result.data)
   * ```
   */
  getCurrentResult(): Array<QueryObserverResult>;
  /**
   * Returns the underlying `Query` instances currently being observed, in
   * the same order as the queries passed to the constructor or `setQueries`.
   */
  getQueries(): Query<unknown, Error, unknown, readonly unknown[]>[];
  /**
   * Returns the underlying `QueryObserver` instances this observer manages,
   * in the same order as the queries passed to the constructor or
   * `setQueries`.
   */
  getObservers(): QueryObserver<unknown, Error, unknown, unknown, readonly unknown[]>[];
  /**
   * The `QueriesObserver` counterpart of {@link QueryObserver#getOptimisticResult} — computes
   * the result for the given (already-defaulted) queries right now, synchronously. Called by
   * framework adapters (e.g. `useQueries`) ahead of subscribing, returning a tuple of the raw
   * per-query results, a function to compute the combined result from them, and a function to
   * wrap the results for property-access tracking.
   */
  getOptimisticResult(queries: Array<QueryObserverOptions>, combine: CombineFn<TCombinedResult> | undefined): [rawResult: Array<QueryObserverResult>, combineResult: (r?: Array<QueryObserverResult>) => TCombinedResult, trackResult: () => Array<QueryObserverResult>];
}
//#endregion
export { QueriesObserver, QueriesObserverOptions };
//# sourceMappingURL=queriesObserver.d.ts.map