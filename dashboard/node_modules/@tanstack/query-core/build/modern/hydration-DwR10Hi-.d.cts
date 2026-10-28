import { t as Subscribable } from "./subscribable-CbifVTKz.cjs";
import { t as Removable } from "./removable-DeMjhW5M.cjs";
//#region src/queryObserver.d.ts
type QueryObserverListener<TData, TError> = (result: QueryObserverResult<TData, TError>) => void;
interface ObserverFetchOptions extends FetchOptions {
  throwOnError?: boolean;
}
/**
 * A `QueryObserver` watches a single query in the `QueryCache` and computes a
 * `QueryObserverResult` from its state, recomputing and notifying subscribers
 * whenever the underlying query (or the observer's options) changes. It is
 * the primitive that framework adapters (e.g. `useQuery`) build their hooks
 * on top of, but it can also be used directly to observe and switch between
 * queries outside of any framework.
 *
 * @example
 * ```ts
 * const observer = new QueryObserver(queryClient, {
 *   queryKey: ['posts'],
 *   queryFn: fetchPosts,
 * })
 *
 * const unsubscribe = observer.subscribe((result) => {
 *   console.log(result.data)
 * })
 * ```
 */
declare class QueryObserver<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> extends Subscribable<QueryObserverListener<TData, TError>> {
  #private;
  options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
  constructor(client: QueryClient, options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>);
  protected bindMethods(): void;
  protected onSubscribe(): void;
  protected onUnsubscribe(): void;
  /**
   * Returns whether the observed query is currently stale and configured
   * (via the `refetchOnReconnect` option) to refetch when the network
   * reconnects.
   */
  shouldFetchOnReconnect(): boolean;
  /**
   * Returns whether the observed query is currently stale and configured
   * (via the `refetchOnWindowFocus` option) to refetch when the window
   * regains focus.
   */
  shouldFetchOnWindowFocus(): boolean;
  /**
   * Stops observing the current query: clears all listeners, cancels the
   * stale and refetch-interval timers, and removes this observer from the
   * query it was observing.
   */
  destroy(): void;
  /**
   * Updates the observer's options. This will re-resolve the query being
   * observed (switching to a different query if the `queryKey` changed),
   * trigger a fetch if the new options require one and the observer has
   * subscribers, recompute the current result, and reschedule the stale and
   * refetch-interval timers as needed.
   *
   * @example
   * ```ts
   * observer.setOptions({ queryKey: ['posts', 1], queryFn: () => fetchPost(1) })
   * // later: switch to a different query, reusing the same observer
   * observer.setOptions({ queryKey: ['posts', 2], queryFn: () => fetchPost(2) })
   * ```
   */
  setOptions(options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): void;
  /**
   * Computes the result the observer would produce for the given (already-defaulted) options
   * right now, building the underlying `Query` if it doesn't exist yet, without waiting for a
   * subscription callback. Called by framework adapters on every render (e.g. `useQuery`) so the
   * returned value is available synchronously, ahead of `setOptions` triggering an actual fetch.
   */
  getOptimisticResult(options: DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): QueryObserverResult<TData, TError>;
  /**
   * Returns the most recently computed `QueryObserverResult` for the
   * observed query. This is a point-in-time read; to be notified of updates
   * as they happen, subscribe to the observer instead (its inherited
   * `subscribe` method).
   *
   * @example
   * ```ts
   * const result = observer.getCurrentResult()
   * console.log(result.status, result.data)
   * ```
   */
  getCurrentResult(): QueryObserverResult<TData, TError>;
  /**
   * Wraps a `QueryObserverResult` in a `Proxy` that records which properties are read, via
   * {@link QueryObserver#trackProp} (and an optional `onPropTracked` callback). Used by framework
   * adapters when `notifyOnChangeProps` is not set, to implement its default "only re-render on
   * properties you actually read" behavior.
   */
  trackResult(result: QueryObserverResult<TData, TError>, onPropTracked?: (key: keyof QueryObserverResult) => void): QueryObserverResult<TData, TError>;
  /**
   * Records that the given `QueryObserverResult` property was read, so a subsequent update only
   * notifies this observer if a tracked property actually changed. Normally called indirectly via
   * {@link QueryObserver#trackResult}'s proxy; exposed directly for adapters that track property
   * access themselves (e.g. through their own reactivity system) instead of via the proxy.
   */
  trackProp(key: keyof QueryObserverResult): void;
  /**
   * Returns the `Query` instance this observer is currently observing.
   */
  getCurrentQuery(): Query<TQueryFnData, TError, TQueryData, TQueryKey>;
  /**
   * Refetches the observed query and returns a promise that resolves with
   * the resulting `QueryObserverResult`.
   *
   * @example
   * ```ts
   * const result = await observer.refetch({ cancelRefetch: false })
   * console.log(result.data)
   * ```
   */
  refetch({ ...options }?: RefetchOptions): Promise<QueryObserverResult<TData, TError>>;
  /**
   * Fetches a query defined by the given options without affecting this
   * observer's own tracked query or result, and returns a promise that
   * resolves with the `QueryObserverResult` for that fetch. This is useful
   * for prefetching data that another observer (e.g. a query about to be
   * navigated to) will need, ahead of time.
   *
   * @example
   * ```ts
   * const result = await observer.fetchOptimistic({
   *   queryKey: ['posts', 2],
   *   queryFn: () => fetchPost(2),
   * })
   * console.log(result.data)
   * ```
   */
  fetchOptimistic(options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): Promise<QueryObserverResult<TData, TError>>;
  protected fetch(fetchOptions: ObserverFetchOptions): Promise<QueryObserverResult<TData, TError>>;
  protected createResult(query: Query<TQueryFnData, TError, TQueryData, TQueryKey>, options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): QueryObserverResult<TData, TError>;
  /**
   * Recomputes and stores the current result from the current query/options, notifying listeners
   * if it changed. Framework adapters call this right after subscribing to make sure no query
   * update was missed in the gap between creating the observer and subscribing to it.
   */
  updateResult(): void;
  /** @internal */
  onQueryUpdate(): void;
}
//#endregion
//#region src/query.d.ts
interface QueryConfig<TQueryFnData, TError, TData, TQueryKey extends QueryKey = QueryKey> {
  client: QueryClient;
  queryKey: TQueryKey;
  queryHash: string;
  options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  defaultOptions?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  state?: QueryState<TData, TError>;
}
/**
 * The raw state stored on a `Query` instance. This is the underlying state
 * that observer results (e.g. `QueryObserverResult`) are derived from.
 */
interface QueryState<TData = unknown, TError = DefaultError> {
  /**
   * The last successfully resolved data for the query.
   */
  data: TData | undefined;
  /**
   * The number of times the query has successfully resolved.
   */
  dataUpdateCount: number;
  /**
   * The timestamp for when the query most recently returned the `status` as `"success"`.
   */
  dataUpdatedAt: number;
  /**
   * The error object for the query, if the last attempt resulted in an error.
   * - Defaults to `null`.
   */
  error: TError | null;
  /**
   * The sum of all errors, incremented every time the query resolves with an error.
   */
  errorUpdateCount: number;
  /**
   * The timestamp for when the query most recently returned the `status` as `"error"`.
   */
  errorUpdatedAt: number;
  /**
   * The failure count for the current fetch.
   * - Incremented every time the fetch fails.
   * - Reset to `0` when the fetch succeeds.
   */
  fetchFailureCount: number;
  /**
   * The reason the current fetch failed, as reported by the retryer.
   * - Reset to `null` when the fetch succeeds.
   */
  fetchFailureReason: TError | null;
  /**
   * Metadata passed to the currently in-flight (or most recent) fetch, e.g. the
   * `fetchMore` direction for infinite queries.
   */
  fetchMeta: FetchMeta | null;
  /**
   * Whether the query has been marked as invalidated via `invalidate()`.
   * - Reset to `false` whenever the query resolves successfully.
   */
  isInvalidated: boolean;
  /**
   * The status of the query.
   * - `pending` if there's no cached data and no attempt was finished yet.
   * - `error` if the last attempt resulted in an error.
   * - `success` if the query has data.
   */
  status: QueryStatus;
  /**
   * The fetch status of the query.
   * - `fetching`: the `queryFn` is currently executing.
   * - `paused`: a fetch wanted to run but has been paused (see network mode).
   * - `idle`: the query is not fetching.
   */
  fetchStatus: FetchStatus;
}
interface FetchContext<TQueryFnData, TError, TData, TQueryKey extends QueryKey = QueryKey> {
  fetchFn: () => unknown | Promise<unknown>;
  fetchOptions?: FetchOptions;
  signal: AbortSignal;
  options: QueryOptions<TQueryFnData, TError, TData, any>;
  client: QueryClient;
  queryKey: TQueryKey;
  state: QueryState<TData, TError>;
}
interface QueryBehavior<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> {
  onFetch: (context: FetchContext<TQueryFnData, TError, TData, TQueryKey>, query: Query) => void;
}
type FetchDirection = 'forward' | 'backward';
interface FetchMeta {
  fetchMore?: {
    direction: FetchDirection;
  };
}
interface FetchOptions<TData = unknown> {
  cancelRefetch?: boolean;
  meta?: FetchMeta;
  initialPromise?: Promise<TData>;
}
interface FailedAction$1<TError> {
  type: 'failed';
  failureCount: number;
  error: TError;
}
interface FetchAction {
  type: 'fetch';
  meta?: FetchMeta;
}
interface SuccessAction$1<TData> {
  data: TData | undefined;
  type: 'success';
  dataUpdatedAt?: number;
  manual?: boolean;
}
interface ErrorAction$1<TError> {
  type: 'error';
  error: TError;
}
interface InvalidateAction {
  type: 'invalidate';
}
interface PauseAction$1 {
  type: 'pause';
}
interface ContinueAction$1 {
  type: 'continue';
}
interface SetStateAction<TData, TError> {
  type: 'setState';
  state: Partial<QueryState<TData, TError>>;
}
type Action$1<TData, TError> = ContinueAction$1 | ErrorAction$1<TError> | FailedAction$1<TError> | FetchAction | InvalidateAction | PauseAction$1 | SetStateAction<TData, TError> | SuccessAction$1<TData>;
/**
 * Represents a single cached query. A `Query` holds the query's key, options,
 * state (data/error/status), and the observers currently subscribed to it.
 *
 * Instances are created and managed internally by `QueryCache`; application
 * code typically interacts with queries indirectly through `QueryClient` or
 * a framework hook like `useQuery`. Direct access to a `Query` instance is
 * possible via `queryCache.find()`/`findAll()` for inspecting cache state.
 *
 * @example
 * ```ts
 * const queryCache = queryClient.getQueryCache()
 * const query = queryCache.find({ queryKey: ['posts'] })
 *
 * if (query) {
 *   console.log(query.state.dataUpdatedAt)
 * }
 * ```
 */
declare class Query<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> extends Removable {
  #private;
  queryKey: TQueryKey;
  queryHash: string;
  options: QueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  state: QueryState<TData, TError>;
  observers: Array<QueryObserver<any, any, any, any, any>>;
  constructor(config: QueryConfig<TQueryFnData, TError, TData, TQueryKey>);
  /**
   * The `meta` object passed in the query's options, if any.
   */
  get meta(): QueryMeta | undefined;
  /** @internal */
  get queryType(): "infinite" | undefined;
  /**
   * The promise for the currently in-flight fetch, if the query is fetching.
   * `undefined` when the query is not fetching.
   */
  get promise(): Promise<TData> | undefined;
  /** @internal */
  setOptions(options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>): void;
  protected optionalRemove(): void;
  /** @internal */
  setData(newData: TData, options?: SetDataOptions & {
    manual: boolean;
  }): TData;
  /**
   * Merges the given partial state directly into this query's state, notifying observers. Used
   * by persistence and broadcast plugins to restore a state snapshot, and by devtools to let a
   * user manually trigger a loading/error state or edit the cached data.
   */
  setState(state: Partial<QueryState<TData, TError>>): void;
  /**
   * Cancels the query's currently in-flight fetch, if any.
   * - Returns a promise that resolves once the cancellation has settled.
   * - If no fetch is in progress, resolves immediately.
   *
   * @example
   * ```ts
   * await query.cancel()
   * ```
   */
  cancel(options?: CancelOptions): Promise<void>;
  /**
   * Clears the query's garbage collection timeout and silently cancels any
   * in-flight fetch. Called by `QueryCache` when the query is removed from
   * the cache.
   *
   * @see {@link Query#cancel}
   */
  destroy(): void;
  /** @internal */
  get resetState(): QueryState<TData, TError>;
  /**
   * Resets the query back to its initial state (the state it had when it was
   * first created, e.g. any `initialData`), destroying it first to cancel any
   * in-flight fetch.
   */
  reset(): void;
  /**
   * Returns `true` if the query has at least one observer for which `enabled`
   * does not resolve to `false`.
   */
  isActive(): boolean;
  /**
   * Returns `true` if the query is disabled, meaning it will not fetch
   * automatically.
   * - If the query has observers, it is disabled when none of them are active
   *   (see `isActive`).
   * - If the query has no observers, it is disabled when its `queryFn` is
   *   `skipToken` or it has never been fetched.
   */
  isDisabled(): boolean;
  /**
   * Returns `true` if the query has been fetched, i.e. it has resolved with
   * either data or an error at least once.
   */
  isFetched(): boolean;
  /**
   * Returns `true` if the query has at least one observer configured with
   * `staleTime: 'static'`, meaning it is treated as never stale.
   */
  isStatic(): boolean;
  /**
   * Returns `true` if the query is stale.
   * - If the query has observers, defers to whether any observer's current
   *   result reports `isStale` (which accounts for each observer's own
   *   `staleTime` and `enabled` state).
   * - If the query has no observers, it is considered stale when it has no
   *   data or has been invalidated.
   *
   * @see {@link Query#isStaleByTime}
   * @example
   * ```ts
   * if (query.isStale()) {
   *   // refetch or otherwise treat the cached data as outdated
   * }
   * ```
   */
  isStale(): boolean;
  /**
   * Returns `true` if the query's data is stale relative to the given
   * `staleTime` (defaults to `0`).
   * - A query with no data is always stale.
   * - `staleTime: 'static'` is never stale.
   * - An invalidated query is always stale.
   * - Otherwise, staleness is based on elapsed time since `dataUpdatedAt`.
   *
   * @see {@link Query#isStale}
   * @example
   * ```ts
   * const isStale = query.isStaleByTime(1000 * 60)
   * ```
   */
  isStaleByTime(staleTime?: StaleTime): boolean;
  /** @internal */
  onFocus(): void;
  /** @internal */
  onOnline(): void;
  /** @internal */
  addObserver(observer: QueryObserver<any, any, any, any, any>): void;
  /** @internal */
  removeObserver(observer: QueryObserver<any, any, any, any, any>): void;
  /**
   * Returns the number of observers currently subscribed to this query.
   *
   * @example
   * ```ts
   * if (query.getObserversCount() === 0) {
   *   // no component is currently watching this query
   * }
   * ```
   */
  getObserversCount(): number;
  /**
   * Marks the query as invalidated, unless it is already invalidated. This
   * updates `state.isInvalidated` and notifies observers, but does not by
   * itself trigger a refetch.
   *
   * @example
   * ```ts
   * query.invalidate()
   * ```
   */
  invalidate(): void;
  /**
   * Fetches the query, i.e. runs its `queryFn` (through any configured
   * retryer/behavior) and updates the query's state with the result.
   * - If a fetch is already in flight, returns its promise instead of
   *   starting a new one, unless `fetchOptions.cancelRefetch` is set and the
   *   query already has data, in which case the current fetch is silently
   *   cancelled first.
   * - If `options` is passed, it replaces the query's current options
   *   before fetching.
   */
  fetch(options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>, fetchOptions?: FetchOptions<TQueryFnData>): Promise<TData>;
}
declare function fetchState<TQueryFnData, TError, TData, TQueryKey extends QueryKey>(data: TData | undefined, options: QueryOptions<TQueryFnData, TError, TData, TQueryKey>): {
  readonly error?: null | undefined;
  readonly status?: "pending" | undefined;
  readonly fetchFailureCount: 0;
  readonly fetchFailureReason: null;
  readonly fetchStatus: "fetching" | "paused";
};
//#endregion
//#region src/mutationObserver.d.ts
type MutationObserverListener<TData, TError, TVariables, TOnMutateResult> = (result: MutationObserverResult<TData, TError, TVariables, TOnMutateResult>) => void;
/**
 * Observes a single mutation and derives a `MutationObserverResult` from it.
 * A framework hook like `useMutation` creates one `MutationObserver` per hook
 * call, keeps it stable across re-renders, calls `setOptions` when the options
 * passed to the hook change, subscribes to it to re-render on updates, and
 * reads `getCurrentResult()` for the value to return. Calling `mutate()`
 * builds a new underlying `Mutation` in the `MutationCache` and executes it.
 *
 * @example
 * ```ts
 * const observer = new MutationObserver(queryClient, {
 *   mutationFn: (variables: { title: string }) => addPost(variables),
 * })
 * ```
 */
