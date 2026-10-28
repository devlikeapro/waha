//#region src/features/cell-selection/cellSelectionGeometry.ts
function compareBounds(a, b) {
	return a.minRowIndex - b.minRowIndex || a.minColumnIndex - b.minColumnIndex || a.maxRowIndex - b.maxRowIndex || a.maxColumnIndex - b.maxColumnIndex;
}
function intersectCellSelectionBounds(a, b) {
	const intersection = {
		minRowIndex: Math.max(a.minRowIndex, b.minRowIndex),
		maxRowIndex: Math.min(a.maxRowIndex, b.maxRowIndex),
		minColumnIndex: Math.max(a.minColumnIndex, b.minColumnIndex),
		maxColumnIndex: Math.min(a.maxColumnIndex, b.maxColumnIndex)
	};
	return intersection.minRowIndex <= intersection.maxRowIndex && intersection.minColumnIndex <= intersection.maxColumnIndex ? intersection : void 0;
}
function subtractCellSelectionBounds(source, excluded) {
	const intersection = intersectCellSelectionBounds(source, excluded);
	if (!intersection) return [source];
	const result = [];
	if (source.minRowIndex < intersection.minRowIndex) result.push({
		...source,
		maxRowIndex: intersection.minRowIndex - 1
	});
	if (intersection.maxRowIndex < source.maxRowIndex) result.push({
		...source,
		minRowIndex: intersection.maxRowIndex + 1
	});
	if (source.minColumnIndex < intersection.minColumnIndex) result.push({
		minRowIndex: intersection.minRowIndex,
		maxRowIndex: intersection.maxRowIndex,
		minColumnIndex: source.minColumnIndex,
		maxColumnIndex: intersection.minColumnIndex - 1
	});
	if (intersection.maxColumnIndex < source.maxColumnIndex) result.push({
		minRowIndex: intersection.minRowIndex,
		maxRowIndex: intersection.maxRowIndex,
		minColumnIndex: intersection.maxColumnIndex + 1,
		maxColumnIndex: source.maxColumnIndex
	});
	return result;
}
function mergePair(a, b) {
	if (a.minRowIndex === b.minRowIndex && a.maxRowIndex === b.maxRowIndex && (a.maxColumnIndex + 1 === b.minColumnIndex || b.maxColumnIndex + 1 === a.minColumnIndex)) return {
		minRowIndex: a.minRowIndex,
		maxRowIndex: a.maxRowIndex,
		minColumnIndex: Math.min(a.minColumnIndex, b.minColumnIndex),
		maxColumnIndex: Math.max(a.maxColumnIndex, b.maxColumnIndex)
	};
	if (a.minColumnIndex === b.minColumnIndex && a.maxColumnIndex === b.maxColumnIndex && (a.maxRowIndex + 1 === b.minRowIndex || b.maxRowIndex + 1 === a.minRowIndex)) return {
		minRowIndex: Math.min(a.minRowIndex, b.minRowIndex),
		maxRowIndex: Math.max(a.maxRowIndex, b.maxRowIndex),
		minColumnIndex: a.minColumnIndex,
		maxColumnIndex: a.maxColumnIndex
	};
}
function mergeAdjacentCellSelectionBounds(input) {
	const result = input.slice();
	for (let i = 0; i < result.length; i++) for (let j = i + 1; j < result.length; j++) {
		const merged = mergePair(result[i], result[j]);
		if (!merged) continue;
		result.splice(j, 1);
		result[i] = merged;
		i = -1;
		break;
	}
	return result.sort(compareBounds);
}
function addCellSelectionBounds(selected, included) {
	let fragments = [included];
	for (const existing of selected) {
		fragments = fragments.flatMap((fragment) => subtractCellSelectionBounds(fragment, existing));
		if (!fragments.length) return selected.slice();
	}
	return mergeAdjacentCellSelectionBounds([...selected, ...fragments]);
}
/**
* Grows a rectangle until it fully contains every merged-cell rectangle it
* touches.
*
* Merged cells make plain rectangles insufficient: a selection that clips part
* of a merge must cover the whole merge, and covering it can bring the
* rectangle into contact with further merges, so the expansion runs to a fixed
* point. The loop is bounded by the merge count, since each pass that changes
* the rectangle consumes at least one merge.
*/
function expandCellSelectionBounds(bounds, merges) {
	let expanded = bounds;
	let changed = true;
	while (changed) {
		changed = false;
		for (const merge of merges) {
			if (!intersectCellSelectionBounds(expanded, merge)) continue;
			const union = {
				minRowIndex: Math.min(expanded.minRowIndex, merge.minRowIndex),
				maxRowIndex: Math.max(expanded.maxRowIndex, merge.maxRowIndex),
				minColumnIndex: Math.min(expanded.minColumnIndex, merge.minColumnIndex),
				maxColumnIndex: Math.max(expanded.maxColumnIndex, merge.maxColumnIndex)
			};
			if (union.minRowIndex !== expanded.minRowIndex || union.maxRowIndex !== expanded.maxRowIndex || union.minColumnIndex !== expanded.minColumnIndex || union.maxColumnIndex !== expanded.maxColumnIndex) {
				expanded = union;
				changed = true;
			}
		}
	}
	return expanded;
}
function applyCellSelectionBoundsOperations(operations) {
	let selected = [];
	for (const operation of operations) {
		const bounds = {
			minRowIndex: operation.minRowIndex,
			maxRowIndex: operation.maxRowIndex,
			minColumnIndex: operation.minColumnIndex,
			maxColumnIndex: operation.maxColumnIndex
		};
		if (operation.operation === "exclude") selected = mergeAdjacentCellSelectionBounds(selected.flatMap((bound) => subtractCellSelectionBounds(bound, bounds)));
		else selected = addCellSelectionBounds(selected, bounds);
	}
	return selected.sort(compareBounds);
}

//#endregion
export { addCellSelectionBounds, applyCellSelectionBoundsOperations, expandCellSelectionBounds, intersectCellSelectionBounds, mergeAdjacentCellSelectionBounds, subtractCellSelectionBounds };