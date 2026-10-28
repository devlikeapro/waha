"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getZIndexFromUnknown = getZIndexFromUnknown;
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
function getZIndexFromUnknown(input, defaultZIndex) {
  if (input && typeof input === 'object' && 'zIndex' in input && typeof input.zIndex === 'number' && (0, _isWellBehavedNumber.isWellBehavedNumber)(input.zIndex)) {
    return input.zIndex;
  }
  return defaultZIndex;
}