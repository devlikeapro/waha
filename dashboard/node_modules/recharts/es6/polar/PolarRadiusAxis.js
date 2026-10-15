var _excluded = ["type"],
  _excluded2 = ["cx", "cy", "angle", "axisLine"],
  _excluded3 = ["angle", "tickFormatter", "stroke", "tick"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import maxBy from 'es-toolkit/compat/maxBy';
import minBy from 'es-toolkit/compat/minBy';
import { clsx } from 'clsx';
import { Text } from '../component/Text';
import { PolarLabelContextProvider, PolarLabelFromLabelProp } from '../component/Label';
import { Layer } from '../container/Layer';
import { polarToCartesian } from '../util/PolarUtils';
import { adaptEventsOfChild } from '../util/types';
import { addRadiusAxis, removeRadiusAxis } from '../state/polarAxisSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectPolarAxisScale, selectPolarAxisTicks } from '../state/selectors/polarScaleSelectors';
import { selectPolarViewBox } from '../state/selectors/polarAxisSelectors';
import { defaultPolarRadiusAxisProps } from './defaultPolarRadiusAxisProps';
import { svgPropertiesNoEvents, svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { ZIndexLayer } from '../zIndex/ZIndexLayer';
import { usePolarChartLayout } from '../context/chartLayoutContext';
import { noop } from '../util/DataUtils';
import { getAxisTypeBasedOnLayout } from '../util/getAxisTypeBasedOnLayout';
import { getClassNameFromUnknown } from '../util/getClassNameFromUnknown';
var AXIS_TYPE = 'radiusAxis';
function SetRadiusAxisSettings(props) {
  var dispatch = useAppDispatch();
  var layout = usePolarChartLayout();
  var settings = useMemo(() => {
    var typeFromProps = props.type,
      rest = _objectWithoutProperties(props, _excluded);
    var evaluatedType = getAxisTypeBasedOnLayout(layout, 'radiusAxis', typeFromProps);
    if (evaluatedType == null) {
      return undefined;
    }
    return _objectSpread(_objectSpread({}, rest), {}, {
      type: evaluatedType
    });
  }, [props, layout]);
  useEffect(() => {
    if (settings == null) {
      return noop;
    }
    dispatch(addRadiusAxis(settings));
    return () => {
      dispatch(removeRadiusAxis(settings));
    };
  }, [dispatch, settings]);
  return null;
}

/**
 * Calculate the coordinate of tick
 * @param coordinate The radius of tick
 * @param angle from props
 * @param cx from chart
 * @param cy from chart
 * @return (x, y)
 */
var getTickValueCoord = (_ref, angle, cx, cy) => {
  var coordinate = _ref.coordinate;
  return polarToCartesian(cx, cy, coordinate, angle);
};
var getTickTextAnchor = orientation => {
  var textAnchor;
  switch (orientation) {
    case 'left':
      textAnchor = 'end';
      break;
    case 'right':
      textAnchor = 'start';
      break;
    default:
      textAnchor = 'middle';
      break;
  }
  return textAnchor;
};
var getViewBox = (angle, cx, cy, ticks) => {
  var maxRadiusTick = maxBy(ticks, entry => entry.coordinate || 0);
  var minRadiusTick = minBy(ticks, entry => entry.coordinate || 0);
  return {
    cx,
    cy,
    startAngle: angle,
    endAngle: angle,
    innerRadius: (minRadiusTick === null || minRadiusTick === void 0 ? void 0 : minRadiusTick.coordinate) || 0,
    outerRadius: (maxRadiusTick === null || maxRadiusTick === void 0 ? void 0 : maxRadiusTick.coordinate) || 0,
    clockWise: false
  };
};
var renderAxisLine = (props, ticks) => {
  var cx = props.cx,
    cy = props.cy,
    angle = props.angle,
    axisLine = props.axisLine,
    others = _objectWithoutProperties(props, _excluded2);
  var extent = ticks.reduce((result, entry) => [Math.min(result[0], entry.coordinate), Math.max(result[1], entry.coordinate)], [Infinity, -Infinity]);
  var point0 = polarToCartesian(cx, cy, extent[0], angle);
  var point1 = polarToCartesian(cx, cy, extent[1], angle);
  var axisLineProps = _objectSpread(_objectSpread(_objectSpread({}, svgPropertiesNoEvents(others)), {}, {
    fill: 'none'
  }, svgPropertiesNoEvents(axisLine)), {}, {
    x1: point0.x,
    y1: point0.y,
    x2: point1.x,
    y2: point1.y
  });

  // @ts-expect-error wrong SVG element type
  return /*#__PURE__*/React.createElement("line", _extends({
    className: "recharts-polar-radius-axis-line"
  }, axisLineProps));
};
var renderTickItem = (option, tickProps, value) => {
  var tickItem;
  if (/*#__PURE__*/React.isValidElement(option)) {
    tickItem = /*#__PURE__*/React.cloneElement(option, tickProps);
  } else if (typeof option === 'function') {
    tickItem = option(tickProps);
  } else {
    tickItem = /*#__PURE__*/React.createElement(Text, _extends({}, tickProps, {
      className: "recharts-polar-radius-axis-tick-value"
    }), value);
  }
  return tickItem;
};
var renderTicks = (props, ticks) => {
  var angle = props.angle,
    tickFormatter = props.tickFormatter,
    stroke = props.stroke,
    tick = props.tick,
    others = _objectWithoutProperties(props, _excluded3);
  var textAnchor = getTickTextAnchor(props.orientation);
  var axisProps = svgPropertiesNoEvents(others);
  var customTickProps = svgPropertiesNoEventsFromUnknown(tick);
  var items = ticks.map((entry, i) => {
    var coord = getTickValueCoord(entry, props.angle, props.cx, props.cy);
    var tickProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
      textAnchor,
      transform: "rotate(".concat(90 - angle, ", ").concat(coord.x, ", ").concat(coord.y, ")")
    }, axisProps), {}, {
      stroke: 'none',
      fill: stroke
    }, customTickProps), {}, {
      index: i
    }, coord), {}, {
      payload: entry
    });
    return /*#__PURE__*/React.createElement(Layer, _extends({
      className: clsx('recharts-polar-radius-axis-tick', getClassNameFromUnknown(tick)),
      key: "tick-".concat(entry.coordinate)
    }, adaptEventsOfChild(props, entry, i)), renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i) : entry.value));
  });
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-polar-radius-axis-ticks"
  }, items);
};
export var PolarRadiusAxisWrapper = defaultsAndInputs => {
  var radiusAxisId = defaultsAndInputs.radiusAxisId;
  var viewBox = useAppSelector(selectPolarViewBox);
  var scale = useAppSelector(state => selectPolarAxisScale(state, 'radiusAxis', radiusAxisId));
  var ticks = useAppSelector(state => selectPolarAxisTicks(state, 'radiusAxis', radiusAxisId, false));
  if (viewBox == null || !ticks || !ticks.length || scale == null) {
    return null;
  }
  var props = _objectSpread(_objectSpread({}, defaultsAndInputs), {}, {
    scale
  }, viewBox);
  var tick = props.tick,
    axisLine = props.axisLine;
  return /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(Layer, {
    className: clsx('recharts-polar-radius-axis', AXIS_TYPE, props.className)
  }, axisLine && renderAxisLine(props, ticks), tick && renderTicks(props, ticks), /*#__PURE__*/React.createElement(PolarLabelContextProvider, getViewBox(props.angle, props.cx, props.cy, ticks), /*#__PURE__*/React.createElement(PolarLabelFromLabelProp, {
    label: props.label
  }), props.children)));
};

/**
 * @provides PolarLabelContext
 * @consumes PolarViewBoxContext
 */
export function PolarRadiusAxis(outsideProps) {
  var _props$niceTicks;
  var props = resolveDefaultProps(outsideProps, defaultPolarRadiusAxisProps);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetRadiusAxisSettings, {
    domain: props.domain,
    id: props.radiusAxisId,
    scale: props.scale,
    type: props.type,
    dataKey: props.dataKey,
    unit: undefined,
    name: props.name,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    allowDataOverflow: props.allowDataOverflow,
    reversed: props.reversed,
    includeHidden: props.includeHidden,
    allowDecimals: props.allowDecimals,
    niceTicks: (_props$niceTicks = props.niceTicks) !== null && _props$niceTicks !== void 0 ? _props$niceTicks : 'auto',
    ticks: props.ticks,
    tickCount: props.tickCount,
    tick: props.tick
  }), /*#__PURE__*/React.createElement(PolarRadiusAxisWrapper, props));
}
PolarRadiusAxis.displayName = 'PolarRadiusAxis';