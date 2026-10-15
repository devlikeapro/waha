import { RowData } from "../../types/type-utils.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-faceting/createFacetedUniqueValues.d.ts
/**
 * Creates a memoized faceted unique values helper for faceted filtering.
 *
 * The returned function derives facet data from the table row model and relevant filter state so filter UIs can display available values.
 */
declare function createFacetedUniqueValues<TFeatures extends TableFeatures, TData extends RowData = any>(): (table: Table<TFeatures, TData>, columnId: string) => () => Map<any, number>;
//#endregion
export { createFacetedUniqueValues };