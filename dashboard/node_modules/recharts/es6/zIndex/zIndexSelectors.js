import { createSelector } from 'reselect';
import { arrayContentsAreEqualCheck } from '../state/selectors/arrayEqualityCheck';
import { DefaultZIndexes } from './DefaultZIndexes';

/**
 * Given a zIndex, returns the corresponding portal element reference.
 * If no zIndex is provided or if the zIndex is not registered, returns undefined.
 *
 * It also returns undefined in case the z-index portal has not been rendered yet.
 */
export var selectZIndexPortalElement = createSelector(state => state.zIndex.zIndexMap, (_, zIndex) => zIndex, (_, _zIndex, isPanorama) => isPanorama, (zIndexMap, zIndex, isPanorama) => {
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
export var selectAllRegisteredZIndexes = createSelector(state => state.zIndex.zIndexMap, zIndexMap => {
  var allNumbers = Object.keys(zIndexMap).map(zIndexStr => parseInt(zIndexStr, 10)).concat(Object.values(DefaultZIndexes));
  var uniqueNumbers = Array.from(new Set(allNumbers));
  return uniqueNumbers.sort((a, b) => a - b);
}, {
  memoizeOptions: {
    resultEqualityCheck: arrayContentsAreEqualCheck
  }
});