"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePolarOptions = exports.polarOptionsReducer = void 0;
var _toolkit = require("@reduxjs/toolkit");
var initialState = null;
var reducers = {
  updatePolarOptions: (state, action) => {
    if (state === null) {
      return action.payload;
    }
    state.startAngle = action.payload.startAngle;
    state.endAngle = action.payload.endAngle;
    state.cx = action.payload.cx;
    state.cy = action.payload.cy;
    state.innerRadius = action.payload.innerRadius;
    state.outerRadius = action.payload.outerRadius;
    return state;
  }
};
var polarOptionsSlice = (0, _toolkit.createSlice)({
  name: 'polarOptions',
  initialState,
  reducers
});
var updatePolarOptions = exports.updatePolarOptions = polarOptionsSlice.actions.updatePolarOptions;
var polarOptionsReducer = exports.polarOptionsReducer = polarOptionsSlice.reducer;