"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pie = void 0;
exports.computePieSectors = computePieSectors;
exports.defaultPieProps = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _get = _interopRequireDefault(require("es-toolkit/compat/get"));
var _clsx = require("clsx");
var _pieSelectors = require("../state/selectors/pieSelectors");
var _hooks = require("../state/hooks");
var _Layer = require("../container/Layer");
var _Curve = require("../shape/Curve");
var _Sector = require("../shape/Sector");
var _Text = require("../component/Text");
var _Cell = require("../component/Cell");
var _ReactUtils = require("../util/ReactUtils");
var _PolarUtils = require("../util/PolarUtils");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _types = require("../util/types");
var _ActiveShapeUtils = require("../util/ActiveShapeUtils");
var _tooltipContext = require("../context/tooltipContext");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _tooltipSelectors = require("../state/selectors/tooltipSelectors");
var _SetLegendPayload = require("../state/SetLegendPayload");
var _Constants = require("../util/Constants");
var _AnimatedItems = require("../animation/AnimatedItems");
var _matchBy = require("../animation/matchBy");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _RegisterGraphicalItemId = require("../context/RegisterGraphicalItemId");
var _SetGraphicalItem = require("../state/SetGraphicalItem");
var _svgPropertiesNoEvents = require("../util/svgPropertiesNoEvents");
var _LabelList = require("../component/LabelList");
var _Label = require("../component/Label");
var _ZIndexLayer = require("../zIndex/ZIndexLayer");
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var _getClassNameFromUnknown = require("../util/getClassNameFromUnknown");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _excluded = ["key"],
  _excluded2 = ["onMouseEnter", "onClick", "onMouseLeave"],
  _excluded3 = ["id"],
  _excluded4 = ["id"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * The `label` prop in Pie accepts a variety of alternatives.
 */

/**
 * We spread the data object into the sector data item,
 * so we can't really know what is going to be inside.
 *
 * This type represents our best effort, but it all depends on the input data
 * and what is inside of it.
 *
 * https://github.com/recharts/recharts/issues/6380
 * https://github.com/recharts/recharts/discussions/6375
 */

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

var defaultPieSectorShape = _Sector.Sector;
function SetPiePayloadLegend(props) {
  var cells = (0, _react.useMemo)(() => (0, _ReactUtils.findAllByType)(props.children, _Cell.Cell), [props.children]);
  var legendPayload = (0, _hooks.useAppSelector)(state => (0, _pieSelectors.selectPieLegend)(state, props.id, cells));
  if (legendPayload == null) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_SetLegendPayload.SetPolarLegendPayload, {
    legendPayload: legendPayload
  });
}
function getActiveShapeFill(activeShape) {
  // activeShape can be boolean/function/element/object; only element/object can carry a static fill value.
  if (activeShape == null || typeof activeShape === 'boolean' || typeof activeShape === 'function') {
    return undefined;
  }
  if (/*#__PURE__*/React.isValidElement(activeShape)) {
    var _activeShape$props;
    // React element form: <Sector fill="..."/> or custom element with fill prop.
    var _fill = (_activeShape$props = activeShape.props) === null || _activeShape$props === void 0 ? void 0 : _activeShape$props.fill;
    return typeof _fill === 'string' ? _fill : undefined;
  }
  var fill = activeShape.fill;
  return typeof fill === 'string' ? fill : undefined;
}
var SetPieTooltipEntrySettings = /*#__PURE__*/React.memo(_ref => {
  var dataKey = _ref.dataKey,
    nameKey = _ref.nameKey,
    sectors = _ref.sectors,
    stroke = _ref.stroke,
    strokeWidth = _ref.strokeWidth,
    fill = _ref.fill,
    name = _ref.name,
    hide = _ref.hide,
    tooltipType = _ref.tooltipType,
    formatter = _ref.formatter,
    id = _ref.id,
    activeShape = _ref.activeShape;
  var activeShapeFill = getActiveShapeFill(activeShape);
  var tooltipDataDefinedOnItem = sectors.map(sector => {
    var sectorTooltipPayload = sector.tooltipPayload;
    if (activeShapeFill == null || sectorTooltipPayload == null) {
      return sectorTooltipPayload;
    }
    return sectorTooltipPayload.map(item => _objectSpread(_objectSpread({}, item), {}, {
      color: activeShapeFill,
      fill: activeShapeFill
    }));
  });
  var tooltipEntrySettings = {
    dataDefinedOnItem: tooltipDataDefinedOnItem,
    getPosition: index => {
      var _sectors$Number;
      return (_sectors$Number = sectors[Number(index)]) === null || _sectors$Number === void 0 ? void 0 : _sectors$Number.tooltipPosition;
    },
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey,
      name: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
      hide,
      type: tooltipType,
      color: fill,
      unit: '',
      // why doesn't Pie support unit?
      formatter,
      graphicalItemId: id
    }
  };
  return /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
    tooltipEntrySettings: tooltipEntrySettings
  });
});
var getTextAnchor = (x, cx) => {
  if (x > cx) {
    return 'start';
  }
  if (x < cx) {
    return 'end';
  }
  return 'middle';
};
var getOuterRadius = (dataPoint, outerRadius, maxPieRadius) => {
  if (typeof outerRadius === 'function') {
    return (0, _DataUtils.getPercentValue)(outerRadius(dataPoint), maxPieRadius, maxPieRadius * 0.8);
  }
  return (0, _DataUtils.getPercentValue)(outerRadius, maxPieRadius, maxPieRadius * 0.8);
};
var parseCoordinateOfPie = (pieSettings, offset, dataPoint) => {
  var top = offset.top,
    left = offset.left,
    width = offset.width,
    height = offset.height;
  var maxPieRadius = (0, _PolarUtils.getMaxRadius)(width, height);
  var cx = left + (0, _DataUtils.getPercentValue)(pieSettings.cx, width, width / 2);
  var cy = top + (0, _DataUtils.getPercentValue)(pieSettings.cy, height, height / 2);
  var innerRadius = (0, _DataUtils.getPercentValue)(pieSettings.innerRadius, maxPieRadius, 0);
  var outerRadius = getOuterRadius(dataPoint, pieSettings.outerRadius, maxPieRadius);
  var maxRadius = pieSettings.maxRadius || Math.sqrt(width * width + height * height) / 2;
  return {
    cx,
    cy,
    innerRadius,
    outerRadius,
    maxRadius
  };
};
var parseDeltaAngle = (startAngle, endAngle) => {
  var sign = (0, _DataUtils.mathSign)(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
  return sign * deltaAngle;
};
var renderLabelLineItem = (option, props) => {
  if (/*#__PURE__*/React.isValidElement(option)) {
    // @ts-expect-error we can't know if the type of props matches the element
    return /*#__PURE__*/React.cloneElement(option, props);
  }
  if (typeof option === 'function') {
    return option(props);
  }
  var className = (0, _clsx.clsx)('recharts-pie-label-line', typeof option !== 'boolean' ? option.className : '');
  // React doesn't like it when we spread a key property onto an element
  var key = props.key,
    otherProps = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement(_Curve.Curve, _extends({}, otherProps, {
    type: "linear",
    className: className
  }));
};
var renderLabelItem = (option, props, value) => {
  if (/*#__PURE__*/React.isValidElement(option)) {
    // @ts-expect-error element cloning is not typed
    return /*#__PURE__*/React.cloneElement(option, props);
  }
  var label = value;
  if (typeof option === 'function') {
    label = option(props);
    if (/*#__PURE__*/React.isValidElement(label)) {
      return label;
    }
  }
  var className = (0, _clsx.clsx)('recharts-pie-label-text', (0, _getClassNameFromUnknown.getClassNameFromUnknown)(option));
  return /*#__PURE__*/React.createElement(_Text.Text, _extends({}, props, {
    alignmentBaseline: "middle",
    className: className
  }), label);
};
function PieLabels(_ref2) {
  var sectors = _ref2.sectors,
    props = _ref2.props,
    showLabels = _ref2.showLabels;
  var label = props.label,
    labelLine = props.labelLine,
    dataKey = props.dataKey;
  if (!showLabels || !label || !sectors) {
    return null;
  }
  var pieProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(props);
  var customLabelProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEventsFromUnknown)(label);
  var customLabelLineProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEventsFromUnknown)(labelLine);
  var offsetRadius = typeof label === 'object' && 'offsetRadius' in label && typeof label.offsetRadius === 'number' && label.offsetRadius || 20;
  var labels = sectors.map((entry, i) => {
    var midAngle = (entry.startAngle + entry.endAngle) / 2;
    var endPoint = (0, _PolarUtils.polarToCartesian)(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
    var labelProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, {
      // @ts-expect-error customLabelProps is contributing unknown props
      stroke: 'none'
    }, customLabelProps), {}, {
      index: i,
      textAnchor: getTextAnchor(endPoint.x, entry.cx)
    }, endPoint);
    var lineProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, {
      // @ts-expect-error customLabelLineProps is contributing unknown props
      fill: 'none',
      // @ts-expect-error customLabelLineProps is contributing unknown props
      stroke: entry.fill
    }, customLabelLineProps), {}, {
      index: i,
      points: [(0, _PolarUtils.polarToCartesian)(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint],
      key: 'line'
    });
    return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
      zIndex: _DefaultZIndexes.DefaultZIndexes.label,
      key: "label-".concat(entry.startAngle, "-").concat(entry.endAngle, "-").concat(entry.midAngle, "-").concat(i)
    }, /*#__PURE__*/React.createElement(_Layer.Layer, null, labelLine && renderLabelLineItem(labelLine, lineProps), renderLabelItem(label, labelProps, (0, _ChartUtils.getValueByDataKey)(entry, dataKey))));
  });
  return /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: "recharts-pie-labels"
  }, labels);
}
function PieLabelList(_ref3) {
  var sectors = _ref3.sectors,
    props = _ref3.props,
    showLabels = _ref3.showLabels;
  var label = props.label;
  if (typeof label === 'object' && label != null && 'position' in label) {
    return /*#__PURE__*/React.createElement(_LabelList.LabelListFromLabelProp, {
      label: label
    });
  }
  return /*#__PURE__*/React.createElement(PieLabels, {
    sectors: sectors,
    props: props,
    showLabels: showLabels
  });
}
function PieSectors(props) {
  var sectors = props.sectors,
    activeShape = props.activeShape,
    inactiveShapeProp = props.inactiveShape,
    allOtherPieProps = props.allOtherPieProps,
    shape = props.shape,
    id = props.id,
    animationElapsedTime = props.animationElapsedTime,
    isAnimating = props.isAnimating,
    isEntrance = props.isEntrance;
  var activeIndex = (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveTooltipIndex);
  var activeDataKey = (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveTooltipDataKey);
  var activeGraphicalItemId = (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveTooltipGraphicalItemId);
  var onMouseEnterFromProps = allOtherPieProps.onMouseEnter,
    onItemClickFromProps = allOtherPieProps.onClick,
    onMouseLeaveFromProps = allOtherPieProps.onMouseLeave,
    restOfAllOtherProps = _objectWithoutProperties(allOtherPieProps, _excluded2);
  var onMouseEnterFromContext = (0, _tooltipContext.useMouseEnterItemDispatch)(onMouseEnterFromProps, allOtherPieProps.dataKey, id);
  var onMouseLeaveFromContext = (0, _tooltipContext.useMouseLeaveItemDispatch)(onMouseLeaveFromProps);
  var onClickFromContext = (0, _tooltipContext.useMouseClickItemDispatch)(onItemClickFromProps, allOtherPieProps.dataKey, id);
  if (sectors == null || sectors.length === 0) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, sectors.map((entry, i) => {
    if ((entry === null || entry === void 0 ? void 0 : entry.startAngle) === 0 && (entry === null || entry === void 0 ? void 0 : entry.endAngle) === 0 && sectors.length !== 1) return null;

    // For Pie charts, when multiple Pies share the same dataKey, we need to ensure only the hovered Pie's sector is active.
    // We do this by checking if the active graphical item ID matches this Pie's ID.
    var graphicalItemMatches = activeGraphicalItemId == null || activeGraphicalItemId === id;
    var isActive = String(i) === activeIndex && (activeDataKey == null || allOtherPieProps.dataKey === activeDataKey) && graphicalItemMatches;
    var inactiveShape = activeIndex ? inactiveShapeProp : null;
    var sectorOptions = activeShape && isActive ? activeShape : inactiveShape;
    var sectorProps = _objectSpread(_objectSpread({}, entry), {}, {
      stroke: entry.stroke,
      tabIndex: -1,
      index: i,
      isActive,
      animationElapsedTime,
      isAnimating,
      isEntrance,
      [_Constants.DATA_ITEM_INDEX_ATTRIBUTE_NAME]: i,
      [_Constants.DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME]: id
    });
    return /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
      key: "sector-".concat(entry === null || entry === void 0 ? void 0 : entry.startAngle, "-").concat(entry === null || entry === void 0 ? void 0 : entry.endAngle, "-").concat(entry.midAngle, "-").concat(i),
      tabIndex: -1,
      className: "recharts-pie-sector"
    }, (0, _types.adaptEventsOfChild)(restOfAllOtherProps, entry, i), {
      onMouseEnter: onMouseEnterFromContext(entry, i),
      onMouseLeave: onMouseLeaveFromContext(entry, i),
      onClick: onClickFromContext(entry, i)
    }), /*#__PURE__*/React.createElement(_ActiveShapeUtils.Shape, {
      option: sectorOptions !== null && sectorOptions !== void 0 ? sectorOptions : shape,
      DefaultShape: defaultPieSectorShape,
      shapeProps: sectorProps
    }));
  }));
}
function computePieSectors(_ref4) {
  var _pieSettings$paddingA;
  var pieSettings = _ref4.pieSettings,
    displayedData = _ref4.displayedData,
    cells = _ref4.cells,
    offset = _ref4.offset;
  var cornerRadius = pieSettings.cornerRadius,
    startAngle = pieSettings.startAngle,
    endAngle = pieSettings.endAngle,
    dataKey = pieSettings.dataKey,
    nameKey = pieSettings.nameKey,
    tooltipType = pieSettings.tooltipType;
  var minAngle = Math.abs(pieSettings.minAngle);
  var deltaAngle = parseDeltaAngle(startAngle, endAngle);
  var absDeltaAngle = Math.abs(deltaAngle);
  var paddingAngle = displayedData.length <= 1 ? 0 : (_pieSettings$paddingA = pieSettings.paddingAngle) !== null && _pieSettings$paddingA !== void 0 ? _pieSettings$paddingA : 0;
  var notZeroItemCount = displayedData.filter(entry => (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0) !== 0).length;
  var totalPaddingAngle = (absDeltaAngle >= 360 ? notZeroItemCount : notZeroItemCount - 1) * paddingAngle;
  var sum = displayedData.reduce((result, entry) => {
    var val = (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0);
    return result + ((0, _DataUtils.isNumber)(val) ? val : 0);
  }, 0);

  // Only apply minAngle redistribution when at least one non-zero segment's
  // natural angle falls below the minAngle threshold. Otherwise, minAngle
  // unnecessarily shifts all segments even when none need the boost.
  // See: https://github.com/recharts/recharts/issues/6814
  var needsMinAngleAdjustment = minAngle > 0 && sum > 0 && displayedData.some(entry => {
    var val = (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0);
    var percent = ((0, _DataUtils.isNumber)(val) ? val : 0) / sum;
    return val !== 0 && percent * absDeltaAngle < minAngle;
  });
  var effectiveMinAngle = needsMinAngleAdjustment ? minAngle : 0;
  var realTotalAngle = absDeltaAngle - notZeroItemCount * effectiveMinAngle - totalPaddingAngle;
  var sectors;
  if (sum > 0) {
    var prev;
    sectors = displayedData.map((entry, i) => {
      var val = (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0);
      var name = (0, _ChartUtils.getValueByDataKey)(entry, nameKey, i);
      var coordinate = parseCoordinateOfPie(pieSettings, offset, entry);
      var percent = ((0, _DataUtils.isNumber)(val) ? val : 0) / sum;
      var tempStartAngle;

      // @ts-expect-error can't spread unknown
      var entryWithCellInfo = _objectSpread(_objectSpread({}, entry), cells && cells[i] && cells[i].props);
      var sectorColor = entryWithCellInfo != null && 'fill' in entryWithCellInfo && typeof entryWithCellInfo.fill === 'string' ? entryWithCellInfo.fill : pieSettings.fill;
      if (i) {
        tempStartAngle = prev.endAngle + (0, _DataUtils.mathSign)(deltaAngle) * paddingAngle * (val !== 0 ? 1 : 0);
      } else {
        tempStartAngle = startAngle;
      }
      var tempEndAngle = tempStartAngle + (0, _DataUtils.mathSign)(deltaAngle) * ((val !== 0 ? effectiveMinAngle : 0) + percent * realTotalAngle);
      var midAngle = (tempStartAngle + tempEndAngle) / 2;
      var middleRadius = (coordinate.innerRadius + coordinate.outerRadius) / 2;
      var tooltipPayload = [{
        name,
        value: val,
        payload: entryWithCellInfo,
        dataKey,
        type: tooltipType,
        color: sectorColor,
        fill: sectorColor,
        graphicalItemId: pieSettings.id
      }];
      var tooltipPosition = (0, _PolarUtils.polarToCartesian)(coordinate.cx, coordinate.cy, middleRadius, midAngle);
      prev = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieSettings.presentationProps), {}, {
        percent,
        cornerRadius: typeof cornerRadius === 'string' ? parseFloat(cornerRadius) : cornerRadius,
        name,
        tooltipPayload,
        midAngle,
        middleRadius,
        tooltipPosition
      }, entryWithCellInfo), coordinate), {}, {
        value: val,
        dataKey,
        startAngle: tempStartAngle,
        endAngle: tempEndAngle,
        payload: entryWithCellInfo,
        paddingAngle: val !== 0 ? (0, _DataUtils.mathSign)(deltaAngle) * paddingAngle : 0
      });
      return prev;
    });
  }
  return sectors;
}
function PieLabelListProvider(_ref5) {
  var showLabels = _ref5.showLabels,
    sectors = _ref5.sectors,
    children = _ref5.children;
  var labelListEntries = (0, _react.useMemo)(() => {
    if (!showLabels || !sectors) {
      return [];
    }
    return sectors.map(entry => ({
      value: entry.value,
      payload: entry.payload,
      clockWise: false,
      parentViewBox: undefined,
      viewBox: {
        cx: entry.cx,
        cy: entry.cy,
        innerRadius: entry.innerRadius,
        outerRadius: entry.outerRadius,
        startAngle: entry.startAngle,
        endAngle: entry.endAngle,
        clockWise: false
      },
      fill: entry.fill
    }));
  }, [sectors, showLabels]);
  return /*#__PURE__*/React.createElement(_LabelList.PolarLabelListContextProvider, {
    value: showLabels ? labelListEntries : undefined
  }, children);
}
var defaultPieAnimateItems = (items, animationElapsedTime) => {
  if (items == null) return [];
  var stepData = [];
  var firstNonRemoved = items.find(item => item.status !== 'removed');
  var curAngle = firstNonRemoved ? firstNonRemoved.next.startAngle : 0;
  items.forEach((item, index) => {
    if (item.status === 'removed') return;
    var paddingAngle = index > 0 ? (0, _get.default)(item.next, 'paddingAngle', 0) : 0;
    if (item.status === 'matched') {
      var angle = (0, _DataUtils.interpolate)(item.prev.endAngle - item.prev.startAngle, item.next.endAngle - item.next.startAngle, animationElapsedTime);
      var latest = _objectSpread(_objectSpread({}, item.next), {}, {
        startAngle: curAngle + paddingAngle,
        endAngle: curAngle + angle + paddingAngle
      });
      stepData.push(latest);
      curAngle = latest.endAngle;
    } else {
      // added
      var deltaAngle = (0, _DataUtils.interpolate)(0, item.next.endAngle - item.next.startAngle, animationElapsedTime);
      var _latest = _objectSpread(_objectSpread({}, item.next), {}, {
        startAngle: curAngle + paddingAngle,
        endAngle: curAngle + deltaAngle + paddingAngle
      });
      stepData.push(_latest);
      curAngle = _latest.endAngle;
    }
  });
  return stepData;
};
function SectorsWithAnimation(_ref6) {
  var _firstSector$cx, _firstSector$cy, _firstSector$innerRad, _firstSector$outerRad;
  var props = _ref6.props,
    previousSectorsRef = _ref6.previousSectorsRef,
    id = _ref6.id;
  var sectors = props.sectors,
    activeShape = props.activeShape,
    inactiveShape = props.inactiveShape,
    animationInterpolateFn = props.animationInterpolateFn;
  var _useAnimationCallback = (0, _AnimatedItems.useAnimationCallbacks)(props.onAnimationStart, props.onAnimationEnd),
    isAnimating = _useAnimationCallback.isAnimating,
    handleAnimationStart = _useAnimationCallback.handleAnimationStart,
    handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
  var layout = (0, _chartLayoutContext.usePolarChartLayout)();
  if (layout == null) return null;
  var firstSector = sectors[0];
  return /*#__PURE__*/React.createElement(PieLabelListProvider, {
    showLabels: !isAnimating,
    sectors: sectors
  }, /*#__PURE__*/React.createElement(_AnimatedItems.AnimatedItems, {
    animationInput: props,
    animationIdPrefix: "recharts-pie-",
    items: sectors,
    previousItemsRef: previousSectorsRef,
    isAnimationActive: props.isAnimationActive,
    animationBegin: props.animationBegin,
    animationDuration: props.animationDuration,
    animationEasing: props.animationEasing,
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd,
    animationInterpolateFn: animationInterpolateFn,
    animationMatchBy: props.animationMatchBy,
    layout: layout
  }, (stepData, animationElapsedTime, isEntrance) => /*#__PURE__*/React.createElement(_Layer.Layer, null, /*#__PURE__*/React.createElement(PieSectors, {
    sectors: stepData,
    activeShape: activeShape,
    inactiveShape: inactiveShape,
    allOtherPieProps: props,
    shape: props.shape,
    id: id,
    animationElapsedTime: animationElapsedTime,
    isAnimating: isAnimating || animationElapsedTime < 1,
    isEntrance: isEntrance
  }))), /*#__PURE__*/React.createElement(PieLabelList, {
    showLabels: !isAnimating,
    sectors: sectors,
    props: props
  }), /*#__PURE__*/React.createElement(_Label.PolarLabelContextProvider, {
    cx: (_firstSector$cx = firstSector === null || firstSector === void 0 ? void 0 : firstSector.cx) !== null && _firstSector$cx !== void 0 ? _firstSector$cx : 0,
    cy: (_firstSector$cy = firstSector === null || firstSector === void 0 ? void 0 : firstSector.cy) !== null && _firstSector$cy !== void 0 ? _firstSector$cy : 0,
    innerRadius: (_firstSector$innerRad = firstSector === null || firstSector === void 0 ? void 0 : firstSector.innerRadius) !== null && _firstSector$innerRad !== void 0 ? _firstSector$innerRad : 0,
    outerRadius: (_firstSector$outerRad = firstSector === null || firstSector === void 0 ? void 0 : firstSector.outerRadius) !== null && _firstSector$outerRad !== void 0 ? _firstSector$outerRad : 0,
    startAngle: props.startAngle,
    endAngle: props.endAngle,
    clockWise: false
  }, props.children));
}
var defaultPieProps = exports.defaultPieProps = {
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: 'ease',
  animationInterpolateFn: defaultPieAnimateItems,
  animationMatchBy: _matchBy.matchAppend,
  cx: '50%',
  cy: '50%',
  dataKey: 'value',
  endAngle: 360,
  fill: '#808080',
  hide: false,
  innerRadius: 0,
  isAnimationActive: 'auto',
  label: false,
  labelLine: true,
  legendType: 'rect',
  minAngle: 0,
  nameKey: 'name',
  outerRadius: '80%',
  paddingAngle: 0,
  rootTabIndex: 0,
  shape: defaultPieSectorShape,
  startAngle: 0,
  stroke: '#fff',
  zIndex: _DefaultZIndexes.DefaultZIndexes.area
};
function PieImpl(props) {
  var id = props.id,
    propsWithoutId = _objectWithoutProperties(props, _excluded3);
  var hide = props.hide,
    className = props.className,
    rootTabIndex = props.rootTabIndex;
  var cells = (0, _react.useMemo)(() => (0, _ReactUtils.findAllByType)(props.children, _Cell.Cell), [props.children]);
  var sectors = (0, _hooks.useAppSelector)(state => (0, _pieSelectors.selectPieSectors)(state, id, cells));
  var previousSectorsRef = (0, _react.useRef)(null);
  var layerClass = (0, _clsx.clsx)('recharts-pie', className);
  if (hide || sectors == null) {
    previousSectorsRef.current = null;
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      tabIndex: rootTabIndex,
      className: layerClass
    });
  }
  return /*#__PURE__*/React.createElement(_ZIndexLayer.ZIndexLayer, {
    zIndex: props.zIndex
  }, /*#__PURE__*/React.createElement(SetPieTooltipEntrySettings, {
    dataKey: props.dataKey,
    nameKey: props.nameKey,
    sectors: sectors,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    tooltipType: props.tooltipType,
    formatter: props.formatter,
    id: id,
    activeShape: props.activeShape
  }), /*#__PURE__*/React.createElement(_Layer.Layer, {
    tabIndex: rootTabIndex,
    className: layerClass
  }, /*#__PURE__*/React.createElement(SectorsWithAnimation, {
    props: _objectSpread(_objectSpread({}, propsWithoutId), {}, {
      sectors
    }),
    previousSectorsRef: previousSectorsRef,
    id: id
  })));
}
/**
 * @consumes PolarChartContext
 * @provides LabelListContext
 * @provides CellReader
 */
