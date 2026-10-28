"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeRadiusAxis = exports.removeAngleAxis = exports.polarAxisReducer = exports.addRadiusAxis = exports.addAngleAxis = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _immer = require("immer");
var initialState = {
  radiusAxis: {},
  angleAxis: {}
};
var polarAxisSlice = (0, _toolkit.createSlice)({
  name: 'polarAxis',
  initialState,
  reducers: {
    addRadiusAxis(state, action) {
      state.radiusAxis[action.payload.id] = (0, _immer.castDraft)(action.payload);
    },
    removeRadiusAxis(state, action) {
      delete state.radiusAxis[action.payload.id];
    },
    addAngleAxis(state, action) {
      state.angleAxis[action.payload.id] = (0, _immer.castDraft)(action.payload);
    },
    removeAngleAxis(state, action) {
      delete state.angleAxis[action.payload.id];
    }
  }
});
var _polarAxisSlice$actio = polarAxisSlice.actions,
  addRadiusAxis = exports.addRadiusAxis = _polarAxisSlice$actio.addRadiusAxis,
  removeRadiusAxis = exports.removeRadiusAxis = _polarAxisSlice$actio.removeRadiusAxis,
  addAngleAxis = exports.addAngleAxis = _polarAxisSlice$actio.addAngleAxis,
  removeAngleAxis = exports.removeAngleAxis = _polarAxisSlice$actio.removeAngleAxis;
var polarAxisReducer = exports.polarAxisReducer = polarAxisSlice.reducer;