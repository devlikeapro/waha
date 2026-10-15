"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferenceDot = ReferenceDot;
exports.referenceDotDefaultProps = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Layer = require("../container/Layer");
var _Dot = require("../shape/Dot");
var _Label = require("../component/Label");
var _DataUtils = require("../util/DataUtils");
var _referenceElementsSlice = require("../state/referenceElementsSlice");
var _hooks = require("../state/hooks");
var _axisSelectors = require("../state/selectors/axisSelectors");
var _PanoramaContext = require("../context/PanoramaContext");
var _ClipPathProvider = require("../container/ClipPathProvider");
var _svgPropertiesAndEvents = require("../util/svgPropertiesAndEvents");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var _CartesianScaleHelper = require("../util/scale/CartesianScaleHelper");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var useCoordinate = (x, y, xAxisId, yAxisId, ifOverflow) => {
  var isX = (0, _DataUtils.isNumOrStr)(x);
  var isY = (0, _DataUtils.isNumOrStr)(y);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var xAxisScale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'xAxis', xAxisId, isPanorama));
  var yAxisScale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'yAxis', yAxisId, isPanorama));
  if (!isX || !isY || xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var scales = new _CartesianScaleHelper.CartesianScaleHelperImpl({
    x: xAxisScale,
    y: yAxisScale
  });
  var result = scales.map({
    x,
    y
  }, {
    position: 'middle'
  });
  if (ifOverflow === 'discard' && !scales.isInRange(result)) {
    return null;
  }
  return result;
};
function ReportReferenceDot(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _referenceElementsSlice.addDot)(props));
    return () => {
      dispatch((0, _referenceElementsSlice.removeDot)(props));
    };
  });
  return null;
}
var renderDot = (option, props) => {
  var dot;
  if (/*#__PURE__*/React.isValidElement(option)) {
    // @ts-expect-error element cloning is not typed
    dot = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    dot = option(props);
  } else {
    dot = /*#__PURE__*/React.createElement(_Dot.Dot, _extends({}, props, {
      cx: props.cx,
      cy: props.cy,
      className: "recharts-reference-dot-dot"
    }));
  }
  return dot;
};
function ReferenceDotImpl(props) {
  var x = props.x,
    y = props.y,
    r = props.r;
  var clipPathId = (0, _ClipPathProvider.useClipPathId)();
  var coordinate = useCoordinate(x, y, props.xAxisId, props.yAxisId, props.ifOverflow);
  if (!coordinate) {
    return null;
  }
  var cx = coordinate.x,
    cy = coordinate.y;
  var shape = props.shape,
    className = props.className,
    ifOverflow = props.ifOverflow;
  var clipPath = ifOverflow === 'hidden' ? "url(#".concat(clipPathId, ")") : undefined;
  var dotProps = _objectSpread(_objectSpread({
    clipPath
  }, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(props)), {}, {
    cx: cx !== null && cx !== void 0 ? cx : undefined,
    cy: cy !== null && cy !== void 0 ? cy : undefined
  });
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: (0, _clsx.clsx)('recharts-reference-dot', className)
  }, renderDot(shape, dotProps), /*#__PURE__*/React.createElement(_Label.CartesianLabelContextProvider, {
    x: cx - r,
    y: cy - r,
    width: 2 * r,
    height: 2 * r,
    upperWidth: 2 * r,
    lowerWidth: 2 * r
  }, /*#__PURE__*/React.createElement(_Label.CartesianLabelFromLabelProp, {
    label: props.label
  }), props.children)));
}
var referenceDotDefaultProps = exports.referenceDotDefaultProps = {
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  label: false,
  fill: '#fff',
  stroke: '#ccc',
  fillOpacity: 1,
  strokeWidth: 1,
  zIndex: _DefaultZIndexes.DefaultZIndexes.scatter
};
/**
 * Draws a circle on the chart to highlight a specific point.
 *
 * This component, unlike {@link Dot} or {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/circle circle}, is aware of the cartesian coordinate system,
 * so you specify its center by using data coordinates instead of pixels.
 *
 * ReferenceDot will calculate the pixels based on the provided data coordinates.
 *
 * If you prefer to render dots using pixels rather than data coordinates,
 * consider using the {@link Dot} component instead.
 *
 * @provides CartesianLabelContext
 * @consumes CartesianChartContext
 */
function ReferenceDot(outsideProps) {
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, referenceDotDefaultProps);
  var x = props.x,
    y = props.y,
    r = props.r,
    ifOverflow = props.ifOverflow,
    yAxisId = props.yAxisId,
    xAxisId = props.xAxisId;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportReferenceDot, {
    y: y,
    x: x,
    r: r,
    yAxisId: yAxisId,
    xAxisId: xAxisId,
    ifOverflow: ifOverflow
  }), /*#__PURE__*/React.createElement(ReferenceDotImpl, props));
}
ReferenceDot.displayName = 'ReferenceDot';