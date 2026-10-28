"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferenceLine = ReferenceLine;
exports.referenceLineDefaultProps = exports.getEndPoints = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Layer = require("../container/Layer");
var _Label = require("../component/Label");
var _DataUtils = require("../util/DataUtils");
var _CartesianUtils = require("../util/CartesianUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _referenceElementsSlice = require("../state/referenceElementsSlice");
var _hooks = require("../state/hooks");
var _axisSelectors = require("../state/selectors/axisSelectors");
var _PanoramaContext = require("../context/PanoramaContext");
var _ClipPathProvider = require("../container/ClipPathProvider");
var _svgPropertiesAndEvents = require("../util/svgPropertiesAndEvents");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
var _CartesianScaleHelper = require("../util/scale/CartesianScaleHelper");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /**
 * @fileOverview Reference Line
 */
/**
 * Single point that defines one end of a segment.
 * These coordinates are in data space, meaning that you should provide
 * values that correspond to the data domain of the axes.
 * So you would provide a value of `Page A` to indicate the data value `Page A`
 * and then recharts will convert that to pixels.
 *
 * Likewise for numbers. If your x-axis goes from 0 to 100,
 * and you want the line to end at 50, you would provide `50` here.
 *
 * @inline
 */

/**
 * This excludes `viewBox` prop from svg for two reasons:
 * 1. The components wants viewBox of object type, and svg wants string
 *    - so there's a conflict, and the component will throw if it gets string
 * 2. Internally the component calls `svgPropertiesNoEvents` which filters the viewBox away anyway
 */

var renderLine = (option, props) => {
  var line;
  if (/*#__PURE__*/React.isValidElement(option)) {
    // @ts-expect-error element cloning is not typed
    line = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    line = option(props);
  } else {
    if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(props.x1) || !(0, _isWellBehavedNumber.isWellBehavedNumber)(props.y1) || !(0, _isWellBehavedNumber.isWellBehavedNumber)(props.x2) || !(0, _isWellBehavedNumber.isWellBehavedNumber)(props.y2)) {
      return null;
    }
    line = /*#__PURE__*/React.createElement("line", _extends({}, props, {
      className: "recharts-reference-line-line"
    }));
  }
  return line;
};
var getHorizontalLineEndPoints = (yCoord, ifOverflow, position, yAxisOrientation, yAxisScale, viewBox) => {
  var x = viewBox.x,
    width = viewBox.width;
  var coord = yAxisScale.map(yCoord, {
    position
  });
  // don't render the line if the scale can't compute a result that makes sense
  if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(coord)) {
    return null;
  }
  if (ifOverflow === 'discard' && !yAxisScale.isInRange(coord)) {
    return null;
  }
  var points = [{
    x: x + width,
    y: coord
  }, {
    x,
    y: coord
  }];
  return yAxisOrientation === 'left' ? points.reverse() : points;
};
var getVerticalLineEndPoints = (xCoord, ifOverflow, position, xAxisOrientation, xAxisScale, viewBox) => {
  var y = viewBox.y,
    height = viewBox.height;
  var coord = xAxisScale.map(xCoord, {
    position
  });
  // don't render the line if the scale can't compute a result that makes sense
  if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(coord)) {
    return null;
  }
  if (ifOverflow === 'discard' && !xAxisScale.isInRange(coord)) {
    return null;
  }
  var points = [{
    x: coord,
    y: y + height
  }, {
    x: coord,
    y
  }];
  return xAxisOrientation === 'top' ? points.reverse() : points;
};
var getSegmentLineEndPoints = (segment, ifOverflow, position, scales) => {
  var points = [scales.mapWithFallback(segment[0], {
    position,
    fallback: 'rangeMin'
  }), scales.mapWithFallback(segment[1], {
    position,
    fallback: 'rangeMax'
  })];
  if (ifOverflow === 'discard' && points.some(p => !scales.isInRange(p))) {
    return null;
  }
  return points;
};
var getEndPoints = (xAxisScale, yAxisScale, viewBox, position, xAxisOrientation, yAxisOrientation, props) => {
  var xCoord = props.x,
    yCoord = props.y,
    segment = props.segment,
    ifOverflow = props.ifOverflow;
  var isFixedX = (0, _DataUtils.isNumOrStr)(xCoord);
  var isFixedY = (0, _DataUtils.isNumOrStr)(yCoord);
  if (isFixedY) {
    return getHorizontalLineEndPoints(yCoord, ifOverflow, position, yAxisOrientation, yAxisScale, viewBox);
  }
  if (isFixedX) {
    return getVerticalLineEndPoints(xCoord, ifOverflow, position, xAxisOrientation, xAxisScale, viewBox);
  }
  if (segment != null && segment.length === 2) {
    return getSegmentLineEndPoints(segment, ifOverflow, position, new _CartesianScaleHelper.CartesianScaleHelperImpl({
      x: xAxisScale,
      y: yAxisScale
    }));
  }
  return null;
};
exports.getEndPoints = getEndPoints;
function ReportReferenceLine(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _referenceElementsSlice.addLine)(props));
    return () => {
      dispatch((0, _referenceElementsSlice.removeLine)(props));
    };
  });
  return null;
}
function ReferenceLineImpl(props) {
  var xAxisId = props.xAxisId,
    yAxisId = props.yAxisId,
    shape = props.shape,
    className = props.className,
    ifOverflow = props.ifOverflow;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var clipPathId = (0, _ClipPathProvider.useClipPathId)();
  var xAxis = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectXAxisSettings)(state, xAxisId));
  var yAxis = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectYAxisSettings)(state, yAxisId));
  var xAxisScale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'xAxis', xAxisId, isPanorama));
  var yAxisScale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'yAxis', yAxisId, isPanorama));
  var viewBox = (0, _chartLayoutContext.useViewBox)();
  if (!clipPathId || !viewBox || xAxis == null || yAxis == null || xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var endPoints = getEndPoints(xAxisScale, yAxisScale, viewBox, props.position, xAxis.orientation, yAxis.orientation, props);
  if (!endPoints) {
    return null;
  }
  var point1 = endPoints[0];
  var point2 = endPoints[1];
  if (point1 == null || point2 == null) {
    return null;
  }
  var x1 = point1.x,
    y1 = point1.y;
  var x2 = point2.x,
    y2 = point2.y;
  var clipPath = ifOverflow === 'hidden' ? "url(#".concat(clipPathId, ")") : undefined;
  var lineProps = _objectSpread(_objectSpread({
    clipPath
  }, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(props)), {}, {
    x1,
    y1,
    x2,
    y2
  });
  var rect = (0, _CartesianUtils.rectWithCoords)({
    x1,
    y1,
    x2,
    y2
  });
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: (0, _clsx.clsx)('recharts-reference-line', className)
  }, renderLine(shape, lineProps), /*#__PURE__*/React.createElement(_Label.CartesianLabelContextProvider, _extends({}, rect, {
    lowerWidth: rect.width,
    upperWidth: rect.width
  }), /*#__PURE__*/React.createElement(_Label.CartesianLabelFromLabelProp, {
    label: props.label
  }), props.children)));
}
var referenceLineDefaultProps = exports.referenceLineDefaultProps = {
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  fill: 'none',
  label: false,
  stroke: '#ccc',
  fillOpacity: 1,
  strokeWidth: 1,
  position: 'middle',
  zIndex: _DefaultZIndexes.DefaultZIndexes.line
};
/**
 * Draws a line on the chart connecting two points.
 *
 * This component, unlike {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/line line}, is aware of the cartesian coordinate system,
 * so you specify the dimensions by using data coordinates instead of pixels.
 *
 * ReferenceLine will calculate the pixels based on the provided data coordinates.
 *
 * If you prefer to render using pixels rather than data coordinates,
 * consider using the {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/line line SVG element} instead.
 *
 * @provides CartesianLabelContext
 * @consumes CartesianChartContext
 */
function ReferenceLine(outsideProps) {
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, referenceLineDefaultProps);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportReferenceLine, {
    yAxisId: props.yAxisId,
    xAxisId: props.xAxisId,
    ifOverflow: props.ifOverflow,
    x: props.x,
    y: props.y,
    segment: props.segment
  }), /*#__PURE__*/React.createElement(ReferenceLineImpl, props));
}
ReferenceLine.displayName = 'ReferenceLine';