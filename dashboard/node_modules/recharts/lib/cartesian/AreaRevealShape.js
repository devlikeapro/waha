"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AreaRevealShape = AreaRevealShape;
var React = _interopRequireWildcard(require("react"));
var _DataUtils = require("../util/DataUtils");
var _Curve = require("../shape/Curve");
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
var _Layer = require("../container/Layer");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _useId = require("../util/useId");
var _excluded = ["animationElapsedTime", "isAnimating", "isEntrance", "layout", "isRange", "stroke", "connectNulls"],
  _excluded2 = ["id", "baseLine"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * Props for the clip-path rect computation.
 * @internal
 */

function HorizontalClipRect(_ref) {
  var _points$, _points;
  var alpha = _ref.alpha,
    baseLine = _ref.baseLine,
    points = _ref.points,
    strokeWidth = _ref.strokeWidth;
  var startX = (_points$ = points[0]) === null || _points$ === void 0 ? void 0 : _points$.x;
  var endX = (_points = points[points.length - 1]) === null || _points === void 0 ? void 0 : _points.x;
  if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(startX) || !(0, _isWellBehavedNumber.isWellBehavedNumber)(endX)) {
    return null;
  }
  var width = alpha * Math.abs(startX - endX);
  var maxY = Math.max(...points.map(entry => entry.y || 0));
  if ((0, _DataUtils.isNumber)(baseLine)) {
    maxY = Math.max(baseLine, maxY);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxY = Math.max(...baseLine.map(entry => entry.y || 0), maxY);
  }
  if ((0, _DataUtils.isNumber)(maxY)) {
    return /*#__PURE__*/React.createElement("rect", {
      x: startX < endX ? startX : startX - width,
      y: 0,
      width: width,
      height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
    });
  }
  return null;
}
function VerticalClipRect(_ref2) {
  var _points$2, _points2;
  var alpha = _ref2.alpha,
    baseLine = _ref2.baseLine,
    points = _ref2.points,
    strokeWidth = _ref2.strokeWidth;
  var startY = (_points$2 = points[0]) === null || _points$2 === void 0 ? void 0 : _points$2.y;
  var endY = (_points2 = points[points.length - 1]) === null || _points2 === void 0 ? void 0 : _points2.y;
  if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(startY) || !(0, _isWellBehavedNumber.isWellBehavedNumber)(endY)) {
    return null;
  }
  var height = alpha * Math.abs(startY - endY);
  var maxX = Math.max(...points.map(entry => entry.x || 0));
  if ((0, _DataUtils.isNumber)(baseLine)) {
    maxX = Math.max(baseLine, maxX);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxX = Math.max(...baseLine.map(entry => entry.x || 0), maxX);
  }
  if ((0, _DataUtils.isNumber)(maxX)) {
    return /*#__PURE__*/React.createElement("rect", {
      x: 0,
      y: startY < endY ? startY : startY - height,
      width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
      height: Math.floor(height)
    });
  }
  return null;
}
function RevealClipRect(_ref3) {
  var alpha = _ref3.alpha,
    layout = _ref3.layout,
    points = _ref3.points,
    baseLine = _ref3.baseLine,
    strokeWidth = _ref3.strokeWidth;
  if (layout === 'vertical') {
    return /*#__PURE__*/React.createElement(VerticalClipRect, {
      alpha: alpha,
      points: points,
      baseLine: baseLine,
      strokeWidth: strokeWidth
    });
  }
  return /*#__PURE__*/React.createElement(HorizontalClipRect, {
    alpha: alpha,
    points: points,
    baseLine: baseLine,
    strokeWidth: strokeWidth
  });
}
/**
 * The default shape for Area that reveals the chart with a left-to-right (or top-to-bottom)
 * clip-path animation on entrance, and renders the plain curve otherwise.
 *
 * This component renders the complete Area visual: the filled area curve, the stroke curve,
 * and (for range areas) the baseline stroke curve. During entrance animation, all curves are
 * wrapped in a clip-path that progressively reveals the area.
 *
 * This is the built-in entrance animation for Area. It is automatically used when no custom
 * `shape` prop is provided. You can import and reuse it as a starting point for custom shapes.
 *
 * @example
 * ```tsx
 * import { Area, AreaRevealShape } from 'recharts';
 *
 * // Use the default shape explicitly (same as providing no shape prop)
 * <Area dataKey="value" shape={AreaRevealShape} />
 * ```
 *
 * @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
 *
 * @since 3.9
 */
function AreaRevealShape(props) {
  var _props$animationElaps = props.animationElapsedTime,
    animationElapsedTime = _props$animationElaps === void 0 ? 1 : _props$animationElaps,
    _props$isAnimating = props.isAnimating,
    isAnimating = _props$isAnimating === void 0 ? false : _props$isAnimating,
    _props$isEntrance = props.isEntrance,
    isEntrance = _props$isEntrance === void 0 ? false : _props$isEntrance,
    layoutProp = props.layout,
    isRange = props.isRange,
    stroke = props.stroke,
    connectNulls = props.connectNulls,
    restProps = _objectWithoutProperties(props, _excluded);
  var layout = layoutProp === 'vertical' ? 'vertical' : 'horizontal';
  var finalConnectNulls = connectNulls !== null && connectNulls !== void 0 ? connectNulls : false;
  var clipId = (0, _useId.useId)();
  var id = restProps.id,
    baseLine = restProps.baseLine,
    propsWithoutIdBaseline = _objectWithoutProperties(restProps, _excluded2);
  var strokeSvgProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(propsWithoutIdBaseline);
  var fillCurve = /*#__PURE__*/React.createElement(_Curve.Curve, _extends({}, restProps, {
    id: id,
    baseLine: baseLine,
    connectNulls: finalConnectNulls,
    stroke: "none",
    className: "recharts-area-area",
    layout: layout
  }));
  var strokeCurve = stroke !== 'none' && /*#__PURE__*/React.createElement(_Curve.Curve, _extends({}, strokeSvgProps, {
    className: "recharts-area-curve",
    layout: layout,
    type: restProps.type,
    connectNulls: finalConnectNulls,
    fill: "none",
    stroke: stroke,
    points: restProps.points
  }));
  var baselineCurve = stroke !== 'none' && isRange && Array.isArray(baseLine) && /*#__PURE__*/React.createElement(_Curve.Curve, _extends({}, strokeSvgProps, {
    className: "recharts-area-curve",
    layout: layout,
    type: restProps.type,
    connectNulls: finalConnectNulls,
    fill: "none",
    stroke: stroke,
    points: baseLine
  }));
  if (isEntrance && (isAnimating || animationElapsedTime < 1)) {
    var _restProps$points;
    return /*#__PURE__*/React.createElement(_Layer.Layer, null, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: clipId
    }, /*#__PURE__*/React.createElement(RevealClipRect, {
      alpha: animationElapsedTime,
      points: (_restProps$points = restProps.points) !== null && _restProps$points !== void 0 ? _restProps$points : [],
      baseLine: baseLine,
      layout: layout,
      strokeWidth: restProps.strokeWidth
    }))), /*#__PURE__*/React.createElement(_Layer.Layer, {
      clipPath: "url(#".concat(clipId, ")")
    }, fillCurve, strokeCurve, baselineCurve));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, fillCurve, strokeCurve, baselineCurve);
}