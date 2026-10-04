"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Treemap = Treemap;
exports.treemapPayloadSearcher = exports.defaultTreeMapProps = exports.computeNode = exports.addToTreemapNodeIndex = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _omit = _interopRequireDefault(require("es-toolkit/compat/omit"));
var _get = _interopRequireDefault(require("es-toolkit/compat/get"));
var _Layer = require("../container/Layer");
var _Surface = require("../container/Surface");
var _Polygon = require("../shape/Polygon");
var _Rectangle = require("../shape/Rectangle");
var _ChartUtils = require("../util/ChartUtils");
var _Constants = require("../util/Constants");
var _DataUtils = require("../util/DataUtils");
var _DOMUtils = require("../util/DOMUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _tooltipPortalContext = require("../context/tooltipPortalContext");
var _RechartsWrapper = require("./RechartsWrapper");
var _tooltipSlice = require("../state/tooltipSlice");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _RechartsStoreProvider = require("../state/RechartsStoreProvider");
var _ReportEventSettings = require("../state/ReportEventSettings");
var _hooks = require("../state/hooks");
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _CSSTransitionAnimate = require("../animation/CSSTransitionAnimate");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _RegisterGraphicalItemId = require("../context/RegisterGraphicalItemId");
var _eventSettingsSlice = require("../state/eventSettingsSlice");
var _excluded = ["width", "height", "className", "style", "children", "type"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var NODE_VALUE_KEY = 'value';

/**
 * This is what end users defines as `data` on Treemap.
 */

/**
 * This is what is returned from `squarify`, the final treemap data structure
 * that gets rendered and is stored in
 */

function isTreemapNode(value) {
  return value != null && typeof value === 'object' && 'x' in value && 'y' in value && 'width' in value && 'height' in value && typeof value.x === 'number' && typeof value.y === 'number' && typeof value.width === 'number' && typeof value.height === 'number';
}
var treemapPayloadSearcher = (data, activeIndex) => {
  if (!data || !activeIndex) {
    return undefined;
  }
  return (0, _get.default)(data, activeIndex);
};
exports.treemapPayloadSearcher = treemapPayloadSearcher;
var addToTreemapNodeIndex = exports.addToTreemapNodeIndex = function addToTreemapNodeIndex(indexInChildrenArr) {
  var activeTooltipIndexSoFar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return "".concat(activeTooltipIndexSoFar, "children[").concat(indexInChildrenArr, "]");
};
var options = {
  chartName: 'Treemap',
  defaultTooltipEventType: 'item',
  validateTooltipEventTypes: ['item'],
  tooltipPayloadSearcher: treemapPayloadSearcher,
  eventEmitter: undefined
};
var NEST_INDEX_HEIGHT = 30;
var getTreemapRenderHeight = (height, type) => {
  if (type === 'nest') {
    return height - NEST_INDEX_HEIGHT;
  }
  return height;
};
var computeNode = _ref => {
  var depth = _ref.depth,
    node = _ref.node,
    index = _ref.index,
    dataKey = _ref.dataKey,
    nameKey = _ref.nameKey,
    nestedActiveTooltipIndex = _ref.nestedActiveTooltipIndex;
  var currentTooltipIndex = depth === 0 ? '' : addToTreemapNodeIndex(index, nestedActiveTooltipIndex);
  var children = node.children;
  var childDepth = depth + 1;
  var computedChildren = children && children.length ? children.map((child, i) => computeNode({
    depth: childDepth,
    node: child,
    index: i,
    dataKey,
    nameKey,
    nestedActiveTooltipIndex: currentTooltipIndex
  })) : null;
  var nodeValue;
  if (computedChildren && computedChildren.length) {
    nodeValue = computedChildren.reduce((result, child) => result + child.value, 0);
  } else {
    // TODO need to verify dataKey
    var rawNodeValue = node[dataKey];
    var numericValue = typeof rawNodeValue === 'number' ? rawNodeValue : 0;
    nodeValue = (0, _DataUtils.isNan)(numericValue) || numericValue <= 0 ? 0 : numericValue;
  }
  return _objectSpread(_objectSpread({}, node), {}, {
    children: computedChildren,
    // @ts-expect-error getValueByDataKey does not validate the output type
    name: (0, _ChartUtils.getValueByDataKey)(node, nameKey, ''),
    [NODE_VALUE_KEY]: nodeValue,
    depth,
    index,
    tooltipIndex: currentTooltipIndex
  });
};
exports.computeNode = computeNode;
var filterRect = node => ({
  x: node.x,
  y: node.y,
  width: node.width,
  height: node.height
});
var insetRect = (rect, nodeInset) => {
  if (!Number.isFinite(nodeInset) || nodeInset <= 0) {
    return rect;
  }
  var clampedPadding = Math.min(nodeInset, rect.width / 2, rect.height / 2);
  return {
    x: rect.x + clampedPadding,
    y: rect.y + clampedPadding,
    width: Math.max(rect.width - clampedPadding * 2, 0),
    height: Math.max(rect.height - clampedPadding * 2, 0)
  };
};
var applyGapToChildren = (children, parentRect, nodeGap) => {
  if (!Number.isFinite(nodeGap) || nodeGap <= 0) {
    return children;
  }
  var halfGap = nodeGap / 2;
  var parentRight = parentRect.x + parentRect.width;
  var parentBottom = parentRect.y + parentRect.height;
  return children.map(child => {
    var childRight = child.x + child.width;
    var childBottom = child.y + child.height;
    var leftInset = child.x > parentRect.x ? halfGap : 0;
    var rightInset = childRight < parentRight ? halfGap : 0;
    var topInset = child.y > parentRect.y ? halfGap : 0;
    var bottomInset = childBottom < parentBottom ? halfGap : 0;
    return _objectSpread(_objectSpread({}, child), {}, {
      x: child.x + leftInset,
      y: child.y + topInset,
      width: Math.max(child.width - leftInset - rightInset, 0),
      height: Math.max(child.height - topInset - bottomInset, 0)
    });
  });
};
// Compute the area for each child based on value & scale.
var getAreaOfChildren = (children, areaValueRatio) => {
  var ratio = areaValueRatio < 0 ? 0 : areaValueRatio;
  return children.map(child => {
    var area = child[NODE_VALUE_KEY] * ratio;
    return _objectSpread(_objectSpread({}, child), {}, {
      area: (0, _DataUtils.isNan)(area) || area <= 0 ? 0 : area
    });
  });
};

// Computes the score for the specified row, as the worst aspect ratio.
var getWorstScore = (row, parentSize, aspectRatio) => {
  var parentArea = parentSize * parentSize;
  var rowArea = row.area * row.area;
  var _row$reduce = row.reduce((result, child) => ({
      min: Math.min(result.min, child.area),
      max: Math.max(result.max, child.area)
    }), {
      min: Infinity,
      max: 0
    }),
    min = _row$reduce.min,
    max = _row$reduce.max;
  return rowArea ? Math.max(parentArea * max * aspectRatio / rowArea, rowArea / (parentArea * min * aspectRatio)) : Infinity;
};
var horizontalPosition = (row, parentSize, parentRect, isFlush) => {
  var rowHeight = parentSize ? Math.round(row.area / parentSize) : 0;
  if (isFlush || rowHeight > parentRect.height) {
    rowHeight = parentRect.height;
  }
  var curX = parentRect.x;
  var child;
  for (var i = 0, len = row.length; i < len; i++) {
    child = row[i];
    if (child == null) {
      continue;
    }
    child.x = curX;
    child.y = parentRect.y;
    child.height = rowHeight;
    child.width = Math.min(rowHeight ? Math.round(child.area / rowHeight) : 0, parentRect.x + parentRect.width - curX);
    curX += child.width;
  }
  // add the remain x to the last one of row
  if (child != null) {
    child.width += parentRect.x + parentRect.width - curX;
  }
  return _objectSpread(_objectSpread({}, parentRect), {}, {
    y: parentRect.y + rowHeight,
    height: parentRect.height - rowHeight
  });
};
var verticalPosition = (row, parentSize, parentRect, isFlush) => {
  var rowWidth = parentSize ? Math.round(row.area / parentSize) : 0;
  if (isFlush || rowWidth > parentRect.width) {
    rowWidth = parentRect.width;
  }
  var curY = parentRect.y;
  var child;
  for (var i = 0, len = row.length; i < len; i++) {
    child = row[i];
    if (child == null) {
      continue;
    }
    child.x = parentRect.x;
    child.y = curY;
    child.width = rowWidth;
    child.height = Math.min(rowWidth ? Math.round(child.area / rowWidth) : 0, parentRect.y + parentRect.height - curY);
    curY += child.height;
  }
  if (child) {
    child.height += parentRect.y + parentRect.height - curY;
  }
  return _objectSpread(_objectSpread({}, parentRect), {}, {
    x: parentRect.x + rowWidth,
    width: parentRect.width - rowWidth
  });
};
var position = (row, parentSize, parentRect, isFlush) => {
  if (parentSize === parentRect.width) {
    return horizontalPosition(row, parentSize, parentRect, isFlush);
  }
  return verticalPosition(row, parentSize, parentRect, isFlush);
};
// Recursively arranges the specified node's children into squarified rows.
var squarify = (node, aspectRatio, nodeInset, nodeGap) => {
  var children = node.children;
  if (children && children.length) {
    var layoutRect = insetRect(filterRect(node), nodeInset);
    var rect = layoutRect;
    // @ts-expect-error we can't create an array with static property on a single line so typescript will complain.
    var row = [];
    var best = Infinity; // the best row score so far
    var child, score; // the current row score
    var size = Math.min(rect.width, rect.height); // initial orientation
    var scaleChildren = getAreaOfChildren(children, rect.width * rect.height / node[NODE_VALUE_KEY]);
    var tempChildren = scaleChildren.slice();

    // why are we setting static properties on an array?
    row.area = 0;
    while (tempChildren.length > 0) {
      var _tempChildren = _slicedToArray(tempChildren, 1);
      child = _tempChildren[0];
      if (child == null) {
        continue;
      }
      // row first
      row.push(child);
      row.area += child.area;
      score = getWorstScore(row, size, aspectRatio);
      if (score <= best) {
        // continue with this orientation
        tempChildren.shift();
        best = score;
      } else {
        var _row$pop$area, _row$pop;
        // abort, and try a different orientation
        row.area -= (_row$pop$area = (_row$pop = row.pop()) === null || _row$pop === void 0 ? void 0 : _row$pop.area) !== null && _row$pop$area !== void 0 ? _row$pop$area : 0;
        rect = position(row, size, rect, false);
        size = Math.min(rect.width, rect.height);
        row.length = row.area = 0;
        best = Infinity;
      }
    }
    if (row.length) {
      rect = position(row, size, rect, true);
      row.length = row.area = 0;
    }
    var childrenWithGaps = applyGapToChildren(scaleChildren, layoutRect, nodeGap);
    return _objectSpread(_objectSpread({}, node), {}, {
      children: childrenWithGaps.map(c => squarify(c, aspectRatio, nodeInset, nodeGap))
    });
  }
  return node;
};
var defaultTreeMapProps = exports.defaultTreeMapProps = _objectSpread({
  aspectRatio: 0.5 * (1 + Math.sqrt(5)),
  nodeInset: 0,
  nodeGap: 0,
  dataKey: 'value',
  nameKey: 'name',
  type: 'flat',
  isAnimationActive: 'auto',
  isUpdateAnimationActive: 'auto',
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'linear'
}, _eventSettingsSlice.initialEventSettingsState);
var defaultState = {
  isAnimationFinished: false,
  formatRoot: null,
  currentRoot: undefined,
  nestIndex: [],
  prevAspectRatio: defaultTreeMapProps.aspectRatio,
  prevNodeInset: defaultTreeMapProps.nodeInset,
  prevNodeGap: defaultTreeMapProps.nodeGap,
  prevDataKey: defaultTreeMapProps.dataKey
};
function ContentItem(_ref2) {
  var content = _ref2.content,
    nodeProps = _ref2.nodeProps,
    type = _ref2.type,
    colorPanel = _ref2.colorPanel,
    onMouseEnter = _ref2.onMouseEnter,
    onMouseLeave = _ref2.onMouseLeave,
    onClick = _ref2.onClick;
  if (/*#__PURE__*/React.isValidElement(content)) {
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onClick: onClick
    }, /*#__PURE__*/React.cloneElement(content, nodeProps));
  }
  if (typeof content === 'function') {
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onClick: onClick
    }, content(nodeProps));
  }
  // optimize default shape
  var x = nodeProps.x,
    y = nodeProps.y,
    width = nodeProps.width,
    height = nodeProps.height,
    index = nodeProps.index;
  var arrow = null;
  if (width > 10 && height > 10 && nodeProps.children && type === 'nest' && nodeProps.depth > 0) {
    arrow = /*#__PURE__*/React.createElement(_Polygon.Polygon, {
      points: [{
        x: x + 2,
        y: y + height / 2
      }, {
        x: x + 6,
        y: y + height / 2 + 3
      }, {
        x: x + 2,
        y: y + height / 2 + 6
      }]
    });
  }
  var text = null;
  var nameSize = (0, _DOMUtils.getStringSize)(nodeProps.name);
  if (width > 20 && height > 20 && nameSize.width < width && nameSize.height < height) {
    text = /*#__PURE__*/React.createElement("text", {
      x: x + 8,
      y: y + height / 2 + 7,
      fontSize: 14
    }, nodeProps.name);
  }
  var colors = colorPanel || _Constants.COLOR_PANEL;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(_Rectangle.Rectangle, _extends({
    fill: nodeProps.depth < 2 ? colors[index % colors.length] : 'rgba(255,255,255,0)',
    stroke: "#fff"
  }, (0, _omit.default)(nodeProps, ['children']), {
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onClick: onClick,
    "data-recharts-item-index": nodeProps.tooltipIndex
  })), arrow, text);
}
function ContentItemWithEvents(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var activeCoordinate = {
    x: props.nodeProps.x + props.nodeProps.width / 2,
    y: props.nodeProps.y + props.nodeProps.height / 2
  };
  var onMouseEnter = () => {
    dispatch((0, _tooltipSlice.setActiveMouseOverItemIndex)({
      activeIndex: props.nodeProps.tooltipIndex,
      activeDataKey: props.dataKey,
      activeCoordinate,
      activeGraphicalItemId: props.id
    }));
  };
  var onMouseLeave = () => {
    // clearing state on mouseLeaveItem causes re-rendering issues
    // we don't actually want to do this for TreeMap - we clear state when we leave the entire chart instead
  };
  var onClick = () => {
    dispatch((0, _tooltipSlice.setActiveClickItemIndex)({
      activeIndex: props.nodeProps.tooltipIndex,
      activeDataKey: props.dataKey,
      activeCoordinate,
      activeGraphicalItemId: props.id
    }));
  };
  return /*#__PURE__*/React.createElement(ContentItem, _extends({}, props, {
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onClick: onClick
  }));
}
var SetTreemapTooltipEntrySettings = /*#__PURE__*/React.memo(_ref3 => {
  var dataKey = _ref3.dataKey,
    nameKey = _ref3.nameKey,
    stroke = _ref3.stroke,
    fill = _ref3.fill,
    currentRoot = _ref3.currentRoot,
    id = _ref3.id;
  var tooltipEntrySettings = {
    dataDefinedOnItem: currentRoot,
    getPosition: _DataUtils.noop,
    // TODO I think Treemap has the capability of computing positions and supporting defaultIndex? Except it doesn't yet
    settings: {
      stroke,
      strokeWidth: undefined,
      fill,
      dataKey,
      nameKey,
      name: undefined,
      // Each TreemapNode has its own name
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

// Why is margin not a treemap prop? No clue. Probably it should be
var defaultTreemapMargin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
function TreemapItem(_ref4) {
  var content = _ref4.content,
    nodeProps = _ref4.nodeProps,
    isLeaf = _ref4.isLeaf,
    treemapProps = _ref4.treemapProps,
    onNestClick = _ref4.onNestClick;
  var id = treemapProps.id,
    isAnimationActive = treemapProps.isAnimationActive,
    animationBegin = treemapProps.animationBegin,
    animationDuration = treemapProps.animationDuration,
    animationEasing = treemapProps.animationEasing,
    isUpdateAnimationActive = treemapProps.isUpdateAnimationActive,
    type = treemapProps.type,
    colorPanel = treemapProps.colorPanel,
    dataKey = treemapProps.dataKey,
    onAnimationStart = treemapProps.onAnimationStart,
    onAnimationEnd = treemapProps.onAnimationEnd,
    onMouseEnterFromProps = treemapProps.onMouseEnter,
    onItemClickFromProps = treemapProps.onClick,
    onMouseLeaveFromProps = treemapProps.onMouseLeave;
  var width = nodeProps.width,
    height = nodeProps.height,
    x = nodeProps.x,
    y = nodeProps.y;
  var translateX = -x - width;
  var translateY = 0;
  var onMouseEnter = e => {
    if ((isLeaf || type === 'nest') && typeof onMouseEnterFromProps === 'function') {
      onMouseEnterFromProps(nodeProps, e);
    }
  };
  var onMouseLeave = e => {
    if ((isLeaf || type === 'nest') && typeof onMouseLeaveFromProps === 'function') {
      onMouseLeaveFromProps(nodeProps, e);
    }
  };
  var onClick = () => {
    if (type === 'nest' && nodeProps.depth > 0) {
      onNestClick(nodeProps);
    }
    if ((isLeaf || type === 'nest') && typeof onItemClickFromProps === 'function') {
      onItemClickFromProps(nodeProps);
    }
  };
  var handleAnimationEnd = (0, _react.useCallback)(() => {
    if (typeof onAnimationEnd === 'function') {
      onAnimationEnd();
    }
  }, [onAnimationEnd]);
  var handleAnimationStart = (0, _react.useCallback)(() => {
    if (typeof onAnimationStart === 'function') {
      onAnimationStart();
    }
  }, [onAnimationStart]);
  return /*#__PURE__*/React.createElement(_CSSTransitionAnimate.CSSTransitionAnimate, {
    animationId: "treemap-".concat(nodeProps.tooltipIndex),
    from: "translate(".concat(translateX, "px, ").concat(translateY, "px)"),
    to: "translate(0, 0)",
    attributeName: "transform",
    begin: animationBegin,
    easing: (0, _CSSTransitionAnimate.extractCssEasing)(animationEasing),
    isActive: isAnimationActive,
    duration: animationDuration,
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd
  }, style => /*#__PURE__*/React.createElement(_Layer.Layer, {
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onClick: onClick,
    style: _objectSpread(_objectSpread({}, style), {}, {
      transformOrigin: "".concat(x, " ").concat(y)
    })
  }, /*#__PURE__*/React.createElement(ContentItemWithEvents, {
    id: id,
    content: content,
    dataKey: dataKey,
    nodeProps: _objectSpread(_objectSpread({}, nodeProps), {}, {
      isAnimationActive,
      isUpdateAnimationActive: !isUpdateAnimationActive,
      width,
      height,
      x,
      y
    }),
    type: type,
    colorPanel: colorPanel
  })));
}
class TreemapWithState extends _react.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", _objectSpread({}, defaultState));
    _defineProperty(this, "handleClick", node => {
      var _this$props = this.props,
        onClick = _this$props.onClick,
        type = _this$props.type;
      if (type === 'nest' && node.children) {
        var _this$props2 = this.props,
          width = _this$props2.width,
          height = _this$props2.height,
          dataKey = _this$props2.dataKey,
          nameKey = _this$props2.nameKey,
          aspectRatio = _this$props2.aspectRatio,
          nodeInset = _this$props2.nodeInset,
          nodeGap = _this$props2.nodeGap;
        var root = computeNode({
          depth: 0,
          node: _objectSpread(_objectSpread({}, node), {}, {
            x: 0,
            y: 0,
            width,
            height: getTreemapRenderHeight(height, type)
          }),
          index: 0,
          dataKey,
          nameKey,
          // with Treemap nesting, should this continue nesting the index or start from empty string?
          nestedActiveTooltipIndex: node.tooltipIndex
        });
        var formatRoot = squarify(root, aspectRatio, nodeInset, nodeGap);
        var nestIndex = this.state.nestIndex;
        nestIndex.push(node);
        this.setState({
          formatRoot,
          currentRoot: root,
          nestIndex
        });
      }
      if (onClick) {
        onClick(node);
      }
    });
    _defineProperty(this, "handleTouchMove", e => {
      var touchEvent = e.touches[0];
      if (touchEvent == null) {
        return;
      }
      var target = document.elementFromPoint(touchEvent.clientX, touchEvent.clientY);
      if (!target || !target.getAttribute || this.state.formatRoot == null) {
        return;
      }
      var itemIndex = target.getAttribute('data-recharts-item-index');
      var activeNode = treemapPayloadSearcher(this.state.formatRoot, itemIndex);
      if (!isTreemapNode(activeNode)) {
        return;
      }
      var _this$props3 = this.props,
        dataKey = _this$props3.dataKey,
        dispatch = _this$props3.dispatch;
      var activeCoordinate = {
        x: activeNode.x + activeNode.width / 2,
        y: activeNode.y + activeNode.height / 2
      };

      // Treemap does not support onTouchMove prop, but it could
      // onTouchMove?.(activeNode, Number(itemIndex), e);
      dispatch((0, _tooltipSlice.setActiveMouseOverItemIndex)({
        activeIndex: itemIndex,
        activeDataKey: dataKey,
        activeCoordinate,
        activeGraphicalItemId: this.props.id
      }));
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.prevData || nextProps.type !== prevState.prevType || nextProps.width !== prevState.prevWidth || nextProps.height !== prevState.prevHeight || nextProps.dataKey !== prevState.prevDataKey || nextProps.aspectRatio !== prevState.prevAspectRatio || nextProps.nodeInset !== prevState.prevNodeInset || nextProps.nodeGap !== prevState.prevNodeGap) {
      var root = computeNode({
        depth: 0,
        node: {
          // @ts-expect-error missing properties
          children: nextProps.data,
          x: 0,
          y: 0,
          width: nextProps.width,
          height: getTreemapRenderHeight(nextProps.height, nextProps.type)
        },
        index: 0,
        dataKey: nextProps.dataKey,
        nameKey: nextProps.nameKey
      });
      var formatRoot = squarify(root, nextProps.aspectRatio, nextProps.nodeInset, nextProps.nodeGap);
      return _objectSpread(_objectSpread({}, prevState), {}, {
        formatRoot,
        currentRoot: root,
        nestIndex: [root],
        prevAspectRatio: nextProps.aspectRatio,
        prevData: nextProps.data,
        prevWidth: nextProps.width,
        prevHeight: nextProps.height,
        prevDataKey: nextProps.dataKey,
        prevType: nextProps.type,
        prevNodeInset: nextProps.nodeInset,
        prevNodeGap: nextProps.nodeGap
      });
    }
    return null;
  }
  handleNestIndex(node, i) {
    var nestIndex = this.state.nestIndex;
    var _this$props4 = this.props,
      width = _this$props4.width,
      height = _this$props4.height,
      dataKey = _this$props4.dataKey,
      nameKey = _this$props4.nameKey,
      aspectRatio = _this$props4.aspectRatio,
      nodeInset = _this$props4.nodeInset,
      nodeGap = _this$props4.nodeGap,
      type = _this$props4.type;
    var root = computeNode({
      depth: 0,
      node: _objectSpread(_objectSpread({}, node), {}, {
        x: 0,
        y: 0,
        width,
        height: getTreemapRenderHeight(height, type)
      }),
      index: 0,
      dataKey,
      nameKey,
      // with Treemap nesting, should this continue nesting the index or start from empty string?
      nestedActiveTooltipIndex: node.tooltipIndex
    });
    var formatRoot = squarify(root, aspectRatio, nodeInset, nodeGap);
    nestIndex = nestIndex.slice(0, i + 1);
    this.setState({
      formatRoot,
      currentRoot: node,
      nestIndex
    });
  }
  renderNode(root, node) {
    var _this$props5 = this.props,
      content = _this$props5.content,
      type = _this$props5.type;
    var nodeProps = _objectSpread(_objectSpread(_objectSpread({}, (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(this.props)), node), {}, {
      root
    });
    var isLeaf = !node.children || !node.children.length;
    var currentRoot = this.state.currentRoot;
    var isCurrentRootChild = ((currentRoot === null || currentRoot === void 0 ? void 0 : currentRoot.children) || []).filter(item => item.depth === node.depth && item.name === node.name);
    if (!isCurrentRootChild.length && root.depth && type === 'nest') {
      return null;
    }
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      key: "recharts-treemap-node-".concat(nodeProps.x, "-").concat(nodeProps.y, "-").concat(nodeProps.name),
      className: "recharts-treemap-depth-".concat(node.depth)
    }, /*#__PURE__*/React.createElement(TreemapItem, {
      isLeaf: isLeaf,
      content: content,
      nodeProps: nodeProps,
      treemapProps: this.props,
      onNestClick: this.handleClick
    }), node.children && node.children.length ? node.children.map(child => this.renderNode(node, child)) : null);
  }
  renderAllNodes() {
    var formatRoot = this.state.formatRoot;
    if (!formatRoot) {
      return null;
    }
    return this.renderNode(formatRoot, formatRoot);
  }

  // render nest treemap
  renderNestIndex() {
    var _this$props6 = this.props,
      nameKey = _this$props6.nameKey,
      nestIndexContent = _this$props6.nestIndexContent;
    var nestIndex = this.state.nestIndex;
    return /*#__PURE__*/React.createElement("div", {
      className: "recharts-treemap-nest-index-wrapper",
      style: {
        marginTop: '8px',
        textAlign: 'center'
      }
    }, nestIndex.map((item, i) => {
      // TODO need to verify nameKey type
      var rawName = (0, _get.default)(item, nameKey, 'root');
      var name = typeof rawName === 'string' ? rawName : 'root';
      var content;
      if (/*#__PURE__*/React.isValidElement(nestIndexContent)) {
        // the cloned content is ignored at all times - let's remove it?
        content = /*#__PURE__*/React.cloneElement(nestIndexContent, item, i);
      }
      if (typeof nestIndexContent === 'function') {
        content = nestIndexContent(item, i);
      } else {
        content = name;
      }
      return (
        /*#__PURE__*/
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        React.createElement("div", {
          onClick: this.handleNestIndex.bind(this, item, i),
          key: "nest-index-".concat((0, _DataUtils.uniqueId)()),
          className: "recharts-treemap-nest-index-box",
          style: {
            cursor: 'pointer',
            display: 'inline-block',
            padding: '0 7px',
            background: '#000',
            color: '#fff',
            marginRight: '3px'
          }
        }, content)
      );
    }));
  }
  render() {
    var _this$props7 = this.props,
      width = _this$props7.width,
      height = _this$props7.height,
      className = _this$props7.className,
      style = _this$props7.style,
      children = _this$props7.children,
      type = _this$props7.type,
      others = _objectWithoutProperties(_this$props7, _excluded);
    var attrs = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(others);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetTreemapTooltipEntrySettings, {
      dataKey: this.props.dataKey,
      nameKey: this.props.nameKey,
      stroke: this.props.stroke,
      fill: this.props.fill,
      currentRoot: this.state.currentRoot,
      id: this.props.id
    }), /*#__PURE__*/React.createElement(_Surface.Surface, _extends({}, attrs, {
      width: width,
      height: getTreemapRenderHeight(height, type),
      onTouchMove: this.handleTouchMove
    }), this.renderAllNodes(), children), type === 'nest' && this.renderNestIndex());
  }
}
_defineProperty(TreemapWithState, "displayName", 'Treemap');
function TreemapDispatchInject(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var width = (0, _chartLayoutContext.useChartWidth)();
  var height = (0, _chartLayoutContext.useChartHeight)();
  if (!(0, _isWellBehavedNumber.isPositiveNumber)(width) || !(0, _isWellBehavedNumber.isPositiveNumber)(height)) {
    return null;
  }
  var externalId = props.id;
  return /*#__PURE__*/React.createElement(_RegisterGraphicalItemId.RegisterGraphicalItemId, {
    id: externalId,
    type: "treemap"
  }, id => /*#__PURE__*/React.createElement(TreemapWithState, _extends({}, props, {
    id: id,
    width: width,
    height: height,
    dispatch: dispatch
  })));
}

