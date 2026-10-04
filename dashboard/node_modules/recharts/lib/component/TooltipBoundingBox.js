"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TooltipBoundingBox = void 0;
var React = _interopRequireWildcard(require("react"));
var _translate = require("../util/tooltip/translate");
var _usePrefersReducedMotion = require("../util/usePrefersReducedMotion");
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
function resolveTransitionProperty(args) {
  if (args.prefersReducedMotion && args.isAnimationActive === 'auto') {
    return undefined;
  }
  if (args.isAnimationActive && args.active) {
    var easing = typeof args.animationEasing === 'string' ? args.animationEasing : 'ease';
    return "transform ".concat(args.animationDuration, "ms ").concat(easing);
  }
  return undefined;
}
function TooltipBoundingBoxImpl(props) {
  var _props$coordinate3, _props$coordinate4, _props$coordinate$x2, _props$coordinate5, _props$coordinate$y2, _props$coordinate6;
  var prefersReducedMotion = (0, _usePrefersReducedMotion.usePrefersReducedMotion)();
  var _React$useState = React.useState(() => ({
      dismissed: false,
      dismissedAtCoordinate: {
        x: 0,
        y: 0
      }
    })),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    state = _React$useState2[0],
    setState = _React$useState2[1];
  React.useEffect(() => {
    var handleKeyDown = event => {
      if (event.key === 'Escape') {
        var _props$coordinate$x, _props$coordinate, _props$coordinate$y, _props$coordinate2;
        setState({
          dismissed: true,
          dismissedAtCoordinate: {
            x: (_props$coordinate$x = (_props$coordinate = props.coordinate) === null || _props$coordinate === void 0 ? void 0 : _props$coordinate.x) !== null && _props$coordinate$x !== void 0 ? _props$coordinate$x : 0,
            y: (_props$coordinate$y = (_props$coordinate2 = props.coordinate) === null || _props$coordinate2 === void 0 ? void 0 : _props$coordinate2.y) !== null && _props$coordinate$y !== void 0 ? _props$coordinate$y : 0
          }
        });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [(_props$coordinate3 = props.coordinate) === null || _props$coordinate3 === void 0 ? void 0 : _props$coordinate3.x, (_props$coordinate4 = props.coordinate) === null || _props$coordinate4 === void 0 ? void 0 : _props$coordinate4.y]);
  if (state.dismissed && (((_props$coordinate$x2 = (_props$coordinate5 = props.coordinate) === null || _props$coordinate5 === void 0 ? void 0 : _props$coordinate5.x) !== null && _props$coordinate$x2 !== void 0 ? _props$coordinate$x2 : 0) !== state.dismissedAtCoordinate.x || ((_props$coordinate$y2 = (_props$coordinate6 = props.coordinate) === null || _props$coordinate6 === void 0 ? void 0 : _props$coordinate6.y) !== null && _props$coordinate$y2 !== void 0 ? _props$coordinate$y2 : 0) !== state.dismissedAtCoordinate.y)) {
    setState(_objectSpread(_objectSpread({}, state), {}, {
      dismissed: false
    }));
  }
  var _getTooltipTranslate = (0, _translate.getTooltipTranslate)({
      allowEscapeViewBox: props.allowEscapeViewBox,
      coordinate: props.coordinate,
      offsetLeft: typeof props.offset === 'number' ? props.offset : props.offset.x,
      offsetTop: typeof props.offset === 'number' ? props.offset : props.offset.y,
      position: props.position,
      reverseDirection: props.reverseDirection,
      tooltipBox: props.lastBoundingBox,
      useTranslate3d: props.useTranslate3d,
      viewBox: props.viewBox
    }),
    cssClasses = _getTooltipTranslate.cssClasses,
    cssProperties = _getTooltipTranslate.cssProperties;
  var positionStyle = props.hasPortalFromProps ? {} : _objectSpread(_objectSpread({
    transition: resolveTransitionProperty({
      prefersReducedMotion,
      isAnimationActive: props.isAnimationActive,
      active: props.active,
      animationDuration: props.animationDuration,
      animationEasing: props.animationEasing
    })
  }, cssProperties), {}, {
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    left: 0
  });
  var outerStyle = _objectSpread(_objectSpread({}, positionStyle), {}, {
    visibility: !state.dismissed && props.active && props.hasPayload ? 'visible' : 'hidden'
  }, props.wrapperStyle);
  return /*#__PURE__*/React.createElement("div", {
    // @ts-expect-error TypeScript library does not recognize xmlns attribute, but it's required for an HTML chunk inside SVG.
    xmlns: "http://www.w3.org/1999/xhtml",
    tabIndex: -1,
    className: cssClasses,
    style: outerStyle,
    ref: props.innerRef
  }, props.children);
}
var TooltipBoundingBox = exports.TooltipBoundingBox = /*#__PURE__*/React.memo(TooltipBoundingBoxImpl);