import { CacheTags, CacheTags as CacheTags$1, CacheTagsOptions, CacheableItem, CacheableItem as CacheableItem$1, GetOrSetFunctionOptions as GetOrSetFunctionOptions$1, GetOrSetKey, GetOrSetKey as GetOrSetKey$1, GetOrSetOptions, HashAlgorithm, HashAlgorithm as HashAlgorithm$1, KeyTagEntry, PerStoreTtl, PerStoreTtl as PerStoreTtl$1, SetKeyTagsOptions, Stats, Stats as CacheableStats, WrapFunctionOptions as WrapFunctionOptions$1, WrapOptions, WrapSyncOptions, calculateTtlFromExpiration, getCascadingTtl, getOrSet, hash, shorthandToMilliseconds, shorthandToTime, wrap, wrapSync } from "@cacheable/utils";
import { Hook, Hookified, HookifiedOptions } from "hookified";
import { Keyv, Keyv as Keyv$1, KeyvHooks, KeyvOptions, KeyvStoreAdapter, KeyvStoreAdapter as KeyvStoreAdapter$1, StoredDataRaw } from "keyv";
import { MessageProvider, Qified } from "qified";
import { CacheableMemory, CacheableMemoryOptions, KeyvCacheableMemory, KeyvCacheableMemoryOptions, createKeyv } from "@cacheable/memory";

//#region src/enums.d.ts
declare enum CacheableHooks {
  BEFORE_SET = "BEFORE_SET",
  AFTER_SET = "AFTER_SET",
  BEFORE_SET_MANY = "BEFORE_SET_MANY",
  AFTER_SET_MANY = "AFTER_SET_MANY",
  BEFORE_GET = "BEFORE_GET",
  AFTER_GET = "AFTER_GET",
  BEFORE_GET_MANY = "BEFORE_GET_MANY",
  AFTER_GET_MANY = "AFTER_GET_MANY",
  BEFORE_SECONDARY_SETS_PRIMARY = "BEFORE_SECONDARY_SETS_PRIMARY"
}
declare enum CacheableEvents {
  ERROR = "error",
  CACHE_HIT = "cache:hit",
  CACHE_MISS = "cache:miss"
}
//#endregion
//#region src/sync.d.ts
/**
 * Events emitted by CacheableSync
 */
declare enum CacheableSyncEvents {
  ERROR = "error",
  SET = "cache:set",
  DELETE = "cache:delete"
}
/**
 * Configuration options for CacheableSync
 */
type CacheableSyncOptions = {
  /**
   * Qified instance or message provider(s) for synchronization
   */
  qified: Qified | MessageProvider | MessageProvider[];
  /**
   * The namespace for sync events. It can be a string or a function that returns a string.
   * When set, event names will be prefixed with the namespace (e.g., "my-namespace::cache:set")
   */
  namespace?: string | (() => string);
} & HookifiedOptions;
type CacheableSyncItem = {
  cacheId: string;
  key: string;
  value?: unknown;
  ttl?: number;
};
/**
 * CacheableSync provides synchronization capabilities for cacheable items
 * using message providers from Qified
 */
