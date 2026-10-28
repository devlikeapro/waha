import { RowData, Updater } from "../../types/type-utils.js";
import { RowSelectionState, ToggleSelectedOptions } from "./rowSelectionFeature.types.js";
import { Row } from "../../types/Row.js";
import { RowModel } from "../../core/row-models/coreRowModelsFeature.types.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-selection/rowSelectionFeature.utils.d.ts
/**
 * Creates the default row selection state.
 *
 * The feature default is an empty map, meaning no rows are selected. Reset APIs
 * use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const selection = getDefaultRowSelectionState()
 * ```
 */
declare function getDefaultRowSelectionState(): RowSelectionState;
/**
 * Routes a row selection updater through the table's selection change handler.
 *
 * The updater may be a next selection map or a function of the previous map,
 * matching the instance `table.setRowSelection` behavior.
 *
 * @example
 * ```ts
 * table_setRowSelection(table, (old) => ({ ...old, [rowId]: true }))
 * ```
 */
declare function table_setRowSelection<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<RowSelectionState>): void;
/**
 * Resets `rowSelection` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.rowSelection` when it
 * exists. Passing `true` ignores initial state and resets to `{}`.
 *
 * @example
 * ```ts
 * table_resetRowSelection(table)
 * table_resetRowSelection(table, true)
 * ```
 */
declare function table_resetRowSelection<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Selects or deselects every selectable row before grouping.
 *
 * Omitting `value` toggles based on `table_getIsAllRowsSelected(table)`.
 * Selecting skips sub-rows whose ancestors block descent via
 * `enableSubRowSelection`. Deselecting removes matching selectable ids from the
 * existing selection map; rows that cannot be selected keep their selection
 * unless `opts.deselectAll` is `true`.
 *
 * @example
 * ```ts
 * table_toggleAllRowsSelected(table)
 * ```
 */
declare function table_toggleAllRowsSelected<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, value?: boolean, opts?: {
  deselectAll?: boolean;
}): void;
/**
 * Selects or deselects every selectable row on the current page.
 *
 * Omitting `value` toggles based on `table_getIsAllPageRowsSelected(table)`.
 * Child rows are included when sub-row selection allows it.
 *
 * @example
 * ```ts
 * table_toggleAllPageRowsSelected(table)
 * ```
 */
declare function table_toggleAllPageRowsSelected<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, value?: boolean, opts?: {
  deselectAll?: boolean;
}): void;
/**
 * Reads the row model before row selection is projected into selected rows.
 *
 * Selection does not alter the base row pipeline, so this returns the core row
 * model.
 *
 * @example
 * ```ts
 * const rowsBeforeSelection = table_getPreSelectedRowModel(table)
 * ```
 */
declare function table_getPreSelectedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Builds a row model containing selected rows from the core row model.
 *
 * If no row ids are selected, an empty row model is returned without walking
 * the rows.
 *
 * @example
 * ```ts
 * const selectedRows = table_getSelectedRowModel(table)
 * ```
 */
declare function table_getSelectedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> | {
  rows: never[];
  flatRows: never[];
  rowsById: Record<string, unknown>;
};
/**
 * Builds a row model containing selected rows from the filtered row model.
 *
 * If no row ids are selected, an empty row model is returned without walking
 * the rows.
 *
 * @example
 * ```ts
 * const selectedRows = table_getFilteredSelectedRowModel(table)
 * ```
 */
declare function table_getFilteredSelectedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> | {
  rows: never[];
  flatRows: never[];
  rowsById: Record<string, unknown>;
};
/**
 * Builds a row model containing selected rows from the grouped row model.
 *
 * If no row ids are selected, an empty row model is returned without walking
 * the rows.
 *
 * @example
 * ```ts
 * const selectedRows = table_getGroupedSelectedRowModel(table)
 * ```
 */
declare function table_getGroupedSelectedRowModel<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> | {
  rows: never[];
  flatRows: never[];
  rowsById: Record<string, unknown>;
};
/**
 * Returns the ids of all selected rows.
 *
 * @example
 * ```ts
 * const selectedRowIds = table_getSelectedRowIds(table)
 * ```
 */
declare function table_getSelectedRowIds<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<string>;
/**
 * Checks whether every selectable filtered row is selected.
 *
 * The result is false when there are no filtered rows or when selection state is
 * empty. Sub-rows whose ancestors block descent via `enableSubRowSelection` are
 * ignored, matching the rows that `table_toggleAllRowsSelected` selects.
 *
 * @example
 * ```ts
 * const allSelected = table_getIsAllRowsSelected(table)
 * ```
 */
declare function table_getIsAllRowsSelected<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Checks whether every selectable row on the current page is selected.
 *
 * Non-selectable rows are ignored for this calculation, as are sub-rows whose
 * ancestors block descent via `enableSubRowSelection`.
 *
 * @example
 * ```ts
 * const allPageRowsSelected = table_getIsAllPageRowsSelected(table)
 * ```
 */
declare function table_getIsAllPageRowsSelected<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Checks whether at least one row id is selected.
 *
 * The result stays true when every row is selected.
 *
 * @example
 * ```ts
 * const someRowsSelected = table_getIsSomeRowsSelected(table)
 * ```
 */
declare function table_getIsSomeRowsSelected<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Checks whether at least one selectable row on the current page is selected.
 *
 * @example
 * ```ts
 * const somePageRowsSelected = table_getIsSomePageRowsSelected(table)
 * ```
 */
declare function table_getIsSomePageRowsSelected<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): boolean;
/**
 * Creates a checkbox-style handler that selects or deselects all rows.
 *
 * The handler reads `event.target.checked`, so it is intended for controls whose
 * checked state means "all rows selected".
 *
 * @example
 * ```ts
 * const onChange = table_getToggleAllRowsSelectedHandler(table)
 * ```
 */
