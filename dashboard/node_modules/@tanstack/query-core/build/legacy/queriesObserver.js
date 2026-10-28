import { i as _classPrivateFieldInitSpec, n as _classPrivateFieldGet2, r as _assertClassBrand, t as _classPrivateFieldSet2 } from "./classPrivateFieldSet2-CV7wyte-.js";
import { replaceEqualDeep, shallowEqualObjects } from "./utils.js";
import { Subscribable } from "./subscribable.js";
import { notifyManager } from "./notifyManager.js";
import { t as _classPrivateMethodInitSpec } from "./classPrivateMethodInitSpec-CBwa_Y7C.js";
import { QueryObserver } from "./queryObserver.js";
//#region src/queriesObserver.ts
function difference(array1, array2) {
	const excludeSet = new Set(array2);
	return array1.filter((x) => !excludeSet.has(x));
}
var _client = /* @__PURE__ */ new WeakMap();
var _result = /* @__PURE__ */ new WeakMap();
var _queries = /* @__PURE__ */ new WeakMap();
var _options = /* @__PURE__ */ new WeakMap();
var _observers = /* @__PURE__ */ new WeakMap();
var _combinedResult = /* @__PURE__ */ new WeakMap();
var _lastCombine = /* @__PURE__ */ new WeakMap();
var _lastResult = /* @__PURE__ */ new WeakMap();
var _lastQueryHashes = /* @__PURE__ */ new WeakMap();
var _observerMatches = /* @__PURE__ */ new WeakMap();
var _QueriesObserver_brand = /* @__PURE__ */ new WeakSet();
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
var QueriesObserver = class extends Subscribable {
	constructor(client, queries, options) {
		super();
		_classPrivateMethodInitSpec(this, _QueriesObserver_brand);
		_classPrivateFieldInitSpec(this, _client, void 0);
		_classPrivateFieldInitSpec(this, _result, void 0);
		_classPrivateFieldInitSpec(this, _queries, void 0);
		_classPrivateFieldInitSpec(this, _options, void 0);
		_classPrivateFieldInitSpec(this, _observers, void 0);
		_classPrivateFieldInitSpec(this, _combinedResult, void 0);
		_classPrivateFieldInitSpec(this, _lastCombine, void 0);
		_classPrivateFieldInitSpec(this, _lastResult, void 0);
		_classPrivateFieldInitSpec(this, _lastQueryHashes, void 0);
		_classPrivateFieldInitSpec(this, _observerMatches, []);
		_classPrivateFieldSet2(_client, this, client);
		_classPrivateFieldSet2(_options, this, options);
		_classPrivateFieldSet2(_queries, this, []);
		_classPrivateFieldSet2(_observers, this, []);
		_classPrivateFieldSet2(_result, this, []);
		this.setQueries(queries);
	}
	onSubscribe() {
		if (this.listeners.size === 1) _classPrivateFieldGet2(_observers, this).forEach((observer) => {
			observer.subscribe((result) => {
				_assertClassBrand(_QueriesObserver_brand, this, _onUpdate).call(this, observer, result);
			});
		});
	}
	onUnsubscribe() {
		if (!this.listeners.size) this.destroy();
	}
	/**
	* Stops observing all queries: clears all listeners and destroys every
	* underlying `QueryObserver` this observer manages.
	*/
	destroy() {
		this.listeners = /* @__PURE__ */ new Set();
		_classPrivateFieldGet2(_observers, this).forEach((observer) => {
			observer.destroy();
		});
	}
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
	setQueries(queries, options) {
		_classPrivateFieldSet2(_queries, this, queries);
		_classPrivateFieldSet2(_options, this, options);
		if (process.env.NODE_ENV !== "production") {
			const queryHashes = queries.map((query) => _classPrivateFieldGet2(_client, this).defaultQueryOptions(query).queryHash);
			if (new Set(queryHashes).size !== queryHashes.length) console.warn("[QueriesObserver]: Duplicate Queries found. This might result in unexpected behavior.");
		}
		notifyManager.batch(() => {
			const prevObservers = _classPrivateFieldGet2(_observers, this);
			const newObserverMatches = _assertClassBrand(_QueriesObserver_brand, this, _findMatchingObservers).call(this, _classPrivateFieldGet2(_queries, this));
			newObserverMatches.forEach((match) => match.observer.setOptions(match.defaultedQueryOptions));
			const newObservers = newObserverMatches.map((match) => match.observer);
			const newResult = newObservers.map((observer) => observer.getCurrentResult());
			const hasLengthChange = prevObservers.length !== newObservers.length;
			const hasIndexChange = newObservers.some((observer, index) => observer !== prevObservers[index]);
			const hasStructuralChange = hasLengthChange || hasIndexChange;
			const hasResultChange = hasStructuralChange ? true : newResult.some((result, index) => {
				const prev = _classPrivateFieldGet2(_result, this)[index];
				return !prev || !shallowEqualObjects(result, prev);
			});
			if (!hasStructuralChange && !hasResultChange) return;
			if (hasStructuralChange) {
				_classPrivateFieldSet2(_observerMatches, this, newObserverMatches);
				_classPrivateFieldSet2(_observers, this, newObservers);
			}
			_classPrivateFieldSet2(_result, this, newResult);
			if (!this.hasListeners()) return;
			if (hasStructuralChange) {
				difference(prevObservers, newObservers).forEach((observer) => {
					observer.destroy();
				});
				difference(newObservers, prevObservers).forEach((observer) => {
					observer.subscribe((result) => {
						_assertClassBrand(_QueriesObserver_brand, this, _onUpdate).call(this, observer, result);
					});
				});
			}
			_assertClassBrand(_QueriesObserver_brand, this, _notify).call(this);
		});
	}
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
	getCurrentResult() {
		return _classPrivateFieldGet2(_result, this);
	}
	/**
	* Returns the underlying `Query` instances currently being observed, in
	* the same order as the queries passed to the constructor or `setQueries`.
	*/
	getQueries() {
		return _classPrivateFieldGet2(_observers, this).map((observer) => observer.getCurrentQuery());
	}
	/**
	* Returns the underlying `QueryObserver` instances this observer manages,
	* in the same order as the queries passed to the constructor or
	* `setQueries`.
	*/
	getObservers() {
		return _classPrivateFieldGet2(_observers, this);
	}
	/**
	* The `QueriesObserver` counterpart of {@link QueryObserver#getOptimisticResult} — computes
	* the result for the given (already-defaulted) queries right now, synchronously. Called by
	* framework adapters (e.g. `useQueries`) ahead of subscribing, returning a tuple of the raw
	* per-query results, a function to compute the combined result from them, and a function to
	* wrap the results for property-access tracking.
	*/
	getOptimisticResult(queries, combine) {
		const matches = _assertClassBrand(_QueriesObserver_brand, this, _findMatchingObservers).call(this, queries);
		const result = matches.map((match) => match.observer.getOptimisticResult(match.defaultedQueryOptions));
		const queryHashes = matches.map((match) => match.defaultedQueryOptions.queryHash);
		return [
			result,
			(r) => {
				return _assertClassBrand(_QueriesObserver_brand, this, _combineResult).call(this, r ?? result, combine, queryHashes);
			},
			() => {
				return _assertClassBrand(_QueriesObserver_brand, this, _trackResult).call(this, result, matches);
			}
		];
	}
};
function _trackResult(result, matches) {
	const trackedProps = /* @__PURE__ */ new Set();
	return matches.map((match, index) => {
		const observerResult = result[index];
		return !match.defaultedQueryOptions.notifyOnChangeProps ? match.observer.trackResult(observerResult, (accessedProp) => {
			if (!trackedProps.has(accessedProp)) {
				trackedProps.add(accessedProp);
				matches.forEach((m) => {
					m.observer.trackProp(accessedProp);
				});
			}
		}) : observerResult;
	});
}
function _combineResult(input, combine, queryHashes) {
	if (combine) {
		const lastHashes = _classPrivateFieldGet2(_lastQueryHashes, this);
		const queryHashesChanged = queryHashes !== void 0 && lastHashes !== void 0 && (lastHashes.length !== queryHashes.length || queryHashes.some((hash, i) => hash !== lastHashes[i]));
		if (_classPrivateFieldGet2(_result, this) !== _classPrivateFieldGet2(_lastResult, this) || queryHashesChanged || combine !== _classPrivateFieldGet2(_lastCombine, this)) {
			_classPrivateFieldSet2(_lastCombine, this, combine);
			_classPrivateFieldSet2(_lastResult, this, _classPrivateFieldGet2(_result, this));
			if (queryHashes !== void 0) _classPrivateFieldSet2(_lastQueryHashes, this, queryHashes);
			_classPrivateFieldSet2(_combinedResult, this, replaceEqualDeep(_classPrivateFieldGet2(_combinedResult, this), combine(input)));
		}
		return _classPrivateFieldGet2(_combinedResult, this);
	}
	return input;
}
function _shouldSkipCombine() {
	var _classPrivateFieldGet2$1;
	return !((_classPrivateFieldGet2$1 = _classPrivateFieldGet2(_options, this)) === null || _classPrivateFieldGet2$1 === void 0 ? void 0 : _classPrivateFieldGet2$1.combine) || _classPrivateFieldGet2(_observers, this).some((observer, index) => {
		var _classPrivateFieldGet3;
		return observer.options.suspense && ((_classPrivateFieldGet3 = _classPrivateFieldGet2(_result, this)[index]) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.data) === void 0;
	});
}
function _findMatchingObservers(queries) {
	const prevObserversMap = /* @__PURE__ */ new Map();
	_classPrivateFieldGet2(_observers, this).forEach((observer) => {
		const key = observer.options.queryHash;
		if (!key) return;
		const previousObservers = prevObserversMap.get(key);
		if (previousObservers) previousObservers.push(observer);
		else prevObserversMap.set(key, [observer]);
	});
	const observers = [];
	queries.forEach((options) => {
		var _prevObserversMap$get;
		const defaultedOptions = _classPrivateFieldGet2(_client, this).defaultQueryOptions(options);
		const observer = ((_prevObserversMap$get = prevObserversMap.get(defaultedOptions.queryHash)) === null || _prevObserversMap$get === void 0 ? void 0 : _prevObserversMap$get.shift()) ?? new QueryObserver(_classPrivateFieldGet2(_client, this), defaultedOptions);
		observers.push({
			defaultedQueryOptions: defaultedOptions,
			observer
		});
	});
	return observers;
}
function _onUpdate(observer, result) {
	const index = _classPrivateFieldGet2(_observers, this).indexOf(observer);
	if (index !== -1) {
		_classPrivateFieldSet2(_result, this, _classPrivateFieldGet2(_result, this).slice());
		_classPrivateFieldGet2(_result, this)[index] = result;
		_assertClassBrand(_QueriesObserver_brand, this, _notify).call(this);
	}
}
function _notify() {
	if (this.hasListeners()) {
		var _classPrivateFieldGet4;
		const shouldSkipCombine = _assertClassBrand(_QueriesObserver_brand, this, _shouldSkipCombine).call(this);
		const previousResult = _classPrivateFieldGet2(_combinedResult, this);
		const newResult = shouldSkipCombine ? previousResult : _assertClassBrand(_QueriesObserver_brand, this, _combineResult).call(this, _assertClassBrand(_QueriesObserver_brand, this, _trackResult).call(this, _classPrivateFieldGet2(_result, this), _classPrivateFieldGet2(_observerMatches, this)), (_classPrivateFieldGet4 = _classPrivateFieldGet2(_options, this)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.combine);
		if (shouldSkipCombine || previousResult !== newResult) notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(_classPrivateFieldGet2(_result, this));
			});
		});
	}
}
//#endregion
export { QueriesObserver };

//# sourceMappingURL=queriesObserver.js.map