declare class CacheableSync extends Hookified {
  private _qified;
  private _namespace?;
  private _storage?;
  private _cacheId?;
  /**
   * Creates an instance of CacheableSync
   * @param options - Configuration options for CacheableSync
   */
  constructor(options: CacheableSyncOptions);
  /**
   * Gets the Qified instance used for synchronization
   * @returns The Qified instance
   */
  get qified(): Qified;
  /**
   * Sets the Qified instance used for synchronization
   * @param value - Either an existing Qified instance or MessageProvider(s)
   */
  set qified(value: Qified | MessageProvider | MessageProvider[]);
  /**
   * Gets the namespace for sync events
   * @returns The namespace or undefined if not set
   */
  get namespace(): string | (() => string) | undefined;
  /**
   * Sets the namespace for sync events and resubscribes if needed
   * @param namespace - The namespace string or function
   */
  set namespace(namespace: string | (() => string) | undefined);
  /**
   * Publishes a cache event to all the cache instances
   * @param data - The cache item data containing cacheId, key, value, and optional ttl
   */
  publish(event: CacheableSyncEvents, data: CacheableSyncItem): Promise<void>;
  /**
   * Subscribes to sync events and updates the provided storage
   * @param storage - The Keyv storage instance to update
   * @param cacheId - The cache ID to identify this instance
   */
  subscribe(storage: Keyv$1, cacheId: string): void;
  /**
   * Creates or returns a Qified instance from the provided value
   * @param value - Either an existing Qified instance or MessageProvider(s)
   * @returns A Qified instance configured with the provided message provider(s)
   */
  createQified(value: Qified | MessageProvider | MessageProvider[]): Qified;
  /**
   * Gets the namespace prefix to use for event names
   * @returns The resolved namespace string or undefined
   */
  private getNamespace;
  /**
   * Prefixes an event name with the namespace if one is set
   * @param event - The event to prefix
   * @returns The prefixed event name or the original event
   */
  private getPrefixedEvent;
}
//#endregion
//#region src/types.d.ts
/**
 * Options for {@link Cacheable.getOrSet}. Identical to the shared
 * `GetOrSetFunctionOptions` from `@cacheable/utils`, except `ttl` also accepts a per-store object
 * (`{ primary, secondary }`) so the primary and secondary stores can be given different
 * expirations for that operation.
 */
type GetOrSetFunctionOptions = Omit<GetOrSetFunctionOptions$1, "ttl"> & {
  ttl?: number | string | PerStoreTtl$1;
};
/**
 * Options for {@link Cacheable.wrap}. Identical to the shared `WrapFunctionOptions` from
 * `@cacheable/utils`, except `ttl` also accepts a per-store object (`{ primary, secondary }`) so the
 * primary and secondary stores can be given different expirations for the wrapped value.
 */
type WrapFunctionOptions = Omit<WrapFunctionOptions$1, "ttl"> & {
  ttl?: number | string | PerStoreTtl$1;
};
type CacheableOptions = {
  /**
   * The primary store for the cacheable instance
   */
  primary?: Keyv$1 | KeyvStoreAdapter$1;
  /**
   * The secondary store for the cacheable instance
   */
  secondary?: Keyv$1 | KeyvStoreAdapter$1;
  /**
   * Whether to enable statistics for the cacheable instance
   */
  stats?: boolean;
  /**
   * Whether the secondary store is non-blocking mode. It is set to false by default.
   * If it is set to true then the secondary store will not block the primary store.
   */
  nonBlocking?: boolean;
  /**
   * The time-to-live for the cacheable instance and will be used as the default value.
   * can be a number in milliseconds or a human-readable format such as `1s` for 1 second or `1h` for 1 hour
   * or undefined if there is no time-to-live.
   */
  ttl?: number | string;
  /**
   * The maximum time-to-live for the cacheable instance. When set, any TTL that exceeds this value
   * is capped to maxTtl. Entries with no TTL will also be capped to maxTtl.
   * Can be a number in milliseconds or a human-readable format such as `1s`, `1m`, `1h`, `1d`.
   * Default is `undefined` (no maximum).
   */
  maxTtl?: number | string;
  /**
   * The namespace for the cacheable instance. It can be a string or a function that returns a string.
   */
  namespace?: string | (() => string);
  /**
   * The cacheId for the cacheable instance. This is primarily used for the wrap function to not have conflicts.
   * If it is not set then it will be a random string that is generated
   */
  cacheId?: string;
  /**
   * The sync instance for the cacheable instance to enable synchronization across cache instances
   */
  sync?: CacheableSync | CacheableSyncOptions;
  /**
   * Enables the tag service so tag-based invalidation can be used and freshness checks run on
   * every `get` / `getMany`. Tags must be explicitly enabled — while disabled, all tag
   * operations are no-ops and values set with `tags` are stored without tag tracking. Enable
   * this on every instance that shares the store (writers and readers) so invalidations are
   * honored consistently across distributed instances. Default is `false`.
   */
  tags?: boolean;
};
type GetOptions = {
  /**
   * If set, this will bypass the instances nonBlocking setting.
   * @type {boolean}
   */
  nonBlocking?: boolean;
};
type SetOptions = {
  /**
   * If set, this will bypass the instances nonBlocking setting.
   * @type {boolean}
   */
  nonBlocking?: boolean;
  /**
   * Time-to-live. If you set a number it is milliseconds, if you set a string it is a
   * human-readable format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means
   * that it will use the default time-to-live.
   *
   * You can also pass a per-store object to give each store its own TTL for this operation, such
   * as `{ primary: '10s', secondary: '5m' }`. Any field left undefined falls back to that store's
   * own default TTL resolution. This is useful for multi-layer caches where the in-memory primary
   * and a distributed secondary should expire at different rates.
   * @type {number | string | PerStoreTtl}
   */
  ttl?: number | string | PerStoreTtl$1;
  /**
   * Tags to associate with the entry for tag-based invalidation. Invalidating any of these tags
   * via `invalidateTag` / `invalidateTags` makes the entry stale, causing the next `get` to treat
   * it as a miss and remove it.
   * @type {string[]}
   */
  tags?: string[];
};
/**
 * An item for `setMany` that can optionally carry tags for tag-based invalidation.
 */
