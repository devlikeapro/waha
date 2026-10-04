import { createSelector } from 'reselect';
import { selectPolarAxisTicks } from './polarScaleSelectors';
var selectAngleAxisTicks = (state, anglexisId) => selectPolarAxisTicks(state, 'angleAxis', anglexisId, false);
export var selectPolarGridAngles = createSelector([selectAngleAxisTicks], ticks => {
  if (!ticks) {
    return undefined;
  }
  return ticks.map(tick => tick.coordinate);
});
var selectRadiusAxisTicks = (state, radiusAxisId) => selectPolarAxisTicks(state, 'radiusAxis', radiusAxisId, false);
export var selectPolarGridRadii = createSelector([selectRadiusAxisTicks], ticks => {
  if (!ticks) {
    return undefined;
  }
  return ticks.map(tick => tick.coordinate);
});