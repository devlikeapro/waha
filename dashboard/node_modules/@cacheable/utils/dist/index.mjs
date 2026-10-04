import { Hashery } from "hashery";
import { Keyv } from "keyv";
//#region src/shorthand-time.ts
/**
* Converts a shorthand time string or number into milliseconds.
* The shorthand can be a string like '1s', '2m', '3h', '4d', or a number representing milliseconds.
* If the input is undefined, it returns undefined.
* If the input is a string that does not match the expected format, it throws an error.
* @param shorthand - A shorthand time string or number representing milliseconds.
* @returns The equivalent time in milliseconds or undefined.
*/
const shorthandToMilliseconds = (shorthand) => {
	let milliseconds;
	if (shorthand === void 0) return;
	if (typeof shorthand === "number") milliseconds = shorthand;
	else {
		if (typeof shorthand !== "string") return;
		shorthand = shorthand.trim();
		if (Number.isNaN(Number(shorthand))) {
			const match = /^([\d.]+)\s*(ms|s|m|h|hr|d)$/i.exec(shorthand);
			if (!match) throw new Error(`Unsupported time format: "${shorthand}". Use 'ms', 's', 'm', 'h', 'hr', or 'd'.`);
			const [, value, unit] = match;
			const numericValue = Number.parseFloat(value);
			switch (unit.toLowerCase()) {
				case "ms":
					milliseconds = numericValue;
					break;
				case "s":
					milliseconds = numericValue * 1e3;
					break;
				case "m":
					milliseconds = numericValue * 1e3 * 60;
					break;
				case "h":
					milliseconds = numericValue * 1e3 * 60 * 60;
					break;
				case "hr":
					milliseconds = numericValue * 1e3 * 60 * 60;
					break;
				case "d":
					milliseconds = numericValue * 1e3 * 60 * 60 * 24;
					break;
				/* v8 ignore next -- @preserve */
				default: milliseconds = Number(shorthand);
			}
		} else milliseconds = Number(shorthand);
	}
	return milliseconds;
};
/**
* Converts a shorthand time string or number into a timestamp.
* If the shorthand is undefined, it returns the current date's timestamp.
* If the shorthand is a valid time format, it adds that duration to the current date's timestamp.
* @param shorthand - A shorthand time string or number representing milliseconds.
* @param fromDate - An optional Date object to calculate from. Defaults to the current date if not provided.
* @returns The timestamp in milliseconds since epoch.
*/
const shorthandToTime = (shorthand, fromDate) => {
	fromDate ??= /* @__PURE__ */ new Date();
	const milliseconds = shorthandToMilliseconds(shorthand);
	if (milliseconds === void 0) return fromDate.getTime();
	return fromDate.getTime() + milliseconds;
};
//#endregion
//#region src/cache-tags.ts
/**
* Prefix applied to every store key written by the service so its metadata cannot collide with
* user-supplied cache keys.
*/
const RESERVED_PREFIX = "--cacheable--tags--";
/** Namespace used when none is supplied to the constructor. */
const DEFAULT_NAMESPACE = "default";
/**
* Provides tag-based cache invalidation on top of any {@link Keyv} store. It is store-agnostic and
* requires no adapter changes.
*
* The service uses a lazy invalidation model rather than scanning and deleting keys. Each tag has a
* monotonically increasing version counter; {@link CacheTags.invalidateTag} simply increments
* it. When a key is tagged via {@link CacheTags.setKeyTags}, a snapshot of its tags' current
* versions is stored alongside it. {@link CacheTags.isKeyFresh} compares that snapshot against
* the live versions — if any tag has been incremented since, the key is considered stale. Stale
* entries are not deleted explicitly; they are expected to fall out of the cache via their TTL.
*
* This keeps invalidation constant-time regardless of how many keys reference a tag, at the cost of
* one additional `isKeyFresh` read per cache lookup.
*
* The service can be disabled via the `enabled` option or property so integrations pay no cost for
* untagged workloads: while disabled, every method is a no-op — reads return their neutral value
* and writes are skipped. The service must be explicitly enabled to use tags; it never enables
* itself, which keeps behavior consistent across distributed instances sharing a store.
*
* All metadata is written under a reserved prefix so it cannot collide with user keys:
* - `--cacheable--tags--:<namespace>:tag:<tag>` → integer version counter (stored without TTL).
* - `--cacheable--tags--:<namespace>:key:<key>` → the {@link KeyTagEntry} snapshot.
*
* Note: the read-version-then-write-snapshot sequence in `setKeyTags` is not atomic across
* processes. A concurrent `invalidateTag` running between the read and the write can leave a freshly
* written key referencing a stale version.
*
* @example
* ```typescript
* const cacheTags = new CacheTags({ store: new Keyv(), namespace: 'app' });
* await cacheTags.setKeyTags('user:42', ['users', 'org:7'], { ttl: 3600000 });
* await cacheTags.isKeyFresh('user:42'); // true
* await cacheTags.invalidateTag('users');
* await cacheTags.isKeyFresh('user:42'); // false
* ```
*/
var CacheTags = class {
	_store;
	_namespace;
	_enabled;
	_onError;
	/**
	* Creates a new tag service.
	* @param {CacheTagsOptions} options - The store, optional namespace, enabled state, and
	* non-blocking error handler to use.
	*/
	constructor(options) {
		this._store = options.store;
		this._namespace = options.namespace ?? DEFAULT_NAMESPACE;
		this._enabled = options.enabled ?? true;
		this._onError = options.onError;
	}
	/**
	* The Keyv store backing this service.
	* @returns {Keyv} The store provided to the constructor.
	*/
	get store() {
		return this._store;
	}
	/**
	* The namespace isolating this service's tags and keys within the store.
	* @returns {string} The configured namespace, or `"default"` if none was provided.
	*/
	get namespace() {
		return this._namespace;
	}
	/**
	* Whether the service is enabled. While disabled, every method is a no-op — read methods
	* return their neutral value and writes are skipped — so integrations pay no extra store
	* reads for untagged workloads. The service must be explicitly enabled to use tags; it never
	* enables itself.
	* @returns {boolean} Whether the service is enabled.
	*/
	get enabled() {
		return this._enabled;
	}
	/**
	* Sets whether the service is enabled.
	* @param {boolean} enabled Whether the service is enabled.
	*/
	set enabled(enabled) {
		this._enabled = enabled;
	}
	/**
	* Builds the reserved store key under which a tag's version counter is stored.
	* @param tag - The tag name.
	* @returns {string} The namespaced store key for the tag's version.
	*/
	tagKey(tag) {
		return `${RESERVED_PREFIX}:${this._namespace}:tag:${tag}`;
	}
	/**
	* Builds the reserved store key under which a cache key's tag snapshot is stored.
	* @param key - The cache key being tagged.
	* @returns {string} The namespaced store key for the key's snapshot.
	*/
	keyEntryKey(key) {
		return `${RESERVED_PREFIX}:${this._namespace}:key:${key}`;
	}
	/**
	* Builds the common prefix shared by every key-snapshot entry in this namespace. Used to filter
	* key entries when iterating the store.
	* @returns {string} The namespaced key-entry prefix.
	*/
	keyPrefix() {
		return `${RESERVED_PREFIX}:${this._namespace}:key:`;
	}
	/**
	* Reads the current version of a single tag.
	* @param tag - The tag name.
	* @returns {Promise<number>} The tag's version, or `0` if it has never been invalidated.
	*/
	async getTagVersion(tag) {
		const version = await this._store.get(this.tagKey(tag));
		return typeof version === "number" ? version : 0;
	}
	/**
	* Reads the current versions of multiple tags in a single batched store read.
	* @param tags - The tag names to look up.
	* @returns {Promise<number[]>} The versions in the same order as `tags`; entries that have never
	* been invalidated resolve to `0`. Returns an empty array when `tags` is empty.
	*/
	async getTagVersions(tags) {
		if (tags.length === 0) return [];
		const tagKeys = tags.map((tag) => this.tagKey(tag));
		const raw = await this._store.get(tagKeys);
		return tags.map((_, i) => {
			const value = raw?.[i];
			return typeof value === "number" ? value : 0;
		});
	}
	/**
	* Reports a fire-and-forget failure to the `onError` handler, if one was provided.
	* @param error - The error raised by the non-blocking operation.
	*/
	handleNonBlockingError(error) {
		this._onError?.(error);
	}
	/**
	* Reads the version snapshot of each tag and writes the key's tag snapshot to the store.
	* @param key - The cache key to tag.
	* @param tags - The tags to associate with the key.
	* @param ttl - Time-to-live in milliseconds for the snapshot.
	* @returns {Promise<void>} Resolves once the snapshot has been written.
	*/
	async writeKeyTags(key, tags, ttl) {
		const uniqueTags = [...new Set(tags)];
		const versions = await this.getTagVersions(uniqueTags);
		const snapshot = {};
		for (let i = 0; i < uniqueTags.length; i++) snapshot[uniqueTags[i]] = versions[i];
		const entry = { tags: snapshot };
		await this._store.set(this.keyEntryKey(key), entry, ttl);
	}
	/**
	* Associates a cache key with a set of tags by recording a snapshot of each tag's current
	* version. Call this whenever you write a fresh value to the cache. Duplicate tags are ignored.
	* No-op while the service is disabled.
	* @param key - The cache key to tag.
	* @param tags - The tags to associate with the key.
	* @param {SetKeyTagsOptions} [options] - Optional settings, such as a `ttl` for the snapshot or
	* `nonBlocking` to fire-and-forget the write.
	* @returns {Promise<void>} Resolves once the snapshot has been written, or immediately when
	* `nonBlocking` is set.
	*/
	async setKeyTags(key, tags, options) {
		if (!this._enabled) return;
		const work = this.writeKeyTags(key, tags, options?.ttl);
		if (options?.nonBlocking) {
			work.catch((error) => {
				this.handleNonBlockingError(error);
			});
			return;
		}
		await work;
	}
	/**
	* Removes a key's tag snapshot. After this, {@link CacheTags.isKeyFresh} returns `false`
	* for the key. Use when the cached value itself is deleted. No-op while the service is
	* disabled.
	* @param key - The cache key whose snapshot should be removed.
	* @param {RemoveKeysOptions} [options] - Optional settings, such as `nonBlocking` to
	* fire-and-forget the removal.
	* @returns {Promise<void>} Resolves once the snapshot has been deleted, or immediately when
	* `nonBlocking` is set.
	*/
	async removeKey(key, options) {
		await this.removeKeys([key], options);
	}
	/**
	* Removes multiple keys' tag snapshots in a single batched store delete. After this,
	* {@link CacheTags.isKeyFresh} returns `false` for each key. An empty list is a no-op, as is
	* the entire call while the service is disabled.
	* @param keys - The cache keys whose snapshots should be removed.
	* @param {RemoveKeysOptions} [options] - Optional settings, such as `nonBlocking` to
	* fire-and-forget the removal.
	* @returns {Promise<void>} Resolves once the snapshots have been deleted, or immediately when
	* `nonBlocking` is set.
	*/
	async removeKeys(keys, options) {
		if (!this._enabled || keys.length === 0) return;
		const entryKeys = keys.map((key) => this.keyEntryKey(key));
		const work = this._store.deleteMany(entryKeys);
		if (options?.nonBlocking) {
			work.catch((error) => {
				this.handleNonBlockingError(error);
			});
			return;
		}
		await work;
	}
	/**
	* Determines whether a key's cached value can still be trusted. A key is fresh only when a
	* snapshot exists for it and every tag in that snapshot still has the version it had at set time.
	* A key with no tags is trivially fresh. Call this before returning a value from your cache.
	* Always returns `true` while the service is disabled.
	* @param key - The cache key to check.
	* @returns {Promise<boolean>} `true` if the key is still fresh; `false` if it is unknown or any of
	* its tags has been invalidated since the snapshot was taken.
	*/
	async isKeyFresh(key) {
		if (!this._enabled) return true;
		const entry = await this._store.get(this.keyEntryKey(key));
		if (!entry?.tags) return false;
		const tags = Object.keys(entry.tags);
		const currentVersions = await this.getTagVersions(tags);
		for (let i = 0; i < tags.length; i++) if (currentVersions[i] !== entry.tags[tags[i]]) return false;
		return true;
	}
	/**
	* Determines whether a key's cached value is known to be stale due to tag invalidation. This is
	* the complement of {@link CacheTags.isKeyFresh} for tagged keys, but treats keys without a
	* snapshot as not stale — making it safe to call for every cache lookup, including keys that were
	* never tagged. Always returns `false` while the service is disabled.
	* @param key - The cache key to check.
	* @returns {Promise<boolean>} `true` only when a snapshot exists for the key and at least one of
	* its tags has been invalidated since the snapshot was taken; `false` otherwise (including when
	* the key has no snapshot).
	*/
	async isKeyStale(key) {
		if (!this._enabled) return false;
		return (await this.getStaleKeys([key])).length > 0;
	}
	/**
	* Determines which of the given keys are known to be stale due to tag invalidation, using two
	* batched store reads regardless of how many keys are checked: one for the snapshots and one for
	* the union of their tag versions. Keys without a snapshot are not considered stale. Returns an
	* empty array while the service is disabled.
	* @param keys - The cache keys to check.
	* @returns {Promise<string[]>} The subset of `keys` whose snapshot references at least one tag
	* that has been invalidated since the snapshot was taken.
	*/
	async getStaleKeys(keys) {
		if (!this._enabled || keys.length === 0) return [];
		const entryKeys = keys.map((key) => this.keyEntryKey(key));
		const entries = await this._store.get(entryKeys);
		const tagSet = /* @__PURE__ */ new Set();
		for (const entry of entries) if (entry?.tags) for (const tag of Object.keys(entry.tags)) tagSet.add(tag);
		const tags = [...tagSet];
		const versions = await this.getTagVersions(tags);
		const currentVersions = /* @__PURE__ */ new Map();
		for (let i = 0; i < tags.length; i++) currentVersions.set(tags[i], versions[i]);
		const staleKeys = [];
		for (const [i, entry] of entries.entries()) {
			if (!entry?.tags) continue;
			for (const [tag, version] of Object.entries(entry.tags)) if (currentVersions.get(tag) !== version) {
				staleKeys.push(keys[i]);
				break;
			}
		}
		return staleKeys;
	}
	/**
	* Returns the tags currently associated with a key. Returns `undefined` while the service is
	* disabled.
	* @param key - The cache key to look up.
	* @returns {Promise<string[] | undefined>} The tag names from the key's snapshot, or `undefined`
	* if the key has no snapshot.
	*/
	async getTags(key) {
		if (!this._enabled) return;
		const entry = await this._store.get(this.keyEntryKey(key));
		if (!entry?.tags) return;
		return Object.keys(entry.tags);
	}
	/**
	* Returns all cache keys whose snapshot references the given tag. This scans every key entry in
	* the namespace via the Keyv iterator, making it an `O(N)` operation intended for debugging and
	* tests rather than hot paths. Returns an empty array if the underlying store exposes no iterator
	* or while the service is disabled.
	* @param tag - The tag to search for.
	* @returns {Promise<string[]>} The cache keys (with the reserved prefix stripped) referencing the tag.
	*/
	async getKeysByTag(tag) {
		const result = [];
		if (!this._enabled) return result;
		const prefix = this.keyPrefix();
		const iterator = this._store.iterator?.(this._store.namespace);
		if (!iterator) return result;
		for await (const [storedKey, value] of iterator) {
			if (typeof storedKey !== "string" || !storedKey.startsWith(prefix)) continue;
			const entry = value;
			if (entry?.tags && Object.hasOwn(entry.tags, tag)) result.push(storedKey.slice(prefix.length));
		}
		return result;
	}
	/**
	* Invalidates a single tag by incrementing its version counter. Every key whose snapshot
	* references this tag becomes stale immediately. Runs in constant time regardless of how many
	* keys reference the tag. No-op while the service is disabled.
	* @param tag - The tag to invalidate.
	* @returns {Promise<string[]>} A single-element array containing the invalidated tag, or an
	* empty array while the service is disabled.
	*/
	async invalidateTag(tag) {
		if (!this._enabled) return [];
		const current = await this.getTagVersion(tag);
		await this._store.set(this.tagKey(tag), current + 1);
		return [tag];
	}
	/**
	* Invalidates multiple tags by incrementing each of their version counters in a single batched
	* store write. Duplicate tags are bumped once. An empty list is a no-op, as is the entire call
	* while the service is disabled.
	* @param tags - The tags to invalidate.
	* @returns {Promise<string[]>} The `tags` argument as provided (including any duplicates), or
	* an empty array while the service is disabled.
	*/
	async invalidateTags(tags) {
		if (!this._enabled) return [];
		const uniqueTags = [...new Set(tags)];
		if (uniqueTags.length === 0) return tags;
		const versions = await this.getTagVersions(uniqueTags);
		const kvPairs = [];
		for (let i = 0; i < uniqueTags.length; i++) kvPairs.push({
			key: this.tagKey(uniqueTags[i]),
			value: versions[i] + 1
		});
		await this._store.setMany(kvPairs);
		return tags;
	}
};
//#endregion
//#region src/coalesce-async.ts
const callbacks = /* @__PURE__ */ new Map();
function hasKey(key) {
	return callbacks.has(key);
}
function addKey(key) {
	callbacks.set(key, []);
}
function removeKey(key) {
	callbacks.delete(key);
}
function addCallbackToKey(key, callback) {
	const stash = getCallbacksByKey(key);
	stash.push(callback);
	callbacks.set(key, stash);
}
function getCallbacksByKey(key) {
	/* v8 ignore next -- @preserve */
	return callbacks.get(key) ?? [];
}
async function enqueue(key) {
	return new Promise((resolve, reject) => {
		addCallbackToKey(key, {
			resolve,
			reject
		});
	});
}
function dequeue(key) {
	const stash = getCallbacksByKey(key);
	removeKey(key);
	return stash;
}
function coalesce(options) {
	const { key, error, result } = options;
	for (const callback of dequeue(key))
 /* c8 ignore next 1 */
	if (error)
 /* c8 ignore next 3 */
	callback.reject(error);
	else callback.resolve(result);
}
/**
* Enqueue a promise for the group identified by `key`.
*
* All requests received for the same key while a request for that key
* is already being executed will wait. Once the running request settles
* then all the waiting requests in the group will settle, too.
* This minimizes how many times the function itself runs at the same time.
* This function resolves or rejects according to the given function argument.
*
* @url https://github.com/douglascayers/promise-coalesce
*/
async function coalesceAsync(key, fnc) {
	if (!hasKey(key)) {
		addKey(key);
		try {
			const result = await Promise.resolve(fnc());
			coalesce({
				key,
				result
			});
			return result;
		} catch (error) {
			/* c8 ignore next 5 */
			coalesce({
				key,
				error
			});
			throw error;
		}
	}
	return enqueue(key);
}
//#endregion
//#region src/hash.ts
let HashAlgorithm = /* @__PURE__ */ function(HashAlgorithm) {
	HashAlgorithm["SHA256"] = "SHA-256";
	HashAlgorithm["SHA384"] = "SHA-384";
	HashAlgorithm["SHA512"] = "SHA-512";
	HashAlgorithm["DJB2"] = "djb2";
	HashAlgorithm["FNV1"] = "fnv1";
	HashAlgorithm["MURMER"] = "murmer";
	HashAlgorithm["CRC32"] = "crc32";
	return HashAlgorithm;
}({});
/**
* Hashes an object asynchronously using the specified cryptographic algorithm.
* This method should be used for cryptographic algorithms (SHA-256, SHA-384, SHA-512).
* For non-cryptographic algorithms, use hashSync() for better performance.
* @param object The object to hash
* @param options The hash options to use
* @returns {Promise<string>} The hash of the object
*/
async function hash(object, options = {
	algorithm: "SHA-256",
	serialize: JSON.stringify
}) {
	const algorithm = options?.algorithm ?? "SHA-256";
	const objectString = (options?.serialize ?? JSON.stringify)(object);
	return new Hashery().toHash(objectString, { algorithm });
}
/**
* Hashes an object synchronously using the specified non-cryptographic algorithm.
* This method should be used for non-cryptographic algorithms (DJB2, FNV1, MURMER, CRC32).
* For cryptographic algorithms, use hash() instead.
* @param object The object to hash
* @param options The hash options to use
* @returns {string} The hash of the object
*/
function hashSync(object, options = {
	algorithm: "djb2",
	serialize: JSON.stringify
}) {
	const algorithm = options?.algorithm ?? "djb2";
	const objectString = (options?.serialize ?? JSON.stringify)(object);
	return new Hashery().toHashSync(objectString, { algorithm });
}
/**
* Hashes an object asynchronously and converts it to a number within a specified range.
* This method should be used for cryptographic algorithms (SHA-256, SHA-384, SHA-512).
* For non-cryptographic algorithms, use hashToNumberSync() for better performance.
* @param object The object to hash
* @param options The hash options to use including min/max range
* @returns {Promise<number>} A number within the specified range
*/
async function hashToNumber(object, options = {
	min: 0,
	max: 10,
	algorithm: "SHA-256",
	serialize: JSON.stringify
}) {
	const min = options?.min ?? 0;
	const max = options?.max ?? 10;
	const algorithm = options?.algorithm ?? "SHA-256";
	const serialize = options?.serialize ?? JSON.stringify;
	const hashLength = options?.hashLength ?? 16;
	if (min >= max) throw new Error(`Invalid range: min (${min}) must be less than max (${max})`);
	const objectString = serialize(object);
	return new Hashery().toNumber(objectString, {
		algorithm,
		min,
		max,
		hashLength
	});
}
/**
* Hashes an object synchronously and converts it to a number within a specified range.
* This method should be used for non-cryptographic algorithms (DJB2, FNV1, MURMER, CRC32).
* For cryptographic algorithms, use hashToNumber() instead.
* @param object The object to hash
* @param options The hash options to use including min/max range
* @returns {number} A number within the specified range
*/
function hashToNumberSync(object, options = {
	min: 0,
	max: 10,
	algorithm: "djb2",
	serialize: JSON.stringify
}) {
	const min = options?.min ?? 0;
	const max = options?.max ?? 10;
	const algorithm = options?.algorithm ?? "djb2";
	const serialize = options?.serialize ?? JSON.stringify;
	const hashLength = options?.hashLength ?? 16;
	if (min >= max) throw new Error(`Invalid range: min (${min}) must be less than max (${max})`);
	const objectString = serialize(object);
	return new Hashery().toNumberSync(objectString, {
		algorithm,
		min,
		max,
		hashLength
	});
}
//#endregion
//#region src/is-keyv-instance.ts
function isKeyvInstance(keyv) {
	if (keyv === null || keyv === void 0) return false;
	if (keyv instanceof Keyv) return true;
	return [
		"generateIterator",
		"get",
		"getMany",
		"set",
		"setMany",
		"delete",
		"deleteMany",
		"has",
		"hasMany",
		"clear",
		"disconnect",
		"serialize",
		"deserialize"
	].every((method) => typeof keyv[method] === "function");
}
//#endregion
//#region src/is-object.ts
function isObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
//#endregion
//#region src/less-than.ts
function lessThan(number1, number2) {
	return typeof number1 === "number" && typeof number2 === "number" ? number1 < number2 : false;
}
//#endregion
//#region src/memoize.ts
function wrapSync(function_, options) {
	const { ttl, keyPrefix, cache, serialize } = options;
	return (...arguments_) => {
		let cacheKey = createWrapKey(function_, arguments_, {
			keyPrefix,
			serialize
		});
		if (options.createKey) cacheKey = options.createKey(function_, arguments_, options);
		let value = cache.get(cacheKey);
		if (value === void 0) try {
			value = function_(...arguments_);
			cache.set(cacheKey, value, ttl);
		} catch (error) {
			cache.emit("error", error);
			if (options.cacheErrors) cache.set(cacheKey, error, ttl);
		}
		return value;
	};
}
async function getOrSet(key, function_, options) {
	const keyString = typeof key === "function" ? key(options) : key;
	let value;
	try {
		value = await options.cache.get(keyString);
	} catch (error) {
		options.cache.emit("error", error);
		if (options.throwErrors === true || options.throwErrors === "store") throw error;
	}
	if (value === void 0) value = await coalesceAsync(`${options.cacheId ?? "default"}::${keyString}`, async () => {
		let result;
		try {
			try {
				result = await function_();
			} catch (error) {
				throw new ErrorEnvelope(error, "function");
			}
			try {
				await options.cache.set(keyString, result, options.ttl);
			} catch (error) {
				throw new ErrorEnvelope(error, "store");
			}
			return result;
		} catch (caught) {
			const errorType = caught instanceof ErrorEnvelope ? caught.context : void 0;
			const error = caught instanceof ErrorEnvelope ? caught.error : caught;
			options.cache.emit("error", error);
			if (options.cacheErrors && errorType === "function") try {
				await options.cache.set(keyString, error, options.ttl);
			} catch (storeError) {
				options.cache.emit("error", storeError);
			}
			if (options.throwErrors === true || options.throwErrors === errorType) throw error;
		}
		return result;
	});
	return value;
}
/**
* Synchronous counterpart to {@link getOrSet}. Reads `key` from the cache and, on a miss, computes
* the value with `function_`, stores it, and returns it.
*
* Unlike {@link getOrSet} there is no request coalescing: synchronous code runs to completion
* without interleaving, so concurrent callers cannot stampede the setter the way they can with an
* async cache.
*
* Error handling mirrors {@link getOrSet}: errors are emitted on the cache's `error` event, can be
* cached when `cacheErrors` is set, and can be rethrown selectively via `throwErrors` (`true` for
* any error, `"function"` for setter errors, `"store"` for cache read/write errors).
*
* @param key - The cache key, or a function that derives it from the resolved options.
* @param function_ - The setter invoked on a cache miss to compute the value.
* @param options - The {@link GetOrSetSyncOptions} including the target synchronous cache.
* @returns The cached or freshly computed value, or `undefined`.
*/
function getOrSetSync(key, function_, options) {
	const keyString = typeof key === "function" ? key(options) : key;
	let value;
	try {
		value = options.cache.get(keyString);
	} catch (error) {
		options.cache.emit("error", error);
		if (options.throwErrors === true || options.throwErrors === "store") throw error;
	}
	if (value === void 0) try {
		try {
			value = function_();
		} catch (error) {
			throw new ErrorEnvelope(error, "function");
		}
		try {
			options.cache.set(keyString, value, options.ttl);
		} catch (error) {
			throw new ErrorEnvelope(error, "store");
		}
	} catch (caught) {
		const errorType = caught instanceof ErrorEnvelope ? caught.context : void 0;
		const error = caught instanceof ErrorEnvelope ? caught.error : caught;
		options.cache.emit("error", error);
		if (options.cacheErrors && errorType === "function") try {
			options.cache.set(keyString, error, options.ttl);
		} catch (storeError) {
			options.cache.emit("error", storeError);
		}
		if (options.throwErrors === true || options.throwErrors === errorType) throw error;
	}
	return value;
}
function wrap(function_, options) {
	const { keyPrefix, serialize } = options;
	return async (...arguments_) => {
		let cacheKey = createWrapKey(function_, arguments_, {
			keyPrefix,
			serialize
		});
		if (options.createKey) cacheKey = options.createKey(function_, arguments_, options);
		return getOrSet(cacheKey, async () => function_(...arguments_), options);
	};
}
function createWrapKey(function_, arguments_, options) {
	const { keyPrefix, serialize } = options || {};
	if (!keyPrefix) return `${function_.name}::${hashSync(arguments_, { serialize })}`;
	return `${keyPrefix}::${function_.name}::${hashSync(arguments_, { serialize })}`;
}
var ErrorEnvelope = class {
	error;
	context;
	constructor(error, context) {
		this.error = error;
		this.context = context;
	}
};
//#endregion
//#region src/run-if-fn.ts
function runIfFn(valueOrFunction, ...arguments_) {
	return typeof valueOrFunction === "function" ? valueOrFunction(...arguments_) : valueOrFunction;
}
//#endregion
//#region src/sleep.ts
const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//#endregion
//#region src/stats.ts
/**
* Event map for `@cacheable/node-cache` instances. node-cache emits with
* positional arguments (e.g. `set(key, value)`), and emits each lifecycle
* event exactly once, so the counts map cleanly. `flush` clears the cache data
* and `flush_stats` resets the stats counters, mirroring node-cache's
* `flushAll()` / `flushStats()` lifecycle.
*
* Presets for `cacheable` and `cache-manager` are intentionally not provided:
* their event streams emit per-store probes (and, for cache-manager, do not
* emit an event on a normal miss), so a simple map cannot faithfully reproduce
* their imperative stats. Wire those up with a custom map or imperative calls.
*/
const nodeCacheStatsEventMap = {
	set: (stats, key) => {
		stats.increment("sets");
		if (typeof key === "string" || typeof key === "number") stats.recordKey(String(key), "sets");
	},
	del: (stats, key) => {
		stats.increment("deletes");
		if (typeof key === "string" || typeof key === "number") stats.recordKey(String(key), "deletes");
	},
	flush: "clears",
	flush_stats: (stats) => {
		stats.reset();
	}
};
var Stats = class {
	_counters = {
		hits: 0,
		misses: 0,
		gets: 0,
		sets: 0,
		deletes: 0,
		clears: 0,
		count: 0
	};
	_vsize = 0;
	_ksize = 0;
	_enabled = false;
	_lastUpdated;
	_lastReset;
	_subscriptions = [];
	/** Backing store for the public {@link trackedKeys} read-only view. */
	_trackedKeys = /* @__PURE__ */ new Map();
	_trackKeys = false;
	_maxTrackedKeys;
	constructor(options) {
		if (options?.enabled) this._enabled = options.enabled;
		if (options?.trackKeys) this._trackKeys = options.trackKeys;
		if (options?.maxTrackedKeys !== void 0) this._maxTrackedKeys = options.maxTrackedKeys;
		if (options?.emitter && options?.eventMap) this.subscribe(options.emitter, options.eventMap);
	}
	/**
	* @returns {boolean} - Whether the stats are enabled
	*/
	get enabled() {
		return this._enabled;
	}
	/**
	* @param {boolean} enabled - Whether to enable the stats
	*/
	set enabled(enabled) {
		this._enabled = enabled;
	}
	/**
	* @returns {boolean} - Whether per-key statistics are tracked
	*/
	get trackKeys() {
		return this._trackKeys;
	}
	/**
	* @param {boolean} trackKeys - Whether to track per-key statistics
	*/
	set trackKeys(trackKeys) {
		this._trackKeys = trackKeys;
	}
	/**
	* @returns {number | undefined} - The cap on unique keys tracked, or
	* `undefined` when unbounded
	*/
	get maxTrackedKeys() {
		return this._maxTrackedKeys;
	}
	/**
	* @param {number | undefined} maxTrackedKeys - The cap on unique keys
	* tracked. Set `undefined` for unbounded.
	*/
	set maxTrackedKeys(maxTrackedKeys) {
		this._maxTrackedKeys = maxTrackedKeys;
	}
	/**
	* Per-key statistics, keyed by cache key, holding each key's raw
	* `hits`/`misses`/`gets`/`sets`/`deletes` counters. Populated by
	* {@link recordKey} when {@link trackKeys} is enabled; read `trackedKeys.size`
	* for the number of unique keys currently tracked. The returned map is a
	* read-only view — mutate per-key stats via {@link recordKey} /
	* {@link clearKeys} / {@link reset}.
	* @returns {ReadonlyMap<string, Readonly<KeyCounters>>}
	* @readonly
	*/
	get trackedKeys() {
		return this._trackedKeys;
	}
	/**
	* @returns {number} - The number of hits
	* @readonly
	*/
	get hits() {
		return this._counters.hits;
	}
	/**
	* @returns {number} - The number of misses
	* @readonly
	*/
	get misses() {
		return this._counters.misses;
	}
	/**
	* @returns {number} - The number of gets
	* @readonly
	*/
	get gets() {
		return this._counters.gets;
	}
	/**
	* @returns {number} - The number of sets
	* @readonly
	*/
	get sets() {
		return this._counters.sets;
	}
	/**
	* @returns {number} - The number of deletes
	* @readonly
	*/
	get deletes() {
		return this._counters.deletes;
	}
	/**
	* @returns {number} - The number of clears
	* @readonly
	*/
	get clears() {
		return this._counters.clears;
	}
	/**
	* @returns {number} - The vsize (value size) of the cache instance
	* @readonly
	*/
	get vsize() {
		return this._vsize;
	}
	/**
	* @returns {number} - The ksize (key size) of the cache instance
	* @readonly
	*/
	get ksize() {
		return this._ksize;
	}
	/**
	* @returns {number} - The count of the cache instance
	* @readonly
	*/
	get count() {
		return this._counters.count;
	}
	/**
	* The ratio of hits to total lookups (hits + misses). Returns `0` when there
	* have been no lookups.
	* @returns {number} - A value between 0 and 1
	* @readonly
	*/
	get hitRate() {
		const total = this._counters.hits + this._counters.misses;
		return total === 0 ? 0 : this._counters.hits / total;
	}
	/**
	* The ratio of misses to total lookups (hits + misses). Returns `0` when
	* there have been no lookups.
	* @returns {number} - A value between 0 and 1
	* @readonly
	*/
	get missRate() {
		const total = this._counters.hits + this._counters.misses;
		return total === 0 ? 0 : this._counters.misses / total;
	}
	/**
	* The timestamp (ms since epoch) of the last mutation while enabled, or
	* `undefined` if there have been none since the last reset.
	* @returns {number | undefined}
	* @readonly
	*/
	get lastUpdated() {
		return this._lastUpdated;
	}
	/**
	* The timestamp (ms since epoch) of the last {@link reset}/{@link clear}, or
	* `undefined` if it has never been reset.
	* @returns {number | undefined}
	* @readonly
	*/
	get lastReset() {
		return this._lastReset;
	}
	/**
	* Increment a counter field by `amount` (default `1`). No-op when disabled.
	* @param {StatField} field - The counter to increment
	* @param {number} amount - The amount to add (default 1)
	*/
	increment(field, amount = 1) {
		if (!this._enabled) return;
		this._counters[field] += amount;
		this.touch();
	}
	/**
	* Decrement a counter field by `amount` (default `1`). No-op when disabled.
	* @param {StatField} field - The counter to decrement
	* @param {number} amount - The amount to subtract (default 1)
	*/
	decrement(field, amount = 1) {
		if (!this._enabled) return;
		this._counters[field] -= amount;
		this.touch();
	}
	incrementHits(amount = 1) {
		this.increment("hits", amount);
	}
	incrementMisses(amount = 1) {
		this.increment("misses", amount);
	}
	incrementGets(amount = 1) {
		this.increment("gets", amount);
	}
	incrementSets(amount = 1) {
		this.increment("sets", amount);
	}
	incrementDeletes(amount = 1) {
		this.increment("deletes", amount);
	}
	incrementClears(amount = 1) {
		this.increment("clears", amount);
	}
	incrementVSize(value) {
		if (!this._enabled) return;
		this._vsize += this.roughSizeOfObject(value);
		this.touch();
	}
	decreaseVSize(value) {
		if (!this._enabled) return;
		this._vsize = Math.max(0, this._vsize - this.roughSizeOfObject(value));
		this.touch();
	}
	incrementKSize(key) {
		if (!this._enabled) return;
		this._ksize += this.roughSizeOfString(key);
		this.touch();
	}
	decreaseKSize(key) {
		if (!this._enabled) return;
		this._ksize = Math.max(0, this._ksize - this.roughSizeOfString(key));
		this.touch();
	}
	incrementCount(amount = 1) {
		this.increment("count", amount);
	}
	decreaseCount(amount = 1) {
		if (!this._enabled) return;
		this._counters.count = Math.max(0, this._counters.count - amount);
		this.touch();
	}
	setCount(count) {
		if (!this._enabled) return;
		this._counters.count = count;
		this.touch();
	}
	roughSizeOfString(value) {
		return value.length * 2;
	}
	roughSizeOfObject(object) {
		const objectList = [];
		const stack = [object];
		let bytes = 0;
		while (stack.length > 0) {
			const value = stack.pop();
			if (typeof value === "boolean") bytes += 4;
			else if (typeof value === "string") bytes += value.length * 2;
			else if (typeof value === "number") bytes += 8;
			else {
				if (value === null || value === void 0) {
					bytes += 4;
					continue;
				}
				if (objectList.includes(value)) continue;
				objectList.push(value);
				for (const key in value) {
					bytes += key.length * 2;
					stack.push(value[key]);
				}
			}
		}
		return bytes;
	}
	/**
	* Enable stat tracking. Equivalent to setting {@link enabled} to `true`.
	*/
	enable() {
		this._enabled = true;
	}
	/**
	* Disable stat tracking. Equivalent to setting {@link enabled} to `false`.
	*/
	disable() {
		this._enabled = false;
	}
	/**
	* Reset all counters to zero and record the reset timestamp. Alias of
	* {@link reset}.
	*/
	clear() {
		this.reset();
	}
	reset() {
		this._counters = {
			hits: 0,
			misses: 0,
			gets: 0,
			sets: 0,
			deletes: 0,
			clears: 0,
			count: 0
		};
		this._vsize = 0;
		this._ksize = 0;
		this._trackedKeys.clear();
		this._lastReset = Date.now();
		this._lastUpdated = void 0;
	}
	resetStoreValues() {
		this._vsize = 0;
		this._ksize = 0;
		this._counters.count = 0;
	}
	/**
	* @returns {StatsSnapshot} - A plain-object snapshot of the current stats,
	* including computed `hitRate`/`missRate` and timestamps.
	*/
	toJSON() {
		return {
			enabled: this._enabled,
			hits: this._counters.hits,
			misses: this._counters.misses,
			gets: this._counters.gets,
			sets: this._counters.sets,
			deletes: this._counters.deletes,
			clears: this._counters.clears,
			vsize: this._vsize,
			ksize: this._ksize,
			count: this._counters.count,
			hitRate: this.hitRate,
			missRate: this.missRate,
			trackedKeys: this._trackedKeys.size,
			lastUpdated: this._lastUpdated,
			lastReset: this._lastReset
		};
	}
	/**
	* @returns {StatsSnapshot} - A plain-object snapshot of the current stats.
	* Alias of {@link toJSON}.
	*/
	snapshot() {
		return this.toJSON();
	}
	/**
	* Record an operation against a specific key for per-key statistics. No-op
	* unless both {@link enabled} and {@link trackKeys} are `true`.
	* @param {string} key - The cache key the operation touched
	* @param {KeyStatField} field - The per-key counter to increment
	* @param {number} amount - The amount to add (default 1)
	*/
	recordKey(key, field, amount = 1) {
		if (!this._enabled || !this._trackKeys) return;
		let counters = this._trackedKeys.get(key);
		if (!counters) {
			counters = {
				hits: 0,
				misses: 0,
				gets: 0,
				sets: 0,
				deletes: 0
			};
			this._trackedKeys.set(key, counters);
			this.pruneTrackedKeys(key);
		}
		counters[field] += amount;
		this.touch();
	}
	/**
	* The most-used keys, sorted descending. Sorts by total recorded operations,
	* or by a single field when `field` is provided. Ties order by key.
	* @param {number} limit - Maximum entries to return (default 100)
	* @param {KeyStatField} [field] - Optionally rank by one counter (e.g. "hits")
	* @returns {StatsKeyEntry[]}
	*/
	mostUsedKeys(limit = 100, field) {
		return this.sortedKeyEntries(field, "desc").slice(0, limit);
	}
	/**
	* The least-used keys, sorted ascending. Sorts by total recorded operations,
	* or by a single field when `field` is provided. Ties order by key. Note:
	* only keys that have been recorded at least once can be ranked, and when
	* {@link maxTrackedKeys} pruning has occurred the true least-used keys may
	* have been evicted.
	* @param {number} limit - Maximum entries to return (default 100)
	* @param {KeyStatField} [field] - Optionally rank by one counter (e.g. "gets")
	* @returns {StatsKeyEntry[]}
	*/
	leastUsedKeys(limit = 100, field) {
		return this.sortedKeyEntries(field, "asc").slice(0, limit);
	}
	/**
	* @param {string} key - The key to look up
	* @returns {StatsKeyEntry | undefined} - The per-key statistics, or
	* `undefined` if the key has not been recorded
	*/
	keyStats(key) {
		const counters = this._trackedKeys.get(key);
		return counters ? this.toKeyEntry(key, counters) : void 0;
	}
	/**
	* Clear all per-key statistics without touching the aggregate counters.
	*/
	clearKeys() {
		this._trackedKeys.clear();
	}
	totalOf(counters) {
		return counters.hits + counters.misses + counters.gets + counters.sets + counters.deletes;
	}
	toKeyEntry(key, counters) {
		const lookups = counters.hits + counters.misses;
		return {
			key,
			count: this.totalOf(counters),
			hits: counters.hits,
			misses: counters.misses,
			gets: counters.gets,
			sets: counters.sets,
			deletes: counters.deletes,
			hitRate: lookups === 0 ? 0 : counters.hits / lookups
		};
	}
	sortedKeyEntries(field, direction) {
		const entries = [];
		for (const [key, counters] of this._trackedKeys) entries.push(this.toKeyEntry(key, counters));
		const sign = direction === "asc" ? 1 : -1;
		entries.sort((a, b) => {
			const valueA = field ? a[field] : a.count;
			const valueB = field ? b[field] : b.count;
			if (valueA !== valueB) return (valueA - valueB) * sign;
			return a.key < b.key ? -1 : 1;
		});
		return entries;
	}
	/**
	* When over {@link maxTrackedKeys}, prune the lowest-count keys down to 90%
	* of the cap (batched so the sort cost amortizes across inserts). The key
	* that was just recorded is never pruned.
	*/
	pruneTrackedKeys(protectedKey) {
		if (this._maxTrackedKeys === void 0 || this._trackedKeys.size <= this._maxTrackedKeys) return;
		const target = Math.max(1, Math.floor(this._maxTrackedKeys * .9));
		const sorted = [...this._trackedKeys.entries()].sort((a, b) => this.totalOf(a[1]) - this.totalOf(b[1]));
		for (const [key] of sorted) {
			if (this._trackedKeys.size <= target) break;
			if (key === protectedKey) continue;
			this._trackedKeys.delete(key);
		}
	}
	/**
	* Subscribe to an emitter so that matching events automatically update the
	* stats. Counting is gated by {@link enabled}, so you may subscribe first and
	* toggle enablement later. Call {@link unsubscribe} to detach.
	* @param {StatsEmitter} emitter - The emitter to listen on
	* @param {StatsEventMap} eventMap - The event-to-stat mapping (e.g.
	* {@link nodeCacheStatsEventMap} or a custom map)
	*/
	subscribe(emitter, eventMap) {
		for (const [event, action] of Object.entries(eventMap)) {
			const listener = (...args) => {
				this.applyEvent(action, args);
			};
			emitter.on(event, listener);
			this._subscriptions.push({
				emitter,
				event,
				listener
			});
		}
	}
	/**
	* Detach listeners previously attached via {@link subscribe}. When `emitter`
	* is provided, only that emitter's listeners are removed; otherwise all are.
	* @param {StatsEmitter} [emitter] - The emitter to detach from
	*/
	unsubscribe(emitter) {
		const remaining = [];
		for (const sub of this._subscriptions) {
			if (emitter && sub.emitter !== emitter) {
				remaining.push(sub);
				continue;
			}
			(sub.emitter.off ?? sub.emitter.removeListener)?.call(sub.emitter, sub.event, sub.listener);
		}
		this._subscriptions = remaining;
	}
	applyEvent(action, args) {
		if (!this._enabled) return;
		if (typeof action === "function") {
			action(this, ...args);
			return;
		}
		if (Array.isArray(action)) {
			for (const field of action) this.increment(field);
			return;
		}
		this.increment(action);
	}
	touch() {
		this._lastUpdated = Date.now();
	}
};
//#endregion
//#region src/ttl.ts
/**
* Normalizes a TTL input into per-store milliseconds. When given an object it resolves the
* `primary` and `secondary` fields independently; when given a number or shorthand string it
* applies the same value to both stores. Undefined fields (or undefined input) resolve to
* `undefined` so the caller can fall back to its own default TTL.
* @param ttl - The TTL input: a number (ms), a shorthand string, or a {@link PerStoreTtl} object.
* @returns {{ primary?: number; secondary?: number }} The resolved per-store TTLs in milliseconds.
*/
function resolvePerStoreTtl(ttl) {
	if (ttl === void 0 || ttl === null) return {
		primary: void 0,
		secondary: void 0
	};
	if (typeof ttl === "object") return {
		primary: shorthandToMilliseconds(ttl.primary),
		secondary: shorthandToMilliseconds(ttl.secondary)
	};
	const milliseconds = shorthandToMilliseconds(ttl);
	return {
		primary: milliseconds,
		secondary: milliseconds
	};
}
/**
* Converts a exspires value to a TTL value.
* @param expires - The expires value to convert.
* @returns {number | undefined} The TTL value in milliseconds, or undefined if the expires value is not valid.
*/
function getTtlFromExpires(expires) {
	if (expires === void 0 || expires === null) return;
	const now = Date.now();
	if (expires < now) return;
	return expires - now;
}
/**
* Get the TTL value from the cacheableTtl, primaryTtl, and secondaryTtl values.
* @param cacheableTtl - The cacheableTtl value to use.
* @param primaryTtl - The primaryTtl value to use.
* @param secondaryTtl - The secondaryTtl value to use.
* @returns {number | undefined} The TTL value in milliseconds, or undefined if all values are undefined.
*/
function getCascadingTtl(cacheableTtl, primaryTtl, secondaryTtl) {
	return secondaryTtl ?? primaryTtl ?? shorthandToMilliseconds(cacheableTtl);
}
/**
* Calculate the TTL value from the expires value. If the ttl is undefined, it will be set to the expires value. If the
* expires value is undefined, it will be set to the ttl value. If both values are defined, the smaller of the two will be used.
* @param ttl
* @param expires
* @returns
*/
function calculateTtlFromExpiration(ttl, expires) {
	const ttlFromExpires = getTtlFromExpires(expires);
	const expiresFromTtl = ttl ? Date.now() + ttl : void 0;
	if (ttlFromExpires === void 0) return ttl;
	if (expiresFromTtl === void 0) return ttlFromExpires;
	if (expires && expires > expiresFromTtl) return ttl;
	return ttlFromExpires;
}
//#endregion
export { CacheTags, HashAlgorithm, Stats, calculateTtlFromExpiration, coalesceAsync, createWrapKey, getCascadingTtl, getOrSet, getOrSetSync, getTtlFromExpires, hash, hashSync, hashToNumber, hashToNumberSync, isKeyvInstance, isObject, lessThan, nodeCacheStatsEventMap, resolvePerStoreTtl, runIfFn, shorthandToMilliseconds, shorthandToTime, sleep, wrap, wrapSync };
