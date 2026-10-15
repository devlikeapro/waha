"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectTooltipGraphicalItemsData = exports.selectTooltipDisplayedData = exports.selectTooltipCategoricalDomain = exports.selectTooltipAxisTicks = exports.selectTooltipAxisScale = exports.selectTooltipAxisRealScaleType = exports.selectTooltipAxisRangeWithReverse = exports.selectTooltipAxisDomainIncludingNiceTicks = exports.selectTooltipAxisDomain = exports.selectIsTooltipActive = exports.selectAllUnfilteredGraphicalItems = exports.selectAllGraphicalItemsSettings = exports.selectActiveTooltipPayload = exports.selectActiveTooltipIndex = exports.selectActiveTooltipGraphicalItemId = exports.selectActiveTooltipDataPoints = exports.selectActiveTooltipDataKey = exports.selectActiveTooltipCoordinate = exports.selectActiveLabel = void 0;
var _reselect = require("reselect");
var _axisSelectors = require("./axisSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _ChartUtils = require("../../util/ChartUtils");
var _dataSelectors = require("./dataSelectors");
var _rootPropsSelectors = require("./rootPropsSelectors");
var _DataUtils = require("../../util/DataUtils");
var _combineAxisRangeWithReverse = require("./combiners/combineAxisRangeWithReverse");
var _selectTooltipEventType = require("./selectTooltipEventType");
var _combineActiveLabel = require("./combiners/combineActiveLabel");
var _selectTooltipSettings = require("./selectTooltipSettings");
var _combineTooltipInteractionState = require("./combiners/combineTooltipInteractionState");
var _combineActiveTooltipIndex = require("./combiners/combineActiveTooltipIndex");
var _combineCoordinateForDefaultIndex = require("./combiners/combineCoordinateForDefaultIndex");
var _containerSelectors = require("./containerSelectors");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _combineTooltipPayloadConfigurations = require("./combiners/combineTooltipPayloadConfigurations");
var _selectTooltipPayloadSearcher = require("./selectTooltipPayloadSearcher");
var _selectTooltipState = require("./selectTooltipState");
var _combineTooltipPayload = require("./combiners/combineTooltipPayload");
var _selectTooltipAxisId = require("./selectTooltipAxisId");
var _selectTooltipAxisType = require("./selectTooltipAxisType");
var _combineDisplayedStackedData = require("./combiners/combineDisplayedStackedData");
var _StackedGraphicalItem = require("../types/StackedGraphicalItem");
var _isDomainSpecifiedByUser = require("../../util/isDomainSpecifiedByUser");
var _numberDomainEqualityCheck = require("./numberDomainEqualityCheck");
var _arrayEqualityCheck = require("./arrayEqualityCheck");
var _RechartsScale = require("../../util/scale/RechartsScale");
var _isWellBehavedNumber = require("../../util/isWellBehavedNumber");
var _combineRealScaleType = require("./combiners/combineRealScaleType");
var _combineConfiguredScale = require("./combiners/combineConfiguredScale");
var selectTooltipAxisRealScaleType = exports.selectTooltipAxisRealScaleType = (0, _reselect.createSelector)([_axisSelectors.selectTooltipAxis, _axisSelectors.selectHasBar, _rootPropsSelectors.selectChartName], _combineRealScaleType.combineRealScaleType);
var selectAllUnfilteredGraphicalItems = exports.selectAllUnfilteredGraphicalItems = (0, _reselect.createSelector)([state => state.graphicalItems.cartesianItems, state => state.graphicalItems.polarItems], (cartesianItems, polarItems) => [...cartesianItems, ...polarItems]);
var selectTooltipAxisPredicate = (0, _reselect.createSelector)([_selectTooltipAxisType.selectTooltipAxisType, _selectTooltipAxisId.selectTooltipAxisId], _axisSelectors.itemAxisPredicate);
var selectAllGraphicalItemsSettings = exports.selectAllGraphicalItemsSettings = (0, _reselect.createSelector)([selectAllUnfilteredGraphicalItems, _axisSelectors.selectTooltipAxis, selectTooltipAxisPredicate], _axisSelectors.combineGraphicalItemsSettings, {
  memoizeOptions: {
    resultEqualityCheck: _arrayEqualityCheck.emptyArraysAreEqualCheck
  }
});
var selectAllStackedGraphicalItemsSettings = (0, _reselect.createSelector)([selectAllGraphicalItemsSettings], graphicalItems => graphicalItems.filter(_StackedGraphicalItem.isStacked));
var selectTooltipGraphicalItemsData = exports.selectTooltipGraphicalItemsData = (0, _reselect.createSelector)([selectAllGraphicalItemsSettings], _axisSelectors.combineGraphicalItemsData, {
  memoizeOptions: {
    resultEqualityCheck: _arrayEqualityCheck.emptyArraysAreEqualCheck
  }
});
var selectAnyTooltipItemUsesChartData = (0, _reselect.createSelector)([selectAllGraphicalItemsSettings], items => items.some(item => !item.data));

/**
 * Data for tooltip always use the data with indexes set by a Brush,
 * and never accept the isPanorama flag:
 * because Tooltip never displays inside the panorama anyway
 * so we don't need to worry what would happen there.
 */
var selectTooltipDisplayedData = exports.selectTooltipDisplayedData = (0, _reselect.createSelector)([selectTooltipGraphicalItemsData, _dataSelectors.selectChartDataWithIndexes], _axisSelectors.combineDisplayedData);
var selectTooltipStackedData = (0, _reselect.createSelector)([selectAllStackedGraphicalItemsSettings, _dataSelectors.selectChartDataWithIndexes, _axisSelectors.selectTooltipAxis], _combineDisplayedStackedData.combineDisplayedStackedData);
var selectAllTooltipAppliedValues = (0, _reselect.createSelector)([selectTooltipDisplayedData, _axisSelectors.selectTooltipAxis, selectAllGraphicalItemsSettings, _dataSelectors.selectChartDataWithIndexes, selectAnyTooltipItemUsesChartData, selectTooltipGraphicalItemsData], _axisSelectors.combineAllAppliedValues);
var selectTooltipAxisDomainDefinition = (0, _reselect.createSelector)([_axisSelectors.selectTooltipAxis], _axisSelectors.getDomainDefinition);
var selectTooltipDataOverflow = (0, _reselect.createSelector)([_axisSelectors.selectTooltipAxis], axisSettings => axisSettings.allowDataOverflow);
var selectTooltipDomainFromUserPreferences = (0, _reselect.createSelector)([selectTooltipAxisDomainDefinition, selectTooltipDataOverflow], _isDomainSpecifiedByUser.numericalDomainSpecifiedWithoutRequiringData);
var selectAllStackedGraphicalItems = (0, _reselect.createSelector)([selectAllGraphicalItemsSettings], graphicalItems => graphicalItems.filter(_StackedGraphicalItem.isStacked));
var selectTooltipStackGroups = (0, _reselect.createSelector)([selectTooltipStackedData, selectAllStackedGraphicalItems, _rootPropsSelectors.selectStackOffsetType, _rootPropsSelectors.selectReverseStackOrder], _axisSelectors.combineStackGroups);
var selectTooltipDomainOfStackGroups = (0, _reselect.createSelector)([selectTooltipStackGroups, _dataSelectors.selectChartDataWithIndexes, _selectTooltipAxisType.selectTooltipAxisType, selectTooltipDomainFromUserPreferences], _axisSelectors.combineDomainOfStackGroups);
var selectTooltipItemsSettingsExceptStacked = (0, _reselect.createSelector)([selectAllGraphicalItemsSettings], _axisSelectors.filterGraphicalNotStackedItems);
var selectDomainOfAllAppliedNumericalValuesIncludingErrorValues = (0, _reselect.createSelector)([selectTooltipDisplayedData, _axisSelectors.selectTooltipAxis, selectTooltipItemsSettingsExceptStacked, _axisSelectors.selectAllErrorBarSettings, _selectTooltipAxisType.selectTooltipAxisType, _dataSelectors.selectChartDataSliceWithIndexes], _axisSelectors.combineDomainOfAllAppliedNumericalValuesIncludingErrorValues, {
  memoizeOptions: {
    resultEqualityCheck: _numberDomainEqualityCheck.numberDomainEqualityCheck
  }
});
var selectReferenceDotsByTooltipAxis = (0, _reselect.createSelector)([_axisSelectors.selectReferenceDots, _selectTooltipAxisType.selectTooltipAxisType, _selectTooltipAxisId.selectTooltipAxisId], _axisSelectors.filterReferenceElements);
var selectTooltipReferenceDotsDomain = (0, _reselect.createSelector)([selectReferenceDotsByTooltipAxis, _selectTooltipAxisType.selectTooltipAxisType], _axisSelectors.combineDotsDomain);
var selectReferenceAreasByTooltipAxis = (0, _reselect.createSelector)([_axisSelectors.selectReferenceAreas, _selectTooltipAxisType.selectTooltipAxisType, _selectTooltipAxisId.selectTooltipAxisId], _axisSelectors.filterReferenceElements);
var selectTooltipReferenceAreasDomain = (0, _reselect.createSelector)([selectReferenceAreasByTooltipAxis, _selectTooltipAxisType.selectTooltipAxisType], _axisSelectors.combineAreasDomain);
var selectReferenceLinesByTooltipAxis = (0, _reselect.createSelector)([_axisSelectors.selectReferenceLines, _selectTooltipAxisType.selectTooltipAxisType, _selectTooltipAxisId.selectTooltipAxisId], _axisSelectors.filterReferenceElements);
var selectTooltipReferenceLinesDomain = (0, _reselect.createSelector)([selectReferenceLinesByTooltipAxis, _selectTooltipAxisType.selectTooltipAxisType], _axisSelectors.combineLinesDomain);
var selectTooltipReferenceElementsDomain = (0, _reselect.createSelector)([selectTooltipReferenceDotsDomain, selectTooltipReferenceLinesDomain, selectTooltipReferenceAreasDomain], _axisSelectors.mergeDomains);
var selectTooltipNumericalDomain = (0, _reselect.createSelector)([_axisSelectors.selectTooltipAxis, selectTooltipAxisDomainDefinition, selectTooltipDomainFromUserPreferences, selectTooltipDomainOfStackGroups, selectDomainOfAllAppliedNumericalValuesIncludingErrorValues, selectTooltipReferenceElementsDomain, _chartLayoutContext.selectChartLayout, _selectTooltipAxisType.selectTooltipAxisType], _axisSelectors.combineNumericalDomain);
var selectTooltipAxisDomain = exports.selectTooltipAxisDomain = (0, _reselect.createSelector)([_axisSelectors.selectTooltipAxis, _chartLayoutContext.selectChartLayout, selectTooltipDisplayedData, selectAllTooltipAppliedValues, _rootPropsSelectors.selectStackOffsetType, _selectTooltipAxisType.selectTooltipAxisType, selectTooltipNumericalDomain], _axisSelectors.combineAxisDomain);
var selectTooltipNiceTicks = (0, _reselect.createSelector)([selectTooltipAxisDomain, _axisSelectors.selectTooltipAxis, selectTooltipAxisRealScaleType], _axisSelectors.combineNiceTicks);
var selectTooltipAxisDomainIncludingNiceTicks = exports.selectTooltipAxisDomainIncludingNiceTicks = (0, _reselect.createSelector)([_axisSelectors.selectTooltipAxis, selectTooltipAxisDomain, selectTooltipNiceTicks, _selectTooltipAxisType.selectTooltipAxisType], _axisSelectors.combineAxisDomainWithNiceTicks);
var selectTooltipAxisRange = state => {
  var axisType = (0, _selectTooltipAxisType.selectTooltipAxisType)(state);
  var axisId = (0, _selectTooltipAxisId.selectTooltipAxisId)(state);
  var isPanorama = false; // Tooltip never displays in panorama so this is safe to assume
  return (0, _axisSelectors.selectAxisRange)(state, axisType, axisId, isPanorama);
};
var selectTooltipAxisRangeWithReverse = exports.selectTooltipAxisRangeWithReverse = (0, _reselect.createSelector)([_axisSelectors.selectTooltipAxis, selectTooltipAxisRange], _combineAxisRangeWithReverse.combineAxisRangeWithReverse);
var selectTooltipConfiguredScale = (0, _reselect.createSelector)([_axisSelectors.selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisDomainIncludingNiceTicks, selectTooltipAxisRangeWithReverse], _combineConfiguredScale.combineConfiguredScale);
var selectTooltipAxisScale = exports.selectTooltipAxisScale = (0, _reselect.createSelector)([selectTooltipConfiguredScale], _RechartsScale.rechartsScaleFactory);
var selectTooltipDuplicateDomain = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectAllTooltipAppliedValues, _axisSelectors.selectTooltipAxis, _selectTooltipAxisType.selectTooltipAxisType], _axisSelectors.combineDuplicateDomain);
var selectTooltipCategoricalDomain = exports.selectTooltipCategoricalDomain = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectAllTooltipAppliedValues, _axisSelectors.selectTooltipAxis, _selectTooltipAxisType.selectTooltipAxisType], _axisSelectors.combineCategoricalDomain);
var combineTicksOfTooltipAxis = (layout, axis, realScaleType, scale, range, duplicateDomain, categoricalDomain, axisType) => {
  if (!axis) {
    return undefined;
  }
  var type = axis.type;
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, axisType);
  if (!scale) {
    return undefined;
  }
  var offsetForBand = realScaleType === 'scaleBand' && scale.bandwidth ? scale.bandwidth() / 2 : 2;
  var offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && range != null && (range === null || range === void 0 ? void 0 : range.length) >= 2 ? (0, _DataUtils.mathSign)(range[0] - range[1]) * 2 * offset : offset;

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => {
      var scaled = scale.map(entry);
      if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(scaled)) {
        return null;
      }
      return {
        coordinate: scaled + offset,
        value: entry,
        index,
        offset
      };
    }).filter(_DataUtils.isNotNil);
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => {
    var scaled = scale.map(entry);
    if (!(0, _isWellBehavedNumber.isWellBehavedNumber)(scaled)) {
      return null;
    }
    return {
      coordinate: scaled + offset,
      // @ts-expect-error can't use Date as an index
      value: duplicateDomain ? duplicateDomain[entry] : entry,
      index,
      offset
    };
  }).filter(_DataUtils.isNotNil);
};

