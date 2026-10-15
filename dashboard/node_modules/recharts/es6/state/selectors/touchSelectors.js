import { createSelector } from 'reselect';
import { selectTooltipState } from './selectTooltipState';
var selectAllTooltipPayloadConfiguration = createSelector([selectTooltipState], tooltipState => tooltipState.tooltipItemPayloads);
export var selectTooltipCoordinate = createSelector([selectAllTooltipPayloadConfiguration, (_state, tooltipIndex) => tooltipIndex, (_state, _tooltipIndex, graphicalItemId) => graphicalItemId], (allTooltipConfigurations, tooltipIndex, graphicalItemId) => {
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