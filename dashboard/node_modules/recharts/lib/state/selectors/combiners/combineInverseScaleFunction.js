"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineInverseScaleFunction = combineInverseScaleFunction;
var _createCategoricalInverse = require("../../../util/scale/createCategoricalInverse");
function combineInverseScaleFunction(configuredScale) {
  if (configuredScale == null) {
    return undefined;
  }
  if ('invert' in configuredScale && typeof configuredScale.invert === 'function') {
    return configuredScale.invert.bind(configuredScale);
  }
  return (0, _createCategoricalInverse.createCategoricalInverse)(configuredScale, undefined);
}