declare function table_getToggleAllRowsSelectedHandler<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): (e: unknown) => void;
/**
 * Creates a checkbox-style handler that selects or deselects current page rows.
 *
 * The handler reads `event.target.checked`, so it is intended for controls whose
 * checked state means "all page rows selected".
 *
 * @example
 * ```ts
 * const onChange = table_getToggleAllPageRowsSelectedHandler(table)
 * ```
 */
declare function table_getToggleAllPageRowsSelectedHandler<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): (e: unknown) => void;
/**
 * Selects or deselects this row.
 *
 * Omitting `value` toggles the row. Child rows are selected recursively unless
 * `opts.selectChildren` is `false`, sub-row selection is disabled, or the row
 * only supports single selection. Pass `deselectParents: true` to also remove
 * ancestor row ids from the selection when this row is deselected.
 *
 * @example
 * ```ts
 * row_toggleSelected(row)
 * row_toggleSelected(row, true)
 * row_toggleSelected(row, false)
 * row_toggleSelected(row, true, { selectChildren: false })
 * row_toggleSelected(row, false, { deselectParents: true })
 * ```
 */
declare function row_toggleSelected<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>, value?: boolean, opts?: ToggleSelectedOptions): void;
/**
 * Checks whether this row id is selected in `state.rowSelection`.
 *
 * Missing row ids are treated as not selected.
 *
 * @example
 * ```ts
 * const selected = row_getIsSelected(row)
 * ```
 */
declare function row_getIsSelected<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Checks whether some, but not all, selectable descendants are selected.
 *
 * This supports indeterminate selection UI for parent rows.
 *
 * @example
 * ```ts
 * const partial = row_getIsSomeSelected(row)
 * ```
 */
declare function row_getIsSomeSelected<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Checks whether all selectable descendants are selected.
 *
 * Rows without selectable descendants return false.
 *
 * @example
 * ```ts
 * const allChildrenSelected = row_getIsAllSubRowsSelected(row)
 * ```
 */
declare function row_getIsAllSubRowsSelected<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Checks whether this row can be selected.
 *
 * `options.enableRowSelection` may be a boolean or a row predicate; it defaults
 * to `true`.
 *
 * @example
 * ```ts
 * const canSelect = row_getCanSelect(row)
 * ```
 */
declare function row_getCanSelect<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Checks whether selecting this row should also select its subRows.
 *
 * `options.enableSubRowSelection` may be a boolean or a row predicate; it
 * defaults to `true`.
 *
 * @example
 * ```ts
 * const canSelectChildren = row_getCanSelectSubRows(row)
 * ```
 */
declare function row_getCanSelectSubRows<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Checks whether this row can be selected alongside other rows.
 *
 * `options.enableMultiRowSelection` may be a boolean or a row predicate; it
 * defaults to `true`.
 *
 * @example
 * ```ts
 * const canMultiSelect = row_getCanMultiSelect(row)
 * ```
 */
declare function row_getCanMultiSelect<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean;
/**
 * Creates a checkbox-style handler that selects or deselects this row.
 *
 * The handler is a no-op when the row cannot be selected and reads
 * `event.target.checked`. Shift events select or deselect the inclusive range
 * from the most recent selectable row handled by this table. Pass
 * `selectChildren: false` to limit changes to rows explicitly present in the
 * display-order interval, and `deselectParents: true` to remove ancestor row
 * ids from the selection when rows are deselected.
 *
 * @example
 * ```ts
 * const onChange = row_getToggleSelectedHandler(row)
 * ```
 */
declare function row_getToggleSelectedHandler<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>, opts?: ToggleSelectedOptions): (e: unknown) => void;
/**
 * Builds a row model containing rows selected by the current row selection state.
 *
 * The result is derived from the supplied row model, so selected ids absent from
 * that model are not materialized as rows.
 *
 * @example
 * ```ts
 * const selectedRows = selectRowsFn(rowModel)
 * ```
 */
declare function selectRowsFn<TFeatures extends TableFeatures, TData extends RowData>(rowModel: RowModel<TFeatures, TData>, table: Table<TFeatures, TData>): RowModel<TFeatures, TData>;
/**
 * Returns whether a row id is selected in the current row selection state.
 *
 * @example
 * ```ts
 * const selected = isRowSelected(row)
 * ```
 */
declare function isRowSelected<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>, rowSelection: RowSelectionState): boolean;
/**
 * Returns whether all, some, or none of a row's selectable descendants are selected.
 *
 * The result is used to drive indeterminate row selection UI.
 *
 * @example
 * ```ts
 * const selectedState = isSubRowSelected(row)
 * ```
 */
declare function isSubRowSelected<TFeatures extends TableFeatures, TData extends RowData>(row: Row<TFeatures, TData>): boolean | 'some' | 'all';
//#endregion
export { getDefaultRowSelectionState, isRowSelected, isSubRowSelected, row_getCanMultiSelect, row_getCanSelect, row_getCanSelectSubRows, row_getIsAllSubRowsSelected, row_getIsSelected, row_getIsSomeSelected, row_getToggleSelectedHandler, row_toggleSelected, selectRowsFn, table_getFilteredSelectedRowModel, table_getGroupedSelectedRowModel, table_getIsAllPageRowsSelected, table_getIsAllRowsSelected, table_getIsSomePageRowsSelected, table_getIsSomeRowsSelected, table_getPreSelectedRowModel, table_getSelectedRowIds, table_getSelectedRowModel, table_getToggleAllPageRowsSelectedHandler, table_getToggleAllRowsSelectedHandler, table_resetRowSelection, table_setRowSelection, table_toggleAllPageRowsSelected, table_toggleAllRowsSelected };