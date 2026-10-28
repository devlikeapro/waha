"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianLabelListContextProvider = void 0;
exports.LabelList = LabelList;
exports.LabelListFromLabelProp = LabelListFromLabelProp;
exports.PolarLabelListContextProvider = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _Label = require("./Label");
var _Layer = require("../container/Layer");
var _ChartUtils = require("../util/ChartUtils");
var _DataUtils = require("../util/DataUtils");
var _svgPropertiesAndEvents = require("../util/svgPropertiesAndEvents");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var _Text = require("./Text");
var _excluded = ["valueAccessor"],
  _excluded2 = ["dataKey", "clockWise", "id", "textBreakAll", "zIndex"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * This is public API because we expose it as the valueAccessor parameter.
 *
 * The properties of "viewBox" are repeated as the root props of the entry object.
 * So it doesn't matter if you read entry.x or entry.viewBox.x, they are the same.
 *
 * It's not necessary to pass redundant data, but we keep it for backward compatibility.
 */

/**
 * LabelList props do not allow refs because the same props are reused in multiple elements so we don't have a good single place to ref to.
 */

/**
 * This is the type accepted for the `label` prop on various graphical items.
 * It accepts:
 *
 * boolean:
 *    true = labels show,
 *    false = labels don't show
 * React element:
 *    will be cloned with extra props
 * function:
 *    is used as <Label content={function} />, so this will be called once for each individual label (so typically once for each data point)
 * object:
 *    the props to be passed to a LabelList component
 *
 * @inline
 */

var defaultAccessor = entry => {
  var val = Array.isArray(entry.value) ? entry.value[entry.value.length - 1] : entry.value;
  if ((0, _Text.isRenderableText)(val)) {
    return val;
  }
  return undefined;
};
var CartesianLabelListContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var CartesianLabelListContextProvider = exports.CartesianLabelListContextProvider = CartesianLabelListContext.Provider;
var PolarLabelListContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var PolarLabelListContextProvider = exports.PolarLabelListContextProvider = PolarLabelListContext.Provider;
function useCartesianLabelListContext() {
  return (0, _react.useContext)(CartesianLabelListContext);
}
function usePolarLabelListContext() {
  return (0, _react.useContext)(PolarLabelListContext);
}

/**
 * @consumes LabelListContext
 */
function LabelList(_ref) {
  var _ref$valueAccessor = _ref.valueAccessor,
    valueAccessor = _ref$valueAccessor === void 0 ? defaultAccessor : _ref$valueAccessor,
    restProps = _objectWithoutProperties(_ref, _excluded);
  var dataKey = restProps.dataKey,
    clockWise = restProps.clockWise,
    id = restProps.id,
    textBreakAll = restProps.textBreakAll,
    zIndex = restProps.zIndex,
    others = _objectWithoutProperties(restProps, _excluded2);
  var cartesianData = useCartesianLabelListContext();
  var polarData = usePolarLabelListContext();
  var data = cartesianData || polarData;
  if (!data || !data.length) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
    zIndex: zIndex !== null && zIndex !== void 0 ? zIndex : _DefaultZIndexes.DefaultZIndexes.label
  }, /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: "recharts-label-list"
  }, data.map((entry, index) => {
    var _restProps$fill;
    var value = (0, _DataUtils.isNullish)(dataKey) ? valueAccessor(entry, index) : (0, _ChartUtils.getValueByDataKey)(entry.payload, dataKey);
    var idProps = (0, _DataUtils.isNullish)(id) ? {} : {
      id: "".concat(id, "-").concat(index)
    };
    return /*#__PURE__*/React.createElement(_Label.Label, _extends({
      key: "label-".concat(index)
    }, (0, _svgPropertiesAndEvents.svgPropertiesAndEvents)(entry), others, idProps, {
      /*
       * Prefer to use the explicit fill from LabelList props.
       * Only in an absence of that, fall back to the fill of the entry.
       * The entry fill can be quite difficult to see especially in Bar, Pie, RadialBar in inside positions.
       * On the other hand it's quite convenient in Scatter, Line, or when the position is outside the Bar, Pie filled shapes.
       */
      fill: (_restProps$fill = restProps.fill) !== null && _restProps$fill !== void 0 ? _restProps$fill : entry.fill,
      parentViewBox: entry.parentViewBox,
      value: value,
      textBreakAll: textBreakAll,
      viewBox: entry.viewBox,
      index: index
      /*
       * Here we don't want to use the default Label zIndex,
       * we want it to inherit the zIndex of the LabelList itself
       * which means just rendering as a regular child, without portaling anywhere.
       */,
      zIndex: 0
    }));
  })));
}
LabelList.displayName = 'LabelList';
function LabelListFromLabelProp(_ref2) {
  var label = _ref2.label;
  if (!label) {
    return null;
  }
  if (label === true) {
    return /*#__PURE__*/React.createElement(LabelList, {
      key: "labelList-implicit"
    });
  }
  if (/*#__PURE__*/React.isValidElement(label) || (0, _Label.isLabelContentAFunction)(label)) {
    return /*#__PURE__*/React.createElement(LabelList, {
      key: "labelList-implicit",
      content: label
    });
  }
  if (typeof label === 'object') {
    return /*#__PURE__*/React.createElement(LabelList, _extends({
      key: "labelList-implicit"
    }, label, {
      type: String(label.type)
    }));
  }
  return null;
}