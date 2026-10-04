"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineCoordinateForDefaultIndex = void 0;
var combineCoordinateForDefaultIndex = (width, height, layout, offset, tooltipTicks, defaultIndex, tooltipConfigurations) => {
  if (defaultIndex == null) {
    return undefined;
  }
  /*
   * With defaultIndex alone, we don't have enough information to decide _which_ of the multiple tooltips to display.
   * Maybe one day we could add new prop `activeGraphicalItemId` to the chart to help with that.
   * Until then, we choose the first one.
   */
  var firstConfiguration = tooltipConfigurations[0];
  var maybePosition = firstConfiguration === null || firstConfiguration === void 0 ? void 0 : firstConfiguration.getPosition(defaultIndex);
  if (maybePosition != null) {
    return maybePosition;
  }
  var tick = tooltipTicks === null || tooltipTicks === void 0 ? void 0 : tooltipTicks[Number(defaultIndex)];
  if (!tick) {
    return undefined;
  }
  switch (layout) {
    case 'horizontal':
      {
        return {
          x: tick.coordinate,
          y: (offset.top + height) / 2
        };
      }
    default:
      {
        // This logic is not super sound - it conflates vertical, radial, centric layouts into just one. TODO improve!
        return {
          x: (offset.left + width) / 2,
          y: tick.coordinate
        };
      }
  }
};
exports.combineCoordinateForDefaultIndex = combineCoordinateForDefaultIndex;