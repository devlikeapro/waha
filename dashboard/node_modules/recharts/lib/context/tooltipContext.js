"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMouseLeaveItemDispatch = exports.useMouseEnterItemDispatch = exports.useMouseClickItemDispatch = void 0;
var _hooks = require("../state/hooks");
var _tooltipSlice = require("../state/tooltipSlice");
/**
 * Some graphical items choose to provide more information to the tooltip
 * and some do not.
 */

var useMouseEnterItemDispatch = (onMouseEnterFromProps, dataKey, graphicalItemId) => {
  var dispatch = (0, _hooks.useAppDispatch)();
  return (data, index) => event => {
    onMouseEnterFromProps === null || onMouseEnterFromProps === void 0 || onMouseEnterFromProps(data, index, event);
    dispatch((0, _tooltipSlice.setActiveMouseOverItemIndex)({
      activeIndex: String(index),
      activeDataKey: dataKey,
      activeCoordinate: data.tooltipPosition,
      activeGraphicalItemId: graphicalItemId
    }));
  };
};
exports.useMouseEnterItemDispatch = useMouseEnterItemDispatch;
var useMouseLeaveItemDispatch = onMouseLeaveFromProps => {
  var dispatch = (0, _hooks.useAppDispatch)();
  return (data, index) => event => {
    onMouseLeaveFromProps === null || onMouseLeaveFromProps === void 0 || onMouseLeaveFromProps(data, index, event);
    dispatch((0, _tooltipSlice.mouseLeaveItem)());
  };
};
exports.useMouseLeaveItemDispatch = useMouseLeaveItemDispatch;
var useMouseClickItemDispatch = (onMouseClickFromProps, dataKey, graphicalItemId) => {
  var dispatch = (0, _hooks.useAppDispatch)();
  return (data, index) => event => {
    onMouseClickFromProps === null || onMouseClickFromProps === void 0 || onMouseClickFromProps(data, index, event);
    dispatch((0, _tooltipSlice.setActiveClickItemIndex)({
      activeIndex: String(index),
      activeDataKey: dataKey,
      activeCoordinate: data.tooltipPosition,
      activeGraphicalItemId: graphicalItemId
    }));
  };
};
exports.useMouseClickItemDispatch = useMouseClickItemDispatch;