"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectLegendSize = exports.selectLegendSettings = exports.selectLegendPayload = void 0;
var _reselect = require("reselect");
var _sortBy = _interopRequireDefault(require("es-toolkit/compat/sortBy"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var selectLegendSettings = state => state.legend.settings;
exports.selectLegendSettings = selectLegendSettings;
var selectLegendSize = state => state.legend.size;
exports.selectLegendSize = selectLegendSize;
var selectAllLegendPayload2DArray = state => state.legend.payload;
var selectLegendPayload = exports.selectLegendPayload = (0, _reselect.createSelector)([selectAllLegendPayload2DArray, selectLegendSettings], (payloads, _ref) => {
  var itemSorter = _ref.itemSorter;
  var flat = payloads.flat(1);
  return itemSorter ? (0, _sortBy.default)(flat, itemSorter) : flat;
});