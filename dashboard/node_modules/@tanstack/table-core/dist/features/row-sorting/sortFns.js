//#region src/features/row-sorting/sortFns.ts
/**
* Regular expression used to split mixed text and numeric chunks.
*
* The alphanumeric sort functions use these chunks for natural sorting of
* strings like `item2` before `item10`.
*/
const reSplitAlphaNumeric = /([0-9]+)/gm;
/**
* Builds a `SortFn` from a value-level comparator plus an optional
* `resolveDataValue` normalizer.
*
* The `sort` comparator receives both rows' data values, each already passed
* through `resolveDataValue` when one is defined. Keeping normalization in the
* resolver means a variant of an existing sorting function only has to swap
* the resolver, not re-implement the comparison.
*
* The definition is attached to the returned function, so a variant can be
* created by spreading a built-in sorting function and overriding what
* differs:
*
* ```ts
* const stripDiacritics = (value: string) =>
*   value.normalize('NFD').replace(/\p{Diacritic}/gu, '')
*
* const alphanumericIgnoreDiacritics = constructSortFn({
*   ...sortFn_alphanumeric,
*   resolveDataValue: (value) =>
*     stripDiacritics(sortFn_alphanumeric.resolveDataValue!(value)),
* })
* ```
*/
function constructSortFn(def) {
	const sortFn = Object.assign((rowA, rowB, columnId) => {
		let dataValueA = rowA.getValue(columnId);
		let dataValueB = rowB.getValue(columnId);
		const resolveDataValue = sortFn.resolveDataValue;
		if (resolveDataValue) {
			dataValueA = resolveDataValue(dataValueA);
			dataValueB = resolveDataValue(dataValueB);
		}
		return sortFn.sort(dataValueA, dataValueB, rowA, rowB, columnId);
	}, def);
	return sortFn;
}
/**
* Sorts rows with the built-in alphanumeric strategy.
*
* This comparator returns ascending-order results; descending order is applied by the sorting row model.
*/
const sortFn_alphanumeric = constructSortFn({
	resolveDataValue: (dataValue) => toString(dataValue).toLowerCase(),
	sort: (dataValueA, dataValueB) => compareAlphanumeric(dataValueA, dataValueB)
});
/**
* Sorts rows with the built-in alphanumeric case sensitive strategy.
*
* This comparator returns ascending-order results; descending order is applied by the sorting row model.
*/
const sortFn_alphanumericCaseSensitive = constructSortFn({
	resolveDataValue: (dataValue) => toString(dataValue),
	sort: (dataValueA, dataValueB) => compareAlphanumeric(dataValueA, dataValueB)
});
/**
* Sorts rows with the built-in text strategy.
*
* This comparator returns ascending-order results; descending order is applied by the sorting row model.
*/
const sortFn_text = constructSortFn({
	resolveDataValue: (dataValue) => toString(dataValue).toLowerCase(),
	sort: (dataValueA, dataValueB) => compareBasic(dataValueA, dataValueB)
});
/**
* Sorts rows with the built-in text case sensitive strategy.
*
* This comparator returns ascending-order results; descending order is applied by the sorting row model.
*/
const sortFn_textCaseSensitive = constructSortFn({
	resolveDataValue: (dataValue) => toString(dataValue),
	sort: (dataValueA, dataValueB) => compareBasic(dataValueA, dataValueB)
});
/**
* Sorts rows with the built-in datetime strategy.
*
* This comparator returns ascending-order results; descending order is applied by the sorting row model.
*/
const sortFn_datetime = constructSortFn({
	resolveDataValue: (dataValue) => toDateSortValue(dataValue),
	sort: (dataValueA, dataValueB) => dataValueA > dataValueB ? 1 : dataValueA < dataValueB ? -1 : 0
});
/**
* Sorts rows with the built-in basic strategy.
*
* This comparator returns ascending-order results; descending order is applied by the sorting row model.
*/
const sortFn_basic = constructSortFn({ sort: (dataValueA, dataValueB) => compareBasic(dataValueA, dataValueB) });
function compareBasic(a, b) {
	return a === b ? 0 : a > b ? 1 : -1;
}
function toDateSortValue(value) {
	return value instanceof Date ? value.getTime() : value;
}
function toString(a) {
	if (typeof a === "number") {
		if (isNaN(a) || a === Infinity || a === -Infinity) return "";
		return String(a);
	}
	if (typeof a === "string") return a;
	return "";
}
function compareAlphanumeric(aStr, bStr) {
	let ai = 0;
	let bi = 0;
	const aLen = aStr.length;
	const bLen = bStr.length;
	while (ai < aLen && bi < bLen) {
		const aIsNumeric = isDigit(aStr.charCodeAt(ai));
		const bIsNumeric = isDigit(bStr.charCodeAt(bi));
		const aEnd = findChunkEnd(aStr, ai, aIsNumeric);
		const bEnd = findChunkEnd(bStr, bi, bIsNumeric);
		if (!aIsNumeric && !bIsNumeric) {
			const stringComparison = compareStringChunks(aStr, ai, aEnd, bStr, bi, bEnd);
			if (stringComparison) return stringComparison;
			ai = aEnd;
			bi = bEnd;
			continue;
		}
		if (aIsNumeric !== bIsNumeric) return aIsNumeric ? 1 : -1;
		const numericComparison = compareNumericChunks(aStr, ai, aEnd, bStr, bi, bEnd);
		if (numericComparison) return numericComparison;
		ai = aEnd;
		bi = bEnd;
	}
	return countRemainingChunks(aStr, ai) - countRemainingChunks(bStr, bi);
}
function isDigit(charCode) {
	return charCode >= 48 && charCode <= 57;
}
function findChunkEnd(str, start, isNumeric) {
	let end = start + 1;
	while (end < str.length && isDigit(str.charCodeAt(end)) === isNumeric) end++;
	return end;
}
function compareStringChunks(aStr, aStart, aEnd, bStr, bStart, bEnd) {
	const aLength = aEnd - aStart;
	const bLength = bEnd - bStart;
	const minLength = aLength < bLength ? aLength : bLength;
	for (let i = 0; i < minLength; i++) {
		const aCode = aStr.charCodeAt(aStart + i);
		const bCode = bStr.charCodeAt(bStart + i);
		if (aCode > bCode) return 1;
		if (bCode > aCode) return -1;
	}
	if (aLength > bLength) return 1;
	if (bLength > aLength) return -1;
	return 0;
}
function compareNumericChunks(aStr, aStart, aEnd, bStr, bStart, bEnd) {
	let aSignificantStart = aStart;
	while (aSignificantStart < aEnd && aStr.charCodeAt(aSignificantStart) === 48) aSignificantStart++;
	let bSignificantStart = bStart;
	while (bSignificantStart < bEnd && bStr.charCodeAt(bSignificantStart) === 48) bSignificantStart++;
	const aSignificantLength = aEnd - aSignificantStart;
	const bSignificantLength = bEnd - bSignificantStart;
	if (aSignificantLength === 0 && bSignificantLength === 0) return 0;
	if (aSignificantLength <= 15 && bSignificantLength <= 15) {
		const an = parseSmallInt(aStr, aSignificantStart, aEnd);
		const bn = parseSmallInt(bStr, bSignificantStart, bEnd);
		if (an > bn) return 1;
		if (bn > an) return -1;
		return 0;
	}
	const an = parseInt(aStr.slice(aStart, aEnd), 10);
	const bn = parseInt(bStr.slice(bStart, bEnd), 10);
	if (an > bn) return 1;
	if (bn > an) return -1;
	return 0;
}
function parseSmallInt(str, start, end) {
	let result = 0;
	for (let i = start; i < end; i++) result = result * 10 + str.charCodeAt(i) - 48;
	return result;
}
function countRemainingChunks(str, start) {
	let count = 0;
	let index = start;
	while (index < str.length) {
		count++;
		index = findChunkEnd(str, index, isDigit(str.charCodeAt(index)));
	}
	return count;
}
/**
* The built-in sorting function registry.
*
* Registering this full object opts out of tree-shaking: every built-in
* sorting function ends up in your bundle. Prefer importing the `sortFn_*`
* functions you actually use and registering just those in the `sortFns`
* slot, or passing them directly to the `sortFn` column option.
*
* @deprecated Import individual `sortFn_*` functions instead for a smaller
* bundle. This export still works and is not going away in v9, but built-in
* name resolution (including `sortFn: 'auto'`) only finds functions you
* register yourself.
*/
const sortFns = {
	alphanumeric: sortFn_alphanumeric,
	alphanumericCaseSensitive: sortFn_alphanumericCaseSensitive,
	basic: sortFn_basic,
	datetime: sortFn_datetime,
	text: sortFn_text,
	textCaseSensitive: sortFn_textCaseSensitive
};

//#endregion
export { constructSortFn, reSplitAlphaNumeric, sortFn_alphanumeric, sortFn_alphanumericCaseSensitive, sortFn_basic, sortFn_datetime, sortFn_text, sortFn_textCaseSensitive, sortFns };