import { noop } from "./utils.js";
//#region src/hydration.ts
function tryResolveSync(promise) {
	var _thenResult$catch;
	let data;
	const thenResult = promise.then((result) => {
		data = result;
		return result;
	}, noop);
	thenResult === null || thenResult === void 0 || (_thenResult$catch = thenResult.catch) === null || _thenResult$catch === void 0 || _thenResult$catch.call(thenResult, noop);
	if (data !== void 0) return { data };
}
function dehydrateMutation(mutation) {
	return {
		mutationKey: mutation.options.mutationKey,
		state: mutation.state,
		...mutation.options.scope && { scope: mutation.options.scope },
		...mutation.meta && { meta: mutation.meta }
	};
}
function dehydratePromise(query, serializeData, shouldRedactErrors) {
	var _query$promise;
	const promise = (_query$promise = query.promise) === null || _query$promise === void 0 ? void 0 : _query$promise.then(serializeData).catch((error) => {
		if ((shouldRedactErrors === null || shouldRedactErrors === void 0 ? void 0 : shouldRedactErrors(error)) === false) return Promise.reject(error);
		if (process.env.NODE_ENV !== "production") console.error(`A query that was dehydrated as pending ended up rejecting. [${query.queryHash}]: ${error}; The error will be redacted in production builds`);
		return Promise.reject(/* @__PURE__ */ new Error("redacted"));
	});
	promise === null || promise === void 0 || promise.catch(noop);
	return promise;
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
function dehydrateQuery(query, serializeData, shouldRedactErrors) {
	return {
		dehydratedAt: Date.now(),
		state: {
			...query.state,
			...query.state.data !== void 0 && { data: serializeData ? serializeData(query.state.data) : query.state.data }
		},
		queryKey: query.queryKey,
		queryHash: query.queryHash,
		...query.state.status === "pending" && { promise: dehydratePromise(query, serializeData, shouldRedactErrors) },
		...query.meta && { meta: query.meta },
		...query.queryType && { queryType: query.queryType }
	};
}
/**
* The default `shouldDehydrateMutation` predicate used by `dehydrate`. Only dehydrates mutations that are
* currently paused (e.g. paused by `networkMode` while offline).
*/
function defaultShouldDehydrateMutation(mutation) {
	return mutation.state.isPaused;
}
/**
* The default `shouldDehydrateQuery` predicate used by `dehydrate`. Only dehydrates queries whose status is
* `'success'`.
*/
function defaultShouldDehydrateQuery(query) {
	return query.state.status === "success";
}
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
function dehydrate(client, options = {}) {
	var _client$getDefaultOpt, _client$getDefaultOpt2, _client$getDefaultOpt3, _client$getDefaultOpt4;
	const filterMutation = options.shouldDehydrateMutation ?? ((_client$getDefaultOpt = client.getDefaultOptions().dehydrate) === null || _client$getDefaultOpt === void 0 ? void 0 : _client$getDefaultOpt.shouldDehydrateMutation) ?? defaultShouldDehydrateMutation;
	const mutations = client.getMutationCache().getAll().flatMap((mutation) => filterMutation(mutation) ? [dehydrateMutation(mutation)] : []);
	const filterQuery = options.shouldDehydrateQuery ?? ((_client$getDefaultOpt2 = client.getDefaultOptions().dehydrate) === null || _client$getDefaultOpt2 === void 0 ? void 0 : _client$getDefaultOpt2.shouldDehydrateQuery) ?? defaultShouldDehydrateQuery;
	const shouldRedactErrors = options.shouldRedactErrors ?? ((_client$getDefaultOpt3 = client.getDefaultOptions().dehydrate) === null || _client$getDefaultOpt3 === void 0 ? void 0 : _client$getDefaultOpt3.shouldRedactErrors);
	const serializeData = options.serializeData ?? ((_client$getDefaultOpt4 = client.getDefaultOptions().dehydrate) === null || _client$getDefaultOpt4 === void 0 ? void 0 : _client$getDefaultOpt4.serializeData);
	return {
		mutations,
		queries: client.getQueryCache().getAll().flatMap((query) => filterQuery(query) ? [dehydrateQuery(query, serializeData, shouldRedactErrors)] : [])
	};
}
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
function hydrate(client, dehydratedState, options) {
	var _options$defaultOptio, _client$getDefaultOpt5, _dehydratedState$muta, _dehydratedState$quer;
	const mutationCache = client.getMutationCache();
	const queryCache = client.getQueryCache();
	const deserializeData = (options === null || options === void 0 || (_options$defaultOptio = options.defaultOptions) === null || _options$defaultOptio === void 0 ? void 0 : _options$defaultOptio.deserializeData) ?? ((_client$getDefaultOpt5 = client.getDefaultOptions().hydrate) === null || _client$getDefaultOpt5 === void 0 ? void 0 : _client$getDefaultOpt5.deserializeData);
	(_dehydratedState$muta = dehydratedState.mutations) === null || _dehydratedState$muta === void 0 || _dehydratedState$muta.forEach(({ state, ...mutationOptions }) => {
		var _client$getDefaultOpt6, _options$defaultOptio2;
		mutationCache.build(client, {
			...(_client$getDefaultOpt6 = client.getDefaultOptions().hydrate) === null || _client$getDefaultOpt6 === void 0 ? void 0 : _client$getDefaultOpt6.mutations,
			...options === null || options === void 0 || (_options$defaultOptio2 = options.defaultOptions) === null || _options$defaultOptio2 === void 0 ? void 0 : _options$defaultOptio2.mutations,
			...mutationOptions
		}, state);
	});
	(_dehydratedState$quer = dehydratedState.queries) === null || _dehydratedState$quer === void 0 || _dehydratedState$quer.forEach(({ queryKey, state, queryHash, meta, promise, dehydratedAt, queryType }) => {
		const syncData = promise ? tryResolveSync(promise) : void 0;
		const rawData = state.data === void 0 ? syncData === null || syncData === void 0 ? void 0 : syncData.data : state.data;
		const data = rawData === void 0 ? rawData : deserializeData ? deserializeData(rawData) : rawData;
		let query = queryCache.get(queryHash);
		const existingQueryIsPending = (query === null || query === void 0 ? void 0 : query.state.status) === "pending";
		const existingQueryIsFetching = (query === null || query === void 0 ? void 0 : query.state.fetchStatus) === "fetching";
		if (query) {
			const hasNewerSyncData = syncData && dehydratedAt > query.state.dataUpdatedAt;
			if (state.dataUpdatedAt > query.state.dataUpdatedAt || hasNewerSyncData) {
				const { fetchStatus: _ignored, ...serializedState } = state;
				query.setState({
					...serializedState,
					data,
					...state.status === "pending" && data !== void 0 && {
						status: "success",
						dataUpdatedAt: dehydratedAt,
						...!existingQueryIsFetching && { fetchStatus: "idle" }
					}
				});
			}
		} else {
			var _client$getDefaultOpt7, _options$defaultOptio3;
			query = queryCache.build(client, {
				...(_client$getDefaultOpt7 = client.getDefaultOptions().hydrate) === null || _client$getDefaultOpt7 === void 0 ? void 0 : _client$getDefaultOpt7.queries,
				...options === null || options === void 0 || (_options$defaultOptio3 = options.defaultOptions) === null || _options$defaultOptio3 === void 0 ? void 0 : _options$defaultOptio3.queries,
				queryKey,
				queryHash,
				meta,
				_type: queryType
			}, {
				...state,
				data,
				fetchStatus: "idle",
				status: state.status === "pending" && data !== void 0 ? "success" : state.status,
				...state.status === "pending" && data !== void 0 && { dataUpdatedAt: dehydratedAt }
			});
		}
		if (promise && !syncData && !existingQueryIsPending && !existingQueryIsFetching && dehydratedAt > query.state.dataUpdatedAt) query.fetch(void 0, { initialPromise: Promise.resolve(promise).then(deserializeData) }).catch(noop);
	});
}
//#endregion
export { defaultShouldDehydrateMutation, defaultShouldDehydrateQuery, dehydrate, dehydrateQuery, hydrate };

//# sourceMappingURL=hydration.js.map