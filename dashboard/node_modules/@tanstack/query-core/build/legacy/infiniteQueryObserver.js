import { hasNextPage, hasPreviousPage } from "./infiniteQueryBehavior.js";
import { QueryObserver } from "./queryObserver.js";
//#region src/infiniteQueryObserver.ts
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
var InfiniteQueryObserver = class extends QueryObserver {
	constructor(client, options) {
		super(client, options);
	}
	bindMethods() {
		super.bindMethods();
		this.fetchNextPage = this.fetchNextPage.bind(this);
		this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
	}
	/**
	* Updates the observer's options. Behaves the same as
	* `QueryObserver.setOptions`, additionally marking the options as
	* belonging to an infinite query before delegating to the base
	* implementation.
	*/
	setOptions(options) {
		options._type = "infinite";
		super.setOptions(options);
	}
	/**
	* The infinite-query counterpart of {@link QueryObserver#getOptimisticResult}, marking the
	* options as an infinite query before delegating to it. Called by framework adapters (e.g.
	* `useInfiniteQuery`) ahead of subscribing, to compute the current `InfiniteQueryObserverResult`
	* synchronously.
	*/
	getOptimisticResult(options) {
		options._type = "infinite";
		return super.getOptimisticResult(options);
	}
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
	fetchNextPage(options) {
		return this.fetch({
			...options,
			meta: { fetchMore: { direction: "forward" } }
		});
	}
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
	fetchPreviousPage(options) {
		return this.fetch({
			...options,
			meta: { fetchMore: { direction: "backward" } }
		});
	}
	createResult(query, options) {
		var _state$fetchMeta;
		const { state } = query;
		const parentResult = super.createResult(query, options);
		const { isFetching, isRefetching, isError, isRefetchError } = parentResult;
		const fetchDirection = (_state$fetchMeta = state.fetchMeta) === null || _state$fetchMeta === void 0 || (_state$fetchMeta = _state$fetchMeta.fetchMore) === null || _state$fetchMeta === void 0 ? void 0 : _state$fetchMeta.direction;
		const isFetchNextPageError = isError && fetchDirection === "forward";
		const isFetchingNextPage = isFetching && fetchDirection === "forward";
		const isFetchPreviousPageError = isError && fetchDirection === "backward";
		const isFetchingPreviousPage = isFetching && fetchDirection === "backward";
		return {
			...parentResult,
			fetchNextPage: this.fetchNextPage,
			fetchPreviousPage: this.fetchPreviousPage,
			hasNextPage: hasNextPage(options, state.data),
			hasPreviousPage: hasPreviousPage(options, state.data),
			isFetchNextPageError,
			isFetchingNextPage,
			isFetchPreviousPageError,
			isFetchingPreviousPage,
			isRefetchError: isRefetchError && !isFetchNextPageError && !isFetchPreviousPageError,
			isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
		};
	}
};
//#endregion
export { InfiniteQueryObserver };

//# sourceMappingURL=infiniteQueryObserver.js.map