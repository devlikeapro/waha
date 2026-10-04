import { CacheableMemory, KeyvCacheableMemory, createKeyv, createKeyv as createKeyv$1 } from "@cacheable/memory";
import { CacheTags, CacheTags as CacheTags$1, HashAlgorithm, HashAlgorithm as HashAlgorithm$1, Stats, Stats as CacheableStats, calculateTtlFromExpiration, calculateTtlFromExpiration as calculateTtlFromExpiration$1, getCascadingTtl, getCascadingTtl as getCascadingTtl$1, getOrSet, getOrSet as getOrSet$1, hash, hash as hash$1, hashSync, isKeyvInstance, resolvePerStoreTtl, shorthandToMilliseconds, shorthandToMilliseconds as shorthandToMilliseconds$1, shorthandToTime, wrap, wrap as wrap$1, wrapSync } from "@cacheable/utils";
import { Hookified } from "hookified";
import { Keyv, Keyv as Keyv$1, KeyvHooks } from "keyv";
import { Qified } from "qified";
//#region src/enums.ts
let CacheableHooks = /* @__PURE__ */ function(CacheableHooks) {
	CacheableHooks["BEFORE_SET"] = "BEFORE_SET";
	CacheableHooks["AFTER_SET"] = "AFTER_SET";
	CacheableHooks["BEFORE_SET_MANY"] = "BEFORE_SET_MANY";
	CacheableHooks["AFTER_SET_MANY"] = "AFTER_SET_MANY";
	CacheableHooks["BEFORE_GET"] = "BEFORE_GET";
	CacheableHooks["AFTER_GET"] = "AFTER_GET";
	CacheableHooks["BEFORE_GET_MANY"] = "BEFORE_GET_MANY";
	CacheableHooks["AFTER_GET_MANY"] = "AFTER_GET_MANY";
	CacheableHooks["BEFORE_SECONDARY_SETS_PRIMARY"] = "BEFORE_SECONDARY_SETS_PRIMARY";
	return CacheableHooks;
}({});
let CacheableEvents = /* @__PURE__ */ function(CacheableEvents) {
	CacheableEvents["ERROR"] = "error";
	CacheableEvents["CACHE_HIT"] = "cache:hit";
	CacheableEvents["CACHE_MISS"] = "cache:miss";
	return CacheableEvents;
}({});
//#endregion
//#region src/sync.ts
/**
* Events emitted by CacheableSync
*/
let CacheableSyncEvents = /* @__PURE__ */ function(CacheableSyncEvents) {
	CacheableSyncEvents["ERROR"] = "error";
	CacheableSyncEvents["SET"] = "cache:set";
	CacheableSyncEvents["DELETE"] = "cache:delete";
	return CacheableSyncEvents;
}({});
/**
* CacheableSync provides synchronization capabilities for cacheable items
* using message providers from Qified
*/
var CacheableSync = class extends Hookified {
	_qified = new Qified();
	_namespace;
	_storage;
	_cacheId;
	/**
	* Creates an instance of CacheableSync
	* @param options - Configuration options for CacheableSync
	*/
	constructor(options) {
		super(options);
		this._namespace = options.namespace;
		this._qified = this.createQified(options.qified);
	}
	/**
	* Gets the Qified instance used for synchronization
	* @returns The Qified instance
	*/
	get qified() {
		return this._qified;
	}
	/**
	* Sets the Qified instance used for synchronization
	* @param value - Either an existing Qified instance or MessageProvider(s)
	*/
	set qified(value) {
		this._qified = this.createQified(value);
	}
	/**
	* Gets the namespace for sync events
	* @returns The namespace or undefined if not set
	*/
	get namespace() {
		return this._namespace;
	}
	/**
	* Sets the namespace for sync events and resubscribes if needed
	* @param namespace - The namespace string or function
	*/
	set namespace(namespace) {
		if (this._storage && this._cacheId) {
			const oldSetEvent = this.getPrefixedEvent("cache:set");
			const oldDeleteEvent = this.getPrefixedEvent("cache:delete");
			this._qified.unsubscribeMessage(oldSetEvent);
			this._qified.unsubscribeMessage(oldDeleteEvent);
		}
		this._namespace = namespace;
		if (this._storage && this._cacheId) this.subscribe(this._storage, this._cacheId);
	}
	/**
	* Publishes a cache event to all the cache instances
	* @param data - The cache item data containing cacheId, key, value, and optional ttl
	*/
	async publish(event, data) {
		const eventName = this.getPrefixedEvent(event);
		await this._qified.publish(eventName, {
			id: crypto.randomUUID(),
			data
		});
	}
	/**
	* Subscribes to sync events and updates the provided storage
	* @param storage - The Keyv storage instance to update
	* @param cacheId - The cache ID to identify this instance
	*/
	subscribe(storage, cacheId) {
		this._storage = storage;
		this._cacheId = cacheId;
		const setEvent = this.getPrefixedEvent("cache:set");
		const deleteEvent = this.getPrefixedEvent("cache:delete");
		this._qified.subscribe(setEvent, { handler: async (message) => {
			const data = message.data;
			if (data.cacheId !== cacheId) await storage.set(data.key, data.value, data.ttl);
		} });
		this._qified.subscribe(deleteEvent, { handler: async (message) => {
			const data = message.data;
			if (data.cacheId !== cacheId) await storage.delete(data.key);
		} });
	}
	/**
	* Creates or returns a Qified instance from the provided value
	* @param value - Either an existing Qified instance or MessageProvider(s)
	* @returns A Qified instance configured with the provided message provider(s)
	*/
	createQified(value) {
		if (value instanceof Qified) return value;
		return new Qified({ messageProviders: Array.isArray(value) ? value : [value] });
	}
	/**
	* Gets the namespace prefix to use for event names
	* @returns The resolved namespace string or undefined
	*/
	getNamespace() {
		if (typeof this._namespace === "function") return this._namespace();
		return this._namespace;
	}
	/**
	* Prefixes an event name with the namespace if one is set
	* @param event - The event to prefix
	* @returns The prefixed event name or the original event
	*/
	getPrefixedEvent(event) {
		const ns = this.getNamespace();
		return ns ? `${ns}::${event}` : event;
	}
};
//#endregion
//#region src/index.ts
var Cacheable = class Cacheable extends Hookified {
	static _instance;
	_primary = createKeyv$1();
	_secondary;
	_nonBlocking = false;
	_ttl;
	_maxTtl;
	_stats = new Stats({ enabled: false });
	_namespace;
	_cacheId = Math.random().toString(36).slice(2);
	_sync;
	_tags = this.createCacheTags();
	/**
	* Creates a new cacheable instance
	* @param {CacheableOptions} [options] The options for the cacheable instance
	*/
	constructor(options) {
		super();
		if (options?.primary) this.setPrimary(options.primary);
		if (options?.secondary) this.setSecondary(options.secondary);
		if (options?.nonBlocking) this._nonBlocking = options.nonBlocking;
		if (options?.stats) this._stats.enabled = options.stats;
		if (options?.ttl) this.setTtl(options.ttl);
		if (options?.maxTtl !== void 0) this.setMaxTtl(options.maxTtl);
		if (options?.cacheId) this._cacheId = options.cacheId;
		if (options?.namespace) {
			this._namespace = options.namespace;
			this._primary.namespace = this.getNameSpace();
			if (this._secondary) this._secondary.namespace = this.getNameSpace();
		}
		if (options?.tags) this._tags.enabled = true;
		if (options?.sync) {
			this._sync = options.sync instanceof CacheableSync ? options.sync : new CacheableSync({
				...options.sync,
				namespace: options.namespace
			});
			this._sync.subscribe(this._primary, this._cacheId);
		}
	}
	/**
	* Gets a shared static (singleton) instance of {@link Cacheable}. The first call creates the
	* instance using the provided options; every later call returns that same instance. Passing
	* `options` again after the instance already exists does NOT reconfigure it — the options are
	* ignored and a {@link CacheableEvents.ERROR} event is emitted on the instance to surface the
	* conflict (listen with `instance.on("error", ...)`). To reconfigure, replace it via
	* {@link Cacheable.setStaticInstance} (clear with `undefined`, then call this again).
	*
	* Note: this package ships separate CommonJS and ESM builds, so an app that loads both formats
	* gets one shared instance per build. For a single shared cache, use one module format or share
	* an explicit instance via {@link Cacheable.setStaticInstance}.
	* @param {CacheableOptions} [options] Options applied only when the instance is first created
	* @returns {Cacheable} The shared static instance
	* @example
	* ```ts
	* const cache = Cacheable.getStaticInstance({ ttl: "1h" });
	* await cache.set("key", "value");
	* ```
	*/
	static getStaticInstance(options) {
		if (options && Cacheable._instance) {
			Cacheable._instance.emit("error", /* @__PURE__ */ new Error("Cacheable static instance is already initialized; the options passed were ignored. To reconfigure, use Cacheable.setStaticInstance()."));
			return Cacheable._instance;
		}
		Cacheable._instance ??= new Cacheable(options);
		return Cacheable._instance;
	}
	/**
	* Sets or clears the shared static instance returned by {@link Cacheable.getStaticInstance}.
	* Pass a {@link Cacheable} instance to make it the shared instance, or `undefined` to clear it
	* so the next {@link Cacheable.getStaticInstance} call creates a fresh one. Clearing only drops
	* the reference — it does not `disconnect()` or `clear()` the previous instance, so disconnect
	* it first if it holds open connections.
	* @param {Cacheable} [instance] The instance to share, or `undefined` to clear it
	*/
	static setStaticInstance(instance) {
		Cacheable._instance = instance;
	}
	onHook(event, handler) {
		super.onHook(event, handler);
	}
	/**
	* The namespace for the cacheable instance
	* @returns {string | (() => string) | undefined} The namespace for the cacheable instance
	*/
	get namespace() {
		return this._namespace;
	}
	/**
	* Sets the namespace for the cacheable instance
	* @param {string | (() => string) | undefined} namespace The namespace for the cacheable instance
	* @returns {void}
	*/
	set namespace(namespace) {
		this._namespace = namespace;
		this._primary.namespace = this.getNameSpace();
		if (this._secondary) this._secondary.namespace = this.getNameSpace();
		if (this._sync) this._sync.namespace = namespace;
	}
	/**
	* The statistics for the cacheable instance
	* @returns {CacheableStats} The statistics for the cacheable instance
	*/
	get stats() {
		return this._stats;
	}
	/**
	* The primary store for the cacheable instance
	* @returns {Keyv} The primary store for the cacheable instance
	*/
	get primary() {
		return this._primary;
	}
	/**
	* Sets the primary store for the cacheable instance
	* @param {Keyv} primary The primary store for the cacheable instance
	*/
	set primary(primary) {
		this._primary = primary;
		this._tags = this.createCacheTags();
	}
	/**
	* The secondary store for the cacheable instance
	* @returns {Keyv | undefined} The secondary store for the cacheable instance
	*/
	get secondary() {
		return this._secondary;
	}
	/**
	* Sets the secondary store for the cacheable instance. If it is set to undefined then the secondary store is disabled.
	* @param {Keyv | undefined} secondary The secondary store for the cacheable instance
	* @returns {void}
	*/
	set secondary(secondary) {
		this._secondary = secondary;
		this._tags = this.createCacheTags();
	}
	/**
	* Gets whether the secondary store is non-blocking mode. It is set to false by default.
	* If it is set to true then the secondary store will not block the primary store.
	*
	* [Learn more about non-blocking mode](https://cacheable.org/docs/cacheable/#non-blocking-operations).
	*
	* @returns {boolean} Whether the cacheable instance is non-blocking
	*/
	get nonBlocking() {
		return this._nonBlocking;
	}
	/**
	* Sets whether the secondary store is non-blocking mode. It is set to false by default.
	* If it is set to true then the secondary store will not block the primary store.
	*
	* [Learn more about non-blocking mode](https://cacheable.org/docs/cacheable/#non-blocking-operations).
	*
	* @param {boolean} nonBlocking Whether the cacheable instance is non-blocking
	* @returns {void}
	*/
	set nonBlocking(nonBlocking) {
		this._nonBlocking = nonBlocking;
	}
	/**
	* The time-to-live for the cacheable instance and will be used as the default value.
	* can be a number in milliseconds or a human-readable format such as `1s` for 1 second or `1h` for 1 hour
	* or undefined if there is no time-to-live.
	*
	* [Learn more about time-to-live](https://cacheable.org/docs/cacheable/#shorthand-for-time-to-live-ttl).
	*
	* @returns {number | string | undefined} The time-to-live for the cacheable instance in milliseconds, human-readable format or undefined
	* @example
	* ```typescript
	* const cacheable = new Cacheable({ ttl: '1h' });
	* console.log(cacheable.ttl); // 1h
	* ```
	*/
	get ttl() {
		return this._ttl;
	}
	/**
	* Sets the time-to-live for the cacheable instance and will be used as the default value.
	* If you set a number it is miliseconds, if you set a string it is a human-readable
	* format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means that
	* there is no time-to-live.
	*
	* [Learn more about time-to-live](https://cacheable.org/docs/cacheable/#shorthand-for-time-to-live-ttl).
	*
	* @param {number | string | undefined} ttl The time-to-live for the cacheable instance
	* @example
	* ```typescript
	* const cacheable = new Cacheable();
	* cacheable.ttl = '1h'; // Set the time-to-live to 1 hour
	* ```
	* or setting the time-to-live in milliseconds
	* ```typescript
	* const cacheable = new Cacheable();
	* cacheable.ttl = 3600000; // Set the time-to-live to 1 hour
	* ```
	*/
	set ttl(ttl) {
		this.setTtl(ttl);
	}
	/**
	* Gets the maximum time-to-live for the cacheable instance. When set, any TTL that exceeds this
	* value is capped to maxTtl. Entries with no TTL will also be capped to maxTtl.
	* Can be a number in milliseconds or a human-readable format such as `1s`, `1m`, `1h`, `1d`.
	* Default is `undefined` (no maximum).
	*
	* @returns {number | string | undefined} The maximum time-to-live or undefined if not set
	* @example
	* ```typescript
	* const cacheable = new Cacheable({ maxTtl: '1h' });
	* console.log(cacheable.maxTtl); // '1h'
	* ```
	*/
	get maxTtl() {
		return this._maxTtl;
	}
	/**
	* Sets the maximum time-to-live for the cacheable instance. When set, any TTL that exceeds this
	* value is capped to maxTtl. Entries with no TTL will also be capped to maxTtl.
	* If you set a number it is milliseconds, if you set a string it is a human-readable
	* format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined disables the maximum.
	*
	* @param {number | string | undefined} maxTtl The maximum time-to-live
	* @example
	* ```typescript
	* const cacheable = new Cacheable();
	* cacheable.maxTtl = '1h'; // Set the max TTL to 1 hour
	* ```
	*/
	set maxTtl(maxTtl) {
		this.setMaxTtl(maxTtl);
	}
	/**
	* The cacheId for the cacheable instance. This is primarily used for the wrap function to not have conflicts.
	* If it is not set then it will be a random string that is generated
	* @returns {string} The cacheId for the cacheable instance
	*/
	get cacheId() {
		return this._cacheId;
	}
	/**
	* Sets the cacheId for the cacheable instance. This is primarily used for the wrap function to not have conflicts.
	* If it is not set then it will be a random string that is generated
	* @param {string} cacheId The cacheId for the cacheable instance
	*/
	set cacheId(cacheId) {
		this._cacheId = cacheId;
	}
	/**
	* Gets the sync instance for the cacheable instance
	* @returns {CacheableSync | undefined} The sync instance for the cacheable instance
	*/
	get sync() {
		return this._sync;
	}
	/**
	* Sets the sync instance for the cacheable instance
	* @param {CacheableSync | undefined} sync The sync instance for the cacheable instance
	*/
	set sync(sync) {
		this._sync = sync;
		if (this._sync) this._sync.subscribe(this._primary, this._cacheId);
	}
	/**
	* The tag service for the cacheable instance, used for tag-based invalidation. It is created
	* by default in the constructor and persists tag metadata in the secondary store when one is
	* configured (so invalidations are shared across instances), otherwise the primary store.
	*
	* The service starts disabled so untagged workloads pay no extra store reads, and must be
	* explicitly enabled to use tags — via the `tags: true` option or the `tags.enabled`
	* property. While disabled, all tag operations are no-ops. Enable it on every instance that
	* shares the store so behavior is consistent across distributed instances. While enabled,
	* `get` / `getMany` perform tag freshness checks and remove stale entries.
	*
	* [Learn more about tag-based invalidation](https://cacheable.org/docs/cacheable/#tag-based-invalidation).
	*
	* @returns {CacheTags} The tag service for the cacheable instance
	* @example
	* ```typescript
	* const cache = new Cacheable({ tags: true });
	* await cache.set('page:/products', html, { tags: ['entity:42'] });
	* await cache.tags.invalidateTag('entity:42');
	* await cache.get('page:/products'); // undefined
	* ```
	*/
	get tags() {
		return this._tags;
	}
	/**
	* Creates the tag service backed by the secondary store when one is configured, otherwise the
	* primary store, preserving the enabled state of any previous service and reporting
	* non-blocking failures as error events.
	*/
	createCacheTags() {
		return new CacheTags$1({
			store: this._secondary ?? this._primary,
			enabled: this._tags?.enabled ?? false,
			onError: (error) => {
				this.emit("error", error);
			}
		});
	}
	/**
	* Sets the primary store for the cacheable instance
	* @param {Keyv | KeyvStoreAdapter} primary The primary store for the cacheable instance
	* @returns {void}
	*/
	setPrimary(primary) {
		if (isKeyvInstance(primary)) this._primary = primary;
		else this._primary = new Keyv$1(primary);
		/* v8 ignore next -- @preserve */
		this._primary.on("error", (error) => {
			this.emit("error", error);
		});
		this._tags = this.createCacheTags();
	}
	/**
	* Sets the secondary store for the cacheable instance. If it is set to undefined then the secondary store is disabled.
	* @param {Keyv | KeyvStoreAdapter} secondary The secondary store for the cacheable instance
	* @returns {void}
	*/
	setSecondary(secondary) {
		if (isKeyvInstance(secondary)) this._secondary = secondary;
		else this._secondary = new Keyv$1(secondary);
		/* v8 ignore next -- @preserve */
		this._secondary.on("error", (error) => {
			this.emit("error", error);
		});
		this._tags = this.createCacheTags();
	}
	getNameSpace() {
		if (typeof this._namespace === "function") return this._namespace();
		return this._namespace;
	}
	/**
	* Retrieves an entry from the cache.
	*
	* Checks the primary store first; if not found and a secondary store is configured,
	* it will fetch from the secondary, repopulate the primary, and return the result.
	*
	* @typeParam T - The expected type of the stored value.
	* @param {string} key - The cache key to retrieve.
	* @param {GetOptions} - options such as to bypass `nonBlocking` for this call
	* @returns {Promise<T | undefined>}
	*   A promise that resolves to the cached value if found, or `undefined`.
	*/
	async get(key, options) {
		return (await this.getRaw(key, options))?.value;
	}
	/**
	* Retrieves the raw entry from the cache including metadata like expiration.
	*
	* Checks the primary store first; if not found and a secondary store is configured,
	* it will fetch from the secondary, repopulate the primary, and return the result.
	*
	* @typeParam T - The expected type of the stored value.
	* @param {string} key - The cache key to retrieve.
	* @param {GetOptions} - options such as to bypass `nonBlocking` for this call
	* @returns {Promise<StoredDataRaw<T>>}
	*   A promise that resolves to the full raw data object if found, or undefined.
	*/
	async getRaw(key, options) {
		let result;
		try {
			await this.hook("BEFORE_GET", key);
			result = await this._primary.getRaw(key);
			let ttl;
			if (result) this.emit("cache:hit", {
				key,
				value: result.value,
				store: "primary"
			});
			else this.emit("cache:miss", {
				key,
				store: "primary"
			});
			const nonBlocking = options?.nonBlocking ?? this._nonBlocking;
			if (!result && this._secondary) {
				let secondaryProcessResult;
				if (nonBlocking) secondaryProcessResult = await this.processSecondaryForGetRawNonBlocking(this._primary, this._secondary, key);
				else secondaryProcessResult = await this.processSecondaryForGetRaw(this._primary, this._secondary, key);
				if (secondaryProcessResult) {
					result = secondaryProcessResult.result;
					ttl = secondaryProcessResult.ttl;
				}
			}
			if (result && this._tags.enabled && await this._tags.isKeyStale(key)) {
				await this.delete(key);
				result = void 0;
			}
			await this.hook("AFTER_GET", {
				key,
				result,
				ttl
			});
		} catch (error) {
			this.emit("error", error);
		}
		if (this.stats.enabled) {
			if (result) this._stats.incrementHits();
			else this._stats.incrementMisses();
			this.stats.incrementGets();
		}
		return result;
	}
	/**
	* Retrieves multiple raw entries from the cache including metadata like expiration.
	*
	* Checks the primary store for each key; if a key is missing and a secondary store is configured,
	* it will fetch from the secondary store, repopulate the primary store, and return the results.
	*
	* @typeParam T - The expected type of the stored values.
	* @param {string[]} keys - The cache keys to retrieve.
	* @param {GetOptions} - options such as to bypass `nonBlocking` on this call
	* @returns {Promise<Array<StoredDataRaw<T>>>}
	*   A promise that resolves to an array of raw data objects.
	*/
	async getManyRaw(keys, options) {
		let result = [];
		try {
			await this.hook("BEFORE_GET_MANY", keys);
			result = await this._primary.getManyRaw(keys);
			for (const [i, key] of keys.entries()) if (result[i]) this.emit("cache:hit", {
				key,
				value: result[i].value,
				store: "primary"
			});
			else this.emit("cache:miss", {
				key,
				store: "primary"
			});
			const nonBlocking = options?.nonBlocking ?? this._nonBlocking;
			if (this._secondary) if (nonBlocking) await this.processSecondaryForGetManyRawNonBlocking(this._primary, this._secondary, keys, result);
			else await this.processSecondaryForGetManyRaw(this._primary, this._secondary, keys, result);
			if (this._tags.enabled) {
				const presentKeys = keys.filter((_, i) => result[i] !== void 0);
				const staleKeys = await this._tags.getStaleKeys(presentKeys);
				if (staleKeys.length > 0) {
					const staleSet = new Set(staleKeys);
					for (const [i, key] of keys.entries()) if (staleSet.has(key)) result[i] = void 0;
					await this.deleteMany(staleKeys);
				}
			}
			await this.hook("AFTER_GET_MANY", {
				keys,
				result
			});
		} catch (error) {
			this.emit("error", error);
		}
		if (this.stats.enabled) {
			for (const item of result) if (item) this._stats.incrementHits();
			else this._stats.incrementMisses();
			this.stats.incrementGets();
		}
		return result;
	}
	/**
	* Retrieves multiple entries from the cache.
	* Checks the primary store for each key; if a key is missing and a secondary store is configured,
	* it will fetch from the secondary store, repopulate the primary store, and return the results.
	*
	* @typeParam T - The expected type of the stored values.
	* @param {string[]} keys - The cache keys to retrieve.
	* @param {GetOptions} - options such as to bypass `nonBlocking` on this call
	* @returns {Promise<Array<T | undefined>>}
	*   A promise that resolves to an array of cached values or `undefined` for misses.
	*/
	async getMany(keys, options) {
		return (await this.getManyRaw(keys, options)).map((item) => item?.value);
	}
	/**
	* Sets the value of the key. If the secondary store is set then it will also set the value in the secondary store.
	* @param {string} key the key to set the value of
	* @param {T} value The value to set
	* @param {number | string | SetOptions} [ttlOrOptions] set a number it is miliseconds, set a string it is a human-readable
	* format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means that it will use the default time-to-live.
	* You can also pass a {@link SetOptions} object such as `{ ttl: '1h', tags: ['user:42'] }` to associate the entry with
	* tags for tag-based invalidation. To give each store its own TTL for this operation, pass a per-store object as the
	* `ttl`, such as `{ ttl: { primary: '10s', secondary: '5m' } }`.
	* @returns {boolean} Whether the value was set
	*/
	async set(key, value, ttlOrOptions) {
		let result = false;
		const options = typeof ttlOrOptions === "object" && ttlOrOptions !== null ? ttlOrOptions : { ttl: ttlOrOptions ?? void 0 };
		const nonBlocking = options.nonBlocking ?? this._nonBlocking;
		const { primary: explicitPrimaryTtl, secondary: explicitSecondaryTtl } = resolvePerStoreTtl(options.ttl);
		const maxTtlMs = shorthandToMilliseconds$1(this._maxTtl);
		try {
			let primaryTtl = getCascadingTtl$1(this._ttl, this._primary.ttl, explicitPrimaryTtl);
			primaryTtl = this.capTtl(primaryTtl, maxTtlMs);
			let hookTtl = primaryTtl;
			let ttlOverridden = false;
			const item = {
				key,
				value,
				tags: options.tags,
				get ttl() {
					return hookTtl;
				},
				set ttl(value) {
					hookTtl = value;
					ttlOverridden = true;
				}
			};
			await this.hook("BEFORE_SET", item);
			let primaryTtlEffective;
			let secondaryTtlEffective;
			if (!ttlOverridden) {
				primaryTtlEffective = primaryTtl;
				secondaryTtlEffective = this._secondary ? getCascadingTtl$1(this._ttl, this._secondary.ttl, explicitSecondaryTtl) : void 0;
			} else if (typeof hookTtl === "object" && hookTtl !== null) {
				const { primary: hookPrimaryTtl, secondary: hookSecondaryTtl } = resolvePerStoreTtl(hookTtl);
				primaryTtlEffective = hookPrimaryTtl ?? getCascadingTtl$1(this._ttl, this._primary.ttl, explicitPrimaryTtl);
				secondaryTtlEffective = this._secondary ? hookSecondaryTtl ?? getCascadingTtl$1(this._ttl, this._secondary.ttl, explicitSecondaryTtl) : void 0;
			} else {
				const hookScalarTtl = shorthandToMilliseconds$1(hookTtl);
				primaryTtlEffective = hookScalarTtl;
				secondaryTtlEffective = this._secondary ? hookScalarTtl : void 0;
			}
			primaryTtlEffective = this.capTtl(primaryTtlEffective, maxTtlMs);
			secondaryTtlEffective = this.capTtl(secondaryTtlEffective, maxTtlMs);
			hookTtl = primaryTtlEffective;
			const tagTtl = this.maxStoreTtl(primaryTtlEffective, secondaryTtlEffective);
			const promises = [];
			promises.push(this._primary.set(item.key, item.value, primaryTtlEffective));
			if (this._secondary) promises.push(this._secondary.set(item.key, item.value, secondaryTtlEffective));
			if (nonBlocking) {
				result = await Promise.race(promises);
				for (const promise of promises) promise.catch((error) => {
					this.emit("error", error);
				});
			} else result = (await Promise.all(promises))[0];
			if (this._tags.enabled) if (item.tags && item.tags.length > 0) await this._tags.setKeyTags(item.key, item.tags, {
				ttl: tagTtl,
				nonBlocking
			});
			else await this._tags.removeKeys([item.key], { nonBlocking });
			await this.hook("AFTER_SET", item);
			if (this._sync && result) await this._sync.publish("cache:set", {
				cacheId: this._cacheId,
				key: item.key,
				value: item.value,
				ttl: primaryTtlEffective
			});
		} catch (error) {
			this.emit("error", error);
		}
		if (this.stats.enabled) {
			this.stats.incrementKSize(key);
			this.stats.incrementCount();
			this.stats.incrementVSize(value);
			this.stats.incrementSets();
		}
		return result;
	}
	/**
	* Sets the values of the keys. If the secondary store is set then it will also set the values in the secondary store.
	* Items can include `tags` to associate the entry with tags for tag-based invalidation.
	* @param {CacheableSetItem[]} items The items to set
	* @returns {boolean} Whether the values were set
	*/
	async setMany(items) {
		let result = false;
		try {
			await this.hook("BEFORE_SET_MANY", items);
			result = await this.setManyKeyv(this._primary, items, "primary");
			if (this._secondary) if (this._nonBlocking)
 /* v8 ignore next -- @preserve */
			this.setManyKeyv(this._secondary, items, "secondary").catch((error) => {
				/* v8 ignore next -- @preserve */
				this.emit("error", error);
			});
			else await this.setManyKeyv(this._secondary, items, "secondary");
			if (this._tags.enabled) await this.setManyKeyTags(items);
			await this.hook("AFTER_SET_MANY", items);
			if (this._sync && result) {
				const maxTtlMs = shorthandToMilliseconds$1(this._maxTtl);
				for (const item of items) await this._sync.publish("cache:set", {
					cacheId: this._cacheId,
					key: item.key,
					value: item.value,
					ttl: this.resolveStoreTtl(item.ttl, this._primary.ttl, "primary", maxTtlMs)
				});
			}
		} catch (error) {
			this.emit("error", error);
		}
		if (this.stats.enabled) for (const item of items) {
			this.stats.incrementKSize(item.key);
			this.stats.incrementCount();
			this.stats.incrementVSize(item.value);
		}
		return result;
	}
	/**
	* Takes the value of the key and deletes the key. If the key does not exist then it will return undefined.
	* @param {string} key The key to take the value of
	* @returns {Promise<T | undefined>} The value of the key or undefined if the key does not exist
	*/
	async take(key) {
		const result = await this.get(key);
		await this.delete(key);
		return result;
	}
	/**
	* Takes the values of the keys and deletes the keys. If the key does not exist then it will return undefined.
	* @param {string[]} keys The keys to take the values of
	* @returns {Promise<Array<T | undefined>>} The values of the keys or undefined if the key does not exist
	*/
	async takeMany(keys) {
		const result = await this.getMany(keys);
		await this.deleteMany(keys);
		return result;
	}
	/**
	* Checks if the key exists in the primary store. If it does not exist then it will check the secondary store.
	* @param {string} key The key to check
	* @returns {Promise<boolean>} Whether the key exists
	*/
	async has(key) {
		const promises = [];
		promises.push(this._primary.has(key));
		if (this._secondary) promises.push(this._secondary.has(key));
		const resultAll = await Promise.all(promises);
		for (const result of resultAll) if (result) return true;
		return false;
	}
	/**
	* Checks if the keys exist in the primary store. If it does not exist then it will check the secondary store.
	* @param {string[]} keys The keys to check
	* @returns {Promise<boolean[]>} Whether the keys exist
	*/
	async hasMany(keys) {
		const result = await this._primary.hasMany(keys);
		const missingKeys = [];
		for (const [i, key] of keys.entries()) if (!result[i] && this._secondary) missingKeys.push(key);
		if (missingKeys.length > 0 && this._secondary) {
			const secondary = await this._secondary.hasMany(keys);
			for (const [i, _key] of keys.entries()) if (!result[i] && secondary[i]) result[i] = secondary[i];
		}
		return result;
	}
	/**
	* Deletes the key from the primary store. If the secondary store is set then it will also delete the key from the secondary store.
	* @param {string} key The key to delete
	* @returns {Promise<boolean>} Whether the key was deleted
	*/
	async delete(key) {
		let result = false;
		const promises = [];
		if (this.stats.enabled) {
			const statResult = await this._primary.get(key);
			/* v8 ignore next -- @preserve */
			if (statResult) {
				this.stats.decreaseKSize(key);
				this.stats.decreaseVSize(statResult);
				this.stats.decreaseCount();
				this.stats.incrementDeletes();
			}
		}
		promises.push(this._primary.delete(key));
		if (this._secondary) promises.push(this._secondary.delete(key));
		if (this.nonBlocking) {
			result = await Promise.race(promises);
			for (const promise of promises) promise.catch((error) => {
				this.emit("error", error);
			});
		} else result = (await Promise.all(promises))[0];
		if (this._tags.enabled) await this._tags.removeKeys([key], { nonBlocking: this.nonBlocking });
		if (this._sync && result) await this._sync.publish("cache:delete", {
			cacheId: this._cacheId,
			key
		});
		return result;
	}
	/**
	* Deletes the keys from the primary store. If the secondary store is set then it will also delete the keys from the secondary store.
	* @param {string[]} keys The keys to delete
	* @returns {Promise<boolean>} Whether the keys were deleted
	*/
	async deleteMany(keys) {
		if (this.stats.enabled) {
			const statResult = await this._primary.get(keys);
			for (const key of keys) {
				this.stats.decreaseKSize(key);
				this.stats.decreaseVSize(statResult);
				this.stats.decreaseCount();
				this.stats.incrementDeletes();
			}
		}
		const result = await this._primary.deleteMany(keys);
		if (this._secondary) if (this._nonBlocking) this._secondary.deleteMany(keys).catch((error) => {
			this.emit("error", error);
		});
		else await this._secondary.deleteMany(keys);
		if (this._tags.enabled) await this._tags.removeKeys(keys, { nonBlocking: this._nonBlocking });
		if (this._sync && result) for (const key of keys) await this._sync.publish("cache:delete", {
			cacheId: this._cacheId,
			key
		});
		return result;
	}
	/**
	* Clears the primary store. If the secondary store is set then it will also clear the secondary store.
	* @returns {Promise<void>}
	*/
	async clear() {
		const promises = [];
		promises.push(this._primary.clear());
		if (this._secondary) promises.push(this._secondary.clear());
		await (this._nonBlocking ? Promise.race(promises) : Promise.all(promises));
		if (this.stats.enabled) {
			this._stats.resetStoreValues();
			this._stats.incrementClears();
		}
	}
	/**
	* Disconnects the primary store. If the secondary store is set then it will also disconnect the secondary store.
	* @returns {Promise<void>}
	*/
	async disconnect() {
		const promises = [];
		promises.push(this._primary.disconnect());
		/* v8 ignore next -- @preserve */
		if (this._secondary) promises.push(this._secondary.disconnect());
		promises.push(this._sync?.qified.disconnect());
		await (this._nonBlocking ? Promise.race(promises) : Promise.all(promises));
	}
	/**
	* Wraps a function with caching
	*
	* [Learn more about wrapping functions](https://cacheable.org/docs/cacheable/#wrap--memoization-for-sync-and-async-functions).
	* @param {Function} function_ The function to wrap
	* @param {WrapOptions} [options] The options for the wrap function
	* @returns {Function} The wrapped function
	*/
	wrap(function_, options) {
		return wrap$1(function_, {
			ttl: options?.ttl ?? this._ttl,
			keyPrefix: options?.keyPrefix,
			createKey: options?.createKey,
			cacheErrors: options?.cacheErrors,
			cache: {
				get: async (key) => this.get(key),
				/* v8 ignore next -- @preserve */
				has: async (key) => this.has(key),
				set: async (key, value, ttl) => {
					await this.set(key, value, { ttl });
				},
				/* v8 ignore next -- @preserve */
				on: (event, listener) => {
					this.on(event, listener);
				},
				/* v8 ignore next -- @preserve */
				emit: (event, ...args) => this.emit(event, ...args)
			},
			cacheId: this._cacheId,
			serialize: options?.serialize
		});
	}
	/**
	* Retrieves the value associated with the given key from the cache. If the key is not found,
	* invokes the provided function to calculate the value, stores it in the cache, and then returns it.
	*
	* @param {GetOrSetKey} key - The key to retrieve or set in the cache. This can also be a function that returns a string key.
	* If a function is provided, it will be called with the cache options to generate the key.
	* @param {() => Promise<T>} function_ - The asynchronous function that computes the value to be cached if the key does not exist.
	* @param {GetOrSetFunctionOptions} [options] - Optional settings for caching, such as the time to live (TTL) or whether to cache errors.
	* @return {Promise<T | undefined>} - A promise that resolves to the cached or newly computed value, or undefined if an error occurs and caching is not configured for errors.
	*/
	async getOrSet(key, function_, options) {
		const getOptions = options?.nonBlocking === void 0 ? void 0 : { nonBlocking: options.nonBlocking };
		return getOrSet$1(key, function_, {
			cache: {
				get: async (key) => this.get(key, getOptions),
				/* v8 ignore next -- @preserve */
				has: async (key) => this.has(key),
				set: async (key, value, ttl) => {
					await this.set(key, value, { ttl });
				},
				/* v8 ignore next -- @preserve */
				on: (event, listener) => {
					/* v8 ignore next -- @preserve */
					this.on(event, listener);
				},
				emit: (event, ...args) => this.emit(event, ...args)
			},
			cacheId: this._cacheId,
			ttl: options?.ttl ?? this._ttl,
			cacheErrors: options?.cacheErrors,
			throwErrors: options?.throwErrors,
			nonBlocking: options?.nonBlocking
		});
	}
	/**
	* Will hash an object asynchronously using the specified cryptographic algorithm.
	* Use this for cryptographic algorithms (SHA-256, SHA-384, SHA-512).
	* For non-cryptographic algorithms, use hashSync() for better performance.
	* @param {any} object the object to hash
	* @param {string} algorithm the hash algorithm to use. The default is 'SHA-256'
	* @returns {Promise<string>} the hash of the object
	*/
	async hash(object, algorithm = HashAlgorithm$1.SHA256) {
		return hash$1(object, { algorithm });
	}
	/**
	* Will hash an object synchronously using the specified non-cryptographic algorithm.
	* Use this for non-cryptographic algorithms (DJB2, FNV1, MURMER, CRC32).
	* For cryptographic algorithms, use hash() instead.
	* @param {any} object the object to hash
	* @param {string} algorithm the hash algorithm to use. The default is 'djb2'
	* @returns {string} the hash of the object
	*/
	hashSync(object, algorithm = HashAlgorithm$1.DJB2) {
		return hashSync(object, { algorithm });
	}
	async setManyKeyv(keyv, items, store) {
		const maxTtlMs = shorthandToMilliseconds$1(this._maxTtl);
		const entries = [];
		for (const item of items) {
			const finalTtl = this.resolveStoreTtl(item.ttl, keyv.ttl, store, maxTtlMs);
			entries.push({
				key: item.key,
				value: item.value,
				ttl: finalTtl
			});
		}
		await keyv.setMany(entries);
		return true;
	}
	/**
	* Writes tag snapshots for `setMany` items that carry tags and removes any previous snapshots
	* for items that do not.
	*/
	async setManyKeyTags(items) {
		const maxTtlMs = shorthandToMilliseconds$1(this._maxTtl);
		const promises = [];
		const untaggedKeys = [];
		for (const item of items) {
			if (!item.tags || item.tags.length === 0) {
				untaggedKeys.push(item.key);
				continue;
			}
			const primaryTtl = this.resolveStoreTtl(item.ttl, this._primary.ttl, "primary", maxTtlMs);
			const secondaryTtl = this._secondary ? this.resolveStoreTtl(item.ttl, this._secondary.ttl, "secondary", maxTtlMs) : void 0;
			const ttl = this.maxStoreTtl(primaryTtl, secondaryTtl);
			promises.push(this._tags.setKeyTags(item.key, item.tags, {
				ttl,
				nonBlocking: this._nonBlocking
			}));
		}
		if (untaggedKeys.length > 0) promises.push(this._tags.removeKeys(untaggedKeys, { nonBlocking: this._nonBlocking }));
		await Promise.all(promises);
	}
	/**
	* Processes a single key from secondary store for getRaw operation
	* @param primary - the primary store to use
	* @param secondary - the secondary store to use
	* @param key - The key to retrieve from secondary store
	* @returns Promise containing the result and TTL information
	*/
	async processSecondaryForGetRaw(primary, secondary, key) {
		const secondaryResult = await secondary.getRaw(key);
		if (secondaryResult?.value) {
			this.emit("cache:hit", {
				key,
				value: secondaryResult.value,
				store: "secondary"
			});
			const ttl = calculateTtlFromExpiration$1(getCascadingTtl$1(this._ttl, this._primary.ttl), secondaryResult.expires ?? void 0);
			const setItem = {
				key,
				value: secondaryResult.value,
				ttl
			};
			await this.hook("BEFORE_SECONDARY_SETS_PRIMARY", setItem);
			await primary.set(setItem.key, setItem.value, resolvePerStoreTtl(setItem.ttl).primary);
			return {
				result: secondaryResult,
				ttl
			};
		} else {
			this.emit("cache:miss", {
				key,
				store: "secondary"
			});
			return;
		}
	}
	/**
	* Processes a single key from secondary store for getRaw operation in non-blocking mode
	* Non-blocking mode means we don't wait for secondary operations that update primary store
	* @param primary - the primary store to use
	* @param secondary - the secondary store to use
	* @param key - The key to retrieve from secondary store
	* @returns Promise containing the result and TTL information
	*/
	async processSecondaryForGetRawNonBlocking(primary, secondary, key) {
		const secondaryResult = await secondary.getRaw(key);
		if (secondaryResult?.value) {
			this.emit("cache:hit", {
				key,
				value: secondaryResult.value,
				store: "secondary"
			});
			const ttl = calculateTtlFromExpiration$1(getCascadingTtl$1(this._ttl, this._primary.ttl), secondaryResult.expires ?? void 0);
			const setItem = {
				key,
				value: secondaryResult.value,
				ttl
			};
			/* v8 ignore next -- @preserve */
			this.hook("BEFORE_SECONDARY_SETS_PRIMARY", setItem).then(async () => {
				await primary.set(setItem.key, setItem.value, resolvePerStoreTtl(setItem.ttl).primary);
			}).catch((error) => {
				/* v8 ignore next -- @preserve */
				this.emit("error", error);
			});
			return {
				result: secondaryResult,
				ttl
			};
		} else {
			this.emit("cache:miss", {
				key,
				store: "secondary"
			});
			return;
		}
	}
	/**
	* Processes missing keys from secondary store for getManyRaw operation
	* @param primary - the primary store to use
	* @param secondary - the secondary store to use
	* @param keys - The original array of keys requested
	* @param result - The result array from primary store (will be modified)
	* @returns Promise<void>
	*/
	async processSecondaryForGetManyRaw(primary, secondary, keys, result) {
		const missingKeys = [];
		for (const [i, key] of keys.entries()) if (!result[i]) missingKeys.push(key);
		const secondaryResults = await secondary.getManyRaw(missingKeys);
		let secondaryIndex = 0;
		for await (const [i, key] of keys.entries()) if (!result[i]) {
			const secondaryResult = secondaryResults[secondaryIndex];
			if (secondaryResult && secondaryResult.value !== void 0) {
				result[i] = secondaryResult;
				this.emit("cache:hit", {
					key,
					value: secondaryResult.value,
					store: "secondary"
				});
				const cascadeTtl = getCascadingTtl$1(this._ttl, this._primary.ttl);
				let { expires } = secondaryResult;
				/* v8 ignore next -- @preserve */
				if (expires === null) expires = void 0;
				const ttl = calculateTtlFromExpiration$1(cascadeTtl, expires);
				const setItem = {
					key,
					value: secondaryResult.value,
					ttl
				};
				await this.hook("BEFORE_SECONDARY_SETS_PRIMARY", setItem);
				await primary.set(setItem.key, setItem.value, resolvePerStoreTtl(setItem.ttl).primary);
			} else this.emit("cache:miss", {
				key,
				store: "secondary"
			});
			secondaryIndex++;
		}
	}
	/**
	* Processes missing keys from secondary store for getManyRaw operation in non-blocking mode
	* Non-blocking mode means we don't wait for secondary operations that update primary store
	* @param secondary - the secondary store to use
	* @param keys - The original array of keys requested
	* @param result - The result array from primary store (will be modified)
	* @returns Promise<void>
	*/
	async processSecondaryForGetManyRawNonBlocking(primary, secondary, keys, result) {
		const missingKeys = [];
		for (const [i, key] of keys.entries()) if (!result[i]) missingKeys.push(key);
		const secondaryResults = await secondary.getManyRaw(missingKeys);
		let secondaryIndex = 0;
		for await (const [i, key] of keys.entries()) if (!result[i]) {
			const secondaryResult = secondaryResults[secondaryIndex];
			if (secondaryResult && secondaryResult.value !== void 0) {
				result[i] = secondaryResult;
				this.emit("cache:hit", {
					key,
					value: secondaryResult.value,
					store: "secondary"
				});
				const cascadeTtl = getCascadingTtl$1(this._ttl, this._primary.ttl);
				let { expires } = secondaryResult;
				/* v8 ignore next -- @preserve */
				if (expires === null) expires = void 0;
				const ttl = calculateTtlFromExpiration$1(cascadeTtl, expires);
				const setItem = {
					key,
					value: secondaryResult.value,
					ttl
				};
				/* v8 ignore next -- @preserve */
				this.hook("BEFORE_SECONDARY_SETS_PRIMARY", setItem).then(async () => {
					await primary.set(setItem.key, setItem.value, resolvePerStoreTtl(setItem.ttl).primary);
				}).catch((error) => {
					/* v8 ignore next -- @preserve */
					this.emit("error", error);
				});
			} else this.emit("cache:miss", {
				key,
				store: "secondary"
			});
			secondaryIndex++;
		}
	}
	setTtl(ttl) {
		if (typeof ttl === "string" || ttl === void 0) this._ttl = ttl;
		else if (ttl > 0) this._ttl = ttl;
		else this._ttl = void 0;
	}
	setMaxTtl(maxTtl) {
		if (typeof maxTtl === "string" || maxTtl === void 0) this._maxTtl = maxTtl;
		else if (maxTtl > 0) this._maxTtl = maxTtl;
		else this._maxTtl = void 0;
	}
	capTtl(ttl, maxTtlMs) {
		if (ttl !== void 0 && (Number.isNaN(ttl) || ttl < 0)) ttl = void 0;
		if (maxTtlMs === void 0) return ttl;
		if (ttl === void 0) return maxTtlMs;
		return Math.min(ttl, maxTtlMs);
	}
	/**
	* Resolves the ttl for a tag snapshot so it outlives the longest-lived copy of the value across
	* the stores. With a secondary store the snapshot uses the larger of the two ttls and never
	* expires if either copy never expires; with only a primary store it tracks the primary ttl.
	* @param primaryTtl - the resolved primary store ttl in milliseconds, or undefined for no expiry
	* @param secondaryTtl - the resolved secondary store ttl in milliseconds, or undefined for no expiry
	* @returns {number | undefined} The tag snapshot ttl in milliseconds, or undefined for no expiry
	*/
	maxStoreTtl(primaryTtl, secondaryTtl) {
		if (!this._secondary) return primaryTtl;
		if (!primaryTtl || !secondaryTtl) return;
		return Math.max(primaryTtl, secondaryTtl);
	}
	/**
	* Resolves the effective ttl actually written to one store for a `setMany` item: the per-store
	* explicit value (a scalar applies to both stores; a `{ primary, secondary }` object is honored
	* per field) cascaded with the store default and instance ttl, then capped by maxTtl.
	* @param itemTtl - the item's ttl (number, shorthand string, or per-store object)
	* @param storeTtl - the target store's default ttl in milliseconds
	* @param store - which store's field to resolve from a per-store object
	* @param maxTtlMs - the resolved maxTtl in milliseconds, or undefined for no cap
	* @returns {number | undefined} The effective ttl in milliseconds, or undefined for no expiry
	*/
	resolveStoreTtl(itemTtl, storeTtl, store, maxTtlMs) {
		const explicitTtl = resolvePerStoreTtl(itemTtl)[store];
		return this.capTtl(getCascadingTtl$1(this._ttl, storeTtl, explicitTtl), maxTtlMs);
	}
};
//#endregion
export { CacheTags, Cacheable, CacheableEvents, CacheableHooks, CacheableMemory, CacheableStats, CacheableSync, CacheableSyncEvents, HashAlgorithm, Keyv, KeyvCacheableMemory, KeyvHooks, calculateTtlFromExpiration, createKeyv, getCascadingTtl, getOrSet, hash, shorthandToMilliseconds, shorthandToTime, wrap, wrapSync };
