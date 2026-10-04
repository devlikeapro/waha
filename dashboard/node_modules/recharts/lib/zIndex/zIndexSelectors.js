"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectZIndexPortalElement = exports.selectAllRegisteredZIndexes = void 0;
var _reselect = require("reselect");
var _arrayEqualityCheck = require("../state/selectors/arrayEqualityCheck");
var _DefaultZIndexes = require("./DefaultZIndexes");
/**
 * Given a zIndex, returns the corresponding portal element reference.
 * If no zIndex is provided or if the zIndex is not registered, returns undefined.
 *
 * It also returns undefined in case the z-index portal has not been rendered yet.
 */
var selectZIndexPortalElement = exports.selectZIndexPortalElement = (0, _reselect.createSelector)(state => state.zIndex.zIndexMap, (_, zIndex) => zIndex, (_, _zIndex, isPanorama) => isPanorama, (zIndexMap, zIndex, isPanorama) => {
  if (zIndex == null) {
    return undefined;
  }
  var entry = zIndexMap[zIndex];
  if (entry == null) {
    return undefined;
  }
  if (isPanorama) {
    return entry.panoramaElement;
  }
  return entry.element;
});
var selectAllRegisteredZIndexes = exports.selectAllRegisteredZIndexes = (0, _reselect.createSelector)(state => state.zIndex.zIndexMap, zIndexMap => {
  var allNumbers = Object.keys(zIndexMap).map(zIndexStr => parseInt(zIndexStr, 10)).concat(Object.values(_DefaultZIndexes.DefaultZIndexes));
  var uniqueNumbers = Array.from(new Set(allNumbers));
  return uniqueNumbers.sort((a, b) => a - b);
}, {
  memoizeOptions: {
    resultEqualityCheck: _arrayEqualityCheck.arrayContentsAreEqualCheck
  }
});