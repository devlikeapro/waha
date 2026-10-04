Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_utils = require("./utils.cjs");
//#region src/hydration.ts
function tryResolveSync(promise) {
	let data;
	promise.then((result) => {
		data = result;
		return result;
	}, require_utils.noop)?.catch?.(require_utils.noop);
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
	const promise = query.promise?.then(serializeData).catch((error) => {
		if (shouldRedactErrors?.(error) === false) return Promise.reject(error);
		if (process.env.NODE_ENV !== "production") console.error(`A query that was dehydrated as pending ended up rejecting. [${query.queryHash}]: ${error}; The error will be redacted in production builds`);
		return Promise.reject(/* @__PURE__ */ new Error("redacted"));
	});
	promise?.catch(require_utils.noop);
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
	const filterMutation = options.shouldDehydrateMutation ?? client.getDefaultOptions().dehydrate?.shouldDehydrateMutation ?? defaultShouldDehydrateMutation;
	const mutations = client.getMutationCache().getAll().flatMap((mutation) => filterMutation(mutation) ? [dehydrateMutation(mutation)] : []);
	const filterQuery = options.shouldDehydrateQuery ?? client.getDefaultOptions().dehydrate?.shouldDehydrateQuery ?? defaultShouldDehydrateQuery;
	const shouldRedactErrors = options.shouldRedactErrors ?? client.getDefaultOptions().dehydrate?.shouldRedactErrors;
	const serializeData = options.serializeData ?? client.getDefaultOptions().dehydrate?.serializeData;
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
	const mutationCache = client.getMutationCache();
	const queryCache = client.getQueryCache();
	const deserializeData = options?.defaultOptions?.deserializeData ?? client.getDefaultOptions().hydrate?.deserializeData;
	dehydratedState.mutations?.forEach(({ state, ...mutationOptions }) => {
		mutationCache.build(client, {
			...client.getDefaultOptions().hydrate?.mutations,
			...options?.defaultOptions?.mutations,
			...mutationOptions
		}, state);
	});
	dehydratedState.queries?.forEach(({ queryKey, state, queryHash, meta, promise, dehydratedAt, queryType }) => {
		const syncData = promise ? tryResolveSync(promise) : void 0;
		const rawData = state.data === void 0 ? syncData?.data : state.data;
		const data = rawData === void 0 ? rawData : deserializeData ? deserializeData(rawData) : rawData;
		let query = queryCache.get(queryHash);
		const existingQueryIsPending = query?.state.status === "pending";
		const existingQueryIsFetching = query?.state.fetchStatus === "fetching";
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
		} else query = queryCache.build(client, {
			...client.getDefaultOptions().hydrate?.queries,
			...options?.defaultOptions?.queries,
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
		if (promise && !syncData && !existingQueryIsPending && !existingQueryIsFetching && dehydratedAt > query.state.dataUpdatedAt) query.fetch(void 0, { initialPromise: Promise.resolve(promise).then(deserializeData) }).catch(require_utils.noop);
	});
}
//#endregion
exports.defaultShouldDehydrateMutation = defaultShouldDehydrateMutation;
exports.defaultShouldDehydrateQuery = defaultShouldDehydrateQuery;
exports.dehydrate = dehydrate;
exports.dehydrateQuery = dehydrateQuery;
exports.hydrate = hydrate;

//# sourceMappingURL=hydration.cjs.map