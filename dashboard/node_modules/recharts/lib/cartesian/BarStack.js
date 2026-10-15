"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStackId = exports.useBarStackClipPathUrl = exports.defaultBarStackProps = exports.BarStackClipLayer = exports.BarStack = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _ChartUtils = require("../util/ChartUtils");
var _useUniqueId = require("../util/useUniqueId");
var _resolveDefaultProps2 = require("../util/resolveDefaultProps");
var _hooks = require("../state/hooks");
var _barStackSelectors = require("../state/selectors/barStackSelectors");
var _PanoramaContext = require("../context/PanoramaContext");
var _Layer = require("../container/Layer");
var _Rectangle = require("../shape/Rectangle");
var _propsAreEqual = require("../util/propsAreEqual");
var _excluded = ["index"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var BarStackContext = /*#__PURE__*/(0, _react.createContext)(undefined);

/**
 * Hook to resolve the stack ID for a Bar component.
 * If a stack ID is provided via props, it is used directly.
 * Otherwise, this will read stack ID from BarStack context if available.
 * If both are undefined, it returns undefined.
 * @param childStackId
 */
var useStackId = childStackId => {
  var stackSettings = (0, _react.useContext)(BarStackContext);
  if (stackSettings != null) {
    return stackSettings.stackId;
  }
  if (childStackId == null) {
    return undefined;
  }
  return (0, _ChartUtils.getNormalizedStackId)(childStackId);
};
exports.useStackId = useStackId;
var defaultBarStackProps = exports.defaultBarStackProps = {
  radius: 0
};
var getClipPathId = (stackId, index) => {
  return "recharts-bar-stack-clip-path-".concat(stackId, "-").concat(index);
};
var useBarStackClipPathUrl = index => {
  var barStackContext = (0, _react.useContext)(BarStackContext);
  if (barStackContext == null) {
    return undefined;
  }
  var stackId = barStackContext.stackId;
  return "url(#".concat(getClipPathId(stackId, index), ")");
};
exports.useBarStackClipPathUrl = useBarStackClipPathUrl;
var BarStackClipLayer = _ref => {
  var index = _ref.index,
    rest = _objectWithoutProperties(_ref, _excluded);
  var clipPathUrl = useBarStackClipPathUrl(index);
  return /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
    className: "recharts-bar-stack-layer",
    clipPath: clipPathUrl
  }, rest));
};

/**
 * This React component will render a clipPath that the individual bars in the stack will reference
 * to achieve rounded corners for the entire stack.
 */
exports.BarStackClipLayer = BarStackClipLayer;
var BarStackClipPath = _ref2 => {
  var stackId = _ref2.stackId,
    radius = _ref2.radius;
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var positions = (0, _hooks.useAppSelector)(state => (0, _barStackSelectors.selectStackRects)(state, stackId, isPanorama));
  if (positions == null || positions.length === 0) {
    return null;
  }
  /*
   * Render one clipPath per rectangle in the stack.
   * Each rectangle corresponds to one data entry in the chart.
   */
  return /*#__PURE__*/React.createElement("defs", null, positions.map((pos, index) => {
    if (pos == null) {
      return null;
    }
    var clipPathId = getClipPathId(stackId, index);
    return /*#__PURE__*/React.createElement("clipPath", {
      key: clipPathId,
      id: clipPathId
    }, /*#__PURE__*/React.createElement(_Rectangle.Rectangle, {
      isAnimationActive: false,
      isUpdateAnimationActive: false,
      x: pos.x,
      y: pos.y,
      width: pos.width,
      height: pos.height,
      radius: radius
    }));
  }));
};
var BarStackImpl = props => {
  var resolvedStackId = (0, _useUniqueId.useUniqueId)('recharts-bar-stack', (0, _ChartUtils.getNormalizedStackId)(props.stackId));
  var _resolveDefaultProps = (0, _resolveDefaultProps2.resolveDefaultProps)(props, defaultBarStackProps),
    children = _resolveDefaultProps.children,
    radius = _resolveDefaultProps.radius;
  var context = (0, _react.useMemo)(() => ({
    stackId: resolvedStackId,
    radius
  }), [resolvedStackId, radius]);
  return /*#__PURE__*/React.createElement(BarStackContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(BarStackClipPath, {
    stackId: resolvedStackId,
    radius: radius
  }), children);
};

/**
 * @provides BarStackContext
 * @since 3.6
 */
var BarStack = exports.BarStack = /*#__PURE__*/React.memo(BarStackImpl, _propsAreEqual.propsAreEqual);