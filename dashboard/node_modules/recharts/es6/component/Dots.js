var _excluded = ["points"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { cloneElement, isValidElement } from 'react';
import { clsx } from 'clsx';
import { Dot } from '../shape/Dot';
import { Layer } from '../container/Layer';
import { isClipDot } from '../util/ReactUtils';
import { svgPropertiesAndEventsFromUnknown } from '../util/svgPropertiesAndEvents';
import { ZIndexLayer } from '../zIndex/ZIndexLayer';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes';
function DotItem(_ref) {
  var option = _ref.option,
    dotProps = _ref.dotProps,
    className = _ref.className;
  if (/*#__PURE__*/isValidElement(option)) {
    // @ts-expect-error we can't type check element cloning properly
    return /*#__PURE__*/cloneElement(option, dotProps);
  }
  if (typeof option === 'function') {
    return option(dotProps);
  }
  var finalClassName = clsx(className, typeof option !== 'boolean' ? option.className : '');
  var _ref2 = dotProps !== null && dotProps !== void 0 ? dotProps : {},
    points = _ref2.points,
    props = _objectWithoutProperties(_ref2, _excluded);
  return /*#__PURE__*/React.createElement(Dot, _extends({}, props, {
    className: finalClassName
  }));
}
function shouldRenderDots(points, dot) {
  if (points == null) {
    return false;
  }
  if (dot) {
    return true;
  }
  return points.length === 1;
}
export function Dots(_ref3) {
  var points = _ref3.points,
    dot = _ref3.dot,
    className = _ref3.className,
    dotClassName = _ref3.dotClassName,
    dataKey = _ref3.dataKey,
    baseProps = _ref3.baseProps,
    needClip = _ref3.needClip,
    clipPathId = _ref3.clipPathId,
    _ref3$zIndex = _ref3.zIndex,
    zIndex = _ref3$zIndex === void 0 ? DefaultZIndexes.scatter : _ref3$zIndex;
  if (!shouldRenderDots(points, dot)) {
    return null;
  }
  var clipDot = isClipDot(dot);
  var customDotProps = svgPropertiesAndEventsFromUnknown(dot);
  var dots = points.map((entry, i) => {
    var _entry$x, _entry$y;
    var dotProps = _objectSpread(_objectSpread(_objectSpread({
      r: 3
    }, baseProps), customDotProps), {}, {
      index: i,
      cx: (_entry$x = entry.x) !== null && _entry$x !== void 0 ? _entry$x : undefined,
      cy: (_entry$y = entry.y) !== null && _entry$y !== void 0 ? _entry$y : undefined,
      dataKey,
      value: entry.value,
      payload: entry.payload,
      points
    });
    return /*#__PURE__*/React.createElement(DotItem, {
      key: "dot-".concat(i),
      option: dot,
      dotProps: dotProps,
      className: dotClassName
    });
  });
  var layerProps = {};
  if (needClip && clipPathId != null) {
    layerProps.clipPath = "url(#clipPath-".concat(clipDot ? '' : 'dots-').concat(clipPathId, ")");
  }
  return /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: zIndex
  }, /*#__PURE__*/React.createElement(Layer, _extends({
    className: className
  }, layerProps), dots));
}