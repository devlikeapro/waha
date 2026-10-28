"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.payloadSearcher = exports.defaultSunburstChartProps = exports.SunburstChart = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _d3Scale = require("victory-vendor/d3-scale");
var _clsx = require("clsx");
var _get = _interopRequireDefault(require("es-toolkit/compat/get"));
var _Surface = require("../container/Surface");
var _Layer = require("../container/Layer");
var _Sector = require("../shape/Sector");
var _Text = require("../component/Text");
var _PolarUtils = require("../util/PolarUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _tooltipPortalContext = require("../context/tooltipPortalContext");
var _RechartsWrapper = require("./RechartsWrapper");
var _tooltipSlice = require("../state/tooltipSlice");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _RechartsStoreProvider = require("../state/RechartsStoreProvider");
var _ReportEventSettings = require("../state/ReportEventSettings");
var _hooks = require("../state/hooks");
var _RegisterGraphicalItemId = require("../context/RegisterGraphicalItemId");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _eventSettingsSlice = require("../state/eventSettingsSlice");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * We require tooltipIndex on each node internally to track which node is active in the tooltip.
 * This is not required from the outside user - we can calculate it as we traverse the tree.
 */

var defaultTextProps = {
  fontWeight: 'bold',
  paintOrder: 'stroke fill',
  fontSize: '.75rem',
  stroke: '#FFF',
  fill: 'black',
  pointerEvents: 'none'
};
function getMaxDepthOf(node) {
  if (!node.children || node.children.length === 0) return 1;

  // Calculate depth for each child and find the maximum
  var childDepths = node.children.map(d => getMaxDepthOf(d));
  return 1 + Math.max(...childDepths);
}
var SetSunburstTooltipEntrySettings = /*#__PURE__*/React.memo(_ref => {
  var dataKey = _ref.dataKey,
    nameKey = _ref.nameKey,
    data = _ref.data,
    stroke = _ref.stroke,
    fill = _ref.fill,
    positions = _ref.positions,
    id = _ref.id;
  var tooltipEntrySettings = {
    dataDefinedOnItem: data.children,
    getPosition: index => positions.get(index),
    // Sunburst does not support many of the properties as other charts do so there's plenty of defaults here
    settings: {
      stroke,
      strokeWidth: undefined,
      fill,
      nameKey,
      dataKey,
      // if there is a nameKey use it, otherwise make the name of the tooltip the dataKey itself
      name: nameKey ? undefined : dataKey,
      hide: false,
      type: undefined,
      color: fill,
      unit: '',
      graphicalItemId: id
    }
  };
  return /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
    tooltipEntrySettings: tooltipEntrySettings
  });
});

