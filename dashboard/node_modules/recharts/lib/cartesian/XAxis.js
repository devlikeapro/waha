"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xAxisDefaultProps = exports.XAxis = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _CartesianAxis = require("./CartesianAxis");
var _hooks = require("../state/hooks");
var _cartesianAxisSlice = require("../state/cartesianAxisSlice");
var _axisSelectors = require("../state/selectors/axisSelectors");
var _selectChartOffsetInternal = require("../state/selectors/selectChartOffsetInternal");
var _PanoramaContext = require("../context/PanoramaContext");
var _Label = require("../component/Label");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _axisPropsAreEqual = require("../util/axisPropsAreEqual");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _getAxisTypeBasedOnLayout = require("../util/getAxisTypeBasedOnLayout");
var _excluded = ["type"],
  _excluded2 = ["dangerouslySetInnerHTML", "ticks", "scale"],
  _excluded3 = ["id", "scale"];
/**
 * @fileOverview X Axis
 */
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function SetXAxisSettings(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var prevSettingsRef = (0, _react.useRef)(null);
  var layout = (0, _chartLayoutContext.useCartesianChartLayout)();
  var typeFromProps = props.type,
    restProps = _objectWithoutProperties(props, _excluded);
  var evaluatedType = (0, _getAxisTypeBasedOnLayout.getAxisTypeBasedOnLayout)(layout, 'xAxis', typeFromProps);
  var settings = (0, _react.useMemo)(() => {
    if (evaluatedType == null) {
      return undefined;
    }
    return _objectSpread(_objectSpread({}, restProps), {}, {
      type: evaluatedType
    });
  }, [restProps, evaluatedType]);
  (0, _react.useLayoutEffect)(() => {
    if (settings == null) {
      return;
    }
    if (prevSettingsRef.current === null) {
      dispatch((0, _cartesianAxisSlice.addXAxis)(settings));
    } else if (prevSettingsRef.current !== settings) {
      dispatch((0, _cartesianAxisSlice.replaceXAxis)({
        prev: prevSettingsRef.current,
        next: settings
      }));
    }
    prevSettingsRef.current = settings;
  }, [settings, dispatch]);
  (0, _react.useLayoutEffect)(() => {
    return () => {
      if (prevSettingsRef.current) {
        dispatch((0, _cartesianAxisSlice.removeXAxis)(prevSettingsRef.current));
        prevSettingsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}
var XAxisImpl = props => {
  var xAxisId = props.xAxisId,
    className = props.className,
    height = props.height,
    label = props.label;
  var cartesianAxisRef = (0, _react.useRef)(null);
  var labelRef = (0, _react.useRef)(null);
  var viewBox = (0, _hooks.useAppSelector)(_selectChartOffsetInternal.selectAxisViewBox);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var dispatch = (0, _hooks.useAppDispatch)();
  var axisType = 'xAxis';
  var cartesianTickItems = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectTicksOfAxis)(state, axisType, xAxisId, isPanorama));
  var axisSize = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectXAxisSize)(state, xAxisId));
  var position = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectXAxisPosition)(state, xAxisId));
  /*
   * Here we select settings from the store and prefer to use them instead of the actual props
   * so that the chart is consistent. If we used the props directly, some components will use axis settings
   * from state and some from props and because there is a render step between these two, they might be showing different things.
   * https://github.com/recharts/recharts/issues/6257
   */
  var synchronizedSettings = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectXAxisSettingsNoDefaults)(state, xAxisId));
  (0, _react.useLayoutEffect)(() => {
    // No dynamic height calculation is done when height !== 'auto'
    // or when a function/react element is used for label
    if (height !== 'auto' || !axisSize || (0, _Label.isLabelContentAFunction)(label) || /*#__PURE__*/(0, _react.isValidElement)(label) || synchronizedSettings == null) {
      return;
    }
    var axisComponent = cartesianAxisRef.current;
    if (!axisComponent) {
      return;
    }
    var updatedXAxisHeight = axisComponent.getCalculatedHeight();

    // if the height has changed, dispatch an action to update the height
    if (Math.round(axisSize.height) !== Math.round(updatedXAxisHeight)) {
      dispatch((0, _cartesianAxisSlice.updateXAxisHeight)({
        id: xAxisId,
        height: updatedXAxisHeight
      }));
    }
  }, [
  // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
  // The ref will be populated by then.
  // To re-run this effect when ticks change, we can depend on the ticks array from the store.
  cartesianTickItems, axisSize, dispatch, label, xAxisId, height, synchronizedSettings]);
  if (axisSize == null || position == null || synchronizedSettings == null) {
    return null;
  }
  var dangerouslySetInnerHTML = props.dangerouslySetInnerHTML,
    ticks = props.ticks,
    del = props.scale,
    allOtherProps = _objectWithoutProperties(props, _excluded2);
  var id = synchronizedSettings.id,
    del2 = synchronizedSettings.scale,
    restSynchronizedSettings = _objectWithoutProperties(synchronizedSettings, _excluded3);
  return /*#__PURE__*/React.createElement(_CartesianAxis.CartesianAxis, _extends({}, allOtherProps, restSynchronizedSettings, {
    ref: cartesianAxisRef,
    labelRef: labelRef,
    x: position.x,
    y: position.y,
    width: axisSize.width,
    height: axisSize.height,
    className: (0, _clsx.clsx)("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox: viewBox,
    ticks: cartesianTickItems,
    axisType: axisType,
    axisId: xAxisId
  }));
};
var xAxisDefaultProps = exports.xAxisDefaultProps = {
  allowDataOverflow: _axisSelectors.implicitXAxis.allowDataOverflow,
  allowDecimals: _axisSelectors.implicitXAxis.allowDecimals,
  allowDuplicatedCategory: _axisSelectors.implicitXAxis.allowDuplicatedCategory,
  angle: _axisSelectors.implicitXAxis.angle,
  axisLine: _CartesianAxis.defaultCartesianAxisProps.axisLine,
  height: _axisSelectors.implicitXAxis.height,
  hide: false,
  includeHidden: _axisSelectors.implicitXAxis.includeHidden,
  interval: _axisSelectors.implicitXAxis.interval,
  label: false,
  minTickGap: _axisSelectors.implicitXAxis.minTickGap,
  mirror: _axisSelectors.implicitXAxis.mirror,
  orientation: _axisSelectors.implicitXAxis.orientation,
  padding: _axisSelectors.implicitXAxis.padding,
  reversed: _axisSelectors.implicitXAxis.reversed,
  scale: _axisSelectors.implicitXAxis.scale,
  tick: _axisSelectors.implicitXAxis.tick,
  tickCount: _axisSelectors.implicitXAxis.tickCount,
  tickLine: _CartesianAxis.defaultCartesianAxisProps.tickLine,
  tickSize: _CartesianAxis.defaultCartesianAxisProps.tickSize,
  type: _axisSelectors.implicitXAxis.type,
  niceTicks: _axisSelectors.implicitXAxis.niceTicks,
  xAxisId: 0
};
var XAxisSettingsDispatcher = outsideProps => {
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, xAxisDefaultProps);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetXAxisSettings, {
    allowDataOverflow: props.allowDataOverflow,
    allowDecimals: props.allowDecimals,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    angle: props.angle,
    dataKey: props.dataKey,
    domain: props.domain,
    height: props.height,
    hide: props.hide,
    id: props.xAxisId,
    includeHidden: props.includeHidden,
    interval: props.interval,
    minTickGap: props.minTickGap,
    mirror: props.mirror,
    name: props.name,
    orientation: props.orientation,
    padding: props.padding,
    reversed: props.reversed,
    scale: props.scale,
    tick: props.tick,
    tickCount: props.tickCount,
    tickFormatter: props.tickFormatter,
    ticks: props.ticks,
    type: props.type,
    unit: props.unit,
    niceTicks: props.niceTicks
  }), /*#__PURE__*/React.createElement(XAxisImpl, props));
};

/**
 * @consumes CartesianViewBoxContext
 * @provides CartesianLabelContext
 */
var XAxis = exports.XAxis = /*#__PURE__*/React.memo(XAxisSettingsDispatcher, _axisPropsAreEqual.axisPropsAreEqual);
// @ts-expect-error we need to set the displayName for debugging purposes

XAxis.displayName = 'XAxis';