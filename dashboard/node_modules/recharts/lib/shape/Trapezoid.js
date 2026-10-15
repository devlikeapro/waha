"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTrapezoidProps = exports.Trapezoid = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _JavascriptAnimate = require("../animation/JavascriptAnimate");
var _useAnimationId = require("../util/useAnimationId");
var _DataUtils = require("../util/DataUtils");
var _util = require("../animation/util");
var _svgPropertiesAndEvents = require("../util/svgPropertiesAndEvents");
var _round = require("../util/round");
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
/**
 * @fileOverview Rectangle
 */
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
var getTrapezoidPath = (x, y, upperWidth, lowerWidth, height) => {
  var widthGap = upperWidth - lowerWidth;
  var path;
  path = (0, _round.roundTemplateLiteral)(_templateObject || (_templateObject = _taggedTemplateLiteral(["M ", ",", ""])), x, y);
  path += (0, _round.roundTemplateLiteral)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["L ", ",", ""])), x + upperWidth, y);
  path += (0, _round.roundTemplateLiteral)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["L ", ",", ""])), x + upperWidth - widthGap / 2, y + height);
  path += (0, _round.roundTemplateLiteral)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["L ", ",", ""])), x + upperWidth - widthGap / 2 - lowerWidth, y + height);
  path += (0, _round.roundTemplateLiteral)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["L ", ",", " Z"])), x, y);
  return path;
};
var defaultTrapezoidProps = exports.defaultTrapezoidProps = {
  x: 0,
  y: 0,
  upperWidth: 0,
  lowerWidth: 0,
  height: 0,
  isUpdateAnimationActive: false,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease'
};
var Trapezoid = outsideProps => {
  var trapezoidProps = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, defaultTrapezoidProps);
  var x = trapezoidProps.x,
    y = trapezoidProps.y,
    upperWidth = trapezoidProps.upperWidth,
    lowerWidth = trapezoidProps.lowerWidth,
    height = trapezoidProps.height,
    className = trapezoidProps.className;
  var animationEasing = trapezoidProps.animationEasing,
    animationDuration = trapezoidProps.animationDuration,
    animationBegin = trapezoidProps.animationBegin,
    isUpdateAnimationActive = trapezoidProps.isUpdateAnimationActive;
  var pathRef = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(-1),
    _useState2 = _slicedToArray(_useState, 2),
    totalLength = _useState2[0],
    setTotalLength = _useState2[1];
  var prevUpperWidthRef = (0, _react.useRef)(upperWidth);
  var prevLowerWidthRef = (0, _react.useRef)(lowerWidth);
  var prevHeightRef = (0, _react.useRef)(height);
  var prevXRef = (0, _react.useRef)(x);
  var prevYRef = (0, _react.useRef)(y);
  var animationId = (0, _useAnimationId.useAnimationId)(outsideProps, 'trapezoid-');
  (0, _react.useEffect)(() => {
    if (pathRef.current && pathRef.current.getTotalLength) {
      try {
        var pathTotalLength = pathRef.current.getTotalLength();
        if (pathTotalLength) {
          setTotalLength(pathTotalLength);
        }
      } catch (_unused) {
        // calculate total length error
      }
    }
  }, []);
  if (x !== +x || y !== +y || upperWidth !== +upperWidth || lowerWidth !== +lowerWidth || height !== +height || upperWidth === 0 && lowerWidth === 0 || height === 0) {
    return null;
  }
  var layerClass = (0, _clsx.clsx)('recharts-trapezoid', className);
  if (!isUpdateAnimationActive) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({}, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(trapezoidProps), {
      className: layerClass,
      d: getTrapezoidPath(x, y, upperWidth, lowerWidth, height)
    })));
  }
  var prevUpperWidth = prevUpperWidthRef.current;
  var prevLowerWidth = prevLowerWidthRef.current;
  var prevHeight = prevHeightRef.current;
  var prevX = prevXRef.current;
  var prevY = prevYRef.current;
  var from = "0px ".concat(totalLength === -1 ? 1 : totalLength, "px");
  var to = "".concat(totalLength, "px ").concat(totalLength, "px");
  var transition = (0, _util.getTransitionVal)(['strokeDasharray'], animationDuration, typeof animationEasing === 'string' ? animationEasing : 'ease');
  return /*#__PURE__*/React.createElement(_JavascriptAnimate.JavascriptAnimate, {
    animationId: animationId,
    key: animationId,
    canBegin: totalLength > 0,
    duration: animationDuration,
    easing: animationEasing,
    isActive: isUpdateAnimationActive,
    begin: animationBegin
  }, animationElapsedTime => {
    var currUpperWidth = (0, _DataUtils.interpolate)(prevUpperWidth, upperWidth, animationElapsedTime);
    var currLowerWidth = (0, _DataUtils.interpolate)(prevLowerWidth, lowerWidth, animationElapsedTime);
    var currHeight = (0, _DataUtils.interpolate)(prevHeight, height, animationElapsedTime);
    var currX = (0, _DataUtils.interpolate)(prevX, x, animationElapsedTime);
    var currY = (0, _DataUtils.interpolate)(prevY, y, animationElapsedTime);
    if (pathRef.current) {
      prevUpperWidthRef.current = currUpperWidth;
      prevLowerWidthRef.current = currLowerWidth;
      prevHeightRef.current = currHeight;
      prevXRef.current = currX;
      prevYRef.current = currY;
    }
    var animationStyle = animationElapsedTime > 0 ? {
      transition,
      strokeDasharray: to
    } : {
      strokeDasharray: from
    };
    return /*#__PURE__*/React.createElement("path", _extends({}, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(trapezoidProps), {
      className: layerClass,
      d: getTrapezoidPath(currX, currY, currUpperWidth, currLowerWidth, currHeight),
      ref: pathRef,
      style: _objectSpread(_objectSpread({}, animationStyle), trapezoidProps.style)
    }));
  });
};
exports.Trapezoid = Trapezoid;