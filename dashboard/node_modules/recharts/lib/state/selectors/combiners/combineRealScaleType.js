"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineRealScaleType = void 0;
var d3Scales = _interopRequireWildcard(require("victory-vendor/d3-scale"));
var _DataUtils = require("../../../util/DataUtils");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function getD3ScaleName(name) {
  return "scale".concat((0, _DataUtils.upperFirst)(name));
}
function isSupportedScaleName(name) {
  return getD3ScaleName(name) in d3Scales;
}
var combineRealScaleType = (axisConfig, hasBar, chartType) => {
  if (axisConfig == null) {
    return undefined;
  }
  var scale = axisConfig.scale,
    type = axisConfig.type;
  if (scale === 'auto') {
    if (type === 'category' && chartType && (chartType.indexOf('LineChart') >= 0 || chartType.indexOf('AreaChart') >= 0 || chartType.indexOf('ComposedChart') >= 0 && !hasBar)) {
      return 'point';
    }
    if (type === 'category') {
      return 'band';
    }
    return 'linear';
  }
  if (typeof scale === 'string') {
    return isSupportedScaleName(scale) ? scale : 'point';
  }
  return undefined;
};
exports.combineRealScaleType = combineRealScaleType;