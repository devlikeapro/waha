"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineBarPosition = void 0;
var combineBarPosition = (allBarPositions, barSettings) => {
  if (allBarPositions == null || barSettings == null) {
    return undefined;
  }
  var position = allBarPositions.find(p => p.stackId === barSettings.stackId && barSettings.dataKey != null && p.dataKeys.includes(barSettings.dataKey));
  if (position == null) {
    return undefined;
  }
  return position.position;
};
exports.combineBarPosition = combineBarPosition;