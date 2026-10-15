function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { cloneElement, isValidElement } from 'react';
import { adaptEventHandlers } from '../util/types';
import { Dot } from '../shape/Dot';
import { Layer } from '../container/Layer';
import { useAppSelector } from '../state/hooks';
import { selectActiveTooltipIndex } from '../state/selectors/tooltipSelectors';
import { useActiveTooltipDataPoints } from '../hooks';
import { isNullish } from '../util/DataUtils';
import { svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents';
import { ZIndexLayer } from '../zIndex/ZIndexLayer';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes';
var ActivePoint = _ref => {
  var point = _ref.point,
    childIndex = _ref.childIndex,
    mainColor = _ref.mainColor,
    activeDot = _ref.activeDot,
    dataKey = _ref.dataKey,
    clipPath = _ref.clipPath;
  if (activeDot === false || point.x == null || point.y == null) {
    return null;
  }
  var dotPropsTyped = {
    index: childIndex,
    dataKey,
    cx: point.x,
    cy: point.y,
    r: 4,
    fill: mainColor !== null && mainColor !== void 0 ? mainColor : 'none',
    strokeWidth: 2,
    stroke: '#fff',
    payload: point.payload,
    value: point.value
  };

  // @ts-expect-error svgPropertiesNoEventsFromUnknown(activeDot) is contributing unknown props
  var dotProps = _objectSpread(_objectSpread(_objectSpread({}, dotPropsTyped), svgPropertiesNoEventsFromUnknown(activeDot)), adaptEventHandlers(activeDot));
  var dot;
  if (/*#__PURE__*/isValidElement(activeDot)) {
    // @ts-expect-error we're improperly typing events
    dot = /*#__PURE__*/cloneElement(activeDot, dotProps);
  } else if (typeof activeDot === 'function') {
    dot = activeDot(dotProps);
  } else {
    dot = /*#__PURE__*/React.createElement(Dot, dotProps);
  }
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-active-dot",
    clipPath: clipPath
  }, dot);
};
export function ActivePoints(_ref2) {
  var points = _ref2.points,
    mainColor = _ref2.mainColor,
    activeDot = _ref2.activeDot,
    itemDataKey = _ref2.itemDataKey,
    clipPath = _ref2.clipPath,
    _ref2$zIndex = _ref2.zIndex,
    zIndex = _ref2$zIndex === void 0 ? DefaultZIndexes.activeDot : _ref2$zIndex;
  var activeTooltipIndex = useAppSelector(selectActiveTooltipIndex);
  var activeDataPoints = useActiveTooltipDataPoints();
  if (points == null || activeDataPoints == null) {
    return null;
  }
  var activePoint = points.find(p => activeDataPoints.includes(p.payload));
  if (isNullish(activePoint)) {
    return null;
  }
  return /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: zIndex
  }, /*#__PURE__*/React.createElement(ActivePoint, {
    point: activePoint,
    childIndex: Number(activeTooltipIndex),
    mainColor: mainColor,
    dataKey: itemDataKey,
    activeDot: activeDot,
    clipPath: clipPath
  }));
}