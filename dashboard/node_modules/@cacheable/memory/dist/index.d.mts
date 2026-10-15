import { CacheableItem, CacheableItem as CacheableItem$1, CacheableStoreItem, CacheableStoreItem as CacheableStoreItem$1, GetOrSetFunctionOptions, GetOrSetFunctionOptions as GetOrSetFunctionOptions$1, GetOrSetSyncKey, GetOrSetSyncKey as GetOrSetSyncKey$1, GetOrSetSyncOptions, HashAlgorithm, HashAlgorithm as HashAlgorithm$1, Stats, Stats as Stats$1, StatsOptions, StatsSnapshot, WrapFunctionOptions, getOrSetSync, hash, hashToNumber } from "@cacheable/utils";
import { Hookified } from "hookified";
import { Keyv, KeyvStoreAdapter, StoredData } from "keyv";

//#region src/keyv-memory.d.ts
type KeyvCacheableMemoryOptions = CacheableMemoryOptions & {
  namespace?: string;
};
declare class KeyvCacheableMemory implements KeyvStoreAdapter {
  opts: CacheableMemoryOptions;
  private readonly _defaultCache;
  private readonly _nCache;
  private _namespace?;
  constructor(options?: KeyvCacheableMemoryOptions);
  get namespace(): string | undefined;
  set namespace(value: string | undefined);
  get store(): CacheableMemory;
  get<Value>(key: string): Promise<StoredData<Value> | undefined>;
  getMany<Value>(keys: string[]): Promise<Array<StoredData<Value | undefined>>>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  setMany(values: Array<{
    key: string;
    value: any;
    ttl?: number;
  }>): Promise<void>;
  delete(key: string): Promise<boolean>;
  deleteMany?(key: string[]): Promise<boolean>;
  clear(): Promise<void>;
  has?(key: string): Promise<boolean>;
  on(event: string, listener: (...arguments_: any[]) => void): this;
  getStore(namespace?: string): CacheableMemory;
}
/**
 * Creates a new Keyv instance with a new KeyvCacheableMemory store. This also removes the serialize/deserialize methods from the Keyv instance for optimization.
 * @param options
 * @returns
 */
declare function createKeyv(options?: KeyvCacheableMemoryOptions): Keyv;
//#endregion
//#region src/index.d.ts
/**
 * Lifecycle hooks fired by {@link CacheableMemory}. Register handlers with the inherited
 * `onHook(hook, handler)` method. Hooks are dispatched synchronously via `hookSync`, which skips
 * `async` handler functions entirely — register only synchronous handlers.
 */
declare enum CacheableMemoryHooks {
  BEFORE_SET = "BEFORE_SET",
  AFTER_SET = "AFTER_SET",
  BEFORE_SET_MANY = "BEFORE_SET_MANY",
  AFTER_SET_MANY = "AFTER_SET_MANY",
  BEFORE_GET = "BEFORE_GET",
  AFTER_GET = "AFTER_GET",
  BEFORE_GET_MANY = "BEFORE_GET_MANY",
  AFTER_GET_MANY = "AFTER_GET_MANY",
  BEFORE_DELETE = "BEFORE_DELETE",
  AFTER_DELETE = "AFTER_DELETE",
  BEFORE_DELETE_MANY = "BEFORE_DELETE_MANY",
  AFTER_DELETE_MANY = "AFTER_DELETE_MANY",
  BEFORE_CLEAR = "BEFORE_CLEAR",
  AFTER_CLEAR = "AFTER_CLEAR"
}
type StoreHashAlgorithmFunction = (key: string, storeHashSize: number) => number;
/**
 * @typedef {Object} CacheableMemoryOptions
 * @property {number|string} [ttl] - Time to Live - If you set a number it is miliseconds, if you set a string it is a human-readable
 * format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means that it will use the default time-to-live. If both are
 * undefined then it will not have a time-to-live.
 * @property {number|string} [maxTtl] - Maximum Time to Live - The upper bound for any TTL set on a cache entry. If a TTL (whether from the
 * default or per-entry) exceeds this value, the entry's TTL is capped to maxTtl. Can be a number in milliseconds or a human-readable
 * format such as `1s`, `1m`, `1h`, `1d`. Default is `undefined` (no maximum).
 * @property {boolean} [useClone] - If true, it will clone the value before returning it. If false, it will return the value directly. Default is true.
 * @property {number} [lruSize] - The size of the LRU cache. If set to 0, it will not use LRU cache. Default is 0. If you are using LRU then the limit is based on Map() size 17mm.
 * @property {number} [checkInterval] - The interval to check for expired items. If set to 0, it will not check for expired items. Default is 0.
 * @property {number} [storeHashSize] - The number of how many Map stores we have for the hash. Default is 10.
 * @property {boolean} [stats] - If true, it will track statistics such as hits, misses, gets, sets, and deletes for this
 * instance. Statistics are accessible via the `stats` property. Default is `false`.
 */
