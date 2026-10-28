"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRenderedTicks = exports.renderedTicksSlice = exports.renderedTicksReducer = exports.removeRenderedTicks = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _immer = require("immer");
/**
 * @fileOverview this stores actually rendered ticks.
 *
 * What we do is that we have the domain -> ticks mapping in the cartesianSlice,
 * which is fine but the result then goes to CartesianAxis where we use DOM measurement
 * to decide which ticks to actually render.
 *
 * This renderedTickSlice stores those actually rendered ticks so that we can return them from a hook later.
 */

var initialState = {
  xAxis: {},
  yAxis: {}
};
var renderedTicksSlice = exports.renderedTicksSlice = (0, _toolkit.createSlice)({
  name: 'renderedTicks',
  initialState,
  reducers: {
    setRenderedTicks: (state, action) => {
      var _action$payload = action.payload,
        axisType = _action$payload.axisType,
        axisId = _action$payload.axisId,
        ticks = _action$payload.ticks;
      state[axisType][axisId] = (0, _immer.castDraft)(ticks);
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
  setRenderedTicks = exports.setRenderedTicks = _renderedTicksSlice$a.setRenderedTicks,
  removeRenderedTicks = exports.removeRenderedTicks = _renderedTicksSlice$a.removeRenderedTicks;
var renderedTicksReducer = exports.renderedTicksReducer = renderedTicksSlice.reducer;