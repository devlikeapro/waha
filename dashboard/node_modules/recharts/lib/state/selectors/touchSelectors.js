"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectTooltipCoordinate = void 0;
var _reselect = require("reselect");
var _selectTooltipState = require("./selectTooltipState");
var selectAllTooltipPayloadConfiguration = (0, _reselect.createSelector)([_selectTooltipState.selectTooltipState], tooltipState => tooltipState.tooltipItemPayloads);
var selectTooltipCoordinate = exports.selectTooltipCoordinate = (0, _reselect.createSelector)([selectAllTooltipPayloadConfiguration, (_state, tooltipIndex) => tooltipIndex, (_state, _tooltipIndex, graphicalItemId) => graphicalItemId], (allTooltipConfigurations, tooltipIndex, graphicalItemId) => {
  if (tooltipIndex == null) {
    return undefined;
  }
  var mostRelevantTooltipConfiguration = allTooltipConfigurations.find(tooltipConfiguration => {
    return tooltipConfiguration.settings.graphicalItemId === graphicalItemId;
  });
  if (mostRelevantTooltipConfiguration == null) {
    return undefined;
  }
  var getPosition = mostRelevantTooltipConfiguration.getPosition;
  if (getPosition == null) {
    return undefined;
  }
  return getPosition(tooltipIndex);
});