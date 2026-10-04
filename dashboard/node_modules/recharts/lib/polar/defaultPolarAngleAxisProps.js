"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPolarAngleAxisProps = void 0;
var _DefaultZIndexes = require("../zIndex/DefaultZIndexes");
var defaultPolarAngleAxisProps = exports.defaultPolarAngleAxisProps = {
  allowDecimals: false,
  allowDuplicatedCategory: true,
  // if I set this to false then Tooltip synchronisation stops working in Radar, wtf
  allowDataOverflow: false,
  angle: 0,
  angleAxisId: 0,
  axisLine: true,
  axisLineType: 'polygon',
  cx: 0,
  cy: 0,
  hide: false,
  includeHidden: false,
  label: false,
  niceTicks: 'auto',
  orientation: 'outer',
  reversed: false,
  scale: 'auto',
  tick: true,
  tickLine: true,
  tickSize: 8,
  type: 'auto',
  zIndex: _DefaultZIndexes.DefaultZIndexes.axis
};