declare class MutationObserver<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> extends Subscribable<MutationObserverListener<TData, TError, TVariables, TOnMutateResult>> {
  #private;
  options: MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>;
  constructor(client: QueryClient, options: MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>);
  protected bindMethods(): void;
  /**
   * Updates the observer's options.
   *
   * If the new `mutationKey` differs from the previous one (and both were
   * defined), the observer is reset, detaching it from the mutation it was
   * observing. Otherwise, if the currently observed mutation is still
   * `pending`, its options are updated in place as well.
   *
   * @example
   * ```ts
   * observer.setOptions({
   *   mutationFn: (variables: { title: string }) => addPost(variables),
   *   onSuccess: (data) => console.log(data),
   * })
   * ```
   */
  setOptions(options: MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>): void;
  protected onSubscribe(): void;
  protected onUnsubscribe(): void;
  /** @internal */
  onMutationUpdate(action: Action<TData, TError, TVariables, TOnMutateResult>): void;
  /**
   * Returns the observer's current result, derived from the observed
   * mutation's state (or the default, `idle` state if no mutation has been
   * built yet, e.g. before the first `mutate()` call or after `reset()`).
   */
  getCurrentResult(): MutationObserverResult<TData, TError, TVariables, TOnMutateResult>;
  /**
   * Detaches the observer from the mutation it is currently observing (if
   * any) and resets the observed result back to its default, `idle` state.
   *
   * This does not cancel an in-flight mutation; the mutation itself keeps
   * running to completion and its own callbacks still fire, but this
   * observer stops reflecting its state and a subsequent `mutate()` call
   * will build a brand new mutation.
   *
   * @example
   * ```ts
   * observer.reset()
   * ```
   *
   * @see {@link MutationObserver#mutate}
   */
  reset(): void;
  /**
   * Builds a new `Mutation` in the `MutationCache` using the observer's
   * current options, detaches this observer from any previously observed
   * mutation, attaches it to the new one, and executes it with the given
   * variables.
   *
   * The optional per-call `options` (`onSuccess`/`onError`/`onSettled`) are
   * invoked once the mutation settles, in addition to any callbacks defined
   * on the observer's own options.
   *
   * @example
   * ```ts
   * await observer.mutate(
   *   { title: 'New post' },
   *   { onSuccess: (data) => console.log(data) },
   * )
   * ```
   */
  mutate(variables: TVariables, options?: MutateOptions<TData, TError, TVariables, TOnMutateResult>): Promise<TData>;
}
//#endregion
//#region src/mutationCache.d.ts
/**
 * Global callbacks that fire for every mutation handled by a `MutationCache`, regardless of which
 * component or observer triggered it. They differ from the `defaultOptions` provided to a
 * `QueryClient` in two ways: `defaultOptions` can be overridden by each mutation, while these
 * callbacks are always called, and `onMutate` here does not allow returning a result.
 *
 * If a callback returns a promise, it will be awaited before the mutation continues.
 */
interface MutationCacheConfig {
  /** Called when any mutation in the cache encounters an error. */
  onError?: (error: DefaultError, variables: unknown, onMutateResult: unknown, mutation: Mutation<unknown, unknown, unknown>, context: MutationFunctionContext) => Promise<unknown> | unknown;
  /** Called when any mutation in the cache is successful. */
  onSuccess?: (data: unknown, variables: unknown, onMutateResult: unknown, mutation: Mutation<unknown, unknown, unknown>, context: MutationFunctionContext) => Promise<unknown> | unknown;
  /** Called before any mutation in the cache executes. */
  onMutate?: (variables: unknown, mutation: Mutation<unknown, unknown, unknown>, context: MutationFunctionContext) => Promise<unknown> | unknown;
  /** Called when any mutation in the cache is settled, either successfully or with an error. */
  onSettled?: (data: unknown | undefined, error: DefaultError | null, variables: unknown, onMutateResult: unknown, mutation: Mutation<unknown, unknown, unknown>, context: MutationFunctionContext) => Promise<unknown> | unknown;
}
interface NotifyEventMutationAdded extends NotifyEvent {
  type: 'added';
  mutation: Mutation<any, any, any, any>;
}
interface NotifyEventMutationRemoved extends NotifyEvent {
  type: 'removed';
  mutation: Mutation<any, any, any, any>;
}
interface NotifyEventMutationObserverAdded extends NotifyEvent {
  type: 'observerAdded';
  mutation: Mutation<any, any, any, any>;
  observer: MutationObserver<any, any, any>;
}
interface NotifyEventMutationObserverRemoved extends NotifyEvent {
  type: 'observerRemoved';
  mutation: Mutation<any, any, any, any>;
  observer: MutationObserver<any, any, any>;
}
interface NotifyEventMutationObserverOptionsUpdated extends NotifyEvent {
  type: 'observerOptionsUpdated';
  mutation?: Mutation<any, any, any, any>;
  observer: MutationObserver<any, any, any, any>;
}
interface NotifyEventMutationUpdated extends NotifyEvent {
  type: 'updated';
  mutation: Mutation<any, any, any, any>;
  action: Action<any, any, any, any>;
}
/**
 * The event passed to a `MutationCache` subscriber. Fired whenever a mutation is added or removed
 * from the cache, its state is updated, or one of its observers is added, removed, or has its
 * options updated.
 */
type MutationCacheNotifyEvent = NotifyEventMutationAdded | NotifyEventMutationRemoved | NotifyEventMutationObserverAdded | NotifyEventMutationObserverRemoved | NotifyEventMutationObserverOptionsUpdated | NotifyEventMutationUpdated;
type MutationCacheListener = (event: MutationCacheNotifyEvent) => void;
/**
 * The `MutationCache` is the storage for mutations.
 *
 * Normally, you will not interact with the `MutationCache` directly and instead use a
 * `QueryClient`. You can subscribe to it (inherited from `Subscribable`) to be informed of
 * safe/known updates to the cache, such as mutations being added, removed, or updated.
 *
 * @example
 * ```ts
 * const unsubscribe = mutationCache.subscribe((event) => {
 *   console.log(event.type, event.mutation)
 * })
 * ```
 */
declare class MutationCache extends Subscribable<MutationCacheListener> {
  #private;
  config: MutationCacheConfig;
  constructor(config?: MutationCacheConfig);
  /** @internal */
  build<TData, TError, TVariables, TOnMutateResult>(client: QueryClient, options: MutationOptions<TData, TError, TVariables, TOnMutateResult>, state?: MutationState<TData, TError, TVariables, TOnMutateResult>): Mutation<TData, TError, TVariables, TOnMutateResult>;
  /** @internal */
  add(mutation: Mutation<any, any, any, any>): void;
  /** @internal */
  remove(mutation: Mutation<any, any, any, any>): void;
  /** @internal */
  canRun(mutation: Mutation<any, any, any, any>): boolean;
  /** @internal */
  runNext(mutation: Mutation<any, any, any, any>): Promise<unknown>;
  /**
   * Removes all mutations from the cache.
   *
   * @example
   * ```ts
   * const mutationCache = queryClient.getMutationCache()
   *
   * mutationCache.clear()
   * ```
   */
  clear(): void;
  /**
   * Returns all mutations within the cache.
   *
   * This is not typically needed for most applications, but can come in handy when needing more
   * information about a mutation in rare scenarios.
   *
   * @example
   * ```ts
   * const mutationCache = queryClient.getMutationCache()
   *
   * const mutations = mutationCache.getAll()
   * ```
   */
  getAll(): Array<Mutation>;
  /**
   * A slightly more advanced method that can be used to get an existing mutation instance from
   * the cache. If the mutation does not exist, `undefined` is returned.
   *
   * This is not typically needed for most applications, but can come in handy when needing more
   * information about a mutation in rare scenarios.
   *
   * @see {@link MutationCache#findAll}
   * @example
   * ```ts
   * const mutationCache = queryClient.getMutationCache()
   *
   * const mutation = mutationCache.find({ mutationKey: ['addPost'] })
   * ```
   */
  find<TData = unknown, TError = DefaultError, TVariables = any, TOnMutateResult = unknown>(filters: MutationFilters): Mutation<TData, TError, TVariables, TOnMutateResult> | undefined;
  /**
   * An even more advanced method that can be used to get existing mutation instances from the
   * cache that match the given filters. If no mutations match, an empty array is returned.
   *
   * This is not typically needed for most applications, but can come in handy when needing more
   * information about mutations in rare scenarios.
   *
   * @see {@link MutationCache#find}
   * @example
   * ```ts
   * const mutationCache = queryClient.getMutationCache()
   *
   * const mutations = mutationCache.findAll({ mutationKey: ['addPost'] })
   * ```
   */
  findAll(filters?: MutationFilters): Array<Mutation>;
  /** @internal */
  notify(event: MutationCacheNotifyEvent): void;
  /** @internal */
  resumePausedMutations(): Promise<unknown>;
}
//#endregion
//#region src/mutation.d.ts
interface MutationConfig<TData, TError, TVariables, TOnMutateResult> {
  client: QueryClient;
  mutationId: number;
  mutationCache: MutationCache;
  options: MutationOptions<TData, TError, TVariables, TOnMutateResult>;
  state?: MutationState<TData, TError, TVariables, TOnMutateResult>;
}
/**
 * The raw state stored on a `Mutation` instance. This is the underlying state
 * that observer results (e.g. `MutationObserverResult`) are derived from.
 */
interface MutationState<TData = unknown, TError = DefaultError, TVariables = unknown, TOnMutateResult = unknown> {
  /**
   * The value returned by `onMutate`, if defined. Passed to `onSuccess`,
   * `onError` and `onSettled` as the mutation's context.
   */
  context: TOnMutateResult | undefined;
  /**
   * The last successfully resolved data for the mutation.
   */
  data: TData | undefined;
  /**
   * The error object for the mutation, if the last attempt resulted in an error.
   * - Defaults to `null`.
   */
  error: TError | null;
  /**
   * The number of times the mutation function has failed for the current attempt.
   */
  failureCount: number;
  /**
   * The reason the current attempt failed, as reported by the retryer.
   */
  failureReason: TError | null;
  /**
   * Whether the mutation is currently paused (see network mode), or is
   * waiting for another mutation with the same `scope` to finish.
   */
  isPaused: boolean;
  /**
   * The status of the mutation.
   */
  status: MutationStatus;
  /**
   * The variables the mutation was last called with.
   */
  variables: TVariables | undefined;
  /**
   * The timestamp for when the mutation was submitted.
   */
  submittedAt: number;
}
interface FailedAction<TError> {
  type: 'failed';
  failureCount: number;
  error: TError | null;
}
interface PendingAction<TVariables, TOnMutateResult> {
  type: 'pending';
  isPaused: boolean;
  variables?: TVariables;
  context?: TOnMutateResult;
}
interface SuccessAction<TData> {
  type: 'success';
  data: TData;
}
interface ErrorAction<TError> {
  type: 'error';
  error: TError;
}
interface PauseAction {
  type: 'pause';
}
interface ContinueAction {
  type: 'continue';
}
type Action<TData, TError, TVariables, TOnMutateResult> = ContinueAction | ErrorAction<TError> | FailedAction<TError> | PendingAction<TVariables, TOnMutateResult> | PauseAction | SuccessAction<TData>;
/**
 * Represents a single mutation attempt. A `Mutation` holds the mutation's
 * options, state (data/error/status), and the `MutationObserver`s currently
 * subscribed to it.
 *
 * Instances are created and managed internally by `MutationCache`; application
 * code typically interacts with mutations indirectly through `QueryClient` or
 * a framework hook like `useMutation`. Direct access to a `Mutation` instance
 * is possible via `mutationCache.find()`/`getAll()` for inspecting cache state.
 *
 * @example
 * ```ts
 * const mutationCache = queryClient.getMutationCache()
 *
 * const mutation = mutationCache.find({ mutationKey: ['addPost'] })
 * ```
 */
