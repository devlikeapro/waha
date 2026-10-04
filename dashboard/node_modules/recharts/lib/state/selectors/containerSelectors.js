"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectMargin = exports.selectContainerScale = exports.selectChartWidth = exports.selectChartHeight = void 0;
var selectChartWidth = state => state.layout.width;
exports.selectChartWidth = selectChartWidth;
var selectChartHeight = state => state.layout.height;
exports.selectChartHeight = selectChartHeight;
var selectContainerScale = state => state.layout.scale;
exports.selectContainerScale = selectContainerScale;
var selectMargin = state => state.layout.margin;
exports.selectMargin = selectMargin;