/**
 * Of on four almost identical implementations of tick generation.
 * The four horsemen of tick generation are:
 * - {@link selectTooltipAxisTicks}
 * - {@link combineAxisTicks}
 * - {@link getTicksOfAxis}.
 * - {@link combineGraphicalItemTicks}
 */
var selectTooltipAxisTicks = exports.selectTooltipAxisTicks = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, _axisSelectors.selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisScale, selectTooltipAxisRange, selectTooltipDuplicateDomain, selectTooltipCategoricalDomain, _selectTooltipAxisType.selectTooltipAxisType], combineTicksOfTooltipAxis);
var selectTooltipEventType = (0, _reselect.createSelector)([_selectTooltipEventType.selectDefaultTooltipEventType, _selectTooltipEventType.selectValidateTooltipEventTypes, _selectTooltipSettings.selectTooltipSettings], (defaultTooltipEventType, validateTooltipEventType, settings) => (0, _selectTooltipEventType.combineTooltipEventType)(settings.shared, defaultTooltipEventType, validateTooltipEventType));
var selectTooltipTrigger = state => state.tooltip.settings.trigger;
var selectDefaultIndex = state => state.tooltip.settings.defaultIndex;
var selectTooltipInteractionState = (0, _reselect.createSelector)([_selectTooltipState.selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], _combineTooltipInteractionState.combineTooltipInteractionState);
var selectActiveTooltipIndex = exports.selectActiveTooltipIndex = (0, _reselect.createSelector)([selectTooltipInteractionState, selectTooltipDisplayedData, _axisSelectors.selectTooltipAxisDataKey, selectTooltipAxisDomain], _combineActiveTooltipIndex.combineActiveTooltipIndex);
var selectActiveLabel = exports.selectActiveLabel = (0, _reselect.createSelector)([selectTooltipAxisTicks, selectActiveTooltipIndex], _combineActiveLabel.combineActiveLabel);
var selectActiveTooltipDataKey = exports.selectActiveTooltipDataKey = (0, _reselect.createSelector)([selectTooltipInteractionState], tooltipInteraction => {
  if (!tooltipInteraction) {
    return undefined;
  }
  return tooltipInteraction.dataKey;
});
var selectActiveTooltipGraphicalItemId = exports.selectActiveTooltipGraphicalItemId = (0, _reselect.createSelector)([selectTooltipInteractionState], tooltipInteraction => {
  if (!tooltipInteraction) {
    return undefined;
  }
  return tooltipInteraction.graphicalItemId;
});
var selectTooltipPayloadConfigurations = (0, _reselect.createSelector)([_selectTooltipState.selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], _combineTooltipPayloadConfigurations.combineTooltipPayloadConfigurations);
var selectTooltipCoordinateForDefaultIndex = (0, _reselect.createSelector)([_containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight, _chartLayoutContext.selectChartLayout, _selectChartOffsetInternal.selectChartOffsetInternal, selectTooltipAxisTicks, selectDefaultIndex, selectTooltipPayloadConfigurations], _combineCoordinateForDefaultIndex.combineCoordinateForDefaultIndex);
var selectActiveTooltipCoordinate = exports.selectActiveTooltipCoordinate = (0, _reselect.createSelector)([selectTooltipInteractionState, selectTooltipCoordinateForDefaultIndex], (tooltipInteractionState, defaultIndexCoordinate) => {
  if (tooltipInteractionState !== null && tooltipInteractionState !== void 0 && tooltipInteractionState.coordinate) {
    return tooltipInteractionState.coordinate;
  }
  return defaultIndexCoordinate;
});
var selectIsTooltipActive = exports.selectIsTooltipActive = (0, _reselect.createSelector)([selectTooltipInteractionState], tooltipInteractionState => {
  var _tooltipInteractionSt;
  return (_tooltipInteractionSt = tooltipInteractionState === null || tooltipInteractionState === void 0 ? void 0 : tooltipInteractionState.active) !== null && _tooltipInteractionSt !== void 0 ? _tooltipInteractionSt : false;
});
var selectActiveTooltipPayload = exports.selectActiveTooltipPayload = (0, _reselect.createSelector)([selectTooltipPayloadConfigurations, selectActiveTooltipIndex, _dataSelectors.selectChartDataWithIndexes, _axisSelectors.selectTooltipAxisDataKey, selectActiveLabel, _selectTooltipPayloadSearcher.selectTooltipPayloadSearcher, selectTooltipEventType], _combineTooltipPayload.combineTooltipPayload);
var selectActiveTooltipDataPoints = exports.selectActiveTooltipDataPoints = (0, _reselect.createSelector)([selectActiveTooltipPayload], payload => {
  if (payload == null) {
    return undefined;
  }
  var dataPoints = payload.map(p => p.payload).filter(p => p != null);
  return Array.from(new Set(dataPoints));
});