import { RowData } from "../../types/type-utils.js";
import { CreatedSortFn, SortFnDef } from "./rowSortingFeature.types.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/row-sorting/sortFns.d.ts
/**
 * Regular expression used to split mixed text and numeric chunks.
 *
 * The alphanumeric sort functions use these chunks for natural sorting of
 * strings like `item2` before `item10`.
 */
declare const reSplitAlphaNumeric: RegExp;
/**
 * Builds a `SortFn` from a value-level comparator plus an optional
 * `resolveDataValue` normalizer.
 *
 * The `sort` comparator receives both rows' data values, each already passed
 * through `resolveDataValue` when one is defined. Keeping normalization in the
 * resolver means a variant of an existing sorting function only has to swap
 * the resolver, not re-implement the comparison.
 *
 * The definition is attached to the returned function, so a variant can be
 * created by spreading a built-in sorting function and overriding what
 * differs:
 *
 * ```ts
 * const stripDiacritics = (value: string) =>
 *   value.normalize('NFD').replace(/\p{Diacritic}/gu, '')
 *
 * const alphanumericIgnoreDiacritics = constructSortFn({
 *   ...sortFn_alphanumeric,
 *   resolveDataValue: (value) =>
 *     stripDiacritics(sortFn_alphanumeric.resolveDataValue!(value)),
 * })
 * ```
 */
declare function constructSortFn<TFeatures extends TableFeatures = any, TData extends RowData = any>(def: SortFnDef<TFeatures, TData>): CreatedSortFn<TFeatures, TData>;
/**
 * Sorts rows with the built-in alphanumeric strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
declare const sortFn_alphanumeric: CreatedSortFn<any, any>;
/**
 * Sorts rows with the built-in alphanumeric case sensitive strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
declare const sortFn_alphanumericCaseSensitive: CreatedSortFn<any, any>;
/**
 * Sorts rows with the built-in text strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
declare const sortFn_text: CreatedSortFn<any, any>;
/**
 * Sorts rows with the built-in text case sensitive strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
declare const sortFn_textCaseSensitive: CreatedSortFn<any, any>;
/**
 * Sorts rows with the built-in datetime strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
declare const sortFn_datetime: CreatedSortFn<any, any>;
/**
 * Sorts rows with the built-in basic strategy.
 *
 * This comparator returns ascending-order results; descending order is applied by the sorting row model.
 */
declare const sortFn_basic: CreatedSortFn<any, any>;
/**
 * The built-in sorting function registry.
 *
 * Registering this full object opts out of tree-shaking: every built-in
 * sorting function ends up in your bundle. Prefer importing the `sortFn_*`
 * functions you actually use and registering just those in the `sortFns`
 * slot, or passing them directly to the `sortFn` column option.
 *
 * @deprecated Import individual `sortFn_*` functions instead for a smaller
 * bundle. This export still works and is not going away in v9, but built-in
 * name resolution (including `sortFn: 'auto'`) only finds functions you
 * register yourself.
 */
declare const sortFns: {
  alphanumeric: CreatedSortFn<any, any>;
  alphanumericCaseSensitive: CreatedSortFn<any, any>;
  basic: CreatedSortFn<any, any>;
  datetime: CreatedSortFn<any, any>;
  text: CreatedSortFn<any, any>;
  textCaseSensitive: CreatedSortFn<any, any>;
};
type BuiltInSortFn = keyof typeof sortFns;
//#endregion
export { BuiltInSortFn, constructSortFn, reSplitAlphaNumeric, sortFn_alphanumeric, sortFn_alphanumericCaseSensitive, sortFn_basic, sortFn_datetime, sortFn_text, sortFn_textCaseSensitive, sortFns };