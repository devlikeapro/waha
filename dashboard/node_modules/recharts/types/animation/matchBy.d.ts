import { DataKey } from '../util/types';
/**
 * A tagged union describing the status of an item during animation.
 *
 * - `matched`: item exists in both previous and next data — interpolate between positions
 * - `added`: item is new (no previous position) — animate in
 * - `removed`: item was in previous data but not in next — animate out
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */
export type AnimationItem<T> = {
    readonly status: 'matched';
    readonly prev: T;
    readonly next: T;
} | {
    readonly status: 'added';
    readonly next: T;
} | {
    readonly status: 'removed';
    readonly prev: T;
};
/**
 * A function that extracts a key from an animation item for matching purposes.
 * Items in the previous and next arrays that return the same key are considered
 * the same logical item and will animate between their positions.
 *
 * @param item The chart item (e.g., a bar rectangle, a line point, a pie sector)
 * @param index The index of the item in the array
 * @returns A string or number key, or null if the item cannot be matched
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */
export type AnimationMatchBy<T> = (item: T, index: number) => string | number | null;
/**
 * The union of all accepted `animationMatchBy` prop values:
 * a built-in sentinel string, or a custom matching function.
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */
export type AnimationMatchByProp<T> = typeof matchByIndex | typeof matchAppend | AnimationMatchBy<T>;
/**
 * Match animation items by their array index (the default behavior).
 *
 * Previous items are paired with next items based on their position
 * in the array, with proportional stretching when array lengths differ.
 * When going from 5 to 15 items, each old point "covers" approximately 3 new points;
 * when shrinking, some old points are skipped.
 *
 * @example
 * import { matchByIndex } from 'recharts';
 * <Line animationMatchBy={matchByIndex} />
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */
export declare const matchByIndex: "index";
/**
 * Match animation items sequentially: previous item 0 pairs with next item 0,
 * previous item 1 pairs with next item 1, and so on. When the new array is longer,
 * the extra items have no match and animate in from their default position.
 * When the new array is shorter, the ancient items are simply dropped.
 *
 * This is useful when new data is appended at the end of the array, and you want
 * existing points to stay in place while new points animate in.
 *
 * @example
 * import { matchAppend } from 'recharts';
 * <Line animationMatchBy={matchAppend} />
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */
export declare const matchAppend: "append";
/**
 * Create a matching function that pairs items by a data key from their payload.
 *
 * Useful for time-series or streaming charts where new data points are added
 * to one end and old points are removed from the other. This ensures existing
 * points animate smoothly to their new positions instead of shifting by index.
 *
 * @param dataKey The key to look up in each item's payload (e.g., 'timestamp', 'date', 'id')
 * @returns An AnimationMatchBy function that can be passed to the animationMatchBy prop
 *
 * @example
 * import { matchByDataKey } from 'recharts';
 * <Line animationMatchBy={matchByDataKey('timestamp')} />
 * <Bar animationMatchBy={matchByDataKey('name')} />
 * <Pie animationMatchBy={matchByDataKey('id')} />
 *
 * @since 3.9
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 */
export declare function matchByDataKey(dataKey: DataKey<Record<string, unknown>>): AnimationMatchBy<{
    payload?: unknown;
}>;
/**
 * Match previous items to next items using the given matching strategy and return tagged animation items.
 *
 * On first render, all next items are returned as `{ status: 'added' }`.
 * For key-based matching, unmatched previous items are appended as `{ status: 'removed' }`.
 *
 * @internal
 */
export declare function matchAnimationItems<T>(prevItems: ReadonlyArray<T> | null, nextItems: ReadonlyArray<T> | undefined, matchBy: AnimationMatchByProp<T>): ReadonlyArray<AnimationItem<T>> | null;
