"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBrushSettings = exports.brushSlice = exports.brushReducer = void 0;
var _toolkit = require("@reduxjs/toolkit");
/**
 * From all Brush properties, only height has a default value and will always be defined.
 * Other properties are nullable and will be computed from offsets and margins if they are not set.
 */

var initialState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
};
var brushSlice = exports.brushSlice = (0, _toolkit.createSlice)({
  name: 'brush',
  initialState,
  reducers: {
    setBrushSettings(_state, action) {
      if (action.payload == null) {
        return initialState;
      }
      return action.payload;
    }
  }
});
var setBrushSettings = exports.setBrushSettings = brushSlice.actions.setBrushSettings;
var brushReducer = exports.brushReducer = brushSlice.reducer;