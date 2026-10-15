var _excluded = ["onMouseEnter", "onClick", "onMouseLeave", "shape", "activeShape"],
  _excluded2 = ["id"],
  _excluded3 = ["stroke", "fill", "legendType", "hide", "isAnimationActive", "animationBegin", "animationDuration", "animationEasing", "nameKey", "lastShapeType", "id"],
  _excluded4 = ["id"];
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { useMemo, useRef } from 'react';
import omit from 'es-toolkit/compat/omit';
import { clsx } from 'clsx';
import { selectActiveIndex } from '../state/selectors/selectors';
import { useAppSelector } from '../state/hooks';
import { Layer } from '../container/Layer';
import { CartesianLabelListContextProvider, LabelListFromLabelProp } from '../component/LabelList';
import { getPercentValue, interpolate } from '../util/DataUtils';
import { getValueByDataKey } from '../util/ChartUtils';
import { adaptEventsOfChild } from '../util/types';
import { defaultFunnelShape, FunnelTrapezoid } from '../util/FunnelUtils';
import { useMouseClickItemDispatch, useMouseEnterItemDispatch, useMouseLeaveItemDispatch } from '../context/tooltipContext';
import { SetTooltipEntrySettings } from '../state/SetTooltipEntrySettings';
import { selectFunnelTrapezoids } from '../state/selectors/funnelSelectors';
import { findAllByType } from '../util/ReactUtils';
import { Cell } from '../component/Cell';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { usePlotArea } from '../hooks';
import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents';
import { AnimatedItems, useAnimationCallbacks } from '../animation/AnimatedItems';
import { matchAppend } from '../animation/matchBy';
import { RegisterGraphicalItemId } from '../context/RegisterGraphicalItemId';
import { useCartesianChartLayout } from '../context/chartLayoutContext';

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

