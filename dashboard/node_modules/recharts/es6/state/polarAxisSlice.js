import { createSlice } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
var initialState = {
  radiusAxis: {},
  angleAxis: {}
};
var polarAxisSlice = createSlice({
  name: 'polarAxis',
  initialState,
  reducers: {
    addRadiusAxis(state, action) {
      state.radiusAxis[action.payload.id] = castDraft(action.payload);
    },
    removeRadiusAxis(state, action) {
      delete state.radiusAxis[action.payload.id];
    },
    addAngleAxis(state, action) {
      state.angleAxis[action.payload.id] = castDraft(action.payload);
    },
    removeAngleAxis(state, action) {
      delete state.angleAxis[action.payload.id];
    }
  }
});
var _polarAxisSlice$actio = polarAxisSlice.actions,
  addRadiusAxis = _polarAxisSlice$actio.addRadiusAxis,
  removeRadiusAxis = _polarAxisSlice$actio.removeRadiusAxis,
  addAngleAxis = _polarAxisSlice$actio.addAngleAxis,
  removeAngleAxis = _polarAxisSlice$actio.removeAngleAxis;
export { addRadiusAxis, removeRadiusAxis, addAngleAxis, removeAngleAxis };
export var polarAxisReducer = polarAxisSlice.reducer;