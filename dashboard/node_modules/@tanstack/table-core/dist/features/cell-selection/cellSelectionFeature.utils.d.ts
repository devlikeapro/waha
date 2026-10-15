import { CellData, RowData, Updater } from "../../types/type-utils.js";
import { CellSelectionBounds, CellSelectionDirection, CellSelectionEdges, CellSelectionRange, CellSelectionState, SelectCellRangeOptions } from "./cellSelectionFeature.types.js";
import { Table } from "../../types/Table.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/cell-selection/cellSelectionFeature.utils.d.ts
/**
 * Creates the default cell selection state.
 *
 * The feature default is an empty selection. Reset APIs use this value when
 * `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const selection = getDefaultCellSelectionState()
 * ```
 */
declare function getDefaultCellSelectionState(): CellSelectionState;
/**
 * Routes a cell selection updater through the table's selection change handler.
 *
 * @example
 * ```ts
 * table_setCellSelection(table, (old) => old.slice(0, -1))
 * ```
 */
declare function table_setCellSelection<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<CellSelectionState>): void;
/**
 * Resets `cellSelection` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.cellSelection` when it
 * exists. Passing `true` ignores initial state and resets to an empty selection.
 *
 * @example
 * ```ts
 * table_resetCellSelection(table, true)
 * ```
 */
declare function table_resetCellSelection<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Schedules a cell selection reset after `data` changes.
 *
 * Ranges are stored as row and column ids, so without this a data swap would
 * leave a selection pointing at rows that no longer exist, or silently
 * re-select cells whenever new data reuses ids. The reset runs when
 * `autoResetAll` or `autoResetCellSelection` allows it, defaulting to on.
 *
 * Resetting to `initialState.cellSelection` rather than to empty means the
 * first row-model computation is a no-op, matching `table_autoResetExpanded`.
 *
 * @example
 * ```ts
 * table_autoResetCellSelection(table)
 * ```
 */
declare function table_autoResetCellSelection<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Builds a column id to render-order index map.
 *
 * Registered by this feature so the lookup stays memoized even when
 * `columnOrderingFeature` is absent, since that feature's `getColumnIndexes`
 * static rebuilds all four maps on every call, which would make per-cell reads
 * O(columns).
 *
 * @example
 * ```ts
 * const index = table_getCellSelectionColumnIndexes(table)[columnId]
 * ```
 */
declare function table_getCellSelectionColumnIndexes<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Record<string, number>;
/**
 * Resolves the merged-cell rectangles of the rendered rows into selection's
 * own index space.
 *
 * The span index positions rows by their paginated render order while
 * selection positions them by pre-paginated display order, so each merge is
 * mapped through `row.getDisplayIndex()`. A merge whose rows do not map to a
 * contiguous display range is skipped defensively; it then behaves like
 * unmerged cells instead of corrupting the geometry.
 *
 * Returns an empty array when `cellSpanningFeature` is not registered, which
 * keeps every selection code path identical to the span-unaware behavior.
 *
 * @example
 * ```ts
 * const merges = table_getCellSelectionMergeBounds(table)
 * ```
 */
declare function table_getCellSelectionMergeBounds<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<CellSelectionBounds>;
/**
 * Resolves ordered range operations into disjoint, positive display-order
 * index rectangles.
 *
 * This is the single cache every per-cell read goes through, so index lookups
 * happen once per invalidation rather than once per cell. A range whose corners
 * no longer resolve, for example because its anchor row was filtered out, is
 * omitted rather than clamped, so it contributes nothing while remaining in
 * state and returns intact when the filter clears.
 *
 * @example
 * ```ts
 * const bounds = table_getCellSelectionBounds(table)
 * ```
 */
declare function table_getCellSelectionBounds<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<CellSelectionBounds>;
/**
 * Checks whether this cell can currently be selected.
 *
 * A column def opting out with `enableCellSelection: false` wins over the table
 * option, matching how the other per-column enable flags resolve.
 *
 * @example
 * ```ts
 * const canSelect = cell_getCanSelect(cell)
 * ```
 */
declare function cell_getCanSelect<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): boolean;
/**
 * Checks whether this cell falls inside the final positive selection.
 *
 * Deliberately not memoized. Registering this through `assignPrototypeAPIs`
 * with `memoDeps` would allocate a memo closure and dependency array per cell,
 * which costs more than the handful of integer comparisons it would save.
 *
 * @example
 * ```ts
 * const isSelected = cell_getIsSelected(cell)
 * ```
 */
declare function cell_getIsSelected<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): boolean;
/**
 * Checks whether this cell is the active cell.
 *
 * @example
 * ```ts
 * const isFocused = cell_getIsFocused(cell)
 * ```
 */
declare function cell_getIsFocused<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): boolean;
/**
 * Returns `0` for the focused cell and `-1` otherwise, for roving tabindex.
 *
 * @example
 * ```ts
 * const tabIndex = cell_getTabIndex(cell)
 * ```
 */
declare function cell_getTabIndex<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): number;
/**
 * Returns which sides of this cell sit on the outer boundary of the selection.
 *
 * A side is an edge when the neighbouring cell in that direction is not itself
 * covered by a range, which is what lets a consumer draw a single outline
 * around an arbitrary union of rectangles.
 *
 * @example
 * ```ts
 * const { top, right, bottom, left } = cell_getSelectionEdges(cell)
 * ```
 */
