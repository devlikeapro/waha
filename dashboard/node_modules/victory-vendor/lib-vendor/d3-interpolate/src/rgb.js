"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rgbBasisClosed = exports.rgbBasis = exports.default = void 0;
var _index = require("../../../lib-vendor/d3-color/src/index.js");
var _basis = _interopRequireDefault(require("./basis.js"));
var _basisClosed = _interopRequireDefault(require("./basisClosed.js"));
var _color = _interopRequireWildcard(require("./color.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = function rgbGamma(y) {
  var color = (0, _color.gamma)(y);
  function rgb(start, end) {
    var r = color((start = (0, _index.rgb)(start)).r, (end = (0, _index.rgb)(end)).r),
      g = color(start.g, end.g),
      b = color(start.b, end.b),
      opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
  rgb.gamma = rgbGamma;
  return rgb;
}(1);
function rgbSpline(spline) {
  return function (colors) {
    var n = colors.length,
      r = new Array(n),
      g = new Array(n),
      b = new Array(n),
      i,
      color;
    for (i = 0; i < n; ++i) {
      color = (0, _index.rgb)(colors[i]);
      r[i] = color.r || 0;
      g[i] = color.g || 0;
      b[i] = color.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color.opacity = 1;
    return function (t) {
      color.r = r(t);
      color.g = g(t);
      color.b = b(t);
      return color + "";
    };
  };
}
var rgbBasis = exports.rgbBasis = rgbSpline(_basis.default);
var rgbBasisClosed = exports.rgbBasisClosed = rgbSpline(_basisClosed.default);