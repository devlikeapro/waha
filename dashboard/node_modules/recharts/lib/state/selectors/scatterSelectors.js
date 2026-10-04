"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectScatterPoints = void 0;
var _reselect = require("reselect");
var _Scatter = require("../../cartesian/Scatter");
var _dataSelectors = require("./dataSelectors");
var _axisSelectors = require("./axisSelectors");
var selectXAxisWithScale = (state, xAxisId, _yAxisId, _zAxisId, _id, _cells, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama);
var selectXAxisTicks = (state, xAxisId, _yAxisId, _zAxisId, _id, _cells, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisWithScale = (state, _xAxisId, yAxisId, _zAxisId, _id, _cells, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama);
var selectYAxisTicks = (state, _xAxisId, yAxisId, _zAxisId, _id, _cells, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', yAxisId, isPanorama);
var selectZAxis = (state, _xAxisId, _yAxisId, zAxisId) => (0, _axisSelectors.selectZAxisWithScale)(state, 'zAxis', zAxisId, false);
var pickScatterId = (_state, _xAxisId, _yAxisId, _zAxisId, id) => id;
var pickCells = (_state, _xAxisId, _yAxisId, _zAxisId, _id, cells) => cells;
var scatterChartDataSelector = (state, _xAxisId, _yAxisId, _zAxisId, _id, _cells, isPanorama) => (0, _dataSelectors.selectChartDataWithIndexesIfNotInPanoramaPosition4)(state, undefined, undefined, isPanorama);
var selectSynchronisedScatterSettings = (0, _reselect.createSelector)([_axisSelectors.selectUnfilteredCartesianItems, pickScatterId], (graphicalItems, id) => {
  return graphicalItems.filter(item => item.type === 'scatter').find(item => item.id === id);
});
var selectScatterPoints = exports.selectScatterPoints = (0, _reselect.createSelector)([scatterChartDataSelector, selectXAxisWithScale, selectXAxisTicks, selectYAxisWithScale, selectYAxisTicks, selectZAxis, selectSynchronisedScatterSettings, pickCells], (_ref, xAxis, xAxisTicks, yAxis, yAxisTicks, zAxis, scatterSettings, cells) => {
  var chartData = _ref.chartData,
    dataStartIndex = _ref.dataStartIndex,
    dataEndIndex = _ref.dataEndIndex;
  if (scatterSettings == null) {
    return undefined;
  }
  var displayedData;
  if ((scatterSettings === null || scatterSettings === void 0 ? void 0 : scatterSettings.data) != null && scatterSettings.data.length > 0) {
    displayedData = scatterSettings.data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || (xAxisTicks === null || xAxisTicks === void 0 ? void 0 : xAxisTicks.length) === 0 || (yAxisTicks === null || yAxisTicks === void 0 ? void 0 : yAxisTicks.length) === 0) {
    return undefined;
  }
  return (0, _Scatter.computeScatterPoints)({
    displayedData,
    xAxis,
    yAxis,
    zAxis,
    scatterSettings,
    xAxisTicks,
    yAxisTicks,
    cells
  });
});