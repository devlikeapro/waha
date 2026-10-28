import { RowData } from "../types/type-utils.js";
import { TableOptions } from "../types/TableOptions.js";
import { TableFeatures } from "../types/TableFeatures.js";
//#region src/helpers/tableOptions.d.ts
/**
 * Preserves table option inference when reusable options omit `columns`.
 *
 * This is useful for composing shared options that will receive columns later
 * from a framework adapter or table factory.
 */
declare function tableOptions<TFeatures extends TableFeatures, TData extends RowData = any>(options: Omit<TableOptions<TFeatures, TData>, 'columns'> & {
  features: TFeatures;
}): Omit<TableOptions<TFeatures, TData>, 'columns' | 'features'> & {
  features: TFeatures;
};
/**
 * Preserves table option inference when reusable options omit `data`.
 */
declare function tableOptions<TFeatures extends TableFeatures, TData extends RowData = any>(options: Omit<TableOptions<TFeatures, TData>, 'data'> & {
  features: TFeatures;
}): Omit<TableOptions<TFeatures, TData>, 'data' | 'features'> & {
  features: TFeatures;
};
/**
 * Preserves table option inference when reusable options omit both `data` and
 * `columns`.
 */
declare function tableOptions<TFeatures extends TableFeatures, TData extends RowData = any>(options: Omit<TableOptions<TFeatures, TData>, 'data' | 'columns'> & {
  features: TFeatures;
}): Omit<TableOptions<TFeatures, TData>, 'data' | 'columns' | 'features'> & {
  features: TFeatures;
};
/**
 * Preserves inference for a fully specified table options object.
 */
declare function tableOptions<TFeatures extends TableFeatures, TData extends RowData = any>(options: TableOptions<TFeatures, TData>): TableOptions<TFeatures, TData>;
/**
 * Preserves inference when a wrapper supplies `features`.
 */
declare function tableOptions<TFeatures extends TableFeatures, TData extends RowData = any>(options: Omit<TableOptions<TFeatures, TData>, 'features'>): Omit<TableOptions<TFeatures, TData>, 'features'>;
/**
 * Preserves inference when a wrapper supplies both `data` and `features`.
 */
declare function tableOptions<TFeatures extends TableFeatures, TData extends RowData = any>(options: Omit<TableOptions<TFeatures, TData>, 'data' | 'features'>): Omit<TableOptions<TFeatures, TData>, 'data' | 'features'>;
/**
 * Preserves inference when a wrapper supplies both `columns` and `features`.
 */
declare function tableOptions<TFeatures extends TableFeatures, TData extends RowData = any>(options: Omit<TableOptions<TFeatures, TData>, 'columns' | 'features'>): Omit<TableOptions<TFeatures, TData>, 'columns' | 'features'>;
/**
 * Preserves inference when a wrapper supplies `data`, `columns`, and
 * `features`.
 */
declare function tableOptions<TFeatures extends TableFeatures, TData extends RowData = any>(options: Omit<TableOptions<TFeatures, TData>, 'data' | 'columns' | 'features'>): Omit<TableOptions<TFeatures, TData>, 'data' | 'columns' | 'features'>;
//#endregion
export { tableOptions };