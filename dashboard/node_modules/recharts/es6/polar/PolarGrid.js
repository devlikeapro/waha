var _excluded = ["gridType", "radialLines", "angleAxisId", "radiusAxisId", "cx", "cy", "innerRadius", "outerRadius", "polarAngles", "polarRadius", "zIndex"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { clsx } from 'clsx';
import * as React from 'react';
import { polarToCartesian } from '../util/PolarUtils';
import { useAppSelector } from '../state/hooks';
import { selectPolarGridAngles, selectPolarGridRadii } from '../state/selectors/polarGridSelectors';
import { selectPolarViewBox } from '../state/selectors/polarAxisSelectors';
import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents';
import { ZIndexLayer } from '../zIndex/ZIndexLayer';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
var getPolygonPath = (radius, cx, cy, polarAngles) => {
  var path = '';
  polarAngles.forEach((angle, i) => {
    var point = polarToCartesian(cx, cy, radius, angle);
    if (i) {
      path += "L ".concat(point.x, ",").concat(point.y);
    } else {
      path += "M ".concat(point.x, ",").concat(point.y);
    }
  });
  path += 'Z';
  return path;
};

// Draw axis of radial line
var PolarAngles = props => {
  var cx = props.cx,
    cy = props.cy,
    innerRadius = props.innerRadius,
    outerRadius = props.outerRadius,
    polarAngles = props.polarAngles,
    radialLines = props.radialLines;
  if (!polarAngles || !polarAngles.length || !radialLines) {
    return null;
  }
  var polarAnglesProps = _objectSpread({}, svgPropertiesNoEvents(props));
  return /*#__PURE__*/React.createElement("g", {
    className: "recharts-polar-grid-angle"
  }, polarAngles.map(entry => {
    var start = polarToCartesian(cx, cy, innerRadius, entry);
    var end = polarToCartesian(cx, cy, outerRadius, entry);
    return /*#__PURE__*/React.createElement("line", _extends({
      key: "line-".concat(entry)
    }, polarAnglesProps, {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    }));
  }));
};

// Draw concentric circles
var ConcentricCircle = props => {
  var cx = props.cx,
    cy = props.cy,
    radius = props.radius;
  var concentricCircleProps = _objectSpread({}, svgPropertiesNoEvents(props));
  return (
    /*#__PURE__*/
    // @ts-expect-error wrong SVG element type
    React.createElement("circle", _extends({}, concentricCircleProps, {
      className: clsx('recharts-polar-grid-concentric-circle', props.className),
      cx: cx,
      cy: cy,
      r: radius
    }))
  );
};

// Draw concentric polygons
var ConcentricPolygon = props => {
  var radius = props.radius;
  var concentricPolygonProps = _objectSpread({}, svgPropertiesNoEvents(props));
  return /*#__PURE__*/React.createElement("path", _extends({}, concentricPolygonProps, {
    className: clsx('recharts-polar-grid-concentric-polygon', props.className),
    d: getPolygonPath(radius, props.cx, props.cy, props.polarAngles)
  }));
};

// Draw concentric axis
var ConcentricGridPath = props => {
  var polarRadius = props.polarRadius,
    gridType = props.gridType;
  if (!polarRadius || !polarRadius.length) {
    return null;
  }
  var maxPolarRadius = Math.max(...polarRadius);
  var renderBackground = props.fill && props.fill !== 'none';
  return /*#__PURE__*/React.createElement("g", {
    className: "recharts-polar-grid-concentric"
  }, renderBackground && gridType === 'circle' && /*#__PURE__*/React.createElement(ConcentricCircle, _extends({}, props, {
    radius: maxPolarRadius
  })), renderBackground && gridType !== 'circle' && /*#__PURE__*/React.createElement(ConcentricPolygon, _extends({}, props, {
    radius: maxPolarRadius
  })), polarRadius.map((entry, i) => {
    var key = i;
    if (gridType === 'circle') {
      return /*#__PURE__*/React.createElement(ConcentricCircle, _extends({
        key: key
      }, props, {
        fill: "none",
        radius: entry
      }));
    }
    return /*#__PURE__*/React.createElement(ConcentricPolygon, _extends({
      key: key
    }, props, {
      fill: "none",
      radius: entry
    }));
  }));
};
export var defaultPolarGridProps = {
  angleAxisId: 0,
  radiusAxisId: 0,
  gridType: 'polygon',
  radialLines: true,
  zIndex: DefaultZIndexes.grid,
  stroke: '#ccc',
  strokeWidth: 1,
  fill: 'none'
};

/**
 * @consumes PolarViewBoxContext
 */
export var PolarGrid = outsideProps => {
  var _ref, _polarViewBox$cx, _ref2, _polarViewBox$cy, _ref3, _polarViewBox$innerRa, _ref4, _polarViewBox$outerRa;
  var _resolveDefaultProps = resolveDefaultProps(outsideProps, defaultPolarGridProps),
    gridType = _resolveDefaultProps.gridType,
    radialLines = _resolveDefaultProps.radialLines,
    angleAxisId = _resolveDefaultProps.angleAxisId,
    radiusAxisId = _resolveDefaultProps.radiusAxisId,
    cxFromOutside = _resolveDefaultProps.cx,
    cyFromOutside = _resolveDefaultProps.cy,
    innerRadiusFromOutside = _resolveDefaultProps.innerRadius,
    outerRadiusFromOutside = _resolveDefaultProps.outerRadius,
    polarAnglesInput = _resolveDefaultProps.polarAngles,
    polarRadiusInput = _resolveDefaultProps.polarRadius,
    zIndex = _resolveDefaultProps.zIndex,
    inputs = _objectWithoutProperties(_resolveDefaultProps, _excluded);
  var polarViewBox = useAppSelector(selectPolarViewBox);
  var polarAnglesFromRedux = useAppSelector(state => selectPolarGridAngles(state, angleAxisId));
  var polarRadiiFromRedux = useAppSelector(state => selectPolarGridRadii(state, radiusAxisId));
  var polarAngles = Array.isArray(polarAnglesInput) ? polarAnglesInput : polarAnglesFromRedux;
  var polarRadius = Array.isArray(polarRadiusInput) ? polarRadiusInput : polarRadiiFromRedux;
  if (polarAngles == null || polarRadius == null) {
    return null;
  }
  var props = _objectSpread({
    cx: (_ref = (_polarViewBox$cx = polarViewBox === null || polarViewBox === void 0 ? void 0 : polarViewBox.cx) !== null && _polarViewBox$cx !== void 0 ? _polarViewBox$cx : cxFromOutside) !== null && _ref !== void 0 ? _ref : 0,
    cy: (_ref2 = (_polarViewBox$cy = polarViewBox === null || polarViewBox === void 0 ? void 0 : polarViewBox.cy) !== null && _polarViewBox$cy !== void 0 ? _polarViewBox$cy : cyFromOutside) !== null && _ref2 !== void 0 ? _ref2 : 0,
    innerRadius: (_ref3 = (_polarViewBox$innerRa = polarViewBox === null || polarViewBox === void 0 ? void 0 : polarViewBox.innerRadius) !== null && _polarViewBox$innerRa !== void 0 ? _polarViewBox$innerRa : innerRadiusFromOutside) !== null && _ref3 !== void 0 ? _ref3 : 0,
    outerRadius: (_ref4 = (_polarViewBox$outerRa = polarViewBox === null || polarViewBox === void 0 ? void 0 : polarViewBox.outerRadius) !== null && _polarViewBox$outerRa !== void 0 ? _polarViewBox$outerRa : outerRadiusFromOutside) !== null && _ref4 !== void 0 ? _ref4 : 0,
    polarAngles,
    polarRadius,
    zIndex
  }, inputs);
  var outerRadius = props.outerRadius;
  if (outerRadius <= 0) {
    return null;
  }
  return /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement("g", {
    className: "recharts-polar-grid"
  }, /*#__PURE__*/React.createElement(ConcentricGridPath, _extends({
    gridType: gridType,
    radialLines: radialLines
  }, props, {
    polarAngles: polarAngles,
    polarRadius: polarRadius
  })), /*#__PURE__*/React.createElement(PolarAngles, _extends({
    gridType: gridType,
    radialLines: radialLines
  }, props, {
    polarAngles: polarAngles,
    polarRadius: polarRadius
  }))));
};
PolarGrid.displayName = 'PolarGrid';