declare class Mutation<TData = unknown, TError = DefaultError, TVariables = unknown, TOnMutateResult = unknown> extends Removable {
  #private;
  state: MutationState<TData, TError, TVariables, TOnMutateResult>;
  options: MutationOptions<TData, TError, TVariables, TOnMutateResult>;
  readonly mutationId: number;
  constructor(config: MutationConfig<TData, TError, TVariables, TOnMutateResult>);
  /** @internal */
  setOptions(options: MutationOptions<TData, TError, TVariables, TOnMutateResult>): void;
  /**
   * The `meta` object passed in the mutation's options, if any.
   */
  get meta(): MutationMeta | undefined;
  /** @internal */
  addObserver(observer: MutationObserver<any, any, any, any>): void;
  /** @internal */
  removeObserver(observer: MutationObserver<any, any, any, any>): void;
  protected optionalRemove(): void;
  /**
   * Resumes a mutation that is currently paused or was restored from a
   * dehydrated, still-`pending` state.
   *
   * - If this mutation has an active retryer (it paused mid-attempt, e.g. due
   *   to the network mode or scope-based queuing), its retryer is resumed.
   * - Otherwise, if the mutation's status is still `pending` (e.g. it was
   *   dehydrated while an attempt was in flight and never got a retryer in
   *   this instance), `execute` is called again with the last known variables.
   * - Otherwise the mutation has already settled and this resolves immediately
   *   without running anything again.
   *
   * @example
   * ```ts
   * // typically driven by reconnect handling, e.g. queryClient.resumePausedMutations()
   * const mutation = mutationCache.find({ mutationKey: ['addPost'] })
   * await mutation?.continue()
   * ```
   *
   * @see {@link Mutation#execute}
   */
  continue(): Promise<unknown>;
  /**
   * Runs the mutation function for the given variables through a retryer, and
   * drives the mutation's state and lifecycle callbacks through to settlement.
   *
   * If this mutation's state is already `pending` when `execute` is called
   * (i.e. it was restored, still in-flight, from a dehydrated state), the
   * `onMutate` step is skipped and a `continue` action is dispatched to
   * unpause it; otherwise a `pending` action is dispatched first, then the
   * mutation cache's `onMutate` and the mutation's own `onMutate` option are
   * awaited in that order, and the resulting context is stored.
   *
   * The mutation function is then run (subject to `retry`/`retryDelay`/
   * `networkMode`, and to the mutation cache's scope-based serialization).
   * On success, the cache's `onSuccess`/`onSettled` callbacks run before the
   * mutation's own `onSuccess`/`onSettled` options, a `success` action is
   * dispatched, and the resolved data is returned. On failure, the same
   * cache-then-option ordering is used for `onError`/`onSettled`, but each of
   * those four callbacks is individually caught so that a throwing callback
   * cannot mask the original error; an `error` action is then dispatched and
   * the original error is re-thrown.
   *
   * @example
   * ```ts
   * // Called internally by `MutationObserver.mutate` and `Mutation.continue` —
   * // applications normally trigger mutations through those, not this method.
   * const data = await mutation.execute(variables)
   * ```
   *
   * @see {@link Mutation#continue}
   */
  execute(variables: TVariables): Promise<TData>;
}
declare function getDefaultState<TData, TError, TVariables, TOnMutateResult>(): MutationState<TData, TError, TVariables, TOnMutateResult>;
//#endregion
//#region src/utils.d.ts
type DropLast<T extends ReadonlyArray<unknown>> = T extends readonly [...infer R, unknown] ? readonly [...R] : never;
type TuplePrefixes<T extends ReadonlyArray<unknown>> = T extends readonly [] ? readonly [] : TuplePrefixes<DropLast<T>> | T;
/**
 * Filters used to select queries, for example in `queryClient.getQueriesData` or `queryClient.invalidateQueries`.
 * All provided filters must match; filters that are left unspecified are ignored.
 */
interface QueryFilters<TQueryKey extends QueryKey = QueryKey> {
  /**
   * Filter to active queries, inactive queries or all queries
   *
   * Defaults to `'all'`.
   */
  type?: QueryTypeFilter;
  /**
   * Match query key exactly
   */
  exact?: boolean;
  /**
   * Include queries matching this predicate function
   */
  predicate?: (query: Query) => boolean;
  /**
   * Include queries matching this query key
   */
  queryKey?: TQueryKey | TuplePrefixes<TQueryKey>;
  /**
   * Include or exclude stale queries
   */
  stale?: boolean;
  /**
   * Include queries matching their fetchStatus
   */
  fetchStatus?: FetchStatus;
}
/**
 * Filters used to select mutations, for example in `mutationCache.findAll` or `queryClient.isMutating`.
 * All provided filters must match; filters that are left unspecified are ignored.
 */
interface MutationFilters<TData = unknown, TError = DefaultError, TVariables = unknown, TOnMutateResult = unknown> {
  /**
   * Match mutation key exactly
   */
  exact?: boolean;
  /**
   * Include mutations matching this predicate function
   */
  predicate?: (mutation: Mutation<TData, TError, TVariables, TOnMutateResult>) => boolean;
  /**
   * Include mutations matching this mutation key
   */
  mutationKey?: TuplePrefixes<MutationKey>;
  /**
   * Filter by mutation status
   */
  status?: MutationStatus;
}
/**
 * Either a plain value of type `TOutput`, or a function that receives `TInput` and returns `TOutput`.
 * Used for example by `setQueryData`-style updaters, which accept either the new data directly or a
 * function that computes it from the previous data. See {@link functionalUpdate}.
 *
 * @example
 * ```ts
 * queryClient.setQueryData(['posts'], newPosts)
 *
 * // Or, using an updater function that receives the current data:
 * queryClient.setQueryData(['posts'], (oldPosts) =>
 *   oldPosts ? [...oldPosts, newPost] : oldPosts,
 * )
 * ```
 */
type Updater<TInput, TOutput> = TOutput | ((input: TInput) => TOutput);
type QueryTypeFilter = 'all' | 'active' | 'inactive';
/** @deprecated
 * use `environmentManager.isServer()` instead.
 */
declare const isServer: boolean;
/**
 * A function that does nothing.
 */
declare function noop(): void;
declare function noop(): undefined;
declare function functionalUpdate<TInput, TOutput>(updater: Updater<TInput, TOutput>, input: TInput): TOutput;
declare function isValidTimeout(value: unknown): value is number;
declare function timeUntilStale(updatedAt: number, staleTime?: number): number;
declare function resolveQueryValue<TValue, TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(value: undefined | TValue | ((query: Query<TQueryFnData, TError, TData, TQueryKey>) => TValue), query: Query<TQueryFnData, TError, TData, TQueryKey>): TValue | undefined;
/**
 * Checks whether a query matches the given {@link QueryFilters}.
 * Every filter that is specified must match; filters that are left unspecified are ignored.
 *
 * @example
 * ```ts
 * const queryCache = queryClient.getQueryCache()
 *
 * const matchingQueries = queryCache
 *   .getAll()
 *   .filter((query) => matchQuery({ queryKey: ['posts'] }, query))
 * ```
 */
declare function matchQuery(filters: QueryFilters, query: Query<any, any, any, any>): boolean;
/**
 * Checks whether a mutation matches the given {@link MutationFilters}.
 * Every filter that is specified must match; filters that are left unspecified are ignored.
 * If a `mutationKey` filter is provided but the mutation has no `mutationKey` of its own, it does not match.
 *
 * @example
 * ```ts
 * const mutationCache = queryClient.getMutationCache()
 *
 * const matchingMutations = mutationCache
 *   .getAll()
 *   .filter((mutation) => matchMutation({ mutationKey: ['addPost'] }, mutation))
 * ```
 */
declare function matchMutation(filters: MutationFilters, mutation: Mutation<any, any>): boolean;
declare function hashQueryKeyByOptions<TQueryKey extends QueryKey = QueryKey>(queryKey: TQueryKey, options?: Pick<QueryOptions<any, any, any, any>, 'queryKeyHashFn'>): string;
/**
 * Default query & mutation keys hash function.
 * Hashes the value into a stable hash.
 *
 * @example
 * ```ts
 * // Object keys are sorted, so key order doesn't affect the hash:
 * hashKey(['todos', { page: 1, filter: 'done' }]) // === '["todos",{"filter":"done","page":1}]'
 * ```
 */
declare function hashKey(queryKey: QueryKey | MutationKey): string;
/**
 * Checks if key `b` partially matches with key `a`.
 */
declare function partialMatchKey(a: QueryKey, b: QueryKey): boolean;
/**
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between JSON values for example.
 */
declare function replaceEqualDeep<T>(a: unknown, b: T, depth?: number): T;
/**
 * Shallow compare objects.
 */
declare function shallowEqualObjects<T extends Record<string, any>>(a: T, b: T | undefined): boolean;
declare function isPlainArray(value: unknown): value is Array<unknown>;
declare function isPlainObject(o: any): o is Record<PropertyKey, unknown>;
declare function sleep(timeout: number): Promise<void>;
declare function replaceData<TData, TOptions extends QueryOptions<any, any, any, any>>(prevData: TData | undefined, data: TData, options: TOptions): TData;
/**
 * Intended to be passed as a query's `placeholderData` option, for example
 * `placeholderData: keepPreviousData`. Instead of resetting the query's data to `undefined` while a new
 * query key is fetching, it keeps displaying the previously fetched data until the new data arrives.
 *
 * @example
 * ```ts
 * new QueryObserver(queryClient, {
 *   queryKey: ['posts', page],
 *   queryFn: () => fetchPosts(page),
 *   placeholderData: keepPreviousData,
 * })
 * ```
 */
declare function keepPreviousData<T>(previousData: T | undefined): T | undefined;
declare function addToEnd<T>(items: Array<T>, item: T, max?: number): Array<T>;
declare function addToStart<T>(items: Array<T>, item: T, max?: number): Array<T>;
/**
 * Sentinel value that can be passed as a query's `queryFn` to conditionally disable the query (equivalent
 * to `enabled: false`) while preserving full type inference for the query's data. Unlike `enabled: false`,
 * a query disabled via `skipToken` cannot be triggered with `refetch`.
 *
 * @example
 * ```ts
 * new QueryObserver(queryClient, {
 *   queryKey: ['post', postId],
 *   queryFn: postId != null ? () => fetchPost(postId) : skipToken,
 * })
 * ```
 */
declare const skipToken: unique symbol;
/**
 * The type of the {@link skipToken} sentinel value.
 */
type SkipToken = typeof skipToken;
declare function ensureQueryFn<TQueryFnData = unknown, TQueryKey extends QueryKey = QueryKey>(options: {
  queryFn?: QueryFunction<TQueryFnData, TQueryKey> | SkipToken;
  queryHash?: string;
}, fetchOptions?: FetchOptions<TQueryFnData>): QueryFunction<TQueryFnData, TQueryKey>;
/**
 * Resolves a `throwOnError` option to a boolean.
 * If `throwOnError` is a function, it is called with `params` (e.g. the error and, depending on the caller,
 * additional context such as the query or mutation) and its result is returned, allowing the throwing
 * behavior to be decided per error. Otherwise, `throwOnError` itself is coerced to a boolean (`undefined`
 * resolves to `false`).
 *
 * @example
 * ```ts
 * const throwOnError =
 *   query.state.error && typeof options.throwOnError === 'function'
 *     ? shouldThrowError(options.throwOnError, [query.state.error, query])
 *     : options.throwOnError
 * ```
 */
declare function shouldThrowError<T extends (...args: Array<any>) => boolean>(throwOnError: boolean | T | undefined, params: Parameters<T>): boolean;
declare function addConsumeAwareSignal<T>(object: T, getSignal: () => AbortSignal, onCancelled: VoidFunction): T & {
  signal: AbortSignal;
};
//#endregion
//#region src/queryCache.d.ts
/**
 * Global callbacks that fire for every query handled by a `QueryCache`, regardless of which
 * component or observer triggered it. Unlike `QueryClient`'s `defaultOptions`, which a query can
 * override, these callbacks are always called. Unlike `MutationCacheConfig`'s callbacks, these
 * are fire-and-forget: their return value is not awaited before the query settles.
 */
interface QueryCacheConfig {
  /** Called when any query in the cache encounters an error. */
  onError?: (error: DefaultError, query: Query<unknown, unknown, unknown>) => void;
  /** Called when any query in the cache is successful. */
  onSuccess?: (data: unknown, query: Query<unknown, unknown, unknown>) => void;
  /** Called when any query in the cache is settled, either successfully or with an error. */
  onSettled?: (data: unknown | undefined, error: DefaultError | null, query: Query<unknown, unknown, unknown>) => void;
}
interface NotifyEventQueryAdded extends NotifyEvent {
  type: 'added';
  query: Query<any, any, any, any>;
}
interface NotifyEventQueryRemoved extends NotifyEvent {
  type: 'removed';
  query: Query<any, any, any, any>;
}
interface NotifyEventQueryUpdated extends NotifyEvent {
  type: 'updated';
  query: Query<any, any, any, any>;
  action: Action$1<any, any>;
}
interface NotifyEventQueryObserverAdded extends NotifyEvent {
  type: 'observerAdded';
  query: Query<any, any, any, any>;
  observer: QueryObserver<any, any, any, any, any>;
}
interface NotifyEventQueryObserverRemoved extends NotifyEvent {
  type: 'observerRemoved';
  query: Query<any, any, any, any>;
  observer: QueryObserver<any, any, any, any, any>;
}
interface NotifyEventQueryObserverResultsUpdated extends NotifyEvent {
  type: 'observerResultsUpdated';
  query: Query<any, any, any, any>;
}
interface NotifyEventQueryObserverOptionsUpdated extends NotifyEvent {
  type: 'observerOptionsUpdated';
  query: Query<any, any, any, any>;
  observer: QueryObserver<any, any, any, any, any>;
}
/**
 * The event passed to a `QueryCache` subscriber. Fired whenever a query is added or removed from
 * the cache, its state is updated (e.g. via `query.setState` or `queryClient.removeQueries`), or
 * one of its observers is added, removed, or has its results or options updated.
 */
type QueryCacheNotifyEvent = NotifyEventQueryAdded | NotifyEventQueryRemoved | NotifyEventQueryUpdated | NotifyEventQueryObserverAdded | NotifyEventQueryObserverRemoved | NotifyEventQueryObserverResultsUpdated | NotifyEventQueryObserverOptionsUpdated;
type QueryCacheListener = (event: QueryCacheNotifyEvent) => void;
interface QueryStore {
  has: (queryHash: string) => boolean;
  set: (queryHash: string, query: Query) => void;
  get: (queryHash: string) => Query | undefined;
  delete: (queryHash: string) => void;
  values: () => IterableIterator<Query>;
}
/**
 * The `QueryCache` is the storage mechanism for TanStack Query. It stores all the data, meta
 * information, and state of the queries it contains.
 *
 * Normally, you will not interact with the `QueryCache` directly and instead use a `QueryClient`
 * for a specific cache. You can subscribe to it (inherited from `Subscribable`) to be informed of
 * safe/known updates to the cache, such as queries being added, removed, or updated — updates made
 * outside of the cache's own tracked mechanisms (e.g. mutating a query's state object directly) do
 * not notify subscribers.
 *
 * @example
 * ```ts
 * const unsubscribe = queryCache.subscribe((event) => {
 *   console.log(event.type, event.query)
 * })
 * ```
 */
