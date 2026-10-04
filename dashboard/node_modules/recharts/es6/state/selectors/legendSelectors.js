import { createSelector } from 'reselect';
import sortBy from 'es-toolkit/compat/sortBy';
export var selectLegendSettings = state => state.legend.settings;
export var selectLegendSize = state => state.legend.size;
var selectAllLegendPayload2DArray = state => state.legend.payload;
export var selectLegendPayload = createSelector([selectAllLegendPayload2DArray, selectLegendSettings], (payloads, _ref) => {
  var itemSorter = _ref.itemSorter;
  var flat = payloads.flat(1);
  return itemSorter ? sortBy(flat, itemSorter) : flat;
});