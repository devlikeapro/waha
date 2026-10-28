import * as d3Scales from 'victory-vendor/d3-scale';
import { upperFirst } from '../../../util/DataUtils';
function getD3ScaleFromType(realScaleType) {
  var scales = d3Scales;
  if (realScaleType in scales && typeof scales[realScaleType] === 'function') {
    return scales[realScaleType]();
  }
  var name = "scale".concat(upperFirst(realScaleType));
  if (name in scales && typeof scales[name] === 'function') {
    return scales[name]();
  }
  return undefined;
}

/**
 * Converts external scale definition into internal RechartsScale definition.
 * @param scale custom function scale - if you have the `string` from outside, use `combineRealScaleType` first which will validate it and return RechartsScaleType or undefined
 * @param axisDomain
 * @param axisRange
 */

export function combineConfiguredScaleInternal(scale, axisDomain, axisRange) {
  if (typeof scale === 'function') {
    return scale.copy().domain(axisDomain).range(axisRange);
  }
  if (scale == null) {
    return undefined;
  }
  var d3ScaleFunction = getD3ScaleFromType(scale);
  if (d3ScaleFunction == null) {
    return undefined;
  }
  d3ScaleFunction.domain(axisDomain).range(axisRange);
  return d3ScaleFunction;
}
export function combineConfiguredScale(axis, realScaleType, axisDomain, axisRange) {
  if (axisDomain == null || axisRange == null) {
    return undefined;
  }
  if (typeof axis.scale === 'function') {
    return combineConfiguredScaleInternal(axis.scale, axisDomain, axisRange);
  }
  return combineConfiguredScaleInternal(realScaleType, axisDomain, axisRange);
}