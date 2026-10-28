var _excluded = ["aspect", "initialDimension", "width", "height", "minWidth", "minHeight", "maxHeight", "children", "debounce", "id", "className", "onResize", "style"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import { clsx } from 'clsx';
import * as React from 'react';
import { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import throttle from 'es-toolkit/compat/throttle';
import { isNumber, noop } from '../util/DataUtils';
import { warn } from '../util/LogUtils';
import { calculateChartDimensions, defaultResponsiveContainerProps, getDefaultWidthAndHeight, getInnerDivStyle } from './responsiveContainerUtils';
import { isPositiveNumber } from '../util/isWellBehavedNumber';
var ResponsiveContainerContext = /*#__PURE__*/createContext(defaultResponsiveContainerProps.initialDimension);
function isAcceptableSize(size) {
  return isPositiveNumber(size.width) && isPositiveNumber(size.height);
}
function ResponsiveContainerContextProvider(_ref) {
  var children = _ref.children,
    width = _ref.width,
    height = _ref.height;
  var size = useMemo(() => ({
    width,
    height
  }), [width, height]);
  if (!isAcceptableSize(size)) {
    /*
     * Don't render the container if width or height is non-positive because
     * in that case the chart will not be rendered properly anyway.
     * We will instead wait for the next resize event to provide the correct dimensions.
     */
    return null;
  }
  return /*#__PURE__*/React.createElement(ResponsiveContainerContext.Provider, {
    value: size
  }, children);
}
export var useResponsiveContainerContext = () => useContext(ResponsiveContainerContext);
var SizeDetectorContainer = /*#__PURE__*/forwardRef((_ref2, ref) => {
  var aspect = _ref2.aspect,
    _ref2$initialDimensio = _ref2.initialDimension,
    initialDimension = _ref2$initialDimensio === void 0 ? defaultResponsiveContainerProps.initialDimension : _ref2$initialDimensio,
    width = _ref2.width,
    height = _ref2.height,
    _ref2$minWidth = _ref2.minWidth,
    minWidth = _ref2$minWidth === void 0 ? defaultResponsiveContainerProps.minWidth : _ref2$minWidth,
    minHeight = _ref2.minHeight,
    maxHeight = _ref2.maxHeight,
    children = _ref2.children,
    _ref2$debounce = _ref2.debounce,
    debounce = _ref2$debounce === void 0 ? defaultResponsiveContainerProps.debounce : _ref2$debounce,
    id = _ref2.id,
    className = _ref2.className,
    onResize = _ref2.onResize,
    _ref2$style = _ref2.style,
    style = _ref2$style === void 0 ? {} : _ref2$style,
    others = _objectWithoutProperties(_ref2, _excluded);
  var containerRef = useRef(null);
  /*
   * We are using a ref to avoid re-creating the ResizeObserver when the onResize function changes.
   * The ref is updated on every render, so the latest onResize function is always available in the effect.
   */
  var onResizeRef = useRef();
  onResizeRef.current = onResize;
  useImperativeHandle(ref, () => containerRef.current);
  var _useState = useState({
      containerWidth: initialDimension.width,
      containerHeight: initialDimension.height
    }),
    _useState2 = _slicedToArray(_useState, 2),
    sizes = _useState2[0],
    setSizes = _useState2[1];
  var setContainerSize = useCallback((newWidth, newHeight) => {
    setSizes(prevState => {
      var roundedWidth = Math.round(newWidth);
      var roundedHeight = Math.round(newHeight);
      if (prevState.containerWidth === roundedWidth && prevState.containerHeight === roundedHeight) {
        return prevState;
      }
      return {
        containerWidth: roundedWidth,
        containerHeight: roundedHeight
      };
    });
  }, []);
  useEffect(() => {
    if (containerRef.current == null || typeof ResizeObserver === 'undefined') {
      return noop;
    }
    var callback = entries => {
      var _onResizeRef$current;
      var entry = entries[0];
      if (entry == null) {
        return;
      }
      var _entry$contentRect = entry.contentRect,
        containerWidth = _entry$contentRect.width,
        containerHeight = _entry$contentRect.height;
      setContainerSize(containerWidth, containerHeight);
      (_onResizeRef$current = onResizeRef.current) === null || _onResizeRef$current === void 0 || _onResizeRef$current.call(onResizeRef, containerWidth, containerHeight);
    };
    if (debounce > 0) {
      callback = throttle(callback, debounce, {
        trailing: true,
        leading: false
      });
    }
    var observer = new ResizeObserver(callback);
    var _containerRef$current = containerRef.current.getBoundingClientRect(),
      containerWidth = _containerRef$current.width,
      containerHeight = _containerRef$current.height;
    setContainerSize(containerWidth, containerHeight);
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [setContainerSize, debounce]);
  var containerWidth = sizes.containerWidth,
    containerHeight = sizes.containerHeight;
  warn(!aspect || aspect > 0, 'The aspect(%s) must be greater than zero.', aspect);
  var _calculateChartDimens = calculateChartDimensions(containerWidth, containerHeight, {
      width,
      height,
      aspect,
      maxHeight
    }),
    calculatedWidth = _calculateChartDimens.calculatedWidth,
    calculatedHeight = _calculateChartDimens.calculatedHeight;
  warn(containerWidth < 0 || containerHeight < 0 || calculatedWidth != null && calculatedWidth > 0 || calculatedHeight != null && calculatedHeight > 0, "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.", calculatedWidth, calculatedHeight, width, height, minWidth, minHeight, aspect);
  return /*#__PURE__*/React.createElement("div", _extends({
    id: id ? "".concat(id) : undefined,
    className: clsx('recharts-responsive-container', className),
    style: _objectSpread(_objectSpread({}, style), {}, {
      width,
      height,
      minWidth,
      minHeight,
      maxHeight
    }),
    ref: containerRef
  }, others), /*#__PURE__*/React.createElement("div", {
    style: getInnerDivStyle({
      width,
      height
    })
  }, /*#__PURE__*/React.createElement(ResponsiveContainerContextProvider, {
    width: calculatedWidth,
    height: calculatedHeight
  }, children)));
});

/**
 * The `ResponsiveContainer` component is a container that adjusts its width and height based on the size of its parent element.
 * It is used to create responsive charts that adapt to different screen sizes.
 *
 * This component uses the {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver ResizeObserver} API to monitor changes to the size of its parent element.
 * If you need to support older browsers that do not support this API, you may need to include a polyfill.
 *
 * @see {@link https://recharts.github.io/en-US/guide/sizes/ Chart size guide}
 *
 * @provides ResponsiveContainerContext
 */
export var ResponsiveContainer = /*#__PURE__*/forwardRef((props, ref) => {
  var responsiveContainerContext = useResponsiveContainerContext();
  if (isPositiveNumber(responsiveContainerContext.width) && isPositiveNumber(responsiveContainerContext.height)) {
    /*
     * If we detect that we are already inside another ResponsiveContainer,
     * we do not attempt to add another layer of responsiveness.
     */
    return props.children;
  }
  var _getDefaultWidthAndHe = getDefaultWidthAndHeight({
      width: props.width,
      height: props.height,
      aspect: props.aspect
    }),
    width = _getDefaultWidthAndHe.width,
    height = _getDefaultWidthAndHe.height;

  /*
   * Let's try to get the calculated dimensions without having the div container set up.
   * Sometimes this does produce fixed, positive dimensions. If so, we can skip rendering the div and monitoring its size.
   */
  var _calculateChartDimens2 = calculateChartDimensions(undefined, undefined, {
      width,
      height,
      aspect: props.aspect,
      maxHeight: props.maxHeight
    }),
    calculatedWidth = _calculateChartDimens2.calculatedWidth,
    calculatedHeight = _calculateChartDimens2.calculatedHeight;
  if (isNumber(calculatedWidth) && isNumber(calculatedHeight)) {
    /*
     * If it just so happens that the combination of width, height, and aspect ratio
     * results in fixed dimensions, then we don't need to monitor the container's size.
     * We can just provide these fixed dimensions to the context.
     *
     * Note that here we are not checking for positive numbers;
     * if the user provides a zero or negative width/height, we will just pass that along
     * as whatever size we detect won't be helping anyway.
     */
    return /*#__PURE__*/React.createElement(ResponsiveContainerContextProvider, {
      width: calculatedWidth,
      height: calculatedHeight
    }, props.children);
  }
  /*
   * Static analysis did not produce fixed dimensions,
   * so we need to render a special div and monitor its size.
   */
  return /*#__PURE__*/React.createElement(SizeDetectorContainer, _extends({}, props, {
    width: width,
    height: height,
    ref: ref
  }));
});