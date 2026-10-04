"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionsReducer = exports.createEventEmitter = exports.arrayTooltipSearcher = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _DataUtils = require("../util/DataUtils");
/**
 * These chart options are decided internally, by Recharts,
 * and will not change during the lifetime of the chart.
 *
 * Changing these options can be done by swapping the root element
 * which will make a brand-new Redux store.
 *
 * If you want to store options that can be changed by the user,
 * use UpdatableChartOptions in rootPropsSlice.ts.
 */

var arrayTooltipSearcher = (data, strIndex) => {
  if (!strIndex) return undefined;
  if (!Array.isArray(data)) return undefined;
  var numIndex = Number.parseInt(strIndex, 10);
  if ((0, _DataUtils.isNan)(numIndex)) {
    return undefined;
  }
  return data[numIndex];
};
exports.arrayTooltipSearcher = arrayTooltipSearcher;
var initialState = {
  chartName: '',
  tooltipPayloadSearcher: () => undefined,
  eventEmitter: undefined,
  defaultTooltipEventType: 'axis'
};
var optionsSlice = (0, _toolkit.createSlice)({
  name: 'options',
  initialState,
  reducers: {
    createEventEmitter: state => {
      if (state.eventEmitter == null) {
        state.eventEmitter = Symbol('rechartsEventEmitter');
      }
    }
  }
});
var optionsReducer = exports.optionsReducer = optionsSlice.reducer;
var createEventEmitter = exports.createEventEmitter = optionsSlice.actions.createEventEmitter;