declare class QueryCache extends Subscribable<QueryCacheListener> {
  #private;
  config: QueryCacheConfig;
  constructor(config?: QueryCacheConfig);
  /**
   * Returns the existing `Query` instance for the given options' `queryKey`/`queryHash`, or
   * builds and adds a new one to the cache if none exists yet. Used by framework adapters and
   * plugins (e.g. broadcast/persistence) that need to get-or-create a `Query` directly, bypassing
   * the reactive `QueryObserver` machinery.
   *
   * @example
   * ```ts
   * const queryCache = queryClient.getQueryCache()
   *
   * const query = queryCache.build(queryClient, {
   *   queryKey: ['posts'],
   *   queryFn: fetchPosts,
   * })
   * ```
   */
  build<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(client: QueryClient, options: WithRequired<QueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>, state?: QueryState<TData, TError>): Query<TQueryFnData, TError, TData, TQueryKey>;
  /** @internal */
  add(query: Query<any, any, any, any>): void;
  /**
   * Destroys the given `Query` and removes it from the cache, notifying subscribers with a
   * `'removed'` event. A no-op if the query is no longer the one currently stored under its hash
   * (e.g. it was already replaced). Used by plugins (e.g. the broadcast client) that mirror
   * removals across `QueryCache` instances.
   *
   * @example
   * ```ts
   * const queryCache = queryClient.getQueryCache()
   * const query = queryCache.find({ queryKey: ['posts'] })
   *
   * if (query) {
   *   queryCache.remove(query)
   * }
   * ```
   */
  remove(query: Query<any, any, any, any>): void;
  /**
   * Removes all queries from the cache.
   *
   * @example
   * ```ts
   * const queryCache = queryClient.getQueryCache()
   *
   * queryCache.clear()
   * ```
   */
  clear(): void;
  /**
   * Returns the `Query` instance stored under the given `queryHash`, or `undefined` if none
   * exists. Unlike {@link QueryCache#find}, this looks up by the already-computed hash rather
   * than by `QueryFilters`. Used by plugins (e.g. broadcast/hydration) that already have a hash
   * to look up directly.
   *
   * @example
   * ```ts
   * const queryCache = queryClient.getQueryCache()
   * const queryHash = hashKey(['posts'])
   *
   * const query = queryCache.get(queryHash)
   * ```
   */
  get<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(queryHash: string): Query<TQueryFnData, TError, TData, TQueryKey> | undefined;
  /**
   * Returns all queries within the cache.
   *
   * @example
   * ```ts
   * const queryCache = queryClient.getQueryCache()
   *
   * const queries = queryCache.getAll()
   * ```
   */
  getAll(): Array<Query>;
  /**
   * A slightly more advanced method that can be used to get an existing query instance from the
   * cache. This instance not only contains all the state for the query, but all of the instances,
   * and underlying guts of the query as well. If the query does not exist, `undefined` is
   * returned.
   *
   * This is not typically needed for most applications, but can come in handy when needing more
   * information about a query in rare scenarios (e.g. looking at `query.state.dataUpdatedAt` to
   * decide whether a query is fresh enough to be used as an initial value).
   *
   * @see {@link QueryCache#findAll}
   * @example
   * ```ts
   * const queryCache = queryClient.getQueryCache()
   *
   * const query = queryCache.find({ queryKey: ['posts'] })
   * ```
   */
  find<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData>(filters: WithRequired<QueryFilters, 'queryKey'>): Query<TQueryFnData, TError, TData> | undefined;
  /**
   * An even more advanced method that can be used to get existing query instances from the cache
   * that partially match a query key. If no queries match, an empty array is returned.
   *
   * This is not typically needed for most applications, but can come in handy when needing more
   * information about queries in rare scenarios.
   *
   * @see {@link QueryCache#find}
   * @example
   * ```ts
   * const queryCache = queryClient.getQueryCache()
   *
   * const queries = queryCache.findAll({ queryKey: ['posts'] })
   * ```
   */
  findAll(filters?: QueryFilters<any>): Array<Query>;
  /** @internal */
  notify(event: QueryCacheNotifyEvent): void;
  /** @internal */
  onFocus(): void;
  /** @internal */
  onOnline(): void;
}
//#endregion
//#region src/queryClient.d.ts
/**
 * `QueryClient` is used to interact with a cache of queries and mutations. It owns a
 * `QueryCache` and a `MutationCache` (creating default ones if none are passed in) and holds
 * the default options that are applied to queries and mutations created through it.
 *
 * @example
 * ```ts
 * const queryClient = new QueryClient({
 *   defaultOptions: {
 *     queries: {
 *       staleTime: Infinity,
 *     },
 *   },
 * })
 *
 * await queryClient.query({ queryKey: ['posts'], queryFn: fetchPosts })
 * ```
 */
