import { createSelector } from 'reselect';
import { combineAxisTicks, combineCategoricalDomain, combineGraphicalItemTicks, selectDuplicateDomain, selectRealScaleType, selectRenderableAxisSettings } from './axisSelectors';
import { selectAngleAxis, selectAngleAxisRangeWithReversed, selectRadiusAxis, selectRadiusAxisRangeWithReversed } from './polarAxisSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { selectPolarAppliedValues, selectPolarAxisCheckedDomain, selectPolarNiceTicks } from './polarSelectors';
import { pickAxisType } from './pickAxisType';
import { rechartsScaleFactory } from '../../util/scale/RechartsScale';
import { combineConfiguredScale } from './combiners/combineConfiguredScale';
export var selectPolarAxis = (state, axisType, axisId) => {
  switch (axisType) {
    case 'angleAxis':
      {
        return selectAngleAxis(state, axisId);
      }
    case 'radiusAxis':
      {
        return selectRadiusAxis(state, axisId);
      }
    default:
      {
        throw new Error("Unexpected axis type: ".concat(axisType));
      }
  }
};
var selectPolarAxisRangeWithReversed = (state, axisType, axisId) => {
  switch (axisType) {
    case 'angleAxis':
      {
        return selectAngleAxisRangeWithReversed(state, axisId);
      }
    case 'radiusAxis':
      {
        return selectRadiusAxisRangeWithReversed(state, axisId);
      }
    default:
      {
        throw new Error("Unexpected axis type: ".concat(axisType));
      }
  }
};
var selectPolarConfiguredScale = createSelector([selectPolarAxis, selectRealScaleType, selectPolarAxisCheckedDomain, selectPolarAxisRangeWithReversed], combineConfiguredScale);
export var selectPolarAxisScale = createSelector([selectPolarConfiguredScale], rechartsScaleFactory);
export var selectPolarCategoricalDomain = createSelector([selectChartLayout, selectPolarAppliedValues, selectRenderableAxisSettings, pickAxisType], combineCategoricalDomain);
export var selectPolarAxisTicks = createSelector([selectChartLayout, selectPolarAxis, selectRealScaleType, selectPolarAxisScale, selectPolarNiceTicks, selectPolarAxisRangeWithReversed, selectDuplicateDomain, selectPolarCategoricalDomain, pickAxisType], combineAxisTicks);
export var selectPolarAngleAxisTicks = createSelector([selectPolarAxisTicks], ticks => {
  /*
   * Angle axis is circular; so here we need to look for ticks that overlap (i.e., 0 and 360 degrees)
   * and remove the duplicate tick to avoid rendering issues.
   */
  if (!ticks) {
    return undefined;
  }
  var uniqueTicksMap = new Map();
  ticks.forEach(tick => {
    var normalizedCoordinate = (tick.coordinate + 360) % 360;
    if (!uniqueTicksMap.has(normalizedCoordinate)) {
      uniqueTicksMap.set(normalizedCoordinate, tick);
    }
  });
  return Array.from(uniqueTicksMap.values());
});
export var selectPolarGraphicalItemAxisTicks = createSelector([selectChartLayout, selectPolarAxis, selectPolarAxisScale, selectPolarAxisRangeWithReversed, selectDuplicateDomain, selectPolarCategoricalDomain, pickAxisType], combineGraphicalItemTicks);