type CacheableSetItem = Omit<CacheableItem$1, "ttl"> & {
  /**
   * Time-to-live. If you set a number it is milliseconds, if you set a string it is a
   * human-readable format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means
   * that it will use the default time-to-live.
   *
   * You can also pass a per-store object to give each store its own TTL for this item, such as
   * `{ primary: '10s', secondary: '5m' }`. Any field left undefined falls back to that store's own
   * default TTL resolution.
   * @type {number | string | PerStoreTtl}
   */
  ttl?: number | string | PerStoreTtl$1;
  /**
   * Tags to associate with the entry for tag-based invalidation. Invalidating any of these tags
   * via `invalidateTag` / `invalidateTags` makes the entry stale, causing the next `get` to treat
   * it as a miss and remove it.
   * @type {string[]}
   */
  tags?: string[];
};
/**
 * The mutable item passed to the `BEFORE_SET` and `AFTER_SET` hooks. Within a `BEFORE_SET` handler
 * you may reassign `ttl` to give the entry a new expiration — either a single value (a number in
 * milliseconds or a shorthand string, applied to every store) or a per-store object
 * (`{ primary, secondary }`) so the primary and secondary stores expire at different rates. Any
 * assignment counts as an override (even assigning the value it already holds); a field omitted from
 * a per-store object falls back to that store's normal TTL resolution.
 *
 * By the time `AFTER_SET` runs, `ttl` has been normalized to the effective **primary** TTL as a
 * number (the value written to the primary store, after `maxTtl` capping); the secondary store's
 * effective TTL is not exposed on the item.
 */
type CacheableHookItem<T = unknown> = {
  key: string;
  value: T;
  ttl?: number | string | PerStoreTtl$1;
  tags?: string[];
};
/**
 * The item passed to the `AFTER_GET` hook after a `get` / `getRaw`.
 */
type CacheableAfterGetItem = {
  key: string;
  result?: StoredDataRaw<unknown>;
  ttl?: number | string;
};
/**
 * The item passed to the `AFTER_GET_MANY` hook after a `getMany` / `getManyRaw`.
 */
type CacheableAfterGetManyItem = {
  keys: string[];
  result: Array<StoredDataRaw<unknown>>;
};
/**
 * The item passed to the `BEFORE_SECONDARY_SETS_PRIMARY` hook. This hook only writes the primary
 * store, so its `ttl` is a single value (a number in milliseconds or a shorthand string), not a
 * per-store object.
 */
