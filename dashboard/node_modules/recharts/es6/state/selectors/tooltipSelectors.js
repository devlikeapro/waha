import { createSelector } from 'reselect';
import { combineAllAppliedValues, combineAreasDomain, combineAxisDomain, combineAxisDomainWithNiceTicks, combineCategoricalDomain, combineDisplayedData, combineDomainOfAllAppliedNumericalValuesIncludingErrorValues, combineDomainOfStackGroups, combineDotsDomain, combineDuplicateDomain, combineGraphicalItemsData, combineGraphicalItemsSettings, combineLinesDomain, combineNiceTicks, combineNumericalDomain, combineStackGroups, filterGraphicalNotStackedItems, filterReferenceElements, getDomainDefinition, itemAxisPredicate, mergeDomains, selectAllErrorBarSettings, selectAxisRange, selectHasBar, selectReferenceAreas, selectReferenceDots, selectReferenceLines, selectTooltipAxis, selectTooltipAxisDataKey } from './axisSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { isCategoricalAxis } from '../../util/ChartUtils';
import { selectChartDataWithIndexes, selectChartDataSliceWithIndexes } from './dataSelectors';
import { selectChartName, selectReverseStackOrder, selectStackOffsetType } from './rootPropsSelectors';
import { isNotNil, mathSign } from '../../util/DataUtils';
import { combineAxisRangeWithReverse } from './combiners/combineAxisRangeWithReverse';
import { combineTooltipEventType, selectDefaultTooltipEventType, selectValidateTooltipEventTypes } from './selectTooltipEventType';
import { combineActiveLabel } from './combiners/combineActiveLabel';
import { selectTooltipSettings } from './selectTooltipSettings';
import { combineTooltipInteractionState } from './combiners/combineTooltipInteractionState';
import { combineActiveTooltipIndex } from './combiners/combineActiveTooltipIndex';
import { combineCoordinateForDefaultIndex } from './combiners/combineCoordinateForDefaultIndex';
import { selectChartHeight, selectChartWidth } from './containerSelectors';
import { selectChartOffsetInternal } from './selectChartOffsetInternal';
import { combineTooltipPayloadConfigurations } from './combiners/combineTooltipPayloadConfigurations';
import { selectTooltipPayloadSearcher } from './selectTooltipPayloadSearcher';
import { selectTooltipState } from './selectTooltipState';
import { combineTooltipPayload } from './combiners/combineTooltipPayload';
import { selectTooltipAxisId } from './selectTooltipAxisId';
import { selectTooltipAxisType } from './selectTooltipAxisType';
import { combineDisplayedStackedData } from './combiners/combineDisplayedStackedData';
import { isStacked } from '../types/StackedGraphicalItem';
import { numericalDomainSpecifiedWithoutRequiringData } from '../../util/isDomainSpecifiedByUser';
import { numberDomainEqualityCheck } from './numberDomainEqualityCheck';
import { emptyArraysAreEqualCheck } from './arrayEqualityCheck';
import { rechartsScaleFactory } from '../../util/scale/RechartsScale';
import { isWellBehavedNumber } from '../../util/isWellBehavedNumber';
import { combineRealScaleType } from './combiners/combineRealScaleType';
import { combineConfiguredScale } from './combiners/combineConfiguredScale';
export var selectTooltipAxisRealScaleType = createSelector([selectTooltipAxis, selectHasBar, selectChartName], combineRealScaleType);
export var selectAllUnfilteredGraphicalItems = createSelector([state => state.graphicalItems.cartesianItems, state => state.graphicalItems.polarItems], (cartesianItems, polarItems) => [...cartesianItems, ...polarItems]);
var selectTooltipAxisPredicate = createSelector([selectTooltipAxisType, selectTooltipAxisId], itemAxisPredicate);
export var selectAllGraphicalItemsSettings = createSelector([selectAllUnfilteredGraphicalItems, selectTooltipAxis, selectTooltipAxisPredicate], combineGraphicalItemsSettings, {
  memoizeOptions: {
    resultEqualityCheck: emptyArraysAreEqualCheck
  }
});
var selectAllStackedGraphicalItemsSettings = createSelector([selectAllGraphicalItemsSettings], graphicalItems => graphicalItems.filter(isStacked));
export var selectTooltipGraphicalItemsData = createSelector([selectAllGraphicalItemsSettings], combineGraphicalItemsData, {
  memoizeOptions: {
    resultEqualityCheck: emptyArraysAreEqualCheck
  }
});
var selectAnyTooltipItemUsesChartData = createSelector([selectAllGraphicalItemsSettings], items => items.some(item => !item.data));

/**
 * Data for tooltip always use the data with indexes set by a Brush,
 * and never accept the isPanorama flag:
 * because Tooltip never displays inside the panorama anyway
 * so we don't need to worry what would happen there.
 */
