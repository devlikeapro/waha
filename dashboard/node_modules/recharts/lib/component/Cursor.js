"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cursor = Cursor;
exports.CursorInternal = CursorInternal;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _types = require("../util/types");
var _Curve = require("../shape/Curve");
var _Cross = require("../shape/Cross");
var _getCursorRectangle = require("../util/cursor/getCursorRectangle");
var _Rectangle = require("../shape/Rectangle");
var _getRadialCursorPoints = require("../util/cursor/getRadialCursorPoints");
var _Sector = require("../shape/Sector");
var _getCursorPoints = require("../util/cursor/getCursorPoints");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _useTooltipAxis = require("../context/useTooltipAxis");
var _selectors = require("../state/selectors/selectors");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * If set false, no cursor will be drawn when tooltip is active.
 * If set an object, the option is the configuration of cursor.
 * If set a React element, the option is the custom react element of drawing cursor
 */

function RenderCursor(_ref) {
  var cursor = _ref.cursor,
    cursorComp = _ref.cursorComp,
    cursorProps = _ref.cursorProps;
  if (/*#__PURE__*/(0, _react.isValidElement)(cursor)) {
    return /*#__PURE__*/(0, _react.cloneElement)(cursor, cursorProps);
  }
  return /*#__PURE__*/(0, _react.createElement)(cursorComp, cursorProps);
}
function CursorInternal(props) {
  var _props$zIndex;
  var coordinate = props.coordinate,
    payload = props.payload,
    index = props.index,
    offset = props.offset,
    tooltipAxisBandSize = props.tooltipAxisBandSize,
    layout = props.layout,
    cursor = props.cursor,
    tooltipEventType = props.tooltipEventType,
    chartName = props.chartName;

  // The cursor is a part of the Tooltip, and it should be shown (by default) when the Tooltip is active.
  var activeCoordinate = coordinate;
  var activePayload = payload;
  var activeTooltipIndex = index;
  if (!cursor || !activeCoordinate || chartName !== 'ScatterChart' && tooltipEventType !== 'axis') {
    return null;
  }
  var restProps, cursorComp, preferredZIndex;
  if (chartName === 'ScatterChart') {
    restProps = activeCoordinate;
    cursorComp = _Cross.Cross;
    preferredZIndex = _DefaultZIndexes.DefaultZIndexes.cursorLine;
  } else if (chartName === 'BarChart') {
    restProps = (0, _getCursorRectangle.getCursorRectangle)(layout, activeCoordinate, offset, tooltipAxisBandSize);
    cursorComp = _Rectangle.Rectangle;
    preferredZIndex = _DefaultZIndexes.DefaultZIndexes.cursorRectangle;
  } else if (layout === 'radial' && (0, _types.isPolarCoordinate)(activeCoordinate)) {
    var _getRadialCursorPoint = (0, _getRadialCursorPoints.getRadialCursorPoints)(activeCoordinate),
      cx = _getRadialCursorPoint.cx,
      cy = _getRadialCursorPoint.cy,
      radius = _getRadialCursorPoint.radius,
      startAngle = _getRadialCursorPoint.startAngle,
      endAngle = _getRadialCursorPoint.endAngle;
    restProps = {
      cx,
      cy,
      startAngle,
      endAngle,
      innerRadius: radius,
      outerRadius: radius
    };
    cursorComp = _Sector.Sector;
    preferredZIndex = _DefaultZIndexes.DefaultZIndexes.cursorLine;
  } else {
    restProps = {
      points: (0, _getCursorPoints.getCursorPoints)(layout, activeCoordinate, offset)
    };
    cursorComp = _Curve.Curve;
    preferredZIndex = _DefaultZIndexes.DefaultZIndexes.cursorLine;
  }
  var extraClassName = typeof cursor === 'object' && 'className' in cursor ? cursor.className : undefined;
  var cursorProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
    stroke: '#ccc',
    pointerEvents: 'none'
  }, offset), restProps), (0, _svgPropertiesNoEvents.svgPropertiesNoEventsFromUnknown)(cursor)), {}, {
    payload: activePayload,
    payloadIndex: activeTooltipIndex,
    className: (0, _clsx.clsx)('recharts-tooltip-cursor', extraClassName)
  });
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
    zIndex: (_props$zIndex = props.zIndex) !== null && _props$zIndex !== void 0 ? _props$zIndex : preferredZIndex
  }, /*#__PURE__*/React.createElement(RenderCursor, {
    cursor: cursor,
    cursorComp: cursorComp,
    cursorProps: cursorProps
  }));
}

/*
 * Cursor is the background, or a highlight,
 * that shows when user mouses over or activates
 * an area.
 *
 * It usually shows together with a tooltip
 * to emphasise which part of the chart does the tooltip refer to.
 */
function Cursor(props) {
  var tooltipAxisBandSize = (0, _useTooltipAxis.useTooltipAxisBandSize)();
  var offset = (0, _chartLayoutContext.useOffsetInternal)();
  var layout = (0, _chartLayoutContext.useChartLayout)();
  var chartName = (0, _selectors.useChartName)();
  if (tooltipAxisBandSize == null || offset == null || layout == null || chartName == null) {
    return null;
  }
  return /*#__PURE__*/React.createElement(CursorInternal, _extends({}, props, {
    offset: offset,
    layout: layout,
    tooltipAxisBandSize: tooltipAxisBandSize,
    chartName: chartName
  }));
}