import { RechartsRootState } from '../store';
import { ChartData, ChartDataState } from '../chartDataSlice';
/**
 * This selector always returns the data with the indexes set by a Brush.
 * Trouble is, that might or might not be what you want.
 *
 * In charts with Brush, you will sometimes want to select the full range of data, and sometimes the one decided by the Brush
 * - even if the Brush is active, the panorama inside the Brush should show the full range of data.
 *
 * So instead of this selector, consider using either selectChartDataAndAlwaysIgnoreIndexes or selectChartDataWithIndexesIfNotInPanorama
 *
 * @param state RechartsRootState
 * @returns data defined on the chart root element, such as BarChart or ScatterChart
 */
export declare const selectChartDataWithIndexes: (state: RechartsRootState) => ChartDataState;
/**
 * This selector will always return the full range of data, ignoring the indexes set by a Brush.
 * Useful for when you want to render the full range of data, even if a Brush is active.
 * For example: in the Brush panorama, in Legend, in Tooltip.
 */
export declare const selectChartDataAndAlwaysIgnoreIndexes: (state: RechartsRootState) => ChartDataState;
export declare const selectChartDataWithIndexesIfNotInPanoramaPosition4: (state: RechartsRootState, _unused1: unknown, _unused2: unknown, isPanorama: boolean) => ChartDataState;
export declare const selectChartDataWithIndexesIfNotInPanoramaPosition3: (state: RechartsRootState, _unused1: unknown, isPanorama: boolean) => ChartDataState;
/**
 * Returns the chart-level data slice (respecting Brush indexes), memoized by content so that
 * spurious Immer reference changes (e.g. dispatching `setChartData(undefined)` when data is
 * already `undefined`) do not propagate to downstream selectors.
 *
 * Used when a selector needs chart-level data but must avoid extra recomputes when the
 * data content has not actually changed.
 */
export declare const selectChartDataSliceIfNotInPanorama: (state: RechartsRootState, _unused1: unknown, _unused2: unknown, isPanorama: boolean) => ChartData;
/**
 * Returns the chart-level data slice (ignoring Brush indexes), memoized by content.
 * Used in tooltip and polar selectors that always need the full data range.
 */
export declare const selectChartDataSliceIgnoringIndexes: (state: RechartsRootState) => ChartData;
/**
 * Returns the chart-level data slice (with Brush indexes applied), memoized by content.
 * Used in tooltip selectors.
 */
export declare const selectChartDataSliceWithIndexes: (state: RechartsRootState) => ChartData;
