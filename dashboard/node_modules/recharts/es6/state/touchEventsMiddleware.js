import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';
import { setActiveMouseOverItemIndex, setMouseOverAxisIndex } from './tooltipSlice';
import { selectActivePropsFromChartPointer } from './selectors/selectActivePropsFromChartPointer';
import { getRelativeCoordinate } from '../util/getRelativeCoordinate';
import { selectTooltipEventType } from './selectors/selectTooltipEventType';
import { DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME, DATA_ITEM_INDEX_ATTRIBUTE_NAME } from '../util/Constants';
import { selectTooltipCoordinate } from './selectors/touchSelectors';
import { selectAllGraphicalItemsSettings } from './selectors/tooltipSelectors';
import { createEventProxy } from '../util/createEventProxy';
export var touchEventAction = createAction('touchMove');
export var touchEventMiddleware = createListenerMiddleware();
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
    latestTouchEvent = createEventProxy(touchEvent);
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
    latestChartPointers = Array.from(touchEvent.touches).map(touch => getRelativeCoordinate({
      clientX: touch.clientX,
      clientY: touch.clientY,
      currentTarget: touchEvent.currentTarget
    }));
    var callback = () => {
      if (latestTouchEvent == null) {
        return;
      }
      var currentState = listenerApi.getState();
      var tooltipEventType = selectTooltipEventType(currentState, currentState.tooltip.settings.shared);
      if (tooltipEventType === 'axis') {
        var _latestChartPointers;
        var latestTouchPointer = (_latestChartPointers = latestChartPointers) === null || _latestChartPointers === void 0 ? void 0 : _latestChartPointers[0];
        if (latestTouchPointer == null) {
          rafId = null;
          timeoutId = null;
          return;
        }
        var activeProps = selectActivePropsFromChartPointer(currentState, latestTouchPointer);
        if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
          listenerApi.dispatch(setMouseOverAxisIndex({
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
        var itemIndex = target.getAttribute(DATA_ITEM_INDEX_ATTRIBUTE_NAME);
        var graphicalItemId = (_target$getAttribute = target.getAttribute(DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME)) !== null && _target$getAttribute !== void 0 ? _target$getAttribute : undefined;
        var settings = selectAllGraphicalItemsSettings(currentState).find(item => item.id === graphicalItemId);
        if (itemIndex == null || settings == null || graphicalItemId == null) {
          return;
        }
        var dataKey = settings.dataKey;
        var coordinate = selectTooltipCoordinate(currentState, itemIndex, graphicalItemId);
        listenerApi.dispatch(setActiveMouseOverItemIndex({
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