import { createSlice, current } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
var initialState = {
  dots: [],
  areas: [],
  lines: []
};
export var referenceElementsSlice = createSlice({
  name: 'referenceElements',
  initialState,
  reducers: {
    addDot: (state, action) => {
      state.dots.push(action.payload);
    },
    removeDot: (state, action) => {
      var index = current(state).dots.findIndex(dot => dot === action.payload);
      if (index !== -1) {
        state.dots.splice(index, 1);
      }
    },
    addArea: (state, action) => {
      state.areas.push(action.payload);
    },
    removeArea: (state, action) => {
      var index = current(state).areas.findIndex(area => area === action.payload);
      if (index !== -1) {
        state.areas.splice(index, 1);
      }
    },
    addLine: (state, action) => {
      state.lines.push(castDraft(action.payload));
    },
    removeLine: (state, action) => {
      var index = current(state).lines.findIndex(line => line === action.payload);
      if (index !== -1) {
        state.lines.splice(index, 1);
      }
    }
  }
});
var _referenceElementsSli = referenceElementsSlice.actions,
  addDot = _referenceElementsSli.addDot,
  removeDot = _referenceElementsSli.removeDot,
  addArea = _referenceElementsSli.addArea,
  removeArea = _referenceElementsSli.removeArea,
  addLine = _referenceElementsSli.addLine,
  removeLine = _referenceElementsSli.removeLine;
export { addDot, removeDot, addArea, removeArea, addLine, removeLine };
export var referenceElementsReducer = referenceElementsSlice.reducer;