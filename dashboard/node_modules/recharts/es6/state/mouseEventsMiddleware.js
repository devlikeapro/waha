import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';
import { mouseLeaveChart, setMouseClickAxisIndex, setMouseOverAxisIndex } from './tooltipSlice';
import { selectActivePropsFromChartPointer } from './selectors/selectActivePropsFromChartPointer';
import { selectTooltipEventType } from './selectors/selectTooltipEventType';
import { getRelativeCoordinate } from '../util/getRelativeCoordinate';
export var mouseClickAction = createAction('mouseClick');
export var mouseClickMiddleware = createListenerMiddleware();

// TODO: there's a bug here when you click the chart the activeIndex resets to zero
mouseClickMiddleware.startListening({
  actionCreator: mouseClickAction,
  effect: (action, listenerApi) => {
    var mousePointer = action.payload;
    var activeProps = selectActivePropsFromChartPointer(listenerApi.getState(), getRelativeCoordinate(mousePointer));
    if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
      listenerApi.dispatch(setMouseClickAxisIndex({
        activeIndex: activeProps.activeIndex,
        activeDataKey: undefined,
        activeCoordinate: activeProps.activeCoordinate
      }));
    }
  }
});
export var mouseMoveAction = createAction('mouseMove');
export var mouseMoveMiddleware = createListenerMiddleware();

/*
 * This single rafId is safe because:
 * 1. Each chart has its own Redux store instance with its own middleware
 * 2. mouseMoveAction only fires from one DOM element (the chart wrapper)
 * 3. Rapid mousemove events from the same element SHOULD debounce - we only care about the latest position
 * This is different from externalEventsMiddleware which handles multiple event types
 * (click, mouseenter, mouseleave, etc.) that should NOT cancel each other.
 */
var rafId = null;
var timeoutId = null;
var latestChartPointer = null;
mouseMoveMiddleware.startListening({
  actionCreator: mouseMoveAction,
  effect: (action, listenerApi) => {
    var mousePointer = action.payload;
    var state = listenerApi.getState();
    var _state$eventSettings = state.eventSettings,
      throttleDelay = _state$eventSettings.throttleDelay,
      throttledEvents = _state$eventSettings.throttledEvents;
    var isThrottled = throttledEvents === 'all' || (throttledEvents === null || throttledEvents === void 0 ? void 0 : throttledEvents.includes('mousemove'));

    // Cancel any pending execution
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (timeoutId !== null && (typeof throttleDelay !== 'number' || !isThrottled)) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    /*
     * Here it is important to resolve the chart pointer _before_ the callback,
     * because once we leave the current event loop, the mousePointer event object will lose
     * reference to currentTarget which getRelativeCoordinate uses.
     */
    latestChartPointer = getRelativeCoordinate(mousePointer);
    var callback = () => {
      /*
       * Here we read a fresh state again inside the callback to ensure we have the latest state values
       * after any potential actions that may have been dispatched between the original event and this callback.
       */
      var currentState = listenerApi.getState();
      var tooltipEventType = selectTooltipEventType(currentState, currentState.tooltip.settings.shared);
      if (!latestChartPointer) {
        rafId = null;
        timeoutId = null;
        return;
      }

      /*
       * This functionality only applies to charts that have axes.
       * Graphical items have its own mouse events handling mechanism where they attach events directly to the items.
       */
      if (tooltipEventType === 'axis') {
        var activeProps = selectActivePropsFromChartPointer(currentState, latestChartPointer);
        if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
          listenerApi.dispatch(setMouseOverAxisIndex({
            activeIndex: activeProps.activeIndex,
            activeDataKey: undefined,
            activeCoordinate: activeProps.activeCoordinate
          }));
        } else {
          // this is needed to clear tooltip state when the mouse moves out of the inRange (svg - offset) function, but not yet out of the svg
          listenerApi.dispatch(mouseLeaveChart());
        }
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
        timeoutId = setTimeout(callback, throttleDelay);
      }
    }
  }
});