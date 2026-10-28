var _excluded = ["contextPayload"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { getCartesianPosition, isOutsidePosition } from '../cartesian/getCartesianPosition';
import { useLegendPortal } from '../context/legendPortalContext';
import { DefaultLegendContent } from './DefaultLegendContent';
import { getUniqPayload } from '../util/payload/getUniqPayload';
import { useLegendPayload } from '../context/legendPayloadContext';
import { useElementOffset } from '../util/useElementOffset';
import { useChartHeight, useChartWidth, useMargin } from '../context/chartLayoutContext';
import { setLegendSettings, setLegendSize } from '../state/legendSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { propsAreEqual } from '../util/propsAreEqual';
import { selectLegendArea } from '../state/selectors/selectLegendArea';
import { cartesianPositionToCSSTranslate } from '../cartesian/cartesianPositionToCSSTranslate';
import { selectChartViewBox } from '../state/selectors/selectChartOffsetInternal';
function defaultUniqBy(entry) {
  return entry.value;
}
function LegendContent(props) {
  var contextPayload = props.contextPayload,
    otherProps = _objectWithoutProperties(props, _excluded);
  var finalPayload = getUniqPayload(contextPayload, props.payloadUniqBy, defaultUniqBy);
  var contentProps = _objectSpread(_objectSpread({}, otherProps), {}, {
    payload: finalPayload
  });
  if (/*#__PURE__*/React.isValidElement(props.content)) {
    return /*#__PURE__*/React.cloneElement(props.content, contentProps);
  }
  if (typeof props.content === 'function') {
    return /*#__PURE__*/React.createElement(props.content, contentProps);
  }
  return /*#__PURE__*/React.createElement(DefaultLegendContent, contentProps);
}
function getLayoutForPosition(position) {
  if (position === 'left' || position === 'right' || position === 'insideLeft' || position === 'insideRight') {
    return 'vertical';
  }
  return 'horizontal';
}
function selectPositionViewBox(state, position) {
  if (position == null) {
    return null;
  }
  return isOutsidePosition(position) ? selectLegendArea(state) : selectChartViewBox(state);
}
function getOutsidePositionOffset(position, offset, box) {
  if (position === 'top') {
    return {
      top: box.height + offset
    };
  }
  if (position === 'bottom') {
    return {
      top: -box.height - offset
    };
  }
  if (position === 'left') {
    return {
      left: box.width + offset
    };
  }
  if (position === 'right') {
    return {
      left: -box.width - offset
    };
  }
  return {};
}
function getDefaultPosition(style, props, margin, chartWidth, chartHeight, box) {
  var layout = props.layout,
    align = props.align,
    verticalAlign = props.verticalAlign;
  var hPos, vPos;
  if (!style || (style.left === undefined || style.left === null) && (style.right === undefined || style.right === null)) {
    if (align === 'center' && layout === 'vertical') {
      hPos = {
        left: ((chartWidth || 0) - box.width) / 2
      };
    } else {
      hPos = align === 'right' ? {
        right: margin && margin.right || 0
      } : {
        left: margin && margin.left || 0
      };
    }
  }
  if (!style || (style.top === undefined || style.top === null) && (style.bottom === undefined || style.bottom === null)) {
    if (verticalAlign === 'middle') {
      vPos = {
        top: ((chartHeight || 0) - box.height) / 2
      };
    } else {
      vPos = verticalAlign === 'bottom' ? {
        bottom: margin && margin.bottom || 0
      } : {
        top: margin && margin.top || 0
      };
    }
  }
  return _objectSpread(_objectSpread({}, hPos), vPos);
}
function LegendSettingsDispatcher(_ref) {
  var align = _ref.align,
    layout = _ref.layout,
    verticalAlign = _ref.verticalAlign,
    itemSorter = _ref.itemSorter,
    position = _ref.position,
    offset = _ref.offset;
  var dispatch = useAppDispatch();
  useLayoutEffect(() => {
    dispatch(setLegendSettings({
      align,
      layout,
      verticalAlign,
      itemSorter,
      position,
      offset
    }));
  }, [dispatch, align, layout, verticalAlign, itemSorter, position, offset]);
  return null;
}
function LegendSizeDispatcher(_ref2) {
  var width = _ref2.width,
    height = _ref2.height;
  var dispatch = useAppDispatch();
  useLayoutEffect(() => {
    dispatch(setLegendSize({
      width,
      height
    }));
  }, [dispatch, width, height]);
  useLayoutEffect(() => {
    return () => {
      dispatch(setLegendSize({
        width: 0,
        height: 0
      }));
    };
  }, [dispatch]);
  return null;
}
function getWidthOrHeight(layout, height, width, maxWidth) {
  if (layout === 'vertical' && height != null) {
    return {
      height
    };
  }
  if (layout === 'horizontal') {
    return {
      width: width || maxWidth
    };
  }
  return null;
}
export var legendDefaultProps = {
  align: 'center',
  iconSize: 14,
  inactiveColor: '#ccc',
  itemSorter: 'value',
  labelStyle: {},
  layout: 'auto',
  verticalAlign: 'bottom',
  offset: 0
};

/**
 * @consumes CartesianChartContext
 * @consumes PolarChartContext
 */
function LegendImpl(outsideProps) {
  var _props$offset, _props$offset2, _positionViewBox$widt, _positionViewBox$widt2, _positionViewBox$heig, _positionViewBox$heig2, _outsidePositionOffse, _outsidePositionOffse2;
  var props = resolveDefaultProps(outsideProps, legendDefaultProps);
  var layout = outsideProps.layout && outsideProps.layout !== 'auto' ? outsideProps.layout : getLayoutForPosition(props.position);
  var contextPayload = useLegendPayload();
  var legendPortalFromContext = useLegendPortal();
  var margin = useMargin();
  var positionViewBox = useAppSelector(state => selectPositionViewBox(state, props.position));
  var widthFromProps = props.width,
    heightFromProps = props.height,
    wrapperStyle = props.wrapperStyle,
    portalFromProps = props.portal;
  var shouldReportDimensions = portalFromProps == null && (props.position == null || isOutsidePosition(props.position));

  // The contextPayload is not used directly inside the hook, but we need the onBBoxUpdate call
  // when the payload changes, therefore it's here as a dependency.
  var _useElementOffset = useElementOffset([contextPayload]),
    _useElementOffset2 = _slicedToArray(_useElementOffset, 2),
    lastBoundingBox = _useElementOffset2[0],
    updateBoundingBox = _useElementOffset2[1];
  var chartWidth = useChartWidth();
  var chartHeight = useChartHeight();
  if (chartWidth == null || chartHeight == null || props.position != null && positionViewBox == null) {
    return null;
  }
  var maxWidth = chartWidth - ((margin === null || margin === void 0 ? void 0 : margin.left) || 0) - ((margin === null || margin === void 0 ? void 0 : margin.right) || 0);
  var widthOrHeight = getWidthOrHeight(layout, heightFromProps, widthFromProps, maxWidth);
  var positionResult = props.position == null ? null : getCartesianPosition({
    /*
     * When calculating the position we use two different view boxes.
     * Inside positions use the plot area; outside positions use the margin-inset
     * chart area, placing the Legend beyond any axes.
     */
    viewBox: positionViewBox !== null && positionViewBox !== void 0 ? positionViewBox : {
      x: 0,
      y: 0,
      width: chartWidth,
      height: chartHeight
    },
    position: props.position,
    offset: (_props$offset = props.offset) !== null && _props$offset !== void 0 ? _props$offset : 0
  });
  var outsidePositionOffset = getOutsidePositionOffset(props.position, (_props$offset2 = props.offset) !== null && _props$offset2 !== void 0 ? _props$offset2 : 0, lastBoundingBox);
  var positionMaxWidth = layout === 'vertical' ? ((_positionViewBox$widt = positionViewBox === null || positionViewBox === void 0 ? void 0 : positionViewBox.width) !== null && _positionViewBox$widt !== void 0 ? _positionViewBox$widt : 0) / 2 : (_positionViewBox$widt2 = positionViewBox === null || positionViewBox === void 0 ? void 0 : positionViewBox.width) !== null && _positionViewBox$widt2 !== void 0 ? _positionViewBox$widt2 : 0;
  var positionMaxHeight = layout === 'horizontal' ? ((_positionViewBox$heig = positionViewBox === null || positionViewBox === void 0 ? void 0 : positionViewBox.height) !== null && _positionViewBox$heig !== void 0 ? _positionViewBox$heig : 0) / 2 : (_positionViewBox$heig2 = positionViewBox === null || positionViewBox === void 0 ? void 0 : positionViewBox.height) !== null && _positionViewBox$heig2 !== void 0 ? _positionViewBox$heig2 : 0;
  var positionStyle = positionResult ? {
    width: 'max-content',
    height: 'max-content',
    maxWidth: positionMaxWidth,
    maxHeight: positionMaxHeight,
    overflowY: 'auto',
    top: positionResult.y + ((_outsidePositionOffse = outsidePositionOffset.top) !== null && _outsidePositionOffse !== void 0 ? _outsidePositionOffse : 0),
    left: positionResult.x + ((_outsidePositionOffse2 = outsidePositionOffset.left) !== null && _outsidePositionOffse2 !== void 0 ? _outsidePositionOffse2 : 0),
    transform: cartesianPositionToCSSTranslate(positionResult.horizontalAnchor, positionResult.verticalAnchor)
  } : getDefaultPosition(wrapperStyle, props, margin, chartWidth, chartHeight, lastBoundingBox);

  // if the user supplies their own portal, only use their defined wrapper styles
  var outerStyle = portalFromProps ? wrapperStyle : _objectSpread(_objectSpread({
    position: 'absolute',
    width: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.width) || widthFromProps || 'auto',
    height: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.height) || heightFromProps || 'auto'
  }, positionStyle), wrapperStyle);
  var legendPortal = portalFromProps !== null && portalFromProps !== void 0 ? portalFromProps : legendPortalFromContext;
  if (legendPortal == null || contextPayload == null) {
    return null;
  }
  var legendElement = /*#__PURE__*/React.createElement("div", {
    className: "recharts-legend-wrapper",
    style: outerStyle,
    ref: updateBoundingBox
  }, /*#__PURE__*/React.createElement(LegendSettingsDispatcher, {
    layout: layout,
    align: props.align,
    verticalAlign: props.verticalAlign,
    itemSorter: props.itemSorter,
    position: props.position,
    offset: props.offset
  }), shouldReportDimensions && /*#__PURE__*/React.createElement(LegendSizeDispatcher, lastBoundingBox), /*#__PURE__*/React.createElement(LegendContent, _extends({}, props, {
    layout: layout
  }, widthOrHeight, {
    margin: margin,
    chartWidth: chartWidth,
    chartHeight: chartHeight,
    contextPayload: contextPayload
  })));
  return /*#__PURE__*/createPortal(legendElement, legendPortal);
}
export var Legend = /*#__PURE__*/React.memo(LegendImpl, propsAreEqual);
Legend.displayName = 'Legend';