import { i as _classPrivateFieldInitSpec, n as _classPrivateFieldGet2, r as _assertClassBrand, t as _classPrivateFieldSet2 } from "./classPrivateFieldSet2-CV7wyte-.js";
import { timeoutManager } from "./timeoutManager.js";
import { isValidTimeout, noop, replaceData, resolveQueryValue, shallowEqualObjects, timeUntilStale } from "./utils.js";
import { isServer } from "./environmentManager.js";
import { Subscribable } from "./subscribable.js";
import { focusManager } from "./focusManager.js";
import { notifyManager } from "./notifyManager.js";
import { t as _classPrivateMethodInitSpec } from "./classPrivateMethodInitSpec-CBwa_Y7C.js";
import { fetchState } from "./query.js";
//#region src/queryObserver.ts
var _client = /* @__PURE__ */ new WeakMap();
var _currentQuery = /* @__PURE__ */ new WeakMap();
var _currentQueryInitialState = /* @__PURE__ */ new WeakMap();
var _currentResult = /* @__PURE__ */ new WeakMap();
var _currentResultState = /* @__PURE__ */ new WeakMap();
var _currentResultOptions = /* @__PURE__ */ new WeakMap();
var _selectError = /* @__PURE__ */ new WeakMap();
var _selectFn = /* @__PURE__ */ new WeakMap();
var _selectResult = /* @__PURE__ */ new WeakMap();
var _lastQueryWithDefinedData = /* @__PURE__ */ new WeakMap();
var _staleTimeoutId = /* @__PURE__ */ new WeakMap();
var _refetchIntervalId = /* @__PURE__ */ new WeakMap();
var _currentRefetchInterval = /* @__PURE__ */ new WeakMap();
var _trackedProps = /* @__PURE__ */ new WeakMap();
var _QueryObserver_brand = /* @__PURE__ */ new WeakSet();
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
var QueryObserver = class extends Subscribable {
	constructor(client, options) {
		super();
		this.options = options;
		_classPrivateMethodInitSpec(this, _QueryObserver_brand);
		_classPrivateFieldInitSpec(this, _client, void 0);
		_classPrivateFieldInitSpec(this, _currentQuery, void 0);
		_classPrivateFieldInitSpec(this, _currentQueryInitialState, void 0);
		_classPrivateFieldInitSpec(this, _currentResult, void 0);
		_classPrivateFieldInitSpec(this, _currentResultState, void 0);
		_classPrivateFieldInitSpec(this, _currentResultOptions, void 0);
		_classPrivateFieldInitSpec(this, _selectError, void 0);
		_classPrivateFieldInitSpec(this, _selectFn, void 0);
		_classPrivateFieldInitSpec(this, _selectResult, void 0);
		_classPrivateFieldInitSpec(this, _lastQueryWithDefinedData, void 0);
		_classPrivateFieldInitSpec(this, _staleTimeoutId, void 0);
		_classPrivateFieldInitSpec(this, _refetchIntervalId, void 0);
		_classPrivateFieldInitSpec(this, _currentRefetchInterval, void 0);
		_classPrivateFieldInitSpec(this, _trackedProps, /* @__PURE__ */ new Set());
		_classPrivateFieldSet2(_client, this, client);
		_classPrivateFieldSet2(_selectError, this, null);
		this.bindMethods();
		this.setOptions(options);
	}
	bindMethods() {
		this.refetch = this.refetch.bind(this);
	}
	onSubscribe() {
		if (this.listeners.size === 1) {
			_classPrivateFieldGet2(_currentQuery, this).addObserver(this);
			if (shouldFetchOnMount(_classPrivateFieldGet2(_currentQuery, this), this.options)) _assertClassBrand(_QueryObserver_brand, this, _executeFetch).call(this);
			else this.updateResult();
			_assertClassBrand(_QueryObserver_brand, this, _updateTimers).call(this);
		}
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.destroy();
	}
	/**
	* Returns whether the observed query is currently stale and configured
	* (via the `refetchOnReconnect` option) to refetch when the network
	* reconnects.
	*/
	shouldFetchOnReconnect() {
		return shouldFetchOn(_classPrivateFieldGet2(_currentQuery, this), this.options, this.options.refetchOnReconnect);
	}
	/**
	* Returns whether the observed query is currently stale and configured
	* (via the `refetchOnWindowFocus` option) to refetch when the window
	* regains focus.
	*/
	shouldFetchOnWindowFocus() {
		return shouldFetchOn(_classPrivateFieldGet2(_currentQuery, this), this.options, this.options.refetchOnWindowFocus);
	}
	/**
	* Stops observing the current query: clears all listeners, cancels the
	* stale and refetch-interval timers, and removes this observer from the
	* query it was observing.
	*/
	destroy() {
		this.listeners = /* @__PURE__ */ new Set();
		_assertClassBrand(_QueryObserver_brand, this, _clearStaleTimeout).call(this);
		_assertClassBrand(_QueryObserver_brand, this, _clearRefetchInterval).call(this);
		_classPrivateFieldGet2(_currentQuery, this).removeObserver(this);
	}
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
	setOptions(options) {
		const prevOptions = this.options;
		const prevQuery = _classPrivateFieldGet2(_currentQuery, this);
		this.options = _classPrivateFieldGet2(_client, this).defaultQueryOptions(options);
		if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveQueryValue(this.options.enabled, _classPrivateFieldGet2(_currentQuery, this)) !== "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
		_assertClassBrand(_QueryObserver_brand, this, _updateQuery).call(this);
		_classPrivateFieldGet2(_currentQuery, this).setOptions(this.options);
		if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) _classPrivateFieldGet2(_client, this).getQueryCache().notify({
			type: "observerOptionsUpdated",
			query: _classPrivateFieldGet2(_currentQuery, this),
			observer: this
		});
		const mounted = this.hasListeners();
		if (mounted && shouldFetchOptionally(_classPrivateFieldGet2(_currentQuery, this), prevQuery, this.options, prevOptions)) _assertClassBrand(_QueryObserver_brand, this, _executeFetch).call(this);
		this.updateResult();
		if (mounted && (_classPrivateFieldGet2(_currentQuery, this) !== prevQuery || resolveQueryValue(this.options.enabled, _classPrivateFieldGet2(_currentQuery, this)) !== resolveQueryValue(prevOptions.enabled, _classPrivateFieldGet2(_currentQuery, this)) || resolveQueryValue(this.options.staleTime, _classPrivateFieldGet2(_currentQuery, this)) !== resolveQueryValue(prevOptions.staleTime, _classPrivateFieldGet2(_currentQuery, this)))) _assertClassBrand(_QueryObserver_brand, this, _updateStaleTimeout).call(this);
		const nextRefetchInterval = _assertClassBrand(_QueryObserver_brand, this, _computeRefetchInterval).call(this);
		if (mounted && (_classPrivateFieldGet2(_currentQuery, this) !== prevQuery || resolveQueryValue(this.options.enabled, _classPrivateFieldGet2(_currentQuery, this)) !== resolveQueryValue(prevOptions.enabled, _classPrivateFieldGet2(_currentQuery, this)) || nextRefetchInterval !== _classPrivateFieldGet2(_currentRefetchInterval, this))) _assertClassBrand(_QueryObserver_brand, this, _updateRefetchInterval).call(this, nextRefetchInterval);
	}
	/**
	* Computes the result the observer would produce for the given (already-defaulted) options
	* right now, building the underlying `Query` if it doesn't exist yet, without waiting for a
	* subscription callback. Called by framework adapters on every render (e.g. `useQuery`) so the
	* returned value is available synchronously, ahead of `setOptions` triggering an actual fetch.
	*/
	getOptimisticResult(options) {
		const query = _classPrivateFieldGet2(_client, this).getQueryCache().build(_classPrivateFieldGet2(_client, this), options);
		const result = this.createResult(query, options);
		if (!shallowEqualObjects(this.getCurrentResult(), result)) {
			_classPrivateFieldSet2(_currentResult, this, result);
			_classPrivateFieldSet2(_currentResultOptions, this, this.options);
			_classPrivateFieldSet2(_currentResultState, this, _classPrivateFieldGet2(_currentQuery, this).state);
		}
		return result;
	}
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
	getCurrentResult() {
		return _classPrivateFieldGet2(_currentResult, this);
	}
	/**
	* Wraps a `QueryObserverResult` in a `Proxy` that records which properties are read, via
	* {@link QueryObserver#trackProp} (and an optional `onPropTracked` callback). Used by framework
	* adapters when `notifyOnChangeProps` is not set, to implement its default "only re-render on
	* properties you actually read" behavior.
	*/
	trackResult(result, onPropTracked) {
		return new Proxy(result, { get: (target, key) => {
			this.trackProp(key);
			onPropTracked === null || onPropTracked === void 0 || onPropTracked(key);
			return Reflect.get(target, key);
		} });
	}
	/**
	* Records that the given `QueryObserverResult` property was read, so a subsequent update only
	* notifies this observer if a tracked property actually changed. Normally called indirectly via
	* {@link QueryObserver#trackResult}'s proxy; exposed directly for adapters that track property
	* access themselves (e.g. through their own reactivity system) instead of via the proxy.
	*/
	trackProp(key) {
		_classPrivateFieldGet2(_trackedProps, this).add(key);
	}
	/**
	* Returns the `Query` instance this observer is currently observing.
	*/
	getCurrentQuery() {
		return _classPrivateFieldGet2(_currentQuery, this);
	}
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
	refetch({ ...options } = {}) {
		return this.fetch({ ...options });
	}
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
	fetchOptimistic(options) {
		const defaultedOptions = _classPrivateFieldGet2(_client, this).defaultQueryOptions(options);
		const query = _classPrivateFieldGet2(_client, this).getQueryCache().build(_classPrivateFieldGet2(_client, this), defaultedOptions);
		let unsubscribe = () => {};
		let resolveEarly;
		const cachePromise = new Promise((resolve) => {
			resolveEarly = resolve;
			unsubscribe = _classPrivateFieldGet2(_client, this).getQueryCache().subscribe((event) => {
				if (event.type === "updated" && event.query.queryHash === query.queryHash && query.state.data !== void 0) {
					unsubscribe();
					resolve(this.createResult(query, defaultedOptions));
				}
			});
		});
		return Promise.race([query.fetch().then(() => {
			const result = this.createResult(query, defaultedOptions);
			resolveEarly === null || resolveEarly === void 0 || resolveEarly(result);
			return result;
		}).finally(() => {
			unsubscribe();
		}), cachePromise]);
	}
	fetch(fetchOptions) {
		return _assertClassBrand(_QueryObserver_brand, this, _executeFetch).call(this, {
			...fetchOptions,
			cancelRefetch: fetchOptions.cancelRefetch ?? true
		}).then(() => {
			this.updateResult();
			return _classPrivateFieldGet2(_currentResult, this);
		});
	}
	createResult(query, options) {
		const prevQuery = _classPrivateFieldGet2(_currentQuery, this);
		const prevOptions = this.options;
		const prevResult = _classPrivateFieldGet2(_currentResult, this);
		const prevResultState = _classPrivateFieldGet2(_currentResultState, this);
		const prevResultOptions = _classPrivateFieldGet2(_currentResultOptions, this);
		const queryInitialState = query !== prevQuery ? query.state : _classPrivateFieldGet2(_currentQueryInitialState, this);
		const { state } = query;
		let newState = { ...state };
		let isPlaceholderData = false;
		let data;
		if (options._optimisticResults) {
			const mounted = this.hasListeners();
			const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
			const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
			if (fetchOnMount || fetchOptionally) newState = {
				...newState,
				...fetchState(state.data, query.options)
			};
			if (options._optimisticResults === "isRestoring") newState.fetchStatus = "idle";
		}
		let { error, errorUpdatedAt, status } = newState;
		data = newState.data;
		let skipSelect = false;
		if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
			let placeholderData;
			if ((prevResult === null || prevResult === void 0 ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions === null || prevResultOptions === void 0 ? void 0 : prevResultOptions.placeholderData)) {
				placeholderData = prevResult.data;
				skipSelect = true;
			} else {
				var _classPrivateFieldGet2$1;
				placeholderData = typeof options.placeholderData === "function" ? options.placeholderData((_classPrivateFieldGet2$1 = _classPrivateFieldGet2(_lastQueryWithDefinedData, this)) === null || _classPrivateFieldGet2$1 === void 0 ? void 0 : _classPrivateFieldGet2$1.state.data, _classPrivateFieldGet2(_lastQueryWithDefinedData, this)) : options.placeholderData;
			}
			if (placeholderData !== void 0) {
				status = "success";
				data = replaceData(prevResult === null || prevResult === void 0 ? void 0 : prevResult.data, placeholderData, options);
				isPlaceholderData = true;
			}
		}
		if (options.select && data !== void 0 && !skipSelect) {
			if (prevResult && data === (prevResultState === null || prevResultState === void 0 ? void 0 : prevResultState.data) && options.select === _classPrivateFieldGet2(_selectFn, this)) data = _classPrivateFieldGet2(_selectResult, this);
			else try {
				_classPrivateFieldSet2(_selectFn, this, options.select);
				data = options.select(data);
				data = replaceData(prevResult === null || prevResult === void 0 ? void 0 : prevResult.data, data, options);
				_classPrivateFieldSet2(_selectResult, this, data);
				_classPrivateFieldSet2(_selectError, this, null);
			} catch (selectError) {
				_classPrivateFieldSet2(_selectError, this, selectError);
			}
		} else if (data === void 0) _classPrivateFieldSet2(_selectError, this, null);
		if (_classPrivateFieldGet2(_selectError, this)) {
			error = _classPrivateFieldGet2(_selectError, this);
			data = _classPrivateFieldGet2(_selectResult, this);
			errorUpdatedAt = Date.now();
			status = "error";
			isPlaceholderData = false;
		}
		const isFetching = newState.fetchStatus === "fetching";
		const isPending = status === "pending";
		const isError = status === "error";
		const isLoading = isPending && isFetching;
		const hasData = data !== void 0;
		return {
			status,
			fetchStatus: newState.fetchStatus,
			isPending,
			isSuccess: status === "success",
			isError,
			isInitialLoading: isLoading,
			isLoading,
			data,
			dataUpdatedAt: newState.dataUpdatedAt,
			error,
			errorUpdatedAt,
			failureCount: newState.fetchFailureCount,
			failureReason: newState.fetchFailureReason,
			errorUpdateCount: newState.errorUpdateCount,
			isFetched: query.isFetched(),
			isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
			isFetching,
			isRefetching: isFetching && !isPending,
			isLoadingError: isError && !hasData,
			isPaused: newState.fetchStatus === "paused",
			isPlaceholderData,
			isRefetchError: isError && hasData,
			isStale: isStale(query, options),
			refetch: this.refetch,
			isEnabled: resolveQueryValue(options.enabled, query) !== false
		};
	}
	/**
	* Recomputes and stores the current result from the current query/options, notifying listeners
	* if it changed. Framework adapters call this right after subscribing to make sure no query
	* update was missed in the gap between creating the observer and subscribing to it.
	*/
	updateResult() {
		const prevResult = _classPrivateFieldGet2(_currentResult, this);
		const nextResult = this.createResult(_classPrivateFieldGet2(_currentQuery, this), this.options);
		_classPrivateFieldSet2(_currentResultState, this, _classPrivateFieldGet2(_currentQuery, this).state);
		_classPrivateFieldSet2(_currentResultOptions, this, this.options);
		if (_classPrivateFieldGet2(_currentResultState, this).data !== void 0) _classPrivateFieldSet2(_lastQueryWithDefinedData, this, _classPrivateFieldGet2(_currentQuery, this));
		if (shallowEqualObjects(nextResult, prevResult)) return;
		_classPrivateFieldSet2(_currentResult, this, nextResult);
		const shouldNotifyListeners = () => {
			if (!prevResult) return true;
			const { notifyOnChangeProps } = this.options;
			const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
			if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !_classPrivateFieldGet2(_trackedProps, this).size) return true;
			const includedProps = new Set(notifyOnChangePropsValue ?? _classPrivateFieldGet2(_trackedProps, this));
			if (this.options.throwOnError) includedProps.add("error");
			return Object.keys(_classPrivateFieldGet2(_currentResult, this)).some((key) => {
				const typedKey = key;
				return _classPrivateFieldGet2(_currentResult, this)[typedKey] !== prevResult[typedKey] && includedProps.has(typedKey);
			});
		};
		const notifyListeners = shouldNotifyListeners();
		notifyManager.batch(() => {
			if (notifyListeners) this.listeners.forEach((listener) => {
				listener(_classPrivateFieldGet2(_currentResult, this));
			});
			_classPrivateFieldGet2(_client, this).getQueryCache().notify({
				query: _classPrivateFieldGet2(_currentQuery, this),
				type: "observerResultsUpdated"
			});
		});
	}
	/** @internal */
	onQueryUpdate() {
		this.updateResult();
		if (this.hasListeners()) _assertClassBrand(_QueryObserver_brand, this, _updateTimers).call(this);
	}
};
function _executeFetch(fetchOptions) {
	_assertClassBrand(_QueryObserver_brand, this, _updateQuery).call(this);
	let promise = _classPrivateFieldGet2(_currentQuery, this).fetch(this.options, fetchOptions);
	if (!(fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.throwOnError)) promise = promise.catch(noop);
	return promise;
}
function _shouldScheduleTimer(timeout) {
	return !isServer() && resolveQueryValue(this.options.enabled, _classPrivateFieldGet2(_currentQuery, this)) !== false && isValidTimeout(timeout);
}
function _updateStaleTimeout() {
	_assertClassBrand(_QueryObserver_brand, this, _clearStaleTimeout).call(this);
	const staleTime = resolveQueryValue(this.options.staleTime, _classPrivateFieldGet2(_currentQuery, this));
	if (_classPrivateFieldGet2(_currentResult, this).isStale || !_assertClassBrand(_QueryObserver_brand, this, _shouldScheduleTimer).call(this, staleTime)) return;
	const timeout = timeUntilStale(_classPrivateFieldGet2(_currentResult, this).dataUpdatedAt, staleTime) + 1;
	_classPrivateFieldSet2(_staleTimeoutId, this, timeoutManager.setTimeout(() => {
		if (!_classPrivateFieldGet2(_currentResult, this).isStale) this.updateResult();
	}, timeout));
}
function _computeRefetchInterval() {
	return resolveQueryValue(this.options.refetchInterval, _classPrivateFieldGet2(_currentQuery, this)) ?? false;
}
function _updateRefetchInterval(nextInterval) {
	_assertClassBrand(_QueryObserver_brand, this, _clearRefetchInterval).call(this);
	_classPrivateFieldSet2(_currentRefetchInterval, this, nextInterval);
	if (_classPrivateFieldGet2(_currentRefetchInterval, this) === 0 || !_assertClassBrand(_QueryObserver_brand, this, _shouldScheduleTimer).call(this, _classPrivateFieldGet2(_currentRefetchInterval, this))) return;
	_classPrivateFieldSet2(_refetchIntervalId, this, timeoutManager.setInterval(() => {
		if (this.options.refetchIntervalInBackground || focusManager.isFocused()) _assertClassBrand(_QueryObserver_brand, this, _executeFetch).call(this);
	}, _classPrivateFieldGet2(_currentRefetchInterval, this)));
}
function _updateTimers() {
	_assertClassBrand(_QueryObserver_brand, this, _updateStaleTimeout).call(this);
	_assertClassBrand(_QueryObserver_brand, this, _updateRefetchInterval).call(this, _assertClassBrand(_QueryObserver_brand, this, _computeRefetchInterval).call(this));
}
function _clearStaleTimeout() {
	if (_classPrivateFieldGet2(_staleTimeoutId, this) !== void 0) {
		timeoutManager.clearTimeout(_classPrivateFieldGet2(_staleTimeoutId, this));
		_classPrivateFieldSet2(_staleTimeoutId, this, void 0);
	}
}
function _clearRefetchInterval() {
	if (_classPrivateFieldGet2(_refetchIntervalId, this) !== void 0) {
		timeoutManager.clearInterval(_classPrivateFieldGet2(_refetchIntervalId, this));
		_classPrivateFieldSet2(_refetchIntervalId, this, void 0);
	}
}
function _updateQuery() {
	const query = _classPrivateFieldGet2(_client, this).getQueryCache().build(_classPrivateFieldGet2(_client, this), this.options);
	if (query === _classPrivateFieldGet2(_currentQuery, this)) return;
	const prevQuery = _classPrivateFieldGet2(_currentQuery, this);
	_classPrivateFieldSet2(_currentQuery, this, query);
	_classPrivateFieldSet2(_currentQueryInitialState, this, query.state);
	if (this.hasListeners()) {
		prevQuery === null || prevQuery === void 0 || prevQuery.removeObserver(this);
		query.addObserver(this);
	}
}
function shouldLoadOnMount(query, options) {
	return resolveQueryValue(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && resolveQueryValue(options.retryOnMount, query) === false);
}
function shouldFetchOnMount(query, options) {
	return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
	if (resolveQueryValue(options.enabled, query) !== false && resolveQueryValue(options.staleTime, query) !== "static") {
		const value = resolveQueryValue(field, query);
		return value === "always" || value !== false && isStale(query, options);
	}
	return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
	return (query !== prevQuery || resolveQueryValue(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
	return resolveQueryValue(options.enabled, query) !== false && query.isStaleByTime(resolveQueryValue(options.staleTime, query));
}
//#endregion
export { QueryObserver };

//# sourceMappingURL=queryObserver.js.map