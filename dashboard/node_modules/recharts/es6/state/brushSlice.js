import { createSlice } from '@reduxjs/toolkit';

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
export var brushSlice = createSlice({
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
var setBrushSettings = brushSlice.actions.setBrushSettings;
export { setBrushSettings };
export var brushReducer = brushSlice.reducer;