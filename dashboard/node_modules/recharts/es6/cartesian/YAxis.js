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
import * as React from 'react';
import { isValidElement, useLayoutEffect, useMemo, useRef } from 'react';
import { clsx } from 'clsx';
import { CartesianAxis, defaultCartesianAxisProps } from './CartesianAxis';
import { addYAxis, replaceYAxis, removeYAxis, updateYAxisWidth } from '../state/cartesianAxisSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { implicitYAxis, selectTicksOfAxis, selectYAxisPosition, selectYAxisSettingsNoDefaults, selectYAxisSize } from '../state/selectors/axisSelectors';
import { selectAxisViewBox } from '../state/selectors/selectChartOffsetInternal';
import { useIsPanorama } from '../context/PanoramaContext';
import { isLabelContentAFunction } from '../component/Label';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { axisPropsAreEqual } from '../util/axisPropsAreEqual';
import { useCartesianChartLayout } from '../context/chartLayoutContext';
import { getAxisTypeBasedOnLayout } from '../util/getAxisTypeBasedOnLayout';
function SetYAxisSettings(props) {
  var dispatch = useAppDispatch();
  var prevSettingsRef = useRef(null);
  var layout = useCartesianChartLayout();
  var typeFromProps = props.type,
    restProps = _objectWithoutProperties(props, _excluded);
  var evaluatedType = getAxisTypeBasedOnLayout(layout, 'yAxis', typeFromProps);
  var settings = useMemo(() => {
    if (evaluatedType == null) {
      return undefined;
    }
    return _objectSpread(_objectSpread({}, restProps), {}, {
      type: evaluatedType
    });
  }, [evaluatedType, restProps]);
  useLayoutEffect(() => {
    if (settings == null) {
      return;
    }
    if (prevSettingsRef.current === null) {
      dispatch(addYAxis(settings));
    } else if (prevSettingsRef.current !== settings) {
      dispatch(replaceYAxis({
        prev: prevSettingsRef.current,
        next: settings
      }));
    }
    prevSettingsRef.current = settings;
  }, [settings, dispatch]);
  useLayoutEffect(() => {
    return () => {
      if (prevSettingsRef.current) {
        dispatch(removeYAxis(prevSettingsRef.current));
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
  var cartesianAxisRef = useRef(null);
  var labelRef = useRef(null);
  var viewBox = useAppSelector(selectAxisViewBox);
  var isPanorama = useIsPanorama();
  var dispatch = useAppDispatch();
  var axisType = 'yAxis';
  var axisSize = useAppSelector(state => selectYAxisSize(state, yAxisId));
  var position = useAppSelector(state => selectYAxisPosition(state, yAxisId));
  var cartesianTickItems = useAppSelector(state => selectTicksOfAxis(state, axisType, yAxisId, isPanorama));
  /*
   * Here we select settings from the store and prefer to use them instead of the actual props
   * so that the chart is consistent. If we used the props directly, some components will use axis settings
   * from state and some from props and because there is a render step between these two, they might be showing different things.
   * https://github.com/recharts/recharts/issues/6257
   */
  var synchronizedSettings = useAppSelector(state => selectYAxisSettingsNoDefaults(state, yAxisId));
  useLayoutEffect(() => {
    // No dynamic width calculation is done when width !== 'auto'
    // or when a function/react element is used for label
    if (width !== 'auto' || !axisSize || isLabelContentAFunction(label) || /*#__PURE__*/isValidElement(label) || synchronizedSettings == null) {
      return;
    }
    var axisComponent = cartesianAxisRef.current;
    if (!axisComponent) {
      return;
    }
    var updatedYAxisWidth = axisComponent.getCalculatedWidth();

    // if the width has changed, dispatch an action to update the width
    if (Math.round(axisSize.width) !== Math.round(updatedYAxisWidth)) {
      dispatch(updateYAxisWidth({
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
  return /*#__PURE__*/React.createElement(CartesianAxis, _extends({}, allOtherProps, restSynchronizedSettings, {
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
    className: clsx("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox: viewBox,
    ticks: cartesianTickItems,
    axisType: axisType,
    axisId: yAxisId
  }));
}
export var yAxisDefaultProps = {
  allowDataOverflow: implicitYAxis.allowDataOverflow,
  allowDecimals: implicitYAxis.allowDecimals,
  allowDuplicatedCategory: implicitYAxis.allowDuplicatedCategory,
  angle: implicitYAxis.angle,
  axisLine: defaultCartesianAxisProps.axisLine,
  hide: false,
  includeHidden: implicitYAxis.includeHidden,
  interval: implicitYAxis.interval,
  label: false,
  minTickGap: implicitYAxis.minTickGap,
  mirror: implicitYAxis.mirror,
  orientation: implicitYAxis.orientation,
  padding: implicitYAxis.padding,
  reversed: implicitYAxis.reversed,
  scale: implicitYAxis.scale,
  tick: implicitYAxis.tick,
  tickCount: implicitYAxis.tickCount,
  tickLine: defaultCartesianAxisProps.tickLine,
  tickSize: defaultCartesianAxisProps.tickSize,
  type: implicitYAxis.type,
  niceTicks: implicitYAxis.niceTicks,
  width: implicitYAxis.width,
  yAxisId: 0
};
var YAxisSettingsDispatcher = outsideProps => {
  var props = resolveDefaultProps(outsideProps, yAxisDefaultProps);
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
export var YAxis = /*#__PURE__*/React.memo(YAxisSettingsDispatcher, axisPropsAreEqual);
// @ts-expect-error we need to set the displayName for debugging purposes

YAxis.displayName = 'YAxis';