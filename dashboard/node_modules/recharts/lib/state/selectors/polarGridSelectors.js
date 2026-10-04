"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectPolarGridRadii = exports.selectPolarGridAngles = void 0;
var _reselect = require("reselect");
var _polarScaleSelectors = require("./polarScaleSelectors");
var selectAngleAxisTicks = (state, anglexisId) => (0, _polarScaleSelectors.selectPolarAxisTicks)(state, 'angleAxis', anglexisId, false);
var selectPolarGridAngles = exports.selectPolarGridAngles = (0, _reselect.createSelector)([selectAngleAxisTicks], ticks => {
  if (!ticks) {
    return undefined;
  }
  return ticks.map(tick => tick.coordinate);
});
var selectRadiusAxisTicks = (state, radiusAxisId) => (0, _polarScaleSelectors.selectPolarAxisTicks)(state, 'radiusAxis', radiusAxisId, false);
var selectPolarGridRadii = exports.selectPolarGridRadii = (0, _reselect.createSelector)([selectRadiusAxisTicks], ticks => {
  if (!ticks) {
    return undefined;
  }
  return ticks.map(tick => tick.coordinate);
});