type CacheableSecondarySetsPrimaryItem<T = unknown> = {
  key: string;
  value: T;
  ttl?: number | string;
};
//#endregion
//#region src/index.d.ts
/**
 * Maps each {@link CacheableHooks} name to the payload its handler receives, so `onHook` can be
 * strongly typed. Within `BEFORE_SET` you can reassign `item.ttl` (including to a per-store
 * `{ primary, secondary }` object); `BEFORE_SECONDARY_SETS_PRIMARY` only writes the primary store,
 * so its `ttl` is a single value.
 */
type CacheableHookHandlerMap = {
  [CacheableHooks.BEFORE_SET]: (item: CacheableHookItem) => void | Promise<void>;
  [CacheableHooks.AFTER_SET]: (item: CacheableHookItem) => void | Promise<void>;
  [CacheableHooks.BEFORE_SET_MANY]: (items: CacheableSetItem[]) => void | Promise<void>;
  [CacheableHooks.AFTER_SET_MANY]: (items: CacheableSetItem[]) => void | Promise<void>;
  [CacheableHooks.BEFORE_GET]: (key: string) => void | Promise<void>;
  [CacheableHooks.AFTER_GET]: (item: CacheableAfterGetItem) => void | Promise<void>;
  [CacheableHooks.BEFORE_GET_MANY]: (keys: string[]) => void | Promise<void>;
  [CacheableHooks.AFTER_GET_MANY]: (item: CacheableAfterGetManyItem) => void | Promise<void>;
  [CacheableHooks.BEFORE_SECONDARY_SETS_PRIMARY]: (item: CacheableSecondarySetsPrimaryItem) => void | Promise<void>;
};
declare class Cacheable extends Hookified {
  private static _instance?;
  private _primary;
  private _secondary;
  private _nonBlocking;
  private _ttl?;
  private _maxTtl?;
  private readonly _stats;
  private _namespace?;
  private _cacheId;
  private _sync?;
  private _tags;
  /**
   * Creates a new cacheable instance
   * @param {CacheableOptions} [options] The options for the cacheable instance
   */
  constructor(options?: CacheableOptions);
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
  static getStaticInstance(options?: CacheableOptions): Cacheable;
  /**
   * Sets or clears the shared static instance returned by {@link Cacheable.getStaticInstance}.
   * Pass a {@link Cacheable} instance to make it the shared instance, or `undefined` to clear it
   * so the next {@link Cacheable.getStaticInstance} call creates a fresh one. Clearing only drops
   * the reference — it does not `disconnect()` or `clear()` the previous instance, so disconnect
   * it first if it holds open connections.
   * @param {Cacheable} [instance] The instance to share, or `undefined` to clear it
   */
  static setStaticInstance(instance?: Cacheable): void;
  /**
   * Registers a handler for a hook. Built-in {@link CacheableHooks} names get a strongly-typed
   * payload (e.g. `BEFORE_SET` receives a {@link CacheableHookItem} whose `ttl` you can reassign);
   * any other event name falls back to the loose Hookified signature.
   * @param hook The hook to register the handler for
   * @param handler The handler to call when the hook is triggered
   */
  onHook<K extends CacheableHooks>(hook: K, handler: CacheableHookHandlerMap[K]): void;
  onHook(event: string, handler: Hook): void;
  /**
   * The namespace for the cacheable instance
   * @returns {string | (() => string) | undefined} The namespace for the cacheable instance
   */
  get namespace(): string | (() => string) | undefined;
  /**
   * Sets the namespace for the cacheable instance
   * @param {string | (() => string) | undefined} namespace The namespace for the cacheable instance
   * @returns {void}
   */
  set namespace(namespace: string | (() => string) | undefined);
  /**
   * The statistics for the cacheable instance
   * @returns {CacheableStats} The statistics for the cacheable instance
   */
  get stats(): Stats;
  /**
   * The primary store for the cacheable instance
   * @returns {Keyv} The primary store for the cacheable instance
   */
  get primary(): Keyv$1;
  /**
   * Sets the primary store for the cacheable instance
   * @param {Keyv} primary The primary store for the cacheable instance
   */
  set primary(primary: Keyv$1);
  /**
   * The secondary store for the cacheable instance
   * @returns {Keyv | undefined} The secondary store for the cacheable instance
   */
  get secondary(): Keyv$1 | undefined;
  /**
   * Sets the secondary store for the cacheable instance. If it is set to undefined then the secondary store is disabled.
   * @param {Keyv | undefined} secondary The secondary store for the cacheable instance
   * @returns {void}
   */
  set secondary(secondary: Keyv$1 | undefined);
  /**
   * Gets whether the secondary store is non-blocking mode. It is set to false by default.
   * If it is set to true then the secondary store will not block the primary store.
   *
   * [Learn more about non-blocking mode](https://cacheable.org/docs/cacheable/#non-blocking-operations).
   *
   * @returns {boolean} Whether the cacheable instance is non-blocking
   */
  get nonBlocking(): boolean;
  /**
   * Sets whether the secondary store is non-blocking mode. It is set to false by default.
   * If it is set to true then the secondary store will not block the primary store.
   *
   * [Learn more about non-blocking mode](https://cacheable.org/docs/cacheable/#non-blocking-operations).
   *
   * @param {boolean} nonBlocking Whether the cacheable instance is non-blocking
   * @returns {void}
   */
  set nonBlocking(nonBlocking: boolean);
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
  get ttl(): number | string | undefined;
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
  set ttl(ttl: number | string | undefined);
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
  get maxTtl(): number | string | undefined;
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
  set maxTtl(maxTtl: number | string | undefined);
  /**
   * The cacheId for the cacheable instance. This is primarily used for the wrap function to not have conflicts.
   * If it is not set then it will be a random string that is generated
   * @returns {string} The cacheId for the cacheable instance
   */
  get cacheId(): string;
  /**
   * Sets the cacheId for the cacheable instance. This is primarily used for the wrap function to not have conflicts.
   * If it is not set then it will be a random string that is generated
   * @param {string} cacheId The cacheId for the cacheable instance
   */
  set cacheId(cacheId: string);
  /**
   * Gets the sync instance for the cacheable instance
   * @returns {CacheableSync | undefined} The sync instance for the cacheable instance
   */
  get sync(): CacheableSync | undefined;
  /**
   * Sets the sync instance for the cacheable instance
   * @param {CacheableSync | undefined} sync The sync instance for the cacheable instance
   */
  set sync(sync: CacheableSync | undefined);
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
  get tags(): CacheTags$1;
  /**
   * Creates the tag service backed by the secondary store when one is configured, otherwise the
   * primary store, preserving the enabled state of any previous service and reporting
   * non-blocking failures as error events.
   */
  private createCacheTags;
  /**
   * Sets the primary store for the cacheable instance
   * @param {Keyv | KeyvStoreAdapter} primary The primary store for the cacheable instance
   * @returns {void}
   */
  setPrimary(primary: Keyv$1 | KeyvStoreAdapter$1): void;
  /**
   * Sets the secondary store for the cacheable instance. If it is set to undefined then the secondary store is disabled.
   * @param {Keyv | KeyvStoreAdapter} secondary The secondary store for the cacheable instance
   * @returns {void}
   */
  setSecondary(secondary: Keyv$1 | KeyvStoreAdapter$1): void;
  getNameSpace(): string | undefined;
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
  get<T>(key: string, options?: GetOptions): Promise<T | undefined>;
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
  getRaw<T>(key: string, options?: GetOptions): Promise<StoredDataRaw<T>>;
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
  getManyRaw<T>(keys: string[], options?: GetOptions): Promise<Array<StoredDataRaw<T>>>;
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
  getMany<T>(keys: string[], options?: GetOptions): Promise<Array<T | undefined>>;
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
  set<T>(key: string, value: T, ttlOrOptions?: number | string | SetOptions): Promise<boolean>;
  /**
   * Sets the values of the keys. If the secondary store is set then it will also set the values in the secondary store.
   * Items can include `tags` to associate the entry with tags for tag-based invalidation.
   * @param {CacheableSetItem[]} items The items to set
   * @returns {boolean} Whether the values were set
   */
  setMany(items: CacheableSetItem[]): Promise<boolean>;
  /**
   * Takes the value of the key and deletes the key. If the key does not exist then it will return undefined.
   * @param {string} key The key to take the value of
   * @returns {Promise<T | undefined>} The value of the key or undefined if the key does not exist
   */
  take<T>(key: string): Promise<T | undefined>;
  /**
   * Takes the values of the keys and deletes the keys. If the key does not exist then it will return undefined.
   * @param {string[]} keys The keys to take the values of
   * @returns {Promise<Array<T | undefined>>} The values of the keys or undefined if the key does not exist
   */
  takeMany<T>(keys: string[]): Promise<Array<T | undefined>>;
  /**
   * Checks if the key exists in the primary store. If it does not exist then it will check the secondary store.
   * @param {string} key The key to check
   * @returns {Promise<boolean>} Whether the key exists
   */
  has(key: string): Promise<boolean>;
  /**
   * Checks if the keys exist in the primary store. If it does not exist then it will check the secondary store.
   * @param {string[]} keys The keys to check
   * @returns {Promise<boolean[]>} Whether the keys exist
   */
  hasMany(keys: string[]): Promise<boolean[]>;
  /**
   * Deletes the key from the primary store. If the secondary store is set then it will also delete the key from the secondary store.
   * @param {string} key The key to delete
   * @returns {Promise<boolean>} Whether the key was deleted
   */
  delete(key: string): Promise<boolean>;
  /**
   * Deletes the keys from the primary store. If the secondary store is set then it will also delete the keys from the secondary store.
   * @param {string[]} keys The keys to delete
   * @returns {Promise<boolean>} Whether the keys were deleted
   */
  deleteMany(keys: string[]): Promise<boolean>;
  /**
   * Clears the primary store. If the secondary store is set then it will also clear the secondary store.
   * @returns {Promise<void>}
   */
  clear(): Promise<void>;
  /**
   * Disconnects the primary store. If the secondary store is set then it will also disconnect the secondary store.
   * @returns {Promise<void>}
   */
  disconnect(): Promise<void>;
  /**
   * Wraps a function with caching
   *
   * [Learn more about wrapping functions](https://cacheable.org/docs/cacheable/#wrap--memoization-for-sync-and-async-functions).
   * @param {Function} function_ The function to wrap
   * @param {WrapOptions} [options] The options for the wrap function
   * @returns {Function} The wrapped function
   */
  wrap<T, Arguments extends any[]>(function_: (...arguments_: Arguments) => T, options?: WrapFunctionOptions): (...arguments_: Arguments) => T;
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
  getOrSet<T>(key: GetOrSetKey$1, function_: () => Promise<T>, options?: GetOrSetFunctionOptions): Promise<T | undefined>;
  /**
   * Will hash an object asynchronously using the specified cryptographic algorithm.
   * Use this for cryptographic algorithms (SHA-256, SHA-384, SHA-512).
   * For non-cryptographic algorithms, use hashSync() for better performance.
   * @param {any} object the object to hash
   * @param {string} algorithm the hash algorithm to use. The default is 'SHA-256'
   * @returns {Promise<string>} the hash of the object
   */
  hash(object: any, algorithm?: HashAlgorithm$1): Promise<string>;
  /**
   * Will hash an object synchronously using the specified non-cryptographic algorithm.
   * Use this for non-cryptographic algorithms (DJB2, FNV1, MURMER, CRC32).
   * For cryptographic algorithms, use hash() instead.
   * @param {any} object the object to hash
   * @param {string} algorithm the hash algorithm to use. The default is 'djb2'
   * @returns {string} the hash of the object
   */
  hashSync(object: any, algorithm?: HashAlgorithm$1): string;
  private setManyKeyv;
  /**
   * Writes tag snapshots for `setMany` items that carry tags and removes any previous snapshots
   * for items that do not.
   */
  private setManyKeyTags;
  /**
   * Processes a single key from secondary store for getRaw operation
   * @param primary - the primary store to use
   * @param secondary - the secondary store to use
   * @param key - The key to retrieve from secondary store
   * @returns Promise containing the result and TTL information
   */
  private processSecondaryForGetRaw;
  /**
   * Processes a single key from secondary store for getRaw operation in non-blocking mode
   * Non-blocking mode means we don't wait for secondary operations that update primary store
   * @param primary - the primary store to use
   * @param secondary - the secondary store to use
   * @param key - The key to retrieve from secondary store
   * @returns Promise containing the result and TTL information
   */
  private processSecondaryForGetRawNonBlocking;
  /**
   * Processes missing keys from secondary store for getManyRaw operation
   * @param primary - the primary store to use
   * @param secondary - the secondary store to use
   * @param keys - The original array of keys requested
   * @param result - The result array from primary store (will be modified)
   * @returns Promise<void>
   */
  private processSecondaryForGetManyRaw;
  /**
   * Processes missing keys from secondary store for getManyRaw operation in non-blocking mode
   * Non-blocking mode means we don't wait for secondary operations that update primary store
   * @param secondary - the secondary store to use
   * @param keys - The original array of keys requested
   * @param result - The result array from primary store (will be modified)
   * @returns Promise<void>
   */
  private processSecondaryForGetManyRawNonBlocking;
  private setTtl;
  private setMaxTtl;
  private capTtl;
  /**
   * Resolves the ttl for a tag snapshot so it outlives the longest-lived copy of the value across
   * the stores. With a secondary store the snapshot uses the larger of the two ttls and never
   * expires if either copy never expires; with only a primary store it tracks the primary ttl.
   * @param primaryTtl - the resolved primary store ttl in milliseconds, or undefined for no expiry
   * @param secondaryTtl - the resolved secondary store ttl in milliseconds, or undefined for no expiry
   * @returns {number | undefined} The tag snapshot ttl in milliseconds, or undefined for no expiry
   */
  private maxStoreTtl;
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
  private resolveStoreTtl;
}
//#endregion
export { CacheTags, type CacheTagsOptions, Cacheable, type CacheableAfterGetItem, type CacheableAfterGetManyItem, CacheableEvents, CacheableHookHandlerMap, type CacheableHookItem, CacheableHooks, type CacheableItem, CacheableMemory, type CacheableMemoryOptions, type CacheableOptions, type CacheableSecondarySetsPrimaryItem, type CacheableSetItem, CacheableStats, CacheableSync, CacheableSyncEvents, type CacheableSyncItem, type CacheableSyncOptions, type GetOptions, type GetOrSetFunctionOptions, type GetOrSetKey, type GetOrSetOptions, HashAlgorithm, type KeyTagEntry, Keyv, KeyvCacheableMemory, type KeyvCacheableMemoryOptions, KeyvHooks, type KeyvOptions, type KeyvStoreAdapter, type PerStoreTtl, type SetKeyTagsOptions, type SetOptions, type WrapFunctionOptions, type WrapOptions, type WrapSyncOptions, calculateTtlFromExpiration, createKeyv, getCascadingTtl, getOrSet, hash, shorthandToMilliseconds, shorthandToTime, wrap, wrapSync };