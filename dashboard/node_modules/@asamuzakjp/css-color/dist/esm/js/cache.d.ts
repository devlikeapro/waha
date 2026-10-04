/**
 * cache
 */
import { LRUCache } from 'lru-cache';
import { Options } from './typedef';
/**
 * CacheItem
 */
export declare class CacheItem {
    #private;
    constructor(item: unknown);
    get item(): unknown;
}
export declare const lruCache: LRUCache<string, CacheItem, unknown>;
/**
 * set cache
 * @param key - cache key
 * @param value - value to cache
 * @returns void
 */
export declare const setCache: (key: string, value: unknown) => void;
/**
 * get cache
 * @param key - cache key
 * @returns cached item or false otherwise
 */
export declare const getCache: (key: string) => CacheItem | false;
/**
 * create cache key
 * @param keyData - key data
 * @param [opt] - options
 * @returns cache key
 */
export declare const createCacheKey: (keyData: Record<string, string>, opt?: Options) => string;
