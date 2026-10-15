var _excluded = ["direction", "width", "dataKey", "isAnimationActive", "animationBegin", "animationDuration", "animationEasing"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * @fileOverview Render a group of error bar
 */
import * as React from 'react';
import { Layer } from '../container/Layer';
import { ReportErrorBarSettings, useErrorBarContext } from '../context/ErrorBarContext';
import { useXAxis, useYAxis } from '../hooks';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents';
import { useChartLayout } from '../context/chartLayoutContext';
import { CSSTransitionAnimate, extractCssEasing } from '../animation/CSSTransitionAnimate';
import { ZIndexLayer } from '../zIndex/ZIndexLayer';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes';

/**
 * So usually the direction is decided by the chart layout.
 * Horizontal layout means error bars are vertical means direction=y
 * Vertical layout means error bars are horizontal means direction=x
 *
 * Except! In Scatter chart, error bars can go both ways.
 *
 * So this property is only ever used in Scatter chart, and ignored elsewhere.
 */

/**
 * External ErrorBar props, visible for users of the library
 */

/**
 * Props after defaults, and required props have been applied.
 */

function ErrorBarImpl(props) {
  var direction = props.direction,
    width = props.width,
    dataKey = props.dataKey,
    isAnimationActive = props.isAnimationActive,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    others = _objectWithoutProperties(props, _excluded);
  var svgProps = svgPropertiesNoEvents(others);
  var _useErrorBarContext = useErrorBarContext(),
    data = _useErrorBarContext.data,
    dataPointFormatter = _useErrorBarContext.dataPointFormatter,
    xAxisId = _useErrorBarContext.xAxisId,
    yAxisId = _useErrorBarContext.yAxisId,
    offset = _useErrorBarContext.errorBarOffset;
  var xAxis = useXAxis(xAxisId);
  var yAxis = useYAxis(yAxisId);
  if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.scale) == null || (yAxis === null || yAxis === void 0 ? void 0 : yAxis.scale) == null || data == null) {
    return null;
  }

  // ErrorBar requires type number XAxis, why?
  if (direction === 'x' && xAxis.type !== 'number') {
    return null;
  }
  var errorBars = data.map((entry, dataIndex) => {
    var _dataPointFormatter = dataPointFormatter(entry, dataKey, direction),
      x = _dataPointFormatter.x,
      y = _dataPointFormatter.y,
      value = _dataPointFormatter.value,
      errorVal = _dataPointFormatter.errorVal;
    if (!errorVal || x == null || y == null) {
      return null;
    }
    var lineCoordinates = [];
    var lowBound, highBound;
    if (Array.isArray(errorVal)) {
      var _errorVal = _slicedToArray(errorVal, 2),
        low = _errorVal[0],
        high = _errorVal[1];
      if (low == null || high == null) {
        return null;
      }
      lowBound = low;
      highBound = high;
    } else {
      lowBound = highBound = errorVal;
    }
    if (direction === 'x') {
      // error bar for horizontal charts, the y is fixed, x is a range value
      var scale = xAxis.scale;
      var yMid = y + offset;
      var yMin = yMid + width;
      var yMax = yMid - width;
      var xMin = scale.map(value - lowBound);
      var xMax = scale.map(value + highBound);
      if (xMin != null && xMax != null) {
        // the right line of |--|
        lineCoordinates.push({
          x1: xMax,
          y1: yMin,
          x2: xMax,
          y2: yMax
        });
        // the middle line of |--|
        lineCoordinates.push({
          x1: xMin,
          y1: yMid,
          x2: xMax,
          y2: yMid
        });
        // the left line of |--|
        lineCoordinates.push({
          x1: xMin,
          y1: yMin,
          x2: xMin,
          y2: yMax
        });
      }
    } else if (direction === 'y') {
      // error bar for horizontal charts, the x is fixed, y is a range value
      var _scale = yAxis.scale;
      var xMid = x + offset;
      var _xMin = xMid - width;
      var _xMax = xMid + width;
      var _yMin = _scale.map(value - lowBound);
      var _yMax = _scale.map(value + highBound);
      if (_yMin != null && _yMax != null) {
        // the top line
        lineCoordinates.push({
          x1: _xMin,
          y1: _yMax,
          x2: _xMax,
          y2: _yMax
        });
        // the middle line
        lineCoordinates.push({
          x1: xMid,
          y1: _yMin,
          x2: xMid,
          y2: _yMax
        });
        // the bottom line
        lineCoordinates.push({
          x1: _xMin,
          y1: _yMin,
          x2: _xMax,
          y2: _yMin
        });
      }
    }
    var scaleDirection = direction === 'x' ? 'scaleX' : 'scaleY';
    var transformOrigin = "".concat(x + offset, "px ").concat(y + offset, "px");
    return /*#__PURE__*/React.createElement(Layer, _extends({
      className: "recharts-errorBar",
      key: "bar-".concat(x, "-").concat(y, "-").concat(value, "-").concat(dataIndex)
    }, svgProps), lineCoordinates.map((c, lineIndex) => {
      var lineStyle = isAnimationActive ? {
        transformOrigin
      } : undefined;
      return /*#__PURE__*/React.createElement(CSSTransitionAnimate, {
        animationId: "error-bar-".concat(direction, "_").concat(c.x1, "-").concat(c.x2, "-").concat(c.y1, "-").concat(c.y2),
        from: "".concat(scaleDirection, "(0)"),
        to: "".concat(scaleDirection, "(1)"),
        attributeName: "transform",
        begin: animationBegin,
        easing: extractCssEasing(animationEasing),
        isActive: isAnimationActive,
        duration: animationDuration,
        key: "errorbar-".concat(dataIndex, "-").concat(c.x1, "-").concat(c.y1, "-").concat(c.x2, "-").concat(c.y2, "-").concat(lineIndex)
      }, style => /*#__PURE__*/React.createElement("line", _extends({}, c, {
        style: _objectSpread(_objectSpread({}, lineStyle), style)
      })));
    }));
  });
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-errorBars"
  }, errorBars);
}
function useErrorBarDirection(directionFromProps) {
  var layout = useChartLayout();
  if (directionFromProps != null) {
    return directionFromProps;
  }
  if (layout != null) {
    return layout === 'horizontal' ? 'y' : 'x';
  }
  return 'x';
}
export var errorBarDefaultProps = {
  stroke: 'black',
  strokeWidth: 1.5,
  width: 5,
  offset: 0,
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: 'ease-in-out',
  zIndex: DefaultZIndexes.line
};