// Why is margin not a sunburst prop? No clue. Probably it should be
var defaultSunburstMargin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var payloadSearcher = (data, activeIndex) => {
  if (activeIndex == null) {
    return undefined;
  }
  return (0, _get.default)(data, activeIndex);
};
exports.payloadSearcher = payloadSearcher;
var addToSunburstNodeIndex = function addToSunburstNodeIndex(indexInChildrenArr) {
  var activeTooltipIndexSoFar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return "".concat(activeTooltipIndexSoFar, "children[").concat(indexInChildrenArr, "]");
};
var preloadedState = {
  options: {
    validateTooltipEventTypes: ['item'],
    defaultTooltipEventType: 'item',
    chartName: 'Sunburst',
    tooltipPayloadSearcher: payloadSearcher,
    eventEmitter: undefined
  }
};
var defaultSunburstChartProps = exports.defaultSunburstChartProps = _objectSpread({
  padding: 2,
  dataKey: 'value',
  nameKey: 'name',
  ringPadding: 2,
  innerRadius: 50,
  fill: '#333',
  stroke: '#FFF',
  textOptions: defaultTextProps,
  startAngle: 0,
  endAngle: 360,
  responsive: false
}, _eventSettingsSlice.initialEventSettingsState);
var SunburstChartImpl = _ref2 => {
  var className = _ref2.className,
    data = _ref2.data,
    children = _ref2.children,
    padding = _ref2.padding,
    dataKey = _ref2.dataKey,
    nameKey = _ref2.nameKey,
    ringPadding = _ref2.ringPadding,
    innerRadius = _ref2.innerRadius,
    fill = _ref2.fill,
    stroke = _ref2.stroke,
    textOptions = _ref2.textOptions,
    outerRadiusFromProps = _ref2.outerRadius,
    cxFromProps = _ref2.cx,
    cyFromProps = _ref2.cy,
    startAngle = _ref2.startAngle,
    endAngle = _ref2.endAngle,
    onClick = _ref2.onClick,
    onMouseEnter = _ref2.onMouseEnter,
    onMouseLeave = _ref2.onMouseLeave,
    id = _ref2.id;
  var dispatch = (0, _hooks.useAppDispatch)();
  var width = (0, _chartLayoutContext.useChartWidth)();
  var height = (0, _chartLayoutContext.useChartHeight)();
  if (width == null || height == null) {
    return null;
  }
  var outerRadius = outerRadiusFromProps !== null && outerRadiusFromProps !== void 0 ? outerRadiusFromProps : Math.min(width, height) / 2;
  var cx = cxFromProps !== null && cxFromProps !== void 0 ? cxFromProps : width / 2;
  var cy = cyFromProps !== null && cyFromProps !== void 0 ? cyFromProps : height / 2;
  var rScale = (0, _d3Scale.scaleLinear)([0, data[dataKey]], [0, endAngle]);
  var treeDepth = getMaxDepthOf(data);
  var thickness = (outerRadius - innerRadius) / treeDepth;
  var sectors = [];
  var positions = new Map([]);

  // event handlers
  function handleMouseEnter(node, e) {
    if (onMouseEnter) onMouseEnter(node, e);
    dispatch((0, _tooltipSlice.setActiveMouseOverItemIndex)({
      activeIndex: node.tooltipIndex,
      activeDataKey: dataKey,
      activeCoordinate: positions.get(node.name),
      activeGraphicalItemId: id
    }));
  }
  function handleMouseLeave(node, e) {
    if (onMouseLeave) onMouseLeave(node, e);
    dispatch((0, _tooltipSlice.mouseLeaveItem)());
  }
  function handleClick(node) {
    if (onClick) onClick(node);
    dispatch((0, _tooltipSlice.setActiveClickItemIndex)({
      activeIndex: node.tooltipIndex,
      activeDataKey: dataKey,
      activeCoordinate: positions.get(node.name),
      activeGraphicalItemId: id
    }));
  }

  // recursively add nodes for each data point and its children
  function drawArcs(childNodes, options) {
    var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var radius = options.radius,
      innerR = options.innerR,
      initialAngle = options.initialAngle,
      childColor = options.childColor,
      nestedActiveTooltipIndex = options.nestedActiveTooltipIndex;
    var currentAngle = initialAngle;
    if (!childNodes) return; // base case: no children of this node

    childNodes.forEach((d, i) => {
      var _ref3, _d$fill;
      var currentTooltipIndex = depth === 1 ? "[".concat(i, "]") : addToSunburstNodeIndex(i, nestedActiveTooltipIndex);
      var nodeWithIndex = _objectSpread(_objectSpread({}, d), {}, {
        tooltipIndex: currentTooltipIndex
      });
      var arcLength = rScale(d[dataKey]);
      var start = currentAngle;
      // color priority - if there's a color on the individual point use that, otherwise use parent color or default
      var fillColor = (_ref3 = (_d$fill = d === null || d === void 0 ? void 0 : d.fill) !== null && _d$fill !== void 0 ? _d$fill : childColor) !== null && _ref3 !== void 0 ? _ref3 : fill;
      var _polarToCartesian = (0, _PolarUtils.polarToCartesian)(0, 0, innerR + radius / 2, -(start + arcLength - arcLength / 2)),
        textX = _polarToCartesian.x,
        textY = _polarToCartesian.y;
      currentAngle += arcLength;
      sectors.push(/*#__PURE__*/React.createElement("g", {
        key: "sunburst-sector-".concat(d.name, "-").concat(i)
      }, /*#__PURE__*/React.createElement(_Sector.Sector, {
        onClick: () => handleClick(nodeWithIndex),
        onMouseEnter: e => handleMouseEnter(nodeWithIndex, e),
        onMouseLeave: e => handleMouseLeave(nodeWithIndex, e),
        fill: fillColor,
        stroke: stroke,
        strokeWidth: padding,
        startAngle: start,
        endAngle: start + arcLength,
        innerRadius: innerR,
        outerRadius: innerR + radius,
        cx: cx,
        cy: cy
      }), /*#__PURE__*/React.createElement(_Text.Text, _extends({}, textOptions, {
        alignmentBaseline: "middle",
        textAnchor: "middle",
        x: textX + cx,
        y: cy - textY
      }), d[dataKey])));
      var _polarToCartesian2 = (0, _PolarUtils.polarToCartesian)(cx, cy, innerR + radius / 2, start),
        tooltipX = _polarToCartesian2.x,
        tooltipY = _polarToCartesian2.y;
      positions.set(d.name, {
        x: tooltipX,
        y: tooltipY
      });
      return drawArcs(d.children, {
        radius,
        innerR: innerR + radius + ringPadding,
        initialAngle: start,
        childColor: fillColor,
        nestedActiveTooltipIndex: currentTooltipIndex
      }, depth + 1);
    });
  }
  drawArcs(data.children, {
    radius: thickness,
    innerR: innerRadius,
    initialAngle: startAngle
  });
  var layerClass = (0, _clsx.clsx)('recharts-sunburst', className);
  return /*#__PURE__*/React.createElement(_Surface.Surface, {
    width: width,
    height: height
  }, /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: layerClass
  }, sectors), /*#__PURE__*/React.createElement(SetSunburstTooltipEntrySettings, {
    dataKey: dataKey,
    nameKey: nameKey,
    data: data,
    stroke: stroke,
    fill: fill,
    positions: positions,
    id: id
  }), children);
};