type CacheableMemoryOptions = {
  ttl?: number | string;
  maxTtl?: number | string;
  useClone?: boolean;
  lruSize?: number;
  checkInterval?: number;
  storeHashSize?: number;
  storeHashAlgorithm?: HashAlgorithm$1 | ((key: string, storeHashSize: number) => number);
  stats?: boolean;
};
type SetOptions = {
  ttl?: number | string;
  expire?: number | Date;
};
/**
 * The payload passed to the `BEFORE_SET` and `AFTER_SET` hooks. Inside a `BEFORE_SET` handler
 * you can reassign `key`, `value`, or `ttl` to change what gets stored.
 */
type CacheableMemoryHookItem<T = unknown> = {
  key: string;
  value: T;
  ttl?: number | string | SetOptions;
};
/** The payload passed to the `AFTER_GET` hook. `result` is `undefined` on a cache miss. */
type CacheableMemoryAfterGetItem<T = unknown> = {
  key: string;
  result: T | undefined;
};
/**
 * The payload passed to the `AFTER_GET_MANY` hook. Entries are `undefined` for keys that were
 * missing or expired, mirroring what `getMany` collects.
 */
type CacheableMemoryAfterGetManyItem<T = unknown> = {
  keys: string[];
  result: Array<T | undefined>;
};
declare const defaultStoreHashSize = 16;
declare const maximumMapSize = 16777216;
declare class CacheableMemory extends Hookified {
  private _lru;
  private _storeHashSize;
  private _storeHashAlgorithm;
  private _store;
  private _ttl;
  private _maxTtl;
  private _useClone;
  private _lruSize;
  private _checkInterval;
  private _interval;
  private readonly _stats;
  /**
   * @constructor
   * @param {CacheableMemoryOptions} [options] - The options for the CacheableMemory
   */
  constructor(options?: CacheableMemoryOptions);
  /**
   * Gets the time-to-live
   * @returns {number|string|undefined} - The time-to-live in miliseconds or a human-readable format. If undefined, it will not have a time-to-live.
   */
  get ttl(): number | string | undefined;
  /**
   * Sets the time-to-live
   * @param {number|string|undefined} value - The time-to-live in miliseconds or a human-readable format (example '1s' = 1 second, '1h' = 1 hour). If undefined, it will not have a time-to-live.
   */
  set ttl(value: number | string | undefined);
  /**
   * Gets the maximum time-to-live. When set, any TTL that exceeds this value is capped to maxTtl.
   * Entries with no TTL will also be capped to maxTtl. Default is `undefined` (no maximum).
   * @returns {number|string|undefined} - The maximum TTL in milliseconds, human-readable format, or undefined.
   */
  get maxTtl(): number | string | undefined;
  /**
   * Sets the maximum time-to-live. When set, any TTL that exceeds this value is capped to maxTtl.
   * Entries with no TTL will also be capped to maxTtl.
   * @param {number|string|undefined} value - The maximum TTL in milliseconds or human-readable format (e.g. '1s', '1h'). If undefined, no maximum is enforced.
   */
  set maxTtl(value: number | string | undefined);
  /**
   * Gets whether to use clone
   * @returns {boolean} - If true, it will clone the value before returning it. If false, it will return the value directly. Default is true.
   */
  get useClone(): boolean;
  /**
   * Sets whether to use clone
   * @param {boolean} value - If true, it will clone the value before returning it. If false, it will return the value directly. Default is true.
   */
  set useClone(value: boolean);
  /**
   * Gets the size of the LRU cache
   * @returns {number} - The size of the LRU cache. If set to 0, it will not use LRU cache. Default is 0. If you are using LRU then the limit is based on Map() size 17mm.
   */
  get lruSize(): number;
  /**
   * Sets the size of the LRU cache
   * @param {number} value - The size of the LRU cache. If set to 0, it will not use LRU cache. Default is 0. If you are using LRU then the limit is based on Map() size 17mm.
   */
  set lruSize(value: number);
  /**
   * Gets the check interval
   * @returns {number} - The interval to check for expired items. If set to 0, it will not check for expired items. Default is 0.
   */
  get checkInterval(): number;
  /**
   * Sets the check interval
   * @param {number} value - The interval to check for expired items. If set to 0, it will not check for expired items. Default is 0.
   */
  set checkInterval(value: number);
  /**
   * Gets the size of the cache
   * @returns {number} - The size of the cache
   */
  get size(): number;
  /**
   * Gets the statistics of the cache. Statistics track aggregate counters such as `hits`, `misses`,
   * `gets`, `sets`, `deletes`, `clears`, `count`, `ksize`, and `vsize`. They are disabled by default;
   * enable them via the `stats` option or by setting `cache.stats.enabled = true`.
   * @returns {Stats} - The statistics for this CacheableMemory instance
   */
  get stats(): Stats$1;
  /**
   * Gets the number of hash stores
   * @returns {number} - The number of hash stores
   */
  get storeHashSize(): number;
  /**
   * Sets the number of hash stores. This will recreate the store and all data will be cleared
   * @param {number} value - The number of hash stores
   */
  set storeHashSize(value: number);
  /**
   * Gets the store hash algorithm
   * @returns {HashAlgorithm | StoreHashAlgorithmFunction} - The store hash algorithm
   */
  get storeHashAlgorithm(): HashAlgorithm$1 | StoreHashAlgorithmFunction;
  /**
   * Sets the store hash algorithm. This will recreate the store and all data will be cleared
   * @param {HashAlgorithm | HashAlgorithmFunction} value - The store hash algorithm
   */
  set storeHashAlgorithm(value: HashAlgorithm$1 | StoreHashAlgorithmFunction);
  /**
   * Gets the keys
   * @returns {IterableIterator<string>} - The keys
   */
  get keys(): IterableIterator<string>;
  /**
   * Gets the items
   * @returns {IterableIterator<CacheableStoreItem>} - The items
   */
  get items(): IterableIterator<CacheableStoreItem$1>;
  /**
   * Gets the store
   * @returns {Array<Map<string, CacheableStoreItem>>} - The store
   */
  get store(): Array<Map<string, CacheableStoreItem$1>>;
  /**
   * Gets the value of the key
   * @param {string} key - The key to get the value
   * @returns {T | undefined} - The value of the key
   */
  get<T>(key: string): T | undefined;
  /**
   * Gets the values of the keys
   * @param {string[]} keys - The keys to get the values
   * @returns {T[]} - The values of the keys
   */
  getMany<T>(keys: string[]): T[];
  /**
   * Gets the raw value of the key
   * @param {string} key - The key to get the value
   * @returns {CacheableStoreItem | undefined} - The raw value of the key
   */
  getRaw(key: string): CacheableStoreItem$1 | undefined;
  /**
   * Gets the raw values of the keys
   * @param {string[]} keys - The keys to get the values
   * @returns {CacheableStoreItem[]} - The raw values of the keys
   */
  getManyRaw(keys: string[]): Array<CacheableStoreItem$1 | undefined>;
  /**
   * Sets the value of the key
   * @param {string} key - The key to set the value
   * @param {any} value - The value to set
   * @param {number|string|SetOptions} [ttl] - Time to Live - If you set a number it is miliseconds, if you set a string it is a human-readable.
   * If you want to set expire directly you can do that by setting the expire property in the SetOptions.
   * If you set undefined, it will use the default time-to-live. If both are undefined then it will not have a time-to-live.
   * @returns {void}
   */
  set(key: string, value: any, ttl?: number | string | SetOptions): void;
  /**
   * Sets the values of the keys
   * @param {CacheableItem[]} items - The items to set
   * @returns {void}
   */
  setMany(items: CacheableItem$1[]): void;
  /**
   * Checks if the key exists
   * @param {string} key - The key to check
   * @returns {boolean} - If true, the key exists. If false, the key does not exist.
   */
  has(key: string): boolean;
  /**
   * @function hasMany
   * @param {string[]} keys - The keys to check
   * @returns {boolean[]} - If true, the key exists. If false, the key does not exist.
   */
  hasMany(keys: string[]): boolean[];
  /**
   * Take will get the key and delete the entry from cache
   * @param {string} key - The key to take
   * @returns {T | undefined} - The value of the key
   */
  take<T>(key: string): T | undefined;
  /**
   * TakeMany will get the keys and delete the entries from cache
   * @param {string[]} keys - The keys to take
   * @returns {T[]} - The values of the keys
   */
  takeMany<T>(keys: string[]): T[];
  /**
   * Delete the key
   * @param {string} key - The key to delete
   * @returns {void}
   */
  delete(key: string): void;
  /**
   * Delete the keys
   * @param {string[]} keys - The keys to delete
   * @returns {void}
   */
  deleteMany(keys: string[]): void;
  /**
   * Clear the cache
   * @returns {void}
   */
  clear(): void;
  /**
   * Get the store based on the key (internal use)
   * @param {string} key - The key to get the store
   * @returns {CacheableHashStore} - The store
   */
  getStore(key: string): Map<string, CacheableStoreItem$1>;
  /**
   * Hash the key for which store to go to (internal use)
   * @param {string} key - The key to hash
   * Available algorithms are: SHA256, SHA1, MD5, and djb2Hash.
   * @returns {number} - The hashed key as a number
   */
  getKeyStoreHash(key: string): number;
  /**
   * Clone the value. This is for internal use
   * @param {any} value - The value to clone
   * @returns {any} - The cloned value
   */
  clone(value: any): any;
  /**
   * Add to the front of the LRU cache. This is for internal use
   * @param {string} key - The key to add to the front
   * @returns {void}
   */
  lruAddToFront(key: string): void;
  /**
   * Move to the front of the LRU cache. This is for internal use
   * @param {string} key - The key to move to the front
   * @returns {void}
   */
  lruMoveToFront(key: string): void;
  /**
   * Remove a key from the LRU cache. This is for internal use
   * @param {string} key - The key to remove
   * @returns {void}
   */
  lruRemove(key: string): void;
  /**
   * Resize the LRU cache. This is for internal use.
   * @returns {void}
   */
  lruResize(): void;
  /**
   * Check for expiration. This is for internal use
   * @returns {void}
   */
  checkExpiration(): void;
  /**
   * Start the interval check. This is for internal use
   * @returns {void}
   */
  startIntervalCheck(): void;
  /**
   * Stop the interval check. This is for internal use
   * @returns {void}
   */
  stopIntervalCheck(): void;
  /**
   * Wrap the function for caching
   * @param {Function} function_ - The function to wrap
   * @param {Object} [options] - The options to wrap
   * @returns {Function} - The wrapped function
   */
  wrap<T, Arguments extends any[]>(function_: (...arguments_: Arguments) => T, options?: WrapFunctionOptions): (...arguments_: Arguments) => T;
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
  getOrSet<T>(key: GetOrSetSyncKey$1, function_: () => T, options?: GetOrSetFunctionOptions$1): T | undefined;
  /**
   * Records a single read against the statistics counters. Each read increments `gets` and either
   * `hits` or `misses`. No-op when statistics are disabled. This is for internal use.
   * @param {boolean} hit - Whether the read found a (non-expired) value
   * @returns {void}
   */
  private recordRead;
  /**
   * Decrements the size statistics (`count`, `ksize`, and `vsize`) for an entry that is being removed
   * because it expired. Expirations are not counted as `deletes` since they are not user-initiated.
   * No-op when statistics are disabled. This is for internal use.
   * @param {CacheableStoreItem} item - The expired item being removed from the store
   * @returns {void}
   */
  private recordExpiration;
  private isPrimitive;
  private setTtl;
  private setMaxTtl;
  private hasExpired;
}
//#endregion
export { type CacheableItem, CacheableMemory, CacheableMemoryAfterGetItem, CacheableMemoryAfterGetManyItem, CacheableMemoryHookItem, CacheableMemoryHooks, CacheableMemoryOptions, type CacheableStoreItem, type GetOrSetFunctionOptions, type GetOrSetSyncKey, type GetOrSetSyncOptions, HashAlgorithm, KeyvCacheableMemory, type KeyvCacheableMemoryOptions, SetOptions, Stats, type StatsOptions, type StatsSnapshot, StoreHashAlgorithmFunction, createKeyv, defaultStoreHashSize, getOrSetSync, hash, hashToNumber, maximumMapSize };