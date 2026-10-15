"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRadiusAndStrokeWidthFromDot = getRadiusAndStrokeWidthFromDot;
var _svgPropertiesNoEvents = require("./svgPropertiesNoEvents");
function getRadiusAndStrokeWidthFromDot(dot) {
  var props = (0, _svgPropertiesNoEvents.svgPropertiesNoEventsFromUnknown)(dot);
  var defaultR = 3;
  var defaultStrokeWidth = 2;
  if (props != null) {
    var r = props.r,
      strokeWidth = props.strokeWidth;
    var realR = Number(r);
    var realStrokeWidth = Number(strokeWidth);
    if (Number.isNaN(realR) || realR < 0) {
      realR = defaultR;
    }
    if (Number.isNaN(realStrokeWidth) || realStrokeWidth < 0) {
      realStrokeWidth = defaultStrokeWidth;
    }
    return {
      r: realR,
      strokeWidth: realStrokeWidth
    };
  }
  return {
    r: defaultR,
    strokeWidth: defaultStrokeWidth
  };
}