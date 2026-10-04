import { RowData } from "../../types/type-utils.js";
import { CreatedFilterFn, FilterFnDef } from "./columnFilteringFeature.types.js";
import { TableFeatures } from "../../types/TableFeatures.js";
//#region src/features/column-filtering/filterFns.d.ts
/**
 * Builds a `FilterFn` from a value-level comparator plus optional resolvers.
 *
 * The `filter` comparator receives the row's data value (already passed
 * through `resolveDataValue` when one is defined) and the filter value
 * (already passed through `resolveFilterValue` by the table). Keeping
 * normalization in the resolvers means a variant of an existing filter
 * function only has to swap the resolvers, not re-implement the comparison.
 *
 * The definition is attached to the returned function, so a variant can be
 * created by spreading a built-in filter function and overriding what differs:
 *
 * ```ts
 * const normalize = (value: unknown) =>
 *   String(value ?? '')
 *     .toLowerCase()
 *     .normalize('NFD')
 *     .replace(/\p{Diacritic}/gu, '')
 *
 * const includesStringIgnoreDiacritics = constructFilterFn({
 *   ...filterFn_includesString,
 *   resolveFilterValue: normalize,
 *   resolveDataValue: normalize,
 * })
 * ```
 *
 * Note: the table applies `resolveFilterValue` once per filter before any rows
 * are tested. When calling a filter function directly (outside of a table),
 * apply it yourself: `fn(row, columnId, fn.resolveFilterValue?.(value) ?? value)`.
 */
declare function constructFilterFn<TFeatures extends TableFeatures = any, TData extends RowData = any>(def: FilterFnDef<TFeatures, TData>): CreatedFilterFn<TFeatures, TData>;
/**
 * Keeps rows whose column value is strictly equal to the filter value.
 *
 * Uses JavaScript `===` comparison and auto-removes empty filter values.
 */
declare const filterFn_equals: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose column value is loosely equal to the filter value.
 *
 * Uses JavaScript `==` comparison and auto-removes empty filter values. This is
 * useful for matching string input against numeric row values.
 */
declare const filterFn_weakEquals: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose stringified column value includes the filter text.
 *
 * Matching is case-sensitive and empty filter values are auto-removed.
 */
declare const filterFn_includesStringSensitive: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose stringified column value includes the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
declare const filterFn_includesString: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose stringified column value equals the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
declare const filterFn_equalsString: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose stringified column value exactly equals the filter text.
 *
 * Matching is case-sensitive and empty filter values are auto-removed.
 */
declare const filterFn_equalsStringSensitive: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose stringified column value starts with the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
declare const filterFn_startsWith: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose stringified column value ends with the filter text.
 *
 * Both values are lowercased before comparison, and empty filter values are
 * auto-removed.
 */
declare const filterFn_endsWith: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose column value is empty.
 *
 * A value is empty when it is nullish or stringifies to whitespace only. The
 * filter value acts as an on/off flag: `false` and blank values are
 * auto-removed.
 */
declare const filterFn_empty: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose column value is not empty.
 *
 * A value is empty when it is nullish or stringifies to whitespace only. The
 * filter value acts as an on/off flag: `false` and blank values are
 * auto-removed.
 */
declare const filterFn_notEmpty: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose value is greater than the filter value.
 *
 * Numeric values are compared numerically when both sides can be coerced to
 * numbers; otherwise normalized strings are compared.
 */
declare const filterFn_greaterThan: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose value is greater than or equal to the filter value.
 *
 * Delegates to the built-in greater-than and strict-equality comparisons.
 */
declare const filterFn_greaterThanOrEqualTo: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose value is less than the filter value.
 *
 * This is implemented as the inverse of greater-than-or-equal comparison.
 */
declare const filterFn_lessThan: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose value is less than or equal to the filter value.
 *
 * This is implemented as the inverse of greater-than comparison.
 */
declare const filterFn_lessThanOrEqualTo: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose value falls between an exclusive min/max pair.
 *
 * Blank range endpoints are treated as open-ended.
 */
declare const filterFn_between: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose value falls between an inclusive min/max pair.
 *
 * Blank range endpoints are treated as open-ended.
 */
declare const filterFn_betweenInclusive: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose numeric value is inside an inclusive `[min, max]` range.
 *
 * Filter values are normalized so blank endpoints become open-ended and
 * reversed endpoints are swapped. Only real numbers can fall inside the
 * range: non-numeric row values (`null`, `undefined`, strings, booleans)
 * never match.
 */
declare const filterFn_inNumberRange: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose date value is inside an inclusive `[min, max]` date range.
 *
 * Row values and range endpoints may be `Date` objects, timestamps, or
 * parseable date strings. Blank or invalid endpoints become open-ended and
 * reversed endpoints are swapped. Rows without a valid date never match.
 */
declare const filterFn_inDateRange: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose scalar column value equals at least one filter value.
 */
declare const filterFn_arrHas: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose array or string column value includes at least one filter value.
 */
declare const filterFn_arrIncludes: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose array column value includes every filter value.
 */
declare const filterFn_arrIncludesAll: CreatedFilterFn<any, any>;
/**
 * Keeps rows whose array column value includes at least one filter value.
 */
declare const filterFn_arrIncludesSome: CreatedFilterFn<any, any>;
/**
 * The built-in filter function registry.
 *
 * Registering this full object opts out of tree-shaking: every built-in
 * filter function ends up in your bundle. Prefer importing the `filterFn_*`
 * functions you actually use and registering just those in the `filterFns`
 * slot, or passing them directly to the `filterFn` column option.
 *
 * @deprecated Import individual `filterFn_*` functions instead for a smaller
 * bundle. This export still works and is not going away in v9, but built-in
 * name resolution (including `filterFn: 'auto'`) only finds functions you
 * register yourself.
 */
declare const filterFns: {
  arrIncludes: CreatedFilterFn<any, any>;
  arrIncludesAll: CreatedFilterFn<any, any>;
  arrHas: CreatedFilterFn<any, any>;
  arrIncludesSome: CreatedFilterFn<any, any>;
  between: CreatedFilterFn<any, any>;
  betweenInclusive: CreatedFilterFn<any, any>;
  empty: CreatedFilterFn<any, any>;
  endsWith: CreatedFilterFn<any, any>;
  equals: CreatedFilterFn<any, any>;
  equalsString: CreatedFilterFn<any, any>;
  equalsStringSensitive: CreatedFilterFn<any, any>;
  inDateRange: CreatedFilterFn<any, any>;
  inNumberRange: CreatedFilterFn<any, any>;
  includesString: CreatedFilterFn<any, any>;
  includesStringSensitive: CreatedFilterFn<any, any>;
  notEmpty: CreatedFilterFn<any, any>;
  startsWith: CreatedFilterFn<any, any>;
  weakEquals: CreatedFilterFn<any, any>;
};
type BuiltInFilterFn = keyof typeof filterFns;
//#endregion
export { BuiltInFilterFn, constructFilterFn, filterFn_arrHas, filterFn_arrIncludes, filterFn_arrIncludesAll, filterFn_arrIncludesSome, filterFn_between, filterFn_betweenInclusive, filterFn_empty, filterFn_endsWith, filterFn_equals, filterFn_equalsString, filterFn_equalsStringSensitive, filterFn_greaterThan, filterFn_greaterThanOrEqualTo, filterFn_inDateRange, filterFn_inNumberRange, filterFn_includesString, filterFn_includesStringSensitive, filterFn_lessThan, filterFn_lessThanOrEqualTo, filterFn_notEmpty, filterFn_startsWith, filterFn_weakEquals, filterFns };