/**
 * The sunburst is a hierarchical chart, similar to a {@link Treemap}, plotted in polar coordinates.
 * Sunburst charts effectively convey the hierarchical relationships and proportions within each level.
 * It is easy to see all the middle layers in the hierarchy, which might get lost in other visualizations.
 * For some datasets, the radial layout may be more visually appealing and intuitive than a traditional {@link Treemap}.
 *
 * @consumes ResponsiveContainerContext
 * @provides TooltipEntrySettings
 */
var SunburstChart = outsideProps => {
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, defaultSunburstChartProps);
  var className = props.className,
    width = props.width,
    height = props.height,
    responsive = props.responsive,
    style = props.style,
    externalId = props.id,
    throttleDelay = props.throttleDelay,
    throttledEvents = props.throttledEvents;
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    tooltipPortal = _useState2[0],
    setTooltipPortal = _useState2[1];
  return /*#__PURE__*/React.createElement(_RechartsStoreProvider.RechartsStoreProvider, {
    preloadedState: preloadedState,
    reduxStoreName: className !== null && className !== void 0 ? className : 'SunburstChart'
  }, /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartSize, {
    width: width,
    height: height
  }), /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartMargin, {
    margin: defaultSunburstMargin
  }), /*#__PURE__*/React.createElement(_ReportEventSettings.ReportEventSettings, {
    throttleDelay: throttleDelay,
    throttledEvents: throttledEvents
  }), /*#__PURE__*/React.createElement(_tooltipPortalContext.TooltipPortalContext.Provider, {
    value: tooltipPortal
  }, /*#__PURE__*/React.createElement(_RechartsWrapper.RechartsWrapper, {
    className: className,
    width: width,
    height: height,
    responsive: responsive,
    style: style,
    ref: node => {
      if (tooltipPortal == null && node != null) {
        setTooltipPortal(node);
      }
    },
    onMouseEnter: undefined,
    onMouseLeave: undefined,
    onClick: undefined,
    onMouseMove: undefined,
    onMouseDown: undefined,
    onMouseUp: undefined,
    onContextMenu: undefined,
    onDoubleClick: undefined,
    onTouchStart: undefined,
    onTouchMove: undefined,
    onTouchEnd: undefined
  }, /*#__PURE__*/React.createElement(_RegisterGraphicalItemId.RegisterGraphicalItemId, {
    id: externalId,
    type: "sunburst"
  }, id => /*#__PURE__*/React.createElement(SunburstChartImpl, _extends({}, props, {
    id: id
  }))))));
};
exports.SunburstChart = SunburstChart;