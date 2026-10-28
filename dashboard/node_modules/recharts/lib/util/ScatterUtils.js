"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScatterSymbol = ScatterSymbol;
var React = _interopRequireWildcard(require("react"));
var _Symbols = require("../shape/Symbols");
var _ActiveShapeUtils = require("./ActiveShapeUtils");
var _Constants = require("./Constants");
var _excluded = ["option"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function renderSymbols(props) {
  return /*#__PURE__*/React.createElement(_Symbols.Symbols, props);
}
function ScatterSymbol(_ref) {
  var option = _ref.option,
    props = _objectWithoutProperties(_ref, _excluded);
  if (typeof option === 'string') {
    return /*#__PURE__*/React.createElement(_ActiveShapeUtils.Shape, {
      option: /*#__PURE__*/React.createElement(_Symbols.Symbols, _extends({
        type: option
      }, props)),
      DefaultShape: renderSymbols,
      shapeProps: props
    });
  }
  return /*#__PURE__*/React.createElement(_ActiveShapeUtils.Shape, {
    option: option,
    DefaultShape: renderSymbols,
    shapeProps: props
  });
}