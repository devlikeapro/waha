"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RechartsWrapper = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _tooltipSlice = require("../state/tooltipSlice");
var _hooks = require("../state/hooks");
var _mouseEventsMiddleware = require("../state/mouseEventsMiddleware");
var _useChartSynchronisation = require("../synchronisation/useChartSynchronisation");
var _keyboardEventsMiddleware = require("../state/keyboardEventsMiddleware");
var _useReportScale = require("../util/useReportScale");
var _externalEventsMiddleware = require("../state/externalEventsMiddleware");
var _touchEventsMiddleware = require("../state/touchEventsMiddleware");
var _tooltipPortalContext = require("../context/tooltipPortalContext");
var _legendPortalContext = require("../context/legendPortalContext");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _ResponsiveContainer = require("../component/ResponsiveContainer");
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
var EventSynchronizer = () => {
  (0, _useChartSynchronisation.useSynchronisedEventsFromOtherCharts)();
  return null;
};
function getNumberOrZero(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    var parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return 0;
}
var ResponsiveDiv = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var _props$style, _props$style2;
  var observerRef = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)({
      containerWidth: getNumberOrZero((_props$style = props.style) === null || _props$style === void 0 ? void 0 : _props$style.width),
      containerHeight: getNumberOrZero((_props$style2 = props.style) === null || _props$style2 === void 0 ? void 0 : _props$style2.height)
    }),
    _useState2 = _slicedToArray(_useState, 2),
    sizes = _useState2[0],
    setSizes = _useState2[1];
  var setContainerSize = (0, _react.useCallback)((newWidth, newHeight) => {
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
  var innerRef = (0, _react.useCallback)(node => {
    // 1. First, call the external ref if it was provided
    if (typeof ref === 'function') {
      ref(node);
    }

    // 2. Disconnect any previously active ResizeObserver instance to prevent memory leaks
    if (observerRef.current != null) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // 3. Initiate a new ResizeObserver on the valid DOM node
    if (node != null && typeof ResizeObserver !== 'undefined') {
      var _node$getBoundingClie = node.getBoundingClientRect(),
        containerWidth = _node$getBoundingClie.width,
        containerHeight = _node$getBoundingClie.height;
      setContainerSize(containerWidth, containerHeight);
      var callback = entries => {
        var entry = entries[0];
        if (entry == null) {
          return;
        }
        var _entry$contentRect = entry.contentRect,
          width = _entry$contentRect.width,
          height = _entry$contentRect.height;
        setContainerSize(width, height);
      };
      var observer = new ResizeObserver(callback);
      observer.observe(node);
      observerRef.current = observer;
    }
  }, [ref, setContainerSize]);
  (0, _react.useEffect)(() => {
    return () => {
      var observer = observerRef.current;
      if (observer != null) {
        observer.disconnect();
      }
    };
  }, [setContainerSize]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartSize, {
    width: sizes.containerWidth,
    height: sizes.containerHeight
  }), /*#__PURE__*/React.createElement("div", _extends({
    ref: innerRef
  }, props)));
});
var ReadSizeOnceDiv = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var width = props.width,
    height = props.height;
  var _useState3 = (0, _react.useState)({
      containerWidth: getNumberOrZero(width),
      containerHeight: getNumberOrZero(height)
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    sizes = _useState4[0],
    setSizes = _useState4[1];
  var setContainerSize = (0, _react.useCallback)((newWidth, newHeight) => {
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
  var innerRef = (0, _react.useCallback)(node => {
    if (typeof ref === 'function') {
      ref(node);
    }
    if (node != null) {
      var _node$getBoundingClie2 = node.getBoundingClientRect(),
        containerWidth = _node$getBoundingClie2.width,
        containerHeight = _node$getBoundingClie2.height;
      setContainerSize(containerWidth, containerHeight);
    }
  }, [ref, setContainerSize]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartSize, {
    width: sizes.containerWidth,
    height: sizes.containerHeight
  }), /*#__PURE__*/React.createElement("div", _extends({
    ref: innerRef
  }, props)));
});
var StaticDiv = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var width = props.width,
    height = props.height;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartSize, {
    width: width,
    height: height
  }), /*#__PURE__*/React.createElement("div", _extends({
    ref: ref
  }, props)));
});
var NonResponsiveDiv = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var width = props.width,
    height = props.height;
  // When width or height are percentages or CSS short names, read size from DOM once
  if (typeof width === 'string' || typeof height === 'string') {
    return /*#__PURE__*/React.createElement(ReadSizeOnceDiv, _extends({}, props, {
      ref: ref
    }));
  }
  // When both are numbers, use them directly
  if (typeof width === 'number' && typeof height === 'number') {
    return /*#__PURE__*/React.createElement(StaticDiv, _extends({}, props, {
      width: width,
      height: height,
      ref: ref
    }));
  }
  // When width/height are undefined, render wrapper div without reporting size
  // This results in no SVG being rendered (intentional for backwards compatibility)
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartSize, {
    width: width,
    height: height
  }), /*#__PURE__*/React.createElement("div", _extends({
    ref: ref
  }, props)));
});
function getWrapperDivComponent(responsive) {
  return responsive ? ResponsiveDiv : NonResponsiveDiv;
}
var RechartsWrapper = exports.RechartsWrapper = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var children = props.children,
    className = props.className,
    heightFromProps = props.height,
    onClick = props.onClick,
    onContextMenu = props.onContextMenu,
    onDoubleClick = props.onDoubleClick,
    onMouseDown = props.onMouseDown,
    onMouseEnter = props.onMouseEnter,
    onMouseLeave = props.onMouseLeave,
    onMouseMove = props.onMouseMove,
    onMouseUp = props.onMouseUp,
    onTouchEnd = props.onTouchEnd,
    onTouchMove = props.onTouchMove,
    onTouchStart = props.onTouchStart,
    style = props.style,
    widthFromProps = props.width,
    responsive = props.responsive,
    _props$dispatchTouchE = props.dispatchTouchEvents,
    dispatchTouchEvents = _props$dispatchTouchE === void 0 ? true : _props$dispatchTouchE;
  var containerRef = (0, _react.useRef)(null);
  var dispatch = (0, _hooks.useAppDispatch)();
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    tooltipPortal = _useState6[0],
    setTooltipPortal = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    legendPortal = _useState8[0],
    setLegendPortal = _useState8[1];
  var setScaleRef = (0, _useReportScale.useReportScale)();
  var responsiveContainerCalculations = (0, _ResponsiveContainer.useResponsiveContainerContext)();
  var width = (responsiveContainerCalculations === null || responsiveContainerCalculations === void 0 ? void 0 : responsiveContainerCalculations.width) > 0 ? responsiveContainerCalculations.width : widthFromProps;
  var height = (responsiveContainerCalculations === null || responsiveContainerCalculations === void 0 ? void 0 : responsiveContainerCalculations.height) > 0 ? responsiveContainerCalculations.height : heightFromProps;
  var innerRef = (0, _react.useCallback)(node => {
    setScaleRef(node);
    if (typeof ref === 'function') {
      ref(node);
    }
    setTooltipPortal(node);
    setLegendPortal(node);
    if (node != null) {
      containerRef.current = node;
    }
  }, [setScaleRef, ref, setTooltipPortal, setLegendPortal]);
  var myOnClick = (0, _react.useCallback)(e => {
    dispatch((0, _mouseEventsMiddleware.mouseClickAction)(e));
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onClick,
      reactEvent: e
    }));
  }, [dispatch, onClick]);
  var myOnMouseEnter = (0, _react.useCallback)(e => {
    dispatch((0, _mouseEventsMiddleware.mouseMoveAction)(e));
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onMouseEnter,
      reactEvent: e
    }));
  }, [dispatch, onMouseEnter]);
  var myOnMouseLeave = (0, _react.useCallback)(e => {
    dispatch((0, _tooltipSlice.mouseLeaveChart)());
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onMouseLeave,
      reactEvent: e
    }));
  }, [dispatch, onMouseLeave]);
  var myOnMouseMove = (0, _react.useCallback)(e => {
    dispatch((0, _mouseEventsMiddleware.mouseMoveAction)(e));
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onMouseMove,
      reactEvent: e
    }));
  }, [dispatch, onMouseMove]);
  var onFocus = (0, _react.useCallback)(() => {
    dispatch((0, _keyboardEventsMiddleware.focusAction)());
  }, [dispatch]);
  var onBlur = (0, _react.useCallback)(() => {
    dispatch((0, _keyboardEventsMiddleware.blurAction)());
  }, [dispatch]);
  var onKeyDown = (0, _react.useCallback)(e => {
    dispatch((0, _keyboardEventsMiddleware.keyDownAction)(e.key));
  }, [dispatch]);
  var myOnContextMenu = (0, _react.useCallback)(e => {
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onContextMenu,
      reactEvent: e
    }));
  }, [dispatch, onContextMenu]);
  var myOnDoubleClick = (0, _react.useCallback)(e => {
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onDoubleClick,
      reactEvent: e
    }));
  }, [dispatch, onDoubleClick]);
  var myOnMouseDown = (0, _react.useCallback)(e => {
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onMouseDown,
      reactEvent: e
    }));
  }, [dispatch, onMouseDown]);
  var myOnMouseUp = (0, _react.useCallback)(e => {
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onMouseUp,
      reactEvent: e
    }));
  }, [dispatch, onMouseUp]);
  var myOnTouchStart = (0, _react.useCallback)(e => {
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onTouchStart,
      reactEvent: e
    }));
  }, [dispatch, onTouchStart]);

  /*
   * onTouchMove is special because it behaves different from mouse events.
   * Mouse events have 'enter' + 'leave' combo that notify us when the mouse is over
   * a certain element. Touch events don't have that; touch only gives us
   * start (finger down), end (finger up) and move (finger moving).
   * So we need to figure out which element the user is touching
   * ourselves. Fortunately, there's a convenient method for that:
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint
   */
  var myOnTouchMove = (0, _react.useCallback)(e => {
    if (dispatchTouchEvents) {
      dispatch((0, _touchEventsMiddleware.touchEventAction)(e));
    }
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onTouchMove,
      reactEvent: e
    }));
  }, [dispatch, dispatchTouchEvents, onTouchMove]);
  var myOnTouchEnd = (0, _react.useCallback)(e => {
    dispatch((0, _externalEventsMiddleware.externalEventAction)({
      handler: onTouchEnd,
      reactEvent: e
    }));
  }, [dispatch, onTouchEnd]);
  var WrapperDiv = getWrapperDivComponent(responsive);
  return /*#__PURE__*/React.createElement(_tooltipPortalContext.TooltipPortalContext.Provider, {
    value: tooltipPortal
  }, /*#__PURE__*/React.createElement(_legendPortalContext.LegendPortalContext.Provider, {
    value: legendPortal
  }, /*#__PURE__*/React.createElement(WrapperDiv, {
    width: width !== null && width !== void 0 ? width : style === null || style === void 0 ? void 0 : style.width,
    height: height !== null && height !== void 0 ? height : style === null || style === void 0 ? void 0 : style.height,
    className: (0, _clsx.clsx)('recharts-wrapper', className),
    style: _objectSpread({
      position: 'relative',
      cursor: 'default',
      width,
      height
    }, style),
    onClick: myOnClick,
    onContextMenu: myOnContextMenu,
    onDoubleClick: myOnDoubleClick,
    onFocus: onFocus,
    onBlur: onBlur,
    onKeyDown: onKeyDown,
    onMouseDown: myOnMouseDown,
    onMouseEnter: myOnMouseEnter,
    onMouseLeave: myOnMouseLeave,
    onMouseMove: myOnMouseMove,
    onMouseUp: myOnMouseUp,
    onTouchEnd: myOnTouchEnd,
    onTouchMove: myOnTouchMove,
    onTouchStart: myOnTouchStart,
    ref: innerRef
  }, /*#__PURE__*/React.createElement(EventSynchronizer, null), children)));
});