/**
 * So usually React would compare only the first level of props using Object.is.
 * However, in our case many props are objects or arrays, and our own docs recommend to do that!
 * Therefore, we need a custom comparison function that does a shallow comparison of each prop value.
 *
 * Because charts can and do receive large props (typically the data array),
 * we only limit this to a subset of known props that are likely to be objects/arrays.
 *
 * @param prevProps
 * @param nextProps
 */
export declare function propsAreEqual<T extends Record<string, unknown>>(prevProps: T, nextProps: T): boolean;
