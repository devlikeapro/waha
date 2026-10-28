/**
 * @fileOverview this stores actually rendered ticks.
 *
 * What we do is that we have the domain -> ticks mapping in the cartesianSlice,
 * which is fine but the result then goes to CartesianAxis where we use DOM measurement
 * to decide which ticks to actually render.
 *
 * This renderedTickSlice stores those actually rendered ticks so that we can return them from a hook later.
 */
import { createSlice } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
var initialState = {
  xAxis: {},
  yAxis: {}
};
export var renderedTicksSlice = createSlice({
  name: 'renderedTicks',
  initialState,
  reducers: {
    setRenderedTicks: (state, action) => {
      var _action$payload = action.payload,
        axisType = _action$payload.axisType,
        axisId = _action$payload.axisId,
        ticks = _action$payload.ticks;
      state[axisType][axisId] = castDraft(ticks);
    },
    removeRenderedTicks: (state, action) => {
      var _action$payload2 = action.payload,
        axisType = _action$payload2.axisType,
        axisId = _action$payload2.axisId;
      delete state[axisType][axisId];
    }
  }
});
var _renderedTicksSlice$a = renderedTicksSlice.actions,
  setRenderedTicks = _renderedTicksSlice$a.setRenderedTicks,
  removeRenderedTicks = _renderedTicksSlice$a.removeRenderedTicks;
export { setRenderedTicks, removeRenderedTicks };
export var renderedTicksReducer = renderedTicksSlice.reducer;