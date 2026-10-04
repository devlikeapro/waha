"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectUnfilteredPolarItems = exports.selectPolarNiceTicks = exports.selectPolarItemsSettings = exports.selectPolarDisplayedData = exports.selectPolarAxisDomainIncludingNiceTicks = exports.selectPolarAxisDomain = exports.selectPolarAxisCheckedDomain = exports.selectPolarAppliedValues = exports.selectAllPolarAppliedNumericalValues = void 0;
var _reselect = require("reselect");
var _dataSelectors = require("./dataSelectors");
var _axisSelectors = require("./axisSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _ChartUtils = require("../../util/ChartUtils");
var _pickAxisType = require("./pickAxisType");
var _pickAxisId = require("./pickAxisId");
var _rootPropsSelectors = require("./rootPropsSelectors");
var _combineCheckedDomain = require("./combiners/combineCheckedDomain");
var selectUnfilteredPolarItems = state => state.graphicalItems.polarItems;
exports.selectUnfilteredPolarItems = selectUnfilteredPolarItems;
var selectAxisPredicate = (0, _reselect.createSelector)([_pickAxisType.pickAxisType, _pickAxisId.pickAxisId], _axisSelectors.itemAxisPredicate);
var selectPolarItemsSettings = exports.selectPolarItemsSettings = (0, _reselect.createSelector)([selectUnfilteredPolarItems, _axisSelectors.selectBaseAxis, selectAxisPredicate], _axisSelectors.combineGraphicalItemsSettings);
var selectPolarGraphicalItemsData = (0, _reselect.createSelector)([selectPolarItemsSettings], _axisSelectors.combineGraphicalItemsData);
var selectPolarDisplayedData = exports.selectPolarDisplayedData = (0, _reselect.createSelector)([selectPolarGraphicalItemsData, _dataSelectors.selectChartDataAndAlwaysIgnoreIndexes], _axisSelectors.combineDisplayedData);
var selectPolarAppliedValues = exports.selectPolarAppliedValues = (0, _reselect.createSelector)([selectPolarDisplayedData, _axisSelectors.selectBaseAxis, selectPolarItemsSettings], _axisSelectors.combineAppliedValues);
var selectAllPolarAppliedNumericalValues = exports.selectAllPolarAppliedNumericalValues = (0, _reselect.createSelector)([selectPolarDisplayedData, _axisSelectors.selectBaseAxis, selectPolarItemsSettings], (data, axisSettings, items) => {
  if (items.length > 0) {
    return data.flatMap(entry => {
      return items.flatMap(item => {
        var _axisSettings$dataKey;
        var valueByDataKey = (0, _ChartUtils.getValueByDataKey)(entry, (_axisSettings$dataKey = axisSettings.dataKey) !== null && _axisSettings$dataKey !== void 0 ? _axisSettings$dataKey : item.dataKey);
        return {
          value: valueByDataKey,
          errorDomain: [] // polar charts do not have error bars
        };
      });
    }).filter(Boolean);
  }
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null) {
    return data.map(item => ({
      value: (0, _ChartUtils.getValueByDataKey)(item, axisSettings.dataKey),
      errorDomain: []
    }));
  }
  return data.map(entry => ({
    value: entry,
    errorDomain: []
  }));
});
var unsupportedInPolarChart = () => undefined;
var selectDomainOfAllPolarAppliedNumericalValues = (0, _reselect.createSelector)([selectPolarDisplayedData, _axisSelectors.selectBaseAxis, selectPolarItemsSettings, _axisSelectors.selectAllErrorBarSettings, _pickAxisType.pickAxisType, _dataSelectors.selectChartDataSliceIgnoringIndexes], _axisSelectors.combineDomainOfAllAppliedNumericalValuesIncludingErrorValues);
var selectPolarNumericalDomain = (0, _reselect.createSelector)([_axisSelectors.selectBaseAxis, _axisSelectors.selectDomainDefinition, _axisSelectors.selectDomainFromUserPreference, unsupportedInPolarChart, selectDomainOfAllPolarAppliedNumericalValues, unsupportedInPolarChart, _chartLayoutContext.selectChartLayout, _pickAxisType.pickAxisType], _axisSelectors.combineNumericalDomain);
var selectPolarAxisDomain = exports.selectPolarAxisDomain = (0, _reselect.createSelector)([_axisSelectors.selectBaseAxis, _chartLayoutContext.selectChartLayout, selectPolarDisplayedData, selectPolarAppliedValues, _rootPropsSelectors.selectStackOffsetType, _pickAxisType.pickAxisType, selectPolarNumericalDomain], _axisSelectors.combineAxisDomain);
var selectPolarNiceTicks = exports.selectPolarNiceTicks = (0, _reselect.createSelector)([selectPolarAxisDomain, _axisSelectors.selectRenderableAxisSettings, _axisSelectors.selectRealScaleType], _axisSelectors.combineNiceTicks);
var selectPolarAxisDomainIncludingNiceTicks = exports.selectPolarAxisDomainIncludingNiceTicks = (0, _reselect.createSelector)([_axisSelectors.selectBaseAxis, selectPolarAxisDomain, selectPolarNiceTicks, _pickAxisType.pickAxisType], _axisSelectors.combineAxisDomainWithNiceTicks);
var selectPolarAxisCheckedDomain = exports.selectPolarAxisCheckedDomain = (0, _reselect.createSelector)([_axisSelectors.selectRealScaleType, selectPolarAxisDomainIncludingNiceTicks], _combineCheckedDomain.combineCheckedDomain);