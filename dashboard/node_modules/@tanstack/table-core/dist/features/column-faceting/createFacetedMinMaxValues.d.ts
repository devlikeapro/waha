import { RowData } from "../../types/type-utils.js";
import { Table } from "../../types/Table.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-faceting/createFacetedMinMaxValues.d.ts
/**
 * Creates a memoized faceted min max values helper for faceted filtering.
 *
 * The returned function derives facet data from the table row model and relevant filter state so filter UIs can display available values.
 */
declare function createFacetedMinMaxValues<TFeatures extends TableFeatures, TData extends RowData = any>(): (table: Table<TFeatures, TData>, columnId: string) => () => undefined | [number, number];
//#endregion
export { createFacetedMinMaxValues };