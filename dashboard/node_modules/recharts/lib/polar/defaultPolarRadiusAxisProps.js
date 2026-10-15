"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPolarRadiusAxisProps = void 0;
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var defaultPolarRadiusAxisProps = exports.defaultPolarRadiusAxisProps = {
  allowDataOverflow: false,
  allowDecimals: false,
  allowDuplicatedCategory: true,
  angle: 0,
  axisLine: true,
  includeHidden: false,
  hide: false,
  niceTicks: 'auto',
  label: false,
  orientation: 'right',
  radiusAxisId: 0,
  reversed: false,
  scale: 'auto',
  stroke: '#ccc',
  tick: true,
  tickCount: 5,
  tickLine: true,
  type: 'auto',
  zIndex: _DefaultZIndexes.DefaultZIndexes.axis
};