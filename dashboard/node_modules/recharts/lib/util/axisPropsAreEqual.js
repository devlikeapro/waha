"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axisPropsAreEqual = axisPropsAreEqual;
var _propsAreEqual = require("./propsAreEqual");
var _excluded = ["domain", "range"],
  _excluded2 = ["domain", "range"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function shortArraysAreEqual(arr1, arr2) {
  if (arr1 === arr2) {
    return true;
  }
  if (Array.isArray(arr1) && arr1.length === 2 && Array.isArray(arr2) && arr2.length === 2) {
    return arr1[0] === arr2[0] && arr1[1] === arr2[1];
  }
  return false;
}

/**
 * Usually we would not compare array props deeply for performance consideration.
 * However, for axis props, domain is sometimes defined as a two-elements array, and range is always
 * a two-elements array. So we can do a shallow comparison for the rest props and a shallow
 * comparison for these two array props.
 * @param prevProps
 * @param nextProps
 */
function axisPropsAreEqual(prevProps, nextProps) {
  if (prevProps === nextProps) {
    return true;
  }
  var prevDomain = prevProps.domain,
    prevRange = prevProps.range,
    prevRest = _objectWithoutProperties(prevProps, _excluded);
  var nextDomain = nextProps.domain,
    nextRange = nextProps.range,
    nextRest = _objectWithoutProperties(nextProps, _excluded2);
  if (!shortArraysAreEqual(prevDomain, nextDomain)) {
    return false;
  }
  if (!shortArraysAreEqual(prevRange, nextRange)) {
    return false;
  }
  return (0, _propsAreEqual.propsAreEqual)(prevRest, nextRest);
}