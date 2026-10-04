var _excluded = ["id"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { useRef } from 'react';
import last from 'es-toolkit/compat/last';
import { clsx } from 'clsx';
import { interpolate, isNullish, noop } from '../util/DataUtils';
import { polarToCartesian } from '../util/PolarUtils';
import { getTooltipNameProp, getValueByDataKey } from '../util/ChartUtils';
import { Polygon } from '../shape/Polygon';
import { Layer } from '../container/Layer';
import { CartesianLabelListContextProvider, LabelListFromLabelProp } from '../component/LabelList';
import { Dots } from '../component/Dots';
import { ActivePoints } from '../component/ActivePoints';
import { SetTooltipEntrySettings } from '../state/SetTooltipEntrySettings';
import { selectRadarPoints } from '../state/selectors/radarSelectors';
import { useAppSelector } from '../state/hooks';
import { useIsPanorama } from '../context/PanoramaContext';
import { SetPolarLegendPayload } from '../state/SetLegendPayload';
import { RegisterGraphicalItemId } from '../context/RegisterGraphicalItemId';
import { SetPolarGraphicalItem } from '../state/SetGraphicalItem';
import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents';
import { AnimatedItems, useAnimationCallbacks } from '../animation/AnimatedItems';
import { matchAnimationItems, matchByIndex } from '../animation/matchBy';
import { useAnimationStartSnapshot } from '../animation/useAnimationStartSnapshot';
import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { ZIndexLayer } from '../zIndex/ZIndexLayer';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes';
import { usePolarChartLayout } from '../context/chartLayoutContext';
function getLegendItemColor(stroke, fill) {
  return stroke && stroke !== 'none' ? stroke : fill;
}
var computeLegendPayloadFromRadarSectors = props => {
  var dataKey = props.dataKey,
    name = props.name,
    stroke = props.stroke,
    fill = props.fill,
    legendType = props.legendType,
    hide = props.hide;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: getLegendItemColor(stroke, fill),
    value: getTooltipNameProp(name, dataKey),
    payload: props
  }];
};
var SetRadarTooltipEntrySettings = /*#__PURE__*/React.memo(_ref => {
  var dataKey = _ref.dataKey,
    stroke = _ref.stroke,
    strokeWidth = _ref.strokeWidth,
    fill = _ref.fill,
    name = _ref.name,
    hide = _ref.hide,
    tooltipType = _ref.tooltipType,
    id = _ref.id;
  var tooltipEntrySettings = {
    /*
     * I suppose this here _could_ return props.points
     * because while Radar does not support item tooltip mode, it _could_ support it.
     * But when I actually do return the points here, a defaultIndex test starts failing.
     * So, undefined it is.
     */
    dataDefinedOnItem: undefined,
    getPosition: noop,
    settings: {
      stroke,
      strokeWidth,
      fill,
      nameKey: undefined,
      // RadarChart does not have nameKey unfortunately
      dataKey,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: getLegendItemColor(stroke, fill),
      unit: '',
      // why doesn't Radar support unit?
      graphicalItemId: id
    }
  };
  return /*#__PURE__*/React.createElement(SetTooltipEntrySettings, {
    tooltipEntrySettings: tooltipEntrySettings
  });
});
function RadarDotsWrapper(_ref2) {
  var points = _ref2.points,
    props = _ref2.props;
  var dot = props.dot,
    dataKey = props.dataKey;
  var id = props.id,
    propsWithoutId = _objectWithoutProperties(props, _excluded);
  var baseProps = svgPropertiesNoEvents(propsWithoutId);
  return /*#__PURE__*/React.createElement(Dots, {
    points: points,
    dot: dot,
    className: "recharts-radar-dots",
    dotClassName: "recharts-radar-dot",
    dataKey: dataKey,
    baseProps: baseProps
  });
}
export function computeRadarPoints(_ref3) {
  var radiusAxis = _ref3.radiusAxis,
    angleAxis = _ref3.angleAxis,
    displayedData = _ref3.displayedData,
    dataKey = _ref3.dataKey,
    bandSize = _ref3.bandSize;
  var cx = angleAxis.cx,
    cy = angleAxis.cy;
  var isRange = false;
  var points = [];
  var angleBandSize = angleAxis.type !== 'number' ? bandSize !== null && bandSize !== void 0 ? bandSize : 0 : 0;
  displayedData.forEach((entry, i) => {
    var _angleAxis$scale$map, _radiusAxis$scale$map;
    var name = getValueByDataKey(entry, angleAxis.dataKey, i);
    var value = getValueByDataKey(entry, dataKey);
    var angle = ((_angleAxis$scale$map = angleAxis.scale.map(name)) !== null && _angleAxis$scale$map !== void 0 ? _angleAxis$scale$map : 0) + angleBandSize;
    var pointValue = Array.isArray(value) ? last(value) : value;
    var radius = isNullish(pointValue) ? 0 : (_radiusAxis$scale$map = radiusAxis.scale.map(pointValue)) !== null && _radiusAxis$scale$map !== void 0 ? _radiusAxis$scale$map : 0;
    if (Array.isArray(value) && value.length >= 2) {
      isRange = true;
    }
    points.push(_objectSpread(_objectSpread({}, polarToCartesian(cx, cy, radius, angle)), {}, {
      // getValueByDataKey does not validate the output type
      name,
      // getValueByDataKey does not validate the output type
      value,
      cx,
      cy,
      radius,
      angle,
      payload: entry
    }));
  });
  var baseLinePoints = [];
  if (isRange) {
    points.forEach(point => {
      if (Array.isArray(point.value)) {
        var _radiusAxis$scale$map2;
        var baseValue = point.value[0];
        var radius = isNullish(baseValue) ? 0 : (_radiusAxis$scale$map2 = radiusAxis.scale.map(baseValue)) !== null && _radiusAxis$scale$map2 !== void 0 ? _radiusAxis$scale$map2 : 0;
        baseLinePoints.push(_objectSpread(_objectSpread({}, point), {}, {
          radius
        }, polarToCartesian(cx, cy, radius, point.angle)));
      } else {
        baseLinePoints.push(point);
      }
    });
  }
  return {
    points,
    isRange,
    baseLinePoints
  };
}
function RadarLabelListProvider(_ref4) {
  var showLabels = _ref4.showLabels,
    points = _ref4.points,
    children = _ref4.children;
  /*
   * Radar provides a Cartesian label list context. Do we want to also provide a polar label list context?
   * That way, users can choose to use polar positions for the Radar labels.
   */
  // const labelListEntries: ReadonlyArray<PolarLabelListEntry> = points.map(
  //   (point): PolarLabelListEntry => ({
  //     value: point.value,
  //     payload: point.payload,
  //     parentViewBox: undefined,
  //     clockWise: false,
  //     viewBox: {
  //       cx: point.cx,
  //       cy: point.cy,
  //       innerRadius: point.radius,
  //       outerRadius: point.radius,
  //       startAngle: point.angle,
  //       endAngle: point.angle,
  //       clockWise: false,
  //     },
  //   }),
  // );

  var labelListEntries = points.map(point => {
    var _point$value;
    var viewBox = {
      x: point.x,
      y: point.y,
      width: 0,
      lowerWidth: 0,
      upperWidth: 0,
      height: 0
    };
    return _objectSpread(_objectSpread({}, viewBox), {}, {
      value: (_point$value = point.value) !== null && _point$value !== void 0 ? _point$value : '',
      payload: point.payload,
      parentViewBox: undefined,
      viewBox,
      fill: undefined
    });
  });
  return /*#__PURE__*/React.createElement(CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : undefined
  }, children);
}
function StaticPolygon(_ref5) {
  var points = _ref5.points,
    baseLinePoints = _ref5.baseLinePoints,
    props = _ref5.props;
  if (points == null) {
    return null;
  }
  var shape = props.shape,
    isRange = props.isRange,
    connectNulls = props.connectNulls;
  var handleMouseEnter = e => {
    var onMouseEnter = props.onMouseEnter;
    if (onMouseEnter) {
      onMouseEnter(props, e);
    }
  };
  var handleMouseLeave = e => {
    var onMouseLeave = props.onMouseLeave;
    if (onMouseLeave) {
      onMouseLeave(props, e);
    }
  };
  var radar;
  if (/*#__PURE__*/React.isValidElement(shape)) {
    radar = /*#__PURE__*/React.cloneElement(shape, _objectSpread(_objectSpread({}, props), {}, {
      points
    }));
  } else if (typeof shape === 'function') {
    radar = shape(_objectSpread(_objectSpread({}, props), {}, {
      points
    }));
  } else {
    radar = /*#__PURE__*/React.createElement(Polygon, _extends({}, svgPropertiesAndEvents(props), {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      points: points,
      baseLinePoints: isRange ? baseLinePoints : undefined,
      connectNulls: connectNulls
    }));
  }
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-radar-polygon"
  }, radar, /*#__PURE__*/React.createElement(RadarDotsWrapper, {
    props: props,
    points: points
  }));
}
var defaultRadarAnimateItems = (items, animationElapsedTime) => {
  if (items == null) return [];
  if (animationElapsedTime === 1) {
    return items.flatMap(item => item.status === 'removed' ? [] : [item.next]);
  }
  return items.flatMap(item => {
    if (item.status === 'removed') return [];
    if (item.status === 'matched') {
      return [_objectSpread(_objectSpread({}, item.next), {}, {
        x: interpolate(item.prev.x, item.next.x, animationElapsedTime),
        y: interpolate(item.prev.y, item.next.y, animationElapsedTime)
      })];
    }
    // added: animate from center
    return [_objectSpread(_objectSpread({}, item.next), {}, {
      x: interpolate(item.next.cx, item.next.x, animationElapsedTime),
      y: interpolate(item.next.cy, item.next.y, animationElapsedTime)
    })];
  });
};
function PolygonWithAnimation(_ref6) {
  var props = _ref6.props,
    previousPointsRef = _ref6.previousPointsRef,
    previousBaseLinePointsRef = _ref6.previousBaseLinePointsRef;
  var points = props.points,
    baseLinePoints = props.baseLinePoints,
    isAnimationActive = props.isAnimationActive,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    animationMatchBy = props.animationMatchBy,
    animationInterpolateFn = props.animationInterpolateFn,
    onAnimationStart = props.onAnimationStart,
    onAnimationEnd = props.onAnimationEnd;
  var baseLineAnimationState = useAnimationStartSnapshot(props, previousBaseLinePointsRef);
  var prevBaseLinePoints = baseLineAnimationState.startValue;
  var baseLineAnimationItems = matchAnimationItems(prevBaseLinePoints !== null && prevBaseLinePoints !== void 0 ? prevBaseLinePoints : null, baseLinePoints, animationMatchBy);
  var _useAnimationCallback = useAnimationCallbacks(onAnimationStart, onAnimationEnd),
    isAnimating = _useAnimationCallback.isAnimating,
    handleAnimationStart = _useAnimationCallback.handleAnimationStart,
    handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
  var layout = usePolarChartLayout();
  if (layout == null) return null;
  return /*#__PURE__*/React.createElement(RadarLabelListProvider, {
    showLabels: !isAnimating,
    points: points
  }, /*#__PURE__*/React.createElement(AnimatedItems, {
    animationInput: props,
    animationIdPrefix: "recharts-radar-",
    items: points,
    previousItemsRef: previousPointsRef,
    isAnimationActive: isAnimationActive,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd,
    animationInterpolateFn: animationInterpolateFn,
    animationMatchBy: animationMatchBy,
    layout: layout
  }, (stepData, animationElapsedTime) => {
    var stepBaseLinePoints = animationElapsedTime === 1 ? baseLinePoints : animationInterpolateFn(baseLineAnimationItems, animationElapsedTime, layout);
    baseLineAnimationState.syncStepValue(stepBaseLinePoints, animationElapsedTime);
    return /*#__PURE__*/React.createElement(StaticPolygon, {
      points: stepData,
      baseLinePoints: stepBaseLinePoints,
      props: props
    });
  }), /*#__PURE__*/React.createElement(LabelListFromLabelProp, {
    label: props.label
  }), props.children);
}
function RenderPolygon(props) {
  var previousPointsRef = useRef(undefined);
  var previousBaseLinePointsRef = useRef(undefined);
  return /*#__PURE__*/React.createElement(PolygonWithAnimation, {
    props: props,
    previousPointsRef: previousPointsRef,
    previousBaseLinePointsRef: previousBaseLinePointsRef
  });
}
export var defaultRadarProps = {
  activeDot: true,
  angleAxisId: 0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  animationMatchBy: matchByIndex,
  animationInterpolateFn: defaultRadarAnimateItems,
  dot: false,
  hide: false,
  isAnimationActive: 'auto',
  label: false,
  legendType: 'rect',
  radiusAxisId: 0,
  zIndex: DefaultZIndexes.area
};
function RadarWithState(props) {
  var hide = props.hide,
    className = props.className,
    points = props.points;
  if (hide) {
    return null;
  }
  var layerClass = clsx('recharts-radar', className);
  return /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(Layer, {
    className: layerClass
  }, /*#__PURE__*/React.createElement(RenderPolygon, props)), /*#__PURE__*/React.createElement(ActivePoints, {
    points: points,
    mainColor: getLegendItemColor(props.stroke, props.fill),
    itemDataKey: props.dataKey,
    activeDot: props.activeDot
  }));
}
function RadarImpl(props) {
  var isPanorama = useIsPanorama();
  var radarPoints = useAppSelector(state => selectRadarPoints(state, props.radiusAxisId, props.angleAxisId, isPanorama, props.id));
  if ((radarPoints === null || radarPoints === void 0 ? void 0 : radarPoints.points) == null) {
    return null;
  }
  return /*#__PURE__*/React.createElement(RadarWithState, _extends({}, props, {
    points: radarPoints === null || radarPoints === void 0 ? void 0 : radarPoints.points,
    baseLinePoints: radarPoints === null || radarPoints === void 0 ? void 0 : radarPoints.baseLinePoints,
    isRange: radarPoints === null || radarPoints === void 0 ? void 0 : radarPoints.isRange
  }));
}

/**
 * @consumes PolarChartContext
 * @provides LabelListContext
 */
export function Radar(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultRadarProps);
  return /*#__PURE__*/React.createElement(RegisterGraphicalItemId, {
    id: props.id,
    type: "radar"
  }, id => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetPolarGraphicalItem, {
    type: "radar",
    id: id,
    data: undefined // Radar does not have data prop, why?
    ,
    dataKey: props.dataKey,
    hide: props.hide,
    angleAxisId: props.angleAxisId,
    radiusAxisId: props.radiusAxisId
  }), /*#__PURE__*/React.createElement(SetPolarLegendPayload, {
    legendPayload: computeLegendPayloadFromRadarSectors(props)
  }), /*#__PURE__*/React.createElement(SetRadarTooltipEntrySettings, {
    dataKey: props.dataKey,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    tooltipType: props.tooltipType,
    id: id
  }), /*#__PURE__*/React.createElement(RadarImpl, _extends({}, props, {
    id: id
  }))));
}
Radar.displayName = 'Radar';