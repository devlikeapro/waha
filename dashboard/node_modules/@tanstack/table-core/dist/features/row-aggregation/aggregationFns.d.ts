import { AggregationFnDef } from "./rowAggregationFeature.types.js";
//#region src/features/row-aggregation/aggregationFns.d.ts
type RangeValue = Date | number;
/**
 * Sums numeric selected-row values. Non-number values contribute zero. As in
 * the previous API, `NaN` is a number and therefore propagates through the sum.
 */
declare const aggregationFn_sum: AggregationFnDef<any, any, unknown, number>;
/**
 * Finds the minimum numeric or Date value from the selected rows. Invalid value
 * types are ignored; `NaN` preserves the legacy numeric seeding behavior.
 */
declare const aggregationFn_min: AggregationFnDef<any, any, unknown, RangeValue | undefined>;
/**
 * Finds the maximum numeric or Date value from the selected rows. Invalid value
 * types are ignored; `NaN` preserves the legacy numeric seeding behavior.
 */
declare const aggregationFn_max: AggregationFnDef<any, any, unknown, RangeValue | undefined>;
/**
 * Finds the minimum and maximum numeric or Date values from the selected rows.
 * Empty inputs return
 * `[undefined, undefined]`, preserving the previous built-in result shape.
 */
declare const aggregationFn_extent: AggregationFnDef<any, any, unknown, [RangeValue | undefined, RangeValue | undefined]>;
/**
 * Averages number and number-like row values. Nullish and non-numeric values
 * are ignored; other values retain the legacy unary-plus coercion behavior.
 */
declare const aggregationFn_mean: AggregationFnDef<any, any, unknown, number | undefined>;
/**
 * Computes the median of the numeric row values. Non-numeric values are
 * ignored, matching the `sum`/`min`/`max`/`mean` aggregations. Returns
 * `undefined` when no numeric values remain.
 */
declare const aggregationFn_median: AggregationFnDef<any, any, unknown, number | undefined>;
/** Collects distinct row values using JavaScript `Set` semantics. */
declare const aggregationFn_unique: AggregationFnDef<any, any, unknown, unknown[]>;
/** Counts distinct row values using JavaScript `Set` semantics. */
declare const aggregationFn_uniqueCount: AggregationFnDef<any, any, unknown, number>;
/** Counts rows, independently of the column's values. */
declare const aggregationFn_count: AggregationFnDef<any, any, unknown, number>;
/** Returns the first row's value, including a nullish value. */
declare const aggregationFn_first: AggregationFnDef<any, any, unknown, unknown>;
/** Returns the last row's value, including a nullish value. */
declare const aggregationFn_last: AggregationFnDef<any, any, unknown, unknown>;
/**
 * Full built-in registry. Register individual definitions for tree-shaking.
 *
 * @deprecated Import individual `aggregationFn_*` definitions instead for a
 * smaller bundle. This registry remains available for compatibility.
 */
declare const aggregationFns: {
  sum: AggregationFnDef<any, any, unknown, number>;
  min: AggregationFnDef<any, any, unknown, RangeValue | undefined>;
  max: AggregationFnDef<any, any, unknown, RangeValue | undefined>;
  extent: AggregationFnDef<any, any, unknown, [RangeValue | undefined, RangeValue | undefined]>;
  mean: AggregationFnDef<any, any, unknown, number | undefined>;
  median: AggregationFnDef<any, any, unknown, number | undefined>;
  unique: AggregationFnDef<any, any, unknown, unknown[]>;
  uniqueCount: AggregationFnDef<any, any, unknown, number>;
  count: AggregationFnDef<any, any, unknown, number>;
  first: AggregationFnDef<any, any, unknown, unknown>;
  last: AggregationFnDef<any, any, unknown, unknown>;
};
type BuiltInAggregationFn = keyof typeof aggregationFns;
//#endregion
export { BuiltInAggregationFn, aggregationFn_count, aggregationFn_extent, aggregationFn_first, aggregationFn_last, aggregationFn_max, aggregationFn_mean, aggregationFn_median, aggregationFn_min, aggregationFn_sum, aggregationFn_unique, aggregationFn_uniqueCount, aggregationFns };