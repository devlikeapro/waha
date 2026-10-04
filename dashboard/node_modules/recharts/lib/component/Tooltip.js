"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tooltip = Tooltip;
exports.defaultTooltipProps = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _reactDom = require("react-dom");
var _DefaultTooltipContent = require("./DefaultTooltipContent");
var _TooltipBoundingBox = require("./TooltipBoundingBox");
var _getUniqPayload = require("../util/payload/getUniqPayload");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _accessibilityContext = require("../context/accessibilityContext");
var _useElementOffset3 = require("../util/useElementOffset");
var _Cursor = require("./Cursor");
var _selectors = require("../state/selectors/selectors");
var _tooltipPortalContext = require("../context/tooltipPortalContext");
var _hooks = require("../state/hooks");
var _tooltipSlice = require("../state/tooltipSlice");
var _useChartSynchronisation = require("../synchronisation/useChartSynchronisation");
var _selectTooltipEventType = require("../state/selectors/selectTooltipEventType");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
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
function defaultUniqBy(entry) {
  return entry.dataKey;
}
function renderContent(content, props) {
  if (/*#__PURE__*/React.isValidElement(content)) {
    return /*#__PURE__*/React.cloneElement(content, props);
  }
  if (typeof content === 'function') {
    return /*#__PURE__*/React.createElement(content, props);
  }
  return /*#__PURE__*/React.createElement(_DefaultTooltipContent.DefaultTooltipContent, props);
}
var emptyPayload = [];
var defaultTooltipProps = exports.defaultTooltipProps = {
  allowEscapeViewBox: {
    x: false,
    y: false
  },
  animationDuration: 400,
  animationEasing: 'ease',
  axisId: 0,
  contentStyle: {},
  cursor: true,
  filterNull: true,
  includeHidden: false,
  isAnimationActive: 'auto',
  itemSorter: 'name',
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: {
    x: false,
    y: false
  },
  separator: ' : ',
  trigger: 'hover',
  useTranslate3d: false,
  wrapperStyle: {}
};

/**
 * The Tooltip component displays a floating box with data values when hovering over or clicking on chart elements.
 *
 * It can be configured to show information for individual data points or for all points at a specific axis coordinate.
 * The appearance and content of the tooltip can be customized via props.
 *
 * @see {@link https://github.com/recharts/recharts/wiki/Tooltip-event-type-and-shared-prop Tooltip event type and shared prop wiki page}
 * @see {@link https://recharts.github.io/en-US/guide/activeIndex/ Active index replacement when migrating from Recharts v2 to v3}
 *
 * @consumes CartesianChartContext
 * @consumes PolarChartContext
 * @consumes TooltipEntrySettings
 */
