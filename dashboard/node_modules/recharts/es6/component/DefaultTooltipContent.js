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
/**
 * @fileOverview Default Tooltip Content
 */

import * as React from 'react';
import sortBy from 'es-toolkit/compat/sortBy';
import { clsx } from 'clsx';
import { isNullish, isNumOrStr } from '../util/DataUtils';
function defaultFormatter(value) {
  return Array.isArray(value) && isNumOrStr(value[0]) && isNumOrStr(value[1]) ? value.join(' ~ ') : value;
}

/**
 * @inline
 */

export var defaultDefaultTooltipContentProps = {
  separator: ' : ',
  contentStyle: {
    margin: 0,
    padding: 10,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    whiteSpace: 'nowrap'
  },
  itemStyle: {
    display: 'block',
    paddingTop: 4,
    paddingBottom: 4,
    color: '#000'
  },
  labelStyle: {},
  accessibilityLayer: false
};
function lodashLikeSortBy(array, itemSorter) {
  if (itemSorter == null) {
    return array;
  }
  // @ts-expect-error sortBy types somehow are returning a number type.
  return sortBy(array, itemSorter);
}

/**
 * This component is by default rendered inside the {@link Tooltip} component. You would not use it directly.
 *
 * You can use this component to customize the content of the tooltip,
 * or you can provide your own completely independent content.
 */
export var DefaultTooltipContent = props => {
  var _props$separator = props.separator,
    separator = _props$separator === void 0 ? defaultDefaultTooltipContentProps.separator : _props$separator,
    contentStyle = props.contentStyle,
    itemStyle = props.itemStyle,
    _props$labelStyle = props.labelStyle,
    labelStyle = _props$labelStyle === void 0 ? defaultDefaultTooltipContentProps.labelStyle : _props$labelStyle,
    payload = props.payload,
    formatter = props.formatter,
    itemSorter = props.itemSorter,
    wrapperClassName = props.wrapperClassName,
    labelClassName = props.labelClassName,
    label = props.label,
    labelFormatter = props.labelFormatter,
    _props$accessibilityL = props.accessibilityLayer,
    accessibilityLayer = _props$accessibilityL === void 0 ? defaultDefaultTooltipContentProps.accessibilityLayer : _props$accessibilityL;
  var renderContent = () => {
    if (payload && payload.length) {
      var listStyle = {
        padding: 0,
        margin: 0
      };
      var sortedPayload = lodashLikeSortBy(payload, itemSorter);
      var items = sortedPayload.map((entry, i) => {
        if (!entry || entry.type === 'none') {
          return null;
        }
        var finalFormatter = entry.formatter || formatter || defaultFormatter;
        var value = entry.value,
          name = entry.name;
        var finalValue = value;
        var finalName = name;
        if (finalFormatter) {
          var formatted = finalFormatter(value, name, entry, i, payload);
          if (Array.isArray(formatted)) {
            var _formatted = _slicedToArray(formatted, 2);
            finalValue = _formatted[0];
            finalName = _formatted[1];
          } else if (formatted != null) {
            finalValue = formatted;
          } else {
            return null;
          }
        }
        var finalItemStyle = _objectSpread(_objectSpread({}, defaultDefaultTooltipContentProps.itemStyle), {}, {
          color: entry.color || defaultDefaultTooltipContentProps.itemStyle.color
        }, itemStyle);
        return /*#__PURE__*/React.createElement("li", {
          className: "recharts-tooltip-item",
          key: "tooltip-item-".concat(i),
          style: finalItemStyle
        }, isNumOrStr(finalName) ? /*#__PURE__*/React.createElement("span", {
          className: "recharts-tooltip-item-name"
        }, finalName) : null, isNumOrStr(finalName) ? /*#__PURE__*/React.createElement("span", {
          className: "recharts-tooltip-item-separator"
        }, separator) : null, /*#__PURE__*/React.createElement("span", {
          className: "recharts-tooltip-item-value"
        }, finalValue), /*#__PURE__*/React.createElement("span", {
          className: "recharts-tooltip-item-unit"
        }, entry.unit || ''));
      });
      return /*#__PURE__*/React.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: listStyle
      }, items);
    }
    return null;
  };
  var finalStyle = _objectSpread(_objectSpread({}, defaultDefaultTooltipContentProps.contentStyle), contentStyle);
  var finalLabelStyle = _objectSpread({
    margin: 0
  }, labelStyle);
  var hasLabel = !isNullish(label);
  var finalLabel = hasLabel ? label : '';
  var wrapperCN = clsx('recharts-default-tooltip', wrapperClassName);
  var labelCN = clsx('recharts-tooltip-label', labelClassName);
  if (hasLabel && labelFormatter && payload !== undefined && payload !== null) {
    finalLabel = labelFormatter(label, payload);
  }
  var accessibilityAttributes = accessibilityLayer ? {
    role: 'status',
    'aria-live': 'assertive'
  } : {};
  return /*#__PURE__*/React.createElement("div", _extends({
    className: wrapperCN,
    style: finalStyle
  }, accessibilityAttributes), /*#__PURE__*/React.createElement("p", {
    className: labelCN,
    style: finalLabelStyle
  }, /*#__PURE__*/React.isValidElement(finalLabel) ? finalLabel : "".concat(finalLabel)), renderContent());
};