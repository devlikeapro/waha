import { CellData, RowData, Updater } from "../../types/type-utils.js";
import { columnResizingState } from "./columnResizingFeature.types.js";
import { Header } from "../../types/Header.js";
import { Column } from "../../types/Column.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-resizing/columnResizingFeature.utils.d.ts
/**
 * Creates the default transient column resizing state.
 *
 * The feature default represents no active drag interaction. Reset APIs use
 * this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const resizeInfo = getDefaultColumnResizingState()
 * ```
 */
declare function getDefaultColumnResizingState(): columnResizingState;
/**
 * Checks whether this column can start a resize interaction.
 *
 * Both `columnDef.enableResizing` and table `enableColumnResizing` default to
 * `true`.
 *
 * @example
 * ```ts
 * const canResize = column_getCanResize(column)
 * ```
 */
declare function column_getCanResize<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Checks whether this column is the active column resize target.
 *
 * The value is read from `state.columnResizing.isResizingColumn`.
 *
 * @example
 * ```ts
 * const isResizing = column_getIsResizing(column)
 * ```
 */
declare function column_getIsResizing<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>): boolean;
/**
 * Creates the pointer/touch start handler for resizing a header.
 *
 * The handler records starting sizes for all leaf headers, tracks drag deltas,
 * writes transient resize info, and commits column sizes on change or drag end
 * depending on `columnResizeMode`.
 *
 * @example
 * ```ts
 * const onMouseDown = header_getResizeHandler(header)
 * ```
 */
declare function header_getResizeHandler<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(header: Header<TFeatures, TData, TValue>, _contextDocument?: Document): (event: unknown) => void;
/**
 * Routes a transient column resizing updater through the table's resize handler.
 *
 * This state tracks the active drag interaction; committed widths live in
 * `columnSizing`.
 *
 * @example
 * ```ts
 * table_setColumnResizing(table, (old) => ({ ...old, deltaOffset: 12 }))
 * ```
 */
declare function table_setColumnResizing<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, updater: Updater<columnResizingState>): void;
/**
 * Resets `columnResizing` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnResizing` when
 * it exists. Passing `true` ignores initial state and resets to the no-drag
 * default state.
 *
 * @example
 * ```ts
 * table_resetHeaderSizeInfo(table)
 * table_resetHeaderSizeInfo(table, true)
 * ```
 */
declare function table_resetHeaderSizeInfo<TFeatures extends TableFeatures, TData extends RowData>(table: Table<TFeatures, TData>, defaultState?: boolean): void;
/**
 * Detects whether the current environment supports passive event listeners.
 *
 * Column resizing uses this to register pointer and touch listeners with
 * `passive: false` only when the environment understands passive options.
 *
 * @example
 * ```ts
 * const canUsePassiveListeners = passiveEventSupported()
 * ```
 */
declare function passiveEventSupported(): boolean;
/**
 * Narrows an unknown event to a `touchstart` event.
 *
 * Column resizing uses this before reading touch coordinates and installing
 * touch-specific listeners.
 *
 * @example
 * ```ts
 * const isTouch = isTouchStartEvent(event)
 * ```
 */
declare function isTouchStartEvent(e: unknown): e is TouchEvent;
//#endregion
export { column_getCanResize, column_getIsResizing, getDefaultColumnResizingState, header_getResizeHandler, isTouchStartEvent, passiveEventSupported, table_resetHeaderSizeInfo, table_setColumnResizing };