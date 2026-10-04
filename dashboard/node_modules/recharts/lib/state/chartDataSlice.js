"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDataStartEndIndexes = exports.setComputedData = exports.setChartData = exports.initialChartDataState = exports.chartDataReducer = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _immer = require("immer");
/**
 * This is the data that's coming through main chart `data` prop
 * Recharts is very flexible in what it accepts so the type is very flexible too.
 * This will typically be an object, and various components will provide various `dataKey`
 * that dictates how to pull data from that object.
 *
 * TL;DR: before dataKey
 *
 * @inline
 */

/**
 * So this is the same unknown type as ChartData but this is after the dataKey has been applied.
 * We still don't know what the type is - that depends on what exactly it was before the dataKey application,
 * and the dataKey can return whatever anyway - but let's keep it separate as a form of documentation.
 *
 * TL;DR: ChartData after dataKey.
 */

var initialChartDataState = exports.initialChartDataState = {
  chartData: undefined,
  computedData: undefined,
  dataStartIndex: 0,
  dataEndIndex: 0
};
var chartDataSlice = (0, _toolkit.createSlice)({
  name: 'chartData',
  initialState: initialChartDataState,
  reducers: {
    setChartData(state, action) {
      state.chartData = (0, _immer.castDraft)(action.payload);
      if (action.payload == null) {
        state.dataStartIndex = 0;
        state.dataEndIndex = 0;
        return;
      }
      if (action.payload.length > 0 && state.dataEndIndex !== action.payload.length - 1) {
        state.dataEndIndex = action.payload.length - 1;
      }
    },
    setComputedData(state, action) {
      state.computedData = action.payload;
    },
    setDataStartEndIndexes(state, action) {
      var _action$payload = action.payload,
        startIndex = _action$payload.startIndex,
        endIndex = _action$payload.endIndex;
      if (startIndex != null) {
        state.dataStartIndex = startIndex;
      }
      if (endIndex != null) {
        state.dataEndIndex = endIndex;
      }
    }
  }
});
var _chartDataSlice$actio = chartDataSlice.actions,
  setChartData = exports.setChartData = _chartDataSlice$actio.setChartData,
  setDataStartEndIndexes = exports.setDataStartEndIndexes = _chartDataSlice$actio.setDataStartEndIndexes,
  setComputedData = exports.setComputedData = _chartDataSlice$actio.setComputedData;
var chartDataReducer = exports.chartDataReducer = chartDataSlice.reducer;