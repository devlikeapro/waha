import { createSelector } from 'reselect';
import { computeLinePoints } from '../../cartesian/Line';
import { selectChartDataWithIndexesIfNotInPanoramaPosition4 } from './dataSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { selectAxisWithScale, selectTicksOfGraphicalItem, selectUnfilteredCartesianItems } from './axisSelectors';
import { getBandSizeOfAxis, isCategoricalAxis } from '../../util/ChartUtils';
var selectXAxisWithScale = (state, xAxisId, _yAxisId, isPanorama) => selectAxisWithScale(state, 'xAxis', xAxisId, isPanorama);
var selectXAxisTicks = (state, xAxisId, _yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisWithScale = (state, _xAxisId, yAxisId, isPanorama) => selectAxisWithScale(state, 'yAxis', yAxisId, isPanorama);
var selectYAxisTicks = (state, _xAxisId, yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, 'yAxis', yAxisId, isPanorama);
var selectBandSize = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if (isCategoricalAxis(layout, 'xAxis')) {
    return getBandSizeOfAxis(xAxis, xAxisTicks, false);
  }
  return getBandSizeOfAxis(yAxis, yAxisTicks, false);
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
var selectSynchronisedLineSettings = createSelector([selectUnfilteredCartesianItems, pickLineId], (graphicalItems, id) => graphicalItems.filter(isLineSettings).find(x => x.id === id));
export var selectLinePoints = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectSynchronisedLineSettings, selectBandSize, selectChartDataWithIndexesIfNotInPanoramaPosition4], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, lineSettings, bandSize, _ref) => {
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
  return computeLinePoints({
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