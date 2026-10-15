"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CategoricalChart = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _RootSurface = require("../container/RootSurface");
var _RechartsWrapper = require("./RechartsWrapper");
var _ClipPathProvider = require("../container/ClipPathProvider");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _excluded = ["width", "height", "responsive", "children", "className", "style", "compact", "title", "desc"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var CategoricalChart = exports.CategoricalChart = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var width = props.width,
    height = props.height,
    responsive = props.responsive,
    children = props.children,
    className = props.className,
    style = props.style,
    compact = props.compact,
    title = props.title,
    desc = props.desc,
    others = _objectWithoutProperties(props, _excluded);
  var attrs = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(others);

  /*
   * The "compact" mode is used as the panorama within Brush.
   * However because `compact` is a public prop, let's assume that it can render outside of Brush too.
   */
  if (compact) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartSize, {
      width: width,
      height: height
    }), /*#__PURE__*/React.createElement(_RootSurface.RootSurface, {
      otherAttributes: attrs,
      title: title,
      desc: desc
    }, children));
  }
  return /*#__PURE__*/React.createElement(_RechartsWrapper.RechartsWrapper, {
    className: className,
    style: style,
    width: width,
    height: height,
    responsive: responsive !== null && responsive !== void 0 ? responsive : false,
    onClick: props.onClick,
    onMouseLeave: props.onMouseLeave,
    onMouseEnter: props.onMouseEnter,
    onMouseMove: props.onMouseMove,
    onMouseDown: props.onMouseDown,
    onMouseUp: props.onMouseUp,
    onContextMenu: props.onContextMenu,
    onDoubleClick: props.onDoubleClick,
    onTouchStart: props.onTouchStart,
    onTouchMove: props.onTouchMove,
    onTouchEnd: props.onTouchEnd
  }, /*#__PURE__*/React.createElement(_RootSurface.RootSurface, {
    otherAttributes: attrs,
    title: title,
    desc: desc,
    ref: ref
  }, /*#__PURE__*/React.createElement(_ClipPathProvider.ClipPathProvider, null, children)));
});