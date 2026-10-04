var _excluded = ["axisLine", "width", "height", "className", "hide", "ticks", "axisType", "axisId"];
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @fileOverview Cartesian Axis
 */
import * as React from 'react';
import { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import get from 'es-toolkit/compat/get';
import isEqual from 'es-toolkit/compat/isEqual';
import { clsx } from 'clsx';
import { Layer } from '../container/Layer';
import { Text, isValidTextAnchor } from '../component/Text';
import { CartesianLabelContextProvider, CartesianLabelFromLabelProp } from '../component/Label';
import { isNumber, noop } from '../util/DataUtils';
import { adaptEventsOfChild } from '../util/types';
import { getTicks } from './getTicks';
import { svgPropertiesNoEvents, svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents';
import { getCalculatedYAxisWidth } from '../util/YAxisUtils';
import { getCalculatedXAxisHeight } from '../util/XAxisUtils';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { ZIndexLayer } from '../zIndex/ZIndexLayer';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes';
import { getClassNameFromUnknown } from '../util/getClassNameFromUnknown';
import { removeRenderedTicks, setRenderedTicks } from '../state/renderedTicksSlice';
import { useAppDispatch } from '../state/hooks';

/** The orientation of the axis in correspondence to the chart */

/** A unit to be appended to a value */

/** The formatter function of tick */

export var defaultCartesianAxisProps = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  // The orientation of axis
  orientation: 'bottom',
  // The ticks
  ticks: [],
  stroke: '#666',
  tickLine: true,
  axisLine: true,
  tick: true,
  mirror: false,
  minTickGap: 5,
  // The width or height of tick
  tickSize: 6,
  tickMargin: 2,
  interval: 'preserveEnd',
  zIndex: DefaultZIndexes.axis
};

/*
 * `viewBox` and `scale` are SVG attributes.
 * Recharts however - unfortunately - has its own attributes named `viewBox` and `scale`
 * that are completely different data shape and different purpose.
 */

function AxisLine(axisLineProps) {
  var x = axisLineProps.x,
    y = axisLineProps.y,
    width = axisLineProps.width,
    height = axisLineProps.height,
    orientation = axisLineProps.orientation,
    mirror = axisLineProps.mirror,
    axisLine = axisLineProps.axisLine,
    otherSvgProps = axisLineProps.otherSvgProps;
  if (!axisLine) {
    return null;
  }
  var props = _objectSpread(_objectSpread(_objectSpread({}, otherSvgProps), svgPropertiesNoEvents(axisLine)), {}, {
    fill: 'none'
  });
  if (orientation === 'top' || orientation === 'bottom') {
    var needHeight = +(orientation === 'top' && !mirror || orientation === 'bottom' && mirror);
    props = _objectSpread(_objectSpread({}, props), {}, {
      x1: x,
      y1: y + needHeight * height,
      x2: x + width,
      y2: y + needHeight * height
    });
  } else {
    var needWidth = +(orientation === 'left' && !mirror || orientation === 'right' && mirror);
    props = _objectSpread(_objectSpread({}, props), {}, {
      x1: x + needWidth * width,
      y1: y,
      x2: x + needWidth * width,
      y2: y + height
    });
  }
  return /*#__PURE__*/React.createElement("line", _extends({}, props, {
    className: clsx('recharts-cartesian-axis-line', get(axisLine, 'className'))
  }));
}

/**
 * Calculate the coordinates of endpoints in ticks.
 * @param data The data of a simple tick.
 * @param x The x-coordinate of the axis.
 * @param y The y-coordinate of the axis.
 * @param width The width of the axis.
 * @param height The height of the axis.
 * @param orientation The orientation of the axis.
 * @param tickSize The length of the tick line.
 * @param mirror If true, the ticks are mirrored.
 * @param tickMargin The margin between the tick line and the tick text.
 * @returns An object with `line` and `tick` coordinates.
 * `line` is the coordinates for the tick line, and `tick` is the coordinate for the tick text.
 */
function getTickLineCoord(data, x, y, width, height, orientation, tickSize, mirror, tickMargin) {
  var x1, x2, y1, y2, tx, ty;
  var sign = mirror ? -1 : 1;
  var finalTickSize = data.tickSize || tickSize;
  var tickCoord = isNumber(data.tickCoord) ? data.tickCoord : data.coordinate;
  switch (orientation) {
    case 'top':
      x1 = x2 = data.coordinate;
      y2 = y + +!mirror * height;
      y1 = y2 - sign * finalTickSize;
      ty = y1 - sign * tickMargin;
      tx = tickCoord;
      break;
    case 'left':
      y1 = y2 = data.coordinate;
      x2 = x + +!mirror * width;
      x1 = x2 - sign * finalTickSize;
      tx = x1 - sign * tickMargin;
      ty = tickCoord;
      break;
    case 'right':
      y1 = y2 = data.coordinate;
      x2 = x + +mirror * width;
      x1 = x2 + sign * finalTickSize;
      tx = x1 + sign * tickMargin;
      ty = tickCoord;
      break;
    default:
      x1 = x2 = data.coordinate;
      y2 = y + +mirror * height;
      y1 = y2 + sign * finalTickSize;
      ty = y1 + sign * tickMargin;
      tx = tickCoord;
      break;
  }
  return {
    line: {
      x1,
      y1,
      x2,
      y2
    },
    tick: {
      x: tx,
      y: ty
    }
  };
}

/**
 * @param orientation The orientation of the axis.
 * @param mirror If true, the ticks are mirrored.
 * @returns The text anchor of the tick.
 */
function getTickTextAnchor(orientation, mirror) {
  switch (orientation) {
    case 'left':
      return mirror ? 'start' : 'end';
    case 'right':
      return mirror ? 'end' : 'start';
    default:
      return 'middle';
  }
}

/**
 * @param orientation The orientation of the axis.
 * @param mirror If true, the ticks are mirrored.
 * @returns The vertical text anchor of the tick.
 */
function getTickVerticalAnchor(orientation, mirror) {
  switch (orientation) {
    case 'left':
    case 'right':
      return 'middle';
    case 'top':
      return mirror ? 'start' : 'end';
    default:
      return mirror ? 'end' : 'start';
  }
}
function TickItem(props) {
  var option = props.option,
    tickProps = props.tickProps,
    value = props.value;
  var tickItem;
  var combinedClassName = clsx(tickProps.className, 'recharts-cartesian-axis-tick-value');
  if (/*#__PURE__*/React.isValidElement(option)) {
    // @ts-expect-error element cloning is not typed
    tickItem = /*#__PURE__*/React.cloneElement(option, _objectSpread(_objectSpread({}, tickProps), {}, {
      className: combinedClassName
    }));
  } else if (typeof option === 'function') {
    tickItem = option(_objectSpread(_objectSpread({}, tickProps), {}, {
      className: combinedClassName
    }));
  } else {
    var className = 'recharts-cartesian-axis-tick-value';
    if (typeof option !== 'boolean') {
      className = clsx(className, getClassNameFromUnknown(option));
    }
    tickItem = /*#__PURE__*/React.createElement(Text, _extends({}, tickProps, {
      className: className
    }), value);
  }
  return tickItem;
}
function RenderedTicksReporter(_ref) {
  var ticks = _ref.ticks,
    axisType = _ref.axisType,
    axisId = _ref.axisId;
  var dispatch = useAppDispatch();
  /*
   * The ticks array gets a new identity on every render even when its contents are unchanged.
   * If we dispatched on every identity change, then every parent re-render would trigger
   * a store update from a passive effect. Under rapid external updates (e.g. a slider
   * driving chart data), those nested dispatches can trip React's update depth limit.
   * https://github.com/recharts/recharts/issues/7563
   */
  var lastDispatchedTicksRef = useRef(null);
  useEffect(() => {
    if (axisId == null || axisType == null) {
      return;
    }
    // Filter out irrelevant internal properties before exposing externally
    var tickItems = ticks.map(tick => ({
      value: tick.value,
      coordinate: tick.coordinate,
      offset: tick.offset,
      index: tick.index
    }));
    var last = lastDispatchedTicksRef.current;
    if (last != null && last.axisId === axisId && last.axisType === axisType && isEqual(last.ticks, tickItems)) {
      return;
    }
    lastDispatchedTicksRef.current = {
      ticks: tickItems,
      axisId,
      axisType
    };
    dispatch(setRenderedTicks({
      ticks: tickItems,
      axisId,
      axisType
    }));
  }, [dispatch, ticks, axisId, axisType]);
  useEffect(() => {
    if (axisId == null || axisType == null) {
      return noop;
    }
    return () => {
      dispatch(removeRenderedTicks({
        axisId,
        axisType
      }));
    };
  }, [dispatch, axisId, axisType]);
  return null;
}
var Ticks = /*#__PURE__*/forwardRef((props, ref) => {
  var _props$ticks = props.ticks,
    ticks = _props$ticks === void 0 ? [] : _props$ticks,
    tick = props.tick,
    tickLine = props.tickLine,
    stroke = props.stroke,
    tickFormatter = props.tickFormatter,
    unit = props.unit,
    padding = props.padding,
    tickTextProps = props.tickTextProps,
    orientation = props.orientation,
    mirror = props.mirror,
    x = props.x,
    y = props.y,
    width = props.width,
    height = props.height,
    tickSize = props.tickSize,
    tickMargin = props.tickMargin,
    fontSize = props.fontSize,
    letterSpacing = props.letterSpacing,
    getTicksConfig = props.getTicksConfig,
    events = props.events,
    axisType = props.axisType,
    axisId = props.axisId;
  // @ts-expect-error some properties are optional in props but required in getTicks
  var finalTicks = getTicks(_objectSpread(_objectSpread({}, getTicksConfig), {}, {
    ticks
  }), fontSize, letterSpacing);
  var axisProps = svgPropertiesNoEvents(getTicksConfig);
  var customTickProps = svgPropertiesNoEventsFromUnknown(tick);
  // Use user-provided textAnchor if available, otherwise calculate from orientation/mirror
  var textAnchor = isValidTextAnchor(axisProps.textAnchor) ? axisProps.textAnchor : getTickTextAnchor(orientation, mirror);
  var verticalAnchor = getTickVerticalAnchor(orientation, mirror);
  var tickLinePropsObject = {};
  if (typeof tickLine === 'object') {
    tickLinePropsObject = tickLine;
  }
  var tickLineProps = _objectSpread(_objectSpread({}, axisProps), {}, {
    fill: 'none'
  }, tickLinePropsObject);
  var tickLineCoords = finalTicks.map(entry => _objectSpread({
    entry
  }, getTickLineCoord(entry, x, y, width, height, orientation, tickSize, mirror, tickMargin)));
  var tickLines = tickLineCoords.map(_ref2 => {
    var entry = _ref2.entry,
      lineCoord = _ref2.line;
    return /*#__PURE__*/React.createElement(Layer, {
      className: "recharts-cartesian-axis-tick",
      key: "tick-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
    }, tickLine && /*#__PURE__*/React.createElement("line", _extends({}, tickLineProps, lineCoord, {
      className: clsx('recharts-cartesian-axis-tick-line', get(tickLine, 'className'))
    })));
  });
  var tickLabels = tickLineCoords.map((_ref3, i) => {
    var _ref4, _tickTextProps$angle;
    var entry = _ref3.entry,
      tickCoord = _ref3.tick;
    // @ts-expect-error we're not checking that padding and orientation types are in sync
    var tickProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
      verticalAnchor
    }, axisProps), {}, {
      textAnchor,
      stroke: 'none',
      fill: stroke
    }, tickCoord), {}, {
      index: i,
      payload: entry,
      visibleTicksCount: finalTicks.length,
      tickFormatter,
      padding
    }, tickTextProps), {}, {
      angle: (_ref4 = (_tickTextProps$angle = tickTextProps === null || tickTextProps === void 0 ? void 0 : tickTextProps.angle) !== null && _tickTextProps$angle !== void 0 ? _tickTextProps$angle : axisProps.angle) !== null && _ref4 !== void 0 ? _ref4 : 0
    });

    // @ts-expect-error customTickProps is contributing unknown props which we don't type properly
    var finalTickProps = _objectSpread(_objectSpread({}, tickProps), customTickProps);
    return /*#__PURE__*/React.createElement(Layer, _extends({
      className: "recharts-cartesian-axis-tick-label",
      key: "tick-label-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
    }, adaptEventsOfChild(events, entry, i)), tick && /*#__PURE__*/React.createElement(TickItem, {
      option: tick,
      tickProps: finalTickProps,
      value: "".concat(typeof tickFormatter === 'function' ? tickFormatter(entry.value, i) : entry.value).concat(unit || '')
    }));
  });
  return /*#__PURE__*/React.createElement("g", {
    className: "recharts-cartesian-axis-ticks recharts-".concat(axisType, "-ticks")
  }, /*#__PURE__*/React.createElement(RenderedTicksReporter, {
    ticks: finalTicks,
    axisId: axisId,
    axisType: axisType
  }), tickLabels.length > 0 && /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: DefaultZIndexes.label
  }, /*#__PURE__*/React.createElement("g", {
    className: "recharts-cartesian-axis-tick-labels recharts-".concat(axisType, "-tick-labels"),
    ref: ref
  }, tickLabels)), tickLines.length > 0 && /*#__PURE__*/React.createElement("g", {
    className: "recharts-cartesian-axis-tick-lines recharts-".concat(axisType, "-tick-lines")
  }, tickLines));
});
var CartesianAxisComponent = /*#__PURE__*/forwardRef((props, ref) => {
  var axisLine = props.axisLine,
    width = props.width,
    height = props.height,
    className = props.className,
    hide = props.hide,
    ticks = props.ticks,
    axisType = props.axisType,
    axisId = props.axisId,
    rest = _objectWithoutProperties(props, _excluded);
  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    fontSize = _useState2[0],
    setFontSize = _useState2[1];
  var _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    letterSpacing = _useState4[0],
    setLetterSpacing = _useState4[1];
  var tickRefs = useRef(null);
  useImperativeHandle(ref, () => ({
    getCalculatedWidth: () => {
      var _props$labelRef;
      return getCalculatedYAxisWidth({
        ticks: tickRefs.current,
        label: (_props$labelRef = props.labelRef) === null || _props$labelRef === void 0 ? void 0 : _props$labelRef.current,
        labelGapWithTick: 5,
        tickSize: props.tickSize,
        tickMargin: props.tickMargin
      });
    },
    getCalculatedHeight: () => {
      var _props$labelRef2;
      return getCalculatedXAxisHeight({
        ticks: tickRefs.current,
        label: (_props$labelRef2 = props.labelRef) === null || _props$labelRef2 === void 0 ? void 0 : _props$labelRef2.current,
        labelGapWithTick: 5,
        tickSize: props.tickSize,
        tickMargin: props.tickMargin
      });
    }
  }));
  var layerRef = useCallback(el => {
    if (el) {
      var tickNodes = el.getElementsByClassName('recharts-cartesian-axis-tick-value');
      tickRefs.current = tickNodes;
      var tick = tickNodes[0];
      if (tick) {
        var computedStyle = window.getComputedStyle(tick);
        var calculatedFontSize = computedStyle.fontSize;
        var calculatedLetterSpacing = computedStyle.letterSpacing;
        if (calculatedFontSize !== fontSize || calculatedLetterSpacing !== letterSpacing) {
          setFontSize(calculatedFontSize);
          setLetterSpacing(calculatedLetterSpacing);
        }
      }
    }
  }, [fontSize, letterSpacing]);
  if (hide) {
    return null;
  }

  /*
   * This is different condition from what validateWidthHeight is doing;
   * the CartesianAxis does allow width or height to be undefined.
   */
  if (width != null && width <= 0 || height != null && height <= 0) {
    return null;
  }
  return /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(Layer, {
    className: clsx('recharts-cartesian-axis', className)
  }, /*#__PURE__*/React.createElement(AxisLine, {
    x: props.x,
    y: props.y,
    width: width,
    height: height,
    orientation: props.orientation,
    mirror: props.mirror,
    axisLine: axisLine,
    otherSvgProps: svgPropertiesNoEvents(props)
  }), /*#__PURE__*/React.createElement(Ticks, {
    ref: layerRef,
    axisType: axisType,
    events: rest,
    fontSize: fontSize,
    getTicksConfig: props,
    height: props.height,
    letterSpacing: letterSpacing,
    mirror: props.mirror,
    orientation: props.orientation,
    padding: props.padding,
    stroke: props.stroke,
    tick: props.tick,
    tickFormatter: props.tickFormatter,
    tickLine: props.tickLine,
    tickMargin: props.tickMargin,
    tickSize: props.tickSize,
    tickTextProps: props.tickTextProps,
    ticks: ticks,
    unit: props.unit,
    width: props.width,
    x: props.x,
    y: props.y,
    axisId: axisId
  }), /*#__PURE__*/React.createElement(CartesianLabelContextProvider, {
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    lowerWidth: props.width,
    upperWidth: props.width
  }, /*#__PURE__*/React.createElement(CartesianLabelFromLabelProp, {
    label: props.label,
    labelRef: props.labelRef
  }), props.children)));
});

/**
 * @deprecated
 *
 * This component is not meant to be used directly in app code.
 * Use XAxis or YAxis instead.
 *
 * Starting from Recharts v4.0 we will make this component internal only.
 */
export var CartesianAxis = /*#__PURE__*/React.forwardRef((outsideProps, ref) => {
  var props = resolveDefaultProps(outsideProps, defaultCartesianAxisProps);
  return /*#__PURE__*/React.createElement(CartesianAxisComponent, _extends({}, props, {
    ref: ref
  }));
});
CartesianAxis.displayName = 'CartesianAxis';