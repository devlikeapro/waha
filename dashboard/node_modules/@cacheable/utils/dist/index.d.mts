import { Keyv } from "keyv";

//#region src/shorthand-time.d.ts
/**
 * Converts a shorthand time string or number into milliseconds.
 * The shorthand can be a string like '1s', '2m', '3h', '4d', or a number representing milliseconds.
 * If the input is undefined, it returns undefined.
 * If the input is a string that does not match the expected format, it throws an error.
 * @param shorthand - A shorthand time string or number representing milliseconds.
 * @returns The equivalent time in milliseconds or undefined.
 */
declare const shorthandToMilliseconds: (shorthand?: string | number) => number | undefined;
/**
 * Converts a shorthand time string or number into a timestamp.
 * If the shorthand is undefined, it returns the current date's timestamp.
 * If the shorthand is a valid time format, it adds that duration to the current date's timestamp.
 * @param shorthand - A shorthand time string or number representing milliseconds.
 * @param fromDate - An optional Date object to calculate from. Defaults to the current date if not provided.
 * @returns The timestamp in milliseconds since epoch.
 */
declare const shorthandToTime: (shorthand?: string | number, fromDate?: Date) => number;
//#endregion
//#region src/cache-tags.d.ts
/**
 * Options for constructing a {@link CacheTags}.
 * @typedef {Object} CacheTagsOptions
 * @property {Keyv} store - The Keyv store used to persist tag versions and key snapshots.
 * @property {string} [namespace] - An optional namespace that isolates this service's tags
 * and keys from others sharing the same store. Defaults to `"default"`.
 * @property {boolean} [enabled] - Whether the service is enabled. While disabled, every method
 * is a no-op: read methods return their neutral value ({@link CacheTags.isKeyFresh} returns
 * `true`, {@link CacheTags.isKeyStale} returns `false`, etc.) and writes are skipped. The
 * service must be explicitly enabled to use tags. Defaults to `true`.
 * @property {(error: unknown) => void} [onError] - Invoked with errors from non-blocking
 * (fire-and-forget) operations, which cannot be thrown to the caller. Defaults to ignoring them.
 */
type CacheTagsOptions = {
  store: Keyv;
  namespace?: string;
  enabled?: boolean;
  onError?: (error: unknown) => void;
};
/**
 * Options for {@link CacheTags.setKeyTags}.
 * @typedef {Object} SetKeyTagsOptions
 * @property {number} [ttl] - Time-to-live in milliseconds for the key's tag snapshot. Should
 * match the TTL of the cached value it tracks so the snapshot expires alongside it. If omitted,
 * the snapshot does not expire.
 * @property {boolean} [nonBlocking] - When `true`, the snapshot write is fire-and-forget:
 * the call resolves immediately and failures are reported via the `onError` option.
 */
type SetKeyTagsOptions = {
  ttl?: number;
  nonBlocking?: boolean;
};
/**
 * Options for {@link CacheTags.removeKey} and {@link CacheTags.removeKeys}.
 * @typedef {Object} RemoveKeysOptions
 * @property {boolean} [nonBlocking] - When `true`, the removal is fire-and-forget:
 * the call resolves immediately and failures are reported via the `onError` option.
 */
type RemoveKeysOptions = {
  nonBlocking?: boolean;
};
/**
 * The metadata stored for a tagged key. It records the version of each tag at the moment the key
 * was written, allowing {@link CacheTags.isKeyFresh} to detect later invalidations.
 * @typedef {Object} KeyTagEntry
 * @property {Record<string, number>} tags - A snapshot mapping each tag name to its version at set time.
 */
