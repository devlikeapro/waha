"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultLegendContentDefaultProps = exports.DefaultLegendContent = void 0;
var React = _interopRequireWildcard(require("react"));
var _clsx = require("clsx");
var _Surface = require("../container/Surface");
var _Symbols = require("../shape/Symbols");
var _types = require("../util/types");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SIZE = 32;
var defaultLegendContentDefaultProps = exports.defaultLegendContentDefaultProps = {
  align: 'center',
  iconSize: 14,
  inactiveColor: '#ccc',
  layout: 'horizontal',
  verticalAlign: 'middle',
  labelStyle: {}
};
function getStrokeDasharray(input) {
  if (typeof input === 'object' && input !== null && 'strokeDasharray' in input) {
    return String(input.strokeDasharray);
  }
  return undefined;
}
function Icon(_ref) {
  var data = _ref.data,
    iconType = _ref.iconType,
    inactiveColor = _ref.inactiveColor;
  var halfSize = SIZE / 2;
  var sixthSize = SIZE / 6;
  var thirdSize = SIZE / 3;
  var color = data.inactive ? inactiveColor : data.color;
  var preferredIcon = iconType !== null && iconType !== void 0 ? iconType : data.type;
  if (preferredIcon === 'none') {
    return null;
  }
  if (preferredIcon === 'plainline') {
    return /*#__PURE__*/React.createElement("line", {
      strokeWidth: 4,
      fill: "none",
      stroke: color,
      strokeDasharray: getStrokeDasharray(data.payload),
      x1: 0,
      y1: halfSize,
      x2: SIZE,
      y2: halfSize,
      className: "recharts-legend-icon"
    });
  }
  if (preferredIcon === 'line') {
    return /*#__PURE__*/React.createElement("path", {
      strokeWidth: 4,
      fill: "none",
      stroke: color,
      d: "M0,".concat(halfSize, "h").concat(thirdSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(2 * thirdSize, ",").concat(halfSize, "\n            H").concat(SIZE, "M").concat(2 * thirdSize, ",").concat(halfSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(thirdSize, ",").concat(halfSize),
      className: "recharts-legend-icon"
    });
  }
  if (preferredIcon === 'rect') {
    return /*#__PURE__*/React.createElement("path", {
      stroke: "none",
      fill: color,
      d: "M0,".concat(SIZE / 8, "h").concat(SIZE, "v").concat(SIZE * 3 / 4, "h").concat(-SIZE, "z"),
      className: "recharts-legend-icon"
    });
  }
  if (/*#__PURE__*/React.isValidElement(data.legendIcon)) {
    var iconProps = _objectSpread({}, data);
    delete iconProps.legendIcon;
    return /*#__PURE__*/React.cloneElement(data.legendIcon, iconProps);
  }
  return /*#__PURE__*/React.createElement(_Symbols.Symbols, {
    fill: color,
    cx: halfSize,
    cy: halfSize,
    size: SIZE,
    sizeType: "diameter",
    type: preferredIcon
  });
}
function Items(props) {
  var payload = props.payload,
    iconSize = props.iconSize,
    layout = props.layout,
    formatter = props.formatter,
    inactiveColor = props.inactiveColor,
    iconType = props.iconType,
    labelStyle = props.labelStyle;
  var viewBox = {
    x: 0,
    y: 0,
    width: SIZE,
    height: SIZE
  };
  var itemStyle = {
    display: layout === 'horizontal' ? 'inline-block' : 'block',
    marginRight: 10,
    whiteSpace: 'nowrap'
  };
  var svgStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: 4
  };
  return payload.map((entry, i) => {
    var _finalLabelStyle$whit, _finalLabelStyle$over;
    var finalFormatter = entry.formatter || formatter;
    var className = (0, _clsx.clsx)({
      'recharts-legend-item': true,
      ["legend-item-".concat(i)]: true,
      inactive: entry.inactive
    });
    if (entry.type === 'none') {
      return null;
    }
    var finalLabelStyle = typeof labelStyle === 'object' ? _objectSpread({}, labelStyle) : {};
    finalLabelStyle.color = entry.inactive ? inactiveColor : finalLabelStyle.color || entry.color;
    (_finalLabelStyle$whit = finalLabelStyle.whiteSpace) !== null && _finalLabelStyle$whit !== void 0 ? _finalLabelStyle$whit : finalLabelStyle.whiteSpace = 'normal';
    (_finalLabelStyle$over = finalLabelStyle.overflowWrap) !== null && _finalLabelStyle$over !== void 0 ? _finalLabelStyle$over : finalLabelStyle.overflowWrap = 'break-word';
    var finalValue = finalFormatter ? finalFormatter(entry.value, entry, i) : entry.value;
    return /*#__PURE__*/React.createElement("li", _extends({
      className: className,
      style: itemStyle,
      key: "legend-item-".concat(i)
    }, (0, _types.adaptEventsOfChild)(props, entry, i)), /*#__PURE__*/React.createElement(_Surface.Surface, {
      width: iconSize,
      height: iconSize,
      viewBox: viewBox,
      style: svgStyle,
      "aria-label": entry.value == null ? 'legend icon' : "".concat(entry.value, " legend icon")
    }, /*#__PURE__*/React.createElement(Icon, {
      data: entry,
      iconType: iconType,
      inactiveColor: inactiveColor
    })), /*#__PURE__*/React.createElement("span", {
      className: "recharts-legend-item-text",
      style: finalLabelStyle
    }, finalValue));
  });
}

/**
 * This component is by default rendered inside the {@link Legend} component. You would not use it directly.
 *
 * You can use this component to customize the content of the legend,
 * or you can provide your own completely independent content.
 */
var DefaultLegendContent = outsideProps => {
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, defaultLegendContentDefaultProps);
  var payload = props.payload,
    layout = props.layout,
    align = props.align;
  if (!payload || !payload.length) {
    return null;
  }
  var finalStyle = {
    padding: 0,
    margin: 0,
    textAlign: layout === 'horizontal' ? align : 'left'
  };
  return /*#__PURE__*/React.createElement("ul", {
    className: "recharts-default-legend",
    style: finalStyle
  }, /*#__PURE__*/React.createElement(Items, _extends({}, props, {
    payload: payload
  })));
};
exports.DefaultLegendContent = DefaultLegendContent;