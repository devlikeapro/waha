Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_classPrivateFieldSet2 = require("./classPrivateFieldSet2-Bo0ZyOIv.cjs");
const require_utils = require("./utils.cjs");
const require_subscribable = require("./subscribable.cjs");
const require_notifyManager = require("./notifyManager.cjs");
const require_mutation = require("./mutation.cjs");
//#region src/mutationCache.ts
var _mutations = /* @__PURE__ */ new WeakMap();
var _scopes = /* @__PURE__ */ new WeakMap();
var _mutationId = /* @__PURE__ */ new WeakMap();
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
var MutationCache = class extends require_subscribable.Subscribable {
	constructor(config = {}) {
		super();
		this.config = config;
		require_classPrivateFieldSet2._classPrivateFieldInitSpec(this, _mutations, void 0);
		require_classPrivateFieldSet2._classPrivateFieldInitSpec(this, _scopes, void 0);
		require_classPrivateFieldSet2._classPrivateFieldInitSpec(this, _mutationId, void 0);
		require_classPrivateFieldSet2._classPrivateFieldSet2(_mutations, this, /* @__PURE__ */ new Set());
		require_classPrivateFieldSet2._classPrivateFieldSet2(_scopes, this, /* @__PURE__ */ new Map());
		require_classPrivateFieldSet2._classPrivateFieldSet2(_mutationId, this, 0);
	}
	/** @internal */
	build(client, options, state) {
		var _this$mutationId;
		const mutation = new require_mutation.Mutation({
			client,
			mutationCache: this,
			mutationId: require_classPrivateFieldSet2._classPrivateFieldSet2(_mutationId, this, (_this$mutationId = require_classPrivateFieldSet2._classPrivateFieldGet2(_mutationId, this), ++_this$mutationId)),
			options: client.defaultMutationOptions(options),
			state
		});
		this.add(mutation);
		return mutation;
	}
	/** @internal */
	add(mutation) {
		require_classPrivateFieldSet2._classPrivateFieldGet2(_mutations, this).add(mutation);
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const scopedMutations = require_classPrivateFieldSet2._classPrivateFieldGet2(_scopes, this).get(scope);
			if (scopedMutations) scopedMutations.push(mutation);
			else require_classPrivateFieldSet2._classPrivateFieldGet2(_scopes, this).set(scope, [mutation]);
		}
		this.notify({
			type: "added",
			mutation
		});
	}
	/** @internal */
	remove(mutation) {
		if (require_classPrivateFieldSet2._classPrivateFieldGet2(_mutations, this).delete(mutation)) {
			const scope = scopeFor(mutation);
			if (typeof scope === "string") {
				const scopedMutations = require_classPrivateFieldSet2._classPrivateFieldGet2(_scopes, this).get(scope);
				if (scopedMutations) {
					if (scopedMutations.length > 1) {
						const index = scopedMutations.indexOf(mutation);
						if (index !== -1) scopedMutations.splice(index, 1);
					} else if (scopedMutations[0] === mutation) require_classPrivateFieldSet2._classPrivateFieldGet2(_scopes, this).delete(scope);
				}
			}
		}
		this.notify({
			type: "removed",
			mutation
		});
	}
	/** @internal */
	canRun(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const mutationsWithSameScope = require_classPrivateFieldSet2._classPrivateFieldGet2(_scopes, this).get(scope);
			const firstPendingMutation = mutationsWithSameScope === null || mutationsWithSameScope === void 0 ? void 0 : mutationsWithSameScope.find((m) => m.state.status === "pending");
			return !firstPendingMutation || firstPendingMutation === mutation;
		} else return true;
	}
	/** @internal */
	runNext(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			var _classPrivateFieldGet2$1;
			const foundMutation = (_classPrivateFieldGet2$1 = require_classPrivateFieldSet2._classPrivateFieldGet2(_scopes, this).get(scope)) === null || _classPrivateFieldGet2$1 === void 0 ? void 0 : _classPrivateFieldGet2$1.find((m) => m !== mutation && m.state.isPaused);
			return (foundMutation === null || foundMutation === void 0 ? void 0 : foundMutation.continue()) ?? Promise.resolve();
		} else return Promise.resolve();
	}
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
	clear() {
		require_notifyManager.notifyManager.batch(() => {
			require_classPrivateFieldSet2._classPrivateFieldGet2(_mutations, this).forEach((mutation) => {
				this.notify({
					type: "removed",
					mutation
				});
			});
			require_classPrivateFieldSet2._classPrivateFieldGet2(_mutations, this).clear();
			require_classPrivateFieldSet2._classPrivateFieldGet2(_scopes, this).clear();
		});
	}
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
	getAll() {
		return Array.from(require_classPrivateFieldSet2._classPrivateFieldGet2(_mutations, this));
	}
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
	find(filters) {
		const defaultedFilters = {
			exact: true,
			...filters
		};
		return this.getAll().find((mutation) => require_utils.matchMutation(defaultedFilters, mutation));
	}
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
	findAll(filters = {}) {
		return this.getAll().filter((mutation) => require_utils.matchMutation(filters, mutation));
	}
	/** @internal */
	notify(event) {
		require_notifyManager.notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(event);
			});
		});
	}
	/** @internal */
	resumePausedMutations() {
		const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
		return require_notifyManager.notifyManager.batch(() => Promise.all(pausedMutations.map((mutation) => mutation.continue().catch(require_utils.noop))));
	}
};
function scopeFor(mutation) {
	var _mutation$options$sco;
	return (_mutation$options$sco = mutation.options.scope) === null || _mutation$options$sco === void 0 ? void 0 : _mutation$options$sco.id;
}
//#endregion
exports.MutationCache = MutationCache;

//# sourceMappingURL=mutationCache.cjs.map