import { createSlice, current, prepareAutoBatched } from '@reduxjs/toolkit';
import { castDraft } from 'immer';

/**
 * Unique ID of the graphical item.
 * This is used to identify the graphical item in the state and in the React tree.
 * This is required for every graphical item - it's either provided by the user or generated automatically.
 */

var initialState = {
  cartesianItems: [],
  polarItems: []
};
var graphicalItemsSlice = createSlice({
  name: 'graphicalItems',
  initialState,
  reducers: {
    addCartesianGraphicalItem: {
      reducer(state, action) {
        state.cartesianItems.push(castDraft(action.payload));
      },
      prepare: prepareAutoBatched()
    },
    replaceCartesianGraphicalItem: {
      reducer(state, action) {
        var _action$payload = action.payload,
          prev = _action$payload.prev,
          next = _action$payload.next;
        var index = current(state).cartesianItems.indexOf(castDraft(prev));
        if (index > -1) {
          state.cartesianItems[index] = castDraft(next);
        }
      },
      prepare: prepareAutoBatched()
    },
    removeCartesianGraphicalItem: {
      reducer(state, action) {
        var index = current(state).cartesianItems.indexOf(castDraft(action.payload));
        if (index > -1) {
          state.cartesianItems.splice(index, 1);
        }
      },
      prepare: prepareAutoBatched()
    },
    addPolarGraphicalItem: {
      reducer(state, action) {
        state.polarItems.push(castDraft(action.payload));
      },
      prepare: prepareAutoBatched()
    },
    removePolarGraphicalItem: {
      reducer(state, action) {
        var index = current(state).polarItems.indexOf(castDraft(action.payload));
        if (index > -1) {
          state.polarItems.splice(index, 1);
        }
      },
      prepare: prepareAutoBatched()
    },
    replacePolarGraphicalItem: {
      reducer(state, action) {
        var _action$payload2 = action.payload,
          prev = _action$payload2.prev,
          next = _action$payload2.next;
        var index = current(state).polarItems.indexOf(castDraft(prev));
        if (index > -1) {
          state.polarItems[index] = castDraft(next);
        }
      },
      prepare: prepareAutoBatched()
    }
  }
});
var _graphicalItemsSlice$ = graphicalItemsSlice.actions,
  addCartesianGraphicalItem = _graphicalItemsSlice$.addCartesianGraphicalItem,
  replaceCartesianGraphicalItem = _graphicalItemsSlice$.replaceCartesianGraphicalItem,
  removeCartesianGraphicalItem = _graphicalItemsSlice$.removeCartesianGraphicalItem,
  addPolarGraphicalItem = _graphicalItemsSlice$.addPolarGraphicalItem,
  removePolarGraphicalItem = _graphicalItemsSlice$.removePolarGraphicalItem,
  replacePolarGraphicalItem = _graphicalItemsSlice$.replacePolarGraphicalItem;
export { addCartesianGraphicalItem, replaceCartesianGraphicalItem, removeCartesianGraphicalItem, addPolarGraphicalItem, removePolarGraphicalItem, replacePolarGraphicalItem };
export var graphicalItemsReducer = graphicalItemsSlice.reducer;