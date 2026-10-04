var _excluded = ["type"],
  _excluded2 = ["dangerouslySetInnerHTML", "ticks", "scale"],
  _excluded3 = ["id", "scale"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * @fileOverview X Axis
 */
import * as React from 'react';
import { isValidElement, useLayoutEffect, useMemo, useRef } from 'react';
import { clsx } from 'clsx';
import { CartesianAxis, defaultCartesianAxisProps } from './CartesianAxis';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { addXAxis, replaceXAxis, removeXAxis, updateXAxisHeight } from '../state/cartesianAxisSlice';
import { implicitXAxis, selectTicksOfAxis, selectXAxisPosition, selectXAxisSettingsNoDefaults, selectXAxisSize } from '../state/selectors/axisSelectors';
import { selectAxisViewBox } from '../state/selectors/selectChartOffsetInternal';
import { useIsPanorama } from '../context/PanoramaContext';
import { isLabelContentAFunction } from '../component/Label';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { axisPropsAreEqual } from '../util/axisPropsAreEqual';
import { useCartesianChartLayout } from '../context/chartLayoutContext';
import { getAxisTypeBasedOnLayout } from '../util/getAxisTypeBasedOnLayout';
function SetXAxisSettings(props) {
  var dispatch = useAppDispatch();
  var prevSettingsRef = useRef(null);
  var layout = useCartesianChartLayout();
  var typeFromProps = props.type,
    restProps = _objectWithoutProperties(props, _excluded);
  var evaluatedType = getAxisTypeBasedOnLayout(layout, 'xAxis', typeFromProps);
  var settings = useMemo(() => {
    if (evaluatedType == null) {
      return undefined;
    }
    return _objectSpread(_objectSpread({}, restProps), {}, {
      type: evaluatedType
    });
  }, [restProps, evaluatedType]);
  useLayoutEffect(() => {
    if (settings == null) {
      return;
    }
    if (prevSettingsRef.current === null) {
      dispatch(addXAxis(settings));
    } else if (prevSettingsRef.current !== settings) {
      dispatch(replaceXAxis({
        prev: prevSettingsRef.current,
        next: settings
      }));
    }
    prevSettingsRef.current = settings;
  }, [settings, dispatch]);
  useLayoutEffect(() => {
    return () => {
      if (prevSettingsRef.current) {
        dispatch(removeXAxis(prevSettingsRef.current));
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
  var cartesianAxisRef = useRef(null);
  var labelRef = useRef(null);
  var viewBox = useAppSelector(selectAxisViewBox);
  var isPanorama = useIsPanorama();
  var dispatch = useAppDispatch();
  var axisType = 'xAxis';
  var cartesianTickItems = useAppSelector(state => selectTicksOfAxis(state, axisType, xAxisId, isPanorama));
  var axisSize = useAppSelector(state => selectXAxisSize(state, xAxisId));
  var position = useAppSelector(state => selectXAxisPosition(state, xAxisId));
  /*
   * Here we select settings from the store and prefer to use them instead of the actual props
   * so that the chart is consistent. If we used the props directly, some components will use axis settings
   * from state and some from props and because there is a render step between these two, they might be showing different things.
   * https://github.com/recharts/recharts/issues/6257
   */
  var synchronizedSettings = useAppSelector(state => selectXAxisSettingsNoDefaults(state, xAxisId));
  useLayoutEffect(() => {
    // No dynamic height calculation is done when height !== 'auto'
    // or when a function/react element is used for label
    if (height !== 'auto' || !axisSize || isLabelContentAFunction(label) || /*#__PURE__*/isValidElement(label) || synchronizedSettings == null) {
      return;
    }
    var axisComponent = cartesianAxisRef.current;
    if (!axisComponent) {
      return;
    }
    var updatedXAxisHeight = axisComponent.getCalculatedHeight();

    // if the height has changed, dispatch an action to update the height
    if (Math.round(axisSize.height) !== Math.round(updatedXAxisHeight)) {
      dispatch(updateXAxisHeight({
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
  return /*#__PURE__*/React.createElement(CartesianAxis, _extends({}, allOtherProps, restSynchronizedSettings, {
    ref: cartesianAxisRef,
    labelRef: labelRef,
    x: position.x,
    y: position.y,
    width: axisSize.width,
    height: axisSize.height,
    className: clsx("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox: viewBox,
    ticks: cartesianTickItems,
    axisType: axisType,
    axisId: xAxisId
  }));
};
export var xAxisDefaultProps = {
  allowDataOverflow: implicitXAxis.allowDataOverflow,
  allowDecimals: implicitXAxis.allowDecimals,
  allowDuplicatedCategory: implicitXAxis.allowDuplicatedCategory,
  angle: implicitXAxis.angle,
  axisLine: defaultCartesianAxisProps.axisLine,
  height: implicitXAxis.height,
  hide: false,
  includeHidden: implicitXAxis.includeHidden,
  interval: implicitXAxis.interval,
  label: false,
  minTickGap: implicitXAxis.minTickGap,
  mirror: implicitXAxis.mirror,
  orientation: implicitXAxis.orientation,
  padding: implicitXAxis.padding,
  reversed: implicitXAxis.reversed,
  scale: implicitXAxis.scale,
  tick: implicitXAxis.tick,
  tickCount: implicitXAxis.tickCount,
  tickLine: defaultCartesianAxisProps.tickLine,
  tickSize: defaultCartesianAxisProps.tickSize,
  type: implicitXAxis.type,
  niceTicks: implicitXAxis.niceTicks,
  xAxisId: 0
};
var XAxisSettingsDispatcher = outsideProps => {
  var props = resolveDefaultProps(outsideProps, xAxisDefaultProps);
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
export var XAxis = /*#__PURE__*/React.memo(XAxisSettingsDispatcher, axisPropsAreEqual);
// @ts-expect-error we need to set the displayName for debugging purposes

XAxis.displayName = 'XAxis';