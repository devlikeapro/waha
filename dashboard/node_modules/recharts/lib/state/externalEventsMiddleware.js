"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.externalEventsMiddleware = exports.externalEventAction = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _tooltipSelectors = require("./selectors/tooltipSelectors");
var _createEventProxy = require("../util/createEventProxy");
var externalEventAction = exports.externalEventAction = (0, _toolkit.createAction)('externalEvent');
var externalEventsMiddleware = exports.externalEventsMiddleware = (0, _toolkit.createListenerMiddleware)();

/*
 * We need a Map keyed by event type because this middleware handles MULTIPLE different event types
 * (click, mouseenter, mouseleave, mousedown, mouseup, contextmenu, dblclick, touchstart, touchmove, touchend)
 * from the same DOM element. Different event types should NOT cancel each other's animation frames.
 * For example, a click event and a mousemove event can happen in quick succession and both should be processed.
 * This is different from mouseMoveMiddleware which only handles one event type and uses a single rafId.
 */
var rafIdMap = new Map();
var timeoutIdMap = new Map();
var latestEventMap = new Map();
externalEventsMiddleware.startListening({
  actionCreator: externalEventAction,
  effect: (action, listenerApi) => {
    var _action$payload = action.payload,
      handler = _action$payload.handler,
      reactEvent = _action$payload.reactEvent;
    if (handler == null) {
      return;
    }
    var eventType = reactEvent.type;
    var eventProxy = (0, _createEventProxy.createEventProxy)(reactEvent);
    latestEventMap.set(eventType, {
      handler,
      reactEvent: eventProxy
    });

    // Cancel any pending execution for this event type
    var existingRafId = rafIdMap.get(eventType);
    if (existingRafId !== undefined) {
      cancelAnimationFrame(existingRafId);
      rafIdMap.delete(eventType);
    }
    var state = listenerApi.getState();
    var _state$eventSettings = state.eventSettings,
      throttleDelay = _state$eventSettings.throttleDelay,
      throttledEvents = _state$eventSettings.throttledEvents;

    /*
     * reactEvent.type gives us the event type as a string, e.g., 'click', 'mousemove', etc.
     * which is the same as the names used in throttledEvents array
     * but that array is strictly typed as ReadonlyArray<keyof GlobalEventHandlersEventMap> | 'all' | undefined
     * so that we can have relevant autocomplete and type checking elsewhere.
     * This makes TypeScript panic because it refuses to call .includes() on ReadonlyArray<keyof GlobalEventHandlersEventMap>
     * with a string argument.
     * To satisfy TypeScript, we need to explicitly typecast throttledEvents here.
     */
    var eventListAsString = throttledEvents;

    // Check if this event type should be throttled
    // throttledEvents can be 'all' or an array of event names
    var isThrottled = eventListAsString === 'all' || (eventListAsString === null || eventListAsString === void 0 ? void 0 : eventListAsString.includes(eventType));
    var existingTimeoutId = timeoutIdMap.get(eventType);
    if (existingTimeoutId !== undefined && (typeof throttleDelay !== 'number' || !isThrottled)) {
      clearTimeout(existingTimeoutId);
      timeoutIdMap.delete(eventType);
    }
    var callback = () => {
      var latestAction = latestEventMap.get(eventType);
      try {
        if (!latestAction) {
          // This happens if the event was consumed by the leading edge and no new event came in
          return;
        }
        var latestHandler = latestAction.handler,
          latestEvent = latestAction.reactEvent;
        var currentState = listenerApi.getState();
        var nextState = {
          activeCoordinate: (0, _tooltipSelectors.selectActiveTooltipCoordinate)(currentState),
          activeDataKey: (0, _tooltipSelectors.selectActiveTooltipDataKey)(currentState),
          activeIndex: (0, _tooltipSelectors.selectActiveTooltipIndex)(currentState),
          activeLabel: (0, _tooltipSelectors.selectActiveLabel)(currentState),
          activeTooltipIndex: (0, _tooltipSelectors.selectActiveTooltipIndex)(currentState),
          isTooltipActive: (0, _tooltipSelectors.selectIsTooltipActive)(currentState)
        };
        if (latestHandler) {
          latestHandler(nextState, latestEvent);
        }
      } finally {
        rafIdMap.delete(eventType);
        timeoutIdMap.delete(eventType);
        latestEventMap.delete(eventType);
      }
    };
    if (!isThrottled) {
      // Execute immediately
      callback();
      return;
    }
    if (throttleDelay === 'raf') {
      var rafId = requestAnimationFrame(callback);
      rafIdMap.set(eventType, rafId);
    } else if (typeof throttleDelay === 'number') {
      if (!timeoutIdMap.has(eventType)) {
        /*
         * Leading edge execution - execute immediately on the first event
         * and then start the cooldown period to throttle subsequent events.
         */
        callback();

        // Start cooldown
        var timeoutId = setTimeout(callback, throttleDelay);
        timeoutIdMap.set(eventType, timeoutId);
      }
    } else {
      // Should not happen based on type, but fallback to immediate
      callback();
    }
  }
});