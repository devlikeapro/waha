import { i as _classPrivateFieldInitSpec, n as _classPrivateFieldGet2, r as _assertClassBrand, t as _classPrivateFieldSet2 } from "./classPrivateFieldSet2-CV7wyte-.js";
import { ensureQueryFn, noop, replaceData, resolveQueryValue, skipToken, timeUntilStale } from "./utils.js";
import { notifyManager } from "./notifyManager.js";
import { CancelledError, canFetch, createRetryer } from "./retryer.js";
import { Removable } from "./removable.js";
import { infiniteQueryBehavior } from "./infiniteQueryBehavior.js";
import { t as _classPrivateMethodInitSpec } from "./classPrivateMethodInitSpec-CBwa_Y7C.js";
//#region src/query.ts
var _queryType = /* @__PURE__ */ new WeakMap();
var _initialState = /* @__PURE__ */ new WeakMap();
var _revertState = /* @__PURE__ */ new WeakMap();
var _cache = /* @__PURE__ */ new WeakMap();
var _client = /* @__PURE__ */ new WeakMap();
var _retryer = /* @__PURE__ */ new WeakMap();
var _defaultOptions = /* @__PURE__ */ new WeakMap();
var _abortSignalConsumed = /* @__PURE__ */ new WeakMap();
var _Query_brand = /* @__PURE__ */ new WeakSet();
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
var Query = class extends Removable {
	constructor(config) {
		super();
		_classPrivateMethodInitSpec(this, _Query_brand);
		_classPrivateFieldInitSpec(this, _queryType, void 0);
		_classPrivateFieldInitSpec(this, _initialState, void 0);
		_classPrivateFieldInitSpec(this, _revertState, void 0);
		_classPrivateFieldInitSpec(this, _cache, void 0);
		_classPrivateFieldInitSpec(this, _client, void 0);
		_classPrivateFieldInitSpec(this, _retryer, void 0);
		_classPrivateFieldInitSpec(this, _defaultOptions, void 0);
		_classPrivateFieldInitSpec(this, _abortSignalConsumed, void 0);
		_classPrivateFieldSet2(_abortSignalConsumed, this, false);
		_classPrivateFieldSet2(_defaultOptions, this, config.defaultOptions);
		this.setOptions(config.options);
		this.observers = [];
		_classPrivateFieldSet2(_client, this, config.client);
		_classPrivateFieldSet2(_cache, this, _classPrivateFieldGet2(_client, this).getQueryCache());
		this.queryKey = config.queryKey;
		this.queryHash = config.queryHash;
		_classPrivateFieldSet2(_initialState, this, getDefaultState(this.options));
		this.state = config.state ?? _classPrivateFieldGet2(_initialState, this);
		this.scheduleGc();
	}
	/**
	* The `meta` object passed in the query's options, if any.
	*/
	get meta() {
		return this.options.meta;
	}
	/** @internal */
	get queryType() {
		return _classPrivateFieldGet2(_queryType, this);
	}
	/**
	* The promise for the currently in-flight fetch, if the query is fetching.
	* `undefined` when the query is not fetching.
	*/
	get promise() {
		var _classPrivateFieldGet2$1;
		return (_classPrivateFieldGet2$1 = _classPrivateFieldGet2(_retryer, this)) === null || _classPrivateFieldGet2$1 === void 0 ? void 0 : _classPrivateFieldGet2$1.promise;
	}
	/** @internal */
	setOptions(options) {
		this.options = {
			..._classPrivateFieldGet2(_defaultOptions, this),
			...options
		};
		if (options === null || options === void 0 ? void 0 : options._type) _classPrivateFieldSet2(_queryType, this, options._type);
		this.updateGcTime(this.options.gcTime);
		if (this.state && this.state.data === void 0) {
			const defaultState = getDefaultState(this.options);
			if (defaultState.data !== void 0) {
				this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
				_classPrivateFieldSet2(_initialState, this, defaultState);
			}
		}
	}
	optionalRemove() {
		if (!this.observers.length && this.state.fetchStatus === "idle") _classPrivateFieldGet2(_cache, this).remove(this);
	}
	/** @internal */
	setData(newData, options) {
		const data = replaceData(this.state.data, newData, this.options);
		_assertClassBrand(_Query_brand, this, _dispatch).call(this, {
			data,
			type: "success",
			dataUpdatedAt: options === null || options === void 0 ? void 0 : options.updatedAt,
			manual: options === null || options === void 0 ? void 0 : options.manual
		});
		return data;
	}
	/**
	* Merges the given partial state directly into this query's state, notifying observers. Used
	* by persistence and broadcast plugins to restore a state snapshot, and by devtools to let a
	* user manually trigger a loading/error state or edit the cached data.
	*/
	setState(state) {
		_assertClassBrand(_Query_brand, this, _dispatch).call(this, {
			type: "setState",
			state
		});
	}
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
	cancel(options) {
		var _classPrivateFieldGet3, _classPrivateFieldGet4;
		const promise = (_classPrivateFieldGet3 = _classPrivateFieldGet2(_retryer, this)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.promise;
		(_classPrivateFieldGet4 = _classPrivateFieldGet2(_retryer, this)) === null || _classPrivateFieldGet4 === void 0 || _classPrivateFieldGet4.cancel(options);
		return promise ? promise.then(noop).catch(noop) : Promise.resolve();
	}
	/**
	* Clears the query's garbage collection timeout and silently cancels any
	* in-flight fetch. Called by `QueryCache` when the query is removed from
	* the cache.
	*
	* @see {@link Query#cancel}
	*/
	destroy() {
		super.destroy();
		this.cancel({ silent: true });
	}
	/** @internal */
	get resetState() {
		return _classPrivateFieldGet2(_initialState, this);
	}
	/**
	* Resets the query back to its initial state (the state it had when it was
	* first created, e.g. any `initialData`), destroying it first to cancel any
	* in-flight fetch.
	*/
	reset() {
		this.destroy();
		this.setState(this.resetState);
	}
	/**
	* Returns `true` if the query has at least one observer for which `enabled`
	* does not resolve to `false`.
	*/
	isActive() {
		return this.observers.some((observer) => resolveQueryValue(observer.options.enabled, this) !== false);
	}
	/**
	* Returns `true` if the query is disabled, meaning it will not fetch
	* automatically.
	* - If the query has observers, it is disabled when none of them are active
	*   (see `isActive`).
	* - If the query has no observers, it is disabled when its `queryFn` is
	*   `skipToken` or it has never been fetched.
	*/
	isDisabled() {
		if (this.getObserversCount() > 0) return !this.isActive();
		return this.options.queryFn === skipToken || !this.isFetched();
	}
	/**
	* Returns `true` if the query has been fetched, i.e. it has resolved with
	* either data or an error at least once.
	*/
	isFetched() {
		return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
	}
	/**
	* Returns `true` if the query has at least one observer configured with
	* `staleTime: 'static'`, meaning it is treated as never stale.
	*/
	isStatic() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => resolveQueryValue(observer.options.staleTime, this) === "static");
		return false;
	}
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
	isStale() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => observer.getCurrentResult().isStale);
		return this.state.data === void 0 || this.state.isInvalidated;
	}
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
	isStaleByTime(staleTime = 0) {
		if (this.state.data === void 0) return true;
		if (staleTime === "static") return false;
		if (this.state.isInvalidated) return true;
		return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
	}
	/** @internal */
	onFocus() {
		var _classPrivateFieldGet5;
		const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
		observer === null || observer === void 0 || observer.refetch({ cancelRefetch: false });
		(_classPrivateFieldGet5 = _classPrivateFieldGet2(_retryer, this)) === null || _classPrivateFieldGet5 === void 0 || _classPrivateFieldGet5.continue();
	}
	/** @internal */
	onOnline() {
		var _classPrivateFieldGet6;
		const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
		observer === null || observer === void 0 || observer.refetch({ cancelRefetch: false });
		(_classPrivateFieldGet6 = _classPrivateFieldGet2(_retryer, this)) === null || _classPrivateFieldGet6 === void 0 || _classPrivateFieldGet6.continue();
	}
	/** @internal */
	addObserver(observer) {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
			this.clearGcTimeout();
			_classPrivateFieldGet2(_cache, this).notify({
				type: "observerAdded",
				query: this,
				observer
			});
		}
	}
	/** @internal */
	removeObserver(observer) {
		const index = this.observers.indexOf(observer);
		if (index !== -1) {
			this.observers.splice(index, 1);
			if (!this.observers.length) {
				if (_classPrivateFieldGet2(_retryer, this)) {
					if (_classPrivateFieldGet2(_abortSignalConsumed, this) || this.state.fetchStatus === "paused" && this.state.status === "pending") _classPrivateFieldGet2(_retryer, this).cancel({ revert: true });
					else _classPrivateFieldGet2(_retryer, this).cancelRetry();
				}
				this.scheduleGc();
			}
			_classPrivateFieldGet2(_cache, this).notify({
				type: "observerRemoved",
				query: this,
				observer
			});
		}
	}
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
	getObserversCount() {
		return this.observers.length;
	}
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
	invalidate() {
		if (!this.state.isInvalidated) _assertClassBrand(_Query_brand, this, _dispatch).call(this, { type: "invalidate" });
	}
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
	async fetch(options, fetchOptions) {
		var _classPrivateFieldGet7, _context$fetchOptions;
		if (this.state.fetchStatus !== "idle" && ((_classPrivateFieldGet7 = _classPrivateFieldGet2(_retryer, this)) === null || _classPrivateFieldGet7 === void 0 ? void 0 : _classPrivateFieldGet7.status()) !== "rejected") {
			if (this.state.data !== void 0 && (fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.cancelRefetch)) this.cancel({ silent: true });
			else if (_classPrivateFieldGet2(_retryer, this)) {
				_classPrivateFieldGet2(_retryer, this).continueRetry();
				return _classPrivateFieldGet2(_retryer, this).promise;
			}
		}
		if (options) this.setOptions(options);
		if (!this.options.queryFn) {
			const observer = this.observers.find((x) => x.options.queryFn);
			if (observer) this.setOptions(observer.options);
		}
		if (process.env.NODE_ENV !== "production") {
			if (!Array.isArray(this.options.queryKey)) console.error(`As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']`);
		}
		const abortController = new AbortController();
		const addSignalProperty = (object) => {
			Object.defineProperty(object, "signal", {
				enumerable: true,
				get: () => {
					_classPrivateFieldSet2(_abortSignalConsumed, this, true);
					return abortController.signal;
				}
			});
		};
		const fetchFn = () => {
			const queryFn = ensureQueryFn(this.options, fetchOptions);
			const createQueryFnContext = () => {
				const queryFnContext = {
					client: _classPrivateFieldGet2(_client, this),
					queryKey: this.queryKey,
					meta: this.meta
				};
				addSignalProperty(queryFnContext);
				return queryFnContext;
			};
			const queryFnContext = createQueryFnContext();
			_classPrivateFieldSet2(_abortSignalConsumed, this, false);
			if (this.options.persister) return this.options.persister(queryFn, queryFnContext, this);
			return queryFn(queryFnContext);
		};
		const createFetchContext = () => {
			const context = {
				fetchOptions,
				options: this.options,
				queryKey: this.queryKey,
				client: _classPrivateFieldGet2(_client, this),
				state: this.state,
				fetchFn
			};
			addSignalProperty(context);
			return context;
		};
		const context = createFetchContext();
		const behavior = _classPrivateFieldGet2(_queryType, this) === "infinite" ? infiniteQueryBehavior(this.options.pages) : this.options.behavior;
		behavior === null || behavior === void 0 || behavior.onFetch(context, this);
		_classPrivateFieldSet2(_revertState, this, this.state);
		if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) === null || _context$fetchOptions === void 0 ? void 0 : _context$fetchOptions.meta)) {
			var _context$fetchOptions2;
			_assertClassBrand(_Query_brand, this, _dispatch).call(this, {
				type: "fetch",
				meta: (_context$fetchOptions2 = context.fetchOptions) === null || _context$fetchOptions2 === void 0 ? void 0 : _context$fetchOptions2.meta
			});
		}
		const retryer = _classPrivateFieldSet2(_retryer, this, createRetryer({
			initialPromise: fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.initialPromise,
			fn: context.fetchFn,
			onCancel: (error) => {
				if (error instanceof CancelledError && error.revert) this.setState({
					..._classPrivateFieldGet2(_revertState, this),
					fetchStatus: "idle"
				});
				abortController.abort();
			},
			onFail: (failureCount, error) => {
				_assertClassBrand(_Query_brand, this, _dispatch).call(this, {
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				_assertClassBrand(_Query_brand, this, _dispatch).call(this, { type: "pause" });
			},
			onContinue: () => {
				_assertClassBrand(_Query_brand, this, _dispatch).call(this, { type: "continue" });
			},
			retry: context.options.retry,
			retryDelay: context.options.retryDelay,
			networkMode: context.options.networkMode,
			canRun: () => true
		}));
		try {
			var _classPrivateFieldGet8, _classPrivateFieldGet9, _classPrivateFieldGet10, _classPrivateFieldGet11;
			const data = await retryer.start();
			if (data === void 0) {
				if (process.env.NODE_ENV !== "production") console.error(`Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ${this.queryHash}`);
				throw new Error(`${this.queryHash} data is undefined`);
			}
			this.setData(data);
			(_classPrivateFieldGet8 = (_classPrivateFieldGet9 = _classPrivateFieldGet2(_cache, this).config).onSuccess) === null || _classPrivateFieldGet8 === void 0 || _classPrivateFieldGet8.call(_classPrivateFieldGet9, data, this);
			(_classPrivateFieldGet10 = (_classPrivateFieldGet11 = _classPrivateFieldGet2(_cache, this).config).onSettled) === null || _classPrivateFieldGet10 === void 0 || _classPrivateFieldGet10.call(_classPrivateFieldGet11, data, this.state.error, this);
			return data;
		} catch (error) {
			var _classPrivateFieldGet12, _classPrivateFieldGet13, _classPrivateFieldGet14, _classPrivateFieldGet15;
			if (error instanceof CancelledError) {
				if (error.silent) return _classPrivateFieldGet2(_retryer, this).promise;
				else if (error.revert) {
					if (this.state.data === void 0) throw error;
					return this.state.data;
				}
			}
			_assertClassBrand(_Query_brand, this, _dispatch).call(this, {
				type: "error",
				error
			});
			(_classPrivateFieldGet12 = (_classPrivateFieldGet13 = _classPrivateFieldGet2(_cache, this).config).onError) === null || _classPrivateFieldGet12 === void 0 || _classPrivateFieldGet12.call(_classPrivateFieldGet13, error, this);
			(_classPrivateFieldGet14 = (_classPrivateFieldGet15 = _classPrivateFieldGet2(_cache, this).config).onSettled) === null || _classPrivateFieldGet14 === void 0 || _classPrivateFieldGet14.call(_classPrivateFieldGet15, this.state.data, error, this);
			throw error;
		} finally {
			if (_classPrivateFieldGet2(_retryer, this) === retryer) _classPrivateFieldSet2(_retryer, this, void 0);
			this.scheduleGc();
		}
	}
};
function _dispatch(action) {
	const reducer = (state) => {
		switch (action.type) {
			case "failed": return {
				...state,
				fetchFailureCount: action.failureCount,
				fetchFailureReason: action.error
			};
			case "pause": return {
				...state,
				fetchStatus: "paused"
			};
			case "continue": return {
				...state,
				fetchStatus: "fetching"
			};
			case "fetch": return {
				...state,
				...fetchState(state.data, this.options),
				fetchMeta: action.meta ?? null
			};
			case "success":
				const newState = {
					...state,
					...successState(action.data, action.dataUpdatedAt),
					dataUpdateCount: state.dataUpdateCount + 1,
					...!action.manual && {
						fetchStatus: "idle",
						fetchFailureCount: 0,
						fetchFailureReason: null
					}
				};
				_classPrivateFieldSet2(_revertState, this, action.manual ? newState : void 0);
				return newState;
			case "error":
				const error = action.error;
				return {
					...state,
					error,
					errorUpdateCount: state.errorUpdateCount + 1,
					errorUpdatedAt: Date.now(),
					fetchFailureCount: state.fetchFailureCount + 1,
					fetchFailureReason: error,
					fetchStatus: "idle",
					status: "error",
					isInvalidated: true
				};
			case "invalidate": return {
				...state,
				isInvalidated: true
			};
			case "setState": return {
				...state,
				...action.state
			};
		}
	};
	this.state = reducer(this.state);
	notifyManager.batch(() => {
		this.observers.slice().forEach((observer) => {
			observer.onQueryUpdate();
		});
		_classPrivateFieldGet2(_cache, this).notify({
			query: this,
			type: "updated",
			action
		});
	});
}
function fetchState(data, options) {
	return {
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
		...data === void 0 && {
			error: null,
			status: "pending"
		}
	};
}
function successState(data, dataUpdatedAt) {
	return {
		data,
		dataUpdatedAt: dataUpdatedAt ?? Date.now(),
		error: null,
		isInvalidated: false,
		status: "success"
	};
}
function getDefaultState(options) {
	const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
	const hasData = data !== void 0;
	const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
	return {
		data,
		dataUpdateCount: 0,
		dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
		error: null,
		errorUpdateCount: 0,
		errorUpdatedAt: 0,
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchMeta: null,
		isInvalidated: false,
		status: hasData ? "success" : "pending",
		fetchStatus: "idle"
	};
}
//#endregion
export { Query, fetchState };

//# sourceMappingURL=query.js.map