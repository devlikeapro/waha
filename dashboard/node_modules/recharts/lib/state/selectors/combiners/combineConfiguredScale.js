"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineConfiguredScale = combineConfiguredScale;
exports.combineConfiguredScaleInternal = combineConfiguredScaleInternal;
var d3Scales = _interopRequireWildcard(require("victory-vendor/d3-scale"));
var _DataUtils = require("../../../util/DataUtils");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function getD3ScaleFromType(realScaleType) {
  var scales = d3Scales;
  if (realScaleType in scales && typeof scales[realScaleType] === 'function') {
    return scales[realScaleType]();
  }
  var name = "scale".concat((0, _DataUtils.upperFirst)(realScaleType));
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

function combineConfiguredScaleInternal(scale, axisDomain, axisRange) {
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
function combineConfiguredScale(axis, realScaleType, axisDomain, axisRange) {
  if (axisDomain == null || axisRange == null) {
    return undefined;
  }
  if (typeof axis.scale === 'function') {
    return combineConfiguredScaleInternal(axis.scale, axisDomain, axisRange);
  }
  return combineConfiguredScaleInternal(realScaleType, axisDomain, axisRange);
}