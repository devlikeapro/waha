"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeLine = exports.removeDot = exports.removeArea = exports.referenceElementsSlice = exports.referenceElementsReducer = exports.addLine = exports.addDot = exports.addArea = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _immer = require("immer");
var initialState = {
  dots: [],
  areas: [],
  lines: []
};
var referenceElementsSlice = exports.referenceElementsSlice = (0, _toolkit.createSlice)({
  name: 'referenceElements',
  initialState,
  reducers: {
    addDot: (state, action) => {
      state.dots.push(action.payload);
    },
    removeDot: (state, action) => {
      var index = (0, _toolkit.current)(state).dots.findIndex(dot => dot === action.payload);
      if (index !== -1) {
        state.dots.splice(index, 1);
      }
    },
    addArea: (state, action) => {
      state.areas.push(action.payload);
    },
    removeArea: (state, action) => {
      var index = (0, _toolkit.current)(state).areas.findIndex(area => area === action.payload);
      if (index !== -1) {
        state.areas.splice(index, 1);
      }
    },
    addLine: (state, action) => {
      state.lines.push((0, _immer.castDraft)(action.payload));
    },
    removeLine: (state, action) => {
      var index = (0, _toolkit.current)(state).lines.findIndex(line => line === action.payload);
      if (index !== -1) {
        state.lines.splice(index, 1);
      }
    }
  }
});
var _referenceElementsSli = referenceElementsSlice.actions,
  addDot = exports.addDot = _referenceElementsSli.addDot,
  removeDot = exports.removeDot = _referenceElementsSli.removeDot,
  addArea = exports.addArea = _referenceElementsSli.addArea,
  removeArea = exports.removeArea = _referenceElementsSli.removeArea,
  addLine = exports.addLine = _referenceElementsSli.addLine,
  removeLine = exports.removeLine = _referenceElementsSli.removeLine;
var referenceElementsReducer = exports.referenceElementsReducer = referenceElementsSlice.reducer;