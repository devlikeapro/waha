/**
 * Checks if two arrays are equal, treating empty arrays as equal regardless of reference.
 * If both arrays are non-empty, it checks for reference equality.
 * @param a
 * @param b
 */
export declare function emptyArraysAreEqualCheck<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): boolean;
/**
 * Checks if two arrays have the same contents in the same order.
 * @param a
 * @param b
 */
export declare function arrayContentsAreEqualCheck<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): boolean;