type KeyTagEntry = {
  tags: Record<string, number>;
};
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
declare class CacheTags {
  private readonly _store;
  private readonly _namespace;
  private _enabled;
  private readonly _onError?;
  /**
   * Creates a new tag service.
   * @param {CacheTagsOptions} options - The store, optional namespace, enabled state, and
   * non-blocking error handler to use.
   */
  constructor(options: CacheTagsOptions);
  /**
   * The Keyv store backing this service.
   * @returns {Keyv} The store provided to the constructor.
   */
  get store(): Keyv;
  /**
   * The namespace isolating this service's tags and keys within the store.
   * @returns {string} The configured namespace, or `"default"` if none was provided.
   */
  get namespace(): string;
  /**
   * Whether the service is enabled. While disabled, every method is a no-op — read methods
   * return their neutral value and writes are skipped — so integrations pay no extra store
   * reads for untagged workloads. The service must be explicitly enabled to use tags; it never
   * enables itself.
   * @returns {boolean} Whether the service is enabled.
   */
  get enabled(): boolean;
  /**
   * Sets whether the service is enabled.
   * @param {boolean} enabled Whether the service is enabled.
   */
  set enabled(enabled: boolean);
  /**
   * Builds the reserved store key under which a tag's version counter is stored.
   * @param tag - The tag name.
   * @returns {string} The namespaced store key for the tag's version.
   */
  private tagKey;
  /**
   * Builds the reserved store key under which a cache key's tag snapshot is stored.
   * @param key - The cache key being tagged.
   * @returns {string} The namespaced store key for the key's snapshot.
   */
  private keyEntryKey;
  /**
   * Builds the common prefix shared by every key-snapshot entry in this namespace. Used to filter
   * key entries when iterating the store.
   * @returns {string} The namespaced key-entry prefix.
   */
  private keyPrefix;
  /**
   * Reads the current version of a single tag.
   * @param tag - The tag name.
   * @returns {Promise<number>} The tag's version, or `0` if it has never been invalidated.
   */
  private getTagVersion;
  /**
   * Reads the current versions of multiple tags in a single batched store read.
   * @param tags - The tag names to look up.
   * @returns {Promise<number[]>} The versions in the same order as `tags`; entries that have never
   * been invalidated resolve to `0`. Returns an empty array when `tags` is empty.
   */
  private getTagVersions;
  /**
   * Reports a fire-and-forget failure to the `onError` handler, if one was provided.
   * @param error - The error raised by the non-blocking operation.
   */
  private handleNonBlockingError;
  /**
   * Reads the version snapshot of each tag and writes the key's tag snapshot to the store.
   * @param key - The cache key to tag.
   * @param tags - The tags to associate with the key.
   * @param ttl - Time-to-live in milliseconds for the snapshot.
   * @returns {Promise<void>} Resolves once the snapshot has been written.
   */
  private writeKeyTags;
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
  setKeyTags(key: string, tags: string[], options?: SetKeyTagsOptions): Promise<void>;
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
  removeKey(key: string, options?: RemoveKeysOptions): Promise<void>;
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
  removeKeys(keys: string[], options?: RemoveKeysOptions): Promise<void>;
  /**
   * Determines whether a key's cached value can still be trusted. A key is fresh only when a
   * snapshot exists for it and every tag in that snapshot still has the version it had at set time.
   * A key with no tags is trivially fresh. Call this before returning a value from your cache.
   * Always returns `true` while the service is disabled.
   * @param key - The cache key to check.
   * @returns {Promise<boolean>} `true` if the key is still fresh; `false` if it is unknown or any of
   * its tags has been invalidated since the snapshot was taken.
   */
  isKeyFresh(key: string): Promise<boolean>;
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
  isKeyStale(key: string): Promise<boolean>;
  /**
   * Determines which of the given keys are known to be stale due to tag invalidation, using two
   * batched store reads regardless of how many keys are checked: one for the snapshots and one for
   * the union of their tag versions. Keys without a snapshot are not considered stale. Returns an
   * empty array while the service is disabled.
   * @param keys - The cache keys to check.
   * @returns {Promise<string[]>} The subset of `keys` whose snapshot references at least one tag
   * that has been invalidated since the snapshot was taken.
   */
  getStaleKeys(keys: string[]): Promise<string[]>;
  /**
   * Returns the tags currently associated with a key. Returns `undefined` while the service is
   * disabled.
   * @param key - The cache key to look up.
   * @returns {Promise<string[] | undefined>} The tag names from the key's snapshot, or `undefined`
   * if the key has no snapshot.
   */
  getTags(key: string): Promise<string[] | undefined>;
  /**
   * Returns all cache keys whose snapshot references the given tag. This scans every key entry in
   * the namespace via the Keyv iterator, making it an `O(N)` operation intended for debugging and
   * tests rather than hot paths. Returns an empty array if the underlying store exposes no iterator
   * or while the service is disabled.
   * @param tag - The tag to search for.
   * @returns {Promise<string[]>} The cache keys (with the reserved prefix stripped) referencing the tag.
   */
  getKeysByTag(tag: string): Promise<string[]>;
  /**
   * Invalidates a single tag by incrementing its version counter. Every key whose snapshot
   * references this tag becomes stale immediately. Runs in constant time regardless of how many
   * keys reference the tag. No-op while the service is disabled.
   * @param tag - The tag to invalidate.
   * @returns {Promise<string[]>} A single-element array containing the invalidated tag, or an
   * empty array while the service is disabled.
   */
  invalidateTag(tag: string): Promise<string[]>;
  /**
   * Invalidates multiple tags by incrementing each of their version counters in a single batched
   * store write. Duplicate tags are bumped once. An empty list is a no-op, as is the entire call
   * while the service is disabled.
   * @param tags - The tags to invalidate.
   * @returns {Promise<string[]>} The `tags` argument as provided (including any duplicates), or
   * an empty array while the service is disabled.
   */
  invalidateTags(tags: string[]): Promise<string[]>;
}
//#endregion
//#region src/cacheable-item-types.d.ts
/**
 * CacheableItem
 * @typedef {Object} CacheableItem
 * @property {string} key - The key of the cacheable item
 * @property {any} value - The value of the cacheable item
 * @property {number|string} [ttl] - Time to Live - If you set a number it is miliseconds, if you set a string it is a human-readable
 * format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means that it will use the default time-to-live. If both are
 * undefined then it will not have a time-to-live.
 */
