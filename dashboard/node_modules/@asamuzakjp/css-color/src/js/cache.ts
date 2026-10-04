/**
 * cache
 */

import { LRUCache } from 'lru-cache';
import { Options } from './typedef';

/* constants */
const CACHE_SIZE = 4096;

/**
 * CacheItem
 */
export class CacheItem {
  /* private */
  #item: unknown;

  constructor(item: unknown) {
    this.#item = item;
  }

  get item() {
    return this.#item;
  }
}

/*
 * lru cache instance
 */
export const lruCache = new LRUCache<string, CacheItem>({
  max: CACHE_SIZE
});

/**
 * set cache
 * @param key - cache key
 * @param value - value to cache
 * @returns void
 */
export const setCache = (key: string, value: unknown): void => {
  if (!key) {
    return;
  }
  if (value instanceof CacheItem) {
    lruCache.set(key, value);
  } else {
    lruCache.set(key, new CacheItem(value));
  }
};

/**
 * get cache
 * @param key - cache key
 * @returns cached item or false otherwise
 */
export const getCache = (key: string): CacheItem | false => {
  if (!key) {
    return false;
  }
  const item = lruCache.get(key);
  if (item !== undefined) {
    return item as CacheItem;
  }
  return false;
};

/**
 * helper function to sort object keys alphabetically
 * @param obj - Object
 * @returns stringified JSON
 */
const stringifySorted = (obj: Record<string, unknown>): string => {
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return '';
  }
  keys.sort();
  let result = '';
  for (const key of keys) {
    result += `${key}:${JSON.stringify(obj[key])};`;
  }
  return result;
};

/**
 * create cache key
 * @param keyData - key data
 * @param [opt] - options
 * @returns cache key
 */
export const createCacheKey = (
  keyData: Record<string, string>,
  opt: Options = {}
): string => {
  if (
    !keyData ||
    (opt.customProperty && typeof opt.customProperty.callback === 'function') ||
    (opt.dimension && typeof opt.dimension.callback === 'function')
  ) {
    return '';
  }
  const namespace = keyData.namespace || '';
  const name = keyData.name || '';
  const value = keyData.value || '';
  if (!namespace && !name && !value) {
    return '';
  }
  const baseKey = `${namespace}:${name}:${value}`;
  const optStr = `${opt.format || ''}|${opt.colorSpace || ''}|${opt.colorScheme || ''}|${opt.currentColor || ''}|${opt.d50 ? '1' : '0'}|${opt.nullable ? '1' : '0'}|${opt.preserveComment ? '1' : '0'}|${opt.delimiter || ''}`;
  const customPropStr = opt.customProperty
    ? stringifySorted(opt.customProperty as Record<string, unknown>)
    : '';
  const dimStr = opt.dimension
    ? stringifySorted(opt.dimension as Record<string, unknown>)
    : '';
  return `${baseKey}::${optStr}::${customPropStr}::${dimStr}`;
};
