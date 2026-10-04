/**
 * Simple LRU (Least Recently Used) cache implementation
 */
export declare class LRUCache<K, V> {
    private cache;
    private maxSize;
    constructor(maxSize: number);
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    clear(): void;
    size(): number;
}
