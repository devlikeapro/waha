import { createSlice, current, prepareAutoBatched } from '@reduxjs/toolkit';
import { castDraft } from 'immer';

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
var legendSlice = createSlice({
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
        state.payload.push(castDraft(action.payload));
      },
      prepare: prepareAutoBatched()
    },
    replaceLegendPayload: {
      reducer(state, action) {
        var _action$payload = action.payload,
          prev = _action$payload.prev,
          next = _action$payload.next;
        var index = current(state).payload.indexOf(castDraft(prev));
        if (index > -1) {
          state.payload[index] = castDraft(next);
        }
      },
      prepare: prepareAutoBatched()
    },
    removeLegendPayload: {
      reducer(state, action) {
        var index = current(state).payload.indexOf(castDraft(action.payload));
        if (index > -1) {
          state.payload.splice(index, 1);
        }
      },
      prepare: prepareAutoBatched()
    }
  }
});
var _legendSlice$actions = legendSlice.actions,
  setLegendSize = _legendSlice$actions.setLegendSize,
  setLegendSettings = _legendSlice$actions.setLegendSettings,
  addLegendPayload = _legendSlice$actions.addLegendPayload,
  replaceLegendPayload = _legendSlice$actions.replaceLegendPayload,
  removeLegendPayload = _legendSlice$actions.removeLegendPayload;
export { setLegendSize, setLegendSettings, addLegendPayload, replaceLegendPayload, removeLegendPayload };
export var legendReducer = legendSlice.reducer;