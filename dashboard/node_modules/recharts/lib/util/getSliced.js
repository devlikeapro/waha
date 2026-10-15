"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSliced = getSliced;
function getSliced(arr, startIndex, endIndex) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  if (arr && startIndex + endIndex !== 0) {
    return arr.slice(startIndex, endIndex + 1);
  }
  return arr;
}