"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectFunnelTrapezoids = void 0;
var _reselect = require("reselect");
var _Funnel = require("../../cartesian/Funnel");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _dataSelectors = require("./dataSelectors");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var pickFunnelSettings = (_state, funnelSettings) => funnelSettings;
var selectFunnelTrapezoids = exports.selectFunnelTrapezoids = (0, _reselect.createSelector)([_selectChartOffsetInternal.selectChartOffsetInternal, pickFunnelSettings, _dataSelectors.selectChartDataAndAlwaysIgnoreIndexes], (offset, _ref, _ref2) => {
  var data = _ref.data,
    dataKey = _ref.dataKey,
    nameKey = _ref.nameKey,
    tooltipType = _ref.tooltipType,
    lastShapeType = _ref.lastShapeType,
    reversed = _ref.reversed,
    customWidth = _ref.customWidth,
    cells = _ref.cells,
    presentationProps = _ref.presentationProps,
    graphicalItemId = _ref.id;
  var chartData = _ref2.chartData;
  var displayedData;
  if (data != null && data.length > 0) {
    displayedData = data;
  } else if (chartData != null && chartData.length > 0) {
    displayedData = chartData;
  }
  if (displayedData && displayedData.length) {
    displayedData = displayedData.map((entry, index) => _objectSpread(_objectSpread(_objectSpread({
      payload: entry
    }, presentationProps), entry), cells && cells[index] && cells[index].props));
  } else if (cells && cells.length) {
    displayedData = cells.map(cell => _objectSpread(_objectSpread({}, presentationProps), cell.props));
  } else {
    return [];
  }
  return (0, _Funnel.computeFunnelTrapezoids)({
    dataKey,
    nameKey,
    displayedData,
    tooltipType,
    lastShapeType,
    reversed,
    offset,
    customWidth,
    graphicalItemId
  });
});