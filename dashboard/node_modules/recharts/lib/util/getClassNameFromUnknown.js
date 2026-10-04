"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClassNameFromUnknown = getClassNameFromUnknown;
function getClassNameFromUnknown(u) {
  if (u && typeof u === 'object' && 'className' in u && typeof u.className === 'string') {
    return u.className;
  }
  return '';
}