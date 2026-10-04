//#region src/features/column-filtering/filterFns.ts
/**
* Builds a `FilterFn` from a value-level comparator plus optional resolvers.
*
* The `filter` comparator receives the row's data value (already passed
* through `resolveDataValue` when one is defined) and the filter value
* (already passed through `resolveFilterValue` by the table). Keeping
* normalization in the resolvers means a variant of an existing filter
* function only has to swap the resolvers, not re-implement the comparison.
*
* The definition is attached to the returned function, so a variant can be
* created by spreading a built-in filter function and overriding what differs:
*
* ```ts
* const normalize = (value: unknown) =>
*   String(value ?? '')
*     .toLowerCase()
*     .normalize('NFD')
*     .replace(/\p{Diacritic}/gu, '')
*
* const includesStringIgnoreDiacritics = constructFilterFn({
*   ...filterFn_includesString,
*   resolveFilterValue: normalize,
*   resolveDataValue: normalize,
* })
* ```
*
* Note: the table applies `resolveFilterValue` once per filter before any rows
* are tested. When calling a filter function directly (outside of a table),
* apply it yourself: `fn(row, columnId, fn.resolveFilterValue?.(value) ?? value)`.
*/
function constructFilterFn(def) {
	const filterFn = Object.assign((row, columnId, filterValue, addMeta) => {
		const rawValue = row.getValue(columnId);
		const dataValue = filterFn.resolveDataValue ? filterFn.resolveDataValue(rawValue) : rawValue;
		return filterFn.filter(dataValue, filterValue, row, columnId, addMeta);
	}, def);
	return filterFn;
}
/**
* Keeps rows whose column value is strictly equal to the filter value.
*
* Uses JavaScript `===` comparison and auto-removes empty filter values.
*/
const filterFn_equals = constructFilterFn({
	filter: (dataValue, filterValue) => dataValue === filterValue,
	autoRemove: (val) => testFalsy(val)
});
/**
* Keeps rows whose column value is loosely equal to the filter value.
*
* Uses JavaScript `==` comparison and auto-removes empty filter values. This is
* useful for matching string input against numeric row values.
*/
const filterFn_weakEquals = constructFilterFn({
	filter: (dataValue, filterValue) => dataValue == filterValue,
	autoRemove: (val) => testFalsy(val)
});
/**
* Keeps rows whose stringified column value includes the filter text.
*
* Matching is case-sensitive and empty filter values are auto-removed.
*/
const filterFn_includesStringSensitive = constructFilterFn({
	filter: (dataValue, filterValue) => Boolean(dataValue?.includes(filterValue)),
	autoRemove: (val) => testFalsy(val),
	resolveFilterValue: (val) => String(val),
	resolveDataValue: (val) => val == null ? void 0 : String(val)
});
/**
* Keeps rows whose stringified column value includes the filter text.
*
* Both values are lowercased before comparison, and empty filter values are
* auto-removed.
*/
const filterFn_includesString = constructFilterFn({
	filter: (dataValue, filterValue) => Boolean(dataValue?.includes(filterValue)),
	autoRemove: (val) => testFalsy(val),
	resolveFilterValue: (val) => String(val).toLowerCase(),
	resolveDataValue: (val) => val == null ? void 0 : String(val).toLowerCase()
});
/**
* Keeps rows whose stringified column value equals the filter text.
*
* Both values are lowercased before comparison, and empty filter values are
* auto-removed.
*/
const filterFn_equalsString = constructFilterFn({
	filter: (dataValue, filterValue) => dataValue === filterValue,
	autoRemove: (val) => testFalsy(val),
	resolveFilterValue: (val) => String(val).toLowerCase(),
	resolveDataValue: (val) => val == null ? void 0 : String(val).toLowerCase()
});
/**
* Keeps rows whose stringified column value exactly equals the filter text.
*
* Matching is case-sensitive and empty filter values are auto-removed.
*/
const filterFn_equalsStringSensitive = constructFilterFn({
	filter: (dataValue, filterValue) => dataValue === filterValue,
	autoRemove: (val) => testFalsy(val),
	resolveFilterValue: (val) => String(val),
	resolveDataValue: (val) => val == null ? void 0 : String(val)
});
/**
* Keeps rows whose stringified column value starts with the filter text.
*
* Both values are lowercased before comparison, and empty filter values are
* auto-removed.
*/
const filterFn_startsWith = constructFilterFn({
	filter: (dataValue, filterValue) => Boolean(dataValue?.startsWith(filterValue)),
	autoRemove: (val) => testFalsy(val),
	resolveFilterValue: (val) => String(val).toLowerCase(),
	resolveDataValue: (val) => val == null ? void 0 : String(val).toLowerCase()
});
/**
* Keeps rows whose stringified column value ends with the filter text.
*
* Both values are lowercased before comparison, and empty filter values are
* auto-removed.
*/
const filterFn_endsWith = constructFilterFn({
	filter: (dataValue, filterValue) => Boolean(dataValue?.endsWith(filterValue)),
	autoRemove: (val) => testFalsy(val),
	resolveFilterValue: (val) => String(val).toLowerCase(),
	resolveDataValue: (val) => val == null ? void 0 : String(val).toLowerCase()
});
/**
* Keeps rows whose column value is empty.
*
* A value is empty when it is nullish or stringifies to whitespace only. The
* filter value acts as an on/off flag: `false` and blank values are
* auto-removed.
*/
const filterFn_empty = constructFilterFn({
	filter: (dataValue) => testValueEmpty(dataValue),
	autoRemove: (val) => testFalsy(val) || val === false
});
/**
* Keeps rows whose column value is not empty.
*
* A value is empty when it is nullish or stringifies to whitespace only. The
* filter value acts as an on/off flag: `false` and blank values are
* auto-removed.
*/
const filterFn_notEmpty = constructFilterFn({
	filter: (dataValue) => !testValueEmpty(dataValue),
	autoRemove: (val) => testFalsy(val) || val === false
});
/**
* Keeps rows whose value is greater than the filter value.
*
* Numeric values are compared numerically when both sides can be coerced to
* numbers; otherwise normalized strings are compared.
*/
const filterFn_greaterThan = constructFilterFn({
	filter: (dataValue, filterValue) => compareGreaterThan(dataValue, filterValue),
	autoRemove: (val) => testFalsy(val)
});
/**
* Keeps rows whose value is greater than or equal to the filter value.
*
* Delegates to the built-in greater-than and strict-equality comparisons.
*/
const filterFn_greaterThanOrEqualTo = constructFilterFn({
	filter: (dataValue, filterValue) => compareGreaterThanOrEqualTo(dataValue, filterValue),
	autoRemove: (val) => testFalsy(val)
});
/**
* Keeps rows whose value is less than the filter value.
*
* This is implemented as the inverse of greater-than-or-equal comparison.
*/
const filterFn_lessThan = constructFilterFn({
	filter: (dataValue, filterValue) => !compareGreaterThanOrEqualTo(dataValue, filterValue),
	autoRemove: (val) => testFalsy(val)
});
/**
* Keeps rows whose value is less than or equal to the filter value.
*
* This is implemented as the inverse of greater-than comparison.
*/
const filterFn_lessThanOrEqualTo = constructFilterFn({
	filter: (dataValue, filterValue) => !compareGreaterThan(dataValue, filterValue),
	autoRemove: (val) => testFalsy(val)
});
/**
* Keeps rows whose value falls between an exclusive min/max pair.
*
* Blank range endpoints are treated as open-ended.
*/
const filterFn_between = constructFilterFn({
	filter: (dataValue, filterValues) => compareBetween(dataValue, filterValues, false),
	autoRemove: (val) => testFalsy(val) || Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])
});
/**
* Keeps rows whose value falls between an inclusive min/max pair.
*
* Blank range endpoints are treated as open-ended.
*/
const filterFn_betweenInclusive = constructFilterFn({
	filter: (dataValue, filterValues) => compareBetween(dataValue, filterValues, true),
	autoRemove: (val) => testFalsy(val) || Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])
});
/**
* Keeps rows whose numeric value is inside an inclusive `[min, max]` range.
*
* Filter values are normalized so blank endpoints become open-ended and
* reversed endpoints are swapped. Only real numbers can fall inside the
* range: non-numeric row values (`null`, `undefined`, strings, booleans)
* never match.
*/
const filterFn_inNumberRange = constructFilterFn({
	filter: (dataValue, filterValue) => {
		if (typeof dataValue !== "number" || Number.isNaN(dataValue)) return false;
		const [min, max] = filterValue;
		return dataValue >= min && dataValue <= max;
	},
	resolveFilterValue: (val) => {
		const [unsafeMin, unsafeMax] = val;
		const parsedMin = typeof unsafeMin !== "number" ? parseFloat(unsafeMin) : unsafeMin;
		const parsedMax = typeof unsafeMax !== "number" ? parseFloat(unsafeMax) : unsafeMax;
		let min = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
		let max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;
		if (min > max) {
			const temp = min;
			min = max;
			max = temp;
		}
		return [min, max];
	},
	autoRemove: (val) => testFalsy(val) || Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])
});
/**
* Keeps rows whose date value is inside an inclusive `[min, max]` date range.
*
* Row values and range endpoints may be `Date` objects, timestamps, or
* parseable date strings. Blank or invalid endpoints become open-ended and
* reversed endpoints are swapped. Rows without a valid date never match.
*/
const filterFn_inDateRange = constructFilterFn({
	filter: (dataValue, filterValue) => {
		const [min, max] = filterValue;
		return dataValue >= min && dataValue <= max;
	},
	resolveFilterValue: (val) => {
		const [unsafeMin, unsafeMax] = val;
		const parsedMin = toDateTimestamp(unsafeMin);
		const parsedMax = toDateTimestamp(unsafeMax);
		let min = Number.isNaN(parsedMin) ? -Infinity : parsedMin;
		let max = Number.isNaN(parsedMax) ? Infinity : parsedMax;
		if (min > max) {
			const temp = min;
			min = max;
			max = temp;
		}
		return [min, max];
	},
	resolveDataValue: (val) => toDateTimestamp(val),
	autoRemove: (val) => testFalsy(val) || Array.isArray(val) && testFalsy(val[0]) && testFalsy(val[1])
});
/**
* Keeps rows whose scalar column value equals at least one filter value.
*/
const filterFn_arrHas = constructFilterFn({
	filter: (dataValue, filterValue) => {
		for (let i = 0; i < filterValue.length; i++) if (dataValue === filterValue[i]) return true;
		return false;
	},
	autoRemove: (val) => testFalsy(val) || !val?.length
});
/**
* Keeps rows whose array or string column value includes at least one filter value.
*/
const filterFn_arrIncludes = constructFilterFn({
	filter: (dataValue, filterValue) => {
		if (typeof dataValue !== "string" && !Array.isArray(dataValue)) return false;
		for (let i = 0; i < filterValue.length; i++) if (dataValue.includes(filterValue[i])) return true;
		return false;
	},
	autoRemove: (val) => testFalsy(val) || !val?.length
});
/**
* Keeps rows whose array column value includes every filter value.
*/
const filterFn_arrIncludesAll = constructFilterFn({
	filter: (dataValue, filterValue) => {
		if (!Array.isArray(dataValue)) return false;
		for (let i = 0; i < filterValue.length; i++) if (!dataValue.includes(filterValue[i])) return false;
		return true;
	},
	autoRemove: (val) => testFalsy(val) || !val?.length
});
/**
* Keeps rows whose array column value includes at least one filter value.
*/
const filterFn_arrIncludesSome = constructFilterFn({
	filter: (dataValue, filterValue) => {
		if (!Array.isArray(dataValue)) return false;
		for (let i = 0; i < filterValue.length; i++) if (dataValue.includes(filterValue[i])) return true;
		return false;
	},
	autoRemove: (val) => testFalsy(val) || !val?.length
});
/**
* The built-in filter function registry.
*
* Registering this full object opts out of tree-shaking: every built-in
* filter function ends up in your bundle. Prefer importing the `filterFn_*`
* functions you actually use and registering just those in the `filterFns`
* slot, or passing them directly to the `filterFn` column option.
*
* @deprecated Import individual `filterFn_*` functions instead for a smaller
* bundle. This export still works and is not going away in v9, but built-in
* name resolution (including `filterFn: 'auto'`) only finds functions you
* register yourself.
*/
const filterFns = {
	arrIncludes: filterFn_arrIncludes,
	arrIncludesAll: filterFn_arrIncludesAll,
	arrHas: filterFn_arrHas,
	arrIncludesSome: filterFn_arrIncludesSome,
	between: filterFn_between,
	betweenInclusive: filterFn_betweenInclusive,
	empty: filterFn_empty,
	endsWith: filterFn_endsWith,
	equals: filterFn_equals,
	equalsString: filterFn_equalsString,
	equalsStringSensitive: filterFn_equalsStringSensitive,
	inDateRange: filterFn_inDateRange,
	inNumberRange: filterFn_inNumberRange,
	includesString: filterFn_includesString,
	includesStringSensitive: filterFn_includesStringSensitive,
	notEmpty: filterFn_notEmpty,
	startsWith: filterFn_startsWith,
	weakEquals: filterFn_weakEquals
};
function testFalsy(val) {
	return val === void 0 || val === null || val === "";
}
function testValueEmpty(dataValue) {
	return dataValue == null || String(dataValue).trim() === "";
}
function toDateTimestamp(value) {
	if (value instanceof Date) return value.getTime();
	if (typeof value === "number") return value;
	if (value == null || value === "") return NaN;
	return new Date(value).getTime();
}
function compareGreaterThan(dataValue, filterValue) {
	const numericDataValue = dataValue == null ? 0 : +dataValue;
	const numericFilterValue = Number(filterValue);
	if (!isNaN(numericFilterValue) && !isNaN(numericDataValue)) return numericDataValue > numericFilterValue;
	return String(dataValue ?? "").toLowerCase().trim() > String(filterValue).toLowerCase().trim();
}
function compareGreaterThanOrEqualTo(dataValue, filterValue) {
	return dataValue === filterValue || compareGreaterThan(dataValue, filterValue);
}
function compareBetween(dataValue, filterValues, inclusive) {
	const min = filterValues[0];
	const hasMin = min !== "" && min !== void 0;
	if (hasMin) {
		if (!(inclusive ? compareGreaterThanOrEqualTo(dataValue, min) : compareGreaterThan(dataValue, min))) return false;
	}
	const max = filterValues[1];
	if (max === "" || max === void 0) return true;
	if (hasMin) {
		const numericMin = Number(min);
		const numericMax = Number(max);
		if (!isNaN(numericMin) && !isNaN(numericMax) && numericMin > numericMax) return true;
	}
	return inclusive ? !compareGreaterThan(dataValue, max) : !compareGreaterThanOrEqualTo(dataValue, max);
}

//#endregion
export { constructFilterFn, filterFn_arrHas, filterFn_arrIncludes, filterFn_arrIncludesAll, filterFn_arrIncludesSome, filterFn_between, filterFn_betweenInclusive, filterFn_empty, filterFn_endsWith, filterFn_equals, filterFn_equalsString, filterFn_equalsStringSensitive, filterFn_greaterThan, filterFn_greaterThanOrEqualTo, filterFn_inDateRange, filterFn_inNumberRange, filterFn_includesString, filterFn_includesStringSensitive, filterFn_lessThan, filterFn_lessThanOrEqualTo, filterFn_notEmpty, filterFn_startsWith, filterFn_weakEquals, filterFns };