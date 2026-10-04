import { constructAggregationFn } from "./rowAggregationFeature.types.js";

//#region src/features/row-aggregation/aggregationFns.ts
function isNumber(value) {
	return typeof value === "number";
}
function isValidDate(value) {
	return value instanceof Date && !Number.isNaN(value.getTime());
}
function getRangeKind(value) {
	if (isNumber(value)) return "number";
	if (isValidDate(value)) return "date";
}
function compareRangeValues(left, right) {
	return (left instanceof Date ? left.getTime() : left) - (right instanceof Date ? right.getTime() : right);
}
/** Comparable representation of a range value; `Date`s compare by time. */
function toRangeNumber(value) {
	return value instanceof Date ? value.getTime() : value;
}
/**
* Sums numeric selected-row values. Non-number values contribute zero. As in
* the previous API, `NaN` is a number and therefore propagates through the sum.
*/
const aggregationFn_sum = constructAggregationFn({
	aggregate: (context) => {
		const rows = context.rows;
		let sum = 0;
		for (let i = 0; i < rows.length; i++) {
			const value = context.getValue(rows[i]);
			sum += typeof value === "number" ? value : 0;
		}
		return sum;
	},
	merge: ({ subRowResults }) => {
		let sum = 0;
		for (let i = 0; i < subRowResults.length; i++) {
			const value = subRowResults[i];
			if (isNumber(value)) sum += value;
		}
		return sum;
	}
});
/**
* Finds the minimum numeric or Date value from the selected rows. Invalid value
* types are ignored; `NaN` preserves the legacy numeric seeding behavior.
*/
const aggregationFn_min = constructAggregationFn({
	aggregate: (context) => {
		const rows = context.rows;
		let kind;
		let result;
		let resultNumber = 0;
		for (let i = 0; i < rows.length; i++) {
			const value = context.getValue(rows[i]);
			const valueKind = getRangeKind(value);
			if (!valueKind || kind !== void 0 && valueKind !== kind) continue;
			const valueNumber = toRangeNumber(value);
			if (kind === void 0) {
				kind = valueKind;
				result = value;
				resultNumber = valueNumber;
			} else if (valueNumber - resultNumber < 0) {
				result = value;
				resultNumber = valueNumber;
			}
		}
		return result;
	},
	merge: ({ subRowResults }) => {
		let result;
		let kind;
		for (let i = 0; i < subRowResults.length; i++) {
			const value = subRowResults[i];
			const valueKind = getRangeKind(value);
			if (!valueKind) continue;
			if (value === void 0) continue;
			kind ??= valueKind;
			if (kind !== valueKind) continue;
			if (result === void 0 || compareRangeValues(value, result) < 0) result = value;
		}
		return result;
	}
});
/**
* Finds the maximum numeric or Date value from the selected rows. Invalid value
* types are ignored; `NaN` preserves the legacy numeric seeding behavior.
*/
const aggregationFn_max = constructAggregationFn({
	aggregate: (context) => {
		const rows = context.rows;
		let kind;
		let result;
		let resultNumber = 0;
		for (let i = 0; i < rows.length; i++) {
			const value = context.getValue(rows[i]);
			const valueKind = getRangeKind(value);
			if (!valueKind || kind !== void 0 && valueKind !== kind) continue;
			const valueNumber = toRangeNumber(value);
			if (kind === void 0) {
				kind = valueKind;
				result = value;
				resultNumber = valueNumber;
			} else if (valueNumber - resultNumber > 0) {
				result = value;
				resultNumber = valueNumber;
			}
		}
		return result;
	},
	merge: ({ subRowResults }) => {
		let result;
		let kind;
		for (let i = 0; i < subRowResults.length; i++) {
			const value = subRowResults[i];
			const valueKind = getRangeKind(value);
			if (!valueKind) continue;
			if (value === void 0) continue;
			kind ??= valueKind;
			if (kind !== valueKind) continue;
			if (result === void 0 || compareRangeValues(value, result) > 0) result = value;
		}
		return result;
	}
});
/**
* Finds the minimum and maximum numeric or Date values from the selected rows.
* Empty inputs return
* `[undefined, undefined]`, preserving the previous built-in result shape.
*/
const aggregationFn_extent = constructAggregationFn({
	aggregate: (context) => {
		const rows = context.rows;
		let kind;
		let min;
		let max;
		let minNumber = 0;
		let maxNumber = 0;
		for (let i = 0; i < rows.length; i++) {
			const value = context.getValue(rows[i]);
			const valueKind = getRangeKind(value);
			if (!valueKind || kind !== void 0 && valueKind !== kind) continue;
			const valueNumber = toRangeNumber(value);
			if (kind === void 0) {
				kind = valueKind;
				min = max = value;
				minNumber = maxNumber = valueNumber;
			} else {
				if (valueNumber - minNumber < 0) {
					min = value;
					minNumber = valueNumber;
				}
				if (valueNumber - maxNumber > 0) {
					max = value;
					maxNumber = valueNumber;
				}
			}
		}
		if (kind === void 0) return [void 0, void 0];
		return [min, max];
	},
	merge: ({ subRowResults }) => {
		let result = [void 0, void 0];
		let kind;
		for (let i = 0; i < subRowResults.length; i++) {
			const extent = subRowResults[i];
			const min = extent[0];
			const max = extent[1];
			const valueKind = getRangeKind(min);
			if (!valueKind || min === void 0 || max === void 0) continue;
			kind ??= valueKind;
			if (kind !== valueKind) continue;
			if (result[0] === void 0) result = [min, max];
			else {
				if (compareRangeValues(min, result[0]) < 0) result[0] = min;
				const currentMax = result[1];
				if (currentMax === void 0 || compareRangeValues(max, currentMax) > 0) result[1] = max;
			}
		}
		return result;
	}
});
/**
* Averages number and number-like row values. Nullish and non-numeric values
* are ignored; other values retain the legacy unary-plus coercion behavior.
*/
const aggregationFn_mean = constructAggregationFn({ aggregate: (context) => {
	const rows = context.rows;
	let count = 0;
	let sum = 0;
	for (let i = 0; i < rows.length; i++) {
		const value = context.getValue(rows[i]);
		if (value == null) continue;
		const numberValue = typeof value === "number" ? value : +value;
		if (!Number.isNaN(numberValue)) {
			count++;
			sum += numberValue;
		}
	}
	return count ? sum / count : void 0;
} });
/**
* Computes the median of the numeric row values. Non-numeric values are
* ignored, matching the `sum`/`min`/`max`/`mean` aggregations. Returns
* `undefined` when no numeric values remain.
*/
const aggregationFn_median = constructAggregationFn({ aggregate: (context) => {
	const rows = context.rows;
	const values = [];
	for (let i = 0; i < rows.length; i++) {
		const value = context.getValue(rows[i]);
		if (typeof value === "number") values.push(value);
	}
	if (!values.length) return void 0;
	values.sort((a, b) => a - b);
	const mid = Math.floor(values.length / 2);
	return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
} });
/** Collects distinct row values using JavaScript `Set` semantics. */
const aggregationFn_unique = constructAggregationFn({ aggregate: (context) => {
	const rows = context.rows;
	const values = /* @__PURE__ */ new Set();
	for (let i = 0; i < rows.length; i++) values.add(context.getValue(rows[i]));
	return Array.from(values);
} });
/** Counts distinct row values using JavaScript `Set` semantics. */
const aggregationFn_uniqueCount = constructAggregationFn({ aggregate: (context) => {
	const rows = context.rows;
	const values = /* @__PURE__ */ new Set();
	for (let i = 0; i < rows.length; i++) values.add(context.getValue(rows[i]));
	return values.size;
} });
/** Counts rows, independently of the column's values. */
const aggregationFn_count = constructAggregationFn({
	aggregate: ({ rows }) => rows.length,
	merge: ({ subRowResults }) => {
		let count = 0;
		for (let i = 0; i < subRowResults.length; i++) {
			const value = subRowResults[i];
			if (isNumber(value)) count += value;
		}
		return count;
	}
});
/** Returns the first row's value, including a nullish value. */
const aggregationFn_first = constructAggregationFn({
	aggregate: (context) => context.rows[0] ? context.getValue(context.rows[0]) : void 0,
	merge: ({ subRowResults }) => subRowResults[0]
});
/** Returns the last row's value, including a nullish value. */
const aggregationFn_last = constructAggregationFn({
	aggregate: (context) => {
		const row = context.rows[context.rows.length - 1];
		return row ? context.getValue(row) : void 0;
	},
	merge: ({ subRowResults }) => subRowResults[subRowResults.length - 1]
});
/**
* Full built-in registry. Register individual definitions for tree-shaking.
*
* @deprecated Import individual `aggregationFn_*` definitions instead for a
* smaller bundle. This registry remains available for compatibility.
*/
const aggregationFns = {
	sum: aggregationFn_sum,
	min: aggregationFn_min,
	max: aggregationFn_max,
	extent: aggregationFn_extent,
	mean: aggregationFn_mean,
	median: aggregationFn_median,
	unique: aggregationFn_unique,
	uniqueCount: aggregationFn_uniqueCount,
	count: aggregationFn_count,
	first: aggregationFn_first,
	last: aggregationFn_last
};

//#endregion
export { aggregationFn_count, aggregationFn_extent, aggregationFn_first, aggregationFn_last, aggregationFn_max, aggregationFn_mean, aggregationFn_median, aggregationFn_min, aggregationFn_sum, aggregationFn_unique, aggregationFn_uniqueCount, aggregationFns };