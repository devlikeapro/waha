const require_drop = require("../../array/drop.js");
const require_toInteger = require("../util/toInteger.js");
const require_toArray = require("../_internal/toArray.js");
const require_isArrayLike = require("../predicate/isArrayLike.js");
//#region src/compat/array/drop.ts
function drop(collection, itemsCount = 1, guard) {
	if (!require_isArrayLike.isArrayLike(collection)) return [];
	itemsCount = guard ? 1 : require_toInteger.toInteger(itemsCount);
	return require_drop.drop(require_toArray.toArray(collection), itemsCount);
}
//#endregion
exports.drop = drop;
