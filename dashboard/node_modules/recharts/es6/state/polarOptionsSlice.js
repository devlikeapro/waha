import { createSlice } from '@reduxjs/toolkit';
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
var polarOptionsSlice = createSlice({
  name: 'polarOptions',
  initialState,
  reducers
});
var updatePolarOptions = polarOptionsSlice.actions.updatePolarOptions;
export { updatePolarOptions };
export var polarOptionsReducer = polarOptionsSlice.reducer;