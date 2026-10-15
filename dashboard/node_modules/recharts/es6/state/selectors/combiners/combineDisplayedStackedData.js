import { getStackSeriesIdentifier } from '../../../util/stacks/getStackSeriesIdentifier';
import { getValueByDataKey } from '../../../util/ChartUtils';

/**
 * In a stacked chart, each graphical item has its own data. That data could be either:
 * - defined on the chart root, in which case the item gets a unique dataKey
 * - or defined on the item itself, in which case multiple items can share the same dataKey
 *
 * That means we cannot use the dataKey as a unique identifier for the item.
 *
 * This type represents a single data point in a stacked chart, where each key is a series identifier
 * and the value is the numeric value for that series using the numerical axis dataKey.
 */

export function combineDisplayedStackedData(stackedGraphicalItems, _ref, tooltipAxisSettings) {
  var _ref$chartData = _ref.chartData,
    chartData = _ref$chartData === void 0 ? [] : _ref$chartData;
  var allowDuplicatedCategory = tooltipAxisSettings.allowDuplicatedCategory,
    tooltipDataKey = tooltipAxisSettings.dataKey;

  // A map of tooltip data keys to the stacked data points
  var knownItemsByDataKey = new Map();
  stackedGraphicalItems.forEach(item => {
    var _item$data;
    // If there is no data on the individual item then we use the root chart data
    var resolvedData = (_item$data = item.data) !== null && _item$data !== void 0 ? _item$data : chartData;
    if (resolvedData == null || resolvedData.length === 0) {
      // if that doesn't work then we skip this item
      return;
    }
    var stackIdentifier = getStackSeriesIdentifier(item);
    resolvedData.forEach((entry, index) => {
      var tooltipValue = tooltipDataKey == null || allowDuplicatedCategory ? index : String(getValueByDataKey(entry, tooltipDataKey, null));
      var numericValue = getValueByDataKey(entry, item.dataKey, 0);
      var curr;
      if (knownItemsByDataKey.has(tooltipValue)) {
        curr = knownItemsByDataKey.get(tooltipValue);
      } else {
        curr = {};
      }
      Object.assign(curr, {
        [stackIdentifier]: numericValue
      });
      knownItemsByDataKey.set(tooltipValue, curr);
    });
  });
  return Array.from(knownItemsByDataKey.values());
}