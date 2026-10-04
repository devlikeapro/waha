import EventEmitter from 'eventemitter3';
var eventCenter = new EventEmitter();
export { eventCenter };
export var TOOLTIP_SYNC_EVENT = 'recharts.syncEvent.tooltip';
export var BRUSH_SYNC_EVENT = 'recharts.syncEvent.brush';