function PieFn(outsideProps) {
  var props = (0, _resolveDefaultProps.resolveDefaultProps)(outsideProps, defaultPieProps);
  var externalId = props.id,
    propsWithoutId = _objectWithoutProperties(props, _excluded4);
  var presentationProps = (0, _svgPropertiesNoEvents.svgPropertiesNoEvents)(propsWithoutId);
  return /*#__PURE__*/React.createElement(_RegisterGraphicalItemId.RegisterGraphicalItemId, {
    id: externalId,
    type: "pie"
  }, id => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_SetGraphicalItem.SetPolarGraphicalItem, {
    type: "pie",
    id: id,
    data: propsWithoutId.data,
    dataKey: propsWithoutId.dataKey,
    hide: propsWithoutId.hide,
    angleAxisId: 0,
    radiusAxisId: 0,
    name: propsWithoutId.name,
    nameKey: propsWithoutId.nameKey,
    tooltipType: propsWithoutId.tooltipType,
    legendType: propsWithoutId.legendType,
    fill: propsWithoutId.fill,
    cx: propsWithoutId.cx,
    cy: propsWithoutId.cy,
    startAngle: propsWithoutId.startAngle,
    endAngle: propsWithoutId.endAngle,
    paddingAngle: propsWithoutId.paddingAngle,
    minAngle: propsWithoutId.minAngle,
    innerRadius: propsWithoutId.innerRadius,
    outerRadius: propsWithoutId.outerRadius,
    cornerRadius: propsWithoutId.cornerRadius,
    presentationProps: presentationProps,
    maxRadius: props.maxRadius
  }), /*#__PURE__*/React.createElement(SetPiePayloadLegend, _extends({}, propsWithoutId, {
    id: id
  })), /*#__PURE__*/React.createElement(PieImpl, _extends({}, propsWithoutId, {
    id: id
  }))));
}
var Pie = exports.Pie = PieFn;
// @ts-expect-error we need to set the displayName for debugging purposes
Pie.displayName = 'Pie';