declare class QueryClient {
  #private;
  constructor(config?: QueryClientConfig);
  /**
   * Called by a framework adapter's `QueryClientProvider`-equivalent when it mounts, to start
   * listening for focus/online events and resume paused mutations. Ref-counted via an internal
   * mount count, so nested or multiple providers sharing the same `QueryClient` don't tear down
   * the shared listeners until the last one unmounts.
   */
  mount(): void;
  /**
   * The inverse of {@link QueryClient#mount} — called by a framework adapter's
   * `QueryClientProvider`-equivalent when it unmounts. Only tears down the focus/online
   * listeners once the mount count returns to `0`.
   */
  unmount(): void;
  /**
   * Returns the number of queries in the cache that are currently fetching, optionally
   * matching a set of filters. This includes background-fetching, loading new pages, and
   * loading more infinite query results.
   *
   * @example
   * ```ts
   * if (queryClient.isFetching()) {
   *   console.log('At least one query is fetching!')
   * }
   * ```
   */
  isFetching<TQueryFilters extends QueryFilters<any> = QueryFilters>(filters?: TQueryFilters): number;
  /**
   * Returns the number of mutations in the cache that are currently pending, optionally
   * matching a set of filters.
   *
   * @example
   * ```ts
   * if (queryClient.isMutating()) {
   *   console.log('At least one mutation is pending!')
   * }
   * ```
   */
  isMutating<TMutationFilters extends MutationFilters<any, any> = MutationFilters>(filters?: TMutationFilters): number;
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   *
   * @see {@link QueryClient#getQueriesData}
   */
  getQueryData<TQueryFnData = unknown, TTaggedQueryKey extends QueryKey = QueryKey, TInferredQueryFnData = InferDataFromTag<TQueryFnData, TTaggedQueryKey>>(queryKey: TTaggedQueryKey): TInferredQueryFnData | undefined;
  /**
   * @deprecated Use queryClient.query({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
   */
  ensureQueryData<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: EnsureQueryDataOptions<TQueryFnData, TError, TData, TQueryKey>): Promise<TData>;
  /**
   * Imperative (non-reactive) way to retrieve the cached data of multiple queries at once.
   * Only queries matching the given filters are returned; if none match, an empty array is
   * returned.
   *
   * Because the matched queries can hold data of different shapes (e.g. a broad filter can match
   * queries with unrelated data types), the `TQueryFnData` generic defaults to `unknown` rather
   * than being inferred. Passing a more specific type is a convenience for call sites that know
   * every matched query holds the same shape — it is not checked against the actual cache
   * contents.
   *
   * @see {@link QueryClient#getQueryData}
   * @example
   * ```ts
   * const data = queryClient.getQueriesData({ queryKey: ['posts'] })
   * ```
   */
  getQueriesData<TQueryFnData = unknown, TQueryFilters extends QueryFilters<any> = QueryFilters>(filters: TQueryFilters): Array<[QueryKey, TQueryFnData | undefined]>;
  /**
   * Synchronous way to immediately update a query's cached data. If the updater (or the value
   * passed) resolves to `undefined`, the cache is left untouched and no query is created;
   * otherwise, if the query does not exist yet, it will be created. To update multiple queries
   * at once by partially matching query keys, use {@link QueryClient#setQueriesData} instead.
   *
   * Updates must be performed immutably: do not mutate `oldData`, or data previously retrieved
   * via {@link QueryClient#getQueryData}, in place.
   *
   * @param queryKey - The query key to set data for.
   * @param updater - Either the new data, or a function that receives the current data (which
   * may be `undefined`) and returns the new data.
   *
   * @example
   * ```ts
   * queryClient.setQueryData(['posts'], newPosts)
   *
   * // Or, using an updater function that receives the current data:
   * queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost])
   * ```
   */
  setQueryData<TQueryFnData = unknown, TTaggedQueryKey extends QueryKey = QueryKey, TInferredQueryFnData = InferDataFromTag<TQueryFnData, TTaggedQueryKey>>(queryKey: TTaggedQueryKey, updater: Updater<NoInfer<TInferredQueryFnData> | undefined, NoInfer<TInferredQueryFnData> | undefined>, options?: SetDataOptions): NoInfer<TInferredQueryFnData> | undefined;
  /**
   * Synchronous way to immediately update the cached data of multiple queries at once, using
   * filters or partial query key matching. Only queries that already exist and match the given
   * filters are updated; no new cache entries are created. Internally this calls
   * {@link QueryClient#setQueryData} for each matching query.
   *
   * @example
   * ```ts
   * queryClient.setQueriesData({ queryKey: ['posts'] }, (oldPosts) =>
   *   oldPosts ? oldPosts.filter((post) => post.id !== deletedId) : oldPosts,
   * )
   * ```
   */
  setQueriesData<TQueryFnData, TQueryFilters extends QueryFilters<any> = QueryFilters>(filters: TQueryFilters, updater: Updater<NoInfer<TQueryFnData> | undefined, NoInfer<TQueryFnData> | undefined>, options?: SetDataOptions): Array<[QueryKey, TQueryFnData | undefined]>;
  /**
   * Imperative (non-reactive) way to retrieve an existing query's state. If the query does not
   * exist, `undefined` is returned.
   *
   * @example
   * ```ts
   * const state = queryClient.getQueryState(['posts'])
   * console.log(state?.dataUpdatedAt)
   * ```
   */
  getQueryState<TQueryFnData = unknown, TError = DefaultError, TTaggedQueryKey extends QueryKey = QueryKey, TInferredQueryFnData = InferDataFromTag<TQueryFnData, TTaggedQueryKey>, TInferredError = InferErrorFromTag<TError, TTaggedQueryKey>>(queryKey: TTaggedQueryKey): QueryState<TInferredQueryFnData, TInferredError> | undefined;
  /**
   * Removes queries from the cache that match the given filters. Unlike
   * {@link QueryClient#invalidateQueries} or {@link QueryClient#refetchQueries}, this removes
   * matching queries from the cache instead of refetching them. Without filters, every query in
   * the cache is removed.
   *
   * @example
   * ```ts
   * queryClient.removeQueries({ queryKey: ['posts'], exact: true })
   * ```
   */
  removeQueries<TTaggedQueryKey extends QueryKey = QueryKey>(filters?: QueryFilters<TTaggedQueryKey>): void;
  /**
   * Resets queries matching the given filters back to their initial state (e.g. any
   * `initialData`), notifying subscribers rather than removing them. Active queries among the
   * matched set are then refetched, and the returned promise resolves once that refetch settles.
   *
   * @example
   * ```ts
   * await queryClient.resetQueries({ queryKey: ['posts'], exact: true })
   * ```
   */
  resetQueries<TTaggedQueryKey extends QueryKey = QueryKey>(filters?: QueryFilters<TTaggedQueryKey>, options?: ResetOptions): Promise<void>;
  /**
   * Cancels outgoing fetches for queries matching the given filters. Most useful when performing
   * optimistic updates, since any outgoing refetch that resolves afterwards would otherwise
   * overwrite the optimistic update. By default (`revert: true`), a cancelled query's data is
   * reverted to its state before the outgoing fetch started.
   *
   * The returned promise never rejects, even if individual cancellations fail.
   *
   * @example
   * ```ts
   * await queryClient.cancelQueries({ queryKey: ['posts'], exact: true })
   * ```
   */
  cancelQueries<TTaggedQueryKey extends QueryKey = QueryKey>(filters?: QueryFilters<TTaggedQueryKey>, cancelOptions?: CancelOptions): Promise<void>;
  /**
   * Marks queries matching the given filters as invalidated. Unlike
   * {@link QueryClient#removeQueries}, invalidated queries stay in the cache.
   *
   * Unless `filters.refetchType` is `'none'`, matching queries are then refetched via
   * {@link QueryClient#refetchQueries}, using `filters.refetchType` if set, otherwise
   * `filters.type`, otherwise `'active'`.
   *
   * @example
   * ```ts
   * await queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'active' })
   * ```
   */
  invalidateQueries<TTaggedQueryKey extends QueryKey = QueryKey>(filters?: InvalidateQueryFilters<TTaggedQueryKey>, options?: InvalidateOptions): Promise<void>;
  /**
   * Refetches queries matching the given filters, regardless of whether they are stale. Without
   * filters, every query in the cache is refetched. Queries that are disabled, or static (only
   * have observers with a static `staleTime`), are never refetched.
   *
   * By default (`cancelRefetch: true`), a currently running fetch is cancelled before the new
   * one starts. The returned promise resolves once all matching queries have settled; it does
   * not reject on individual query failures unless `throwOnError` is set.
   *
   * @example
   * ```ts
   * // refetch all active queries partially matching a query key:
   * await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
   * ```
   */
  refetchQueries<TTaggedQueryKey extends QueryKey = QueryKey>(filters?: RefetchQueryFilters<TTaggedQueryKey>, options?: RefetchOptions): Promise<void>;
  /**
   * Asynchronous method to fetch and cache a query, resolving with the data or throwing with
   * the error.
   *
   * If the query already exists in the cache and its data is not stale (per the given
   * `staleTime`), the cached data is returned without fetching. Otherwise, the query is fetched
   * and the promise resolves once the fetch settles. If a `select` function is provided, it is
   * applied to the data in both cases (cached or freshly fetched) before it is returned.
   *
   * Unlike a reactive observer, retries are disabled by default here (`retry: false`) unless
   * explicitly configured, since there is no component to catch a thrown error and retry through
   * re-render.
   *
   * The accepted options are `QueryObserverOptions` minus the fields that only make sense for a
   * reactive observer — `enabled`, `refetchInterval`, `refetchIntervalInBackground`,
   * `refetchOnWindowFocus`, `refetchOnReconnect`, `refetchOnMount`, `retryOnMount`,
   * `notifyOnChangeProps`, `throwOnError`, `suspense`, and `placeholderData` are not part of this
   * method's options.
   *
   * This method replaces the deprecated `fetchQuery`, and — combined with
   * `{ staleTime: 'static' }` — the deprecated `ensureQueryData`.
   *
   * @example
   * ```ts
   * try {
   *   const data = await queryClient.query({ queryKey, queryFn, staleTime: 10000 })
   * } catch (error) {
   *   console.log(error)
   * }
   * ```
   */
  query<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = never>(options: QueryExecuteOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>): Promise<TData>;
  /**
   * @deprecated Use queryClient.query(options) instead. This method will be removed in the next major version.
   */
  fetchQuery<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = never>(options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<TData>;
  /**
   * @deprecated Use queryClient.query(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
   */
  prefetchQuery<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>): Promise<void>;
  /**
   * Asynchronous method to fetch and cache an infinite query, resolving with an
   * {@link InfiniteData} object or throwing with the error.
   *
   * Behaves like {@link QueryClient#query}, accepting the same options (minus
   * `initialPageParam`), plus the required `initialPageParam`, and an optional `pages` /
   * `getNextPageParam` pair used to refetch a fixed number of pages from the start.
   *
   * This method replaces the deprecated `fetchInfiniteQuery`, and — combined with
   * `{ staleTime: 'static' }` — the deprecated `ensureInfiniteQueryData`.
   *
   * @example
   * ```ts
   * try {
   *   const data = await queryClient.infiniteQuery({ queryKey, queryFn, initialPageParam: 0 })
   *   console.log(data.pages)
   * } catch (error) {
   *   console.log(error)
   * }
   * ```
   */
  infiniteQuery<TQueryFnData, TError = DefaultError, TData = InfiniteData<TQueryFnData>, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown>(options: InfiniteQueryExecuteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<Array<TData> extends Array<InfiniteData<TQueryFnData>> ? InfiniteData<TQueryFnData, TPageParam> : TData>;
  /**
   * @deprecated Use queryClient.infiniteQuery(options) instead. This method will be removed in the next major version.
   */
  fetchInfiniteQuery<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown>(options: FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<InfiniteData<TData, TPageParam>>;
  /**
   * @deprecated Use queryClient.infiniteQuery(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
   */
  prefetchInfiniteQuery<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown>(options: FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<void>;
  /**
   * @deprecated Use queryClient.infiniteQuery({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
   */
  ensureInfiniteQueryData<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown>(options: EnsureInfiniteQueryDataOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>): Promise<InfiniteData<TData, TPageParam>>;
  /**
   * Resumes mutations that were paused because there was no network connection. Does nothing
   * (resolving immediately) if the client is currently offline.
   *
   * @example
   * ```ts
   * import { QueryClient } from '@tanstack/query-core'
   *
   * const queryClient = new QueryClient()
   * await queryClient.resumePausedMutations()
   * ```
   */
  resumePausedMutations(): Promise<unknown>;
  /**
   * Returns the query cache this client is connected to.
   *
   * @example
   * ```ts
   * import { QueryClient } from '@tanstack/query-core'
   *
   * const queryClient = new QueryClient()
   * const queryCache = queryClient.getQueryCache()
   * const queries = queryCache.findAll({ queryKey: ['posts'] })
   * ```
   */
  getQueryCache(): QueryCache;
  /**
   * Returns the mutation cache this client is connected to.
   *
   * @example
   * ```ts
   * import { QueryClient } from '@tanstack/query-core'
   *
   * const queryClient = new QueryClient()
   * const mutationCache = queryClient.getMutationCache()
   * const mutations = mutationCache.findAll({ status: 'pending' })
   * ```
   */
  getMutationCache(): MutationCache;
  /**
   * Returns the default options that were set when creating the client, or via
   * {@link QueryClient#setDefaultOptions}.
   *
   * @example
   * ```ts
   * import { QueryClient } from '@tanstack/query-core'
   *
   * const queryClient = new QueryClient()
   * const defaultOptions = queryClient.getDefaultOptions()
   * ```
   */
  getDefaultOptions(): DefaultOptions;
  /**
   * Dynamically sets the default options for this client, overwriting any previously defined
   * default options.
   *
   * @see {@link QueryClient#getDefaultOptions}
   * @example
   * ```ts
   * import { QueryClient } from '@tanstack/query-core'
   *
   * const queryClient = new QueryClient()
   * queryClient.setDefaultOptions({
   *   queries: {
   *     staleTime: Infinity,
   *   },
   * })
   * ```
   */
  setDefaultOptions(options: DefaultOptions): void;
  /**
   * Sets default options for queries whose query key partially matches the given `queryKey`.
   *
   * If several registered query defaults match a given query key, they are merged together in
   * registration order by {@link QueryClient#getQueryDefaults}, so register defaults from the
   * most generic key to the least generic one — more specific defaults should be registered
   * after more generic ones so they take precedence.
   *
   * @example
   * ```ts
   * queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })
   *
   * await queryClient.query({ queryKey: ['posts'] })
   * ```
   */
  setQueryDefaults<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryData = TQueryFnData>(queryKey: QueryKey, options: Partial<OmitKeyof<QueryObserverOptions<TQueryFnData, TError, TData, TQueryData>, 'queryKey'>>): void;
  /**
   * Returns the default options registered for queries whose query key partially matches the
   * given `queryKey`, via {@link QueryClient#setQueryDefaults}. If multiple registered defaults
   * match, they are merged together in registration order.
   *
   * @example
   * ```ts
   * const defaultOptions = queryClient.getQueryDefaults(['posts'])
   * ```
   */
  getQueryDefaults(queryKey: QueryKey): OmitKeyof<QueryObserverOptions<any, any, any, any, any>, 'queryKey'>;
  /**
   * Sets default options for mutations whose mutation key partially matches the given
   * `mutationKey`. As with {@link QueryClient#setQueryDefaults}, the order of registration
   * matters when several registered defaults match the same mutation key.
   *
   * @see {@link QueryClient#getMutationDefaults}
   * @example
   * ```ts
   * queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })
   * ```
   */
  setMutationDefaults<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown>(mutationKey: MutationKey, options: OmitKeyof<MutationObserverOptions<TData, TError, TVariables, TOnMutateResult>, 'mutationKey'>): void;
  /**
   * Returns the default options registered for mutations whose mutation key partially matches
   * the given `mutationKey`, via {@link QueryClient#setMutationDefaults}. If multiple registered
   * defaults match, they are merged together in registration order.
   *
   * @example
   * ```ts
   * const defaultOptions = queryClient.getMutationDefaults(['addPost'])
   * ```
   */
  getMutationDefaults(mutationKey: MutationKey): OmitKeyof<MutationObserverOptions<any, any, any, any>, 'mutationKey'>;
  /**
   * Called by framework adapters (e.g. inside `useQuery`) to resolve the options passed by the
   * caller into their final, defaulted form: merging `queryClient.setQueryDefaults` for the
   * given `queryKey`, then the client's own `defaultOptions.queries`, then the caller's options
   * on top. A no-op if the options are already defaulted (`_defaulted: true`).
   */
  defaultQueryOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = never>(options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam> | DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>): DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
  /**
   * The mutation counterpart of {@link QueryClient#defaultQueryOptions}. Called by framework
   * adapters (e.g. inside `useMutation`) to merge `queryClient.setMutationDefaults` for the
   * given `mutationKey`, then the client's `defaultOptions.mutations`, then the caller's options
   * on top. A no-op if the options are already defaulted (`_defaulted: true`).
   */
  defaultMutationOptions<T extends MutationOptions<any, any, any, any>>(options?: T): T;
  /**
   * Clears both the query cache and the mutation cache this client is connected to.
   *
   * @example
   * ```ts
   * import { QueryClient } from '@tanstack/query-core'
   *
   * const queryClient = new QueryClient()
   * queryClient.clear()
   * ```
   */
  clear(): void;
}
//#endregion
//#region src/retryer.d.ts
interface RetryerConfig<TData = unknown, TError = DefaultError> {
  fn: () => TData | Promise<TData>;
  initialPromise?: Promise<TData>;
  onCancel?: (error: TError) => void;
  onFail?: (failureCount: number, error: TError) => void;
  onPause?: () => void;
  onContinue?: () => void;
  retry?: RetryValue<TError>;
  retryDelay?: RetryDelayValue<TError>;
  networkMode: NetworkMode | undefined;
  canRun: () => boolean;
}
interface Retryer<TData = unknown> {
  promise: Promise<TData>;
  cancel: (cancelOptions?: CancelOptions) => void;
  continue: () => Promise<unknown>;
  cancelRetry: () => void;
  continueRetry: () => void;
  canStart: () => boolean;
  start: () => Promise<TData>;
  status: () => 'pending' | 'resolved' | 'rejected';
}
type RetryValue<TError> = boolean | number | ShouldRetryFunction<TError>;
type ShouldRetryFunction<TError = DefaultError> = (failureCount: number, error: TError) => boolean;
type RetryDelayValue<TError> = number | RetryDelayFunction<TError>;
type RetryDelayFunction<TError = DefaultError> = (failureCount: number, error: TError) => number;
declare function canFetch(networkMode: NetworkMode | undefined): boolean;
/**
 * The error thrown by a `Retryer` (and surfaced to `query.promise`/`mutation`) when a fetch is cancelled, e.g. via
 * `query.cancel()`. `revert`, if `true`, tells the caller to restore the state the query was in before the fetch
 * started instead of surfacing the error. `silent`, if `true`, tells the caller to suppress this error and instead
 * resolve with the promise of the fetch that triggered the cancellation.
 * @example
 * ```ts
 * query.cancel()
 *
 * try {
 *   await query.promise
 * } catch (error) {
 *   if (error instanceof CancelledError) {
 *     // the fetch was cancelled, e.g. via `query.cancel()`
 *   }
 * }
 * ```
 */
declare class CancelledError extends Error {
  revert?: boolean;
  silent?: boolean;
  constructor(options?: CancelOptions);
}
/**
 * @deprecated Use instanceof `CancelledError` instead.
 */
declare function isCancelledError(value: any): value is CancelledError;
declare function createRetryer<TData = unknown, TError = DefaultError>(config: RetryerConfig<TData, TError>): Retryer<TData>;
//#endregion
//#region src/types.d.ts
type NonUndefinedGuard<T> = T extends undefined ? never : T;
type DistributiveOmit<TObject, TKey extends keyof TObject> = TObject extends any ? Omit<TObject, TKey> : never;
type OmitKeyof<TObject, TKey extends TStrictly extends 'safely' ? keyof TObject | (string & Record<never, never>) | (number & Record<never, never>) | (symbol & Record<never, never>) : keyof TObject, TStrictly extends 'strictly' | 'safely' = 'strictly'> = Omit<TObject, TKey>;
type Override<TTargetA, TTargetB> = { [AKey in keyof TTargetA]: AKey extends keyof TTargetB ? TTargetB[AKey] : TTargetA[AKey]; };
interface Register {}
type DefaultError = Register extends {
  defaultError: infer TError;
} ? TError : Error;
type QueryKey = Register extends {
  queryKey: infer TQueryKey;
} ? TQueryKey extends ReadonlyArray<unknown> ? TQueryKey : TQueryKey extends Array<unknown> ? TQueryKey : ReadonlyArray<unknown> : ReadonlyArray<unknown>;
declare const dataTagSymbol: unique symbol;
type dataTagSymbol = typeof dataTagSymbol;
declare const dataTagErrorSymbol: unique symbol;
type dataTagErrorSymbol = typeof dataTagErrorSymbol;
declare const unsetMarker: unique symbol;
type UnsetMarker = typeof unsetMarker;
type AnyDataTag = {
  [dataTagSymbol]: any;
  [dataTagErrorSymbol]: any;
};
type DataTag<TType, TValue, TError = UnsetMarker> = TType extends AnyDataTag ? TType : TType & {
  [dataTagSymbol]: TValue;
  [dataTagErrorSymbol]: TError;
};
type QueryKeyWithDataTag<TQueryKey extends QueryKey = QueryKey, TQueryFnData = unknown, TError = DefaultError> = {
  queryKey: DataTag<TQueryKey, TQueryFnData, TError>;
};
type InferDataFromTag<TQueryFnData, TTaggedQueryKey extends QueryKey> = TTaggedQueryKey extends DataTag<unknown, infer TaggedValue, unknown> ? TaggedValue : TQueryFnData;
type InferErrorFromTag<TError, TTaggedQueryKey extends QueryKey> = TTaggedQueryKey extends DataTag<unknown, unknown, infer TaggedError> ? TaggedError extends UnsetMarker ? TError : TaggedError : TError;
type QueryFunction<T = unknown, TQueryKey extends QueryKey = QueryKey, TPageParam = never> = (context: QueryFunctionContext<TQueryKey, TPageParam>) => T | Promise<T>;
type StaleTime = number | 'static';
type StaleTimeFunction<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = StaleTime | ((query: Query<TQueryFnData, TError, TData, TQueryKey>) => StaleTime);
type QueryBooleanOption<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = boolean | ((query: Query<TQueryFnData, TError, TData, TQueryKey>) => boolean);
type QueryPersister<T = unknown, TQueryKey extends QueryKey = QueryKey, TPageParam = never> = [TPageParam] extends [never] ? (queryFn: QueryFunction<T, TQueryKey, never>, context: QueryFunctionContext<TQueryKey>, query: Query) => T | Promise<T> : (queryFn: QueryFunction<T, TQueryKey, TPageParam>, context: QueryFunctionContext<TQueryKey>, query: Query) => T | Promise<T>;
type QueryFunctionContext<TQueryKey extends QueryKey = QueryKey, TPageParam = never> = [TPageParam] extends [never] ? {
  client: QueryClient;
  queryKey: TQueryKey;
  signal: AbortSignal;
  meta: QueryMeta | undefined;
  pageParam?: unknown;
  /**
   * @deprecated
   * if you want access to the direction, you can add it to the pageParam
   */
  direction?: unknown;
} : {
  client: QueryClient;
  queryKey: TQueryKey;
  signal: AbortSignal;
  pageParam: TPageParam;
  /**
   * @deprecated
   * if you want access to the direction, you can add it to the pageParam
   */
  direction: FetchDirection;
  meta: QueryMeta | undefined;
};
type InitialDataFunction<T> = () => T | undefined;
type NonFunctionGuard<T> = T extends Function ? never : T;
type PlaceholderDataFunction<TQueryFnData = unknown, TError = DefaultError, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = (previousData: TQueryData | undefined, previousQuery: Query<TQueryFnData, TError, TQueryData, TQueryKey> | undefined) => TQueryData | undefined;
type QueriesPlaceholderDataFunction<TQueryData> = (previousData: undefined, previousQuery: undefined) => TQueryData | undefined;
type QueryKeyHashFunction<TQueryKey extends QueryKey> = (queryKey: TQueryKey) => string;
type GetPreviousPageParamFunction<TPageParam, TQueryFnData = unknown> = (firstPage: TQueryFnData, allPages: Array<TQueryFnData>, firstPageParam: TPageParam, allPageParams: Array<TPageParam>) => TPageParam | undefined | null;
type GetNextPageParamFunction<TPageParam, TQueryFnData = unknown> = (lastPage: TQueryFnData, allPages: Array<TQueryFnData>, lastPageParam: TPageParam, allPageParams: Array<TPageParam>) => TPageParam | undefined | null;
interface InfiniteData<TData, TPageParam = unknown> {
  pages: Array<TData>;
  pageParams: Array<TPageParam>;
}
type QueryMeta = Register extends {
  queryMeta: infer TQueryMeta;
} ? TQueryMeta extends Record<string, unknown> ? TQueryMeta : Record<string, unknown> : Record<string, unknown>;
type NetworkMode = 'online' | 'always' | 'offlineFirst';
type NotifyOnChangeProps = Array<keyof InfiniteQueryObserverResult> | 'all' | undefined | (() => Array<keyof InfiniteQueryObserverResult> | 'all' | undefined);
interface QueryOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = never> {
  /**
   * If `false`, failed queries will not retry by default.
   * If `true`, failed queries will retry infinitely.
   * If set to an integer number, e.g. 3, failed queries will retry until the failed query count meets that number.
   * If set to a function `(failureCount, error) => boolean` failed queries will retry until the function returns false.
   *
   * Defaults to `3` on the client and `0` on the server.
   */
  retry?: RetryValue<TError>;
  /**
   * This function receives a `retryAttempt` integer and the actual Error and returns the delay to apply before the
   * next attempt in milliseconds.
   *
   * A function like `attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)` applies exponential
   * backoff.
   *
   * A function like `attempt => attempt * 1000` applies linear backoff.
   *
   * Defaults to a function that applies exponential backoff, capped at 30 seconds.
   */
  retryDelay?: RetryDelayValue<TError>;
  /**
   * Controls whether a query is allowed to run based on the current network connectivity.
   *
   * Defaults to `'online'`.
   * @see [Network Mode](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode) for more information.
   */
  networkMode?: NetworkMode;
  /**
   * The time in milliseconds that unused/inactive cache data remains in memory.
   * When a query's cache becomes unused or inactive, that cache data will be garbage collected after this duration.
   * When different garbage collection times are specified, the longest one will be used.
   * Setting it to `Infinity` will disable garbage collection.
   *
   * Defaults to `5 * 60 * 1000` (5 minutes), or `Infinity` during SSR.
   *
   * Note: the maximum allowed time is about 24 days, imposed by `setTimeout`'s 32-bit signed integer delay — see
   * `timeoutManager.setTimeoutProvider` for a workaround.
   */
  gcTime?: number;
  /**
   * The function that the query will use to request data.
   * Required, unless a default query function has been set via `queryClient.setQueryDefaults` or
   * `queryClient.setDefaultOptions`.
   * Receives a {@link QueryFunctionContext}.
   * Must return a promise that will either resolve data or throw an error. The data cannot be `undefined`.
   */
  queryFn?: QueryFunction<TQueryFnData, TQueryKey, TPageParam> | SkipToken;
  /**
   * This option can be used to persist the result of a query to an external storage, bypassing the need to actually
   * call the `queryFn`. Useful for persisting a query's data across e.g. server/client boundaries.
   */
  persister?: QueryPersister<TQueryFnData, NoInfer<TQueryKey>, TPageParam>;
  /**
   * The hashed form of `queryKey`, computed with `queryKeyHashFn` (or the default hashing function otherwise). Used
   * as the actual cache key internally.
   */
  queryHash?: string;
  /**
   * The query key to use for this query.
   *
   * The query key will be hashed into a stable hash. See [Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
   * for more information.
   *
   * The query will automatically update when this key changes (as long as `enabled` is not set to `false`).
   */
  queryKey?: TQueryKey;
  /**
   * If specified, this function is used to hash the `queryKey` to a string.
   */
  queryKeyHashFn?: QueryKeyHashFunction<TQueryKey>;
  /**
   * If set, this value will be used as the initial data for the query cache (as long as the query hasn't been
   * created or cached yet).
   * If set to a function, the function will be called **once** during the shared/root query initialization, and be
   * expected to synchronously return the initial data.
   * Initial data is considered stale by default unless a `staleTime` has been set.
   * `initialData` **is persisted** to the cache.
   */
  initialData?: TData | InitialDataFunction<TData>;
  /**
   * If set, this value will be used as the time (in milliseconds) of when the `initialData` itself was last updated.
   */
  initialDataUpdatedAt?: number | (() => number | undefined);
  /** @internal */
  behavior?: QueryBehavior<TQueryFnData, TError, TData, TQueryKey>;
  /**
   * Set this to `false` to disable structural sharing between query results.
   * Set this to a function which accepts the old and new data and returns resolved data of the same type to implement custom structural sharing logic.
   *
   * Defaults to `true`.
   */
  structuralSharing?: boolean | ((oldData: unknown | undefined, newData: unknown) => unknown);
  /** @internal */
  _defaulted?: boolean;
  /** @internal */
  _type?: 'infinite';
  /**
   * Additional payload to be stored on each query.
   * Use this property to pass information that can be used in other places.
   */
  meta?: QueryMeta;
  /**
   * Maximum number of pages to store in the data of an infinite query.
   */
  maxPages?: number;
}
interface InitialPageParam<TPageParam = unknown> {
  initialPageParam: TPageParam;
}
interface InfiniteQueryPageParamsOptions<TQueryFnData = unknown, TPageParam = unknown> extends InitialPageParam<TPageParam> {
  /**
   * This function can be set to automatically get the previous cursor for infinite queries.
   * The result will also be used to determine the value of `hasPreviousPage`.
   */
  getPreviousPageParam?: GetPreviousPageParamFunction<TPageParam, TQueryFnData>;
  /**
   * This function can be set to automatically get the next cursor for infinite queries.
   * The result will also be used to determine the value of `hasNextPage`.
   */
  getNextPageParam: GetNextPageParamFunction<TPageParam, TQueryFnData>;
}
type ThrowOnError<TQueryFnData, TError, TQueryData, TQueryKey extends QueryKey> = boolean | ((error: TError, query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean);
interface QueryObserverOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = never> extends WithRequired<QueryOptions<TQueryFnData, TError, TQueryData, TQueryKey, TPageParam>, 'queryKey'> {
  /**
   * Set this to `false` or a function that returns `false` to disable automatic refetching when the query mounts or changes query keys.
   * To refetch the query, use the `refetch` method returned from the `useQuery` instance.
   * Accepts a boolean or function that returns a boolean.
   *
   * Defaults to `true`.
   */
  enabled?: QueryBooleanOption<TQueryFnData, TError, TQueryData, TQueryKey>;
  /**
   * The time in milliseconds after data is considered stale.
   * If set to `Infinity`, the data will never be considered stale.
   * If set to `'static'`, the data will never be considered stale.
   * If set to a function, the function will be executed with the query to compute a `staleTime`.
   *
   * Defaults to `0`.
   */
  staleTime?: StaleTimeFunction<TQueryFnData, TError, TQueryData, TQueryKey>;
  /**
   * If set to a number, the query will continuously refetch at this frequency in milliseconds.
   * If set to a function, the function will be executed with the latest data and query to compute a frequency
   *
   * Defaults to `false`.
   */
  refetchInterval?: number | false | ((query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => number | false | undefined);
  /**
   * If set to `true`, the query will continue to refetch while their tab/window is in the background.
   *
   * Defaults to `false`.
   */
  refetchIntervalInBackground?: boolean;
  /**
   * If set to `true`, the query will refetch on window focus if the data is stale.
   * If set to `false`, the query will not refetch on window focus.
   * If set to `'always'`, the query will always refetch on window focus (except when `staleTime: 'static'` is used).
   * If set to a function, the function will be executed with the latest data and query to compute the value.
   *
   * Defaults to `true`.
   */
  refetchOnWindowFocus?: boolean | 'always' | ((query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean | 'always');
  /**
   * If set to `true`, the query will refetch on reconnect if the data is stale.
   * If set to `false`, the query will not refetch on reconnect.
   * If set to `'always'`, the query will always refetch on reconnect (except when `staleTime: 'static'` is used).
   * If set to a function, the function will be executed with the latest data and query to compute the value.
   *
   * Defaults to `true` unless `networkMode` is `'always'`.
   */
  refetchOnReconnect?: boolean | 'always' | ((query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean | 'always');
  /**
   * If set to `true`, the query will refetch on mount if the data is stale.
   * If set to `false`, will disable additional instances of a query to trigger background refetch.
   * If set to `'always'`, the query will always refetch on mount (except when `staleTime: 'static'` is used).
   * If set to a function, the function will be executed with the latest data and query to compute the value
   *
   * Defaults to `true`.
   */
  refetchOnMount?: boolean | 'always' | ((query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean | 'always');
  /**
   * If set to `false`, the query will not be retried on mount if it contains an error.
   * If set to a function, the function will be executed with the query to compute the value.
   *
   * Defaults to `true`.
   */
  retryOnMount?: QueryBooleanOption<TQueryFnData, TError, TQueryData, TQueryKey>;
  /**
   * If set, the component will only re-render if any of the listed properties change.
   * When set to `['data', 'error']`, the component will only re-render when the `data` or `error` properties change.
   * When set to `'all'`, the component will re-render whenever a query is updated.
   * When set to a function, the function will be executed to compute the list of properties.
   *
   * Defaults to `undefined`, in which case property access is tracked automatically, and the
   * component only re-renders when one of the tracked properties changes.
   */
  notifyOnChangeProps?: NotifyOnChangeProps;
  /**
   * Whether errors should be thrown instead of setting the `error` property.
   * If set to `true` or `suspense` is `true`, all errors will be thrown to the error boundary.
   * If set to `false` and `suspense` is `false`, errors are returned as state.
   * If set to a function, it will be passed the error and the query, and it should return a boolean indicating whether to show the error in an error boundary (`true`) or return the error as state (`false`).
   *
   * Defaults to `false`.
   */
  throwOnError?: ThrowOnError<TQueryFnData, TError, TQueryData, TQueryKey>;
  /**
   * This option can be used to transform or select a part of the data returned by the query function. It affects
   * the returned `data` value, but does not affect what gets stored in the query cache.
   * The `select` function will only run if `data` changed, or if the reference to the `select` function itself
   * changes. To optimize, memoize the function so its reference stays stable across calls.
   */
  select?: (data: TQueryData) => TData;
  /**
   * If set to `true`, the query will suspend when `status === 'pending'`
   * and throw errors when `status === 'error'`.
   *
   * Defaults to `false`.
   */
  suspense?: boolean;
  /**
   * If set, this value will be used as the placeholder data for this particular query observer while the query is still in the `loading` data and no initialData has been provided.
   */
  placeholderData?: NonFunctionGuard<TQueryData> | PlaceholderDataFunction<NonFunctionGuard<TQueryData>, TError, NonFunctionGuard<TQueryData>, TQueryKey>;
  /** @internal */
  _optimisticResults?: 'optimistic' | 'isRestoring';
}
type WithRequired<TTarget, TKey extends keyof TTarget> = TTarget & { [_ in TKey]: {}; };
type DefaultedQueryObserverOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = WithRequired<QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>, 'throwOnError' | 'refetchOnReconnect' | 'queryHash'>;
interface InfiniteQueryObserverOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown> extends QueryObserverOptions<TQueryFnData, TError, TData, InfiniteData<TQueryFnData, TPageParam>, TQueryKey, TPageParam>, InfiniteQueryPageParamsOptions<TQueryFnData, TPageParam> {}
type DefaultedInfiniteQueryObserverOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown> = WithRequired<InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, 'throwOnError' | 'refetchOnReconnect' | 'queryHash'>;
interface QueryExecuteOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = never> extends WithRequired<QueryOptions<TQueryFnData, TError, TQueryData, TQueryKey, TPageParam>, 'queryKey'> {
  initialPageParam?: never;
  select?: (data: TQueryData) => TData;
  /**
   * The time in milliseconds after data is considered stale.
   * If the data is fresh it will be returned from the cache.
   */
  staleTime?: StaleTimeFunction<TQueryFnData, TError, TQueryData, TQueryKey>;
}
/** @deprecated */
interface FetchQueryOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = never> extends WithRequired<QueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, 'queryKey'> {
  initialPageParam?: never;
  /**
   * The time in milliseconds after data is considered stale.
   * If the data is fresh it will be returned from the cache.
   */
  staleTime?: StaleTimeFunction<TQueryFnData, TError, TData, TQueryKey>;
}
/** @deprecated */
interface EnsureQueryDataOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = never> extends FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> {
  revalidateIfStale?: boolean;
}
/** @deprecated */
type EnsureInfiniteQueryDataOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown> = FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & {
  revalidateIfStale?: boolean;
};
type InfiniteQueryPages<TQueryFnData = unknown, TPageParam = unknown> = {
  pages?: never;
} | {
  pages: number;
  getNextPageParam: GetNextPageParamFunction<TPageParam, TQueryFnData>;
};
type InfiniteQueryExecuteOptions<TQueryFnData = unknown, TError = DefaultError, TData = InfiniteData<TQueryFnData>, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown> = Omit<QueryExecuteOptions<TQueryFnData, TError, TData, InfiniteData<TQueryFnData, TPageParam>, TQueryKey, TPageParam>, 'initialPageParam'> & InitialPageParam<TPageParam> & InfiniteQueryPages<TQueryFnData, TPageParam>;
/** @deprecated */
type FetchInfiniteQueryOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown> = Omit<FetchQueryOptions<TQueryFnData, TError, InfiniteData<TData, TPageParam>, TQueryKey, TPageParam>, 'initialPageParam'> & InitialPageParam<TPageParam> & InfiniteQueryPages<TQueryFnData, TPageParam>;
interface ResultOptions {
  /**
   * If set to `true`, the method throws if any of the underlying query refetch tasks fail.
   *
   * Defaults to `false`, in which case failed refetches are swallowed and not surfaced to the
   * caller.
   */
  throwOnError?: boolean;
}
interface RefetchOptions extends ResultOptions {
  /**
   * If set to `true`, a currently running request will be cancelled before a new request is made
   *
   * If set to `false`, no refetch will be made if there is already a request running.
   *
   * Defaults to `true`.
   */
  cancelRefetch?: boolean;
}
interface InvalidateQueryFilters<TQueryKey extends QueryKey = QueryKey> extends QueryFilters<TQueryKey> {
  /**
   * Controls which of the matched (now-invalidated) queries are refetched in the background.
   *
   * Defaults to `'active'`.
   * - `'active'`: only queries with at least one active observer are refetched.
   * - `'inactive'`: only queries with no active observer are refetched.
   * - `'all'`: every matched query is refetched, active or not.
   * - `'none'`: no query is refetched; matched queries are only marked as invalidated.
   */
  refetchType?: QueryTypeFilter | 'none';
}
interface RefetchQueryFilters<TQueryKey extends QueryKey = QueryKey> extends QueryFilters<TQueryKey> {}
interface InvalidateOptions extends RefetchOptions {}
interface ResetOptions extends RefetchOptions {}
interface FetchNextPageOptions extends ResultOptions {
  /**
   * If set to `true`, calling `fetchNextPage` repeatedly will invoke `queryFn` every time,
   * whether the previous invocation has resolved or not. Also, the result from previous invocations will be ignored.
   *
   * If set to `false`, calling `fetchNextPage` repeatedly won't have any effect until the first invocation has resolved.
   *
   * Defaults to `true`.
   */
  cancelRefetch?: boolean;
}
interface FetchPreviousPageOptions extends ResultOptions {
  /**
   * If set to `true`, calling `fetchPreviousPage` repeatedly will invoke `queryFn` every time,
   * whether the previous invocation has resolved or not. Also, the result from previous invocations will be ignored.
   *
   * If set to `false`, calling `fetchPreviousPage` repeatedly won't have any effect until the first invocation has resolved.
   *
   * Defaults to `true`.
   */
  cancelRefetch?: boolean;
}
type QueryStatus = 'pending' | 'error' | 'success';
type FetchStatus = 'fetching' | 'paused' | 'idle';
interface QueryObserverBaseResult<TData = unknown, TError = DefaultError> {
  /**
   * The last successfully resolved data for the query.
   */
  data: TData | undefined;
  /**
   * The timestamp for when the query most recently returned the `status` as `"success"`.
   */
  dataUpdatedAt: number;
  /**
   * The error object for the query, if an error was thrown.
   * - Defaults to `null`.
   */
  error: TError | null;
  /**
   * The timestamp for when the query most recently returned the `status` as `"error"`.
   */
  errorUpdatedAt: number;
  /**
   * The failure count for the query.
   * - Incremented every time the query fails.
   * - Reset to `0` when the query succeeds.
   */
  failureCount: number;
  /**
   * The failure reason for the query retry.
   * - Reset to `null` when the query succeeds.
   */
  failureReason: TError | null;
  /**
   * The sum of all errors.
   */
  errorUpdateCount: number;
  /**
   * A derived boolean from the `status` variable, provided for convenience.
   * - `true` if the query attempt resulted in an error.
   */
  isError: boolean;
  /**
   * Will be `true` if the query has been fetched.
   */
  isFetched: boolean;
  /**
   * Will be `true` if the query has been fetched after the component mounted.
   * - This property can be used to not show any previously cached data.
   */
  isFetchedAfterMount: boolean;
  /**
   * A derived boolean from the `fetchStatus` variable, provided for convenience.
   * - `true` whenever the `queryFn` is executing, which includes initial `pending` as well as background refetch.
   */
  isFetching: boolean;
  /**
   * Is `true` whenever the first fetch for a query is in-flight.
   * - Is the same as `isFetching && isPending`.
   */
  isLoading: boolean;
  /**
   * Will be `pending` if there's no cached data and no query attempt was finished yet.
   */
  isPending: boolean;
  /**
   * Will be `true` if the query failed while fetching for the first time.
   */
  isLoadingError: boolean;
  /**
   * @deprecated `isInitialLoading` is being deprecated in favor of `isLoading`
   * and will be removed in the next major version.
   */
  isInitialLoading: boolean;
  /**
   * A derived boolean from the `fetchStatus` variable, provided for convenience.
   * - The query wanted to fetch, but has been `paused`.
   */
  isPaused: boolean;
  /**
   * Will be `true` if the data shown is the placeholder data.
   */
  isPlaceholderData: boolean;
  /**
   * Will be `true` if the query failed while refetching.
   */
  isRefetchError: boolean;
  /**
   * Is `true` whenever a background refetch is in-flight, which _does not_ include initial `pending`.
   * - Is the same as `isFetching && !isPending`.
   */
  isRefetching: boolean;
  /**
   * Will be `true` if the data in the cache is invalidated or if the data is older than the given `staleTime`.
   */
  isStale: boolean;
  /**
   * A derived boolean from the `status` variable, provided for convenience.
   * - `true` if the query has received a response with no errors and is ready to display its data.
   */
  isSuccess: boolean;
  /**
   * `true` if this observer is enabled, `false` otherwise.
   */
  isEnabled: boolean;
  /**
   * A function to manually refetch the query.
   */
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<TData, TError>>;
  /**
   * The status of the query.
   * - Will be:
   *   - `pending` if there's no cached data and no query attempt was finished yet.
   *   - `error` if the query attempt resulted in an error.
   *   - `success` if the query has received a response with no errors and is ready to display its data.
   */
  status: QueryStatus;
  /**
   * The fetch status of the query.
   * - `fetching`: Is `true` whenever the queryFn is executing, which includes initial `pending` as well as background refetch.
   * - `paused`: The query wanted to fetch, but has been `paused`.
   * - `idle`: The query is not fetching.
   * - See [Network Mode](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode) for more information.
   */
  fetchStatus: FetchStatus;
}
interface QueryObserverPendingResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
  data: undefined;
  error: null;
  isError: false;
  isPending: true;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: 'pending';
}
interface QueryObserverLoadingResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
  data: undefined;
  error: null;
  isError: false;
  isPending: true;
  isLoading: true;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: 'pending';
}
interface QueryObserverLoadingErrorResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
  data: undefined;
  error: TError;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: true;
  isRefetchError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: 'error';
}
interface QueryObserverRefetchErrorResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
  data: TData;
  error: TError;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: true;
  isSuccess: false;
  isPlaceholderData: false;
  status: 'error';
}
interface QueryObserverSuccessResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
  data: TData;
  error: null;
  isError: false;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: false;
  status: 'success';
}
interface QueryObserverPlaceholderResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
  data: TData;
  isError: false;
  error: null;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: true;
  status: 'success';
}
type DefinedQueryObserverResult<TData = unknown, TError = DefaultError> = QueryObserverRefetchErrorResult<TData, TError> | QueryObserverSuccessResult<TData, TError>;
type QueryObserverResult<TData = unknown, TError = DefaultError> = DefinedQueryObserverResult<TData, TError> | QueryObserverLoadingErrorResult<TData, TError> | QueryObserverLoadingResult<TData, TError> | QueryObserverPendingResult<TData, TError> | QueryObserverPlaceholderResult<TData, TError>;
interface InfiniteQueryObserverBaseResult<TData = unknown, TError = DefaultError> extends QueryObserverBaseResult<TData, TError> {
  /**
   * This function allows you to fetch the next "page" of results.
   */
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<TData, TError>>;
  /**
   * This function allows you to fetch the previous "page" of results.
   */
  fetchPreviousPage: (options?: FetchPreviousPageOptions) => Promise<InfiniteQueryObserverResult<TData, TError>>;
  /**
   * Will be `true` if there is a next page to be fetched (known via the `getNextPageParam` option).
   */
  hasNextPage: boolean;
  /**
   * Will be `true` if there is a previous page to be fetched (known via the `getPreviousPageParam` option).
   */
  hasPreviousPage: boolean;
  /**
   * Will be `true` if the query failed while fetching the next page.
   */
  isFetchNextPageError: boolean;
  /**
   * Will be `true` while fetching the next page with `fetchNextPage`.
   */
  isFetchingNextPage: boolean;
  /**
   * Will be `true` if the query failed while fetching the previous page.
   */
  isFetchPreviousPageError: boolean;
  /**
   * Will be `true` while fetching the previous page with `fetchPreviousPage`.
   */
  isFetchingPreviousPage: boolean;
}
interface InfiniteQueryObserverPendingResult<TData = unknown, TError = DefaultError> extends InfiniteQueryObserverBaseResult<TData, TError> {
  data: undefined;
  error: null;
  isError: false;
  isPending: true;
  isLoadingError: false;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: 'pending';
}
interface InfiniteQueryObserverLoadingResult<TData = unknown, TError = DefaultError> extends InfiniteQueryObserverBaseResult<TData, TError> {
  data: undefined;
  error: null;
  isError: false;
  isPending: true;
  isLoading: true;
  isLoadingError: false;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: 'pending';
}
interface InfiniteQueryObserverLoadingErrorResult<TData = unknown, TError = DefaultError> extends InfiniteQueryObserverBaseResult<TData, TError> {
  data: undefined;
  error: TError;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: true;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: false;
  isPlaceholderData: false;
  status: 'error';
}
interface InfiniteQueryObserverRefetchErrorResult<TData = unknown, TError = DefaultError> extends InfiniteQueryObserverBaseResult<TData, TError> {
  data: TData;
  error: TError;
  isError: true;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: true;
  isSuccess: false;
  isPlaceholderData: false;
  status: 'error';
}
interface InfiniteQueryObserverSuccessResult<TData = unknown, TError = DefaultError> extends InfiniteQueryObserverBaseResult<TData, TError> {
  data: TData;
  error: null;
  isError: false;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  isSuccess: true;
  isPlaceholderData: false;
  status: 'success';
}
interface InfiniteQueryObserverPlaceholderResult<TData = unknown, TError = DefaultError> extends InfiniteQueryObserverBaseResult<TData, TError> {
  data: TData;
  isError: false;
  error: null;
  isPending: false;
  isLoading: false;
  isLoadingError: false;
  isRefetchError: false;
  isSuccess: true;
  isPlaceholderData: true;
  isFetchNextPageError: false;
  isFetchPreviousPageError: false;
  status: 'success';
}
type DefinedInfiniteQueryObserverResult<TData = unknown, TError = DefaultError> = InfiniteQueryObserverRefetchErrorResult<TData, TError> | InfiniteQueryObserverSuccessResult<TData, TError>;
type InfiniteQueryObserverResult<TData = unknown, TError = DefaultError> = DefinedInfiniteQueryObserverResult<TData, TError> | InfiniteQueryObserverLoadingErrorResult<TData, TError> | InfiniteQueryObserverLoadingResult<TData, TError> | InfiniteQueryObserverPendingResult<TData, TError> | InfiniteQueryObserverPlaceholderResult<TData, TError>;
type MutationKey = Register extends {
  mutationKey: infer TMutationKey;
} ? TMutationKey extends ReadonlyArray<unknown> ? TMutationKey : TMutationKey extends Array<unknown> ? TMutationKey : ReadonlyArray<unknown> : ReadonlyArray<unknown>;
type MutationStatus = 'idle' | 'pending' | 'success' | 'error';
type MutationScope = {
  id: string;
};
type MutationMeta = Register extends {
  mutationMeta: infer TMutationMeta;
} ? TMutationMeta extends Record<string, unknown> ? TMutationMeta : Record<string, unknown> : Record<string, unknown>;
type MutationFunctionContext = {
  client: QueryClient;
  meta: MutationMeta | undefined;
  mutationKey?: MutationKey;
};
type MutationFunction<TData = unknown, TVariables = unknown> = (variables: TVariables, context: MutationFunctionContext) => Promise<TData>;
interface MutationOptions<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> {
  mutationFn?: MutationFunction<TData, TVariables>;
  mutationKey?: MutationKey;
  onMutate?: (variables: TVariables, context: MutationFunctionContext) => Promise<TOnMutateResult> | TOnMutateResult;
  onSuccess?: (data: TData, variables: TVariables, onMutateResult: TOnMutateResult, context: MutationFunctionContext) => Promise<unknown> | unknown;
  onError?: (error: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => Promise<unknown> | unknown;
  /**
   * If `false`, failed mutations will not retry by default.
   * If `true`, failed mutations will retry infinitely.
   * If set to an integer number, e.g. 3, failed mutations will retry until the failed mutation count meets that number.
   * If set to a function `(failureCount, error) => boolean` failed mutations will retry until the function returns false.
   *
   * Defaults to `0`.
   */
  retry?: RetryValue<TError>;
  /**
   * This function receives a `retryAttempt` integer and the actual Error and returns the delay to apply before the
   * next attempt in milliseconds.
   *
   * Defaults to a function that applies exponential backoff, capped at 30 seconds.
   */
  retryDelay?: RetryDelayValue<TError>;
  /**
   * Controls whether a mutation is allowed to run based on the current network connectivity.
   *
   * Defaults to `'online'`.
   * @see [Network Mode](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode) for more information.
   */
  networkMode?: NetworkMode;
  /**
   * The time in milliseconds that an unused/inactive mutation remains in memory before it is
   * garbage collected.
   *
   * Defaults to `5 * 60 * 1000` (5 minutes), or `Infinity` during SSR.
   */
  gcTime?: number;
  /** @internal */
  _defaulted?: boolean;
  meta?: MutationMeta;
  scope?: MutationScope;
}
interface MutationObserverOptions<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> extends MutationOptions<TData, TError, TVariables, TOnMutateResult> {
  /**
   * Whether errors should be thrown instead of setting the `error` property.
   * If set to `true`, all errors will be thrown to the nearest error boundary.
   * If set to a function, it will be passed the error and should return a boolean indicating whether to throw the
   * error (`true`) or return it as state (`false`).
   *
   * Defaults to `false`.
   */
  throwOnError?: boolean | ((error: TError) => boolean);
}
interface MutateOptions<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> {
  onSuccess?: (data: TData, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void;
  onError?: (error: TError, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables, onMutateResult: TOnMutateResult | undefined, context: MutationFunctionContext) => void;
}
type MutateFunctionRest<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> = undefined extends TVariables ? [variables?: TVariables, options?: MutateOptions<TData, TError, TVariables, TOnMutateResult>] : [variables: TVariables, options?: MutateOptions<TData, TError, TVariables, TOnMutateResult>];
type MutateFunction<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> = (...rest: MutateFunctionRest<TData, TError, TVariables, TOnMutateResult>) => Promise<TData>;
interface MutationObserverBaseResult<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> extends MutationState<TData, TError, TVariables, TOnMutateResult> {
  /**
   * The last successfully resolved data for the mutation.
   */
  data: TData | undefined;
  /**
   * The variables object passed to the `mutationFn`.
   */
  variables: TVariables | undefined;
  /**
   * The error object for the mutation, if an error was encountered.
   * - Defaults to `null`.
   */
  error: TError | null;
  /**
   * A boolean variable derived from `status`.
   * - `true` if the last mutation attempt resulted in an error.
   */
  isError: boolean;
  /**
   * A boolean variable derived from `status`.
   * - `true` if the mutation is in its initial state prior to executing.
   */
  isIdle: boolean;
  /**
   * A boolean variable derived from `status`.
   * - `true` if the mutation is currently executing.
   */
  isPending: boolean;
  /**
   * A boolean variable derived from `status`.
   * - `true` if the last mutation attempt was successful.
   */
  isSuccess: boolean;
  /**
   * The status of the mutation.
   * - Will be:
   *   - `idle` initial status prior to the mutation function executing.
   *   - `pending` if the mutation is currently executing.
   *   - `error` if the last mutation attempt resulted in an error.
   *   - `success` if the last mutation attempt was successful.
   */
  status: MutationStatus;
  /**
   * The mutation function you can call with variables to trigger the mutation and optionally hooks on additional callback options.
   * @param variables - The variables object to pass to the `mutationFn`.
   * @param options.onSuccess - This function will fire when the mutation is successful and will be passed the mutation's result.
   * @param options.onError - This function will fire if the mutation encounters an error and will be passed the error.
   * @param options.onSettled - This function will fire when the mutation is either successfully fetched or encounters an error and be passed either the data or error.
   * @remarks
   * - If you make multiple requests, `onSuccess` will fire only after the latest call you've made.
   * - All the callback functions (`onSuccess`, `onError`, `onSettled`) are void functions, and the returned value will be ignored.
   */
  mutate: MutateFunction<TData, TError, TVariables, TOnMutateResult>;
  /**
   * A function to clean the mutation internal state (i.e., it resets the mutation to its initial state).
   */
  reset: () => void;
}
interface MutationObserverIdleResult<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> extends MutationObserverBaseResult<TData, TError, TVariables, TOnMutateResult> {
  data: undefined;
  variables: undefined;
  error: null;
  isError: false;
  isIdle: true;
  isPending: false;
  isSuccess: false;
  status: 'idle';
}
interface MutationObserverLoadingResult<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> extends MutationObserverBaseResult<TData, TError, TVariables, TOnMutateResult> {
  data: undefined;
  variables: TVariables;
  error: null;
  isError: false;
  isIdle: false;
  isPending: true;
  isSuccess: false;
  status: 'pending';
}
interface MutationObserverErrorResult<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> extends MutationObserverBaseResult<TData, TError, TVariables, TOnMutateResult> {
  data: undefined;
  error: TError;
  variables: TVariables;
  isError: true;
  isIdle: false;
  isPending: false;
  isSuccess: false;
  status: 'error';
}
interface MutationObserverSuccessResult<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> extends MutationObserverBaseResult<TData, TError, TVariables, TOnMutateResult> {
  data: TData;
  error: null;
  variables: TVariables;
  isError: false;
  isIdle: false;
  isPending: false;
  isSuccess: true;
  status: 'success';
}
type MutationObserverResult<TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown> = MutationObserverIdleResult<TData, TError, TVariables, TOnMutateResult> | MutationObserverLoadingResult<TData, TError, TVariables, TOnMutateResult> | MutationObserverErrorResult<TData, TError, TVariables, TOnMutateResult> | MutationObserverSuccessResult<TData, TError, TVariables, TOnMutateResult>;
interface QueryClientConfig {
  /** The query cache this client is connected to. A new `QueryCache` is created if not provided. */
  queryCache?: QueryCache;
  /**
   * The mutation cache this client is connected to. A new `MutationCache` is created if not
   * provided.
   */
  mutationCache?: MutationCache;
  /** Default options for all queries and mutations created through this client. */
  defaultOptions?: DefaultOptions;
}
interface DefaultOptions<TError = DefaultError> {
  /** Default options applied to every query, unless overridden per-query. */
  queries?: OmitKeyof<QueryObserverOptions<unknown, TError>, 'suspense' | 'queryKey'>;
  /** Default options applied to every mutation, unless overridden per-mutation. */
  mutations?: MutationObserverOptions<unknown, TError, unknown, unknown>;
  /** Default options used when hydrating queries; see {@link HydrateOptions}. */
  hydrate?: HydrateOptions['defaultOptions'];
  /** Default options used when dehydrating the client's caches; see {@link DehydrateOptions}. */
  dehydrate?: DehydrateOptions;
}
interface CancelOptions {
  revert?: boolean;
  silent?: boolean;
}
interface SetDataOptions {
  updatedAt?: number;
}
type NotifyEventType = 'added' | 'removed' | 'updated' | 'observerAdded' | 'observerRemoved' | 'observerResultsUpdated' | 'observerOptionsUpdated';
interface NotifyEvent {
  type: NotifyEventType;
}
//#endregion
//#region src/hydration.d.ts
type TransformerFn = (data: any) => any;
/**
 * Options for `dehydrate`, controlling which queries/mutations are included in the resulting `DehydratedState` and
 * how their data/errors are transformed before being serialized (e.g. for embedding in server-rendered markup).
 */
interface DehydrateOptions {
  /** Transforms a query's `data` before it is dehydrated. Useful for non-JSON-serializable data. */
  serializeData?: TransformerFn;
  /** Predicate to decide whether a given `Mutation` should be dehydrated. Defaults to `defaultShouldDehydrateMutation`. */
  shouldDehydrateMutation?: (mutation: Mutation) => boolean;
  /** Predicate to decide whether a given `Query` should be dehydrated. Defaults to `defaultShouldDehydrateQuery`. */
  shouldDehydrateQuery?: (query: Query) => boolean;
  /**
   * Predicate to decide whether a query's error should be redacted before dehydration. Errors are redacted
   * (replaced with a generic `Error('redacted')`) unless this function is provided and returns `false` for the
   * given error, in which case the original error is kept.
   */
  shouldRedactErrors?: (error: unknown) => boolean;
}
/**
 * Options for `hydrate`, controlling the default options applied to queries/mutations restored from a
 * `DehydratedState`, and how to reverse any transformation applied by `DehydrateOptions.serializeData`.
 */
interface HydrateOptions {
  defaultOptions?: {
    /** Transforms a query's `data` after it is read from the dehydrated state, reversing `serializeData`. */
    deserializeData?: TransformerFn;
    /** Default options merged into every query restored from the dehydrated state. */
    queries?: QueryOptions;
    /** Default options merged into every mutation restored from the dehydrated state. */
    mutations?: MutationOptions<unknown, DefaultError, unknown, unknown>;
  };
}
interface DehydratedMutation {
  mutationKey?: MutationKey;
  state: MutationState;
  meta?: MutationMeta;
  scope?: MutationScope;
}
interface DehydratedQuery {
  queryHash: string;
  queryKey: QueryKey;
  state: QueryState;
  dehydratedAt: number;
  promise?: Promise<unknown>;
  meta?: QueryMeta;
  queryType?: 'infinite';
}
/**
 * A serializable snapshot of a `QueryClient`'s cache, as produced by `dehydrate` and consumed by `hydrate`. Typically
 * transported from server to client (e.g. embedded in server-rendered markup) to seed the client's cache with data
 * that has already been fetched, avoiding a redundant fetch on the client.
 */
interface DehydratedState {
  mutations: Array<DehydratedMutation>;
  queries: Array<DehydratedQuery>;
}
/**
 * Dehydrates a single `Query` into a serializable `DehydratedQuery` snapshot. Note that most query config (e.g.
 * `queryFn`, `staleTime`) is not dehydrated but instead meant to be configured again when consuming the
 * de/rehydrated data, typically with `useQuery` on the client. If the query is still `pending`, its in-flight
 * promise is dehydrated too so it can be resumed on the other side instead of re-fetched.
 * @param query - The query to dehydrate.
 * @param serializeData - Optional transform applied to `query.state.data` before it is included in the snapshot.
 * @param shouldRedactErrors - Optional predicate; if it returns `false` for the promise's rejection error, that
 * error is kept as-is instead of being redacted.
 */
declare function dehydrateQuery(query: Query, serializeData?: TransformerFn, shouldRedactErrors?: (error: unknown) => boolean): DehydratedQuery;
/**
 * The default `shouldDehydrateMutation` predicate used by `dehydrate`. Only dehydrates mutations that are
 * currently paused (e.g. paused by `networkMode` while offline).
 */
declare function defaultShouldDehydrateMutation(mutation: Mutation): boolean;
/**
 * The default `shouldDehydrateQuery` predicate used by `dehydrate`. Only dehydrates queries whose status is
 * `'success'`.
 */
declare function defaultShouldDehydrateQuery(query: Query): boolean;
/**
 * Dehydrates a `QueryClient`'s cache (queries and mutations) into a plain, serializable `DehydratedState`,
 * typically to embed in server-rendered markup and later restore into a client-side `QueryClient` via `hydrate`.
 * Which queries/mutations are included, and how their data/errors are transformed, is controlled by `options`,
 * falling back to the client's `dehydrate` default options, and finally to `defaultShouldDehydrateQuery` /
 * `defaultShouldDehydrateMutation`.
 * @example
 * ```ts
 * const queryClient = new QueryClient()
 *
 * await queryClient.prefetchQuery({
 *   queryKey: ['posts'],
 *   queryFn: getPosts,
 * })
 *
 * const dehydratedState = dehydrate(queryClient)
 * ```
 */
declare function dehydrate(client: QueryClient, options?: DehydrateOptions): DehydratedState;
/**
 * Restores a `DehydratedState` (as produced by `dehydrate`) into a `QueryClient`'s cache, typically to seed the
 * client with data already fetched on the server. `mutations` and `queries` are each optional on `dehydratedState`.
 * Queries not yet in the cache are built from the dehydrated snapshot; queries that already exist are only updated
 * when the dehydrated data is newer than what's already cached. Newly built queries have their `fetchStatus` reset
 * to `'idle'` so they don't hydrate stuck in a fetching state. If a dehydrated query still had an in-flight
 * promise, it is resumed via `query.fetch()` (reusing that promise as `initialPromise`) rather than re-invoking
 * `queryFn`.
 * @example
 * ```ts
 * // dehydratedState was produced by `dehydrate` on the server
 * // and sent to the client, e.g. embedded in server-rendered markup.
 * const queryClient = new QueryClient()
 *
 * hydrate(queryClient, dehydratedState)
 * ```
 */
declare function hydrate(client: QueryClient, dehydratedState: Partial<DehydratedState>, options?: HydrateOptions): void;
//#endregion
export { MutationObserverBaseResult as $, Query as $n, CancelledError as $t, InfiniteData as A, noop as An, QueryObserverOptions as At, InfiniteQueryObserverSuccessResult as B, Action as Bn, RefetchQueryFilters as Bt, FetchPreviousPageOptions as C, isPlainArray as Cn, QueryKey as Ct, GetPreviousPageParamFunction as D, keepPreviousData as Dn, QueryObserverBaseResult as Dt, GetNextPageParamFunction as E, isValidTimeout as En, QueryMeta as Et, InfiniteQueryObserverOptions as F, shallowEqualObjects as Fn, QueryObserverSuccessResult as Ft, InvalidateQueryFilters as G, MutationCacheConfig as Gn, StaleTime as Gt, InitialDataFunction as H, MutationState as Hn, ResetOptions as Ht, InfiniteQueryObserverPendingResult as I, shouldThrowError as In, QueryOptions as It, MutateOptions as J, Action$1 as Jn, UnsetMarker as Jt, MutateFunction as K, MutationCacheNotifyEvent as Kn, StaleTimeFunction as Kt, InfiniteQueryObserverPlaceholderResult as L, skipToken as Ln, QueryPersister as Lt, InfiniteQueryObserverBaseResult as M, replaceData as Mn, QueryObserverPlaceholderResult as Mt, InfiniteQueryObserverLoadingErrorResult as N, replaceEqualDeep as Nn, QueryObserverRefetchErrorResult as Nt, InferDataFromTag as O, matchMutation as On, QueryObserverLoadingErrorResult as Ot, InfiniteQueryObserverLoadingResult as P, resolveQueryValue as Pn, QueryObserverResult as Pt, MutationMeta as Q, FetchOptions as Qn, unsetMarker as Qt, InfiniteQueryObserverRefetchErrorResult as R, sleep as Rn, QueryStatus as Rt, FetchNextPageOptions as S, hashQueryKeyByOptions as Sn, QueryFunctionContext as St, FetchStatus as T, isServer as Tn, QueryKeyWithDataTag as Tt, InitialPageParam as U, getDefaultState as Un, ResultOptions as Ut, InfiniteQueryPageParamsOptions as V, Mutation as Vn, Register as Vt, InvalidateOptions as W, MutationCache as Wn, SetDataOptions as Wt, MutationFunctionContext as X, FetchDirection as Xn, dataTagErrorSymbol as Xt, MutationFunction as Y, FetchContext as Yn, WithRequired as Yt, MutationKey as Z, FetchMeta as Zn, dataTagSymbol as Zt, DefinedQueryObserverResult as _, addToEnd as _n, QueriesPlaceholderDataFunction as _t, defaultShouldDehydrateQuery as a, isCancelledError as an, MutationObserverSuccessResult as at, EnsureQueryDataOptions as b, functionalUpdate as bn, QueryExecuteOptions as bt, hydrate as c, QueryCacheConfig as cn, MutationStatus as ct, DataTag as d, MutationFilters as dn, NotifyEvent as dt, RetryDelayValue as en, QueryBehavior as er, MutationObserverErrorResult as et, DefaultError as f, QueryFilters as fn, NotifyEventType as ft, DefinedInfiniteQueryObserverResult as g, addConsumeAwareSignal as gn, PlaceholderDataFunction as gt, DefaultedQueryObserverOptions as h, Updater as hn, Override as ht, defaultShouldDehydrateMutation as i, createRetryer as in, MutationObserverResult as it, InfiniteQueryExecuteOptions as j, partialMatchKey as jn, QueryObserverPendingResult as jt, InferErrorFromTag as k, matchQuery as kn, QueryObserverLoadingResult as kt, AnyDataTag as l, QueryCacheNotifyEvent as ln, NetworkMode as lt, DefaultedInfiniteQueryObserverOptions as m, SkipToken as mn, OmitKeyof as mt, DehydratedState as n, Retryer as nn, fetchState as nr, MutationObserverLoadingResult as nt, dehydrate as o, QueryClient as on, MutationOptions as ot, DefaultOptions as p, QueryTypeFilter as pn, NotifyOnChangeProps as pt, MutateFunctionRest as q, MutationObserver as qn, ThrowOnError as qt, HydrateOptions as r, canFetch as rn, QueryObserver as rr, MutationObserverOptions as rt, dehydrateQuery as s, QueryCache as sn, MutationScope as st, DehydrateOptions as t, RetryValue as tn, QueryState as tr, MutationObserverIdleResult as tt, CancelOptions as u, QueryStore as un, NonUndefinedGuard as ut, DistributiveOmit as v, addToStart as vn, QueryBooleanOption as vt, FetchQueryOptions as w, isPlainObject as wn, QueryKeyHashFunction as wt, FetchInfiniteQueryOptions as x, hashKey as xn, QueryFunction as xt, EnsureInfiniteQueryDataOptions as y, ensureQueryFn as yn, QueryClientConfig as yt, InfiniteQueryObserverResult as z, timeUntilStale as zn, RefetchOptions as zt };
//# sourceMappingURL=hydration-DwR10Hi-.d.cts.map