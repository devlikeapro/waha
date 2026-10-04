"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RootSurface = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _chartLayoutContext = require("../context/chartLayoutContext");
var _accessibilityContext = require("../context/accessibilityContext");
var _PanoramaContext = require("../context/PanoramaContext");
var _Surface = require("./Surface");
var _hooks = require("../state/hooks");
var _brushSelectors = require("../state/selectors/brushSelectors");
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
var _ZIndexPortal = require("../zIndex/ZIndexPortal");
var _excluded = ["children"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var FULL_WIDTH_AND_HEIGHT = {
  width: '100%',
  height: '100%',
  /*
   * display: block is necessary here because the default for an SVG is display: inline,
   * which in some browsers (Chrome) adds a little bit of extra space above and below the SVG
   * to make space for the descender of letters like "g" and "y". This throws off the height calculation
   * and causes the container to grow indefinitely on each render with responsive=true.
   * Display: block removes that extra space.
   *
   * Interestingly, Firefox does not have this problem, but it doesn't hurt to add the style anyway.
   */
  display: 'block'
};
var MainChartSurface = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var width = (0, _chartLayoutContext.useChartWidth)();
  var height = (0, _chartLayoutContext.useChartHeight)();
  var hasAccessibilityLayer = (0, _accessibilityContext.useAccessibilityLayer)();
  if (!(0, _isWellBehavedNumber.isPositiveNumber)(width) || !(0, _isWellBehavedNumber.isPositiveNumber)(height)) {
    return null;
  }
  var children = props.children,
    otherAttributes = props.otherAttributes,
    title = props.title,
    desc = props.desc;
  var tabIndex, role;
  if (otherAttributes != null) {
    if (typeof otherAttributes.tabIndex === 'number') {
      tabIndex = otherAttributes.tabIndex;
    } else {
      tabIndex = hasAccessibilityLayer ? 0 : undefined;
    }
    if (typeof otherAttributes.role === 'string') {
      role = otherAttributes.role;
    } else {
      role = hasAccessibilityLayer ? 'application' : undefined;
    }
  }
  return /*#__PURE__*/React.createElement(_Surface.Surface, _extends({}, otherAttributes, {
    title: title,
    desc: desc,
    role: role,
    tabIndex: tabIndex,
    width: width,
    height: height,
    style: FULL_WIDTH_AND_HEIGHT,
    ref: ref
  }), children);
});
var BrushPanoramaSurface = _ref => {
  var children = _ref.children;
  var brushDimensions = (0, _hooks.useAppSelector)(_brushSelectors.selectBrushDimensions);
  if (!brushDimensions) {
    return null;
  }
  var width = brushDimensions.width,
    height = brushDimensions.height,
    y = brushDimensions.y,
    x = brushDimensions.x;
  return /*#__PURE__*/React.createElement(_Surface.Surface, {
    width: width,
    height: height,
    x: x,
    y: y
  }, children);
};
var RootSurface = exports.RootSurface = /*#__PURE__*/(0, _react.forwardRef)((_ref2, ref) => {
  var children = _ref2.children,
    rest = _objectWithoutProperties(_ref2, _excluded);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  if (isPanorama) {
    return /*#__PURE__*/React.createElement(BrushPanoramaSurface, null, /*#__PURE__*/React.createElement(_ZIndexPortal.AllZIndexPortals, {
      isPanorama: true
    }, children));
  }
  return /*#__PURE__*/React.createElement(MainChartSurface, _extends({
    ref: ref
  }, rest), /*#__PURE__*/React.createElement(_ZIndexPortal.AllZIndexPortals, {
    isPanorama: false
  }, children));
});