type CacheableItem = {
  key: string;
  value: any;
  ttl?: number | string;
};
/**
 * CacheableStoreItem
 * @typedef {Object} CacheableStoreItem
 * @property {string} key - The key of the cacheable store item
 * @property {any} value - The value of the cacheable store item
 * @property {number} [expires] - The expiration time in milliseconds since epoch. If not set, the item does not expire.
 */
type CacheableStoreItem = {
  key: string;
  value: any;
  expires?: number;
};
//#endregion
//#region src/coalesce-async.d.ts
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
declare function coalesceAsync<T>(
/**
 * Any identifier to group requests together.
 */

key: string,
/**
 * The function to run.
 */

fnc: () => T | PromiseLike<T>): Promise<T>;
//#endregion
//#region src/hash.d.ts
declare enum HashAlgorithm {
  SHA256 = "SHA-256",
  SHA384 = "SHA-384",
  SHA512 = "SHA-512",
  DJB2 = "djb2",
  FNV1 = "fnv1",
  MURMER = "murmer",
  CRC32 = "crc32"
}
type HashOptions = {
  algorithm?: HashAlgorithm;
  serialize?: (object: any) => string;
};
type HashToNumberOptions = HashOptions & {
  min?: number;
  max?: number;
  hashLength?: number;
};
/**
 * Hashes an object asynchronously using the specified cryptographic algorithm.
 * This method should be used for cryptographic algorithms (SHA-256, SHA-384, SHA-512).
 * For non-cryptographic algorithms, use hashSync() for better performance.
 * @param object The object to hash
 * @param options The hash options to use
 * @returns {Promise<string>} The hash of the object
 */
declare function hash(object: any, options?: HashOptions): Promise<string>;
/**
 * Hashes an object synchronously using the specified non-cryptographic algorithm.
 * This method should be used for non-cryptographic algorithms (DJB2, FNV1, MURMER, CRC32).
 * For cryptographic algorithms, use hash() instead.
 * @param object The object to hash
 * @param options The hash options to use
 * @returns {string} The hash of the object
 */
