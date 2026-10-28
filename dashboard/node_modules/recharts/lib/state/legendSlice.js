"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLegendSize = exports.setLegendSettings = exports.replaceLegendPayload = exports.removeLegendPayload = exports.legendReducer = exports.addLegendPayload = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _immer = require("immer");
/**
 * The properties inside this state update independently of each other and quite often.
 * When selecting, never select the whole state because you are going to get
 * unnecessary re-renders. Select only the properties you need.
 *
 * This is why this state type is not exported - don't use it directly.
 */

var initialState = {
  settings: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom',
    itemSorter: 'value',
    position: undefined,
    offset: 0
  },
  size: {
    width: 0,
    height: 0
  },
  payload: []
};
var legendSlice = (0, _toolkit.createSlice)({
  name: 'legend',
  initialState,
  reducers: {
    setLegendSize(state, action) {
      state.size.width = action.payload.width;
      state.size.height = action.payload.height;
    },
    setLegendSettings(state, action) {
      state.settings.align = action.payload.align;
      state.settings.layout = action.payload.layout;
      state.settings.verticalAlign = action.payload.verticalAlign;
      state.settings.itemSorter = action.payload.itemSorter;
      state.settings.position = action.payload.position;
      state.settings.offset = action.payload.offset;
    },
    addLegendPayload: {
      reducer(state, action) {
        state.payload.push((0, _immer.castDraft)(action.payload));
      },
      prepare: (0, _toolkit.prepareAutoBatched)()
    },
    replaceLegendPayload: {
      reducer(state, action) {
        var _action$payload = action.payload,
          prev = _action$payload.prev,
          next = _action$payload.next;
        var index = (0, _toolkit.current)(state).payload.indexOf((0, _immer.castDraft)(prev));
        if (index > -1) {
          state.payload[index] = (0, _immer.castDraft)(next);
        }
      },
      prepare: (0, _toolkit.prepareAutoBatched)()
    },
    removeLegendPayload: {
      reducer(state, action) {
        var index = (0, _toolkit.current)(state).payload.indexOf((0, _immer.castDraft)(action.payload));
        if (index > -1) {
          state.payload.splice(index, 1);
        }
      },
      prepare: (0, _toolkit.prepareAutoBatched)()
    }
  }
});
var _legendSlice$actions = legendSlice.actions,
  setLegendSize = exports.setLegendSize = _legendSlice$actions.setLegendSize,
  setLegendSettings = exports.setLegendSettings = _legendSlice$actions.setLegendSettings,
  addLegendPayload = exports.addLegendPayload = _legendSlice$actions.addLegendPayload,
  replaceLegendPayload = exports.replaceLegendPayload = _legendSlice$actions.replaceLegendPayload,
  removeLegendPayload = exports.removeLegendPayload = _legendSlice$actions.removeLegendPayload;
var legendReducer = exports.legendReducer = legendSlice.reducer;