"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataIndex = exports.useChartData = exports.SetComputedData = exports.ChartDataContextProvider = void 0;
var _react = require("react");
var _chartDataSlice = require("../state/chartDataSlice");
var _hooks = require("../state/hooks");
var _PanoramaContext = require("./PanoramaContext");
var ChartDataContextProvider = props => {
  var chartData = props.chartData;
  var dispatch = (0, _hooks.useAppDispatch)();
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  (0, _react.useEffect)(() => {
    if (isPanorama) {
      // Panorama mode reuses data from the main chart, so we must not overwrite it here.
      return () => {
        // there is nothing to clean up
      };
    }
    dispatch((0, _chartDataSlice.setChartData)(chartData));
    return () => {
      dispatch((0, _chartDataSlice.setChartData)(undefined));
    };
  }, [chartData, dispatch, isPanorama]);
  return null;
};
exports.ChartDataContextProvider = ChartDataContextProvider;
var SetComputedData = props => {
  var computedData = props.computedData;
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _chartDataSlice.setComputedData)(computedData));
    return () => {
      dispatch((0, _chartDataSlice.setChartData)(undefined));
    };
  }, [computedData, dispatch]);
  return null;
};
exports.SetComputedData = SetComputedData;
var selectChartData = state => state.chartData.chartData;

/**
 * "data" is the data of the chart - it has no type because this part of recharts is very flexible.
 * Basically it's an array of "something" and then there's the dataKey property in various places
 * that's meant to pull other things away from the data.
 *
 * Some charts have `data` defined on the chart root, and they will return the array through this hook.
 * For example: <ComposedChart data={data} />.
 *
 * Other charts, such as Pie, have data defined on individual graphical elements.
 * These charts will return `undefined` through this hook, and you need to read the data from children.
 * For example: <PieChart><Pie data={data} />
 *
 * Some charts also allow setting both - data on the parent, and data on the children at the same time!
 * However, this particular selector will only return the ones defined on the parent.
 *
 * @deprecated use one of the other selectors instead - which one, depends on how do you identify the applicable graphical items.
 *
 * @return data array for some charts and undefined for other
 */
var useChartData = () => (0, _hooks.useAppSelector)(selectChartData);
exports.useChartData = useChartData;
var selectDataIndex = state => {
  var _state$chartData = state.chartData,
    dataStartIndex = _state$chartData.dataStartIndex,
    dataEndIndex = _state$chartData.dataEndIndex;
  return {
    startIndex: dataStartIndex,
    endIndex: dataEndIndex
  };
};

/**
 * startIndex and endIndex are data boundaries, set through Brush.
 *
 * @return object with startIndex and endIndex
 */
var useDataIndex = () => {
  return (0, _hooks.useAppSelector)(selectDataIndex);
};
exports.useDataIndex = useDataIndex;