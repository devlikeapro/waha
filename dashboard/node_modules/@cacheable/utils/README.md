[<img align="center" src="https://cacheable.org/logo.svg" alt="Cacheable" />](https://github.com/jaredwray/cacheable)

> Cacheble Utils

[![codecov](https://codecov.io/gh/jaredwray/cacheable/branch/main/graph/badge.svg?token=lWZ9OBQ7GM)](https://codecov.io/gh/jaredwray/cacheable)
[![tests](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml/badge.svg)](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/dm/@cacheable/utils.svg)](https://www.npmjs.com/package/@cacheable/utils)
[![npm](https://img.shields.io/npm/v/@cacheable/utils)](https://www.npmjs.com/package/@cacheable/utils)
[![license](https://img.shields.io/github/license/jaredwray/cacheable)](https://github.com/jaredwray/cacheable/blob/main/LICENSE)

`@cacheable/utils` is a collecton of utility functions, helpers, and types for `cacheable` and other caching libraries. It provides a robust set of features to enhance caching capabilities, including:

* Data Types for Caching Items
* Hash Functions for Key Generation
* Coalesce Async for Handling Multiple Promises
* Statistics for Tracking Cache Metrics
* Sleep / Delay for Testing and Timing
* Memoization for wraping or get / set options
* Time to Live (TTL) Helpers
* Tag-Based Cache Invalidation

# Table of Contents
* [Getting Started](#getting-started)
* [Cacheable Types](#cacheable-types)
* [Coalesce Async](#coalesce-async)
* [Hash Functions](#hash-functions)
* [Shorthand Time Helpers](#shorthand-time-helpers)
* [Sleep Helper](#sleep-helper)
* [Statistics](#statistics)
* [Time to Live (TTL) Helpers](#time-to-live-ttl-helpers)
* [Run if Function Helper](#run-if-function-helper)
* [Less Than Helper](#less-than-helper)
* [Is Object Helper](#is-object-helper)
* [Wrap / Memoization for Sync and Async Functions](#wrap--memoization-for-sync-and-async-functions)
* [Get Or Set Memoization Function](#get-or-set-memoization-function)
* [Cache Tags](#cache-tags)
* [How to Contribute](#how-to-contribute)
* [License and Copyright](#license-and-copyright)

# Getting Started

```bash
npm install @cacheable/utils --save
```

# Cacheable Types

The `@cacheable/utils` package provides various types that are used throughout the caching library. These types help in defining the structure of cached items, ensuring type safety and consistency across your caching operations.

```typescript

/**
 * CacheableItem
 * @typedef {Object} CacheableItem
 * @property {string} key - The key of the cacheable item
 * @property {any} value - The value of the cacheable item
 * @property {number|string} [ttl] - Time to Live - If you set a number it is miliseconds, if you set a string it is a human-readable
 * format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means that it will use the default time-to-live. If both are
 * undefined then it will not have a time-to-live.
 */
export type CacheableItem = {
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
export type CacheableStoreItem = {
	key: string;
	value: any;
	expires?: number;
};
```

# Coalesce Async

The `coalesceAsync` function is a utility that allows you to handle multiple asynchronous operations efficiently. It was designed by `Douglas Cayers` https://github.com/douglascayers/promise-coalesce. It helps in coalescing multiple promises into a single promise, ensuring that only one operation is executed at a time for the same key.

```typescript
import { coalesceAsync } from '@cacheable/utils';

const fetchData = async (key: string) => {
  // Simulate an asynchronous operation
  return new Promise((resolve) => setTimeout(() => resolve(`Data for ${key}`), 1000));
};

const result = await Promise.all([
	coalesceAsync('my-key', fetchData),
	coalesceAsync('my-key', fetchData),
	coalesceAsync('my-key', fetchData),
]);
console.log(result); // Data for my-key only executed once
```

# Hash Functions

The `@cacheable/utils` package provides hash functions that can be used to generate unique keys for caching operations. These functions are useful for creating consistent and unique identifiers for cached items.

The hashing API provides both **async** (for cryptographic algorithms) and **sync** (for non-cryptographic algorithms) methods.

## Async Hashing (Cryptographic Algorithms)

Use `hash()` and `hashToNumber()` for cryptographic algorithms like SHA-256, SHA-384, and SHA-512:

```typescript
import { hash, hashToNumber, HashAlgorithm } from '@cacheable/utils';

// Hash using SHA-256 (default)
const key = await hash('my-cache-key');
console.log(key); // Unique hash for 'my-cache-key'

// Hash with specific algorithm
const sha512Hash = await hash('my-data', { algorithm: HashAlgorithm.SHA512 });

// Convert hash to number within range
const min = 0;
const max = 10;
const result = await hashToNumber({foo: 'bar'}, { min, max, algorithm: HashAlgorithm.SHA256 });
console.log(result); // A number between 0 and 10 based on the hash value
```

## Sync Hashing (Non-Cryptographic Algorithms)

Use `hashSync()` and `hashToNumberSync()` for faster, non-cryptographic algorithms like DJB2, FNV1, MURMER, and CRC32:

```typescript
import { hashSync, hashToNumberSync, HashAlgorithm } from '@cacheable/utils';

// Hash using DJB2 (default for sync)
const key = hashSync('my-cache-key');
console.log(key); // Unique hash for 'my-cache-key'

// Hash with specific algorithm
const fnv1Hash = hashSync('my-data', { algorithm: HashAlgorithm.FNV1 });

// Convert hash to number within range
const min = 0;
const max = 10;
const result = hashToNumberSync({foo: 'bar'}, { min, max, algorithm: HashAlgorithm.DJB2 });
console.log(result); // A number between 0 and 10 based on the hash value
```

## Available Hash Algorithms

**Cryptographic (Async):**
- `HashAlgorithm.SHA256` - SHA-256 (default for async methods)
- `HashAlgorithm.SHA384` - SHA-384
- `HashAlgorithm.SHA512` - SHA-512

**Non-Cryptographic (Sync):**
- `HashAlgorithm.DJB2` - DJB2 (default for sync methods)
- `HashAlgorithm.FNV1` - FNV-1
- `HashAlgorithm.MURMER` - Murmur hash
- `HashAlgorithm.CRC32` - CRC32

# Shorthand Time Helpers

The `@cacheable/utils` package provides a shorthand function to convert human-readable time strings into milliseconds. This is useful for setting time-to-live (TTL) values in caching operations.

You can also use the `shorthandToMilliseconds` function:

```typescript
import { shorthandToMilliseconds } from '@cacheable/utils';

const milliseconds = shorthandToMilliseconds('1h');
console.log(milliseconds); // 3600000
```

You can also use the `shorthandToTime` function to get the current date plus the shorthand time:

```typescript
import { shorthandToTime } from '@cacheable/utils';

const currentDate = new Date();
const timeInMs = shorthandToTime('1h', currentDate);
console.log(timeInMs); // Current date + 1 hour in milliseconds since epoch
```

# Sleep Helper

The `sleep` function is a utility that allows you to pause execution for a specified duration. This can be useful in testing scenarios or when you need to introduce delays in your code.

```typescript
import { sleep } from '@cacheable/utils';

await sleep(1000); // Pause for 1 second
console.log('Execution resumed after 1 second');
```

# Statistics

The `Stats` class provides a unified, event-driven way to track caching metrics such as hits, misses, hit rate, item counts, and approximate memory usage. It can be driven two ways:

* **Imperatively** — call `increment` / `decrement` (or the named helpers) directly from your code.
* **Event-driven** — `subscribe` it to an event emitter (such as `@cacheable/node-cache` or a Node `EventEmitter`) and let matching events update the counters automatically.

Statistics are **opt-in**: a new `Stats` instance is disabled by default and ignores every update until enabled, so there is zero tracking overhead unless you ask for it.

```typescript
import { Stats } from '@cacheable/utils';

const stats = new Stats({ enabled: true });

stats.incrementHits();
stats.incrementMisses();
stats.incrementGets();

console.log(stats.hits);    // 1
console.log(stats.misses);  // 1
console.log(stats.hitRate); // 0.5
```

## Available Statistics

Every counter is exposed as a read-only property:

| Property | Type | Description |
| --- | --- | --- |
| `hits` | `number` | Number of cache hits. |
| `misses` | `number` | Number of cache misses. |
| `gets` | `number` | Number of get operations. |
| `sets` | `number` | Number of set operations. |
| `deletes` | `number` | Number of delete operations. |
| `clears` | `number` | Number of clear operations. |
| `count` | `number` | Number of items currently tracked. |
| `ksize` | `number` | Approximate size of all keys, in bytes. |
| `vsize` | `number` | Approximate size of all values, in bytes. |

### Computed Properties

| Property | Type | Description |
| --- | --- | --- |
| `hitRate` | `number` | `hits / (hits + misses)`, or `0` when there have been no lookups. |
| `missRate` | `number` | `misses / (hits + misses)`, or `0` when there have been no lookups. |

### Metadata

| Property | Type | Description |
| --- | --- | --- |
| `enabled` | `boolean` | Whether tracking is currently on. |
| `lastUpdated` | `number \| undefined` | Timestamp (ms since epoch) of the last update while enabled. |
| `lastReset` | `number \| undefined` | Timestamp (ms since epoch) of the last `reset()` / `clear()`. |

## Enabling, Disabling, and Clearing

```typescript
const stats = new Stats(); // disabled by default

stats.enable();          // start tracking (or: stats.enabled = true)
stats.incrementHits();
console.log(stats.hits); // 1

stats.disable();         // stop tracking (or: stats.enabled = false)
stats.incrementHits();
console.log(stats.hits); // still 1

stats.clear();           // reset every counter back to 0 (alias of reset())
console.log(stats.hits); // 0
```

* `reset()` / `clear()` — set every counter back to `0` and record `lastReset`.
* `resetStoreValues()` — reset only `count`, `ksize`, and `vsize`, leaving the hit/miss history intact.

## Incrementing and Decrementing

Use the unified `increment` / `decrement` methods with any counter field, or the named helpers. All updates are ignored while disabled.

```typescript
const stats = new Stats({ enabled: true });

// Unified API — optional amount (defaults to 1)
stats.increment('hits');
stats.increment('sets', 5);
stats.decrement('count', 2);

// Named helpers
stats.incrementHits();
stats.incrementMisses();
stats.incrementGets();
stats.incrementSets();
stats.incrementDeletes();
stats.incrementClears();
stats.incrementCount();
stats.decreaseCount();

// Approximate key/value sizes
stats.incrementKSize('my-key');  // adds the byte size of the key
stats.incrementVSize({ a: 1 });  // adds the byte size of the value
stats.decreaseKSize('my-key');
stats.decreaseVSize({ a: 1 });
stats.setCount(10);              // set the item count directly
```

`StatField` is the union of countable fields: `'hits' | 'misses' | 'gets' | 'sets' | 'deletes' | 'clears' | 'count'`.

## Snapshot

`toJSON()` (aliased as `snapshot()`) returns a plain object of every counter, the computed rates, and the timestamps — handy for logging or sending to a metrics system.

```typescript
const stats = new Stats({ enabled: true });
stats.incrementHits(3);
stats.incrementMisses();

console.log(stats.toJSON());
// {
//   enabled: true,
//   hits: 3, misses: 1, gets: 0, sets: 0, deletes: 0, clears: 0,
//   vsize: 0, ksize: 0, count: 0,
//   hitRate: 0.75, missRate: 0.25,
//   lastUpdated: 1749513600000, lastReset: undefined
// }
```

## Event-Driven Tracking

Instead of calling the increment methods yourself, you can `subscribe` a `Stats` instance to an emitter and have events update the counters automatically. The emitter is duck-typed — anything with `.on()` (plus `.off()` or `.removeListener()` to detach) works, including `Hookified`-based classes and Node's `EventEmitter`.

An **event map** describes how each event name updates the stats. A map value can be:

* a single field — `"sets"`
* an array of fields — `["hits", "gets"]`
* a custom handler — `(stats, ...args) => void`

```typescript
import { Stats, nodeCacheStatsEventMap } from '@cacheable/utils';
import { NodeCache } from '@cacheable/node-cache';

const cache = new NodeCache();
const stats = new Stats({ enabled: true });

// nodeCacheStatsEventMap maps set -> sets, del -> deletes, flush -> clears,
// and flush_stats -> reset.
stats.subscribe(cache, nodeCacheStatsEventMap);

cache.set('key', 'value');
console.log(stats.sets); // 1

stats.unsubscribe(); // detach all listeners (or pass an emitter to detach just one)
```

You can also provide your own map for any emitter:

```typescript
import { EventEmitter } from 'node:events';
import { Stats } from '@cacheable/utils';

const emitter = new EventEmitter();
const stats = new Stats({ enabled: true });

stats.subscribe(emitter, {
  'cache:hit': ['hits', 'gets'],
  'cache:miss': ['misses', 'gets'],
  evicted: (s) => s.incrementDeletes(),
});

emitter.emit('cache:hit', { key: 'a' });
console.log(stats.hitRate); // 1
```

You can subscribe to multiple emitters from a single `Stats` instance, and pass an emitter to `unsubscribe(emitter)` to detach just that one. Counting is gated by `enabled`, so you can subscribe first and toggle tracking on later — handlers do not run at all while disabled.

## Per-Key Tracking (Most and Least Used Keys)

To find your hottest and coldest keys, enable per-key tracking with `trackKeys`. Each recorded key keeps its own breakdown of `hits`, `misses`, `gets`, `sets`, and `deletes`, plus a computed total `count` and per-key `hitRate`.

```typescript
import { Stats } from '@cacheable/utils';

const stats = new Stats({ enabled: true, trackKeys: true });

stats.recordKey('user:1', 'hits');
stats.recordKey('user:1', 'gets', 5);
stats.recordKey('user:2', 'misses');

// 100 most used keys by total operations (descending)
console.log(stats.mostUsedKeys(100));
// [
//   { key: 'user:1', count: 6, hits: 1, misses: 0, gets: 5, sets: 0, deletes: 0, hitRate: 1 },
//   { key: 'user:2', count: 1, hits: 0, misses: 1, gets: 0, sets: 0, deletes: 0, hitRate: 0 }
// ]

// 100 least used keys by total operations (ascending)
console.log(stats.leastUsedKeys(100));

// Rank by a single counter instead of the total
console.log(stats.mostUsedKeys(100, 'hits'));

// Inspect one key, or read the (read-only) tracked-keys map directly
console.log(stats.keyStats('user:1'));
console.log(stats.trackedKeys.size);

stats.clearKeys(); // clear per-key stats only (reset() clears these too)
```

Both `mostUsedKeys` and `leastUsedKeys` default to 100 entries, and `trackedKeys` is included in `toJSON()` snapshots.

Per-key tracking is fed two ways, just like the aggregate counters:

* **Imperatively** — call `recordKey(key, field, amount?)` wherever you already increment stats.
* **Event-driven** — `nodeCacheStatsEventMap` automatically records keys from `set`/`del` events when `trackKeys` is on, and custom event-map handlers can call `recordKey` with whatever the payload carries.

Memory is proportional to the number of unique keys tracked, so `trackKeys` is off by default. You can also set `maxTrackedKeys` as a safety cap — when exceeded, the lowest-count keys are pruned. Note that pruning keeps `mostUsedKeys` approximately accurate but makes `leastUsedKeys` unreliable (the pruned keys *are* the least used), so leave it unset if you need exact least-used-key rankings.

> **Note:** a built-in map is provided only where a library's events map cleanly to stats. `nodeCacheStatsEventMap` is included because `@cacheable/node-cache` emits each lifecycle event exactly once. Libraries that emit per-store probes or omit events on a miss (such as `cacheable` and `cache-manager`) should be wired with a custom map or driven imperatively so the counts stay accurate.

# Time to Live (TTL) Helpers

The `@cacheable/utils` package provides helpers for managing time-to-live (TTL) values for cached items. 

You can use the `calculateTtlFromExpiration` function to calculate the TTL based on an expiration date:

```typescript
import { calculateTtlFromExpiration } from '@cacheable/utils';

const expirationDate = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes from now
const ttl = calculateTtlFromExpiration(Date.now(), expirationDate);
console.log(ttl); // 300000
```

You can also use `getTtlFromExpires` to get the TTL from an expiration date:

```typescript
import { getTtlFromExpires } from '@cacheable/utils';

const expirationDate = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes from now
const ttl = getTtlFromExpires(expirationDate);
console.log(ttl); // 300000
```

You can use `getCascadingTtl` to get the TTL for cascading cache operations:

```typescript
import { getCascadingTtl } from '@cacheable/utils';
const cacheableTtl = 1000 * 60 * 5; // 5 minutes
const primaryTtl = 1000 * 60 * 2; // 2 minutes
const secondaryTtl = 1000 * 60; // 1 minute
const ttl = getCascadingTtl(cacheableTtl, primaryTtl, secondaryTtl);
```

# Run if Function Helper

The `runIfFn` utility function provides a convenient way to conditionally execute functions or return values based on whether the input is a function or not. This pattern is commonly used in UI libraries and configuration systems where values can be either static or computed.

```typescript
import { runIfFn } from '@cacheable/utils';

// Static value - returns the value as-is
const staticValue = runIfFn('hello world');
console.log(staticValue); // 'hello world'

// Function with no arguments - executes the function
const dynamicValue = runIfFn(() => new Date().toISOString());
console.log(dynamicValue); // Current timestamp

// Function with arguments - executes with provided arguments
const sum = runIfFn((a: number, b: number) => a + b, 5, 10);
console.log(sum); // 15

// Complex example with conditional logic
const getConfig = (isDevelopment: boolean) => ({
  apiUrl: isDevelopment ? 'http://localhost:3000' : 'https://api.example.com',
  timeout: isDevelopment ? 5000 : 30000
});

const config = runIfFn(getConfig, true);
console.log(config); // { apiUrl: 'http://localhost:3000', timeout: 5000 }
```

# Less Than Helper

The `lessThan` utility function provides a safe way to compare two values and determine if the first value is less than the second. It only performs the comparison if both values are valid numbers, returning `false` for any non-number inputs.

```typescript
import { lessThan } from '@cacheable/utils';

// Basic number comparisons
console.log(lessThan(1, 2)); // true
console.log(lessThan(2, 1)); // false
console.log(lessThan(1, 1)); // false

// Works with negative numbers
console.log(lessThan(-1, 0)); // true
console.log(lessThan(-2, -1)); // true

// Works with decimal numbers
console.log(lessThan(1.5, 2.5)); // true
console.log(lessThan(2.7, 2.7)); // false

// Safe handling of non-number values
console.log(lessThan("1", 2)); // false
console.log(lessThan(1, "2")); // false
console.log(lessThan(null, 1)); // false
console.log(lessThan(undefined, 1)); // false
console.log(lessThan(NaN, 1)); // false

// Useful in filtering and sorting operations
const numbers = [5, 2, 8, 1, 9];
const lessThanFive = numbers.filter(n => lessThan(n, 5));
console.log(lessThanFive); // [2, 1]

// Safe comparison in conditional logic
function processValue(a?: number, b?: number) {
  if (lessThan(a, b)) {
    return `${a} is less than ${b}`;
  }
  return 'Invalid comparison or a >= b';
}
```

This utility is particularly useful when dealing with potentially undefined or invalid numeric values, ensuring type safety in comparison operations.

# Is Object Helper

The `isObject` utility function provides a type-safe way to determine if a value is a plain object. It returns `true` for objects but `false` for arrays, `null`, functions, and primitive types. This function also serves as a TypeScript type guard.

```typescript
import { isObject } from '@cacheable/utils';

// Basic object detection
console.log(isObject({})); // true
console.log(isObject({ name: 'John', age: 30 })); // true
console.log(isObject(Object.create(null))); // true

// Arrays are not considered objects
console.log(isObject([])); // false
console.log(isObject([1, 2, 3])); // false

// null is not considered an object (despite typeof null === 'object')
console.log(isObject(null)); // false

// Primitive types return false
console.log(isObject('string')); // false
console.log(isObject(123)); // false
console.log(isObject(true)); // false
console.log(isObject(undefined)); // false

// Functions return false
console.log(isObject(() => {})); // false
console.log(isObject(Date)); // false

// Built-in object types return true
console.log(isObject(new Date())); // true
console.log(isObject(/regex/)); // true
console.log(isObject(new Error('test'))); // true
console.log(isObject(new Map())); // true

// TypeScript type guard usage
function processValue(value: unknown) {
  if (isObject<{ name: string; age: number }>(value)) {
    // TypeScript now knows value is an object with name and age properties
    console.log(`Name: ${value.name}, Age: ${value.age}`);
  }
}

// Useful for configuration validation
function validateConfig(config: unknown) {
  if (!isObject(config)) {
    throw new Error('Configuration must be an object');
  }
  
  // Safe to access object properties
  return config;
}

// Filtering arrays for objects only
const mixedArray = [1, 'string', {}, [], null, { valid: true }];
const objectsOnly = mixedArray.filter(isObject);
console.log(objectsOnly); // [{}', { valid: true }]
```

This utility is particularly useful for:
- **Type validation** - Ensuring values are objects before accessing properties
- **TypeScript type guarding** - Narrowing types in conditional blocks
- **Configuration parsing** - Validating that configuration values are objects
- **Data filtering** - Separating objects from other data types

# Wrap / Memoization for Sync and Async Functions

The `@cacheable/utils` package provides two main functions: `wrap` and `wrapSync`. These functions are used to memoize asynchronous and synchronous functions, respectively.

```javascript
import { Cacheable } from 'cacheable';
const asyncFunction = async (value: number) => {
  return Math.random() * value;
};

const cache = new Cacheable();
const options = {
  ttl: '1h', // 1 hour
  keyPrefix: 'p1', // key prefix. This is used if you have multiple functions and need to set a unique prefix.
  cache,
}
const wrappedFunction = wrap(asyncFunction, options);
console.log(await wrappedFunction(2)); // 4
console.log(await wrappedFunction(2)); // 4 from cache
```
With `wrap` we have also included stampede protection so that a `Promise` based call will only be called once if multiple requests of the same are executed at the same time. Here is an example of how to test for stampede protection:
  
```javascript
import { Cacheable } from 'cacheable';
const asyncFunction = async (value: number) => {
  return value;
};

const cache = new Cacheable();
const options = {
  ttl: '1h', // 1 hour
  keyPrefix: 'p1', // key prefix. This is used if you have multiple functions and need to set a unique prefix.
  cache,
}

const wrappedFunction = wrap(asyncFunction, options);
const promises = [];
for (let i = 0; i < 10; i++) {
  promises.push(wrappedFunction(i));
}

const results = await Promise.all(promises); // all results should be the same

console.log(results); // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

In this example we are wrapping an `async` function in a cache with a `ttl` of `1 hour`. This will cache the result of the function for `1 hour` and then expire the value. You can also wrap a `sync` function in a cache:

```javascript
import { CacheableMemory } from 'cacheable';
const syncFunction = (value: number) => {
  return value * 2;
};

const cache = new CacheableMemory();
const wrappedFunction = wrap(syncFunction, { ttl: '1h', key: 'syncFunction', cache });
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
const wrappedFunction = wrap(syncFunction, { ttl: '1h', key: 'syncFunction', cacheError: true, cache });
console.log(wrappedFunction()); // error
console.log(wrappedFunction()); // error from cache
```

If you would like to generate your own key for the wrapped function you can set the `createKey` property in the `wrap()` options. This is useful if you want to generate a key based on the arguments of the function or any other criteria.

```javascript
  const cache = new Cacheable();
  const options: WrapOptions = {
    cache,
    keyPrefix: 'test',
    createKey: (function_, arguments_, options: WrapOptions) => `customKey:${options?.keyPrefix}:${arguments_[0]}`,
  };

  const wrapped = wrap((argument: string) => `Result for ${argument}`, options);

  const result1 = await wrapped('arg1');
  const result2 = await wrapped('arg1'); // Should hit the cache

  console.log(result1); // Result for arg1
  console.log(result2); // Result for arg1 (from cache)
```

We will pass in the `function` that is being wrapped, the `arguments` passed to the function, and the `options` used to wrap the function. You can then use these to generate a custom key for the cache.

# Get Or Set Memoization Function

The `getOrSet` method provides a convenient way to implement the cache-aside pattern. It attempts to retrieve a value from cache, and if not found, calls the provided function to compute the value and store it in cache before returning it. Here are the options:

```typescript
export type GetOrSetFunctionOptions = {
	ttl?: number | string;
	cacheErrors?: boolean;
	throwErrors?: boolean;
	nonBlocking?: boolean;
};
```

The `nonBlocking` option allows you to override the instance-level `nonBlocking` setting for the `get` call within `getOrSet`. When set to `false`, the `get` will block and wait for a response from the secondary store before deciding whether to call the provided function. When set to `true`, the primary store returns immediately and syncs from secondary in the background.

Here is an example of how to use the `getOrSet` method:

```javascript
import { Cacheable } from 'cacheable';
const cache = new Cacheable();
// Use getOrSet to fetch user data
const function_ = async () => Math.random() * 100;
const value = await getOrSet('randomValue', function_, { ttl: '1h', cache });
console.log(value); // e.g. 42.123456789
```

You can also use a function to compute the key for the function:

```javascript
import { Cacheable, GetOrSetOptions } from 'cacheable';
const cache = new Cacheable();

// Function to generate a key based on options
const generateKey = (options?: GetOrSetOptions) => {
  return `custom_key_:${options?.cacheId || 'default'}`;
};

const function_ = async () => Math.random() * 100;
const value = await getOrSet(generateKey(), function_, { ttl: '1h', cache });
```

# Cache Tags

The `CacheTags` service provides tag-based invalidation on top of any [Keyv](https://github.com/jaredwray/keyv) store. It is store-agnostic and does not require any adapter changes.

The service uses a lazy invalidation model. Instead of scanning and deleting keys, `invalidateTag` increments a per-tag version counter. Each cached key stores a snapshot of its tag versions at the time it was written, and `isKeyFresh` compares that snapshot to the current versions. If any tag version has been incremented since the snapshot was taken, the key is considered stale. Stale entries are not deleted explicitly and are expected to fall out of the cache via their TTL.

This approach keeps invalidation constant-time regardless of how many keys reference a tag. The trade-off is one additional `isKeyFresh` read per cache lookup.

```typescript
import { Keyv } from 'keyv';
import { CacheTags } from '@cacheable/utils';

const store = new Keyv();
const cacheTags = new CacheTags({ store, namespace: 'app' });

await cacheTags.setKeyTags('user:42', ['users', 'org:7'], { ttl: 3600000 });
console.log(await cacheTags.isKeyFresh('user:42')); // true

await cacheTags.invalidateTag('users');
console.log(await cacheTags.isKeyFresh('user:42')); // false
```

The recommended pattern is to call `isKeyFresh` before trusting a value returned from your cache, and to refresh the tag snapshot whenever you write a new value:

```typescript
import { Cacheable } from 'cacheable';
import { Keyv } from 'keyv';
import { CacheTags } from '@cacheable/utils';

const cache = new Cacheable();
const cacheTags = new CacheTags({ store: new Keyv() });

const getUser = async (id: string) => {
  const key = `user:${id}`;

  if (await cacheTags.isKeyFresh(key)) {
    const cached = await cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
  }

  const fresh = await loadUser(id);
  await cache.set(key, fresh, '1h');
  await cacheTags.setKeyTags(key, ['users', `org:${fresh.orgId}`], { ttl: 3600000 });
  return fresh;
};
```

You can invalidate one or many tags at a time. Both methods return the names of the tags that were bumped:

```typescript
const bumped = await cacheTags.invalidateTags(['users', 'org:7']);
console.log(bumped); // ['users', 'org:7']
```

When integrating with a cache where most keys are untagged, use `isKeyStale` instead of `isKeyFresh`. It only reports `true` when a snapshot exists for the key and one of its tags has been invalidated, so keys that were never tagged are not treated as stale:

```typescript
console.log(await cacheTags.isKeyStale('never-tagged')); // false
await cacheTags.setKeyTags('user:42', ['users']);
console.log(await cacheTags.isKeyStale('user:42')); // false
await cacheTags.invalidateTag('users');
console.log(await cacheTags.isKeyStale('user:42')); // true
```

The `getStaleKeys` method checks many keys at once using two batched store reads regardless of how many keys are passed — one for the snapshots and one for the union of their tag versions:

```typescript
await cacheTags.setKeyTags('a', ['x']);
await cacheTags.setKeyTags('b', ['y']);
await cacheTags.invalidateTag('x');
console.log(await cacheTags.getStaleKeys(['a', 'b', 'untagged'])); // ['a']
```

The `getTags` method returns the tags currently associated with a key, or `undefined` if the key has no snapshot:

```typescript
await cacheTags.setKeyTags('user:42', ['users', 'org:7']);
console.log(await cacheTags.getTags('user:42')); // ['users', 'org:7']
console.log(await cacheTags.getTags('missing')); // undefined
```

The `removeKey` and `removeKeys` methods delete tag snapshots when the cached values themselves are deleted. `removeKeys` performs a single batched delete:

```typescript
await cacheTags.removeKeys(['user:1', 'user:2']);
```

The service can be disabled via the `enabled` option or property so integrations pay no extra store reads for untagged workloads. While disabled, every method is a no-op: read methods return their neutral value (`isKeyFresh` returns `true`, `isKeyStale` returns `false`, `getStaleKeys` returns `[]`, and so on) and writes are skipped. The service never enables itself — you have to turn it on explicitly, which keeps behavior consistent across distributed instances sharing a store:

```typescript
const cacheTags = new CacheTags({ store, enabled: false });
console.log(await cacheTags.isKeyStale('anything')); // false, no store read
await cacheTags.setKeyTags('user:42', ['users']); // no-op while disabled
cacheTags.enabled = true; // turn it on to use tags
```

`setKeyTags`, `removeKey`, and `removeKeys` accept a `nonBlocking` option to fire-and-forget the store write. Failures from non-blocking operations are reported to the `onError` constructor option since they cannot be thrown to the caller:

```typescript
const cacheTags = new CacheTags({ store, onError: (error) => console.error(error) });
await cacheTags.setKeyTags('user:42', ['users'], { ttl: 3600000, nonBlocking: true });
```

The `getKeysByTag` method returns the keys currently referencing a given tag. It iterates the Keyv namespace and is therefore an `O(N)` operation. It is intended for debugging and tests rather than hot paths.

```typescript
await cacheTags.setKeyTags('user:1', ['users']);
await cacheTags.setKeyTags('user:2', ['users']);
const keys = await cacheTags.getKeysByTag('users');
console.log(keys); // ['user:1', 'user:2']
```

The service stores its metadata under a reserved prefix so that it cannot collide with user keys:

```
--cacheable--tags--:<namespace>:tag:<tagName>  → integer version counter
--cacheable--tags--:<namespace>:key:<keyName>  → { tags: { [tag]: versionAtSetTime } }
```

Tag version counters are stored without a TTL because they must outlive any key that references them. Key entries respect the `ttl` passed to `setKeyTags`, which should be set to match the TTL of the cached value it tracks.

The namespace defaults to `default` and can be set via the constructor. Two services configured with different namespaces can share the same store without seeing each other's tags or keys.

The read-version then write-snapshot sequence in `setKeyTags` is not atomic across processes. A concurrent `invalidateTag` that runs between the read and the write can leave a freshly written key referencing a stale version. An atomic Redis fast path using `MULTI` or Lua is a planned future enhancement.

# How to Contribute

You can contribute by forking the repo and submitting a pull request. Please make sure to add tests and update the documentation. To learn more about how to contribute go to our main README [https://github.com/jaredwray/cacheable](https://github.com/jaredwray/cacheable). This will talk about how to `Open a Pull Request`, `Ask a Question`, or `Post an Issue`.

# License and Copyright
[MIT © Jared Wray](./LICENSE)
