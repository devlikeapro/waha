"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceErrorBar = exports.removeErrorBar = exports.errorBarReducer = exports.addErrorBar = void 0;
var _toolkit = require("@reduxjs/toolkit");
/**
 * ErrorBars have lot more settings but all the others are scoped to the component itself.
 * Only some of them required to be reported to the global store because XAxis and YAxis need to know
 * if the error bar is contributing to extending the axis domain.
 */

var initialState = {};
var errorBarSlice = (0, _toolkit.createSlice)({
  name: 'errorBars',
  initialState,
  reducers: {
    addErrorBar: (state, action) => {
      var _action$payload = action.payload,
        itemId = _action$payload.itemId,
        errorBar = _action$payload.errorBar;
      if (!state[itemId]) {
        state[itemId] = [];
      }
      state[itemId].push(errorBar);
    },
    replaceErrorBar: (state, action) => {
      var _action$payload2 = action.payload,
        itemId = _action$payload2.itemId,
        prev = _action$payload2.prev,
        next = _action$payload2.next;
      if (state[itemId]) {
        state[itemId] = state[itemId].map(e => e.dataKey === prev.dataKey && e.direction === prev.direction ? next : e);
      }
    },
    removeErrorBar: (state, action) => {
      var _action$payload3 = action.payload,
        itemId = _action$payload3.itemId,
        errorBar = _action$payload3.errorBar;
      if (state[itemId]) {
        state[itemId] = state[itemId].filter(e => e.dataKey !== errorBar.dataKey || e.direction !== errorBar.direction);
      }
    }
  }
});
var _errorBarSlice$action = errorBarSlice.actions,
  addErrorBar = exports.addErrorBar = _errorBarSlice$action.addErrorBar,
  replaceErrorBar = exports.replaceErrorBar = _errorBarSlice$action.replaceErrorBar,
  removeErrorBar = exports.removeErrorBar = _errorBarSlice$action.removeErrorBar;
var errorBarReducer = exports.errorBarReducer = errorBarSlice.reducer;