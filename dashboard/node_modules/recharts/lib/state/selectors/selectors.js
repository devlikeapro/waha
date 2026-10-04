"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChartName = exports.selectTooltipPayloadConfigurations = exports.selectTooltipPayload = exports.selectTooltipInteractionState = exports.selectTooltipDataKey = exports.selectOrderedTooltipTicks = exports.selectIsTooltipActive = exports.selectCoordinateForDefaultIndex = exports.selectActiveLabel = exports.selectActiveIndex = exports.selectActiveCoordinate = exports.combineActiveProps = void 0;
var _reselect = require("reselect");
var _sortBy = _interopRequireDefault(require("es-toolkit/compat/sortBy"));
var _hooks = require("../hooks");
var _ChartUtils = require("../../util/ChartUtils");
var _dataSelectors = require("./dataSelectors");
var _tooltipSelectors = require("./tooltipSelectors");
var _axisSelectors = require("./axisSelectors");
var _rootPropsSelectors = require("./rootPropsSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _containerSelectors = require("./containerSelectors");
var _combineActiveLabel = require("./combiners/combineActiveLabel");
var _combineTooltipInteractionState = require("./combiners/combineTooltipInteractionState");
var _combineActiveTooltipIndex = require("./combiners/combineActiveTooltipIndex");
var _combineCoordinateForDefaultIndex = require("./combiners/combineCoordinateForDefaultIndex");
var _combineTooltipPayloadConfigurations = require("./combiners/combineTooltipPayloadConfigurations");
var _selectTooltipPayloadSearcher = require("./selectTooltipPayloadSearcher");
var _selectTooltipState = require("./selectTooltipState");
var _combineTooltipPayload = require("./combiners/combineTooltipPayload");
var _getActiveCoordinate = require("../../util/getActiveCoordinate");
var _PolarUtils = require("../../util/PolarUtils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var useChartName = () => {
  return (0, _hooks.useAppSelector)(_rootPropsSelectors.selectChartName);
};
exports.useChartName = useChartName;
var pickTooltipEventType = (_state, tooltipEventType) => tooltipEventType;
var pickTrigger = (_state, _tooltipEventType, trigger) => trigger;
var pickDefaultIndex = (_state, _tooltipEventType, _trigger, defaultIndex) => defaultIndex;
var selectOrderedTooltipTicks = exports.selectOrderedTooltipTicks = (0, _reselect.createSelector)(_tooltipSelectors.selectTooltipAxisTicks, ticks => (0, _sortBy.default)(ticks, o => o.coordinate));
var selectTooltipInteractionState = exports.selectTooltipInteractionState = (0, _reselect.createSelector)([_selectTooltipState.selectTooltipState, pickTooltipEventType, pickTrigger, pickDefaultIndex], _combineTooltipInteractionState.combineTooltipInteractionState);
var selectActiveIndex = exports.selectActiveIndex = (0, _reselect.createSelector)([selectTooltipInteractionState, _tooltipSelectors.selectTooltipDisplayedData, _axisSelectors.selectTooltipAxisDataKey, _tooltipSelectors.selectTooltipAxisDomain], _combineActiveTooltipIndex.combineActiveTooltipIndex);
var selectTooltipDataKey = (state, tooltipEventType, trigger) => {
  if (tooltipEventType == null) {
    return undefined;
  }
  var tooltipState = (0, _selectTooltipState.selectTooltipState)(state);
  if (tooltipEventType === 'axis') {
    if (trigger === 'hover') {
      return tooltipState.axisInteraction.hover.dataKey;
    }
    return tooltipState.axisInteraction.click.dataKey;
  }
  if (trigger === 'hover') {
    return tooltipState.itemInteraction.hover.dataKey;
  }
  return tooltipState.itemInteraction.click.dataKey;
};
exports.selectTooltipDataKey = selectTooltipDataKey;
var selectTooltipPayloadConfigurations = exports.selectTooltipPayloadConfigurations = (0, _reselect.createSelector)([_selectTooltipState.selectTooltipState, pickTooltipEventType, pickTrigger, pickDefaultIndex], _combineTooltipPayloadConfigurations.combineTooltipPayloadConfigurations);
var selectCoordinateForDefaultIndex = exports.selectCoordinateForDefaultIndex = (0, _reselect.createSelector)([_containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight, _chartLayoutContext.selectChartLayout, _selectChartOffsetInternal.selectChartOffsetInternal, _tooltipSelectors.selectTooltipAxisTicks, pickDefaultIndex, selectTooltipPayloadConfigurations], _combineCoordinateForDefaultIndex.combineCoordinateForDefaultIndex);
var selectActiveCoordinate = exports.selectActiveCoordinate = (0, _reselect.createSelector)([selectTooltipInteractionState, selectCoordinateForDefaultIndex], (tooltipInteractionState, defaultIndexCoordinate) => {
  var _tooltipInteractionSt;
  return (_tooltipInteractionSt = tooltipInteractionState.coordinate) !== null && _tooltipInteractionSt !== void 0 ? _tooltipInteractionSt : defaultIndexCoordinate;
});
var selectActiveLabel = exports.selectActiveLabel = (0, _reselect.createSelector)([_tooltipSelectors.selectTooltipAxisTicks, selectActiveIndex], _combineActiveLabel.combineActiveLabel);
var selectTooltipPayload = exports.selectTooltipPayload = (0, _reselect.createSelector)([selectTooltipPayloadConfigurations, selectActiveIndex, _dataSelectors.selectChartDataWithIndexes, _axisSelectors.selectTooltipAxisDataKey, selectActiveLabel, _selectTooltipPayloadSearcher.selectTooltipPayloadSearcher, pickTooltipEventType], _combineTooltipPayload.combineTooltipPayload);
var selectIsTooltipActive = exports.selectIsTooltipActive = (0, _reselect.createSelector)([selectTooltipInteractionState, selectActiveIndex], (tooltipInteractionState, activeIndex) => {
  return {
    isActive: tooltipInteractionState.active && activeIndex != null,
    activeIndex
  };
});
var combineActiveCartesianProps = (chartEvent, layout, tooltipAxisType, tooltipAxisRange, tooltipTicks, orderedTooltipTicks, offset) => {
  if (!chartEvent || !tooltipAxisType || !tooltipAxisRange || !tooltipTicks) {
    return undefined;
  }
  if (!(0, _getActiveCoordinate.isInCartesianRange)(chartEvent, offset)) {
    return undefined;
  }
  var pos = (0, _ChartUtils.calculateCartesianTooltipPos)(chartEvent, layout);
  var activeIndex = (0, _getActiveCoordinate.calculateActiveTickIndex)(pos, orderedTooltipTicks, tooltipTicks, tooltipAxisType, tooltipAxisRange);
  var activeCoordinate = (0, _getActiveCoordinate.getActiveCartesianCoordinate)(layout, tooltipTicks, activeIndex, chartEvent);
  return {
    activeIndex: String(activeIndex),
    activeCoordinate
  };
};
var combineActivePolarProps = (chartEvent, layout, polarViewBox, tooltipAxisType, tooltipAxisRange, tooltipTicks, orderedTooltipTicks) => {
  if (!chartEvent || !tooltipAxisType || !tooltipAxisRange || !tooltipTicks || !polarViewBox) {
    return undefined;
  }
  var rangeObj = (0, _PolarUtils.inRangeOfSector)(chartEvent, polarViewBox);
  if (!rangeObj) {
    return undefined;
  }
  var pos = (0, _ChartUtils.calculatePolarTooltipPos)(rangeObj, layout);
  var activeIndex = (0, _getActiveCoordinate.calculateActiveTickIndex)(pos, orderedTooltipTicks, tooltipTicks, tooltipAxisType, tooltipAxisRange);
  var activeCoordinate = (0, _getActiveCoordinate.getActivePolarCoordinate)(layout, tooltipTicks, activeIndex, rangeObj);
  return {
    activeIndex: String(activeIndex),
    activeCoordinate
  };
};
var combineActiveProps = (chartEvent, layout, polarViewBox, tooltipAxisType, tooltipAxisRange, tooltipTicks, orderedTooltipTicks, offset) => {
  if (!chartEvent || !layout || !tooltipAxisType || !tooltipAxisRange || !tooltipTicks) {
    return undefined;
  }
  if (layout === 'horizontal' || layout === 'vertical') {
    return combineActiveCartesianProps(chartEvent, layout, tooltipAxisType, tooltipAxisRange, tooltipTicks, orderedTooltipTicks, offset);
  }
  return combineActivePolarProps(chartEvent, layout, polarViewBox, tooltipAxisType, tooltipAxisRange, tooltipTicks, orderedTooltipTicks);
};
exports.combineActiveProps = combineActiveProps;