export var selectTooltipDisplayedData = createSelector([selectTooltipGraphicalItemsData, selectChartDataWithIndexes], combineDisplayedData);
var selectTooltipStackedData = createSelector([selectAllStackedGraphicalItemsSettings, selectChartDataWithIndexes, selectTooltipAxis], combineDisplayedStackedData);
var selectAllTooltipAppliedValues = createSelector([selectTooltipDisplayedData, selectTooltipAxis, selectAllGraphicalItemsSettings, selectChartDataWithIndexes, selectAnyTooltipItemUsesChartData, selectTooltipGraphicalItemsData], combineAllAppliedValues);
var selectTooltipAxisDomainDefinition = createSelector([selectTooltipAxis], getDomainDefinition);
var selectTooltipDataOverflow = createSelector([selectTooltipAxis], axisSettings => axisSettings.allowDataOverflow);
var selectTooltipDomainFromUserPreferences = createSelector([selectTooltipAxisDomainDefinition, selectTooltipDataOverflow], numericalDomainSpecifiedWithoutRequiringData);
var selectAllStackedGraphicalItems = createSelector([selectAllGraphicalItemsSettings], graphicalItems => graphicalItems.filter(isStacked));
var selectTooltipStackGroups = createSelector([selectTooltipStackedData, selectAllStackedGraphicalItems, selectStackOffsetType, selectReverseStackOrder], combineStackGroups);
var selectTooltipDomainOfStackGroups = createSelector([selectTooltipStackGroups, selectChartDataWithIndexes, selectTooltipAxisType, selectTooltipDomainFromUserPreferences], combineDomainOfStackGroups);
var selectTooltipItemsSettingsExceptStacked = createSelector([selectAllGraphicalItemsSettings], filterGraphicalNotStackedItems);
var selectDomainOfAllAppliedNumericalValuesIncludingErrorValues = createSelector([selectTooltipDisplayedData, selectTooltipAxis, selectTooltipItemsSettingsExceptStacked, selectAllErrorBarSettings, selectTooltipAxisType, selectChartDataSliceWithIndexes], combineDomainOfAllAppliedNumericalValuesIncludingErrorValues, {
  memoizeOptions: {
    resultEqualityCheck: numberDomainEqualityCheck
  }
});
var selectReferenceDotsByTooltipAxis = createSelector([selectReferenceDots, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);
var selectTooltipReferenceDotsDomain = createSelector([selectReferenceDotsByTooltipAxis, selectTooltipAxisType], combineDotsDomain);
var selectReferenceAreasByTooltipAxis = createSelector([selectReferenceAreas, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);
var selectTooltipReferenceAreasDomain = createSelector([selectReferenceAreasByTooltipAxis, selectTooltipAxisType], combineAreasDomain);
var selectReferenceLinesByTooltipAxis = createSelector([selectReferenceLines, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);
var selectTooltipReferenceLinesDomain = createSelector([selectReferenceLinesByTooltipAxis, selectTooltipAxisType], combineLinesDomain);
var selectTooltipReferenceElementsDomain = createSelector([selectTooltipReferenceDotsDomain, selectTooltipReferenceLinesDomain, selectTooltipReferenceAreasDomain], mergeDomains);
var selectTooltipNumericalDomain = createSelector([selectTooltipAxis, selectTooltipAxisDomainDefinition, selectTooltipDomainFromUserPreferences, selectTooltipDomainOfStackGroups, selectDomainOfAllAppliedNumericalValuesIncludingErrorValues, selectTooltipReferenceElementsDomain, selectChartLayout, selectTooltipAxisType], combineNumericalDomain);
export var selectTooltipAxisDomain = createSelector([selectTooltipAxis, selectChartLayout, selectTooltipDisplayedData, selectAllTooltipAppliedValues, selectStackOffsetType, selectTooltipAxisType, selectTooltipNumericalDomain], combineAxisDomain);
var selectTooltipNiceTicks = createSelector([selectTooltipAxisDomain, selectTooltipAxis, selectTooltipAxisRealScaleType], combineNiceTicks);
export var selectTooltipAxisDomainIncludingNiceTicks = createSelector([selectTooltipAxis, selectTooltipAxisDomain, selectTooltipNiceTicks, selectTooltipAxisType], combineAxisDomainWithNiceTicks);
var selectTooltipAxisRange = state => {
  var axisType = selectTooltipAxisType(state);
  var axisId = selectTooltipAxisId(state);
  var isPanorama = false; // Tooltip never displays in panorama so this is safe to assume
  return selectAxisRange(state, axisType, axisId, isPanorama);
};
export var selectTooltipAxisRangeWithReverse = createSelector([selectTooltipAxis, selectTooltipAxisRange], combineAxisRangeWithReverse);
var selectTooltipConfiguredScale = createSelector([selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisDomainIncludingNiceTicks, selectTooltipAxisRangeWithReverse], combineConfiguredScale);
export var selectTooltipAxisScale = createSelector([selectTooltipConfiguredScale], rechartsScaleFactory);
var selectTooltipDuplicateDomain = createSelector([selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType], combineDuplicateDomain);
export var selectTooltipCategoricalDomain = createSelector([selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType], combineCategoricalDomain);
var combineTicksOfTooltipAxis = (layout, axis, realScaleType, scale, range, duplicateDomain, categoricalDomain, axisType) => {
  if (!axis) {
    return undefined;
  }
  var type = axis.type;
  var isCategorical = isCategoricalAxis(layout, axisType);
  if (!scale) {
    return undefined;
  }
  var offsetForBand = realScaleType === 'scaleBand' && scale.bandwidth ? scale.bandwidth() / 2 : 2;
  var offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && range != null && (range === null || range === void 0 ? void 0 : range.length) >= 2 ? mathSign(range[0] - range[1]) * 2 * offset : offset;

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => {
      var scaled = scale.map(entry);
      if (!isWellBehavedNumber(scaled)) {
        return null;
      }
      return {
        coordinate: scaled + offset,
        value: entry,
        index,
        offset
      };
    }).filter(isNotNil);
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => {
    var scaled = scale.map(entry);
    if (!isWellBehavedNumber(scaled)) {
      return null;
    }
    return {
      coordinate: scaled + offset,
      // @ts-expect-error can't use Date as an index
      value: duplicateDomain ? duplicateDomain[entry] : entry,
      index,
      offset
    };
  }).filter(isNotNil);
};

/**
 * Of on four almost identical implementations of tick generation.
 * The four horsemen of tick generation are:
 * - {@link selectTooltipAxisTicks}
 * - {@link combineAxisTicks}
 * - {@link getTicksOfAxis}.
 * - {@link combineGraphicalItemTicks}
 */
export var selectTooltipAxisTicks = createSelector([selectChartLayout, selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisScale, selectTooltipAxisRange, selectTooltipDuplicateDomain, selectTooltipCategoricalDomain, selectTooltipAxisType], combineTicksOfTooltipAxis);
var selectTooltipEventType = createSelector([selectDefaultTooltipEventType, selectValidateTooltipEventTypes, selectTooltipSettings], (defaultTooltipEventType, validateTooltipEventType, settings) => combineTooltipEventType(settings.shared, defaultTooltipEventType, validateTooltipEventType));
var selectTooltipTrigger = state => state.tooltip.settings.trigger;
var selectDefaultIndex = state => state.tooltip.settings.defaultIndex;
var selectTooltipInteractionState = createSelector([selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], combineTooltipInteractionState);
export var selectActiveTooltipIndex = createSelector([selectTooltipInteractionState, selectTooltipDisplayedData, selectTooltipAxisDataKey, selectTooltipAxisDomain], combineActiveTooltipIndex);
export var selectActiveLabel = createSelector([selectTooltipAxisTicks, selectActiveTooltipIndex], combineActiveLabel);
export var selectActiveTooltipDataKey = createSelector([selectTooltipInteractionState], tooltipInteraction => {
  if (!tooltipInteraction) {
    return undefined;
  }
  return tooltipInteraction.dataKey;
});
export var selectActiveTooltipGraphicalItemId = createSelector([selectTooltipInteractionState], tooltipInteraction => {
  if (!tooltipInteraction) {
    return undefined;
  }
  return tooltipInteraction.graphicalItemId;
});
var selectTooltipPayloadConfigurations = createSelector([selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], combineTooltipPayloadConfigurations);
var selectTooltipCoordinateForDefaultIndex = createSelector([selectChartWidth, selectChartHeight, selectChartLayout, selectChartOffsetInternal, selectTooltipAxisTicks, selectDefaultIndex, selectTooltipPayloadConfigurations], combineCoordinateForDefaultIndex);
export var selectActiveTooltipCoordinate = createSelector([selectTooltipInteractionState, selectTooltipCoordinateForDefaultIndex], (tooltipInteractionState, defaultIndexCoordinate) => {
  if (tooltipInteractionState !== null && tooltipInteractionState !== void 0 && tooltipInteractionState.coordinate) {
    return tooltipInteractionState.coordinate;
  }
  return defaultIndexCoordinate;
});
export var selectIsTooltipActive = createSelector([selectTooltipInteractionState], tooltipInteractionState => {
  var _tooltipInteractionSt;
  return (_tooltipInteractionSt = tooltipInteractionState === null || tooltipInteractionState === void 0 ? void 0 : tooltipInteractionState.active) !== null && _tooltipInteractionSt !== void 0 ? _tooltipInteractionSt : false;
});
export var selectActiveTooltipPayload = createSelector([selectTooltipPayloadConfigurations, selectActiveTooltipIndex, selectChartDataWithIndexes, selectTooltipAxisDataKey, selectActiveLabel, selectTooltipPayloadSearcher, selectTooltipEventType], combineTooltipPayload);
export var selectActiveTooltipDataPoints = createSelector([selectActiveTooltipPayload], payload => {
  if (payload == null) {
    return undefined;
  }
  var dataPoints = payload.map(p => p.payload).filter(p => p != null);
  return Array.from(new Set(dataPoints));
});