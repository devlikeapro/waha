import { drop as drop$1 } from "../../array/drop.mjs";
import { toInteger } from "../util/toInteger.mjs";
import { toArray } from "../_internal/toArray.mjs";
import { isArrayLike } from "../predicate/isArrayLike.mjs";
//#region src/compat/array/drop.ts
function drop(collection, itemsCount = 1, guard) {
	if (!isArrayLike(collection)) return [];
	itemsCount = guard ? 1 : toInteger(itemsCount);
	return drop$1(toArray(collection), itemsCount);
}
//#endregion
export { drop };
