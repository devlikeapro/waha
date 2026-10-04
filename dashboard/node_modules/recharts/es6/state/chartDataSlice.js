import { createSlice } from '@reduxjs/toolkit';
import { castDraft } from 'immer';

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

export var initialChartDataState = {
  chartData: undefined,
  computedData: undefined,
  dataStartIndex: 0,
  dataEndIndex: 0
};
var chartDataSlice = createSlice({
  name: 'chartData',
  initialState: initialChartDataState,
  reducers: {
    setChartData(state, action) {
      state.chartData = castDraft(action.payload);
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
  setChartData = _chartDataSlice$actio.setChartData,
  setDataStartEndIndexes = _chartDataSlice$actio.setDataStartEndIndexes,
  setComputedData = _chartDataSlice$actio.setComputedData;
export { setChartData, setDataStartEndIndexes, setComputedData };
export var chartDataReducer = chartDataSlice.reducer;