declare function hashSync(object: any, options?: HashOptions): string;
/**
 * Hashes an object asynchronously and converts it to a number within a specified range.
 * This method should be used for cryptographic algorithms (SHA-256, SHA-384, SHA-512).
 * For non-cryptographic algorithms, use hashToNumberSync() for better performance.
 * @param object The object to hash
 * @param options The hash options to use including min/max range
 * @returns {Promise<number>} A number within the specified range
 */
declare function hashToNumber(object: any, options?: HashToNumberOptions): Promise<number>;
/**
 * Hashes an object synchronously and converts it to a number within a specified range.
 * This method should be used for non-cryptographic algorithms (DJB2, FNV1, MURMER, CRC32).
 * For cryptographic algorithms, use hashToNumber() instead.
 * @param object The object to hash
 * @param options The hash options to use including min/max range
 * @returns {number} A number within the specified range
 */
declare function hashToNumberSync(object: any, options?: HashToNumberOptions): number;
//#endregion
//#region src/is-keyv-instance.d.ts
declare function isKeyvInstance(keyv: any): boolean;
//#endregion
//#region src/is-object.d.ts
declare function isObject<T = Record<string, unknown>>(value: unknown): value is T;
//#endregion
//#region src/less-than.d.ts
declare function lessThan(number1?: number, number2?: number): boolean;
//#endregion
//#region src/ttl.d.ts
/**
 * A per-store time-to-live override. Each field is a normal TTL (a number in milliseconds or a
 * human-readable shorthand such as `1s`, `1m`, `1h`, `1d`) applied to that specific store. Fields
 * left undefined fall back to that store's own default TTL resolution.
 */
type PerStoreTtl = {
  /**
   * The time-to-live to use for the primary store.
   */
  primary?: number | string;
  /**
   * The time-to-live to use for the secondary store.
   */
  secondary?: number | string;
};
/**
 * Normalizes a TTL input into per-store milliseconds. When given an object it resolves the
 * `primary` and `secondary` fields independently; when given a number or shorthand string it
 * applies the same value to both stores. Undefined fields (or undefined input) resolve to
 * `undefined` so the caller can fall back to its own default TTL.
 * @param ttl - The TTL input: a number (ms), a shorthand string, or a {@link PerStoreTtl} object.
 * @returns {{ primary?: number; secondary?: number }} The resolved per-store TTLs in milliseconds.
 */
declare function resolvePerStoreTtl(ttl?: number | string | PerStoreTtl): {
  primary?: number;
  secondary?: number;
};
/**
 * Converts a exspires value to a TTL value.
 * @param expires - The expires value to convert.
 * @returns {number | undefined} The TTL value in milliseconds, or undefined if the expires value is not valid.
 */
declare function getTtlFromExpires(expires: number | undefined): number | undefined;
/**
 * Get the TTL value from the cacheableTtl, primaryTtl, and secondaryTtl values.
 * @param cacheableTtl - The cacheableTtl value to use.
 * @param primaryTtl - The primaryTtl value to use.
 * @param secondaryTtl - The secondaryTtl value to use.
 * @returns {number | undefined} The TTL value in milliseconds, or undefined if all values are undefined.
 */
declare function getCascadingTtl(cacheableTtl?: number | string, primaryTtl?: number, secondaryTtl?: number): number | undefined;
/**
 * Calculate the TTL value from the expires value. If the ttl is undefined, it will be set to the expires value. If the
 * expires value is undefined, it will be set to the ttl value. If both values are defined, the smaller of the two will be used.
 * @param ttl
 * @param expires
 * @returns
 */
