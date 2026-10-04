"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yAxisDefaultProps = exports.YAxis = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _CartesianAxis = require("./CartesianAxis");
var _cartesianAxisSlice = require("../state/cartesianAxisSlice");
var _hooks = require("../state/hooks");
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function SetYAxisSettings(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var prevSettingsRef = (0, _react.useRef)(null);
  var layout = (0, _chartLayoutContext.useCartesianChartLayout)();
  var typeFromProps = props.type,
    restProps = _objectWithoutProperties(props, _excluded);
  var evaluatedType = (0, _getAxisTypeBasedOnLayout.getAxisTypeBasedOnLayout)(layout, 'yAxis', typeFromProps);
  var settings = (0, _react.useMemo)(() => {
    if (evaluatedType == null) {
      return undefined;
    }
    return _objectSpread(_objectSpread({}, restProps), {}, {
      type: evaluatedType
    });
  }, [evaluatedType, restProps]);
  (0, _react.useLayoutEffect)(() => {
    if (settings == null) {
      return;
    }
    if (prevSettingsRef.current === null) {
      dispatch((0, _cartesianAxisSlice.addYAxis)(settings));
    } else if (prevSettingsRef.current !== settings) {
      dispatch((0, _cartesianAxisSlice.replaceYAxis)({
        prev: prevSettingsRef.current,
        next: settings
      }));
    }
    prevSettingsRef.current = settings;
  }, [settings, dispatch]);
  (0, _react.useLayoutEffect)(() => {
    return () => {
      if (prevSettingsRef.current) {
        dispatch((0, _cartesianAxisSlice.removeYAxis)(prevSettingsRef.current));
        prevSettingsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}
function YAxisImpl(props) {
  var yAxisId = props.yAxisId,
    className = props.className,
    width = props.width,
    label = props.label;
  var cartesianAxisRef = (0, _react.useRef)(null);
  var labelRef = (0, _react.useRef)(null);
  var viewBox = (0, _hooks.useAppSelector)(_selectChartOffsetInternal.selectAxisViewBox);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var dispatch = (0, _hooks.useAppDispatch)();
  var axisType = 'yAxis';
  var axisSize = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectYAxisSize)(state, yAxisId));
  var position = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectYAxisPosition)(state, yAxisId));
  var cartesianTickItems = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectTicksOfAxis)(state, axisType, yAxisId, isPanorama));
  /*
   * Here we select settings from the store and prefer to use them instead of the actual props
   * so that the chart is consistent. If we used the props directly, some components will use axis settings
   * from state and some from props and because there is a render step between these two, they might be showing different things.
   * https://github.com/recharts/recharts/issues/6257
   */
  var synchronizedSettings = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectYAxisSettingsNoDefaults)(state, yAxisId));
  (0, _react.useLayoutEffect)(() => {
    // No dynamic width calculation is done when width !== 'auto'
    // or when a function/react element is used for label
    if (width !== 'auto' || !axisSize || (0, _Label.isLabelContentAFunction)(label) || /*#__PURE__*/(0, _react.isValidElement)(label) || synchronizedSettings == null) {
      return;
    }
    var axisComponent = cartesianAxisRef.current;
    if (!axisComponent) {
      return;
    }
    var updatedYAxisWidth = axisComponent.getCalculatedWidth();

    // if the width has changed, dispatch an action to update the width
    if (Math.round(axisSize.width) !== Math.round(updatedYAxisWidth)) {
      dispatch((0, _cartesianAxisSlice.updateYAxisWidth)({
        id: yAxisId,
        width: updatedYAxisWidth
      }));
    }
  }, [
  // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
  // The ref will be populated by then.
  // To re-run this effect when ticks change, we can depend on the ticks array from the store.
  cartesianTickItems, axisSize, dispatch, label, yAxisId, width, synchronizedSettings]);
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
    tickTextProps: width === 'auto' ? {
      width: undefined
    } : {
      width
    },
    width: axisSize.width,
    height: axisSize.height,
    className: (0, _clsx.clsx)("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox: viewBox,
    ticks: cartesianTickItems,
    axisType: axisType,
    axisId: yAxisId
  }));
}
var yAxisDefaultProps = exports.yAxisDefaultProps = {
  allowDataOverflow: _axisSelectors.implicitYAxis.allowDataOverflow,
  allowDecimals: _axisSelectors.implicitYAxis.allowDecimals,
  allowDuplicatedCategory: _axisSelectors.implicitYAxis.allowDuplicatedCategory,
  angle: _axisSelectors.implicitYAxis.angle,
  axisLine: _CartesianAxis.defaultCartesianAxisProps.axisLine,
  hide: false,
  includeHidden: _axisSelectors.implicitYAxis.includeHidden,
  interval: _axisSelectors.implicitYAxis.interval,
  label: false,
  minTickGap: _axisSelectors.implicitYAxis.minTickGap,
  mirror: _axisSelectors.implicitYAxis.mirror,
  orientation: _axisSelectors.implicitYAxis.orientation,
  padding: _axisSelectors.implicitYAxis.padding,
  reversed: _axisSelectors.implicitYAxis.reversed,
  scale: _axisSelectors.implicitYAxis.scale,
  tick: _axisSelectors.implicitYAxis.tick,
  tickCount: _axisSelectors.implicitYAxis.tickCount,
  tickLine: _CartesianAxis.defaultCartesianAxisProps.tickLine,
  tickSize: _CartesianAxis.defaultCartesianAxisProps.tickSize,
  type: _axisSelectors.implicitYAxis.type,
  niceTicks: _axisSelectors.implicitYAxis.niceTicks,
  width: _axisSelectors.implicitYAxis.width,
  yAxisId: 0
};
var YAxisSettingsDispatcher = outsideProps => {
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, yAxisDefaultProps);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetYAxisSettings, {
    interval: props.interval,
    id: props.yAxisId,
    scale: props.scale,
    type: props.type,
    domain: props.domain,
    allowDataOverflow: props.allowDataOverflow,
    dataKey: props.dataKey,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    allowDecimals: props.allowDecimals,
    tickCount: props.tickCount,
    padding: props.padding,
    includeHidden: props.includeHidden,
    reversed: props.reversed,
    ticks: props.ticks,
    width: props.width,
    orientation: props.orientation,
    mirror: props.mirror,
    hide: props.hide,
    unit: props.unit,
    name: props.name,
    angle: props.angle,
    minTickGap: props.minTickGap,
    tick: props.tick,
    tickFormatter: props.tickFormatter,
    niceTicks: props.niceTicks
  }), /*#__PURE__*/React.createElement(YAxisImpl, props));
};

/**
 * @consumes CartesianViewBoxContext
 * @provides CartesianLabelContext
 */
var YAxis = exports.YAxis = /*#__PURE__*/React.memo(YAxisSettingsDispatcher, _axisPropsAreEqual.axisPropsAreEqual);
// @ts-expect-error we need to set the displayName for debugging purposes

YAxis.displayName = 'YAxis';