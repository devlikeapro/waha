"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectChartDataWithIndexesIfNotInPanoramaPosition4 = exports.selectChartDataWithIndexesIfNotInPanoramaPosition3 = exports.selectChartDataWithIndexes = exports.selectChartDataSliceWithIndexes = exports.selectChartDataSliceIgnoringIndexes = exports.selectChartDataSliceIfNotInPanorama = exports.selectChartDataAndAlwaysIgnoreIndexes = void 0;
var _reselect = require("reselect");
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
var selectChartDataWithIndexes = state => state.chartData;

/**
 * This selector will always return the full range of data, ignoring the indexes set by a Brush.
 * Useful for when you want to render the full range of data, even if a Brush is active.
 * For example: in the Brush panorama, in Legend, in Tooltip.
 */
exports.selectChartDataWithIndexes = selectChartDataWithIndexes;
var selectChartDataAndAlwaysIgnoreIndexes = exports.selectChartDataAndAlwaysIgnoreIndexes = (0, _reselect.createSelector)([selectChartDataWithIndexes], dataState => {
  var dataEndIndex = dataState.chartData != null ? dataState.chartData.length - 1 : 0;
  return {
    chartData: dataState.chartData,
    computedData: dataState.computedData,
    dataEndIndex,
    dataStartIndex: 0
  };
});
var selectChartDataWithIndexesIfNotInPanoramaPosition4 = (state, _unused1, _unused2, isPanorama) => {
  if (isPanorama) {
    return selectChartDataAndAlwaysIgnoreIndexes(state);
  }
  return selectChartDataWithIndexes(state);
};
exports.selectChartDataWithIndexesIfNotInPanoramaPosition4 = selectChartDataWithIndexesIfNotInPanoramaPosition4;
var selectChartDataWithIndexesIfNotInPanoramaPosition3 = (state, _unused1, isPanorama) => {
  if (isPanorama) {
    return selectChartDataAndAlwaysIgnoreIndexes(state);
  }
  return selectChartDataWithIndexes(state);
};

/**
 * Returns the chart-level data slice (respecting Brush indexes), memoized by content so that
 * spurious Immer reference changes (e.g. dispatching `setChartData(undefined)` when data is
 * already `undefined`) do not propagate to downstream selectors.
 *
 * Used when a selector needs chart-level data but must avoid extra recomputes when the
 * data content has not actually changed.
 */
exports.selectChartDataWithIndexesIfNotInPanoramaPosition3 = selectChartDataWithIndexesIfNotInPanoramaPosition3;
var selectChartDataSliceIfNotInPanorama = exports.selectChartDataSliceIfNotInPanorama = (0, _reselect.createSelector)([selectChartDataWithIndexesIfNotInPanoramaPosition4], _ref => {
  var chartData = _ref.chartData,
    dataStartIndex = _ref.dataStartIndex,
    dataEndIndex = _ref.dataEndIndex;
  return chartData != null ? chartData.slice(dataStartIndex, dataEndIndex + 1) : [];
});

/**
 * Returns the chart-level data slice (ignoring Brush indexes), memoized by content.
 * Used in tooltip and polar selectors that always need the full data range.
 */
var selectChartDataSliceIgnoringIndexes = exports.selectChartDataSliceIgnoringIndexes = (0, _reselect.createSelector)([selectChartDataAndAlwaysIgnoreIndexes], _ref2 => {
  var chartData = _ref2.chartData,
    dataStartIndex = _ref2.dataStartIndex,
    dataEndIndex = _ref2.dataEndIndex;
  return chartData != null ? chartData.slice(dataStartIndex, dataEndIndex + 1) : [];
});

/**
 * Returns the chart-level data slice (with Brush indexes applied), memoized by content.
 * Used in tooltip selectors.
 */
var selectChartDataSliceWithIndexes = exports.selectChartDataSliceWithIndexes = (0, _reselect.createSelector)([selectChartDataWithIndexes], _ref3 => {
  var chartData = _ref3.chartData,
    dataStartIndex = _ref3.dataStartIndex,
    dataEndIndex = _ref3.dataEndIndex;
  return chartData != null ? chartData.slice(dataStartIndex, dataEndIndex + 1) : [];
});