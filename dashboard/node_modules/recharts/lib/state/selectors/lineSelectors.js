"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectLinePoints = void 0;
var _reselect = require("reselect");
var _Line = require("../../cartesian/Line");
var _dataSelectors = require("./dataSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _axisSelectors = require("./axisSelectors");
var _ChartUtils = require("../../util/ChartUtils");
var selectXAxisWithScale = (state, xAxisId, _yAxisId, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama);
var selectXAxisTicks = (state, xAxisId, _yAxisId, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisWithScale = (state, _xAxisId, yAxisId, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama);
var selectYAxisTicks = (state, _xAxisId, yAxisId, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', yAxisId, isPanorama);
var selectBandSize = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if ((0, _ChartUtils.isCategoricalAxis)(layout, 'xAxis')) {
    return (0, _ChartUtils.getBandSizeOfAxis)(xAxis, xAxisTicks, false);
  }
  return (0, _ChartUtils.getBandSizeOfAxis)(yAxis, yAxisTicks, false);
});
var pickLineId = (_state, _xAxisId, _yAxisId, _isPanorama, id) => id;
function isLineSettings(item) {
  return item.type === 'line';
}

/*
 * There is a race condition problem because we read some data from props and some from the state.
 * The state is updated through a dispatch and is one render behind,
 * and so we have this weird one tick render where the displayedData in one selector have the old dataKey
 * but the new dataKey in another selector.
 *
 * So here instead of reading the dataKey from the props, we always read it from the state.
 */
var selectSynchronisedLineSettings = (0, _reselect.createSelector)([_axisSelectors.selectUnfilteredCartesianItems, pickLineId], (graphicalItems, id) => graphicalItems.filter(isLineSettings).find(x => x.id === id));
var selectLinePoints = exports.selectLinePoints = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectSynchronisedLineSettings, selectBandSize, _dataSelectors.selectChartDataWithIndexesIfNotInPanoramaPosition4], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, lineSettings, bandSize, _ref) => {
  var chartData = _ref.chartData,
    dataStartIndex = _ref.dataStartIndex,
    dataEndIndex = _ref.dataEndIndex;
  if (lineSettings == null || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null || layout !== 'horizontal' && layout !== 'vertical') {
    return undefined;
  }
  var dataKey = lineSettings.dataKey,
    data = lineSettings.data;
  var displayedData;
  if (data != null && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return undefined;
  }
  return (0, _Line.computeLinePoints)({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData
  });
});