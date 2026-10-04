import { difference } from "../../array/difference.mjs";
import { differenceBy as differenceBy$1 } from "../../array/differenceBy.mjs";
import { iteratee } from "../util/iteratee.mjs";
import { isArrayLikeObject } from "../predicate/isArrayLikeObject.mjs";
import { last } from "./last.mjs";
import { flattenArrayLike } from "../_internal/flattenArrayLike.mjs";
//#region src/compat/array/differenceBy.ts
/**
* Computes the difference between an array and multiple arrays using an iteratee function.
*
* @template T
* @param arr - The primary array from which to derive the difference.
* @param values - Multiple arrays containing elements to be excluded from the primary array.
* @returns A new array containing the elements that are present in the primary array but not in the values arrays.
*/
function differenceBy(arr, ..._values) {
	if (!isArrayLikeObject(arr)) return [];
	const iteratee$1 = last(_values);
	const values = flattenArrayLike(_values);
	if (isArrayLikeObject(iteratee$1)) return difference(Array.from(arr), values);
	return differenceBy$1(Array.from(arr), values, iteratee(iteratee$1));
}
//#endregion
export { differenceBy };
