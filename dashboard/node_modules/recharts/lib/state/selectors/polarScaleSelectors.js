"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectPolarGraphicalItemAxisTicks = exports.selectPolarCategoricalDomain = exports.selectPolarAxisTicks = exports.selectPolarAxisScale = exports.selectPolarAxis = exports.selectPolarAngleAxisTicks = void 0;
var _reselect = require("reselect");
var _axisSelectors = require("./axisSelectors");
var _polarAxisSelectors = require("./polarAxisSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _polarSelectors = require("./polarSelectors");
var _pickAxisType = require("./pickAxisType");
var _RechartsScale = require("../../util/scale/RechartsScale");
var _combineConfiguredScale = require("./combiners/combineConfiguredScale");
var selectPolarAxis = (state, axisType, axisId) => {
  switch (axisType) {
    case 'angleAxis':
      {
        return (0, _polarAxisSelectors.selectAngleAxis)(state, axisId);
      }
    case 'radiusAxis':
      {
        return (0, _polarAxisSelectors.selectRadiusAxis)(state, axisId);
      }
    default:
      {
        throw new Error("Unexpected axis type: ".concat(axisType));
      }
  }
};
exports.selectPolarAxis = selectPolarAxis;
var selectPolarAxisRangeWithReversed = (state, axisType, axisId) => {
  switch (axisType) {
    case 'angleAxis':
      {
        return (0, _polarAxisSelectors.selectAngleAxisRangeWithReversed)(state, axisId);
      }
    case 'radiusAxis':
      {
        return (0, _polarAxisSelectors.selectRadiusAxisRangeWithReversed)(state, axisId);
      }
    default:
      {
        throw new Error("Unexpected axis type: ".concat(axisType));
      }
  }
};
var selectPolarConfiguredScale = (0, _reselect.createSelector)([selectPolarAxis, _axisSelectors.selectRealScaleType, _polarSelectors.selectPolarAxisCheckedDomain, selectPolarAxisRangeWithReversed], _combineConfiguredScale.combineConfiguredScale);
var selectPolarAxisScale = exports.selectPolarAxisScale = (0, _reselect.createSelector)([selectPolarConfiguredScale], _RechartsScale.rechartsScaleFactory);
var selectPolarCategoricalDomain = exports.selectPolarCategoricalDomain = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, _polarSelectors.selectPolarAppliedValues, _axisSelectors.selectRenderableAxisSettings, _pickAxisType.pickAxisType], _axisSelectors.combineCategoricalDomain);
var selectPolarAxisTicks = exports.selectPolarAxisTicks = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectPolarAxis, _axisSelectors.selectRealScaleType, selectPolarAxisScale, _polarSelectors.selectPolarNiceTicks, selectPolarAxisRangeWithReversed, _axisSelectors.selectDuplicateDomain, selectPolarCategoricalDomain, _pickAxisType.pickAxisType], _axisSelectors.combineAxisTicks);
var selectPolarAngleAxisTicks = exports.selectPolarAngleAxisTicks = (0, _reselect.createSelector)([selectPolarAxisTicks], ticks => {
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
var selectPolarGraphicalItemAxisTicks = exports.selectPolarGraphicalItemAxisTicks = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectPolarAxis, selectPolarAxisScale, selectPolarAxisRangeWithReversed, _axisSelectors.selectDuplicateDomain, selectPolarCategoricalDomain, _pickAxisType.pickAxisType], _axisSelectors.combineGraphicalItemTicks);