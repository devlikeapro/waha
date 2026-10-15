"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectXAxisIdFromGraphicalItemId = selectXAxisIdFromGraphicalItemId;
exports.selectYAxisIdFromGraphicalItemId = selectYAxisIdFromGraphicalItemId;
var _cartesianAxisSlice = require("../cartesianAxisSlice");
function selectXAxisIdFromGraphicalItemId(state, id) {
  var _state$graphicalItems, _state$graphicalItems2;
  return (_state$graphicalItems = (_state$graphicalItems2 = state.graphicalItems.cartesianItems.find(item => item.id === id)) === null || _state$graphicalItems2 === void 0 ? void 0 : _state$graphicalItems2.xAxisId) !== null && _state$graphicalItems !== void 0 ? _state$graphicalItems : _cartesianAxisSlice.defaultAxisId;
}
function selectYAxisIdFromGraphicalItemId(state, id) {
  var _state$graphicalItems3, _state$graphicalItems4;
  return (_state$graphicalItems3 = (_state$graphicalItems4 = state.graphicalItems.cartesianItems.find(item => item.id === id)) === null || _state$graphicalItems4 === void 0 ? void 0 : _state$graphicalItems4.yAxisId) !== null && _state$graphicalItems3 !== void 0 ? _state$graphicalItems3 : _cartesianAxisSlice.defaultAxisId;
}