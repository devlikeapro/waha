import { createSlice } from '@reduxjs/toolkit';
import { isNan } from '../util/DataUtils';

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

export var arrayTooltipSearcher = (data, strIndex) => {
  if (!strIndex) return undefined;
  if (!Array.isArray(data)) return undefined;
  var numIndex = Number.parseInt(strIndex, 10);
  if (isNan(numIndex)) {
    return undefined;
  }
  return data[numIndex];
};
var initialState = {
  chartName: '',
  tooltipPayloadSearcher: () => undefined,
  eventEmitter: undefined,
  defaultTooltipEventType: 'axis'
};
var optionsSlice = createSlice({
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
export var optionsReducer = optionsSlice.reducer;
var createEventEmitter = optionsSlice.actions.createEventEmitter;
export { createEventEmitter };