"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Polygon = void 0;
var React = _interopRequireWildcard(require("react"));
var _clsx = require("clsx");
var _svgPropertiesAndEvents = require("../util/svgPropertiesAndEvents");
var _round = require("../util/round");
var _excluded = ["points", "className", "baseLinePoints", "connectNulls"];
var _templateObject;
/**
 * @fileOverview Polygon
 */
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var isValidatePoint = point => {
  return point != null && point.x === +point.x && point.y === +point.y;
};
var getParsedPoints = function getParsedPoints() {
  var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var segmentPoints = [[]];
  points.forEach(entry => {
    var lastLink = segmentPoints[segmentPoints.length - 1];
    if (isValidatePoint(entry)) {
      if (lastLink) {
        lastLink.push(entry);
      }
    } else if (lastLink && lastLink.length > 0) {
      // add another path
      segmentPoints.push([]);
    }
  });
  var firstPoint = points[0];
  var lastLink = segmentPoints[segmentPoints.length - 1];
  if (isValidatePoint(firstPoint) && lastLink) {
    lastLink.push(firstPoint);
  }
  var finalLink = segmentPoints[segmentPoints.length - 1];
  if (finalLink && finalLink.length <= 0) {
    segmentPoints = segmentPoints.slice(0, -1);
  }
  return segmentPoints;
};
var getSinglePolygonPath = (points, connectNulls) => {
  var segmentPoints = getParsedPoints(points);
  if (connectNulls) {
    segmentPoints = [segmentPoints.reduce((res, segPoints) => {
      return [...res, ...segPoints];
    }, [])];
  }
  var polygonPath = segmentPoints.map(segPoints => {
    return segPoints.reduce((path, point, index) => {
      return (0, _round.roundTemplateLiteral)(_templateObject || (_templateObject = _taggedTemplateLiteral(["", "", "", ",", ""])), path, index === 0 ? 'M' : 'L', point.x, point.y);
    }, '');
  }).join('');
  return segmentPoints.length === 1 ? "".concat(polygonPath, "Z") : polygonPath;
};
var getRanglePath = (points, baseLinePoints, connectNulls) => {
  var outerPath = getSinglePolygonPath(points, connectNulls);
  return "".concat(outerPath.slice(-1) === 'Z' ? outerPath.slice(0, -1) : outerPath, "L").concat(getSinglePolygonPath(Array.from(baseLinePoints).reverse(), connectNulls).slice(1));
};
var Polygon = props => {
  var points = props.points,
    className = props.className,
    baseLinePoints = props.baseLinePoints,
    connectNulls = props.connectNulls,
    others = _objectWithoutProperties(props, _excluded);
  if (!points || !points.length) {
    return null;
  }
  var layerClass = (0, _clsx.clsx)('recharts-polygon', className);
  if (baseLinePoints && baseLinePoints.length) {
    var hasStroke = others.stroke && others.stroke !== 'none';
    var rangePath = getRanglePath(points, baseLinePoints, connectNulls);
    return /*#__PURE__*/React.createElement("g", {
      className: layerClass
    }, /*#__PURE__*/React.createElement("path", _extends({}, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(others), {
      fill: rangePath.slice(-1) === 'Z' ? others.fill : 'none',
      stroke: "none",
      d: rangePath
    })), hasStroke ? /*#__PURE__*/React.createElement("path", _extends({}, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(others), {
      fill: "none",
      d: getSinglePolygonPath(points, connectNulls)
    })) : null, hasStroke ? /*#__PURE__*/React.createElement("path", _extends({}, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(others), {
      fill: "none",
      d: getSinglePolygonPath(baseLinePoints, connectNulls)
    })) : null);
  }
  var singlePath = getSinglePolygonPath(points, connectNulls);
  return /*#__PURE__*/React.createElement("path", _extends({}, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(others), {
    fill: singlePath.slice(-1) === 'Z' ? others.fill : 'none',
    className: layerClass,
    d: singlePath
  }));
};
exports.Polygon = Polygon;