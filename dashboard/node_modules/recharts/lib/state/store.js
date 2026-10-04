"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRechartsStore = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _optionsSlice = require("./optionsSlice");
var _tooltipSlice = require("./tooltipSlice");
var _chartDataSlice = require("./chartDataSlice");
var _layoutSlice = require("./layoutSlice");
var _mouseEventsMiddleware = require("./mouseEventsMiddleware");
var _reduxDevtoolsJsonStringifyReplacer = require("./reduxDevtoolsJsonStringifyReplacer");
var _cartesianAxisSlice = require("./cartesianAxisSlice");
var _graphicalItemsSlice = require("./graphicalItemsSlice");
var _referenceElementsSlice = require("./referenceElementsSlice");
var _brushSlice = require("./brushSlice");
var _legendSlice = require("./legendSlice");
var _rootPropsSlice = require("./rootPropsSlice");
var _polarAxisSlice = require("./polarAxisSlice");
var _polarOptionsSlice = require("./polarOptionsSlice");
var _keyboardEventsMiddleware = require("./keyboardEventsMiddleware");
var _externalEventsMiddleware = require("./externalEventsMiddleware");
var _touchEventsMiddleware = require("./touchEventsMiddleware");
var _errorBarSlice = require("./errorBarSlice");
var _Global = require("../util/Global");
var _zIndexSlice = require("./zIndexSlice");
var _eventSettingsSlice = require("./eventSettingsSlice");
var _renderedTicksSlice = require("./renderedTicksSlice");
var rootReducer = (0, _toolkit.combineReducers)({
  brush: _brushSlice.brushReducer,
  cartesianAxis: _cartesianAxisSlice.cartesianAxisReducer,
  chartData: _chartDataSlice.chartDataReducer,
  errorBars: _errorBarSlice.errorBarReducer,
  eventSettings: _eventSettingsSlice.eventSettingsReducer,
  graphicalItems: _graphicalItemsSlice.graphicalItemsReducer,
  layout: _layoutSlice.chartLayoutReducer,
  legend: _legendSlice.legendReducer,
  options: _optionsSlice.optionsReducer,
  polarAxis: _polarAxisSlice.polarAxisReducer,
  polarOptions: _polarOptionsSlice.polarOptionsReducer,
  referenceElements: _referenceElementsSlice.referenceElementsReducer,
  renderedTicks: _renderedTicksSlice.renderedTicksReducer,
  rootProps: _rootPropsSlice.rootPropsReducer,
  tooltip: _tooltipSlice.tooltipReducer,
  zIndex: _zIndexSlice.zIndexReducer
});
var createRechartsStore = exports.createRechartsStore = function createRechartsStore(preloadedState) {
  var chartName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Chart';
  return (0, _toolkit.configureStore)({
    reducer: rootReducer,
    // redux-toolkit v1 types are unhappy with the preloadedState type. Remove the `as any` when bumping to v2
    preloadedState: preloadedState,
    // @ts-expect-error redux-toolkit v1 types are unhappy with the middleware array. Remove this comment when bumping to v2
    middleware: getDefaultMiddleware => {
      var _process$env$NODE_ENV;
      return getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: !['commonjs', 'es6', 'production'].includes((_process$env$NODE_ENV = "commonjs") !== null && _process$env$NODE_ENV !== void 0 ? _process$env$NODE_ENV : '')
      }).concat([_mouseEventsMiddleware.mouseClickMiddleware.middleware, _mouseEventsMiddleware.mouseMoveMiddleware.middleware, _keyboardEventsMiddleware.keyboardEventsMiddleware.middleware, _externalEventsMiddleware.externalEventsMiddleware.middleware, _touchEventsMiddleware.touchEventMiddleware.middleware]);
    },
    /*
     * I can't find out how to satisfy typescript here.
     * We return `EnhancerArray<[StoreEnhancer<{}, {}>, StoreEnhancer]>` from this function,
     * but the types say we should return `EnhancerArray<StoreEnhancer<{}, {}>`.
     * Looks like it's badly inferred generics, but it won't allow me to provide the correct type manually either.
     * So let's just ignore the error for now.
     */
    // @ts-expect-error mismatched generics
    enhancers: getDefaultEnhancers => {
      var enhancers = getDefaultEnhancers;
      if (typeof getDefaultEnhancers === 'function') {
        /*
         * In RTK v2 this is always a function, but in v1 it is an array.
         * Because we have @types/redux-toolkit v1 as a dependency, typescript is going to flag this as an error.
         * We support both RTK v1 and v2, so we need to do this check.
         * https://redux-toolkit.js.org/usage/migrating-rtk-2#configurestoreenhancers-must-be-a-callback
         */
        // @ts-expect-error RTK v2 behaviour on RTK v1 types
        enhancers = getDefaultEnhancers();
      }
      return enhancers.concat((0, _toolkit.autoBatchEnhancer)({
        type: 'raf'
      }));
    },
    devTools: _Global.Global.devToolsEnabled && {
      serialize: {
        replacer: _reduxDevtoolsJsonStringifyReplacer.reduxDevtoolsJsonStringifyReplacer
      },
      name: "recharts-".concat(chartName)
    }
  });
};