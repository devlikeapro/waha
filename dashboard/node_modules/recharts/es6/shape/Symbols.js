var _excluded = ["type", "size", "sizeType"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { symbol as shapeSymbol, symbolCircle, symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, symbolWye } from 'victory-vendor/d3-shape';
import { clsx } from 'clsx';
import { isNumber, upperFirst } from '../util/DataUtils';
import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents';
var symbolFactories = {
  symbolCircle,
  symbolCross,
  symbolDiamond,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye
};
var RADIAN = Math.PI / 180;
var getSymbolFactory = type => {
  var name = "symbol".concat(upperFirst(type));
  return symbolFactories[name] || symbolCircle;
};
var calculateAreaSize = (size, sizeType, type) => {
  if (sizeType === 'area') {
    return size;
  }
  switch (type) {
    case 'cross':
      return 5 * size * size / 9;
    case 'diamond':
      return 0.5 * size * size / Math.sqrt(3);
    case 'square':
      return size * size;
    case 'star':
      {
        var angle = 18 * RADIAN;
        return 1.25 * size * size * (Math.tan(angle) - Math.tan(angle * 2) * Math.tan(angle) ** 2);
      }
    case 'triangle':
      return Math.sqrt(3) * size * size / 4;
    case 'wye':
      return (21 - 10 * Math.sqrt(3)) * size * size / 8;
    default:
      return Math.PI * size * size / 4;
  }
};
var registerSymbol = (key, factory) => {
  symbolFactories["symbol".concat(upperFirst(key))] = factory;
};

/**
 * Renders a symbol from a set of predefined shapes.
 */
export var Symbols = _ref => {
  var _ref$type = _ref.type,
    type = _ref$type === void 0 ? 'circle' : _ref$type,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 64 : _ref$size,
    _ref$sizeType = _ref.sizeType,
    sizeType = _ref$sizeType === void 0 ? 'area' : _ref$sizeType,
    rest = _objectWithoutProperties(_ref, _excluded);
  var props = _objectSpread(_objectSpread({}, rest), {}, {
    type,
    size,
    sizeType
  });
  var realType = 'circle';
  if (typeof type === 'string') {
    /*
     * Our type guard is not as strong as it could be (i.e. non-existent),
     * and so despite the typescript type saying that `type` is a `SymbolType`,
     * we can get numbers or really anything, so let's have a runtime check here to fix the exception.
     *
     * https://github.com/recharts/recharts/issues/6197
     */
    realType = type;
  }

  /**
   * Calculate the path of curve
   * @return {String} path
   */
  var getPath = () => {
    var symbolFactory = getSymbolFactory(realType);
    var symbol = shapeSymbol().type(symbolFactory).size(calculateAreaSize(size, sizeType, realType));
    var s = symbol();
    if (s === null) {
      return undefined;
    }
    return s;
  };
  var className = props.className,
    cx = props.cx,
    cy = props.cy;
  var filteredProps = svgPropertiesAndEvents(props);
  if (isNumber(cx) && isNumber(cy) && isNumber(size)) {
    return /*#__PURE__*/React.createElement("path", _extends({}, filteredProps, {
      className: clsx('recharts-symbols', className),
      transform: "translate(".concat(cx, ", ").concat(cy, ")"),
      d: getPath()
    }));
  }
  return null;
};
Symbols.registerSymbol = registerSymbol;