declare function calculateTtlFromExpiration(ttl: number | undefined, expires: number | undefined): number | undefined;
//#endregion
//#region src/memoize.d.ts
type CacheInstance = {
  get: (key: string) => Promise<any | undefined>;
  has: (key: string) => Promise<boolean>;
  set: (key: string, value: any, ttl?: number | string | PerStoreTtl) => Promise<void>;
  on: (event: string, listener: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => boolean;
};
type CacheSyncInstance = {
  get: (key: string) => any | undefined;
  has: (key: string) => boolean;
  set: (key: string, value: any, ttl?: number | string) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => boolean;
};
type GetOrSetKey = string | ((options?: GetOrSetOptions) => string);
type GetOrSetThrowErrorsContext = "function" | "store";
type GetOrSetFunctionOptions = {
  ttl?: number | string;
  cacheErrors?: boolean;
  /** Whether or not to throw errors:
   * - `false` (default) - do not throw any errors
   * - `true` - throw any error
   * - `"function"` - only throw errors that occur in the provided function / setter
   * - `"store"` - only throw errors that occur when getting/setting the cache
   */
  throwErrors?: boolean | GetOrSetThrowErrorsContext;
  /**
   * If set, this will bypass the instances nonBlocking setting for the get call.
   * @type {boolean}
   */
  nonBlocking?: boolean;
};
type GetOrSetOptions = Omit<GetOrSetFunctionOptions, "ttl"> & {
  ttl?: number | string | PerStoreTtl;
  cacheId?: string;
  cache: CacheInstance;
};
/**
 * Options for {@link getOrSetSync}, the synchronous counterpart to {@link GetOrSetOptions}. It
 * targets a {@link CacheSyncInstance} and its `ttl` is always a single value (a number in
 * milliseconds or a shorthand string), never a per-store object. The inherited `nonBlocking`
 * option has no effect on a single, synchronous store.
 */
type GetOrSetSyncOptions = GetOrSetFunctionOptions & {
  cache: CacheSyncInstance;
};
/**
 * A cache key for {@link getOrSetSync}: either a string or a function that derives the key from the
 * resolved {@link GetOrSetSyncOptions}.
 */
type GetOrSetSyncKey = string | ((options?: GetOrSetSyncOptions) => string);
type CreateWrapKey = (function_: AnyFunction, arguments_: any[], options?: WrapFunctionOptions) => string;
type WrapFunctionOptions = {
  ttl?: number | string;
  keyPrefix?: string;
  createKey?: CreateWrapKey;
  cacheErrors?: boolean;
  cacheId?: string;
  serialize?: (object: any) => string;
};
type WrapOptions = Omit<WrapFunctionOptions, "ttl"> & {
  ttl?: number | string | PerStoreTtl;
  cache: CacheInstance;
  serialize?: (object: any) => string;
};
type WrapSyncOptions = WrapFunctionOptions & {
  cache: CacheSyncInstance;
  serialize?: (object: any) => string;
};
type AnyFunction = (...arguments_: any[]) => any;
declare function wrapSync<T>(function_: AnyFunction, options: WrapSyncOptions): AnyFunction;
declare function getOrSet<T>(key: GetOrSetKey, function_: () => Promise<T>, options: GetOrSetOptions): Promise<T | undefined>;
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
declare function getOrSetSync<T>(key: GetOrSetSyncKey, function_: () => T, options: GetOrSetSyncOptions): T | undefined;
declare function wrap<T>(function_: AnyFunction, options: WrapOptions): AnyFunction;
type CreateWrapKeyOptions = {
  keyPrefix?: string;
  serialize?: (object: any) => string;
};
declare function createWrapKey(function_: AnyFunction, arguments_: any[], options?: CreateWrapKeyOptions): string;
//#endregion
//#region src/run-if-fn.d.ts
type Function_<P, T> = (...arguments_: P[]) => T;
declare function runIfFn<T, P>(valueOrFunction: T | Function_<P, T>, ...arguments_: P[]): T;
//#endregion
//#region src/sleep.d.ts
declare const sleep: (ms: number) => Promise<unknown>;
//#endregion
//#region src/stats.d.ts
/**
 * A counter field that can be incremented or decremented via the unified
 * {@link Stats.increment} / {@link Stats.decrement} API or an event map.
 */
type StatField = "hits" | "misses" | "gets" | "sets" | "deletes" | "clears" | "count";
/**
 * A duck-typed event emitter. This intentionally matches both `Hookified`
 * (used by `cacheable`, `node-cache`, `memory`, `flat-cache`) and Node's
 * built-in `EventEmitter` (used by `cache-manager`, `cacheable-request`)
 * without adding a hard dependency on either.
 */
type StatsEmitter = {
  on(event: string, listener: (...args: any[]) => void): unknown;
  off?(event: string, listener: (...args: any[]) => void): unknown;
  removeListener?(event: string, listener: (...args: any[]) => void): unknown;
};
/**
 * A custom handler invoked when a subscribed event fires. It receives the
 * {@link Stats} instance and the raw event arguments (which may be positional,
 * e.g. node-cache emits `(key, value)`).
 */
type StatsEventHandler = (stats: Stats, ...args: any[]) => void;
/**
 * Maps an event name to the stat update it should perform: a single field to
 * increment, an array of fields to increment, or a custom handler.
 */
type StatsEventMap = Record<string, StatField | StatField[] | StatsEventHandler>;
/**
 * A counter field that can be recorded per key via {@link Stats.recordKey}.
 * This is the subset of {@link StatField} that makes sense for a single key
 * (`clears` and `count` are cache-wide).
 */
type KeyStatField = "hits" | "misses" | "gets" | "sets" | "deletes";
/**
 * Per-key statistics returned by {@link Stats.mostUsedKeys},
 * {@link Stats.leastUsedKeys}, and {@link Stats.keyStats}.
 */
type StatsKeyEntry = {
  key: string; /** Total recorded operations for this key (sum of all fields). */
  count: number;
  hits: number;
  misses: number;
  gets: number;
  sets: number;
  deletes: number; /** `hits / (hits + misses)` for this key, or `0` when there have been no lookups. */
  hitRate: number;
};
/**
 * A plain-object snapshot of a {@link Stats} instance, suitable for logging,
 * metrics, or serialization. Returned by {@link Stats.toJSON}.
 */
type StatsSnapshot = {
  enabled: boolean;
  hits: number;
  misses: number;
  gets: number;
  sets: number;
  deletes: number;
  clears: number;
  vsize: number;
  ksize: number;
  count: number;
  hitRate: number;
  missRate: number; /** Number of unique keys currently tracked (0 when key tracking is off). */
  trackedKeys: number;
  lastUpdated?: number;
  lastReset?: number;
};
type StatsOptions = {
  /** Whether the stats are enabled. Defaults to `false`. */enabled?: boolean; /** Optionally subscribe to an emitter immediately on construction. */
  emitter?: StatsEmitter; /** The event map to use. Required when `emitter` is provided. */
  eventMap?: StatsEventMap; /** Track per-key statistics via {@link Stats.recordKey}. Defaults to `false`. */
  trackKeys?: boolean;
  /**
   * Safety cap on the number of unique keys tracked. When exceeded, the
   * lowest-count keys are pruned, which keeps {@link Stats.mostUsedKeys}
   * approximately accurate but makes {@link Stats.leastUsedKeys} unreliable.
   * Unbounded when unset.
   */
  maxTrackedKeys?: number;
};
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
declare const nodeCacheStatsEventMap: StatsEventMap;
/**
 * Raw per-key counters stored in {@link Stats.trackedKeys}: the
 * `hits`/`misses`/`gets`/`sets`/`deletes` totals for a single cache key.
 */
type KeyCounters = Record<KeyStatField, number>;
declare class Stats {
  private _counters;
  private _vsize;
  private _ksize;
  private _enabled;
  private _lastUpdated;
  private _lastReset;
  private _subscriptions;
  /** Backing store for the public {@link trackedKeys} read-only view. */
  private _trackedKeys;
  private _trackKeys;
  private _maxTrackedKeys;
  constructor(options?: StatsOptions);
  /**
   * @returns {boolean} - Whether the stats are enabled
   */
  get enabled(): boolean;
  /**
   * @param {boolean} enabled - Whether to enable the stats
   */
  set enabled(enabled: boolean);
  /**
   * @returns {boolean} - Whether per-key statistics are tracked
   */
  get trackKeys(): boolean;
  /**
   * @param {boolean} trackKeys - Whether to track per-key statistics
   */
  set trackKeys(trackKeys: boolean);
  /**
   * @returns {number | undefined} - The cap on unique keys tracked, or
   * `undefined` when unbounded
   */
  get maxTrackedKeys(): number | undefined;
  /**
   * @param {number | undefined} maxTrackedKeys - The cap on unique keys
   * tracked. Set `undefined` for unbounded.
   */
  set maxTrackedKeys(maxTrackedKeys: number | undefined);
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
  get trackedKeys(): ReadonlyMap<string, Readonly<KeyCounters>>;
  /**
   * @returns {number} - The number of hits
   * @readonly
   */
  get hits(): number;
  /**
   * @returns {number} - The number of misses
   * @readonly
   */
  get misses(): number;
  /**
   * @returns {number} - The number of gets
   * @readonly
   */
  get gets(): number;
  /**
   * @returns {number} - The number of sets
   * @readonly
   */
  get sets(): number;
  /**
   * @returns {number} - The number of deletes
   * @readonly
   */
  get deletes(): number;
  /**
   * @returns {number} - The number of clears
   * @readonly
   */
  get clears(): number;
  /**
   * @returns {number} - The vsize (value size) of the cache instance
   * @readonly
   */
  get vsize(): number;
  /**
   * @returns {number} - The ksize (key size) of the cache instance
   * @readonly
   */
  get ksize(): number;
  /**
   * @returns {number} - The count of the cache instance
   * @readonly
   */
  get count(): number;
  /**
   * The ratio of hits to total lookups (hits + misses). Returns `0` when there
   * have been no lookups.
   * @returns {number} - A value between 0 and 1
   * @readonly
   */
  get hitRate(): number;
  /**
   * The ratio of misses to total lookups (hits + misses). Returns `0` when
   * there have been no lookups.
   * @returns {number} - A value between 0 and 1
   * @readonly
   */
  get missRate(): number;
  /**
   * The timestamp (ms since epoch) of the last mutation while enabled, or
   * `undefined` if there have been none since the last reset.
   * @returns {number | undefined}
   * @readonly
   */
  get lastUpdated(): number | undefined;
  /**
   * The timestamp (ms since epoch) of the last {@link reset}/{@link clear}, or
   * `undefined` if it has never been reset.
   * @returns {number | undefined}
   * @readonly
   */
  get lastReset(): number | undefined;
  /**
   * Increment a counter field by `amount` (default `1`). No-op when disabled.
   * @param {StatField} field - The counter to increment
   * @param {number} amount - The amount to add (default 1)
   */
  increment(field: StatField, amount?: number): void;
  /**
   * Decrement a counter field by `amount` (default `1`). No-op when disabled.
   * @param {StatField} field - The counter to decrement
   * @param {number} amount - The amount to subtract (default 1)
   */
  decrement(field: StatField, amount?: number): void;
  incrementHits(amount?: number): void;
  incrementMisses(amount?: number): void;
  incrementGets(amount?: number): void;
  incrementSets(amount?: number): void;
  incrementDeletes(amount?: number): void;
  incrementClears(amount?: number): void;
  incrementVSize(value: any): void;
  decreaseVSize(value: any): void;
  incrementKSize(key: string): void;
  decreaseKSize(key: string): void;
  incrementCount(amount?: number): void;
  decreaseCount(amount?: number): void;
  setCount(count: number): void;
  roughSizeOfString(value: string): number;
  roughSizeOfObject(object: any): number;
  /**
   * Enable stat tracking. Equivalent to setting {@link enabled} to `true`.
   */
  enable(): void;
  /**
   * Disable stat tracking. Equivalent to setting {@link enabled} to `false`.
   */
  disable(): void;
  /**
   * Reset all counters to zero and record the reset timestamp. Alias of
   * {@link reset}.
   */
  clear(): void;
  reset(): void;
  resetStoreValues(): void;
  /**
   * @returns {StatsSnapshot} - A plain-object snapshot of the current stats,
   * including computed `hitRate`/`missRate` and timestamps.
   */
  toJSON(): StatsSnapshot;
  /**
   * @returns {StatsSnapshot} - A plain-object snapshot of the current stats.
   * Alias of {@link toJSON}.
   */
  snapshot(): StatsSnapshot;
  /**
   * Record an operation against a specific key for per-key statistics. No-op
   * unless both {@link enabled} and {@link trackKeys} are `true`.
   * @param {string} key - The cache key the operation touched
   * @param {KeyStatField} field - The per-key counter to increment
   * @param {number} amount - The amount to add (default 1)
   */
  recordKey(key: string, field: KeyStatField, amount?: number): void;
  /**
   * The most-used keys, sorted descending. Sorts by total recorded operations,
   * or by a single field when `field` is provided. Ties order by key.
   * @param {number} limit - Maximum entries to return (default 100)
   * @param {KeyStatField} [field] - Optionally rank by one counter (e.g. "hits")
   * @returns {StatsKeyEntry[]}
   */
  mostUsedKeys(limit?: number, field?: KeyStatField): StatsKeyEntry[];
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
  leastUsedKeys(limit?: number, field?: KeyStatField): StatsKeyEntry[];
  /**
   * @param {string} key - The key to look up
   * @returns {StatsKeyEntry | undefined} - The per-key statistics, or
   * `undefined` if the key has not been recorded
   */
  keyStats(key: string): StatsKeyEntry | undefined;
  /**
   * Clear all per-key statistics without touching the aggregate counters.
   */
  clearKeys(): void;
  private totalOf;
  private toKeyEntry;
  private sortedKeyEntries;
  /**
   * When over {@link maxTrackedKeys}, prune the lowest-count keys down to 90%
   * of the cap (batched so the sort cost amortizes across inserts). The key
   * that was just recorded is never pruned.
   */
  private pruneTrackedKeys;
  /**
   * Subscribe to an emitter so that matching events automatically update the
   * stats. Counting is gated by {@link enabled}, so you may subscribe first and
   * toggle enablement later. Call {@link unsubscribe} to detach.
   * @param {StatsEmitter} emitter - The emitter to listen on
   * @param {StatsEventMap} eventMap - The event-to-stat mapping (e.g.
   * {@link nodeCacheStatsEventMap} or a custom map)
   */
  subscribe(emitter: StatsEmitter, eventMap: StatsEventMap): void;
  /**
   * Detach listeners previously attached via {@link subscribe}. When `emitter`
   * is provided, only that emitter's listeners are removed; otherwise all are.
   * @param {StatsEmitter} [emitter] - The emitter to detach from
   */
  unsubscribe(emitter?: StatsEmitter): void;
  private applyEvent;
  private touch;
}
//#endregion
export { type AnyFunction, type CacheInstance, type CacheSyncInstance, CacheTags, type CacheTagsOptions, type CacheableItem, type CacheableStoreItem, type CreateWrapKey, type CreateWrapKeyOptions, type GetOrSetFunctionOptions, type GetOrSetKey, type GetOrSetOptions, type GetOrSetSyncKey, type GetOrSetSyncOptions, HashAlgorithm, type HashOptions, type HashToNumberOptions, type KeyCounters, type KeyStatField, type KeyTagEntry, type PerStoreTtl, type RemoveKeysOptions, type SetKeyTagsOptions, type StatField, Stats, type StatsEmitter, type StatsEventHandler, type StatsEventMap, type StatsKeyEntry, type StatsOptions, type StatsSnapshot, type WrapFunctionOptions, type WrapOptions, type WrapSyncOptions, calculateTtlFromExpiration, coalesceAsync, createWrapKey, getCascadingTtl, getOrSet, getOrSetSync, getTtlFromExpires, hash, hashSync, hashToNumber, hashToNumberSync, isKeyvInstance, isObject, lessThan, nodeCacheStatsEventMap, resolvePerStoreTtl, runIfFn, shorthandToMilliseconds, shorthandToTime, sleep, wrap, wrapSync };