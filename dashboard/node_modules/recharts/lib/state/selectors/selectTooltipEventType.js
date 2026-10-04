"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineTooltipEventType = combineTooltipEventType;
exports.selectDefaultTooltipEventType = void 0;
exports.selectTooltipEventType = selectTooltipEventType;
exports.selectValidateTooltipEventTypes = void 0;
exports.useTooltipEventType = useTooltipEventType;
var _hooks = require("../hooks");
var selectDefaultTooltipEventType = state => state.options.defaultTooltipEventType;
exports.selectDefaultTooltipEventType = selectDefaultTooltipEventType;
var selectValidateTooltipEventTypes = state => state.options.validateTooltipEventTypes;
exports.selectValidateTooltipEventTypes = selectValidateTooltipEventTypes;
function combineTooltipEventType(shared, defaultTooltipEventType, validateTooltipEventTypes) {
  if (shared == null) {
    return defaultTooltipEventType;
  }
  var eventType = shared ? 'axis' : 'item';
  if (validateTooltipEventTypes == null) {
    return defaultTooltipEventType;
  }
  return validateTooltipEventTypes.includes(eventType) ? eventType : defaultTooltipEventType;
}
function selectTooltipEventType(state, shared) {
  var defaultTooltipEventType = selectDefaultTooltipEventType(state);
  var validateTooltipEventTypes = selectValidateTooltipEventTypes(state);
  return combineTooltipEventType(shared, defaultTooltipEventType, validateTooltipEventTypes);
}
function useTooltipEventType(shared) {
  return (0, _hooks.useAppSelector)(state => selectTooltipEventType(state, shared));
}