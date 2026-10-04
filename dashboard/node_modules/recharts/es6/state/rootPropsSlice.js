import { createSlice } from '@reduxjs/toolkit';

/**
 * These are chart options that users can choose - which means they can also
 * choose to change them which should trigger a re-render.
 */

export var initialState = {
  accessibilityLayer: true,
  barCategoryGap: '10%',
  barGap: 4,
  barSize: undefined,
  className: undefined,
  maxBarSize: undefined,
  stackOffset: 'none',
  syncId: undefined,
  syncMethod: 'index',
  baseValue: undefined,
  reverseStackOrder: false
};
var rootPropsSlice = createSlice({
  name: 'rootProps',
  initialState,
  reducers: {
    updateOptions: (state, action) => {
      var _action$payload$barGa;
      state.accessibilityLayer = action.payload.accessibilityLayer;
      state.barCategoryGap = action.payload.barCategoryGap;
      state.barGap = (_action$payload$barGa = action.payload.barGap) !== null && _action$payload$barGa !== void 0 ? _action$payload$barGa : initialState.barGap;
      state.barSize = action.payload.barSize;
      state.maxBarSize = action.payload.maxBarSize;
      state.stackOffset = action.payload.stackOffset;
      state.syncId = action.payload.syncId;
      state.syncMethod = action.payload.syncMethod;
      state.className = action.payload.className;
      state.baseValue = action.payload.baseValue;
      state.reverseStackOrder = action.payload.reverseStackOrder;
    }
  }
});
export var rootPropsReducer = rootPropsSlice.reducer;
var updateOptions = rootPropsSlice.actions.updateOptions;
export { updateOptions };