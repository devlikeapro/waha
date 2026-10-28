import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';
import { setKeyboardInteraction } from './tooltipSlice';
import { selectTooltipAxisDomain, selectTooltipAxisTicks, selectTooltipDisplayedData } from './selectors/tooltipSelectors';
import { selectCoordinateForDefaultIndex } from './selectors/selectors';
import { selectChartDirection, selectTooltipAxisDataKey } from './selectors/axisSelectors';
import { combineActiveTooltipIndex } from './selectors/combiners/combineActiveTooltipIndex';
import { selectTooltipEventType } from './selectors/selectTooltipEventType';
export var keyDownAction = createAction('keyDown');
export var focusAction = createAction('focus');
export var blurAction = createAction('blur');
export var keyboardEventsMiddleware = createListenerMiddleware();
var rafId = null;
var timeoutId = null;
var latestKeyboardActionPayload = null;
keyboardEventsMiddleware.startListening({
  actionCreator: keyDownAction,
  effect: (action, listenerApi) => {
    latestKeyboardActionPayload = action.payload;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    var state = listenerApi.getState();
    var _state$eventSettings = state.eventSettings,
      throttleDelay = _state$eventSettings.throttleDelay,
      throttledEvents = _state$eventSettings.throttledEvents;
    var isThrottled = throttledEvents === 'all' || throttledEvents.includes('keydown');
    if (timeoutId !== null && (typeof throttleDelay !== 'number' || !isThrottled)) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    var callback = () => {
      try {
        var currentState = listenerApi.getState();
        var accessibilityLayerIsActive = currentState.rootProps.accessibilityLayer !== false;
        if (!accessibilityLayerIsActive) {
          return;
        }
        var keyboardInteraction = currentState.tooltip.keyboardInteraction;
        var key = latestKeyboardActionPayload;
        if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Enter') {
          return;
        }

        // TODO this is lacking index for charts that do not support numeric indexes
        var resolvedIndex = combineActiveTooltipIndex(keyboardInteraction, selectTooltipDisplayedData(currentState), selectTooltipAxisDataKey(currentState), selectTooltipAxisDomain(currentState));
        var currentIndex = resolvedIndex == null ? -1 : Number(resolvedIndex);
        var isOutsideDomain = !Number.isFinite(currentIndex) || currentIndex < 0;
        var tooltipTicks = selectTooltipAxisTicks(currentState);
        var displayedData = selectTooltipDisplayedData(currentState);
        var tooltipEventType = selectTooltipEventType(currentState, currentState.tooltip.settings.shared);
        if (key === 'Enter') {
          if (isOutsideDomain) {
            return;
          }
          var _coordinate = selectCoordinateForDefaultIndex(currentState, tooltipEventType, 'hover', String(keyboardInteraction.index));
          listenerApi.dispatch(setKeyboardInteraction({
            active: !keyboardInteraction.active,
            activeIndex: keyboardInteraction.index,
            activeCoordinate: _coordinate
          }));
          return;
        }
        var direction = selectChartDirection(currentState);
        var directionMultiplier = direction === 'left-to-right' ? 1 : -1;
        var movement = key === 'ArrowRight' ? 1 : -1;
        var nextIndex;
        if (isOutsideDomain) {
          var axisDataKey = selectTooltipAxisDataKey(currentState);
          var domain = selectTooltipAxisDomain(currentState);
          var effectiveMovement = movement * directionMultiplier;

          // Build a minimal TooltipInteractionState for the candidate-index check.
          var mkInteraction = i => ({
            active: false,
            index: String(i),
            dataKey: undefined,
            graphicalItemId: undefined,
            coordinate: undefined
          });
          nextIndex = -1;
          if (effectiveMovement > 0) {
            for (var i = 0; i < displayedData.length; i++) {
              if (combineActiveTooltipIndex(mkInteraction(i), displayedData, axisDataKey, domain) != null) {
                nextIndex = i;
                break;
              }
            }
          } else {
            for (var _i = displayedData.length - 1; _i >= 0; _i--) {
              if (combineActiveTooltipIndex(mkInteraction(_i), displayedData, axisDataKey, domain) != null) {
                nextIndex = _i;
                break;
              }
            }
          }
          if (nextIndex < 0) {
            return;
          }
        } else {
          nextIndex = currentIndex + movement * directionMultiplier;
          var dataLength = (tooltipTicks === null || tooltipTicks === void 0 ? void 0 : tooltipTicks.length) || displayedData.length;
          if (dataLength === 0 || nextIndex >= dataLength || nextIndex < 0) {
            return;
          }
        }
        var coordinate = selectCoordinateForDefaultIndex(currentState, tooltipEventType, 'hover', String(nextIndex));
        listenerApi.dispatch(setKeyboardInteraction({
          active: true,
          activeIndex: nextIndex.toString(),
          activeCoordinate: coordinate
        }));
      } finally {
        rafId = null;
        timeoutId = null;
      }
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
        latestKeyboardActionPayload = null;
        timeoutId = setTimeout(() => {
          if (latestKeyboardActionPayload) {
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
keyboardEventsMiddleware.startListening({
  actionCreator: focusAction,
  effect: (_action, listenerApi) => {
    var state = listenerApi.getState();
    var accessibilityLayerIsActive = state.rootProps.accessibilityLayer !== false;
    if (!accessibilityLayerIsActive) {
      return;
    }
    var keyboardInteraction = state.tooltip.keyboardInteraction;
    if (keyboardInteraction.active) {
      return;
    }
    if (keyboardInteraction.index == null) {
      var nextIndex = '0';
      var tooltipEventType = selectTooltipEventType(state, state.tooltip.settings.shared);
      var coordinate = selectCoordinateForDefaultIndex(state, tooltipEventType, 'hover', String(nextIndex));
      listenerApi.dispatch(setKeyboardInteraction({
        active: true,
        activeIndex: nextIndex,
        activeCoordinate: coordinate
      }));
    }
  }
});
keyboardEventsMiddleware.startListening({
  actionCreator: blurAction,
  effect: (_action, listenerApi) => {
    var state = listenerApi.getState();
    var accessibilityLayerIsActive = state.rootProps.accessibilityLayer !== false;
    if (!accessibilityLayerIsActive) {
      return;
    }
    var keyboardInteraction = state.tooltip.keyboardInteraction;
    if (keyboardInteraction.active) {
      listenerApi.dispatch(setKeyboardInteraction({
        active: false,
        activeIndex: keyboardInteraction.index,
        activeCoordinate: keyboardInteraction.coordinate
      }));
    }
  }
});