declare function cell_getSelectionEdges<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): CellSelectionEdges;
/**
 * Returns the active cell, i.e. the anchor of the most recent operation.
 *
 * Focus is derived rather than stored: in spreadsheet semantics, dragging from
 * A1 to C5 leaves the active cell at A1, so the active range's anchor already
 * is the active cell.
 *
 * @example
 * ```ts
 * const cell = table_getFocusedCell(table)
 * ```
 */
declare function table_getFocusedCell<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Cell<TFeatures, TData, any> | undefined;
/**
 * Collapses the selection to a single cell at the given coordinates.
 *
 * @example
 * ```ts
 * table_setFocusedCell(table, '3', 'firstName')
 * ```
 */
declare function table_setFocusedCell<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, rowId: string, columnId: string): void;
/**
 * Selects a rectangle using replace, include, or exclude semantics.
 *
 * @example
 * ```ts
 * table_selectCellRange(table, range, { mode: 'exclude' })
 * ```
 */
declare function table_selectCellRange<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, range: CellSelectionRange, opts?: SelectCellRangeOptions): void;
/**
 * Selects every selectable cell in the table as one range.
 *
 * @example
 * ```ts
 * table_selectAllCells(table)
 * ```
 */
declare function table_selectAllCells<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): void;
/**
 * Moves the selection one step in a direction, collapsing it to a single cell.
 *
 * With nothing selected, this selects the first selectable cell so keyboard
 * navigation has somewhere to start.
 *
 * @example
 * ```ts
 * table_moveCellSelection(table, 'down')
 * ```
 */
declare function table_moveCellSelection<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, direction: CellSelectionDirection): void;
/**
 * Extends the active range one step in a direction, keeping its anchor fixed.
 *
 * @example
 * ```ts
 * table_extendCellSelection(table, 'right')
 * ```
 */
declare function table_extendCellSelection<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, direction: CellSelectionDirection): void;
/**
 * Returns the ids of all selected cells, in row-major order.
 *
 * Cells covered by overlapping ranges are returned once, at their first
 * occurrence.
 *
 * @example
 * ```ts
 * const ids = table_getSelectedCellIds(table)
 * ```
 */
declare function table_getSelectedCellIds<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<string>;
/**
 * Returns each final positive region's values as a row-major grid.
 *
 * This is the raw material for clipboard export. Serializing it to text is left
 * to userland, since the delimiter, the null representation, and whether values
 * containing delimiters get quoted are all application decisions.
 *
 * @example
 * ```ts
 * const [firstRange] = table_getSelectedCellRangesData(table)
 * ```
 */
declare function table_getSelectedCellRangesData<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<Array<Array<unknown>>>;
/**
 * Returns the number of selected cells.
 *
 * Uses rectangle arithmetic over the normalized, disjoint positive regions.
 * A per-cell `enableCellSelection` predicate requires enumeration.
 *
 * @example
 * ```ts
 * const count = table_getSelectedCellCount(table)
 * ```
 */
declare function table_getSelectedCellCount<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): number;
/**
 * Returns the ids of all rows intersected by the selection.
 *
 * @example
 * ```ts
 * const rowIds = table_getCellSelectionRowIds(table)
 * ```
 */
declare function table_getCellSelectionRowIds<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<string>;
/**
 * Returns the ids of all columns intersected by the selection.
 *
 * @example
 * ```ts
 * const columnIds = table_getCellSelectionColumnIds(table)
 * ```
 */
declare function table_getCellSelectionColumnIds<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>): Array<string>;
/**
 * Creates a handler that begins a selection at this cell.
 *
 * Follows `header_getResizeHandler`: the enable check is resolved once outside
 * the returned closure and guarded again inside it, the document is injectable
 * for SSR and cross-document rendering, and the document-level `mouseup`
 * listener is attached here so a drag released outside the table still ends.
 *
 * @example
 * ```tsx
 * <td onMouseDown={cell.getSelectionStartHandler()} />
 * ```
 */
declare function cell_getSelectionStartHandler<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>, _contextDocument?: Document): (e: unknown) => void;
/**
 * Creates a handler that extends the active range to this cell during a drag.
 *
 * No rAF coalescing is needed here, unlike the resize handler: `mouseenter`
 * fires once per cell boundary crossed rather than continuously, and deferring
 * it by a frame would only delay the highlight.
 *
 * @example
 * ```tsx
 * <td onMouseEnter={cell.getSelectionExtendHandler()} />
 * ```
 */
declare function cell_getSelectionExtendHandler<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(cell: Cell<TFeatures, TData, TValue>): (_e: unknown) => void;
//#endregion
export { cell_getCanSelect, cell_getIsFocused, cell_getIsSelected, cell_getSelectionEdges, cell_getSelectionExtendHandler, cell_getSelectionStartHandler, cell_getTabIndex, getDefaultCellSelectionState, table_autoResetCellSelection, table_extendCellSelection, table_getCellSelectionBounds, table_getCellSelectionColumnIds, table_getCellSelectionColumnIndexes, table_getCellSelectionMergeBounds, table_getCellSelectionRowIds, table_getFocusedCell, table_getSelectedCellCount, table_getSelectedCellIds, table_getSelectedCellRangesData, table_moveCellSelection, table_resetCellSelection, table_selectAllCells, table_selectCellRange, table_setCellSelection, table_setFocusedCell };