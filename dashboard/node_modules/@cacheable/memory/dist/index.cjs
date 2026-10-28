Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let _cacheable_utils = require("@cacheable/utils");
let hookified = require("hookified");
let keyv = require("keyv");
//#region src/memory-lru.ts
var ListNode = class {
	value;
	prev = void 0;
	next = void 0;
	constructor(value) {
		this.value = value;
	}
};
var DoublyLinkedList = class {
	head = void 0;
	tail = void 0;
	nodesMap = /* @__PURE__ */ new Map();
	addToFront(value) {
		const newNode = new ListNode(value);
		if (this.head) {
			newNode.next = this.head;
			this.head.prev = newNode;
			this.head = newNode;
		} else this.head = this.tail = newNode;
		this.nodesMap.set(value, newNode);
	}
	moveToFront(value) {
		const node = this.nodesMap.get(value);
		if (!node || this.head === node) return;
		/* v8 ignore next -- @preserve */
		if (node.prev) node.prev.next = node.next;
		/* v8 ignore next -- @preserve */
		if (node.next) node.next.prev = node.prev;
		/* v8 ignore next -- @preserve */
		if (node === this.tail) this.tail = node.prev;
		node.prev = void 0;
		node.next = this.head;
		/* v8 ignore next -- @preserve */
		if (this.head) this.head.prev = node;
		this.head = node;
		this.tail ??= node;
	}
	getOldest() {
		/* v8 ignore next -- @preserve */
		return this.tail ? this.tail.value : void 0;
	}
	removeOldest() {
		/* v8 ignore next -- @preserve */
		if (!this.tail) return;
		const oldValue = this.tail.value;
		/* v8 ignore next -- @preserve */
		if (this.tail.prev) {
			this.tail = this.tail.prev;
			this.tail.next = void 0;
		} else
 /* v8 ignore next -- @preserve */
		this.head = this.tail = void 0;
		this.nodesMap.delete(oldValue);
		return oldValue;
	}
	remove(value) {
		const node = this.nodesMap.get(value);
		if (!node) return false;
		if (node.prev) node.prev.next = node.next;
		else {
			this.head = node.next;
			if (this.head) this.head.prev = void 0;
		}
		if (node.next) node.next.prev = node.prev;
		else {
			this.tail = node.prev;
			if (this.tail) this.tail.next = void 0;
		}
		this.nodesMap.delete(value);
		return true;
	}
	get size() {
		return this.nodesMap.size;
	}
};
//#endregion
//#region src/keyv-memory.ts
var KeyvCacheableMemory = class {
	opts = {
		ttl: 0,
		useClone: true,
		lruSize: 0,
		checkInterval: 0
	};
	_defaultCache = new CacheableMemory();
	_nCache = /* @__PURE__ */ new Map();
	_namespace;
	constructor(options) {
		if (options) {
			this.opts = options;
			this._defaultCache = new CacheableMemory(options);
			if (options.namespace) {
				this._namespace = options.namespace;
				this._nCache.set(this._namespace, new CacheableMemory(options));
			}
		}
	}
	get namespace() {
		return this._namespace;
	}
	set namespace(value) {
		this._namespace = value;
	}
	get store() {
		return this.getStore(this._namespace);
	}
	async get(key) {
		const result = this.getStore(this._namespace).get(key);
		if (result) return result;
	}
	async getMany(keys) {
		return this.getStore(this._namespace).getMany(keys);
	}
	async set(key, value, ttl) {
		this.getStore(this._namespace).set(key, value, ttl);
	}
	async setMany(values) {
		this.getStore(this._namespace).setMany(values);
	}
	async delete(key) {
		this.getStore(this._namespace).delete(key);
		return true;
	}
	async deleteMany(key) {
		this.getStore(this._namespace).deleteMany(key);
		return true;
	}
	async clear() {
		this.getStore(this._namespace).clear();
	}
	async has(key) {
		return this.getStore(this._namespace).has(key);
	}
	on(event, listener) {
		this.getStore(this._namespace).on(event, listener);
		return this;
	}
	getStore(namespace) {
		if (!namespace) return this._defaultCache;
		if (!this._nCache.has(namespace)) this._nCache.set(namespace, new CacheableMemory(this.opts));
		return this._nCache.get(namespace);
	}
};
/**
* Creates a new Keyv instance with a new KeyvCacheableMemory store. This also removes the serialize/deserialize methods from the Keyv instance for optimization.
* @param options
* @returns
*/
function createKeyv(options) {
	const store = new KeyvCacheableMemory(options);
	const namespace = options?.namespace;
	let ttl;
	/* v8 ignore next -- @preserve */
	if (options?.ttl && Number.isInteger(options.ttl)) ttl = options?.ttl;
	const keyv$1 = new keyv.Keyv({
		store,
		namespace,
		ttl
	});
	keyv$1.serialize = void 0;
	keyv$1.deserialize = void 0;
	return keyv$1;
}
//#endregion
//#region src/index.ts
/**
* Lifecycle hooks fired by {@link CacheableMemory}. Register handlers with the inherited
* `onHook(hook, handler)` method. Hooks are dispatched synchronously via `hookSync`, which skips
* `async` handler functions entirely — register only synchronous handlers.
*/
let CacheableMemoryHooks = /* @__PURE__ */ function(CacheableMemoryHooks) {
	CacheableMemoryHooks["BEFORE_SET"] = "BEFORE_SET";
	CacheableMemoryHooks["AFTER_SET"] = "AFTER_SET";
	CacheableMemoryHooks["BEFORE_SET_MANY"] = "BEFORE_SET_MANY";
	CacheableMemoryHooks["AFTER_SET_MANY"] = "AFTER_SET_MANY";
	CacheableMemoryHooks["BEFORE_GET"] = "BEFORE_GET";
	CacheableMemoryHooks["AFTER_GET"] = "AFTER_GET";
	CacheableMemoryHooks["BEFORE_GET_MANY"] = "BEFORE_GET_MANY";
	CacheableMemoryHooks["AFTER_GET_MANY"] = "AFTER_GET_MANY";
	CacheableMemoryHooks["BEFORE_DELETE"] = "BEFORE_DELETE";
	CacheableMemoryHooks["AFTER_DELETE"] = "AFTER_DELETE";
	CacheableMemoryHooks["BEFORE_DELETE_MANY"] = "BEFORE_DELETE_MANY";
	CacheableMemoryHooks["AFTER_DELETE_MANY"] = "AFTER_DELETE_MANY";
	CacheableMemoryHooks["BEFORE_CLEAR"] = "BEFORE_CLEAR";
	CacheableMemoryHooks["AFTER_CLEAR"] = "AFTER_CLEAR";
	return CacheableMemoryHooks;
}({});
const defaultStoreHashSize = 16;
const maximumMapSize = 16777216;
var CacheableMemory = class extends hookified.Hookified {
	_lru = new DoublyLinkedList();
	_storeHashSize = 16;
	_storeHashAlgorithm = _cacheable_utils.HashAlgorithm.DJB2;
	_store = Array.from({ length: this._storeHashSize }, () => /* @__PURE__ */ new Map());
	_ttl;
	_maxTtl;
	_useClone = true;
	_lruSize = 0;
	_checkInterval = 0;
	_interval = 0;
	_stats = new _cacheable_utils.Stats({ enabled: false });
	/**
	* @constructor
	* @param {CacheableMemoryOptions} [options] - The options for the CacheableMemory
	*/
	constructor(options) {
		super();
		if (options?.ttl) this.setTtl(options.ttl);
		if (options?.maxTtl !== void 0) this.setMaxTtl(options.maxTtl);
		if (options?.useClone !== void 0) this._useClone = options.useClone;
		if (options?.stats) this._stats.enabled = options.stats;
		if (options?.storeHashSize && options.storeHashSize > 0) this._storeHashSize = options.storeHashSize;
		if (options?.lruSize) if (options.lruSize > 16777216) this.emit("error", /* @__PURE__ */ new Error(`LRU size cannot be larger than ${maximumMapSize} due to Map limitations.`));
		else this._lruSize = options.lruSize;
		if (options?.checkInterval) this._checkInterval = options.checkInterval;
		if (options?.storeHashAlgorithm) this._storeHashAlgorithm = options.storeHashAlgorithm;
		this._store = Array.from({ length: this._storeHashSize }, () => /* @__PURE__ */ new Map());
		this.startIntervalCheck();
	}
	/**
	* Gets the time-to-live
	* @returns {number|string|undefined} - The time-to-live in miliseconds or a human-readable format. If undefined, it will not have a time-to-live.
	*/
	get ttl() {
		return this._ttl;
	}
	/**
	* Sets the time-to-live
	* @param {number|string|undefined} value - The time-to-live in miliseconds or a human-readable format (example '1s' = 1 second, '1h' = 1 hour). If undefined, it will not have a time-to-live.
	*/
	set ttl(value) {
		this.setTtl(value);
	}
	/**
	* Gets the maximum time-to-live. When set, any TTL that exceeds this value is capped to maxTtl.
	* Entries with no TTL will also be capped to maxTtl. Default is `undefined` (no maximum).
	* @returns {number|string|undefined} - The maximum TTL in milliseconds, human-readable format, or undefined.
	*/
	get maxTtl() {
		return this._maxTtl;
	}
	/**
	* Sets the maximum time-to-live. When set, any TTL that exceeds this value is capped to maxTtl.
	* Entries with no TTL will also be capped to maxTtl.
	* @param {number|string|undefined} value - The maximum TTL in milliseconds or human-readable format (e.g. '1s', '1h'). If undefined, no maximum is enforced.
	*/
	set maxTtl(value) {
		this.setMaxTtl(value);
	}
	/**
	* Gets whether to use clone
	* @returns {boolean} - If true, it will clone the value before returning it. If false, it will return the value directly. Default is true.
	*/
	get useClone() {
		return this._useClone;
	}
	/**
	* Sets whether to use clone
	* @param {boolean} value - If true, it will clone the value before returning it. If false, it will return the value directly. Default is true.
	*/
	set useClone(value) {
		this._useClone = value;
	}
	/**
	* Gets the size of the LRU cache
	* @returns {number} - The size of the LRU cache. If set to 0, it will not use LRU cache. Default is 0. If you are using LRU then the limit is based on Map() size 17mm.
	*/
	get lruSize() {
		return this._lruSize;
	}
	/**
	* Sets the size of the LRU cache
	* @param {number} value - The size of the LRU cache. If set to 0, it will not use LRU cache. Default is 0. If you are using LRU then the limit is based on Map() size 17mm.
	*/
	set lruSize(value) {
		if (value > 16777216) {
			this.emit("error", /* @__PURE__ */ new Error(`LRU size cannot be larger than ${maximumMapSize} due to Map limitations.`));
			return;
		}
		this._lruSize = value;
		if (this._lruSize === 0) {
			this._lru = new DoublyLinkedList();
			return;
		}
		this.lruResize();
	}
	/**
	* Gets the check interval
	* @returns {number} - The interval to check for expired items. If set to 0, it will not check for expired items. Default is 0.
	*/
	get checkInterval() {
		return this._checkInterval;
	}
	/**
	* Sets the check interval
	* @param {number} value - The interval to check for expired items. If set to 0, it will not check for expired items. Default is 0.
	*/
	set checkInterval(value) {
		this._checkInterval = value;
	}
	/**
	* Gets the size of the cache
	* @returns {number} - The size of the cache
	*/
	get size() {
		let size = 0;
		for (const store of this._store) size += store.size;
		return size;
	}
	/**
	* Gets the statistics of the cache. Statistics track aggregate counters such as `hits`, `misses`,
	* `gets`, `sets`, `deletes`, `clears`, `count`, `ksize`, and `vsize`. They are disabled by default;
	* enable them via the `stats` option or by setting `cache.stats.enabled = true`.
	* @returns {Stats} - The statistics for this CacheableMemory instance
	*/
	get stats() {
		return this._stats;
	}
	/**
	* Gets the number of hash stores
	* @returns {number} - The number of hash stores
	*/
	get storeHashSize() {
		return this._storeHashSize;
	}
	/**
	* Sets the number of hash stores. This will recreate the store and all data will be cleared
	* @param {number} value - The number of hash stores
	*/
	set storeHashSize(value) {
		if (value === this._storeHashSize) return;
		this._storeHashSize = value;
		this._store = Array.from({ length: this._storeHashSize }, () => /* @__PURE__ */ new Map());
		if (this._stats.enabled) this._stats.resetStoreValues();
	}
	/**
	* Gets the store hash algorithm
	* @returns {HashAlgorithm | StoreHashAlgorithmFunction} - The store hash algorithm
	*/
	get storeHashAlgorithm() {
		return this._storeHashAlgorithm;
	}
	/**
	* Sets the store hash algorithm. This will recreate the store and all data will be cleared
	* @param {HashAlgorithm | HashAlgorithmFunction} value - The store hash algorithm
	*/
	set storeHashAlgorithm(value) {
		this._storeHashAlgorithm = value;
	}
	/**
	* Gets the keys
	* @returns {IterableIterator<string>} - The keys
	*/
	get keys() {
		const keys = [];
		for (const store of this._store) for (const key of store.keys()) {
			const item = store.get(key);
			if (item && this.hasExpired(item)) {
				this.recordExpiration(item);
				store.delete(key);
				this.lruRemove(key);
				continue;
			}
			keys.push(key);
		}
		return keys.values();
	}
	/**
	* Gets the items
	* @returns {IterableIterator<CacheableStoreItem>} - The items
	*/
	get items() {
		const items = [];
		for (const store of this._store) for (const item of store.values()) {
			if (this.hasExpired(item)) {
				this.recordExpiration(item);
				store.delete(item.key);
				this.lruRemove(item.key);
				continue;
			}
			items.push(item);
		}
		return items.values();
	}
	/**
	* Gets the store
	* @returns {Array<Map<string, CacheableStoreItem>>} - The store
	*/
	get store() {
		return this._store;
	}
	/**
	* Gets the value of the key
	* @param {string} key - The key to get the value
	* @returns {T | undefined} - The value of the key
	*/
	get(key) {
		this.hookSync("BEFORE_GET", key);
		const store = this.getStore(key);
		const item = store.get(key);
		if (!item) {
			this.recordRead(false);
			this.hookSync("AFTER_GET", {
				key,
				result: void 0
			});
			return;
		}
		if (item.expires && Date.now() > item.expires) {
			this.recordExpiration(item);
			store.delete(key);
			this.lruRemove(key);
			this.recordRead(false);
			this.hookSync("AFTER_GET", {
				key,
				result: void 0
			});
			return;
		}
		this.lruMoveToFront(key);
		let result;
		if (!this._useClone) result = item.value;
		else result = this.clone(item.value);
		this.recordRead(true);
		this.hookSync("AFTER_GET", {
			key,
			result
		});
		return result;
	}
	/**
	* Gets the values of the keys
	* @param {string[]} keys - The keys to get the values
	* @returns {T[]} - The values of the keys
	*/
	getMany(keys) {
		this.hookSync("BEFORE_GET_MANY", keys);
		const result = [];
		for (const key of keys) result.push(this.get(key));
		this.hookSync("AFTER_GET_MANY", {
			keys,
			result
		});
		return result;
	}
	/**
	* Gets the raw value of the key
	* @param {string} key - The key to get the value
	* @returns {CacheableStoreItem | undefined} - The raw value of the key
	*/
	getRaw(key) {
		const store = this.getStore(key);
		const item = store.get(key);
		if (!item) {
			this.recordRead(false);
			return;
		}
		if (item.expires && Date.now() > item.expires) {
			this.recordExpiration(item);
			store.delete(key);
			this.lruRemove(key);
			this.recordRead(false);
			return;
		}
		this.lruMoveToFront(key);
		this.recordRead(true);
		return item;
	}
	/**
	* Gets the raw values of the keys
	* @param {string[]} keys - The keys to get the values
	* @returns {CacheableStoreItem[]} - The raw values of the keys
	*/
	getManyRaw(keys) {
		const result = [];
		for (const key of keys) result.push(this.getRaw(key));
		return result;
	}
	/**
	* Sets the value of the key
	* @param {string} key - The key to set the value
	* @param {any} value - The value to set
	* @param {number|string|SetOptions} [ttl] - Time to Live - If you set a number it is miliseconds, if you set a string it is a human-readable.
	* If you want to set expire directly you can do that by setting the expire property in the SetOptions.
	* If you set undefined, it will use the default time-to-live. If both are undefined then it will not have a time-to-live.
	* @returns {void}
	*/
	set(key, value, ttl) {
		const hookItem = {
			key,
			value,
			ttl
		};
		this.hookSync("BEFORE_SET", hookItem);
		const store = this.getStore(hookItem.key);
		let expires;
		const effectiveTtl = hookItem.ttl;
		if (effectiveTtl !== void 0 || this._ttl !== void 0) if (typeof effectiveTtl === "object") {
			if (effectiveTtl.expire) expires = typeof effectiveTtl.expire === "number" ? effectiveTtl.expire : effectiveTtl.expire.getTime();
			if (effectiveTtl.ttl) {
				const finalTtl = (0, _cacheable_utils.shorthandToTime)(effectiveTtl.ttl);
				/* v8 ignore next -- @preserve */
				if (finalTtl !== void 0) expires = finalTtl;
			}
		} else {
			const finalTtl = (0, _cacheable_utils.shorthandToTime)(effectiveTtl ?? this._ttl);
			/* v8 ignore next -- @preserve */
			if (finalTtl !== void 0) expires = finalTtl;
		}
		if (this._maxTtl !== void 0) {
			const maxExpires = (0, _cacheable_utils.shorthandToTime)(this._maxTtl);
			if (expires === void 0) expires = maxExpires;
			else if (expires > maxExpires) expires = maxExpires;
		}
		if (this._lruSize > 0) if (store.has(hookItem.key)) this.lruMoveToFront(hookItem.key);
		else {
			this.lruAddToFront(hookItem.key);
			if (this._lru.size > this._lruSize) {
				const oldestKey = this._lru.getOldest();
				/* v8 ignore next -- @preserve */
				if (oldestKey) {
					this._lru.removeOldest();
					this.delete(oldestKey);
				}
			}
		}
		if (this._stats.enabled) {
			const existing = store.get(hookItem.key);
			if (existing) this._stats.decreaseVSize(existing.value);
			else {
				this._stats.incrementKSize(hookItem.key);
				this._stats.incrementCount();
			}
			this._stats.incrementVSize(hookItem.value);
			this._stats.incrementSets();
		}
		const item = {
			key: hookItem.key,
			value: hookItem.value,
			expires
		};
		store.set(hookItem.key, item);
		this.hookSync("AFTER_SET", hookItem);
	}
	/**
	* Sets the values of the keys
	* @param {CacheableItem[]} items - The items to set
	* @returns {void}
	*/
	setMany(items) {
		this.hookSync("BEFORE_SET_MANY", items);
		for (const item of items) this.set(item.key, item.value, item.ttl);
		this.hookSync("AFTER_SET_MANY", items);
	}
	/**
	* Checks if the key exists
	* @param {string} key - The key to check
	* @returns {boolean} - If true, the key exists. If false, the key does not exist.
	*/
	has(key) {
		const item = this.get(key);
		return Boolean(item);
	}
	/**
	* @function hasMany
	* @param {string[]} keys - The keys to check
	* @returns {boolean[]} - If true, the key exists. If false, the key does not exist.
	*/
	hasMany(keys) {
		const result = [];
		for (const key of keys) {
			const item = this.get(key);
			result.push(Boolean(item));
		}
		return result;
	}
	/**
	* Take will get the key and delete the entry from cache
	* @param {string} key - The key to take
	* @returns {T | undefined} - The value of the key
	*/
	take(key) {
		const item = this.get(key);
		if (!item) return;
		this.delete(key);
		return item;
	}
	/**
	* TakeMany will get the keys and delete the entries from cache
	* @param {string[]} keys - The keys to take
	* @returns {T[]} - The values of the keys
	*/
	takeMany(keys) {
		const result = [];
		for (const key of keys) result.push(this.take(key));
		return result;
	}
	/**
	* Delete the key
	* @param {string} key - The key to delete
	* @returns {void}
	*/
	delete(key) {
		this.hookSync("BEFORE_DELETE", key);
		const store = this.getStore(key);
		if (this._stats.enabled) {
			const item = store.get(key);
			if (item) {
				this._stats.decreaseKSize(key);
				this._stats.decreaseVSize(item.value);
				this._stats.decreaseCount();
				this._stats.incrementDeletes();
			}
		}
		store.delete(key);
		this.lruRemove(key);
		this.hookSync("AFTER_DELETE", key);
	}
	/**
	* Delete the keys
	* @param {string[]} keys - The keys to delete
	* @returns {void}
	*/
	deleteMany(keys) {
		this.hookSync("BEFORE_DELETE_MANY", keys);
		for (const key of keys) this.delete(key);
		this.hookSync("AFTER_DELETE_MANY", keys);
	}
	/**
	* Clear the cache
	* @returns {void}
	*/
	clear() {
		this.hookSync("BEFORE_CLEAR");
		this._store = Array.from({ length: this._storeHashSize }, () => /* @__PURE__ */ new Map());
		this._lru = new DoublyLinkedList();
		if (this._stats.enabled) {
			this._stats.resetStoreValues();
			this._stats.incrementClears();
		}
		this.hookSync("AFTER_CLEAR");
	}
	/**
	* Get the store based on the key (internal use)
	* @param {string} key - The key to get the store
	* @returns {CacheableHashStore} - The store
	*/
	getStore(key) {
		const hash = this.getKeyStoreHash(key);
		this._store[hash] ||= /* @__PURE__ */ new Map();
		return this._store[hash];
	}
	/**
	* Hash the key for which store to go to (internal use)
	* @param {string} key - The key to hash
	* Available algorithms are: SHA256, SHA1, MD5, and djb2Hash.
	* @returns {number} - The hashed key as a number
	*/
	getKeyStoreHash(key) {
		if (this._store.length === 1) return 0;
		if (typeof this._storeHashAlgorithm === "function") return this._storeHashAlgorithm(key, this._storeHashSize);
		return (0, _cacheable_utils.hashToNumberSync)(key, {
			min: 0,
			max: this._storeHashSize - 1,
			algorithm: this._storeHashAlgorithm
		});
	}
	/**
	* Clone the value. This is for internal use
	* @param {any} value - The value to clone
	* @returns {any} - The cloned value
	*/
	clone(value) {
		if (this.isPrimitive(value)) return value;
		return structuredClone(value);
	}
	/**
	* Add to the front of the LRU cache. This is for internal use
	* @param {string} key - The key to add to the front
	* @returns {void}
	*/
	lruAddToFront(key) {
		if (this._lruSize === 0) return;
		this._lru.addToFront(key);
	}
	/**
	* Move to the front of the LRU cache. This is for internal use
	* @param {string} key - The key to move to the front
	* @returns {void}
	*/
	lruMoveToFront(key) {
		if (this._lruSize === 0) return;
		this._lru.moveToFront(key);
	}
	/**
	* Remove a key from the LRU cache. This is for internal use
	* @param {string} key - The key to remove
	* @returns {void}
	*/
	lruRemove(key) {
		if (this._lruSize === 0) return;
		this._lru.remove(key);
	}
	/**
	* Resize the LRU cache. This is for internal use.
	* @returns {void}
	*/
	lruResize() {
		while (this._lru.size > this._lruSize) {
			const oldestKey = this._lru.getOldest();
			/* v8 ignore next -- @preserve */
			if (oldestKey) {
				this._lru.removeOldest();
				this.delete(oldestKey);
			}
		}
	}
	/**
	* Check for expiration. This is for internal use
	* @returns {void}
	*/
	checkExpiration() {
		for (const store of this._store) for (const item of store.values()) if (item.expires && Date.now() > item.expires) {
			this.recordExpiration(item);
			store.delete(item.key);
			this.lruRemove(item.key);
		}
	}
	/**
	* Start the interval check. This is for internal use
	* @returns {void}
	*/
	startIntervalCheck() {
		if (this._checkInterval > 0) {
			/* v8 ignore next -- @preserve */
			if (this._interval)
 /* v8 ignore next -- @preserve */
			clearInterval(this._interval);
			this._interval = setInterval(() => {
				this.checkExpiration();
			}, this._checkInterval).unref();
		}
	}
	/**
	* Stop the interval check. This is for internal use
	* @returns {void}
	*/
	stopIntervalCheck() {
		/* v8 ignore next -- @preserve */
		if (this._interval) clearInterval(this._interval);
		this._interval = 0;
		this._checkInterval = 0;
	}
	/**
	* Wrap the function for caching
	* @param {Function} function_ - The function to wrap
	* @param {Object} [options] - The options to wrap
	* @returns {Function} - The wrapped function
	*/
	wrap(function_, options) {
		return (0, _cacheable_utils.wrapSync)(function_, {
			ttl: options?.ttl ?? this._ttl,
			keyPrefix: options?.keyPrefix,
			createKey: options?.createKey,
			cache: this
		});
	}
	/**
	* Gets the value of the key, or computes and stores it on a cache miss. This is the synchronous
	* cache-aside helper: if the key is present its value is returned, otherwise `function_` is
	* invoked, its result is stored, and that result is returned.
	*
	* The value is stored using `options.ttl`, falling back to the instance default `ttl`. Because
	* the cache is synchronous there is no request coalescing — concurrent callers cannot stampede
	* the setter the way they can with an async cache.
	* @param {GetOrSetSyncKey} key - The key to get or set. Can also be a function that returns the key.
	* @param {() => T} function_ - The function that computes the value on a cache miss.
	* @param {GetOrSetFunctionOptions} [options] - Options such as `ttl`, `cacheErrors`, and `throwErrors`.
	* @returns {T | undefined} - The cached or freshly computed value
	*/
	getOrSet(key, function_, options) {
		return (0, _cacheable_utils.getOrSetSync)(key, function_, {
			cache: this,
			ttl: options?.ttl ?? this._ttl,
			cacheErrors: options?.cacheErrors,
			throwErrors: options?.throwErrors
		});
	}
	/**
	* Records a single read against the statistics counters. Each read increments `gets` and either
	* `hits` or `misses`. No-op when statistics are disabled. This is for internal use.
	* @param {boolean} hit - Whether the read found a (non-expired) value
	* @returns {void}
	*/
	recordRead(hit) {
		if (!this._stats.enabled) return;
		if (hit) this._stats.incrementHits();
		else this._stats.incrementMisses();
		this._stats.incrementGets();
	}
	/**
	* Decrements the size statistics (`count`, `ksize`, and `vsize`) for an entry that is being removed
	* because it expired. Expirations are not counted as `deletes` since they are not user-initiated.
	* No-op when statistics are disabled. This is for internal use.
	* @param {CacheableStoreItem} item - The expired item being removed from the store
	* @returns {void}
	*/
	recordExpiration(item) {
		if (!this._stats.enabled) return;
		this._stats.decreaseKSize(item.key);
		this._stats.decreaseVSize(item.value);
		this._stats.decreaseCount();
	}
	isPrimitive(value) {
		const result = false;
		/* v8 ignore next -- @preserve */
		if (value === null || value === void 0) return true;
		if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return true;
		return result;
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
	hasExpired(item) {
		if (item.expires && Date.now() > item.expires) return true;
		return false;
	}
};
//#endregion
exports.CacheableMemory = CacheableMemory;
exports.CacheableMemoryHooks = CacheableMemoryHooks;
Object.defineProperty(exports, "HashAlgorithm", {
	enumerable: true,
	get: function() {
		return _cacheable_utils.HashAlgorithm;
	}
});
exports.KeyvCacheableMemory = KeyvCacheableMemory;
Object.defineProperty(exports, "Stats", {
	enumerable: true,
	get: function() {
		return _cacheable_utils.Stats;
	}
});
exports.createKeyv = createKeyv;
exports.defaultStoreHashSize = defaultStoreHashSize;
Object.defineProperty(exports, "getOrSetSync", {
	enumerable: true,
	get: function() {
		return _cacheable_utils.getOrSetSync;
	}
});
Object.defineProperty(exports, "hash", {
	enumerable: true,
	get: function() {
		return _cacheable_utils.hash;
	}
});
Object.defineProperty(exports, "hashToNumber", {
	enumerable: true,
	get: function() {
		return _cacheable_utils.hashToNumber;
	}
});
exports.maximumMapSize = maximumMapSize;