/**
 * ErrorBar renders whiskers to represent error margins on a chart.
 *
 * It must be a child of a graphical element.
 *
 * ErrorBar expects data in one of the following forms:
 * - Symmetric error bars: a single error value representing both lower and upper bounds.
 * - Asymmetric error bars: an array of two values representing lower and upper bounds separately. First value is the lower bound, second value is the upper bound.
 *
 * The values provided are relative to the main data value.
 * For example, if the main data value is 10 and the error value is 2,
 * the error bar will extend from 8 to 12 for symmetric error bars.
 *
 * In other words, what ErrorBar will render is:
 * - For symmetric error bars: [value - errorVal, value + errorVal]
 * - For asymmetric error bars: [value - errorVal[0], value + errorVal[1]]
 *
 * In stacked or ranged Bar charts, ErrorBar will use the higher data value
 * as the reference point for calculating the error bar positions.
 *
 * @consumes ErrorBarContext
 */
export function ErrorBar(outsideProps) {
  var realDirection = useErrorBarDirection(outsideProps.direction);
  var props = resolveDefaultProps(outsideProps, errorBarDefaultProps);
  var width = props.width,
    isAnimationActive = props.isAnimationActive,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    zIndex = props.zIndex;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportErrorBarSettings, {
    dataKey: props.dataKey,
    direction: realDirection
  }), /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: zIndex
  }, /*#__PURE__*/React.createElement(ErrorBarImpl, _extends({}, props, {
    direction: realDirection,
    width: width,
    isAnimationActive: isAnimationActive,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing
  }))));
}
ErrorBar.displayName = 'ErrorBar';