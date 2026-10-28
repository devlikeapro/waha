[<img align="center" src="https://cacheable.org/logo.svg" alt="Cacheable" />](https://github.com/jaredwray/cacheable)

> High Performance Layer 1 / Layer 2 Caching with Keyv Storage

[![codecov](https://codecov.io/gh/jaredwray/cacheable/branch/main/graph/badge.svg?token=lWZ9OBQ7GM)](https://codecov.io/gh/jaredwray/cacheable)
[![tests](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml/badge.svg)](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/dm/cacheable.svg)](https://www.npmjs.com/package/cacheable)
[![npm](https://img.shields.io/npm/v/cacheable)](https://www.npmjs.com/package/cacheable)
[![license](https://img.shields.io/github/license/jaredwray/cacheable)](https://github.com/jaredwray/cacheable/blob/main/LICENSE)

`cacheable` is a high performance layer 1 / layer 2 caching engine that is focused on distributed caching with enterprise features such as `CacheSync`. It is built on top of the robust storage engine [Keyv](https://keyv.org) and provides a simple API to cache and retrieve data.

* Simple to use with robust API
* Not bloated with additional modules
* Scalable and trusted storage engine by Keyv
* Memory Caching with LRU and Expiration `CacheableMemory`
* Resilient to failures with try/catch and offline
* Wrap / Memoization for Sync and Async Functions with Stampede Protection
* Hooks and Events to extend functionality
* Shorthand for ttl in milliseconds `(1m = 60000) (1h = 3600000) (1d = 86400000)`
* Non-blocking operations for layer 2 caching
* **Distributed Caching Sync via Pub/Sub with CacheSync**
* Comprehensive testing and code coverage
* ESM and CommonJS support with Typescript
* Maintained and supported regularly

# Table of Contents
* [Getting Started](#getting-started)
* [v1 to v2 Changes](#v1-to-v2-changes)
* [Basic Usage](#basic-usage)
* [Hooks and Events](#hooks-and-events)
  * [Overriding the TTL in a BEFORE_SET Hook](#overriding-the-ttl-in-a-before_set-hook)
* [Storage Tiering and Caching](#storage-tiering-and-caching)
* [TTL Propagation and Storage Tiering](#ttl-propagation-and-storage-tiering)
* [Per-Store TTL per Operation](#per-store-ttl-per-operation)
* [Shorthand for Time to Live (ttl)](#shorthand-for-time-to-live-ttl)
* [Maximum Time to Live (maxTtl)](#maximum-time-to-live-maxttl)
* [Tag Based Invalidation](#tag-based-invalidation)
* [Iteration on Primary and Secondary Stores](#iteration-on-primary-and-secondary-stores)
* [Non-Blocking Operations](#non-blocking-operations)
* [Non-Blocking with @keyv/redis](#non-blocking-with-keyvredis)
* [CacheableSync - Distributed Updates](#cacheablesync---distributed-updates)
* [Cacheable Options](#cacheable-options)
* [Cacheable Statistics (Instance Only)](#cacheable-statistics-instance-only)
* [Cacheable - API](#cacheable---api)
* [Static Instance (Singleton)](#static-instance-singleton)
* [CacheableMemory - In-Memory Cache](#cacheablememory---in-memory-cache)
* [Keyv Storage Adapter - KeyvCacheableMemory](#keyv-storage-adapter---keyvcacheablememory)
* [Wrap / Memoization for Sync and Async Functions](#wrap--memoization-for-sync-and-async-functions)
* [Get Or Set Memoization Function](#get-or-set-memoization-function)
* [How to Contribute](#how-to-contribute)
* [License and Copyright](#license-and-copyright)

# Getting Started

`cacheable` is primarily used as an extension to your caching engine with a robust storage backend [Keyv](https://keyv.org), Memoization (Wrap), Hooks, Events, and Statistics.

```bash
npm install cacheable
```

# Basic Usage

```javascript
import { Cacheable } from 'cacheable';

const cacheable = new Cacheable();
await cacheable.set('key', 'value', 1000);
const value = await cacheable.get('key');
```

This is a basic example where you are only using the in-memory storage engine. To enable layer 1 and layer 2 caching you can use the `secondary` property in the options:

```javascript
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';

const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({secondary});
``` 

In this example, the primary store we will use `lru-cache` and the secondary store is Redis. You can also set multiple stores in the options:

```javascript
import { Cacheable } from 'cacheable';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';
import { LRUCache } from 'lru-cache'

const primary = new Keyv({store: new LRUCache()});
const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({primary, secondary});
```

This is a more advanced example and not needed for most use cases.

# Hooks and Events

The following hooks are available for you to extend the functionality of `cacheable` via `CacheableHooks` enum:

* `BEFORE_SET`: This is called before the `set()` method is called.
* `AFTER_SET`: This is called after the `set()` method is called.
* `BEFORE_SET_MANY`: This is called before the `setMany()` method is called.
* `AFTER_SET_MANY`: This is called after the `setMany()` method is called.
* `BEFORE_GET`: This is called before the `get()` method is called.
* `AFTER_GET`: This is called after the `get()` method is called.
* `BEFORE_GET_MANY`: This is called before the `getMany()` method is called.
* `AFTER_GET_MANY`: This is called after the `getMany()` method is called.
* `BEFORE_SECONDARY_SETS_PRIMARY`: This is called when the secondary store sets the value in the primary store.

An example of how to use these hooks:

```javascript
import { Cacheable, CacheableHooks } from 'cacheable';

const cacheable = new Cacheable();
cacheable.onHook(CacheableHooks.BEFORE_SET, (data) => {
  console.log(`before set: ${data.key} ${data.value}`);
});
```

## Overriding the TTL in a BEFORE_SET Hook

A `BEFORE_SET` hook can change an entry's time-to-live by reassigning `data.ttl`. This works for `set()`, `getOrSet()`, and `wrap()` because they all run through `BEFORE_SET`. You can assign a single value (applied to every store) or a per-store object so the primary and secondary stores expire at different rates:

```javascript
import { Cacheable, CacheableHooks } from 'cacheable';
import KeyvRedis from '@keyv/redis';
const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({ secondary });

cache.onHook(CacheableHooks.BEFORE_SET, (data) => {
  // Keep this entry short-lived in memory (primary) but longer in Redis (secondary)
  data.ttl = { primary: '10s', secondary: '5m' };
});
```

Each store resolves its TTL independently, taking the first defined value down this list and then capping it with [`maxTtl`](#maximum-time-to-live-maxttl). This is the single source of truth for how *every* TTL (operation, hook, or default) is resolved:

| Precedence (highest first) | Primary store | Secondary store |
| --- | --- | --- |
| 1. `BEFORE_SET` hook | `data.ttl` (scalar, or `.primary`) | `data.ttl` (scalar, or `.secondary`) |
| 2. Operation `ttl` | `ttl` (scalar, or `.primary`) | `ttl` (scalar, or `.secondary`) |
| 3. Store default | `new Keyv({ ttl })` on the primary | `new Keyv({ ttl })` on the secondary |
| 4. Instance `ttl` | `new Cacheable({ ttl })` | `new Cacheable({ ttl })` |
| Cap (applied last) | `maxTtl` | `maxTtl` |

What happens when you override:

* **Per-store object** (`{ primary, secondary }`): each field applies to that store independently. A field you leave out falls back to that store's normal resolution — including any per-store `ttl` you passed to the operation.
* **Scalar** (a number or [shorthand string](#shorthand-for-time-to-live-ttl)): applied to **every** store, discarding any per-store `secondary` you passed to the operation. Use the object form if you want the stores to differ.
* **Any assignment counts as an override**, even assigning the value `data.ttl` already holds. Leaving `data.ttl` untouched keeps each store on its normal resolution (the default behavior).
* **`0`, `null`, or `undefined` clears the TTL** → the entry never expires, *ignoring* the cascade (store default and instance `ttl`). This matches the "disable the ttl" behavior in [Shorthand for Time to Live](#shorthand-for-time-to-live-ttl); take care when assigning a possibly-nullable value to `data.ttl`.
* **An invalid shorthand string aborts the whole write.** Assigning an unparseable string (e.g. `'10 seconds'`) throws; `set` catches it, emits the [`error` event](#hooks-and-events), and returns `false` **without caching** — so a hook typo silently disables caching for that write. Listen on `error` to catch it.
* **`maxTtl` is re-applied to each store after the hook**, so a hook can never push an entry past the cap.
* **Tag snapshots** use the longer of the two store TTLs (and never expire while either copy is immortal, including `ttl: 0`) so [tag invalidation](#tag-based-invalidation) can always reach the longest-lived copy.
* By the time **`AFTER_SET`** runs (and for [sync replication](#cacheablesync---distributed-updates)), `data.ttl` has been normalized to the effective **primary** TTL as a number; the secondary store's effective TTL is not exposed on the item. **`AFTER_SET_MANY` differs:** `setMany` does not mutate the items you passed, so a handler there still sees each `item.ttl` exactly as set (a per-store object stays an object).

> **TypeScript:** `onHook(CacheableHooks.BEFORE_SET, (data) => …)` types `data` automatically — no annotation needed, and an invalid `data.ttl` shape is a compile error. Payload types are exported too (`CacheableHookItem`, `CacheableSetItem`).

> **Note on backfills:** like a per-store `ttl` passed to an operation, a primary TTL set by a hook governs only that write — it is not persisted per key. Once the primary copy expires, the next read repopulates the primary from the secondary using the usual [TTL propagation](#ttl-propagation-and-storage-tiering) rules. Set a primary store default TTL (`new Keyv({ ttl })`) or an instance `maxTtl` if you need the primary to stay short across backfills.

> **Note on sync:** a per-store TTL writes the secondary's TTL to the (typically shared) secondary store directly; [CacheableSync](#cacheablesync---distributed-updates) replicates only the **primary** TTL to other instances' in-memory primaries. For the usual shared-secondary topology this is correct — the secondary is written once and read by every instance.

The same per-store object is accepted by `setMany` items and the `BEFORE_SET_MANY` hook:

```javascript
cache.onHook(CacheableHooks.BEFORE_SET_MANY, (items) => {
  for (const item of items) {
    item.ttl = { primary: '10s', secondary: '5m' };
  }
});

await cache.setMany([{ key: 'a', value: 1, ttl: { primary: '10s', secondary: '5m' } }]);
```

Here is an example of how to use `BEFORE_SECONDARY_SETS_PRIMARY` hook:

```javascript
import { Cacheable, CacheableHooks } from 'cacheable';
import KeyvRedis from '@keyv/redis';
const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({secondary});
cache.onHook(CacheableHooks.BEFORE_SECONDARY_SETS_PRIMARY, (data) => {
  console.log(`before secondary sets primary: ${data.key} ${data.value} ${data.ttl}`);
});
```
This is called when the secondary store sets the value in the primary store. This is useful if you want to do something before the value is set in the primary store such as manipulating the ttl or the value. Because this hook only writes the primary store, its `ttl` is a single value (a number or shorthand string), not a per-store object.

The following events are provided:

- `error`: Emitted when an error occurs.
- `cache:hit`: Emitted when a cache hit occurs.
- `cache:miss`: Emitted when a cache miss occurs.

Here is an example of using the `error` event:

```javascript
import { Cacheable, CacheableEvents } from 'cacheable';

const cacheable = new Cacheable();
cacheable.on(CacheableEvents.ERROR, (error) => {
  console.error(`Cacheable error: ${error.message}`);
});
```

We also offer `cache:hit` and `cache:miss` events. These events are emitted when a cache hit or miss occurs, respectively. Here is how to use them:

```javascript
import { Cacheable, CacheableEvents } from 'cacheable';

const cacheable = new Cacheable();
cacheable.on(CacheableEvents.CACHE_HIT, (data) => {
  console.log(`Cache hit: ${data.key} ${data.value} ${data.store}`); // the store will say primary or secondary
});
cacheable.on(CacheableEvents.CACHE_MISS, (data) => {
  console.log(`Cache miss: ${data.key} ${data.store}`); // the store will say primary or secondary
});
```

# Storage Tiering and Caching

`cacheable` is built as a layer 1 and layer 2 caching engine by default. The purpose is to have your layer 1 be fast and your layer 2 be more persistent. The primary store is the layer 1 cache and the secondary store is the layer 2 cache. By adding the secondary store you are enabling layer 2 caching. By default the operations are blocking but fault tolerant:

* `Setting Data`: Sets the value in the primary store and then the secondary store.
* `Getting Data`: Gets the value from the primary if the value does not exist it will get it from the secondary store and set it in the primary store.
* `Deleting Data`: Deletes the value from the primary store and secondary store at the same time waiting for both to respond.
* `Clearing Data`: Clears the primary store and secondary store at the same time waiting for both to respond.

When `Getting Data` if the value does not exist in the primary store it will try to get it from the secondary store. If the secondary store returns the value it will set it in the primary store. Because we use [TTL Propagation](#ttl-propagation-and-storage-tiering) the value will be set in the primary store with the TTL of the secondary store unless the time to live (TTL) is greater than the primary store which will then use the TTL of the primary store. An example of this is:

```javascript
import { Cacheable } from 'cacheable';
import {Keyv} from 'keyv';
import KeyvRedis from '@keyv/redis';
const secondary = new Keyv({ store: new KeyvRedis('redis://user:pass@localhost:6379'), ttl: 1000 });
const cache = new Cacheable({secondary, ttl: 100});

await cache.set('key', 'value'); // sets the value in the primary store with a ttl of 100 ms and secondary store with a ttl of 1000 ms

await sleep(500); // wait for .5 seconds

const value = await cache.get('key'); // gets the value from the secondary store and now sets the value in the primary store with a ttl of 500 ms which is what is left from the secondary store
```

In this example the primary store has a ttl of `100 ms` and the secondary store has a ttl of `1000 ms`. Because the ttl is greater in the secondary store it will default to setting ttl value in the primary store.

```javascript
import { Cacheable } from 'cacheable';
import {Keyv} from 'keyv';
import KeyvRedis from '@keyv/redis';
const primary = new Keyv({ ttl: 200 });
const secondary = new Keyv({ store: new KeyvRedis('redis://user:pass@localhost:6379'), ttl: 1000 });
const cache = new Cacheable({primary, secondary});

await cache.set('key', 'value'); // sets the value in the primary store with a ttl of 200 ms and secondary store with a ttl of 1000 ms

await sleep(200); // wait for .2 seconds

const value = await cache.get('key'); // gets the value from the secondary store and now sets the value in the primary store with a ttl of 200 ms which is what the primary store is set with
```

# TTL Propagation and Storage Tiering

Cacheable TTL propagation is a feature that allows you to set a time to live (TTL) for the cache. By default the TTL is set in the following order:

```
ttl = set at the function ?? storage adapter ttl ?? cacheable ttl
```

This means that if you set a TTL at the function level it will override the storage adapter TTL and the cacheable TTL. If you do not set a TTL at the function level it will use the storage adapter TTL and then the cacheable TTL. If you do not set a TTL at all it will use the default TTL of `undefined` which is disabled.

# Per-Store TTL per Operation

When you override the `ttl` on an operation it normally applies to both the primary and secondary stores. If you want each store to expire at a different rate for that specific key, pass a per-store object as the `ttl` with `primary` and/or `secondary` fields. Each field accepts a number in milliseconds or a [shorthand string](#shorthand-for-time-to-live-ttl).

```javascript
import { Cacheable } from 'cacheable';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';
const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({ secondary });

// Keep this key 10 seconds in memory (primary) but 5 minutes in Redis (secondary)
await cache.set('key', 'value', { ttl: { primary: '10s', secondary: '5m' } });
```

Any field you leave out falls back to that store's own default TTL resolution (storage adapter TTL, then the cacheable instance TTL). For example, only overriding the primary store leaves the secondary on its default:

```javascript
const secondary = new Keyv({ store: new KeyvRedis('redis://user:pass@localhost:6379'), ttl: '1h' });
const cache = new Cacheable({ secondary });

// Primary expires in 10s; secondary keeps its own 1 hour default
await cache.set('key', 'value', { ttl: { primary: '10s' } });
```

The per-store object works anywhere a `ttl` is accepted, including [`getOrSet`](#get-or-set-memoization-function) and [`wrap`](#wrap--memoization-for-sync-and-async-functions):

```javascript
await cache.getOrSet('key', async () => 'value', { ttl: { primary: '10s', secondary: '5m' } });

const getUser = cache.wrap(fetchUser, { ttl: { primary: '1m', secondary: '1d' } });
```

Passing a plain number or shorthand string (such as `'1h'`) still applies the same TTL to every store, and the [`maxTtl`](#maximum-time-to-live-maxttl) cap is applied to each store independently. The same per-store object is accepted by `setMany` items, and a [`BEFORE_SET` hook](#overriding-the-ttl-in-a-before_set-hook) can override these per-store TTLs and takes precedence over the value passed to the operation.

> **Note on backfills:** A per-store TTL (whether passed to the operation or set by a `BEFORE_SET` hook) governs the *write* of that operation. The primary TTL is not persisted per key, so once a primary (layer 1) entry expires, the next read is served from the secondary and repopulates the primary using the secondary's remaining lifetime — following the usual [TTL propagation](#ttl-propagation-and-storage-tiering) rules — rather than re-applying the original primary TTL. If you need the primary to keep a consistently shorter lifetime across backfills, set a primary store default TTL (`new Keyv({ ttl })`) or an instance `maxTtl`, which both bound the repopulated TTL.

# Shorthand for Time to Live (ttl)

By default `Cacheable` and `CacheableMemory` the `ttl` is in milliseconds but you can use shorthand for the time to live. Here are the following shorthand values:

* `ms`: Milliseconds such as (1ms = 1)
* `s`: Seconds such as (1s = 1000)
* `m`: Minutes such as (1m = 60000)
* `h` or `hr`: Hours such as (1h = 3600000)
* `d`: Days such as (1d = 86400000)

Here is an example of how to use the shorthand for the `ttl`:

```javascript
import { Cacheable } from 'cacheable';
const cache = new Cacheable({ ttl: '15m' }); //sets the default ttl to 15 minutes (900000 ms)
cache.set('key', 'value', '1h'); //sets the ttl to 1 hour (3600000 ms) and overrides the default
```

if you want to disable the `ttl` you can set it to `0` or `undefined`:

```javascript
import { Cacheable } from 'cacheable';
const cache = new Cacheable({ ttl: 0 }); //sets the default ttl to 0 which is disabled
cache.set('key', 'value', 0); //sets the ttl to 0 which is disabled
```

If you set the ttl to anything below `0` or `undefined` it will disable the ttl for the cache and the value that returns will be `undefined`. With no ttl set the value will be stored `indefinitely`.

```javascript
import { Cacheable } from 'cacheable';
const cache = new Cacheable({ ttl: 0 }); //sets the default ttl to 0 which is disabled
console.log(cache.ttl); // undefined
cache.ttl = '1h'; // sets the default ttl to 1 hour (3600000 ms)
console.log(cache.ttl); // '1h'
cache.ttl = -1; // sets the default ttl to 0 which is disabled
console.log(cache.ttl); // undefined
```

## Retrieving raw cache entries

The `get` and `getMany` methods support a `raw` option, which returns the full stored metadata (`StoredDataRaw<T>`) instead of just the value:

```typescript
import { Cacheable } from 'cacheable';

const cache = new Cacheable();

// store a value
await cache.set('user:1', { name: 'Alice' });

// default: only the value
const user = await cache.get<{ name: string }>('user:1');
console.log(user); // { name: 'Alice' }

// with raw: full record including expiration
const raw = await cache.get<{ name: string }>('user:1', { raw: true });
console.log(raw.value);   // { name: 'Alice' }
console.log(raw.expires); // e.g. 1677628495000 or null
```

```typescript
// getMany with raw option
await cache.set('a', 1);
await cache.set('b', 2);

const raws = await cache.getMany<number>(['a', 'b'], { raw: true });
raws.forEach((entry, idx) => {
  console.log(`key=${['a','b'][idx]}, value=${entry?.value}, expires=${entry?.expires}`);
});
```

## Checking multiple keys with hasMany

The `hasMany` method allows you to efficiently check if multiple keys exist in the cache. It leverages Keyv's native `hasMany` support for optimal performance:

```typescript
import { Cacheable } from 'cacheable';

const cache = new Cacheable();

// set some values
await cache.set('user:1', { name: 'Alice' });
await cache.set('user:2', { name: 'Bob' });

// check if multiple keys exist
const exists = await cache.hasMany(['user:1', 'user:2', 'user:3']);
console.log(exists); // [true, true, false]
```

The `hasMany` method returns an array of booleans in the same order as the input keys. This is particularly useful when you need to verify the existence of multiple cache entries before performing batch operations.

# Iteration on Primary and Secondary Stores

The `Cacheable` class exposes both `primary` and `secondary` as [Keyv](https://keyv.org) instances. Keyv provides an `iterator()` async generator for walking every entry in a store, but **it is only available on stores that support iteration**. When a store does not support it, `keyv.iterator` is `undefined`, so you must feature-check it before calling.

Keyv enables `iterator()` for:

- A plain `new Keyv()` whose store is a `Map` (the Keyv default), and
- The server-backed adapters Keyv recognizes as iterable: `@keyv/redis`, `@keyv/valkey`, `@keyv/mongo`, `@keyv/sqlite`, `@keyv/postgres`, `@keyv/mysql`, and `@keyv/etcd`.

> **Heads up:** Cacheable's *default* primary store is the high-performance in-memory store from [`@cacheable/memory`](https://cacheable.org/docs/memory/) (created with `createKeyv()`). It is neither a raw `Map` nor one of the recognized adapters, so `cache.primary.iterator` is `undefined`. See [Iterating the default in-memory primary](#iterating-the-default-in-memory-primary) for how to walk it.

**Important Notes:**

- Always check that `iterator` exists before using it — it is `undefined` on stores that don't support iteration.
- The iterator filters by namespace, skips expired entries (deleting them), and deserializes values for you.
- **Performance Warning:** Iterating can be expensive on large datasets (for example, `@keyv/redis` uses `SCAN` under the hood). Avoid it on hot paths.

## Iterating a Secondary Store

A secondary store backed by a recognized adapter (Redis, Valkey, Mongo, SQLite, Postgres, MySQL, etcd) supports `iterator()` directly. Each iteration yields a `[key, value]` tuple:

```typescript
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';

const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({ secondary });

await cache.set('user:1', { name: 'Alice', role: 'admin' });
await cache.set('user:2', { name: 'Bob', role: 'user' });

if (cache.secondary?.iterator) {
    for await (const [key, value] of cache.secondary.iterator()) {
        console.log(`${key}:`, value);
    }
}
```

## Iterating the Primary Store

If you need a primary store you can walk with `iterator()`, use a `Map`-backed `new Keyv()` (or any recognized adapter) as the primary. A plain `Keyv` is iterable because its default store is a `Map`:

```typescript
import { Cacheable } from 'cacheable';
import { Keyv } from 'keyv';

const cache = new Cacheable({ primary: new Keyv() });

await cache.set('user:1', { name: 'Alice' });
await cache.set('user:2', { name: 'Bob' });

if (cache.primary.iterator) {
    for await (const [key, value] of cache.primary.iterator()) {
        console.log(`${key}:`, value);
    }
}
```

### Iterating the default in-memory primary

The default primary from `@cacheable/memory` does not provide a Keyv `iterator()`. To walk it, reach the underlying `CacheableMemory` store through `cache.primary.store` and use its `items` iterator. Each item is a `{ key, value, expires }` record (expired entries are skipped automatically), where `value` holds Keyv's stored envelope — the decoded value is at `item.value.value`:

```typescript
import { Cacheable, KeyvCacheableMemory } from 'cacheable';

const cache = new Cacheable();
await cache.set('user:1', { name: 'Alice' });
await cache.set('user:2', { name: 'Bob' });

// cache.primary.store is the KeyvCacheableMemory adapter; its .store is the CacheableMemory
const memory = (cache.primary.store as KeyvCacheableMemory).store;

for (const item of memory.items) {
    // item.value is Keyv's { value, expires } envelope
    console.log(`${item.key}:`, item.value.value);
}
```

If you'd rather not depend on the envelope shape, iterate the keys and read each entry back through the cache:

```typescript
const memory = (cache.primary.store as KeyvCacheableMemory).store;
for (const { key } of memory.items) {
    console.log(`${key}:`, await cache.get(key));
}
```

## Safe Iteration Helper

Here's a recommended helper function for safe iteration that checks for store availability and iterator support:

```typescript
import { Cacheable } from 'cacheable';
import type { Keyv } from 'keyv';

async function iterateStore(store: Keyv | undefined, storeName: string) {
    if (!store) {
        console.log(`${storeName} store not configured`);
        return;
    }

    if (!store.iterator) {
        console.log(`${storeName} store does not support iteration`);
        return;
    }

    console.log(`${storeName} store entries:`);
    for await (const [key, value] of store.iterator()) {
        console.log(`  ${key}:`, value);
    }
}

// Usage
const cache = new Cacheable({ /* options */ });
await iterateStore(cache.primary, 'Primary');
await iterateStore(cache.secondary, 'Secondary');
```

Note that with the default configuration the `Primary` branch above will report that it "does not support iteration" — that is expected, because the default `@cacheable/memory` primary has no `iterator()`. Use the [`CacheableMemory.items`](#iterating-the-default-in-memory-primary) approach for it.

## Storage Adapter Support

Keyv assigns an `iterator()` method only when the store is a raw `Map` or one of the adapters it recognizes as iterable. For every other store, `keyv.iterator` is `undefined`.

Stores that support `iterator()`:

- A plain `new Keyv()` (its store is a `Map`)
- `@keyv/redis` and `@keyv/valkey`
- `@keyv/mongo`, `@keyv/sqlite`, `@keyv/postgres`, `@keyv/mysql`, and `@keyv/etcd`

Stores that do **not** support `iterator()`:

- The default `@cacheable/memory` primary (`createKeyv()`) — walk it through its [`CacheableMemory.items`](#iterating-the-default-in-memory-primary) accessor instead
- Any adapter that doesn't implement Keyv's iterable interface

# Non-Blocking Operations

If you want your layer 2 (secondary) store to be non-blocking you can set the `nonBlocking` property to `true` in the options. This will make the secondary store non-blocking and will not wait for the secondary store to respond on `setting data`, `deleting data`, or `clearing data`. This is useful if you want to have a faster response time and not wait for the secondary store to respond. Here is a full list of what each method does in nonBlocking mode:

* `set` - in non-blocking mode it will set at the `primary` storage and then in the background update `secondary`
* `get` - in non-blocking mode it will only check the primary storage but then in the background look to see if there is a value in the `secondary` and update the primary

* `getMany` - in non-blocking mode it will only check the primary storage but then in the background look to see if there is a value in the `secondary` and update the primary

* `getRaw` - in non-blocking mode it will only check the primary storage but then in the background look to see if there is a value in the `secondary` and update the primary

* `getManyRaw` - in non-blocking mode it will only check the primary storage but then in the background look to see if there is a value in the `secondary` and update the primary

# Non-Blocking with @keyv/redis

`@keyv/redis` is one of the most popular storage adapters used with `cacheable`. It provides a Redis-backed cache store that can be used as a secondary store. It is a bit complicated to setup as by default it causes hangs and blocking with its default configuration. To get past this you will need to configure the following:

Construct your own Redis client via the `createClient()` method from `@keyv/redis` with the following options:
* Set `disableOfflineQueue` to `true`
* Set `socket.reconnectStrategy` to `false`
In the KeyvRedis options:
* Set `throwOnConnectError` to `false`
In the Cacheable options:
* Set `nonBlocking` to `true`

We have also build a function to help with this called `createKeyvNonBlocking` inside the `@keyv/redis` package after version `4.6.0`. Here is an example of how to use it:

```javascript
import { Cacheable } from 'cacheable';
import { createKeyvNonBlocking } from '@keyv/redis';

const secondary = createKeyvNonBlocking('redis://user:pass@localhost:6379');

const cache = new Cacheable({ secondary, nonBlocking: true });
```

# GetOrSet

The `getOrSet` method provides a convenient way to implement the cache-aside pattern. It attempts to retrieve a value
from cache, and if not found, calls the provided function to compute the value and store it in cache before returning
it.

```typescript
import { Cacheable } from 'cacheable';

// Create a new Cacheable instance
const cache = new Cacheable();

// Use getOrSet to fetch user data
async function getUserData(userId: string) {
  return await cache.getOrSet(
    `user:${userId}`,
    async () => {
      // This function only runs if the data isn't in the cache
      console.log('Fetching user from database...');
      // Simulate database fetch
      return { id: userId, name: 'John Doe', email: 'john@example.com' };
    },
    { ttl: '30m' } // Cache for 30 minutes
  );
}

// First call - will fetch from "database"
const user1 = await getUserData('123');
console.log(user1); // { id: '123', name: 'John Doe', email: 'john@example.com' }

// Second call - will retrieve from cache
const user2 = await getUserData('123');
console.log(user2); // Same data, but retrieved from cache
```

```javascript
import { Cacheable } from 'cacheable';
import {KeyvRedis} from '@keyv/redis';

const secondary = new KeyvRedis('redis://user:pass@localhost:6379');
const cache = new Cacheable({secondary, nonBlocking: true});
```

# CacheableSync - Distributed Updates

`cacheable` includes `CacheableSync`, a feature that enables distributed cache synchronization across multiple instances using Pub/Sub messaging via [Qified](https://github.com/jaredwray/qified). When a value is set or deleted in one cache instance, all other connected instances automatically receive and apply the update.

## How It Works

`CacheableSync` uses message providers from Qified to broadcast cache operations (SET and DELETE) to all connected cache instances. Each instance subscribes to these events and automatically updates its `primary` (example: in-memory) storage when receiving updates from other instances.

## Supported Message Providers

`Qified` supports multiple providers and you can learn more by going to https://qified.org.

## Basic Usage

```javascript
import { Cacheable } from 'cacheable';
import { RedisMessageProvider } from '@qified/redis';

// Create a Redis message provider
const provider = new RedisMessageProvider({
  connection: { host: 'localhost', port: 6379 }
});

// Create cache instances with sync enabled
const cache1 = new Cacheable({
  sync: { qified: provider }
});

const cache2 = new Cacheable({
  sync: { qified: provider }
});

// Set a value in cache1
await cache1.set('key', 'value');

// Note: you might want to sleep for a bit based on the backend.

// The value is automatically synced to cache2
const value = await cache2.get('key'); // Returns 'value'
```

## Using Multiple Message Providers

You can use multiple message providers for redundancy:

```javascript
import { Cacheable } from 'cacheable';
import { RedisMessageProvider } from '@qified/redis';
import { NatsMessageProvider } from '@qified/nats';

const redisProvider = new RedisMessageProvider({
  connection: { host: 'localhost', port: 6379 }
});

const natsProvider = new NatsMessageProvider({
  servers: ['nats://localhost:4222']
});

const cache = new Cacheable({
  sync: { qified: [redisProvider, natsProvider] }
});
```

## Using an Existing Qified Instance

You can also pass a pre-configured Qified instance:

```javascript
import { Cacheable } from 'cacheable';
import { Qified } from 'qified';
import { RedisMessageProvider } from '@qified/redis';

const provider = new RedisMessageProvider({
  connection: { host: 'localhost', port: 6379 }
});

const qified = new Qified({ messageProviders: [provider] });

const cache = new Cacheable({
  sync: { qified }
});
```

## Namespace Isolation with Sync

When multiple services share the same Redis instance (or other message provider), you can use namespaces to isolate cache synchronization events between services. This prevents one service's cache updates from affecting another service's cache.

```javascript
import { Cacheable } from 'cacheable';
import { RedisMessageProvider } from '@qified/redis';

const provider = new RedisMessageProvider({
  connection: { host: 'localhost', port: 6379 }
});

// Service 1 with namespace
const serviceA = new Cacheable({
  namespace: 'service-a',
  sync: { qified: provider }
});

// Service 2 with different namespace
const serviceB = new Cacheable({
  namespace: 'service-b',
  sync: { qified: provider }
});

// Set value in service A
await serviceA.set('config', { timeout: 5000 });

// Service B won't receive this update because it has a different namespace
const value = await serviceB.get('config'); // undefined
```

**How Namespace Isolation Works:**
- Without namespaces, sync events use channel names like `cache:set` and `cache:delete`
- With namespaces, events are prefixed: `service-a::cache:set`, `service-b::cache:set`
- Services only subscribe to events matching their namespace, ensuring complete isolation
- Namespaces can be static strings or functions that return strings

**Note:** The namespace is automatically passed from Cacheable to CacheableSync, so you only need to set it once in the Cacheable options.

## How Sync Works

1. **SET Operations**: When you call `cache.set()` or `cache.setMany()`, the cache:
   - Updates the local primary storage and secondary storage
   - Publishes a `cache:set` event with the key, value, ttl, and cacheId
   - Other cache instances receive the event and update their `primary` storage (excluding the originating instance)

2. **DELETE Operations**: When you call `cache.delete()` or `cache.deleteMany()`, the cache:
   - Removes the key from primary and secondary storage
   - Publishes a `cache:delete` event with the key and cacheId
   - Other cache instances receive the event and remove the key from their storage

## Important Notes

* Cache sync only works with the **primary storage layer**. Secondary storage is usually handled by the instance doing the initial work.
* Each cache instance should have a unique `cacheId` to properly filter sync events. This is setup by default but you can set it if you want.
* Sync events are **eventually consistent** - there may be a small delay between when a value is set and when it appears in other instances.
* The sync feature requires a message provider to be running and accessible by all cache instances.
* Each cache instance has a unique `cacheId`. Events are only applied if they come from a different instance, preventing infinite loops.

# Maximum Time to Live (maxTtl)

You can set a `maxTtl` option to enforce an upper bound on any TTL in the cache. When `maxTtl` is set:
- Any per-entry TTL that exceeds `maxTtl` will be capped to `maxTtl`.
- Entries with no TTL (that would otherwise live indefinitely) will be capped to `maxTtl`.
- The default TTL is still respected if it is within the `maxTtl` limit.
- The `maxTtl` is enforced on both primary and secondary stores.
- A TTL set by a [`BEFORE_SET` hook](#overriding-the-ttl-in-a-before_set-hook) is also capped, per store.

This is useful when you want to guarantee that no cache entry lives longer than a certain duration, regardless of what TTL is passed to individual `set()` calls or set by a hook.

```javascript
import { Cacheable } from 'cacheable';

// No entry can live longer than 1 hour
const cache = new Cacheable({ maxTtl: '1h' });

await cache.set('key1', 'value1', '2h'); // capped to 1 hour
await cache.set('key2', 'value2');        // also capped to 1 hour (would otherwise be indefinite)
await cache.set('key3', 'value3', '30m'); // 30 minutes is within maxTtl, so it stays as-is
```

You can also set `maxTtl` after construction:

```javascript
const cache = new Cacheable();
cache.maxTtl = 5000; // 5 seconds max
cache.maxTtl = '10m'; // 10 minutes max
cache.maxTtl = undefined; // disable maxTtl (no upper bound)
```

# Tag Based Invalidation

You can associate cache entries with tags and later invalidate every entry that shares a tag in a single call. This is useful for content caching where one upstream entity (a product, a user, a CMS document) is referenced by many cache entries:

```javascript
import { Cacheable } from 'cacheable';

const cache = new Cacheable({ tags: true });

await cache.set('page:/products', html, { ttl: '10m', tags: ['entity:42', 'collection:products'] });
await cache.set('page:/products/42', detailHtml, { ttl: '10m', tags: ['entity:42'] });

// entity 42 changed - purge everything that referenced it
await cache.tags.invalidateTag('entity:42');

await cache.get('page:/products'); // undefined
await cache.get('page:/products/42'); // undefined
```

You can also pass tags per item with `setMany`, and invalidate several tags at once:

```javascript
await cache.setMany([
  { key: 'user:1', value: userOne, tags: ['users'] },
  { key: 'user:2', value: userTwo, tags: ['users', 'org:7'] },
]);

await cache.tags.invalidateTags(['users', 'org:7']);
```

Tag functionality lives on the `tags` service — an instance of the `CacheTags` class from [`@cacheable/utils`](https://npmjs.com/package/@cacheable/utils) that is created by default in the constructor. Invalidation uses a lazy, constant-time model: `invalidateTag` simply bumps a version counter for the tag, no matter how many entries reference it. Each tagged entry stores a snapshot of its tags' versions, and on the next `get` / `getMany` the snapshot is compared to the live versions. If any tag has been bumped since, the entry is treated as a miss and removed from both the primary and secondary stores (and a `delete` is published via [sync](#cacheablesync---distributed-updates) when enabled). The trade-off is one additional tag-store read per cache lookup while the tag service is enabled.

Tag metadata is stored in the secondary store when one is configured, otherwise in the primary store. With a shared secondary store (such as Redis), an invalidation performed by one instance is seen by every instance:

```javascript
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';

// enable tags on every instance that shares the store - writers and readers
const writer = new Cacheable({ secondary: new KeyvRedis('redis://localhost:6379'), tags: true });
const reader = new Cacheable({ secondary: new KeyvRedis('redis://localhost:6379'), tags: true });

await writer.set('page:/products', html, { tags: ['entity:42'] });
await writer.tags.invalidateTag('entity:42');
await reader.get('page:/products'); // undefined - stale copy is also purged from reader's primary
```

The tag service is disabled by default so untagged workloads pay no extra cost, and you have to turn it on to use it — either with the `tags: true` option or by setting `cache.tags.enabled = true`. While disabled, all tag operations are no-ops: values set with `tags` are stored without tag tracking and invalidations have no effect. The service never enables itself, which keeps behavior predictable across distributed instances — enable it on every instance that shares the store (writers and readers) so invalidations are honored and tag snapshots are cleaned up consistently.

The full `CacheTags` API is available on the service:

```javascript
await cache.tags.getTags('page:/products'); // ['entity:42', 'collection:products']
await cache.tags.getKeysByTag('entity:42'); // keys referencing a tag (debugging / tests)
cache.tags.enabled; // whether freshness checks run on get / getMany
```

# Cacheable Options

The following options are available for you to configure `cacheable`:

* `primary`: The primary store for the cache (layer 1) defaults to in-memory by Keyv.
* `secondary`: The secondary store for the cache (layer 2) usually a persistent cache by Keyv.
* `nonBlocking`: If the secondary store is non-blocking. Default is `false`.
* `stats`: To enable statistics for this instance. Default is `false`.
* `ttl`: The default time to live for the cache in milliseconds. Default is `undefined` which is disabled.
* `maxTtl`: The maximum time to live for any cache entry. When set, TTLs exceeding this value are capped. Enforced on both primary and secondary stores. Default is `undefined` (no maximum).
* `namespace`: The namespace for the cache. Default is `undefined`.
* `cacheId`: A unique identifier for this cache instance. Used for sync filtering. Default is a random string.
* `tags`: Enables the tag service so tag-based invalidation can be used and freshness checks run on `get` / `getMany`. Tags must be explicitly enabled — while disabled, all tag operations are no-ops. Default is `false`.
* `sync`: Enable distributed cache synchronization. Can be:
  - `CacheableSync` instance
  - `CacheableSyncOptions` object with `{ qified: MessageProvider | MessageProvider[] | Qified }`

# Cacheable Statistics (Instance Only)

If you want to enable statistics for your instance you can set the `.stats.enabled` property to `true` in the options. This will enable statistics for your instance and you can get the statistics by calling the `stats` property. Here are the following property statistics:

* `hits`: The number of hits in the cache.
* `misses`: The number of misses in the cache.
* `sets`: The number of sets in the cache.
* `deletes`: The number of deletes in the cache.
* `clears`: The number of clears in the cache.
* `errors`: The number of errors in the cache.
* `count`: The number of keys in the cache.
* `vsize`: The estimated byte size of the values in the cache.
* `ksize`: The estimated byte size of the keys in the cache.

You can clear / reset the stats by calling the `.stats.reset()` method.

_This does not enable statistics for your layer 2 cache as that is a distributed cache_.

# Cacheable - API

* `set(key, value, ttlOrOptions?)`: Sets a value in the cache. The third argument can be a `ttl` or an options object such as `{ ttl: '1h', tags: ['entity:42'] }`.
* `setMany([{key, value, ttl?, tags?}])`: Sets multiple values in the cache.
* `get(key)`: Gets a value from the cache.
* `get(key, { raw: true })`: Gets a raw value from the cache.
* `getMany([keys])`: Gets multiple values from the cache.
* `getMany([keys], { raw: true })`: Gets multiple raw values from the cache.
* `has(key)`: Checks if a value exists in the cache.
* `hasMany([keys])`: Checks if multiple values exist in the cache.
* `take(key)`: Takes a value from the cache and deletes it.
* `takeMany([keys])`: Takes multiple values from the cache and deletes them.
* `delete(key)`: Deletes a value from the cache.
* `deleteMany([keys])`: Deletes multiple values from the cache.
* `clear()`: Clears the cache stores. Be careful with this as it will clear both layer 1 and layer 2.
* `tags`: The `CacheTags` service from `@cacheable/utils` used for tag-based invalidation, such as `tags.invalidateTag(tag)`, `tags.invalidateTags([tags])`, `tags.getTags(key)`, `tags.getKeysByTag(tag)`, and `tags.enabled`.
* `wrap(function, WrapOptions)`: Wraps an `async` function in a cache.
* `getOrSet(GetOrSetKey, valueFunction, GetOrSetFunctionOptions)`: Gets a value from cache or sets it if not found using the provided function.
* `disconnect()`: Disconnects from the cache stores.
* `onHook(hook, callback)`: Sets a hook.
* `removeHook(hook)`: Removes a hook.
* `on(event, callback)`: Listens for an event.
* `removeListener(event, callback)`: Removes a listener.
* `hash(object: any, algorithm = 'SHA-256'): Promise<string>`: Asynchronously hashes an object with a cryptographic algorithm (SHA-256, SHA-384, SHA-512). Default is `SHA-256`.
* `hashSync(object: any, algorithm = 'djb2'): string`: Synchronously hashes an object with a non-cryptographic algorithm (djb2, fnv1, murmer, crc32). Default is `djb2`.
* `getStaticInstance(options?)`: Static. Gets a shared singleton instance, creating it on the first call. Options apply only on first creation; passing options after init emits an `error` event and is otherwise ignored.
* `setStaticInstance(instance?)`: Static. Sets or clears the shared singleton instance. Pass `undefined` to reset it.
* `primary`: The primary store for the cache (layer 1) defaults to in-memory by Keyv.
* `secondary`: The secondary store for the cache (layer 2) usually a persistent cache by Keyv.
* `namespace`: The namespace for the cache. Default is `undefined`. This will set the namespace for the primary and secondary stores.
* `maxTtl`: The maximum time to live for any cache entry. When set, TTLs exceeding this value are capped. Default is `undefined` (no maximum).
* `nonBlocking`: If the secondary store is non-blocking. Default is `false`.
* `stats`: The statistics for this instance which includes `hits`, `misses`, `sets`, `deletes`, `clears`, `errors`, `count`, `vsize`, `ksize`.

# Static Instance (Singleton)

If you want a single cache shared across your application without constructing a `Cacheable` instance and passing it around, use the static `getStaticInstance()` accessor. The first call creates the shared instance; every later call returns that same instance:

```javascript
import { Cacheable } from 'cacheable';

const cache = Cacheable.getStaticInstance({ ttl: '1h' });
await cache.set('key', 'value');

// Anywhere else in your app, the same instance is returned:
const same = Cacheable.getStaticInstance();
```

Options are only applied when the instance is first created. If you pass options again after the instance already exists, they are ignored and an `error` event is emitted on the instance to surface the conflict — listen with `cache.on('error', ...)`. To reconfigure, replace the instance with `setStaticInstance()` (shown below).

You can replace or reset the shared instance with `setStaticInstance()`. Pass a `Cacheable` instance to swap it, or `undefined` to clear it so the next `getStaticInstance()` call creates a fresh one:

```javascript
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';

// Provide a fully configured instance as the shared one
Cacheable.setStaticInstance(new Cacheable({ secondary: new KeyvRedis('redis://localhost:6379') }));

// Reset back to no shared instance
Cacheable.setStaticInstance(undefined);
```

Things to know:

* The shared instance is process-global and long-lived. Calling `clear()` or `disconnect()` on it affects every part of your app that uses it.
* After `disconnect()`, `getStaticInstance()` keeps returning the same (now disconnected) instance — it is not recreated automatically. Call `setStaticInstance(undefined)` first, then `getStaticInstance()` to get a fresh one.
* `setStaticInstance(undefined)` only drops the reference; it does not `disconnect()` or `clear()` the previous instance, so disconnect it first if it holds open connections.
* This package ships separate CommonJS and ESM builds. An app (or dependency graph) that loads both formats gets one shared instance *per build*, not one process-wide. For a single shared cache, use one module format, or create the instance once and share it via `setStaticInstance()`.

# CacheableMemory - In-Memory Cache

`cacheable` comes with a built-in in-memory cache called `CacheableMemory` from `@cacheable/memory`. This is a simple in-memory cache that is used as the primary store for `cacheable`. You can use this as a standalone cache or as a primary store for `cacheable`. Here is an example of how to use `CacheableMemory`:

```javascript
import { CacheableMemory } from 'cacheable';
const options = {
  ttl: '1h', // 1 hour
  useClones: true, // use clones for the values (default is true)
  lruSize: 1000, // the size of the LRU cache (default is 0 which is unlimited)
}
const cache = new CacheableMemory(options);
cache.set('key', 'value');
const value = cache.get('key'); // value
```

To learn more go to [@cacheable/memory](https://cacheable.org/docs/memory/)

# Wrap / Memoization for Sync and Async Functions

`Cacheable` and `CacheableMemory` has a feature called `wrap` that comes from [@cacheable/utils](https://cacheable.org/docs/utils/) and allows you to wrap a function in a cache. This is useful for memoization and caching the results of a function. You can wrap a `sync` or `async` function in a cache. Here is an example of how to use the `wrap` function:

```javascript
import { Cacheable } from 'cacheable';
const asyncFunction = async (value: number) => {
  return Math.random() * value;
};

const cache = new Cacheable();
const options = {
  ttl: '1h', // 1 hour
  keyPrefix: 'p1', // key prefix. This is used if you have multiple functions and need to set a unique prefix.
}
const wrappedFunction = cache.wrap(asyncFunction, options);
console.log(await wrappedFunction(2)); // 4
console.log(await wrappedFunction(2)); // 4 from cache
```
With `Cacheable` we have also included stampede protection so that a `Promise` based call will only be called once if multiple requests of the same are executed at the same time. Here is an example of how to test for stampede protection:
  
```javascript
import { Cacheable } from 'cacheable';
const asyncFunction = async (value: number) => {
  return value;
};

const cache = new Cacheable();
const options = {
  ttl: '1h', // 1 hour
  keyPrefix: 'p1', // key prefix. This is used if you have multiple functions and need to set a unique prefix.
}

const wrappedFunction = cache.wrap(asyncFunction, options);
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

To learn more visit [@cacheable/utils](https://cacheable.org/docs/utils/)

# Get Or Set Memoization Function

The `getOrSet`  method that comes from [@cacheable/utils](https://cacheable.org/docs/utils/) provides a convenient way to implement the cache-aside pattern. It attempts to retrieve a value from cache, and if not found, calls the provided function to compute the value and store it in cache before returning it. Here are the options:

```typescript
export type GetOrSetFunctionOptions = {
	ttl?: number | string | { primary?: number | string; secondary?: number | string };
	cacheErrors?: boolean;
	throwErrors?: boolean;
	nonBlocking?: boolean;
};
```

The `ttl` also accepts a [per-store object](#per-store-ttl-per-operation) such as `{ primary: '10s', secondary: '5m' }` to give the primary and secondary stores different expirations for this operation.

The `nonBlocking` option allows you to override the instance-level `nonBlocking` setting for the `get` call within `getOrSet`. When set to `false`, the `get` will block and wait for a response from the secondary store before deciding whether to call the provided function. When set to `true`, the primary store returns immediately and syncs from secondary in the background.

Here is an example of how to use the `getOrSet` method:

```javascript
import { Cacheable } from 'cacheable';
const cache = new Cacheable();
// Use getOrSet to fetch user data
const function_ = async () => Math.random() * 100;
const value = await cache.getOrSet('randomValue', function_, { ttl: '1h' });
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
const value = await cache.getOrSet(generateKey(), function_, { ttl: '1h' });
```

To learn more go to [@cacheable/utils](https://cacheable.org/docs/utils/)

# v1 to v2 Changes

`cacheable` is now using `@cacheable/utils` and `@cacheable/memory` for its core functionality as we are moving to this modular architecture and plan to eventually have these modules across `cache-manager` and `flat-cache`. In addition there are some breaking changes:

* `get()` and `getMany()` no longer have the `raw` option but instead we have built out `getRaw()` and `getManyRaw()` to use.
* All `get` related functions now support `nonBlocking` which means if `nonBlocking: true` the primary store will return what it has and then in the background will work to sync from secondary storage for any misses. You can disable this by setting at the `get` function level the option `nonBlocking: false` which will look for any missing keys in the secondary.
* `Keyv` v5.5+ is now the recommended supported version as we are using its native `getMany*`, `getRaw*`, and `hasMany` methods for improved performance
* `Wrap` and `getOrSet` have been updated with more robust options including the ability to use your own `serialize` function for creating the key in `wrap`.
* `hash` has been split into async (`hash()` and `hashToNumber()`) and sync (`hashSync()` and `hashToNumberSync()`) methods. MD5 support has been removed. Now uses Hashery library with support for additional algorithms (SHA-384, FNV1, MURMER, CRC32).

# How to Contribute

You can contribute by forking the repo and submitting a pull request. Please make sure to add tests and update the documentation. To learn more about how to contribute go to our main README [https://github.com/jaredwray/cacheable](https://github.com/jaredwray/cacheable). This will talk about how to `Open a Pull Request`, `Ask a Question`, or `Post an Issue`.

# License and Copyright
[MIT © Jared Wray](./LICENSE)
