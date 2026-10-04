import { CellData, OnChangeFn, RowData, Updater } from "../../types/type-utils.js";
import { Column } from "../../types/Column.js";
import { FilterFn, FilterFnOption } from "../column-filtering/columnFilteringFeature.types.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/global-filtering/globalFilteringFeature.types.d.ts
interface TableState_GlobalFiltering {
  globalFilter: any;
}
interface ColumnDef_GlobalFiltering {
  /**
   * Allows this column to be scanned by global filtering.
   *
   * Defaults to `true`; table-level global filtering and `enableFilters` must
   * also allow filtering.
   */
  enableGlobalFilter?: boolean;
}
interface Column_GlobalFiltering {
  /**
   * Checks whether this accessor column participates in global filtering.
   */
  getCanGlobalFilter: () => boolean;
}
interface TableOptions_GlobalFiltering<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  /**
   * Enables global filtering across columns that allow it.
   */
  enableGlobalFilter?: boolean;
  /**
   * If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.
   * This is useful if the column can contain data that is not `string` or `number` (i.e. `undefined`).
   */
  getColumnCanGlobalFilter?: <TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData>(column: Column<TFeatures, TData, TValue>) => boolean;
  /**
   * The filter function to use for global filtering.
   * - A `string` referencing a built-in filter function
   * - A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
   * - A custom filter function
   */
  globalFilterFn?: FilterFnOption<TFeatures, TData>;
  /**
   * Called with an updater when global filter state changes. Pair this with
   * `state.globalFilter` when using external state; external atoms can own the
   * slice without this callback.
   */
  onGlobalFilterChange?: OnChangeFn<any>;
}
interface Table_GlobalFiltering<in out TFeatures extends TableFeatures, in out TData extends RowData> {
  /**
   * Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.
   */
  getGlobalAutoFilterFn: () => FilterFn<TFeatures, TData> | undefined;
  /**
   * Returns the filter function (either user-defined or automatic, depending on configuration) for the global filter.
   */
  getGlobalFilterFn: () => FilterFn<TFeatures, TData> | undefined;
  /**
   * Resets `globalFilter` to `initialState.globalFilter`.
   *
   * Pass `true` to ignore initial state and reset to `undefined`.
   */
  resetGlobalFilter: (defaultState?: boolean) => void;
  /**
   * Updates global filter state with a next value or updater function.
   */
  setGlobalFilter: (updater: Updater<any>) => void;
}
//#endregion
export { ColumnDef_GlobalFiltering, Column_GlobalFiltering, TableOptions_GlobalFiltering, TableState_GlobalFiltering, Table_GlobalFiltering };