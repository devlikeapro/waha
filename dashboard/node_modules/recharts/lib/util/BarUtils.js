"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BarRectangle = BarRectangle;
exports.minPointSizeCallback = exports.defaultBarShape = void 0;
var React = _interopRequireWildcard(require("react"));
var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));
var _Rectangle = require("../shape/Rectangle");
var _ActiveShapeUtils = require("./ActiveShapeUtils");
var _DataUtils = require("./DataUtils");
var _excluded = ["option"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var defaultBarShape = exports.defaultBarShape = _Rectangle.Rectangle;
function BarRectangle(_ref) {
  var option = _ref.option,
    shapeProps = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(_ActiveShapeUtils.Shape, {
    option: option,
    DefaultShape: defaultBarShape,
    shapeProps: shapeProps,
    activeClassName: "recharts-active-bar",
    inActiveClassName: "recharts-inactive-bar"
  });
}
/**
 * Safely gets minPointSize from the minPointSize prop if it is a function
 * @param minPointSize minPointSize as passed to the Bar component
 * @param defaultValue default minPointSize
 * @returns minPointSize
 */
var minPointSizeCallback = exports.minPointSizeCallback = function minPointSizeCallback(minPointSize) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return (value, index) => {
    if ((0, _DataUtils.isNumber)(minPointSize)) return minPointSize;
    var isValueNumberOrNil = (0, _DataUtils.isNumber)(value) || (0, _DataUtils.isNullish)(value);
    if (isValueNumberOrNil) {
      return minPointSize(value, index);
    }
    !isValueNumberOrNil ? true ? (0, _tinyInvariant.default)(false, "minPointSize callback function received a value with type of ".concat(typeof value, ". Currently only numbers or null/undefined are supported.")) : (0, _tinyInvariant.default)(false) : void 0;
    return defaultValue;
  };
};