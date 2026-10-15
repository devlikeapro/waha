[<img align="center" src="https://cacheable.org/logo.svg" alt="Cacheable" />](https://github.com/jaredwray/cacheable)

> High Performance Layer 1 / Layer 2 Caching with Keyv Storage

[![codecov](https://codecov.io/gh/jaredwray/cacheable/branch/main/graph/badge.svg?token=lWZ9OBQ7GM)](https://codecov.io/gh/jaredwray/cacheable)
[![tests](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml/badge.svg)](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/dm/@cacheable/memory.svg)](https://www.npmjs.com/package/@cacheable/memory)
[![npm](https://img.shields.io/npm/v/@cacheable/memory.svg)](https://www.npmjs.com/package/@cacheable/memory)
[![license](https://img.shields.io/github/license/jaredwray/cacheable)](https://github.com/jaredwray/cacheable/blob/main/LICENSE)

You can use `CacheableMemory` as a standalone cache or as a primary store for `cacheable`. You can also set the `useClones` property to `false` if you want to use the same reference for the values. This is useful if you are using large objects and want to save memory. The `lruSize` property is the size of the LRU cache and is set to `0` by default, which disables the LRU cache (no LRU eviction is performed and the cache size is bounded only by the underlying `Map` stores). When the `lruSize` property is set to a value greater than `0`, it limits the number of keys in the cache and evicts the least recently used entries when full.

This simple in-memory cache uses multiple Map objects and a with `expiration` and `lru` policies if set to manage the in memory cache at scale.

By default we use lazy expiration deletion which means on `get` and `getMany` type functions we look if it is expired and then delete it. If you want to have a more aggressive expiration policy you can set the `checkInterval` property to a value greater than `0` which will check for expired keys at the interval you set.

Here are some of the main features of `CacheableMemory`:
* High performance in-memory cache with a robust API and feature set. 🚀
* Can scale past the `16,777,216 (2^24) keys` limit of a single `Map` via `hashStoreSize`. Default is `16` Map objects.
* LRU (Least Recently Used) cache feature to limit the number of keys in the cache via `lruSize`. Limit to `16,777,216 (2^24) keys` total.
* Expiration policy to delete expired keys with lazy deletion or aggressive deletion via `checkInterval`.
* `Wrap` feature to memoize `sync` and `async` functions with stampede protection.
* Ability to do many operations at once such as `setMany`, `getMany`, `deleteMany`, and `takeMany`.
* Supports `raw` data retrieval with `getRaw` and `getManyRaw` methods to get the full metadata of the cache entry.

# Table of Contents
* [Getting Started](#getting-started)
* [CacheableMemory - In-Memory Cache](#cacheablememory---in-memory-cache)
* [CacheableMemory Store Hashing](#cacheablememory-store-hashing)
* [CacheableMemory LRU Feature](#cacheablememory-lru-feature)
* [CacheableMemory Performance](#cacheablememory-performance)
* [CacheableMemory Statistics](#cacheablememory-statistics)
* [CacheableMemory Hooks and Events](#cacheablememory-hooks-and-events)
* [CacheableMemory Options](#cacheablememory-options)
* [CacheableMemory - API](#cacheablememory---api)
* [Keyv Storage Adapter - KeyvCacheableMemory](#keyv-storage-adapter---keyvcacheablememory)
* [Wrap / Memoization for Sync and Async Functions](#wrap--memoization-for-sync-and-async-functions)
* [Get Or Set Memoization Function](#get-or-set-memoization-function)
* [How to Contribute](#how-to-contribute)
* [License and Copyright](#license-and-copyright)

# Getting Started

```bash
npm install @cacheable/memory
```

# Basic Usage

```javascript
import { CacheableMemory } from '@cacheable/memory';

const cacheable = new CacheableMemory();
await cacheable.set('key', 'value', 1000);
const value = await cacheable.get('key');
```

In this example, the primary store we will use `lru-cache` and the secondary store is Redis. You can also set multiple stores in the options:

```javascript
import { CacheableMemory } from '@cacheable/memory';

// we set the storeHashSize to 1 so that we only use a single Map object as the lru is limited to a single Map size
const cache = new CacheableMemory({storeHashSize: 1, lruSize: 80000});

cache.set('key1', 'value1');
const result = cache.get('key1');
console.log(result); // 'value1' 
```

This is a more advanced example and not needed for most use cases.

# Shorthand for Time to Live (ttl)

By default `Cacheable` and `CacheableMemory` the `ttl` is in milliseconds but you can use shorthand for the time to live. Here are the following shorthand values:

* `ms`: Milliseconds such as (1ms = 1)
* `s`: Seconds such as (1s = 1000)
* `m`: Minutes such as (1m = 60000)
* `h` or `hr`: Hours such as (1h = 3600000)
* `d`: Days such as (1d = 86400000)

Here is an example of how to use the shorthand for the `ttl`:

```javascript
import { CacheableMemory } from 'cacheable';
const cache = new CacheableMemory({ ttl: '15m' }); //sets the default ttl to 15 minutes (900000 ms)
cache.set('key', 'value', '1h'); //sets the ttl to 1 hour (3600000 ms) and overrides the default
```

if you want to disable the `ttl` you can set it to `0` or `undefined`:

```javascript
import { CacheableMemory } from 'cacheable';
const cache = new CacheableMemory({ ttl: 0 }); //sets the default ttl to 0 which is disabled
cache.set('key', 'value', 0); //sets the ttl to 0 which is disabled
```

If you set the ttl to anything below `0` or `undefined` it will disable the ttl for the cache and the value that returns will be `undefined`. With no ttl set the value will be stored `indefinitely`.

```javascript
import { CacheableMemory } from 'cacheable';
const cache = new CacheableMemory({ ttl: 0 }); //sets the default ttl to 0 which is disabled
console.log(cache.ttl); // undefined
cache.ttl = '1h'; // sets the default ttl to 1 hour (3600000 ms)
console.log(cache.ttl); // '1h'
cache.ttl = -1; // sets the default ttl to 0 which is disabled
console.log(cache.ttl); // undefined
```

## Retrieving raw cache entries

The `getRaw` and `getManyRaw` methods return the full stored metadata (`StoredDataRaw<T>`) instead of just the value:

```typescript
import { CacheableMemory } from 'cacheable';

const cache = new CacheableMemory();

// store a value
await cache.set('user:1', { name: 'Alice' }, '1h'); // 1 hour

// default: only the value
const user = await cache.get<{ name: string }>('user:1');
console.log(user); // { name: 'Alice' }

// with raw: full record including expiration
const raw = await cache.getRaw('user:1');
console.log(raw.value);   // { name: 'Alice' }
console.log(raw.expires); // e.g. 1677628495000 or null
```

## CacheableMemory Store Hashing

`CacheableMemory` uses `Map` objects to store the keys and values. To make this scale past the `16,777,216 (2^24) keys` limit of a single `Map` we use a hash to balance the data across multiple `Map` objects. This is done by hashing the key and using the hash to determine which `Map` object to use. The default hashing algorithm is `djb2` but you can change it by setting the `storeHashAlgorithm` property in the options. Supported algorithms include DJB2, FNV1, MURMER, and CRC32. By default we set the amount of `Map` objects to `16`. 

NOTE: if you are using the LRU cache feature the `lruSize` no matter how many `Map` objects you have it will be limited to the `16,777,216 (2^24) keys` limit of a single `Map` object. This is because we use a double linked list to manage the LRU cache and it is not possible to have more than `16,777,216 (2^24) keys` in a single `Map` object.

Here is an example of how to set the number of `Map` objects and the hashing algorithm:

```javascript
import { CacheableMemory } from '@cacheable/memory';
const cache = new CacheableMemory({
  storeSize: 32, // set the number of Map objects to 32
});
cache.set('key', 'value');
const value = cache.get('key'); // value
```

Here is an example of how to use the `storeHashAlgorithm` property with supported algorithms:

```javascript
import { CacheableMemory, HashAlgorithm } from '@cacheable/memory';

// Using DJB2 (default)
const cache = new CacheableMemory({ storeHashAlgorithm: HashAlgorithm.DJB2 });

// Or other non-cryptographic algorithms for better performance
const cache2 = new CacheableMemory({ storeHashAlgorithm: HashAlgorithm.FNV1 });
const cache3 = new CacheableMemory({ storeHashAlgorithm: HashAlgorithm.MURMER });
const cache4 = new CacheableMemory({ storeHashAlgorithm: HashAlgorithm.CRC32 });

cache.set('key', 'value');
const value = cache.get('key'); // value
```

**Available algorithms:** DJB2 (default), FNV1, MURMER, CRC32. Note: Cryptographic algorithms (SHA-256, SHA-384, SHA-512) are not recommended for store hashing due to performance overhead.

If you want to provide your own hashing function you can set the `storeHashAlgorithm` property to a function that takes an object and returns a `number` that is in the range of the amount of `Map` stores you have.

```javascript
import { CacheableMemory } from 'cacheable';
/**
 * Custom hash function that takes a key and the size of the store
 * and returns a number between 0 and storeHashSize - 1.
 * @param {string} key - The key to hash.
 * @param {number} storeHashSize - The size of the store (number of Map objects).
 * @returns {number} - A number between 0 and storeHashSize - 1.
 */
const customHash = (key, storeHashSize) => {
  // custom hashing logic
  return key.length % storeHashSize; // returns a number between 0 and 31 for 32 Map objects
};
const cache = new CacheableMemory({ storeHashAlgorithm: customHash, storeSize: 32 });
cache.set('key', 'value');
const value = cache.get('key'); // value
```

## CacheableMemory LRU Feature

You can enable the LRU (Least Recently Used) feature in `CacheableMemory` by setting the `lruSize` property in the options. This will limit the number of keys in the cache to the size you set. When the cache reaches the limit it will remove the least recently used keys from the cache. This is useful if you want to limit the memory usage of the cache.

When you set the `lruSize`, we use a doubly linked list to track the LRU order across the underlying `Map` stores. The `lruSize` itself is capped at `16,777,216 (2^24) keys` — values above this limit are rejected and an `error` event is emitted. Setting `lruSize` does not change `storeHashSize`; the underlying stores keep whatever `storeHashSize` you configured (default `16`).

```javascript
import { CacheableMemory } from 'cacheable';
const cache = new CacheableMemory({ lruSize: 1 }); // sets the LRU cache size to 1 key
cache.set('key1', 'value1');
cache.set('key2', 'value2');
const value1 = cache.get('key1');
console.log(value1); // undefined if the cache is full and key1 is the least recently used
const value2 = cache.get('key2');
console.log(value2); // value2 if key2 is still in the cache
console.log(cache.size()); // 1
```

NOTE: if you set the `lruSize` property to `0` after it was enabled it will disable the LRU cache feature and will not limit the number of keys in the cache. This will remove the `16,777,216 (2^24) keys` limit of a single `Map` object and will allow you to store more keys in the cache.

## CacheableMemory Performance

Our goal with `cacheable` and `CacheableMemory` is to provide a high performance caching engine that is simple to use and has a robust API. We test it against other cacheing engines such that are less feature rich to make sure there is little difference. Here are some of the benchmarks we have run:

*Memory Benchmark Results:*
|                   name                   |  summary  |  ops/sec  |  time/op  |  margin  |  samples  |
|------------------------------------------|:---------:|----------:|----------:|:--------:|----------:|
|  Cacheable Memory (v1.10.0) - set / get  |    🥇     |     152K  |      7µs  |  ±0.94%  |     147K  |
|  Map (v22) - set / get                   |   -1.1%   |     151K  |      7µs  |  ±0.69%  |     145K  |
|  Node Cache - set / get                  |   -4.3%   |     146K  |      7µs  |  ±1.13%  |     142K  |
|  bentocache (v1.4.0) - set / get         |   -20%    |     121K  |      8µs  |  ±0.40%  |     119K  |

*Memory LRU Benchmark Results:*
|                   name                   |  summary  |  ops/sec  |  time/op  |  margin  |  samples  |
|------------------------------------------|:---------:|----------:|----------:|:--------:|----------:|
|  quick-lru (v7.0.1) - set / get          |    🥇     |     118K  |      9µs  |  ±0.85%  |     112K  |
|  Map (v22) - set / get                   |  -0.56%   |     117K  |      9µs  |  ±1.35%  |     110K  |
|  lru.min (v1.1.2) - set / get            |   -1.7%   |     116K  |      9µs  |  ±0.90%  |     110K  |
|  Cacheable Memory (v1.10.0) - set / get  |   -3.3%   |     114K  |      9µs  |  ±1.16%  |     108K  |

As you can see from the benchmarks `CacheableMemory` is on par with other caching engines such as `Map`, `Node Cache`, and `bentocache`. We have also tested it against other LRU caching engines such as `quick-lru` and `lru.min` and it performs well against them too.

## Maximum Time to Live (maxTtl)

You can set a `maxTtl` option to enforce an upper bound on any TTL in the cache. When `maxTtl` is set:
- Any per-entry TTL that exceeds `maxTtl` will be capped to `maxTtl`.
- Entries with no TTL (that would otherwise live indefinitely) will be capped to `maxTtl`.
- The default TTL is still respected if it is within the `maxTtl` limit.

This is useful when you want to guarantee that no cache entry lives longer than a certain duration, regardless of what TTL is passed to individual `set()` calls.

```javascript
import { CacheableMemory } from '@cacheable/memory';

// No entry can live longer than 1 hour
const cache = new CacheableMemory({ maxTtl: '1h' });

cache.set('key1', 'value1', '2h'); // capped to 1 hour
cache.set('key2', 'value2');        // also capped to 1 hour (would otherwise be indefinite)
cache.set('key3', 'value3', '30m'); // 30 minutes is within maxTtl, so it stays as-is
```

You can also set `maxTtl` after construction:

```javascript
const cache = new CacheableMemory();
cache.maxTtl = 5000; // 5 seconds max
cache.maxTtl = '10m'; // 10 minutes max
cache.maxTtl = undefined; // disable maxTtl (no upper bound)
```

## CacheableMemory Statistics

`CacheableMemory` can track runtime statistics using the shared [`Stats`](https://cacheable.org/docs/utils/) implementation from `@cacheable/utils` (the same engine used by `cacheable` and `@cacheable/node-cache`). Statistics are disabled by default. Enable them with the `stats` option or by setting `cache.stats.enabled = true` at any time:

```javascript
import { CacheableMemory } from '@cacheable/memory';

const cache = new CacheableMemory({ stats: true });

cache.set('key', 'value');
cache.get('key');     // hit
cache.get('missing'); // miss

console.log(cache.stats.hits);     // 1
console.log(cache.stats.misses);   // 1
console.log(cache.stats.gets);     // 2
console.log(cache.stats.sets);     // 1
console.log(cache.stats.count);    // 1
console.log(cache.stats.hitRate);  // 0.5
```

The `stats` property exposes the following counters:

* `hits`: The number of reads that found a (non-expired) value.
* `misses`: The number of reads that did not find a value.
* `gets`: The number of read operations. Every key read counts as one get, so `getMany(['a', 'b'])` records two gets.
* `sets`: The number of writes. Every key written counts as one set, including overwrites.
* `deletes`: The number of keys removed via `delete`/`deleteMany`/`take`, as well as keys evicted by the LRU.
* `clears`: The number of times `clear()` was called.
* `count`: The number of keys currently tracked in the cache.
* `ksize`: The estimated byte size of the keys in the cache.
* `vsize`: The estimated byte size of the values in the cache.
* `hitRate` / `missRate`: The ratio of hits / misses to total lookups.

You can get a plain-object snapshot via `cache.stats.toJSON()` and reset all counters with `cache.stats.reset()`.

The `count`, `ksize`, and `vsize` values are kept in sync as entries are added, removed, overwritten, and lazily expired, so they reflect the current contents of the cache. (Expired entries are not counted as `deletes`, since their removal is not user-initiated.) Methods that perform a read internally — such as `has()`, `take()`, and the `wrap()` / `getOrSet()` memoization helpers — flow through `get`/`set`, so they update the statistics as well.

For accurate size counters, enable statistics before populating the cache: `count`/`ksize`/`vsize` only account for entries written while statistics were enabled, and are clamped at `0` so they never go negative if you enable stats after the cache already has data. Changing `storeHashSize` recreates the underlying stores and clears all entries, so the size counters are reset to `0` accordingly.

## CacheableMemory Hooks and Events

`CacheableMemory` extends [`Hookified`](https://github.com/jaredwray/hookified), so you can register handlers that run around cache operations via the `CacheableMemoryHooks` enum and the `onHook()` method:

* `BEFORE_SET`: Called before `set()`. The handler receives `{ key, value, ttl }` and can reassign any of them to change what gets stored.
* `AFTER_SET`: Called after `set()` with the (possibly modified) `{ key, value, ttl }`.
* `BEFORE_SET_MANY`: Called before `setMany()` with the array of `CacheableItem`s. Items can be mutated.
* `AFTER_SET_MANY`: Called after `setMany()` with the array of items.
* `BEFORE_GET`: Called before `get()` with the `key`.
* `AFTER_GET`: Called after `get()` with `{ key, result }` (`result` is `undefined` on a cache miss).
* `BEFORE_GET_MANY`: Called before `getMany()` with the array of `keys`.
* `AFTER_GET_MANY`: Called after `getMany()` with `{ keys, result }`.
* `BEFORE_DELETE`: Called before `delete()` with the `key`.
* `AFTER_DELETE`: Called after `delete()` with the `key`.
* `BEFORE_DELETE_MANY`: Called before `deleteMany()` with the array of `keys`.
* `AFTER_DELETE_MANY`: Called after `deleteMany()` with the array of `keys`.
* `BEFORE_CLEAR`: Called before `clear()`.
* `AFTER_CLEAR`: Called after `clear()`.

An example of how to use these hooks:

```javascript
import { CacheableMemory, CacheableMemoryHooks } from '@cacheable/memory';

const cache = new CacheableMemory();

cache.onHook(CacheableMemoryHooks.BEFORE_SET, (item) => {
  console.log(`before set: ${item.key} ${item.value}`);
});

cache.onHook(CacheableMemoryHooks.AFTER_GET, (item) => {
  console.log(`after get: ${item.key} = ${item.result}`);
});
```

A `BEFORE_SET` handler can change the `key`, `value`, or `ttl` before the entry is stored. The `ttl` accepts a number (milliseconds), a [shorthand string](#shorthand-for-time-to-live-ttl), or a `SetOptions` object (`{ ttl, expire }`):

```javascript
cache.onHook(CacheableMemoryHooks.BEFORE_SET, (item) => {
  item.key = `user:${item.key}`;
  item.ttl = '1h';
});
```

Hooks are dispatched synchronously via `hookSync`, which **skips `async` handler functions entirely** — an `async` handler will not run at all (not merely run un-awaited), so register only synchronous handlers.

> **TypeScript:** the hook payload types are exported so you can annotate your handlers — `CacheableMemoryHookItem`, `CacheableMemoryAfterGetItem`, and `CacheableMemoryAfterGetManyItem`. For example:
> ```ts
> cache.onHook(CacheableMemoryHooks.BEFORE_SET, (item: CacheableMemoryHookItem) => {
>   item.ttl = '1h';
> });
> ```

## CacheableMemory Options

* `ttl`: The time to live for the cache in milliseconds. Default is `undefined` which is means indefinitely.
* `maxTtl`: The maximum time to live for any cache entry. When set, TTLs exceeding this value are capped. Default is `undefined` (no maximum).
* `useClones`: If the cache should use clones for the values. Default is `true`.
* `lruSize`: The size of the LRU cache. Default is `0`, which disables the LRU cache (no LRU eviction is performed). Maximum is `16,777,216 (2^24)`.
* `checkInterval`: The interval to check for expired keys in milliseconds. Default is `0` which is disabled.
* `storeHashSize`: The number of `Map` objects to use for the cache. Default is `16`.
* `storeHashAlgorithm`: The hashing algorithm to use for the cache. Default is `djb2`. Supported: DJB2, FNV1, MURMER, CRC32.
* `stats`: Whether to track runtime statistics (`hits`, `misses`, `gets`, `sets`, `deletes`, `clears`, `count`, `ksize`, `vsize`). Default is `false`.

## CacheableMemory - API

* `set(key, value, ttl?)`: Sets a value in the cache.
* `setMany([{key, value, ttl?}])`: Sets multiple values in the cache from `CacheableItem`.
* `get(key)`: Gets a value from the cache.
* `getMany([keys])`: Gets multiple values from the cache.
* `getRaw(key)`: Gets a value from the cache as `CacheableStoreItem`.
* `getManyRaw([keys])`: Gets multiple values from the cache as `CacheableStoreItem`.
* `has(key)`: Checks if a value exists in the cache.
* `hasMany([keys])`: Checks if multiple values exist in the cache.
* `delete(key)`: Deletes a value from the cache.
* `deleteMany([keys])`: Deletes multiple values from the cache.
* `take(key)`: Takes a value from the cache and deletes it.
* `takeMany([keys])`: Takes multiple values from the cache and deletes them.
* `wrap(function, WrapSyncOptions)`: Wraps a `sync` function in a cache.
* `clear()`: Clears the cache.
* `onHook(hook, handler)`: Registers a handler for a `CacheableMemoryHooks` event. See [CacheableMemory Hooks and Events](#cacheablememory-hooks-and-events).
* `ttl`: The default time to live for the cache in milliseconds. Default is `undefined` which is disabled.
* `maxTtl`: The maximum time to live for any cache entry. When set, TTLs exceeding this value are capped. Default is `undefined` (no maximum).
* `useClones`: If the cache should use clones for the values. Default is `true`.
* `lruSize`: The size of the LRU cache. Default is `0`, which disables the LRU cache (no LRU eviction is performed). Maximum is `16,777,216 (2^24)`.
* `size`: The number of keys in the cache.
* `checkInterval`: The interval to check for expired keys in milliseconds. Default is `0` which is disabled.
* `storeHashSize`: The number of `Map` objects to use for the cache. Default is `16`.
* `storeHashAlgorithm`: The hashing algorithm to use for the cache. Default is `djb2`. Supported: DJB2, FNV1, MURMER, CRC32.
* `stats`: The statistics for this instance which includes `hits`, `misses`, `gets`, `sets`, `deletes`, `clears`, `count`, `vsize`, and `ksize`. Disabled by default; enable via the `stats` option or `cache.stats.enabled = true`.
* `keys`: Get the keys in the cache. Not able to be set.
* `items`: Get the items in the cache as `CacheableStoreItem` example `{ key, value, expires? }`.
* `store`: The hash store for the cache which is an array of `Map` objects.
* `checkExpired()`: Checks for expired keys in the cache. This is used by the `checkInterval` property.
* `startIntervalCheck()`: Starts the interval check for expired keys if `checkInterval` is above 0 ms.
* `stopIntervalCheck()`: Stops the interval check for expired keys.

# Keyv Storage Adapter - KeyvCacheableMemory

`cacheable` comes with a built-in storage adapter for Keyv called `KeyvCacheableMemory`. This takes `CacheableMemory` and creates a storage adapter for Keyv. This is useful if you want to use `CacheableMemory` as a storage adapter for Keyv. Here is an example of how to use `KeyvCacheableMemory`:

```javascript
import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';

const keyv = new Keyv({ store: new KeyvCacheableMemory() });
await keyv.set('foo', 'bar');
const value = await keyv.get('foo');
console.log(value); // bar 
```

# Wrap / Memoization for Sync and Async Functions

`CacheableMemory` has a feature called `wrap` that allows you to wrap a function in a cache. This is useful for memoization and caching the results of a function. You can wrap a `sync` function in a cache. Here is an example of how to use the `wrap` function:

```javascript
import { CacheableMemory } from 'cacheable';
const syncFunction = (value: number) => {
  return value * 2;
};

const cache = new CacheableMemory();
const wrappedFunction = cache.wrap(syncFunction, { ttl: '1h', key: 'syncFunction' });
console.log(wrappedFunction(2)); // 4
console.log(wrappedFunction(2)); // 4 from cache
```

In this example we are wrapping a `sync` function in a cache with a `ttl` of `1 hour`. This will cache the result of the function for `1 hour` and then expire the value. You can also set the `key` property in the `wrap()` options to set a custom key for the cache.

When an error occurs in the function it will not cache the value and will return the error. This is useful if you want to cache the results of a function but not cache the error. If you want it to cache the error you can set the `cacheError` property to `true` in the `wrap()` options. This is disabled by default.

```javascript
import { CacheableMemory } from 'cacheable';
const syncFunction = (value: number) => {
  throw new Error('error');
};

const cache = new CacheableMemory();
const wrappedFunction = cache.wrap(syncFunction, { ttl: '1h', key: 'syncFunction', cacheError: true });
console.log(wrappedFunction()); // error
console.log(wrappedFunction()); // error from cache
```

If you would like to generate your own key for the wrapped function you can set the `createKey` property in the `wrap()` options. This is useful if you want to generate a key based on the arguments of the function or any other criteria.

```javascript
  const cache = new CacheableMemory();
  const options: WrapOptions = {
    cache,
    keyPrefix: 'test',
    createKey: (function_, arguments_, options: WrapOptions) => `customKey:${options?.keyPrefix}:${arguments_[0]}`,
  };

  const wrapped = wrap((argument: string) => `Result for ${argument}`, options);

  const result1 = wrapped('arg1');
  const result2 = wrapped('arg1'); // Should hit the cache

  console.log(result1); // Result for arg1
  console.log(result2); // Result for arg1 (from cache)
```

We will pass in the `function` that is being wrapped, the `arguments` passed to the function, and the `options` used to wrap the function. You can then use these to generate a custom key for the cache.

# Get Or Set Memoization Function

`CacheableMemory` also has a `getOrSet` method that implements the cache-aside pattern in a single synchronous call. It attempts to retrieve a value from the cache, and if it is not found it calls the provided function to compute the value, stores it, and returns it. This is the synchronous counterpart to the `getOrSet` method on `cacheable` and is backed by `getOrSetSync` from [@cacheable/utils](https://cacheable.org/docs/utils/).

```javascript
import { CacheableMemory } from '@cacheable/memory';

const cache = new CacheableMemory();

const getUser = () => ({ id: 1, name: 'Alice' });

// First call computes the value and stores it
const user1 = cache.getOrSet('user:1', getUser, { ttl: '1h' });
// Second call returns the cached value without calling getUser again
const user2 = cache.getOrSet('user:1', getUser, { ttl: '1h' });

console.log(user1); // { id: 1, name: 'Alice' }
console.log(user1 === user2); // true (served from cache)
```

The third argument accepts the following options:

```typescript
export type GetOrSetFunctionOptions = {
	ttl?: number | string;
	cacheErrors?: boolean;
	throwErrors?: boolean | 'function' | 'store';
};
```

* `ttl`: The time to live for the stored value. If omitted it falls back to the instance default `ttl`. Accepts milliseconds or the [shorthand](#shorthand-for-time-to-live-ttl) format such as `1h`.
* `cacheErrors`: When `true`, errors thrown by the function are cached so the function is not retried until the entry expires. Default is `false`.
* `throwErrors`: Controls whether errors are rethrown. `false` (default) emits errors on the `error` event and returns `undefined`; `true` rethrows any error; `'function'` only rethrows errors from the provided function; `'store'` only rethrows errors from reading/writing the cache.

Because `CacheableMemory` is synchronous there is no request coalescing — synchronous code runs to completion without interleaving, so concurrent callers cannot stampede the setter the way they can with the async `getOrSet` on `cacheable`.

You can also pass a function to compute the key:

```javascript
import { CacheableMemory, GetOrSetSyncKey } from '@cacheable/memory';

const cache = new CacheableMemory();

const generateKey: GetOrSetSyncKey = (options) => `user:${options?.ttl}`;

const value = cache.getOrSet(generateKey, () => Math.random() * 100, { ttl: '1h' });
```

# How to Contribute

You can contribute by forking the repo and submitting a pull request. Please make sure to add tests and update the documentation. To learn more about how to contribute go to our main README [https://github.com/jaredwray/cacheable](https://github.com/jaredwray/cacheable). This will talk about how to `Open a Pull Request`, `Ask a Question`, or `Post an Issue`.

# License and Copyright
[MIT © Jared Wray](./LICENSE)