function Tooltip(outsideProps) {
  var _useAppSelector, _ref2;
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, defaultTooltipProps);
  var activeFromProps = props.active,
    allowEscapeViewBox = props.allowEscapeViewBox,
    animationDuration = props.animationDuration,
    animationEasing = props.animationEasing,
    content = props.content,
    filterNull = props.filterNull,
    isAnimationActive = props.isAnimationActive,
    offset = props.offset,
    payloadUniqBy = props.payloadUniqBy,
    position = props.position,
    reverseDirection = props.reverseDirection,
    useTranslate3d = props.useTranslate3d,
    wrapperStyle = props.wrapperStyle,
    cursor = props.cursor,
    shared = props.shared,
    trigger = props.trigger,
    defaultIndex = props.defaultIndex,
    portalFromProps = props.portal,
    axisId = props.axisId;
  var dispatch = (0, _hooks.useAppDispatch)();
  var defaultIndexAsString = typeof defaultIndex === 'number' ? String(defaultIndex) : defaultIndex;
  (0, _react.useEffect)(() => {
    dispatch((0, _tooltipSlice.setTooltipSettingsState)({
      shared,
      trigger,
      axisId,
      active: activeFromProps,
      defaultIndex: defaultIndexAsString
    }));
  }, [dispatch, shared, trigger, axisId, activeFromProps, defaultIndexAsString]);
  var viewBox = (0, _chartLayoutContext.useViewBox)();
  var accessibilityLayer = (0, _accessibilityContext.useAccessibilityLayer)();
  var tooltipEventType = (0, _selectTooltipEventType.useTooltipEventType)(shared);
  var _ref = (_useAppSelector = (0, _hooks.useAppSelector)(state => (0, _selectors.selectIsTooltipActive)(state, tooltipEventType, trigger, defaultIndexAsString))) !== null && _useAppSelector !== void 0 ? _useAppSelector : {},
    activeIndex = _ref.activeIndex,
    isActive = _ref.isActive;
  var payloadFromRedux = (0, _hooks.useAppSelector)(state => (0, _selectors.selectTooltipPayload)(state, tooltipEventType, trigger, defaultIndexAsString));
  var labelFromRedux = (0, _hooks.useAppSelector)(state => (0, _selectors.selectActiveLabel)(state, tooltipEventType, trigger, defaultIndexAsString));
  var coordinate = (0, _hooks.useAppSelector)(state => (0, _selectors.selectActiveCoordinate)(state, tooltipEventType, trigger, defaultIndexAsString));
  var payload = payloadFromRedux;
  var tooltipPortalFromContext = (0, _tooltipPortalContext.useTooltipPortal)();
  /*
   * The user can set `active=true` on the Tooltip in which case the Tooltip will stay always active,
   * or `active=false` in which case the Tooltip never shows.
   *
   * If the `active` prop is not defined then it will show and hide based on mouse or keyboard activity.
   */
  var finalIsActive = (_ref2 = activeFromProps !== null && activeFromProps !== void 0 ? activeFromProps : isActive) !== null && _ref2 !== void 0 ? _ref2 : false;
  var _useElementOffset = (0, _useElementOffset3.useElementOffset)([payload, finalIsActive]),
    _useElementOffset2 = _slicedToArray(_useElementOffset, 2),
    lastBoundingBox = _useElementOffset2[0],
    updateBoundingBox = _useElementOffset2[1];
  var finalLabel = tooltipEventType === 'axis' ? labelFromRedux : undefined;
  (0, _useChartSynchronisation.useTooltipChartSynchronisation)(tooltipEventType, trigger, coordinate, finalLabel, activeIndex, finalIsActive);
  var tooltipPortal = portalFromProps !== null && portalFromProps !== void 0 ? portalFromProps : tooltipPortalFromContext;
  if (tooltipPortal == null || viewBox == null || tooltipEventType == null) {
    return null;
  }
  var finalPayload = payload !== null && payload !== void 0 ? payload : emptyPayload;
  if (!finalIsActive) {
    finalPayload = emptyPayload;
  }
  if (filterNull && finalPayload.length) {
    finalPayload = (0, _getUniqPayload.getUniqPayload)(finalPayload.filter(entry => entry.value != null && (entry.hide !== true || props.includeHidden)), payloadUniqBy, defaultUniqBy);
  }
  var hasPayload = finalPayload.length > 0;
  var tooltipContentProps = _objectSpread(_objectSpread({}, props), {}, {
    payload: finalPayload,
    label: finalLabel,
    active: finalIsActive,
    activeIndex,
    coordinate,
    accessibilityLayer
  });
  var tooltipElement = /*#__PURE__*/React.createElement(_TooltipBoundingBox.TooltipBoundingBox, {
    allowEscapeViewBox: allowEscapeViewBox,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive,
    active: finalIsActive,
    coordinate: coordinate,
    hasPayload: hasPayload,
    offset: offset,
    position: position,
    reverseDirection: reverseDirection,
    useTranslate3d: useTranslate3d,
    viewBox: viewBox,
    wrapperStyle: wrapperStyle,
    lastBoundingBox: lastBoundingBox,
    innerRef: updateBoundingBox,
    hasPortalFromProps: Boolean(portalFromProps)
  }, renderContent(content, tooltipContentProps));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/(0, _reactDom.createPortal)(tooltipElement, tooltipPortal), finalIsActive && /*#__PURE__*/React.createElement(_Cursor.Cursor, {
    cursor: cursor,
    tooltipEventType: tooltipEventType,
    coordinate: coordinate,
    payload: finalPayload,
    index: activeIndex
  }));
}