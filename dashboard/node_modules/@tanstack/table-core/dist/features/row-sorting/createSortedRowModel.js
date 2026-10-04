import { copyInstancePropertiesWithoutMemos, skipFirstRun, tableMemo } from "../../utils.js";
import { table_autoResetPageIndex } from "../row-pagination/rowPaginationFeature.utils.js";
import { column_getCanSort, column_getSortFn } from "./rowSortingFeature.utils.js";

//#region src/features/row-sorting/createSortedRowModel.ts
/**
* Creates a memoized sorted row model factory.
*
* The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
*
* Register the sorting functions you use with the `sortFns` slot on the
* `features` option:
* `tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns: { alphanumeric: sortFn_alphanumeric } })`.
* Importing individual `sortFn_*` functions keeps unused built-ins out of
* your bundle; sorting functions passed directly to the `sortFn` column
* option need no registration at all.
*/
function createSortedRowModel() {
	return (_table) => {
		const table = _table;
		return tableMemo({
			feature: "rowSortingFeature",
			table,
			fnName: "table.getSortedRowModel",
			memoDeps: () => [table.atoms.sorting?.get(), table.getPreSortedRowModel()],
			fn: () => _createSortedRowModel(table),
			onAfterUpdate: skipFirstRun(() => table_autoResetPageIndex(table))
		});
	};
}
function _createSortedRowModel(table) {
	const preSortedRowModel = table.getPreSortedRowModel();
	const sorting = table.atoms.sorting?.get();
	if (!preSortedRowModel.rows.length || !sorting?.length) return preSortedRowModel;
	const sortedFlatRows = [];
	const availableSorting = sorting.filter((sort) => {
		const column = table.getColumn(sort.id);
		return column ? column_getCanSort(column) : false;
	});
	if (!availableSorting.length) return preSortedRowModel;
	const resolvedSorting = [];
	for (let i = 0; i < availableSorting.length; i++) {
		const sortEntry = availableSorting[i];
		const column = table.getColumn(sortEntry.id);
		if (!column) continue;
		resolvedSorting.push({
			id: sortEntry.id,
			desc: sortEntry.desc,
			sortUndefined: column.columnDef.sortUndefined,
			invertSorting: column.columnDef.invertSorting,
			sortFn: column_getSortFn(column)
		});
	}
	const compareRows = (rowA, rowB) => {
		for (let i = 0; i < resolvedSorting.length; i++) {
			const sortEntry = resolvedSorting[i];
			const sortUndefined = sortEntry.sortUndefined;
			const isDesc = sortEntry.desc;
			let sortInt = 0;
			if (sortUndefined) {
				const aValue = rowA.getValue(sortEntry.id);
				const bValue = rowB.getValue(sortEntry.id);
				const aUndefined = aValue === void 0;
				const bUndefined = bValue === void 0;
				if (aUndefined && bUndefined) continue;
				if (aUndefined || bUndefined) {
					if (sortUndefined === "first") return aUndefined ? -1 : 1;
					if (sortUndefined === "last") return aUndefined ? 1 : -1;
					sortInt = aUndefined ? sortUndefined : -sortUndefined;
				}
			}
			if (sortInt === 0) sortInt = sortEntry.sortFn(rowA, rowB, sortEntry.id);
			if (sortInt !== 0) {
				if (isDesc) sortInt *= -1;
				if (sortEntry.invertSorting) sortInt *= -1;
				return sortInt;
			}
		}
		return rowA.index - rowB.index;
	};
	const sortData = (rows) => {
		const sortedData = rows.slice();
		sortedData.sort(compareRows);
		let changed = false;
		for (let i = 0; i < sortedData.length; i++) {
			const row = sortedData[i];
			if (row !== rows[i]) changed = true;
			const flatIndex = sortedFlatRows.length;
			sortedFlatRows.push(row);
			if (row.subRows.length) {
				const sortedSubRows = sortData(row.subRows);
				if (sortedSubRows.changed) {
					const cloned = Object.create(Object.getPrototypeOf(row));
					copyInstancePropertiesWithoutMemos(cloned, row);
					cloned.subRows = sortedSubRows.rows;
					sortedData[i] = cloned;
					sortedFlatRows[flatIndex] = cloned;
					changed = true;
				}
			}
		}
		return {
			rows: sortedData,
			changed
		};
	};
	return {
		rows: sortData(preSortedRowModel.rows).rows,
		flatRows: sortedFlatRows,
		rowsById: preSortedRowModel.rowsById
	};
}

//#endregion
export { createSortedRowModel };