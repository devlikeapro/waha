"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventCenter = exports.TOOLTIP_SYNC_EVENT = exports.BRUSH_SYNC_EVENT = void 0;
var _eventemitter = _interopRequireDefault(require("eventemitter3"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var eventCenter = exports.eventCenter = new _eventemitter.default();
var TOOLTIP_SYNC_EVENT = exports.TOOLTIP_SYNC_EVENT = 'recharts.syncEvent.tooltip';
var BRUSH_SYNC_EVENT = exports.BRUSH_SYNC_EVENT = 'recharts.syncEvent.brush';