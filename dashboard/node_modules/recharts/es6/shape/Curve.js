function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @fileOverview Curve
 */
import * as React from 'react';
import { area as shapeArea, curveBasis, curveBasisClosed, curveBasisOpen, curveBumpX, curveBumpY, curveLinear, curveLinearClosed, curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore, line as shapeLine } from 'victory-vendor/d3-shape';
import { clsx } from 'clsx';
import { adaptEventHandlers } from '../util/types';
import { isNumber, upperFirst } from '../util/DataUtils';
import { isWellBehavedNumber } from '../util/isWellBehavedNumber';
import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents';
import { useChartLayout } from '../context/chartLayoutContext';
var CURVE_FACTORIES = {
  curveBasisClosed,
  curveBasisOpen,
  curveBasis,
  curveBumpX,
  curveBumpY,
  curveLinearClosed,
  curveLinear,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore
};

/**
 * @inline
 */

/**
 * @inline
 */

var defined = p => isWellBehavedNumber(p.x) && isWellBehavedNumber(p.y);
var areaDefined = d => d.base != null && defined(d.base) && defined(d);
var getX = p => p.x;
var getY = p => p.y;
var getCurveFactory = (type, layout) => {
  if (typeof type === 'function') {
    return type;
  }
  var name = "curve".concat(upperFirst(type));
  if ((name === 'curveMonotone' || name === 'curveBump') && layout) {
    var factory = CURVE_FACTORIES["".concat(name).concat(layout === 'vertical' ? 'Y' : 'X')];
    if (factory) {
      return factory;
    }
  }
  return CURVE_FACTORIES[name] || curveLinear;
};

// Mouse event handlers receive the full Props, including the event handlers themselves.

export var defaultCurveProps = {
  connectNulls: false,
  type: 'linear'
};

/**
 * Calculate the path of curve. Returns null if points is an empty array.
 * @return path or null
 */
export var getPath = _ref => {
  var _ref$type = _ref.type,
    type = _ref$type === void 0 ? defaultCurveProps.type : _ref$type,
    _ref$points = _ref.points,
    points = _ref$points === void 0 ? [] : _ref$points,
    baseLine = _ref.baseLine,
    layout = _ref.layout,
    _ref$connectNulls = _ref.connectNulls,
    connectNulls = _ref$connectNulls === void 0 ? defaultCurveProps.connectNulls : _ref$connectNulls;
  var curveFactory = getCurveFactory(type, layout);
  var formatPoints = connectNulls ? points.filter(defined) : points;

  // When dealing with an area chart (where `baseLine` is an array),
  // we need to pair points with their corresponding `baseLine` points first.
  // This is to ensure that we filter points and their baseline counterparts together,
  // preventing errors from mismatched array lengths and ensuring `defined` checks both.
  if (Array.isArray(baseLine)) {
    var _lineFunction;
    var areaPoints = points.map((entry, index) => _objectSpread(_objectSpread({}, entry), {}, {
      base: baseLine[index]
    }));
    if (layout === 'vertical') {
      _lineFunction = shapeArea().y(getY).x1(getX).x0(d => d.base.x);
    } else {
      _lineFunction = shapeArea().x(getX).y1(getY).y0(d => d.base.y);
    }
    /*
     * What happens here is that the `.defined()` call will make it so that this function can accept
     * nullable points, and internally it will filter them out and skip when generating the path.
     * So on the input it accepts NullableCoordinate, but it never calls getX/getY on null points because of the defined() filter.
     *
     * The d3 type definition has only one generic so it doesn't allow to describe this properly.
     * However. d3 types are mutable, but we can pretend that they are not, and we can pretend
     * that calling defined() returns a new function with a different generic type.
     */
    // @ts-expect-error the defined call changes the generic type internally but d3 types don't reflect that
    var _nullableLineFunction = _lineFunction.defined(areaDefined).curve(curveFactory);
    var finalPoints = connectNulls ? areaPoints.filter(areaDefined) : areaPoints;
    return _nullableLineFunction(finalPoints);
  }
  var lineFunction;
  if (layout === 'vertical' && isNumber(baseLine)) {
    lineFunction = shapeArea().y(getY).x1(getX).x0(baseLine);
  } else if (isNumber(baseLine)) {
    lineFunction = shapeArea().x(getX).y1(getY).y0(baseLine);
  } else {
    lineFunction = shapeLine().x(getX).y(getY);
  }

  // @ts-expect-error the defined call changes the generic type internally but d3 types don't reflect that
  var nullableLineFunction = lineFunction.defined(defined).curve(curveFactory);
  return nullableLineFunction(formatPoints);
};
export var Curve = props => {
  var className = props.className,
    points = props.points,
    path = props.path,
    pathRef = props.pathRef;
  var layout = useChartLayout();
  if ((!points || !points.length) && !path) {
    return null;
  }
  var getPathInput = {
    type: props.type,
    points: props.points,
    baseLine: props.baseLine,
    layout: props.layout || layout,
    connectNulls: props.connectNulls
  };
  var realPath = points && points.length ? getPath(getPathInput) : path;
  return /*#__PURE__*/React.createElement("path", _extends({}, svgPropertiesNoEvents(props), adaptEventHandlers(props), {
    className: clsx('recharts-curve', className),
    d: realPath === null ? undefined : realPath,
    ref: pathRef
  }));
};