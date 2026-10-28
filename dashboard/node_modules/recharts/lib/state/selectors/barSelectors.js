"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectStackedDataOfItem = exports.selectMaxBarSize = exports.selectBarSizeList = exports.selectBarRectangles = exports.selectBarPosition = exports.selectBarCartesianAxisSize = exports.selectBarBandSize = exports.selectAxisBandSize = exports.selectAllVisibleBars = exports.selectAllBarPositions = void 0;
var _reselect = require("reselect");
var _axisSelectors = require("./axisSelectors");
var _DataUtils = require("../../util/DataUtils");
var _ChartUtils = require("../../util/ChartUtils");
var _Bar = require("../../cartesian/Bar");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _dataSelectors = require("./dataSelectors");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _rootPropsSelectors = require("./rootPropsSelectors");
var _combineBarSizeList = require("./combiners/combineBarSizeList");
var _combineAllBarPositions = require("./combiners/combineAllBarPositions");
var _combineStackedData = require("./combiners/combineStackedData");
var _graphicalItemSelectors = require("./graphicalItemSelectors");
var _combineBarPosition = require("./combiners/combineBarPosition");
var pickIsPanorama = (_state, _id, isPanorama) => isPanorama;
var pickBarId = (_state, id) => id;
var selectSynchronisedBarSettings = (0, _reselect.createSelector)([_axisSelectors.selectUnfilteredCartesianItems, pickBarId], (graphicalItems, id) => graphicalItems.filter(item => item.type === 'bar').find(item => item.id === id));
var selectMaxBarSize = exports.selectMaxBarSize = (0, _reselect.createSelector)([selectSynchronisedBarSettings], barSettings => barSettings === null || barSettings === void 0 ? void 0 : barSettings.maxBarSize);
var pickCells = (_state, _id, _isPanorama, cells) => cells;
var selectAllVisibleBars = exports.selectAllVisibleBars = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, _axisSelectors.selectUnfilteredCartesianItems, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId, pickIsPanorama], (layout, allItems, xAxisId, yAxisId, isPanorama) => allItems.filter(i => {
  if (layout === 'horizontal') {
    return i.xAxisId === xAxisId;
  }
  return i.yAxisId === yAxisId;
}).filter(i => i.isPanorama === isPanorama).filter(i => i.hide === false).filter(i => i.type === 'bar'));
var selectBarStackGroups = (state, id, isPanorama) => {
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  var xAxisId = (0, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId)(state, id);
  var yAxisId = (0, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId)(state, id);
  if (xAxisId == null || yAxisId == null) {
    return undefined;
  }
  if (layout === 'horizontal') {
    return (0, _axisSelectors.selectStackGroups)(state, 'yAxis', yAxisId, isPanorama);
  }
  return (0, _axisSelectors.selectStackGroups)(state, 'xAxis', xAxisId, isPanorama);
};
var selectBarCartesianAxisSize = (state, id) => {
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  var xAxisId = (0, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId)(state, id);
  var yAxisId = (0, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId)(state, id);
  if (xAxisId == null || yAxisId == null) {
    return undefined;
  }
  if (layout === 'horizontal') {
    return (0, _axisSelectors.selectCartesianAxisSize)(state, 'xAxis', xAxisId);
  }
  return (0, _axisSelectors.selectCartesianAxisSize)(state, 'yAxis', yAxisId);
};
exports.selectBarCartesianAxisSize = selectBarCartesianAxisSize;
var selectBarSizeList = exports.selectBarSizeList = (0, _reselect.createSelector)([selectAllVisibleBars, _rootPropsSelectors.selectRootBarSize, selectBarCartesianAxisSize], _combineBarSizeList.combineBarSizeList);
var selectBarBandSize = (state, id, isPanorama) => {
  var _ref, _getBandSizeOfAxis;
  var barSettings = selectSynchronisedBarSettings(state, id);
  if (barSettings == null) {
    return 0;
  }
  var xAxisId = (0, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId)(state, id);
  var yAxisId = (0, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId)(state, id);
  if (xAxisId == null || yAxisId == null) {
    return 0;
  }
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  var globalMaxBarSize = (0, _rootPropsSelectors.selectRootMaxBarSize)(state);
  var childMaxBarSize = barSettings.maxBarSize;
  var maxBarSize = (0, _DataUtils.isNullish)(childMaxBarSize) ? globalMaxBarSize : childMaxBarSize;
  var axis, ticks;
  if (layout === 'horizontal') {
    axis = (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama);
    ticks = (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', xAxisId, isPanorama);
  } else {
    axis = (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama);
    ticks = (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', yAxisId, isPanorama);
  }
  return (_ref = (_getBandSizeOfAxis = (0, _ChartUtils.getBandSizeOfAxis)(axis, ticks, true)) !== null && _getBandSizeOfAxis !== void 0 ? _getBandSizeOfAxis : maxBarSize) !== null && _ref !== void 0 ? _ref : 0;
};
exports.selectBarBandSize = selectBarBandSize;
var selectAxisBandSize = (state, id, isPanorama) => {
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  var xAxisId = (0, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId)(state, id);
  var yAxisId = (0, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId)(state, id);
  if (xAxisId == null || yAxisId == null) {
    return undefined;
  }
  var axis, ticks;
  if (layout === 'horizontal') {
    axis = (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama);
    ticks = (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', xAxisId, isPanorama);
  } else {
    axis = (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama);
    ticks = (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', yAxisId, isPanorama);
  }
  return (0, _ChartUtils.getBandSizeOfAxis)(axis, ticks);
};
exports.selectAxisBandSize = selectAxisBandSize;
var selectAllBarPositions = exports.selectAllBarPositions = (0, _reselect.createSelector)([selectBarSizeList, _rootPropsSelectors.selectRootMaxBarSize, _rootPropsSelectors.selectBarGap, _rootPropsSelectors.selectBarCategoryGap, selectBarBandSize, selectAxisBandSize, selectMaxBarSize], _combineAllBarPositions.combineAllBarPositions);
var selectXAxisWithScale = (state, id, isPanorama) => {
  var xAxisId = (0, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId)(state, id);
  if (xAxisId == null) {
    return undefined;
  }
  return (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama);
};
var selectYAxisWithScale = (state, id, isPanorama) => {
  var yAxisId = (0, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId)(state, id);
  if (yAxisId == null) {
    return undefined;
  }
  return (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama);
};
var selectXAxisTicks = (state, id, isPanorama) => {
  var xAxisId = (0, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId)(state, id);
  if (xAxisId == null) {
    return undefined;
  }
  return (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', xAxisId, isPanorama);
};
var selectYAxisTicks = (state, id, isPanorama) => {
  var yAxisId = (0, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId)(state, id);
  if (yAxisId == null) {
    return undefined;
  }
  return (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', yAxisId, isPanorama);
};
var selectBarPosition = exports.selectBarPosition = (0, _reselect.createSelector)([selectAllBarPositions, selectSynchronisedBarSettings], _combineBarPosition.combineBarPosition);
var selectStackedDataOfItem = exports.selectStackedDataOfItem = (0, _reselect.createSelector)([selectBarStackGroups, selectSynchronisedBarSettings], _combineStackedData.combineStackedData);
var selectBarRectangles = exports.selectBarRectangles = (0, _reselect.createSelector)([_selectChartOffsetInternal.selectChartOffsetInternal, _selectChartOffsetInternal.selectAxisViewBox, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectBarPosition, _chartLayoutContext.selectChartLayout, _dataSelectors.selectChartDataWithIndexesIfNotInPanoramaPosition3, selectAxisBandSize, selectStackedDataOfItem, selectSynchronisedBarSettings, pickCells], (offset, axisViewBox, xAxis, yAxis, xAxisTicks, yAxisTicks, pos, layout, _ref2, bandSize, stackedData, barSettings, cells) => {
  var chartData = _ref2.chartData,
    dataStartIndex = _ref2.dataStartIndex,
    dataEndIndex = _ref2.dataEndIndex;
  if (barSettings == null || pos == null || axisViewBox == null || layout !== 'horizontal' && layout !== 'vertical' || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || bandSize == null) {
    return undefined;
  }
  var data = barSettings.data;
  var displayedData;
  if (data != null && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return undefined;
  }
  return (0, _Bar.computeBarRectangles)({
    layout,
    barSettings,
    pos,
    parentViewBox: axisViewBox,
    bandSize,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    stackedData,
    displayedData,
    offset,
    cells,
    dataStartIndex
  });
});