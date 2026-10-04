import { createSelector } from 'reselect';
import { selectChartDataAndAlwaysIgnoreIndexes, selectChartDataSliceIgnoringIndexes } from './dataSelectors';
import { combineAppliedValues, combineAxisDomain, combineAxisDomainWithNiceTicks, combineDisplayedData, combineDomainOfAllAppliedNumericalValuesIncludingErrorValues, combineGraphicalItemsData, combineGraphicalItemsSettings, combineNiceTicks, combineNumericalDomain, itemAxisPredicate, selectAllErrorBarSettings, selectBaseAxis, selectDomainDefinition, selectDomainFromUserPreference, selectRealScaleType, selectRenderableAxisSettings } from './axisSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { getValueByDataKey } from '../../util/ChartUtils';
import { pickAxisType } from './pickAxisType';
import { pickAxisId } from './pickAxisId';
import { selectStackOffsetType } from './rootPropsSelectors';
import { combineCheckedDomain } from './combiners/combineCheckedDomain';
export var selectUnfilteredPolarItems = state => state.graphicalItems.polarItems;
var selectAxisPredicate = createSelector([pickAxisType, pickAxisId], itemAxisPredicate);
export var selectPolarItemsSettings = createSelector([selectUnfilteredPolarItems, selectBaseAxis, selectAxisPredicate], combineGraphicalItemsSettings);
var selectPolarGraphicalItemsData = createSelector([selectPolarItemsSettings], combineGraphicalItemsData);
export var selectPolarDisplayedData = createSelector([selectPolarGraphicalItemsData, selectChartDataAndAlwaysIgnoreIndexes], combineDisplayedData);
export var selectPolarAppliedValues = createSelector([selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings], combineAppliedValues);
export var selectAllPolarAppliedNumericalValues = createSelector([selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings], (data, axisSettings, items) => {
  if (items.length > 0) {
    return data.flatMap(entry => {
      return items.flatMap(item => {
        var _axisSettings$dataKey;
        var valueByDataKey = getValueByDataKey(entry, (_axisSettings$dataKey = axisSettings.dataKey) !== null && _axisSettings$dataKey !== void 0 ? _axisSettings$dataKey : item.dataKey);
        return {
          value: valueByDataKey,
          errorDomain: [] // polar charts do not have error bars
        };
      });
    }).filter(Boolean);
  }
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null) {
    return data.map(item => ({
      value: getValueByDataKey(item, axisSettings.dataKey),
      errorDomain: []
    }));
  }
  return data.map(entry => ({
    value: entry,
    errorDomain: []
  }));
});
var unsupportedInPolarChart = () => undefined;
var selectDomainOfAllPolarAppliedNumericalValues = createSelector([selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings, selectAllErrorBarSettings, pickAxisType, selectChartDataSliceIgnoringIndexes], combineDomainOfAllAppliedNumericalValuesIncludingErrorValues);
var selectPolarNumericalDomain = createSelector([selectBaseAxis, selectDomainDefinition, selectDomainFromUserPreference, unsupportedInPolarChart, selectDomainOfAllPolarAppliedNumericalValues, unsupportedInPolarChart, selectChartLayout, pickAxisType], combineNumericalDomain);
export var selectPolarAxisDomain = createSelector([selectBaseAxis, selectChartLayout, selectPolarDisplayedData, selectPolarAppliedValues, selectStackOffsetType, pickAxisType, selectPolarNumericalDomain], combineAxisDomain);
export var selectPolarNiceTicks = createSelector([selectPolarAxisDomain, selectRenderableAxisSettings, selectRealScaleType], combineNiceTicks);
export var selectPolarAxisDomainIncludingNiceTicks = createSelector([selectBaseAxis, selectPolarAxisDomain, selectPolarNiceTicks, pickAxisType], combineAxisDomainWithNiceTicks);
export var selectPolarAxisCheckedDomain = createSelector([selectRealScaleType, selectPolarAxisDomainIncludingNiceTicks], combineCheckedDomain);