"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setEventSettings = exports.initialEventSettingsState = exports.eventSettingsReducer = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _immer = require("immer");
var initialEventSettingsState = exports.initialEventSettingsState = {
  throttleDelay: 'raf',
  throttledEvents: ['mousemove', 'touchmove', 'pointermove', 'scroll', 'wheel']
};
var eventSettingsSlice = (0, _toolkit.createSlice)({
  name: 'eventSettings',
  initialState: initialEventSettingsState,
  reducers: {
    setEventSettings: (state, action) => {
      if (action.payload.throttleDelay != null) {
        state.throttleDelay = action.payload.throttleDelay;
      }
      if (action.payload.throttledEvents != null) {
        state.throttledEvents = (0, _immer.castDraft)(action.payload.throttledEvents);
      }
    }
  }
});
var setEventSettings = exports.setEventSettings = eventSettingsSlice.actions.setEventSettings;
var eventSettingsReducer = exports.eventSettingsReducer = eventSettingsSlice.reducer;