var SetFunnelTooltipEntrySettings = /*#__PURE__*/React.memo(_ref => {
  var dataKey = _ref.dataKey,
    nameKey = _ref.nameKey,
    stroke = _ref.stroke,
    strokeWidth = _ref.strokeWidth,
    fill = _ref.fill,
    name = _ref.name,
    hide = _ref.hide,
    tooltipType = _ref.tooltipType,
    formatter = _ref.formatter,
    data = _ref.data,
    trapezoids = _ref.trapezoids,
    id = _ref.id;
  var tooltipEntrySettings = {
    dataDefinedOnItem: data,
    getPosition: index => {
      var _trapezoids$Number;
      return (_trapezoids$Number = trapezoids[Number(index)]) === null || _trapezoids$Number === void 0 ? void 0 : _trapezoids$Number.tooltipPosition;
    },
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      name,
      nameKey,
      hide,
      type: tooltipType,
      color: fill,
      unit: '',
      // Funnel does not have unit, why?
      formatter,
      graphicalItemId: id
    }
  };
  return /*#__PURE__*/React.createElement(SetTooltipEntrySettings, {
    tooltipEntrySettings: tooltipEntrySettings
  });
});
function FunnelLabelListProvider(_ref2) {
  var showLabels = _ref2.showLabels,
    trapezoids = _ref2.trapezoids,
    children = _ref2.children;
  var labelListEntries = useMemo(() => {
    if (!showLabels) {
      return undefined;
    }
    return trapezoids === null || trapezoids === void 0 ? void 0 : trapezoids.map(entry => {
      var viewBox = entry.labelViewBox;
      return _objectSpread(_objectSpread({}, viewBox), {}, {
        value: entry.name,
        payload: entry.payload,
        parentViewBox: entry.parentViewBox,
        viewBox,
        fill: entry.fill
      });
    });
  }, [showLabels, trapezoids]);
  return /*#__PURE__*/React.createElement(CartesianLabelListContextProvider, {
    value: labelListEntries
  }, children);
}
function FunnelTrapezoids(props) {
  var trapezoids = props.trapezoids,
    allOtherFunnelProps = props.allOtherFunnelProps,
    animationElapsedTime = props.animationElapsedTime,
    isAnimating = props.isAnimating,
    isEntrance = props.isEntrance;
  var activeItemIndex = useAppSelector(state => selectActiveIndex(state, 'item', state.tooltip.settings.trigger, undefined));
  var onMouseEnterFromProps = allOtherFunnelProps.onMouseEnter,
    onItemClickFromProps = allOtherFunnelProps.onClick,
    onMouseLeaveFromProps = allOtherFunnelProps.onMouseLeave,
    shape = allOtherFunnelProps.shape,
    activeShape = allOtherFunnelProps.activeShape,
    restOfAllOtherProps = _objectWithoutProperties(allOtherFunnelProps, _excluded);
  var onMouseEnterFromContext = useMouseEnterItemDispatch(onMouseEnterFromProps, allOtherFunnelProps.dataKey, allOtherFunnelProps.id);
  var onMouseLeaveFromContext = useMouseLeaveItemDispatch(onMouseLeaveFromProps);
  var onClickFromContext = useMouseClickItemDispatch(onItemClickFromProps, allOtherFunnelProps.dataKey, allOtherFunnelProps.id);
  return /*#__PURE__*/React.createElement(React.Fragment, null, trapezoids.map((entry, i) => {
    var isActiveIndex = Boolean(activeShape) && activeItemIndex === String(i);
    var trapezoidOptions = isActiveIndex ? activeShape : shape;
    var _entry$option$isActiv = _objectSpread(_objectSpread({}, entry), {}, {
        option: trapezoidOptions,
        isActive: isActiveIndex,
        stroke: entry.stroke,
        animationElapsedTime,
        isAnimating,
        isEntrance
      }),
      id = _entry$option$isActiv.id,
      trapezoidProps = _objectWithoutProperties(_entry$option$isActiv, _excluded2);
    return /*#__PURE__*/React.createElement(Layer, _extends({
      key: "trapezoid-".concat(entry === null || entry === void 0 ? void 0 : entry.x, "-").concat(entry === null || entry === void 0 ? void 0 : entry.y, "-").concat(entry === null || entry === void 0 ? void 0 : entry.name, "-").concat(entry === null || entry === void 0 ? void 0 : entry.value),
      className: "recharts-funnel-trapezoid"
    }, adaptEventsOfChild(restOfAllOtherProps, entry, i), {
      onMouseEnter: onMouseEnterFromContext(entry, i),
      onMouseLeave: onMouseLeaveFromContext(entry, i),
      onClick: onClickFromContext(entry, i)
    }), /*#__PURE__*/React.createElement(FunnelTrapezoid, trapezoidProps));
  }));
}
var defaultFunnelAnimateItems = (items, animationElapsedTime) => {
  if (items == null) return [];
  if (animationElapsedTime === 1) {
    return items.flatMap(item => item.status === 'removed' ? [] : [item.next]);
  }
  return items.flatMap(item => {
    if (item.status === 'removed') return [];
    if (item.status === 'matched') {
      return [_objectSpread(_objectSpread({}, item.next), {}, {
        x: interpolate(item.prev.x, item.next.x, animationElapsedTime),
        y: interpolate(item.prev.y, item.next.y, animationElapsedTime),
        upperWidth: interpolate(item.prev.upperWidth, item.next.upperWidth, animationElapsedTime),
        lowerWidth: interpolate(item.prev.lowerWidth, item.next.lowerWidth, animationElapsedTime),
        height: interpolate(item.prev.height, item.next.height, animationElapsedTime)
      })];
    }
    // added
    var next = item.next;
    return [_objectSpread(_objectSpread({}, next), {}, {
      x: interpolate(next.x + next.upperWidth / 2, next.x, animationElapsedTime),
      y: interpolate(next.y + next.height / 2, next.y, animationElapsedTime),
      upperWidth: interpolate(0, next.upperWidth, animationElapsedTime),
      lowerWidth: interpolate(0, next.lowerWidth, animationElapsedTime),
      height: interpolate(0, next.height, animationElapsedTime)
    })];
  });
};
function TrapezoidsWithAnimation(_ref3) {
  var previousTrapezoidsRef = _ref3.previousTrapezoidsRef,
    props = _ref3.props;
  var trapezoids = props.trapezoids,
    isAnimationActive = props.isAnimationActive,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    animationInterpolateFn = props.animationInterpolateFn;
  var layout = useCartesianChartLayout();
  var _useAnimationCallback = useAnimationCallbacks(props.onAnimationStart, props.onAnimationEnd),
    isAnimating = _useAnimationCallback.isAnimating,
    handleAnimationStart = _useAnimationCallback.handleAnimationStart,
    handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
  if (layout == null) return null;
  return /*#__PURE__*/React.createElement(FunnelLabelListProvider, {
    showLabels: !isAnimating,
    trapezoids: trapezoids
  }, /*#__PURE__*/React.createElement(AnimatedItems, {
    animationInput: trapezoids,
    animationIdPrefix: "recharts-funnel-",
    items: trapezoids,
    previousItemsRef: previousTrapezoidsRef,
    isAnimationActive: isAnimationActive,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd,
    animationInterpolateFn: animationInterpolateFn,
    animationMatchBy: props.animationMatchBy,
    layout: layout
  }, (stepData, animationElapsedTime, isEntrance) => /*#__PURE__*/React.createElement(Layer, null, /*#__PURE__*/React.createElement(FunnelTrapezoids, {
    trapezoids: stepData,
    allOtherFunnelProps: props,
    animationElapsedTime: animationElapsedTime,
    isAnimating: isAnimating || animationElapsedTime < 1,
    isEntrance: isEntrance
  }))), /*#__PURE__*/React.createElement(LabelListFromLabelProp, {
    label: props.label
  }), props.children);
}
function RenderTrapezoids(props) {
  var previousTrapezoidsRef = useRef(undefined);
  return /*#__PURE__*/React.createElement(TrapezoidsWithAnimation, {
    props: props,
    previousTrapezoidsRef: previousTrapezoidsRef
  });
}
var getRealWidthHeight = (customWidth, offset) => {
  var width = offset.width,
    height = offset.height,
    left = offset.left,
    top = offset.top;
  var realWidth = getPercentValue(customWidth, width, width);
  return {
    realWidth,
    realHeight: height,
    offsetX: left,
    offsetY: top
  };
};
export var defaultFunnelProps = {
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: 'ease',
  animationInterpolateFn: defaultFunnelAnimateItems,
  animationMatchBy: matchAppend,
  fill: '#808080',
  hide: false,
  isAnimationActive: 'auto',
  lastShapeType: 'triangle',
  legendType: 'rect',
  nameKey: 'name',
  reversed: false,
  shape: defaultFunnelShape,
  stroke: '#fff'
};
function FunnelImpl(props) {
  var plotArea = usePlotArea();
  var stroke = props.stroke,
    fill = props.fill,
    legendType = props.legendType,
    hide = props.hide,
    isAnimationActive = props.isAnimationActive,
    animationBegin = props.animationBegin,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    nameKey = props.nameKey,
    lastShapeType = props.lastShapeType,
    id = props.id,
    everythingElse = _objectWithoutProperties(props, _excluded3);
  var presentationProps = svgPropertiesNoEvents(props);
  var cells = findAllByType(props.children, Cell);
  var funnelSettings = useMemo(() => ({
    dataKey: props.dataKey,
    nameKey,
    data: props.data,
    tooltipType: props.tooltipType,
    lastShapeType,
    reversed: props.reversed,
    customWidth: props.width,
    cells,
    presentationProps,
    id
  }), [props.dataKey, nameKey, props.data, props.tooltipType, lastShapeType, props.reversed, props.width, cells, presentationProps, id]);
  var trapezoids = useAppSelector(state => selectFunnelTrapezoids(state, funnelSettings));
  if (hide || !trapezoids || !trapezoids.length || !plotArea) {
    return null;
  }
  var height = plotArea.height,
    width = plotArea.width;
  var layerClass = clsx('recharts-trapezoids', props.className);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetFunnelTooltipEntrySettings, {
    dataKey: props.dataKey,
    nameKey: props.nameKey,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    tooltipType: props.tooltipType,
    formatter: props.formatter,
    data: props.data,
    trapezoids: trapezoids,
    id: id
  }), /*#__PURE__*/React.createElement(Layer, {
    className: layerClass
  }, /*#__PURE__*/React.createElement(RenderTrapezoids, _extends({}, everythingElse, {
    id: id,
    stroke: stroke,
    fill: fill,
    nameKey: nameKey,
    lastShapeType: lastShapeType,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive,
    hide: hide,
    legendType: legendType,
    height: height,
    width: width,
    trapezoids: trapezoids
  }))));
}
export function computeFunnelTrapezoids(_ref4) {
  var dataKey = _ref4.dataKey,
    nameKey = _ref4.nameKey,
    displayedData = _ref4.displayedData,
    tooltipType = _ref4.tooltipType,
    lastShapeType = _ref4.lastShapeType,
    reversed = _ref4.reversed,
    offset = _ref4.offset,
    customWidth = _ref4.customWidth,
    graphicalItemId = _ref4.graphicalItemId;
  var _getRealWidthHeight = getRealWidthHeight(customWidth, offset),
    realHeight = _getRealWidthHeight.realHeight,
    realWidth = _getRealWidthHeight.realWidth,
    offsetX = _getRealWidthHeight.offsetX,
    offsetY = _getRealWidthHeight.offsetY;
  var values = displayedData.map(entry => {
    var val = getValueByDataKey(entry, dataKey, 0);
    return typeof val === 'number' ? val : 0;
  });
  var maxValue = Math.max.apply(null, values);
  var len = displayedData.length;
  var rowHeight = realHeight / len;
  var parentViewBox = {
    x: offset.left,
    y: offset.top,
    width: offset.width,
    height: offset.height
  };
  var trapezoids = displayedData.map((entry, i) => {
    // getValueByDataKey does not validate the output type
    var rawVal = getValueByDataKey(entry, dataKey, 0);
    var name = String(getValueByDataKey(entry, nameKey, i));
    var val = rawVal;
    var nextVal;
    if (i !== len - 1) {
      var nextDataValue = getValueByDataKey(displayedData[i + 1], dataKey, 0);
      if (typeof nextDataValue === 'number') {
        nextVal = nextDataValue;
      } else if (Array.isArray(nextDataValue)) {
        var _nextDataValue = _slicedToArray(nextDataValue, 2),
          first = _nextDataValue[0],
          second = _nextDataValue[1];
        if (typeof first === 'number') {
          val = first;
        }
        if (typeof second === 'number') {
          nextVal = second;
        }
      }
    } else if (rawVal instanceof Array && rawVal.length === 2) {
      var _rawVal = _slicedToArray(rawVal, 2),
        _first = _rawVal[0],
        _second = _rawVal[1];
      if (typeof _first === 'number') {
        val = _first;
      }
      if (typeof _second === 'number') {
        nextVal = _second;
      }
    } else if (lastShapeType === 'rectangle') {
      nextVal = val;
    } else {
      nextVal = 0;
    }

    // @ts-expect-error this is a problem if we have ranged values because `val` can be an array
    var x = maxValue === 0 ? offsetX : (maxValue - val) * realWidth / (2 * maxValue) + offsetX;
    var y = rowHeight * i + offsetY;
    // @ts-expect-error getValueByDataKey does not validate the output type
    var upperWidth = maxValue === 0 ? 0 : val / maxValue * realWidth;
    // @ts-expect-error nextVal could be an array
    var lowerWidth = maxValue === 0 ? 0 : nextVal / maxValue * realWidth;
    var tooltipPayload = [{
      name,
      value: val,
      payload: entry,
      dataKey,
      type: tooltipType,
      graphicalItemId
    }];
    var tooltipPosition = {
      x: x + upperWidth / 2,
      y: y + rowHeight / 2
    };
    var trapezoidViewBox = {
      x,
      y,
      upperWidth,
      lowerWidth,
      width: Math.max(upperWidth, lowerWidth),
      height: rowHeight
    };
    return _objectSpread(_objectSpread(_objectSpread({}, trapezoidViewBox), {}, {
      name,
      val,
      tooltipPayload,
      tooltipPosition
    }, entry != null && typeof entry === 'object' ? omit(entry, ['width']) : {}), {}, {
      payload: entry,
      parentViewBox,
      labelViewBox: trapezoidViewBox
    });
  });
  if (reversed) {
    trapezoids = trapezoids.map((entry, index) => {
      var reversedViewBox = {
        x: entry.x - (entry.lowerWidth - entry.upperWidth) / 2,
        y: entry.y - index * rowHeight + (len - 1 - index) * rowHeight,
        upperWidth: entry.lowerWidth,
        lowerWidth: entry.upperWidth,
        width: Math.max(entry.lowerWidth, entry.upperWidth),
        height: rowHeight
      };
      return _objectSpread(_objectSpread(_objectSpread({}, entry), reversedViewBox), {}, {
        tooltipPosition: _objectSpread(_objectSpread({}, entry.tooltipPosition), {}, {
          y: entry.y - index * rowHeight + (len - 1 - index) * rowHeight + rowHeight / 2
        }),
        labelViewBox: reversedViewBox
      });
    });
  }
  return trapezoids;
}

/**
 * @consumes CartesianViewBoxContext
 * @provides LabelListContext
 * @provides CellReader
 */
function FunnelFn(outsideProps) {
  var _resolveDefaultProps = resolveDefaultProps(outsideProps, defaultFunnelProps),
    externalId = _resolveDefaultProps.id,
    props = _objectWithoutProperties(_resolveDefaultProps, _excluded4);
  return /*#__PURE__*/React.createElement(RegisterGraphicalItemId, {
    id: externalId,
    type: "funnel"
  }, id => /*#__PURE__*/React.createElement(FunnelImpl, _extends({}, props, {
    id: id
  })));
}
export var Funnel = FunnelFn;
// @ts-expect-error we need to set the displayName for debugging purposes
Funnel.displayName = 'Funnel';