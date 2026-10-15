"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAccessibilityLayer = void 0;
var _hooks = require("../state/hooks");
var useAccessibilityLayer = () => {
  var _useAppSelector;
  return (_useAppSelector = (0, _hooks.useAppSelector)(state => state.rootProps.accessibilityLayer)) !== null && _useAppSelector !== void 0 ? _useAppSelector : true;
};
exports.useAccessibilityLayer = useAccessibilityLayer;