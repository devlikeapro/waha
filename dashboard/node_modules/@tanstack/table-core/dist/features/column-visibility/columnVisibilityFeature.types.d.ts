import { OnChangeFn, RowData, Updater } from "../../types/type-utils.js";
import { Column } from "../../types/Column.js";
import { Cell } from "../../types/Cell.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-visibility/columnVisibilityFeature.types.d.ts
type ColumnVisibilityState = Record<string, boolean>;
interface TableState_ColumnVisibility {
  columnVisibility: ColumnVisibilityState;
}
interface TableOptions_ColumnVisibility {
  /**
   * Whether to enable column hiding. Defaults to `true`.
   */
  enableHiding?: boolean;
  /**
   * Called with an updater when column visibility state changes. Pair this with
   * `state.columnVisibility` when using external state; external atoms can own
   * the slice without this callback.
   */
  onColumnVisibilityChange?: OnChangeFn<ColumnVisibilityState>;
}
type VisibilityDefaultOptions = Pick<TableOptions_ColumnVisibility, 'onColumnVisibilityChange'>;
interface Table_ColumnVisibility<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  /**
   * Checks whether every leaf column is currently visible.
   */
  getIsAllColumnsVisible: () => boolean;
  /**
   * Checks whether at least one leaf column is currently visible.
   */
  getIsSomeColumnsVisible: () => boolean;
  /**
   * Creates a checkbox-style handler that shows or hides all columns.
   */
  getToggleAllColumnsVisibilityHandler: () => (event: unknown) => void;
  /**
   * Lists visible columns in flat table order, including parent columns that
   * have visible descendants.
   */
  getVisibleFlatColumns: () => Array<Column<TFeatures, TData, unknown>>;
  /**
   * Lists visible leaf columns in the order used for row cells and headers.
   */
  getVisibleLeafColumns: () => Array<Column<TFeatures, TData, unknown>>;
  /**
   * Resets `columnVisibility` to `initialState.columnVisibility`.
   *
   * Pass `true` to ignore initial state and reset to `{}`.
   */
  resetColumnVisibility: (defaultState?: boolean) => void;
  /**
   * Updates column visibility state with a next map or updater function.
   */
  setColumnVisibility: (updater: Updater<ColumnVisibilityState>) => void;
  /**
   * Toggles the visibility of all columns.
   */
  toggleAllColumnsVisible: (value?: boolean) => void;
}
interface ColumnDef_ColumnVisibility {
  /**
   * Allows this column to be hidden. Defaults to `true`.
   */
  enableHiding?: boolean;
}
interface Row_ColumnVisibility<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  /**
   * Gets this row's cells for currently visible columns.
   */
  getVisibleCells: () => Array<Cell<TFeatures, TData, unknown>>;
  /**
   * Maps this row's currently visible cells by column id.
   */
  getVisibleCellsByColumnId: () => Record<string, Cell<TFeatures, TData, unknown>>;
}
interface Column_ColumnVisibility {
  /**
   * Checks whether this column is allowed to be hidden.
   */
  getCanHide: () => boolean;
  /**
   * Checks whether this column is currently visible.
   */
  getIsVisible: () => boolean;
  /**
   * Creates a checkbox-style handler that toggles this column's visibility.
   */
  getToggleVisibilityHandler: () => (event: unknown) => void;
  /**
   * Toggles the visibility of the column.
   */
  toggleVisibility: (value?: boolean) => void;
}
//#endregion
export { ColumnDef_ColumnVisibility, ColumnVisibilityState, Column_ColumnVisibility, Row_ColumnVisibility, TableOptions_ColumnVisibility, TableState_ColumnVisibility, Table_ColumnVisibility, VisibilityDefaultOptions };