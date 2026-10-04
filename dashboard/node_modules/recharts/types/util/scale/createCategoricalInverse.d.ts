import { InverseScaleFunction } from '../../hooks';
import { CustomScaleDefinition } from './CustomScaleDefinition';
/**
 * Binary search to find the index where x would fit in array a.
 * Works for arrays that are sorted both ascending and descending.
 *
 * Unlike d3.bisect, this implementation handles both ascending and descending arrays.
 *
 * @param haystack Sorted array of numbers
 * @param needle Number to find the insertion index for
 * @returns Index where x would fit in array a
 */
export declare function bisect(haystack: ReadonlyArray<number>, needle: number): number;
/**
 * Computes an inverse scale function for categorical/ordinal scales.
 * Uses bisect to find the closest domain value for a given pixel coordinate.
 */
export declare function createCategoricalInverse(scale: CustomScaleDefinition | undefined, allDataPointsOnAxis?: ReadonlyArray<unknown>): InverseScaleFunction | undefined;
