function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { findEntryInArray } from '../../../util/DataUtils';
import { getTooltipEntry, getValueByDataKey } from '../../../util/ChartUtils';
import { getSliced } from '../../../util/getSliced';
function parseName(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  return undefined;
}
function parseUnit(value) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  return undefined;
}
function parseDataKey(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  if (typeof value === 'function') {
    return obj => value(obj);
  }
  return undefined;
}
function parseColor(value) {
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}
function parseTooltipPayloadItem(item) {
  if (item == null || typeof item !== 'object') {
    return undefined;
  }
  var name = 'name' in item ? parseName(item.name) : undefined;
  var unit = 'unit' in item ? parseUnit(item.unit) : undefined;
  var dataKey = 'dataKey' in item ? parseDataKey(item.dataKey) : undefined;
  var payload = 'payload' in item ? item.payload : undefined;
  var color = 'color' in item ? parseColor(item.color) : undefined;
  var fill = 'fill' in item ? parseColor(item.fill) : undefined;
  return {
    name,
    unit,
    dataKey,
    payload,
    color,
    fill
  };
}
function selectFinalData(dataDefinedOnItem, dataDefinedOnChart) {
  /*
   * If a payload has data specified directly from the graphical item, prefer that.
   * Otherwise, fill in data from the chart level, using the same index.
   */
  if (dataDefinedOnItem != null) {
    return dataDefinedOnItem;
  }
  return dataDefinedOnChart;
}
export var combineTooltipPayload = (tooltipPayloadConfigurations, activeIndex, chartDataState, tooltipAxisDataKey, activeLabel, tooltipPayloadSearcher, tooltipEventType) => {
  if (activeIndex == null || tooltipPayloadSearcher == null) {
    return undefined;
  }
  var chartData = chartDataState.chartData,
    computedData = chartDataState.computedData,
    dataStartIndex = chartDataState.dataStartIndex,
    dataEndIndex = chartDataState.dataEndIndex;
  var init = [];
  return tooltipPayloadConfigurations.reduce((agg, _ref) => {
    var _settings$dataKey;
    var dataDefinedOnItem = _ref.dataDefinedOnItem,
      settings = _ref.settings;
    var finalData = selectFinalData(dataDefinedOnItem, chartData);
    var sliced = Array.isArray(finalData) ? getSliced(finalData, dataStartIndex, dataEndIndex) : finalData;
    var finalDataKey = (_settings$dataKey = settings === null || settings === void 0 ? void 0 : settings.dataKey) !== null && _settings$dataKey !== void 0 ? _settings$dataKey : tooltipAxisDataKey;
    // BaseAxisProps does not support nameKey but it could!
    var finalNameKey = settings === null || settings === void 0 ? void 0 : settings.nameKey; // ?? tooltipAxis?.nameKey;
    var tooltipPayload;
    if (tooltipAxisDataKey && Array.isArray(sliced) &&
    /*
     * findEntryInArray won't work for Scatter because Scatter provides an array of arrays
     * as tooltip payloads and findEntryInArray is not prepared to handle that.
     * Sad but also ScatterChart only allows 'item' tooltipEventType
     * and also this is only a problem if there are multiple Scatters and each has its own data array
     * so let's fix that some other time.
     */
    !Array.isArray(sliced[0]) &&
    /*
     * If the tooltipEventType is 'axis', we should search for the dataKey in the sliced data
     * because thanks to allowDuplicatedCategory=false, the order of elements in the array
     * no longer matches the order of elements in the original data
     * and so we need to search by the active dataKey + label rather than by index.
     *
     * The same happens if multiple graphical items are present in the chart
     * and each of them has its own data array. Those arrays get concatenated
     * and again the tooltip index no longer matches the original data.
     *
     * On the other hand the tooltipEventType 'item' should always search by index
     * because we get the index from interacting over the individual elements
     * which is always accurate, irrespective of the allowDuplicatedCategory setting.
     */
    tooltipEventType === 'axis') {
      tooltipPayload = findEntryInArray(sliced, tooltipAxisDataKey, activeLabel);
      /*
       * When allowDuplicatedCategory is false and there are duplicate category values
       * in the data, findEntryInArray returns only the first matching entry.
       * If the user hovers over a bar that corresponds to a later duplicate,
       * the activeIndex provides the correct position. We fall back to the index-based
       * search when the label-based search returns undefined, which can happen
       * when the activeLabel does not precisely match any data entry (e.g., due to
       * type coercion differences between tick values and data values).
       */
      if (tooltipPayload == null) {
        tooltipPayload = tooltipPayloadSearcher(sliced, activeIndex, computedData, finalNameKey);
      }
    } else {
      /*
       * This is a problem because it assumes that the index is pointing to the displayed data
       * which it isn't because the index is pointing to the tooltip ticks array.
       * The above approach (with findEntryInArray) is the correct one, but it only works
       * if the axis dataKey is defined explicitly, and if the data is an array of objects.
       */
      tooltipPayload = tooltipPayloadSearcher(sliced, activeIndex, computedData, finalNameKey);
    }
    if (Array.isArray(tooltipPayload)) {
      tooltipPayload.forEach(item => {
        var _parsedItem$color, _parsedItem$fill;
        var parsedItem = parseTooltipPayloadItem(item);
        var itemName = parsedItem === null || parsedItem === void 0 ? void 0 : parsedItem.name;
        var itemDataKey = parsedItem === null || parsedItem === void 0 ? void 0 : parsedItem.dataKey;
        var itemPayload = parsedItem === null || parsedItem === void 0 ? void 0 : parsedItem.payload;
        var newSettings = _objectSpread(_objectSpread({}, settings), {}, {
          name: itemName,
          unit: parsedItem === null || parsedItem === void 0 ? void 0 : parsedItem.unit,
          // Preserve item-level color/fill from graphical items.
          color: (_parsedItem$color = parsedItem === null || parsedItem === void 0 ? void 0 : parsedItem.color) !== null && _parsedItem$color !== void 0 ? _parsedItem$color : settings === null || settings === void 0 ? void 0 : settings.color,
          fill: (_parsedItem$fill = parsedItem === null || parsedItem === void 0 ? void 0 : parsedItem.fill) !== null && _parsedItem$fill !== void 0 ? _parsedItem$fill : settings === null || settings === void 0 ? void 0 : settings.fill
        });
        agg.push(getTooltipEntry({
          tooltipEntrySettings: newSettings,
          dataKey: itemDataKey,
          payload: itemPayload,
          value: getValueByDataKey(itemPayload, itemDataKey),
          name: itemName == null ? undefined : String(itemName)
        }));
      });
    } else {
      var _getValueByDataKey;
      // I am not quite sure why these two branches (Array vs Array of Arrays) have to behave differently - I imagine we should unify these. 3.x breaking change?
      agg.push(getTooltipEntry({
        tooltipEntrySettings: settings,
        dataKey: finalDataKey,
        payload: tooltipPayload,
        // getValueByDataKey does not validate the output type
        value: getValueByDataKey(tooltipPayload, finalDataKey),
        // getValueByDataKey does not validate the output type
        name: (_getValueByDataKey = getValueByDataKey(tooltipPayload, finalNameKey)) !== null && _getValueByDataKey !== void 0 ? _getValueByDataKey : settings === null || settings === void 0 ? void 0 : settings.name
      }));
    }
    return agg;
  }, init);
};