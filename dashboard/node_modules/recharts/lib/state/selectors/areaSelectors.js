"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectGraphicalItemStackedData = exports.selectArea = void 0;
var _reselect = require("reselect");
var _Area = require("../../cartesian/Area");
var _axisSelectors = require("./axisSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _dataSelectors = require("./dataSelectors");
var _ChartUtils = require("../../util/ChartUtils");
var _DataUtils = require("../../util/DataUtils");
var _getStackSeriesIdentifier = require("../../util/stacks/getStackSeriesIdentifier");
var _rootPropsSelectors = require("./rootPropsSelectors");
var _graphicalItemSelectors = require("./graphicalItemSelectors");
var selectXAxisWithScale = (state, graphicalItemId, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', (0, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId)(state, graphicalItemId), isPanorama);
var selectXAxisTicks = (state, graphicalItemId, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', (0, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId)(state, graphicalItemId), isPanorama);
var selectYAxisWithScale = (state, graphicalItemId, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', (0, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId)(state, graphicalItemId), isPanorama);
var selectYAxisTicks = (state, graphicalItemId, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', (0, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId)(state, graphicalItemId), isPanorama);
var selectBandSize = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if ((0, _ChartUtils.isCategoricalAxis)(layout, 'xAxis')) {
    return (0, _ChartUtils.getBandSizeOfAxis)(xAxis, xAxisTicks, false);
  }
  return (0, _ChartUtils.getBandSizeOfAxis)(yAxis, yAxisTicks, false);
});
var pickAreaId = (_state, id) => id;

/*
 * There is a race condition problem because we read some data from props and some from the state.
 * The state is updated through a dispatch and is one render behind,
 * and so we have this weird one tick render where the displayedData in one selector have the old dataKey
 * but the new dataKey in another selector.
 *
 * A proper fix is to either move everything into the state, or read the dataKey always from props
 * - but this is a smaller change.
 */
var selectSynchronisedAreaSettings = (0, _reselect.createSelector)([_axisSelectors.selectUnfilteredCartesianItems, pickAreaId], (graphicalItems, id) => graphicalItems.filter(item => item.type === 'area').find(item => item.id === id));
var selectNumericalAxisType = state => {
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  var isXAxisCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, 'xAxis');
  return isXAxisCategorical ? 'yAxis' : 'xAxis';
};
var selectNumericalAxisIdFromGraphicalItemId = (state, graphicalItemId) => {
  var axisType = selectNumericalAxisType(state);
  if (axisType === 'yAxis') {
    return (0, _graphicalItemSelectors.selectYAxisIdFromGraphicalItemId)(state, graphicalItemId);
  }
  return (0, _graphicalItemSelectors.selectXAxisIdFromGraphicalItemId)(state, graphicalItemId);
};
var selectNumericalAxisStackGroups = (state, graphicalItemId, isPanorama) => (0, _axisSelectors.selectStackGroups)(state, selectNumericalAxisType(state), selectNumericalAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectGraphicalItemStackedData = exports.selectGraphicalItemStackedData = (0, _reselect.createSelector)([selectSynchronisedAreaSettings, selectNumericalAxisStackGroups], (areaSettings, stackGroups) => {
  var _stackGroups$stackId;
  if (areaSettings == null || stackGroups == null) {
    return undefined;
  }
  var stackId = areaSettings.stackId;
  var stackSeriesIdentifier = (0, _getStackSeriesIdentifier.getStackSeriesIdentifier)(areaSettings);
  if (stackId == null || stackSeriesIdentifier == null) {
    return undefined;
  }
  var groups = (_stackGroups$stackId = stackGroups[stackId]) === null || _stackGroups$stackId === void 0 ? void 0 : _stackGroups$stackId.stackedData;
  var found = groups === null || groups === void 0 ? void 0 : groups.find(v => v.key === stackSeriesIdentifier);
  if (found == null) {
    return undefined;
  }
  return found.map(item => [item[0], item[1]]);
});

/*
 * All dataKeys of the stack group that this graphical item belongs to.
 * computeArea needs them to tell apart data points where only this series is null
 * (rendered as zero contribution to keep the stack consistent)
 * from data points where the whole stack is null
 * (a break point that connectNulls may connect across).
 */
var selectStackDataKeys = (0, _reselect.createSelector)([selectSynchronisedAreaSettings, selectNumericalAxisStackGroups], (areaSettings, stackGroups) => {
  if (areaSettings == null || areaSettings.stackId == null || stackGroups == null) {
    return undefined;
  }
  var group = stackGroups[areaSettings.stackId];
  if (group == null) {
    return undefined;
  }
  return group.graphicalItems.map(item => item.dataKey).filter(_DataUtils.isNotNil);
});
var selectArea = exports.selectArea = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectGraphicalItemStackedData, _dataSelectors.selectChartDataWithIndexesIfNotInPanoramaPosition3, selectBandSize, selectSynchronisedAreaSettings, _rootPropsSelectors.selectChartBaseValue, selectStackDataKeys], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, _ref, bandSize, areaSettings, chartBaseValue, stackDataKeys) => {
  var chartData = _ref.chartData,
    dataStartIndex = _ref.dataStartIndex,
    dataEndIndex = _ref.dataEndIndex;
  if (areaSettings == null || layout !== 'horizontal' && layout !== 'vertical' || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null) {
    return undefined;
  }
  var data = areaSettings.data;
  var displayedData;
  if (data && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return undefined;
  }
  return (0, _Area.computeArea)({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataStartIndex,
    areaSettings,
    stackedData,
    displayedData,
    chartBaseValue,
    bandSize,
    stackDataKeys
  });
});