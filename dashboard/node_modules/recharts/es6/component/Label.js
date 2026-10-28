var _excluded = ["labelRef"],
  _excluded2 = ["content"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { cloneElement, createContext, createElement, isValidElement, useContext, useMemo } from 'react';
import { clsx } from 'clsx';
import { isValidTextAnchor, Text } from './Text';
import { isNullish, isNumber, isNumOrStr, mathSign, uniqueId } from '../util/DataUtils';
import { polarToCartesian } from '../util/PolarUtils';
import { useViewBox } from '../context/chartLayoutContext';
import { useAppSelector } from '../state/hooks';
import { selectPolarViewBox } from '../state/selectors/polarAxisSelectors';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents';
import { ZIndexLayer } from '../zIndex/ZIndexLayer';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes';
import { getCartesianPosition } from '../cartesian/getCartesianPosition';
import { cartesianViewBoxToTrapezoid } from '../cartesian/cartesianViewBoxToTrapezoid';

/**
 * @inline
 */

/**
 * @inline
 */

/**
 * @inline
 */

var CartesianLabelContext = /*#__PURE__*/createContext(null);
export var CartesianLabelContextProvider = _ref => {
  var x = _ref.x,
    y = _ref.y,
    upperWidth = _ref.upperWidth,
    lowerWidth = _ref.lowerWidth,
    width = _ref.width,
    height = _ref.height,
    children = _ref.children;
  var viewBox = useMemo(() => ({
    x,
    y,
    upperWidth,
    lowerWidth,
    width,
    height
  }), [x, y, upperWidth, lowerWidth, width, height]);
  return /*#__PURE__*/React.createElement(CartesianLabelContext.Provider, {
    value: viewBox
  }, children);
};
var useCartesianLabelContext = () => {
  var labelChildContext = useContext(CartesianLabelContext);
  var chartContext = useViewBox();
  return labelChildContext || (chartContext ? cartesianViewBoxToTrapezoid(chartContext) : undefined);
};
var PolarLabelContext = /*#__PURE__*/createContext(null);
export var PolarLabelContextProvider = _ref2 => {
  var cx = _ref2.cx,
    cy = _ref2.cy,
    innerRadius = _ref2.innerRadius,
    outerRadius = _ref2.outerRadius,
    startAngle = _ref2.startAngle,
    endAngle = _ref2.endAngle,
    clockWise = _ref2.clockWise,
    children = _ref2.children;
  var viewBox = useMemo(() => ({
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    clockWise
  }), [cx, cy, innerRadius, outerRadius, startAngle, endAngle, clockWise]);
  return /*#__PURE__*/React.createElement(PolarLabelContext.Provider, {
    value: viewBox
  }, children);
};
export var usePolarLabelContext = () => {
  var labelChildContext = useContext(PolarLabelContext);
  var chartContext = useAppSelector(selectPolarViewBox);
  return labelChildContext || chartContext;
};
var getLabel = props => {
  var value = props.value,
    formatter = props.formatter;
  var label = isNullish(props.children) ? value : props.children;
  if (typeof formatter === 'function') {
    return formatter(label);
  }
  return label;
};
export var isLabelContentAFunction = content => {
  return content != null && typeof content === 'function';
};
var getDeltaAngle = (startAngle, endAngle) => {
  var sign = mathSign(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
  return sign * deltaAngle;
};
var renderRadialLabel = (labelProps, position, label, attrs, viewBox) => {
  var offset = labelProps.offset,
    className = labelProps.className;
  var cx = viewBox.cx,
    cy = viewBox.cy,
    innerRadius = viewBox.innerRadius,
    outerRadius = viewBox.outerRadius,
    startAngle = viewBox.startAngle,
    endAngle = viewBox.endAngle,
    clockWise = viewBox.clockWise;
  var radius = (innerRadius + outerRadius) / 2;
  var deltaAngle = getDeltaAngle(startAngle, endAngle);
  var sign = deltaAngle >= 0 ? 1 : -1;
  var labelAngle, direction;
  switch (position) {
    case 'insideStart':
      labelAngle = startAngle + sign * offset;
      direction = clockWise;
      break;
    case 'insideEnd':
      labelAngle = endAngle - sign * offset;
      direction = !clockWise;
      break;
    case 'end':
      labelAngle = endAngle + sign * offset;
      direction = clockWise;
      break;
    default:
      throw new Error("Unsupported position ".concat(position));
  }
  direction = deltaAngle <= 0 ? direction : !direction;
  var startPoint = polarToCartesian(cx, cy, radius, labelAngle);
  var endPoint = polarToCartesian(cx, cy, radius, labelAngle + (direction ? 1 : -1) * 359);
  var path = "M".concat(startPoint.x, ",").concat(startPoint.y, "\n    A").concat(radius, ",").concat(radius, ",0,1,").concat(direction ? 0 : 1, ",\n    ").concat(endPoint.x, ",").concat(endPoint.y);
  var id = isNullish(labelProps.id) ? uniqueId('recharts-radial-line-') : labelProps.id;
  return /*#__PURE__*/React.createElement("text", _extends({}, attrs, {
    dominantBaseline: "central",
    className: clsx('recharts-radial-bar-label', className)
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("path", {
    id: id,
    d: path
  })), /*#__PURE__*/React.createElement("textPath", {
    xlinkHref: "#".concat(id)
  }, label));
};
var getAttrsOfPolarLabel = (viewBox, offset, position) => {
  var cx = viewBox.cx,
    cy = viewBox.cy,
    innerRadius = viewBox.innerRadius,
    outerRadius = viewBox.outerRadius,
    startAngle = viewBox.startAngle,
    endAngle = viewBox.endAngle;
  var midAngle = (startAngle + endAngle) / 2;
  if (position === 'outside') {
    var _polarToCartesian = polarToCartesian(cx, cy, outerRadius + offset, midAngle),
      _x = _polarToCartesian.x,
      _y = _polarToCartesian.y;
    return {
      x: _x,
      y: _y,
      textAnchor: _x >= cx ? 'start' : 'end',
      verticalAnchor: 'middle'
    };
  }
  if (position === 'center') {
    return {
      x: cx,
      y: cy,
      textAnchor: 'middle',
      verticalAnchor: 'middle'
    };
  }
  if (position === 'centerTop') {
    return {
      x: cx,
      y: cy,
      textAnchor: 'middle',
      verticalAnchor: 'start'
    };
  }
  if (position === 'centerBottom') {
    return {
      x: cx,
      y: cy,
      textAnchor: 'middle',
      verticalAnchor: 'end'
    };
  }
  var r = (innerRadius + outerRadius) / 2;
  var _polarToCartesian2 = polarToCartesian(cx, cy, r, midAngle),
    x = _polarToCartesian2.x,
    y = _polarToCartesian2.y;
  return {
    x,
    y,
    textAnchor: 'middle',
    verticalAnchor: 'middle'
  };
};
var isPolar = viewBox => viewBox != null && 'cx' in viewBox && isNumber(viewBox.cx);
export var defaultLabelProps = {
  angle: 0,
  offset: 5,
  zIndex: DefaultZIndexes.label,
  position: 'middle',
  textBreakAll: false
};
function polarViewBoxToTrapezoid(viewBox) {
  if (!isPolar(viewBox)) {
    return viewBox;
  }
  var cx = viewBox.cx,
    cy = viewBox.cy,
    outerRadius = viewBox.outerRadius;
  var diameter = outerRadius * 2;
  return {
    x: cx - outerRadius,
    y: cy - outerRadius,
    width: diameter,
    upperWidth: diameter,
    lowerWidth: diameter,
    height: diameter
  };
}

/**
 * @consumes CartesianViewBoxContext
 * @consumes PolarViewBoxContext
 * @consumes CartesianLabelContext
 * @consumes PolarLabelContext
 */
export function Label(outerProps) {
  var _positionAttrs, _positionAttrs2;
  var props = resolveDefaultProps(outerProps, defaultLabelProps);
  var viewBoxFromProps = props.viewBox,
    parentViewBox = props.parentViewBox,
    position = props.position,
    value = props.value,
    children = props.children,
    content = props.content,
    _props$className = props.className,
    className = _props$className === void 0 ? '' : _props$className,
    textBreakAll = props.textBreakAll,
    labelRef = props.labelRef;
  var polarViewBox = usePolarLabelContext();
  var cartesianViewBox = useCartesianLabelContext();

  /*
   * I am not proud about this solution, but it's a quick fix for https://github.com/recharts/recharts/issues/6030#issuecomment-3155352460.
   * What we should really do is split Label into two components: CartesianLabel and PolarLabel and then handle their respective viewBoxes separately.
   * Also other components should set its own viewBox in a context so that we can fix https://github.com/recharts/recharts/issues/6156
   */
  var resolvedViewBox = position === 'center' ? cartesianViewBox : polarViewBox !== null && polarViewBox !== void 0 ? polarViewBox : cartesianViewBox;
  var viewBox, label, positionAttrs;
  if (viewBoxFromProps == null) {
    viewBox = resolvedViewBox;
  } else if (isPolar(viewBoxFromProps)) {
    viewBox = viewBoxFromProps;
  } else {
    viewBox = cartesianViewBoxToTrapezoid(viewBoxFromProps);
  }
  var cartesianBox = polarViewBoxToTrapezoid(viewBox);
  if (!viewBox || isNullish(value) && isNullish(children) && ! /*#__PURE__*/isValidElement(content) && typeof content !== 'function') {
    return null;
  }

  // TODO: Generic Polar Hook
  var isRadialPolarLabel = isPolar(viewBox) && (position === 'insideStart' || position === 'insideEnd' || position === 'end');
  if (isPolar(viewBox)) {
    if (!isRadialPolarLabel) {
      positionAttrs = getAttrsOfPolarLabel(viewBox, props.offset, props.position);
    }
  } else if (cartesianBox) {
    var cartesianResult = getCartesianPosition({
      viewBox: cartesianBox,
      position,
      offset: props.offset,
      parentViewBox: isPolar(parentViewBox) ? undefined : parentViewBox,
      clamp: true
    });
    positionAttrs = _objectSpread(_objectSpread({
      x: cartesianResult.x,
      y: cartesianResult.y,
      textAnchor: cartesianResult.horizontalAnchor,
      verticalAnchor: cartesianResult.verticalAnchor
    }, cartesianResult.width !== undefined ? {
      width: cartesianResult.width
    } : {}), cartesianResult.height !== undefined ? {
      height: cartesianResult.height
    } : {});
  }

  /*
   * Custom content receives the computed x and y too, so that custom labels
   * can be positioned the same way the built-in Text label is. Explicitly
   * passed props win over the computed values. We deliberately forward only
   * x and y (not the anchors): a custom label that spreads its props into a
   * nested Label would otherwise have that Label's own computed anchors
   * overridden by the inherited ones.
   * https://github.com/recharts/recharts/issues/5067
   */
  var propsWithViewBox = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, ((_positionAttrs = positionAttrs) === null || _positionAttrs === void 0 ? void 0 : _positionAttrs.x) !== undefined ? {
    x: positionAttrs.x
  } : {}), ((_positionAttrs2 = positionAttrs) === null || _positionAttrs2 === void 0 ? void 0 : _positionAttrs2.y) !== undefined ? {
    y: positionAttrs.y
  } : {}), props), {}, {
    viewBox
  });
  if (/*#__PURE__*/isValidElement(content)) {
    var _ = propsWithViewBox.labelRef,
      propsWithoutLabelRef = _objectWithoutProperties(propsWithViewBox, _excluded);
    return /*#__PURE__*/cloneElement(content, propsWithoutLabelRef);
  }
  if (typeof content === 'function') {
    var _2 = propsWithViewBox.content,
      propsForContent = _objectWithoutProperties(propsWithViewBox, _excluded2);
    // @ts-expect-error we're not checking if the content component returns something that Text is able to render
    label = /*#__PURE__*/createElement(content, propsForContent);
    if (/*#__PURE__*/isValidElement(label)) {
      return label;
    }
  } else {
    label = getLabel(props);
  }
  var attrs = svgPropertiesAndEvents(props);
  if (isRadialPolarLabel && isPolar(viewBox)) {
    return renderRadialLabel(props, position, label, attrs, viewBox);
  }
  if (positionAttrs == null) {
    return null;
  }
  return /*#__PURE__*/React.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(Text, _extends({
    ref: labelRef,
    className: clsx('recharts-label', className)
  }, attrs, positionAttrs, {
    /*
     * textAnchor is decided by default based on the `position`
     * but we allow overriding via props for precise control.
     */
    textAnchor: isValidTextAnchor(attrs.textAnchor) ? attrs.textAnchor : positionAttrs.textAnchor,
    breakAll: textBreakAll
  }), label));
}
Label.displayName = 'Label';
var parseLabel = (label, viewBox, labelRef) => {
  if (!label) {
    return null;
  }
  var commonProps = {
    viewBox,
    labelRef
  };
  if (label === true) {
    return /*#__PURE__*/React.createElement(Label, _extends({
      key: "label-implicit"
    }, commonProps));
  }
  if (isNumOrStr(label)) {
    return /*#__PURE__*/React.createElement(Label, _extends({
      key: "label-implicit",
      value: label
    }, commonProps));
  }
  if (/*#__PURE__*/isValidElement(label)) {
    if (label.type === Label) {
      return /*#__PURE__*/cloneElement(label, _objectSpread({
        key: 'label-implicit'
      }, commonProps));
    }
    return /*#__PURE__*/React.createElement(Label, _extends({
      key: "label-implicit",
      content: label
    }, commonProps));
  }
  if (isLabelContentAFunction(label)) {
    return /*#__PURE__*/React.createElement(Label, _extends({
      key: "label-implicit",
      content: label
    }, commonProps));
  }
  if (label && typeof label === 'object') {
    return /*#__PURE__*/React.createElement(Label, _extends({}, label, {
      key: "label-implicit"
    }, commonProps));
  }
  return null;
};
export function CartesianLabelFromLabelProp(_ref3) {
  var label = _ref3.label,
    labelRef = _ref3.labelRef;
  var viewBox = useCartesianLabelContext();
  return parseLabel(label, viewBox, labelRef) || null;
}
export function PolarLabelFromLabelProp(_ref4) {
  var label = _ref4.label;
  var viewBox = usePolarLabelContext();
  return parseLabel(label, viewBox) || null;
}