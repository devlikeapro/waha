function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { useEffect } from 'react';
import { clsx } from 'clsx';
import { Layer } from '../container/Layer';
import { Dot } from '../shape/Dot';
import { CartesianLabelContextProvider, CartesianLabelFromLabelProp } from '../component/Label';
import { isNumOrStr } from '../util/DataUtils';
import { addDot, removeDot } from '../state/referenceElementsSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectAxisScale } from '../state/selectors/axisSelectors';
import { useIsPanorama } from '../context/PanoramaContext';
import { useClipPathId } from '../container/ClipPathProvider';
import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { ZIndexLayer } from '../zIndex/ZIndexLayer';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes';
import { CartesianScaleHelperImpl } from '../util/scale/CartesianScaleHelper';
var useCoordinate = (x, y, xAxisId, yAxisId, ifOverflow) => {
  var isX = isNumOrStr(x);
  var isY = isNumOrStr(y);
  var isPanorama = useIsPanorama();
  var xAxisScale = useAppSelector(state => selectAxisScale(state, 'xAxis', xAxisId, isPanorama));
  var yAxisScale = useAppSelector(state => selectAxisScale(state, 'yAxis', yAxisId, isPanorama));
  if (!isX || !isY || xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var scales = new CartesianScaleHelperImpl({
    x: xAxisScale,
    y: yAxisScale
  });
  var result = scales.map({
    x,
    y
  }, {
    position: 'middle'
  });
  if (ifOverflow === 'discard' && !scales.isInRange(result)) {
    return null;
  }
  return result;
};
function ReportReferenceDot(props) {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(addDot(props));
    return () => {
      dispatch(removeDot(props));
    };
  });
  return null;
}
var renderDot = (option, props) => {
  var dot;
  if (/*#__PURE__*/React.isValidElement(option)) {
    // @ts-expect-error element cloning is not typed
    dot = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    dot = option(props);
  } else {
    dot = /*#__PURE__*/React.createElement(Dot, _extends({}, props, {
      cx: props.cx,
      cy: props.cy,
      className: "recharts-reference-dot-dot"
    }));
  }
  return dot;
};
function ReferenceDotImpl(props) {
  var x = props.x,
    y = props.y,
    r = props.r;
  var clipPathId = useClipPathId();
  var coordinate = useCoordinate(x, y, props.xAxisId, props.yAxisId, props.ifOverflow);
  if (!coordinate) {
    return null;
  }
  var cx = coordinate.x,
    cy = coordinate.y;
  var shape = props.shape,
    className = props.className,
    ifOverflow = props.ifOverflow;
  var clipPath = ifOverflow === 'hidden' ? "url(#".concat(clipPathId, ")") : undefined;
  var dotProps = _objectSpread(_objectSpread({
    clipPath
  }, svgPropertiesAndEvents(props)), {}, {
    cx: cx !== null && cx !== void 0 ? cx : undefined,
    cy: cy !== null && cy !== void 0 ? cy : undefined
  });
  return /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(Layer, {
    className: clsx('recharts-reference-dot', className)
  }, renderDot(shape, dotProps), /*#__PURE__*/React.createElement(CartesianLabelContextProvider, {
    x: cx - r,
    y: cy - r,
    width: 2 * r,
    height: 2 * r,
    upperWidth: 2 * r,
    lowerWidth: 2 * r
  }, /*#__PURE__*/React.createElement(CartesianLabelFromLabelProp, {
    label: props.label
  }), props.children)));
}
export var referenceDotDefaultProps = {
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  label: false,
  fill: '#fff',
  stroke: '#ccc',
  fillOpacity: 1,
  strokeWidth: 1,
  zIndex: DefaultZIndexes.scatter
};
/**
 * Draws a circle on the chart to highlight a specific point.
 *
 * This component, unlike {@link Dot} or {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/circle circle}, is aware of the cartesian coordinate system,
 * so you specify its center by using data coordinates instead of pixels.
 *
 * ReferenceDot will calculate the pixels based on the provided data coordinates.
 *
 * If you prefer to render dots using pixels rather than data coordinates,
 * consider using the {@link Dot} component instead.
 *
 * @provides CartesianLabelContext
 * @consumes CartesianChartContext
 */
export function ReferenceDot(outsideProps) {
  var props = resolveDefaultProps(outsideProps, referenceDotDefaultProps);
  var x = props.x,
    y = props.y,
    r = props.r,
    ifOverflow = props.ifOverflow,
    yAxisId = props.yAxisId,
    xAxisId = props.xAxisId;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportReferenceDot, {
    y: y,
    x: x,
    r: r,
    yAxisId: yAxisId,
    xAxisId: xAxisId,
    ifOverflow: ifOverflow
  }), /*#__PURE__*/React.createElement(ReferenceDotImpl, props));
}
ReferenceDot.displayName = 'ReferenceDot';