/**
 * The Treemap chart is used to visualize hierarchical data using nested rectangles.
 *
 * @consumes ResponsiveContainerContext
 * @provides TooltipEntrySettings
 */
function Treemap(outsideProps) {
  var _props$className;
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, defaultTreeMapProps);
  var className = props.className,
    style = props.style,
    width = props.width,
    height = props.height,
    throttleDelay = props.throttleDelay,
    throttledEvents = props.throttledEvents;
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    tooltipPortal = _useState2[0],
    setTooltipPortal = _useState2[1];
  return /*#__PURE__*/React.createElement(_RechartsStoreProvider.RechartsStoreProvider, {
    preloadedState: {
      options
    },
    reduxStoreName: (_props$className = props.className) !== null && _props$className !== void 0 ? _props$className : 'Treemap'
  }, /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartMargin, {
    margin: defaultTreemapMargin
  }), /*#__PURE__*/React.createElement(_ReportEventSettings.ReportEventSettings, {
    throttleDelay: throttleDelay,
    throttledEvents: throttledEvents
  }), /*#__PURE__*/React.createElement(_RechartsWrapper.RechartsWrapper, {
    dispatchTouchEvents: false,
    className: className,
    style: style,
    width: width,
    height: height
    /*
     * Treemap has a bug where it doesn't include strokeWidth in its dimension calculation
     * which makes the actual chart exactly {strokeWidth} larger than asked for.
     * It's not a huge deal usually, but it makes the responsive option cycle infinitely.
     */,
    responsive: false,
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
  }, /*#__PURE__*/React.createElement(_tooltipPortalContext.TooltipPortalContext.Provider, {
    value: tooltipPortal
  }, /*#__PURE__*/React.createElement(TreemapDispatchInject, props))));
}