"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunnelTrapezoid = FunnelTrapezoid;
exports.defaultFunnelShape = void 0;
var React = _interopRequireWildcard(require("react"));
var _Trapezoid = require("../shape/Trapezoid");
var _ActiveShapeUtils = require("./ActiveShapeUtils");
var _excluded = ["option"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var defaultFunnelShape = exports.defaultFunnelShape = _Trapezoid.Trapezoid;
function FunnelTrapezoid(_ref) {
  var option = _ref.option,
    shapeProps = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(_ActiveShapeUtils.Shape, {
    option: option,
    DefaultShape: defaultFunnelShape,
    shapeProps: shapeProps
  });
}