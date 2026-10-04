import { t as Subscribable } from "./subscribable-CbifVTKz.cjs";
import { $n as Query, A as InfiniteData, C as FetchPreviousPageOptions, Ct as QueryKey, F as InfiniteQueryObserverOptions, S as FetchNextPageOptions, f as DefaultError, m as DefaultedInfiniteQueryObserverOptions, on as QueryClient, rr as QueryObserver, z as InfiniteQueryObserverResult } from "./hydration-DwR10Hi-.cjs";
//#region src/infiniteQueryObserver.d.ts
type InfiniteQueryObserverListener<TData, TError> = (result: InfiniteQueryObserverResult<TData, TError>) => void;
/**
 * An `InfiniteQueryObserver` extends `QueryObserver` to observe and switch
 * between infinite queries. It augments the base `QueryObserverResult` with
 * infinite-query-specific fields and methods, such as `hasNextPage` and
 * `fetchNextPage`, and is the primitive that framework adapters (e.g.
 * `useInfiniteQuery`) build their hooks on top of.
 *
 * @example
 * ```ts
 * const observer = new InfiniteQueryObserver(queryClient, {
 *   queryKey: ['projects'],
 *   queryFn: ({ pageParam }) => fetchProjects(pageParam),
 *   initialPageParam: 0,
 *   getNextPageParam: (lastPage) => lastPage.nextCursor,
 * })
 *
 * const unsubscribe = observer.subscribe((result) => console.log(result))
 * ```
 */
declare class InfiniteQueryObserver<TQueryFnData = unknown, TError = DefaultError, TData = InfiniteData<TQueryFnData>, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown> extends QueryObserver<TQueryFnData, TError, TData, InfiniteData<TQueryFnData, TPageParam>, TQueryKey> {
  subscribe: Subscribable<InfiniteQueryObserverListener<TData, TError>>['subscribe'];
  getCurrentResult: ReplaceReturnType<QueryObserver<TQueryFnData, TError, TData, InfiniteData<TQueryFnData, TPageParam>, TQueryKey>['getCurrentResult'], InfiniteQueryObserverResult<TData, TError>>;
  protected fetch: ReplaceReturnType<QueryObserver<TQueryFnData, TError, TData, InfiniteData<TQueryFnData, TPageParam>, TQueryKey>['fetch'], Promise<InfiniteQueryObserverResult<TData, TError>>>;
  constructor(client: QueryClient, options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>);
  protected bindMethods(): void;
  /**
   * Updates the observer's options. Behaves the same as
   * `QueryObserver.setOptions`, additionally marking the options as
   * belonging to an infinite query before delegating to the base
   * implementation.
   */
  setOptions(options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): void;
  /**
   * The infinite-query counterpart of {@link QueryObserver#getOptimisticResult}, marking the
   * options as an infinite query before delegating to it. Called by framework adapters (e.g.
   * `useInfiniteQuery`) ahead of subscribing, to compute the current `InfiniteQueryObserverResult`
   * synchronously.
   */
  getOptimisticResult(options: DefaultedInfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): InfiniteQueryObserverResult<TData, TError>;
  /**
   * Fetches the next page of the infinite query and returns a promise that
   * resolves with the resulting `InfiniteQueryObserverResult`. The page
   * param used for the fetch is determined by `getNextPageParam`, which
   * receives the current pages/page params and whose result also determines
   * `hasNextPage`.
   *
   * @example
   * ```ts
   * const { hasNextPage } = observer.getCurrentResult()
   *
   * if (hasNextPage) {
   *   await observer.fetchNextPage()
   * }
   * ```
   *
   * @see {@link InfiniteQueryObserver#fetchPreviousPage}
   */
  fetchNextPage(options?: FetchNextPageOptions): Promise<InfiniteQueryObserverResult<TData, TError>>;
  /**
   * Fetches the previous page of the infinite query and returns a promise
   * that resolves with the resulting `InfiniteQueryObserverResult`. The page
   * param used for the fetch is determined by `getPreviousPageParam`, which
   * receives the current pages/page params and whose result also determines
   * `hasPreviousPage`.
   *
   * @example
   * ```ts
   * const { hasPreviousPage } = observer.getCurrentResult()
   *
   * if (hasPreviousPage) {
   *   await observer.fetchPreviousPage()
   * }
   * ```
   *
   * @see {@link InfiniteQueryObserver#fetchNextPage}
   */
  fetchPreviousPage(options?: FetchPreviousPageOptions): Promise<InfiniteQueryObserverResult<TData, TError>>;
  protected createResult(query: Query<TQueryFnData, TError, InfiniteData<TQueryFnData, TPageParam>, TQueryKey>, options: InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): InfiniteQueryObserverResult<TData, TError>;
}
type ReplaceReturnType<TFunction extends (...args: Array<any>) => unknown, TReturn> = (...args: Parameters<TFunction>) => TReturn;
//#endregion
export { InfiniteQueryObserver };
//# sourceMappingURL=infiniteQueryObserver.d.cts.map