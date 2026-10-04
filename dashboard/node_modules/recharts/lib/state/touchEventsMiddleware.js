"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchEventMiddleware = exports.touchEventAction = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _tooltipSlice = require("./tooltipSlice");
var _selectActivePropsFromChartPointer = require("./selectors/selectActivePropsFromChartPointer");
var _getRelativeCoordinate = require("../util/getRelativeCoordinate");
var _selectTooltipEventType = require("./selectors/selectTooltipEventType");
var _Constants = require("../util/Constants");
var _touchSelectors = require("./selectors/touchSelectors");
var _tooltipSelectors = require("./selectors/tooltipSelectors");
var _createEventProxy = require("../util/createEventProxy");
var touchEventAction = exports.touchEventAction = (0, _toolkit.createAction)('touchMove');
var touchEventMiddleware = exports.touchEventMiddleware = (0, _toolkit.createListenerMiddleware)();
var rafId = null;
var timeoutId = null;
var latestChartPointers = null;
var latestTouchEvent = null;
touchEventMiddleware.startListening({
  actionCreator: touchEventAction,
  effect: (action, listenerApi) => {
    var touchEvent = action.payload;
    if (touchEvent.touches == null || touchEvent.touches.length === 0) {
      return;
    }
    latestTouchEvent = (0, _createEventProxy.createEventProxy)(touchEvent);
    var state = listenerApi.getState();
    var _state$eventSettings = state.eventSettings,
      throttleDelay = _state$eventSettings.throttleDelay,
      throttledEvents = _state$eventSettings.throttledEvents;
    var isThrottled = throttledEvents === 'all' || throttledEvents.includes('touchmove');
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (timeoutId !== null && (typeof throttleDelay !== 'number' || !isThrottled)) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    latestChartPointers = Array.from(touchEvent.touches).map(touch => (0, _getRelativeCoordinate.getRelativeCoordinate)({
      clientX: touch.clientX,
      clientY: touch.clientY,
      currentTarget: touchEvent.currentTarget
    }));
    var callback = () => {
      if (latestTouchEvent == null) {
        return;
      }
      var currentState = listenerApi.getState();
      var tooltipEventType = (0, _selectTooltipEventType.selectTooltipEventType)(currentState, currentState.tooltip.settings.shared);
      if (tooltipEventType === 'axis') {
        var _latestChartPointers;
        var latestTouchPointer = (_latestChartPointers = latestChartPointers) === null || _latestChartPointers === void 0 ? void 0 : _latestChartPointers[0];
        if (latestTouchPointer == null) {
          rafId = null;
          timeoutId = null;
          return;
        }
        var activeProps = (0, _selectActivePropsFromChartPointer.selectActivePropsFromChartPointer)(currentState, latestTouchPointer);
        if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
          listenerApi.dispatch((0, _tooltipSlice.setMouseOverAxisIndex)({
            activeIndex: activeProps.activeIndex,
            activeDataKey: undefined,
            activeCoordinate: activeProps.activeCoordinate
          }));
        }
      } else if (tooltipEventType === 'item') {
        var _target$getAttribute;
        var touch = latestTouchEvent.touches[0];
        if (document.elementFromPoint == null || touch == null) {
          return;
        }
        var target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!target || !target.getAttribute) {
          return;
        }
        var itemIndex = target.getAttribute(_Constants.DATA_ITEM_INDEX_ATTRIBUTE_NAME);
        var graphicalItemId = (_target$getAttribute = target.getAttribute(_Constants.DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME)) !== null && _target$getAttribute !== void 0 ? _target$getAttribute : undefined;
        var settings = (0, _tooltipSelectors.selectAllGraphicalItemsSettings)(currentState).find(item => item.id === graphicalItemId);
        if (itemIndex == null || settings == null || graphicalItemId == null) {
          return;
        }
        var dataKey = settings.dataKey;
        var coordinate = (0, _touchSelectors.selectTooltipCoordinate)(currentState, itemIndex, graphicalItemId);
        listenerApi.dispatch((0, _tooltipSlice.setActiveMouseOverItemIndex)({
          activeDataKey: dataKey,
          activeIndex: itemIndex,
          activeCoordinate: coordinate,
          activeGraphicalItemId: graphicalItemId
        }));
      }
      rafId = null;
      timeoutId = null;
    };
    if (!isThrottled) {
      callback();
      return;
    }
    if (throttleDelay === 'raf') {
      rafId = requestAnimationFrame(callback);
    } else if (typeof throttleDelay === 'number') {
      if (timeoutId === null) {
        callback();
        latestTouchEvent = null;
        timeoutId = setTimeout(() => {
          if (latestTouchEvent) {
            callback();
          } else {
            timeoutId = null;
            rafId = null;
          }
        }, throttleDelay);
      }
    }
  }
});