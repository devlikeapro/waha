"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tooltipReducer = exports.setTooltipSettingsState = exports.setSyncInteraction = exports.setMouseOverAxisIndex = exports.setMouseClickAxisIndex = exports.setKeyboardInteraction = exports.setActiveMouseOverItemIndex = exports.setActiveClickItemIndex = exports.replaceTooltipEntrySettings = exports.removeTooltipEntrySettings = exports.noInteraction = exports.mouseLeaveItem = exports.mouseLeaveChart = exports.initialState = exports.addTooltipEntrySettings = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _immer = require("immer");
/**
 * One Tooltip can display multiple TooltipPayloadEntries at a time.
 */

/**
 * So what happens is that the tooltip payload is decided based on the available data, and the dataKey.
 * The dataKey can either be defined on the graphical element (like Line, or Bar)
 * or on the tooltip itself.
 *
 * The data can be defined in the chart element, or in the graphical item.
 *
 * So this type is all the settings, other than the data + dataKey complications.
 */

/**
 * This is what Tooltip renders.
 */

/**
 * null means no active index
 * string means: whichever index from the chart data it is.
 * Different charts have different requirements on data shapes,
 * and are also responsible for providing a function that will accept this index
 * and return data.
 */

/**
 * Different items have different data shapes so the state has no opinion on what the data shape should be;
 * the only requirement is that the chart also provides a searcher function
 * that accepts the data, and a key, and returns whatever the payload in Tooltip should be.
 */

/**
 * So this informs the "tooltip event type". Tooltip event type can be either "axis" or "item"
 * and it is used for two things:
 * 1. Sets the active area
 * 2. Sets the background and cursor highlights
 *
 * Some charts only allow to have one type of tooltip event type, some allow both.
 * Those charts that allow both will have one default, and the "shared" prop will be used to switch between them.
 * Undefined means "use the chart default".
 *
 * Charts that only allow one tooltip event type, will ignore the shared prop.
 */

/**
 * A generic state for user interaction with the chart.
 * User interaction can come through multiple channels: mouse events, keyboard events, or hardcoded in props, or synchronised from other charts.
 *
 * Each of the interaction states is represented as TooltipInteractionState,
 * and then the selectors and Tooltip will decide which of the interaction states to use.
 */

var noInteraction = exports.noInteraction = {
  active: false,
  index: null,
  dataKey: undefined,
  graphicalItemId: undefined,
  coordinate: undefined
};

/**
 * The tooltip interaction state stores:
 *
 * - Which graphical item is user interacting with at the moment,
 * - which axis (or, which part of chart background) is user interacting with at the moment
 * - The data that individual graphical items wish to be displayed in case the tooltip gets activated
 */

var initialState = exports.initialState = {
  itemInteraction: {
    click: noInteraction,
    hover: noInteraction
  },
  axisInteraction: {
    click: noInteraction,
    hover: noInteraction
  },
  keyboardInteraction: noInteraction,
  syncInteraction: {
    active: false,
    index: null,
    dataKey: undefined,
    label: undefined,
    coordinate: undefined,
    sourceViewBox: undefined,
    graphicalItemId: undefined
  },
  tooltipItemPayloads: [],
  settings: {
    shared: undefined,
    trigger: 'hover',
    axisId: 0,
    active: false,
    defaultIndex: undefined
  }
};

/**
 * This is the event we get when user is interacting with a specific graphical item.
 */

/**
 * Keyboard interaction payload has no graphical item ID,
 * and no dataKey, because keyboard interaction is always
 * with the whole chart, not with a specific graphical item.
 */

var tooltipSlice = (0, _toolkit.createSlice)({
  name: 'tooltip',
  initialState,
  reducers: {
    addTooltipEntrySettings: {
      reducer(state, action) {
        state.tooltipItemPayloads.push((0, _immer.castDraft)(action.payload));
      },
      prepare: (0, _toolkit.prepareAutoBatched)()
    },
    replaceTooltipEntrySettings: {
      reducer(state, action) {
        var _action$payload = action.payload,
          prev = _action$payload.prev,
          next = _action$payload.next;
        var index = (0, _toolkit.current)(state).tooltipItemPayloads.indexOf((0, _immer.castDraft)(prev));
        if (index > -1) {
          state.tooltipItemPayloads[index] = (0, _immer.castDraft)(next);
        }
      },
      prepare: (0, _toolkit.prepareAutoBatched)()
    },
    removeTooltipEntrySettings: {
      reducer(state, action) {
        var index = (0, _toolkit.current)(state).tooltipItemPayloads.indexOf((0, _immer.castDraft)(action.payload));
        if (index > -1) {
          state.tooltipItemPayloads.splice(index, 1);
        }
      },
      prepare: (0, _toolkit.prepareAutoBatched)()
    },
    setTooltipSettingsState(state, action) {
      state.settings = action.payload;
    },
    setActiveMouseOverItemIndex(state, action) {
      state.syncInteraction.active = false;
      state.syncInteraction.sourceViewBox = undefined;
      state.keyboardInteraction.active = false;
      state.itemInteraction.hover.active = true;
      state.itemInteraction.hover.index = action.payload.activeIndex;
      state.itemInteraction.hover.dataKey = action.payload.activeDataKey;
      state.itemInteraction.hover.graphicalItemId = action.payload.activeGraphicalItemId;
      state.itemInteraction.hover.coordinate = action.payload.activeCoordinate;
    },
    mouseLeaveChart(state) {
      /*
       * Clear only the active flags. Why?
       * 1. Keep Coordinate to preserve animation - next time the Tooltip appears, we want to render it from
       * the last place where it was when it disappeared.
       * 2. We want to keep all the properties anyway just in case the tooltip has `active=true` prop
       * and continues being visible even after the mouse has left the chart.
       */
      state.itemInteraction.hover.active = false;
      state.axisInteraction.hover.active = false;
    },
    mouseLeaveItem(state) {
      state.itemInteraction.hover.active = false;
    },
    setActiveClickItemIndex(state, action) {
      state.syncInteraction.active = false;
      state.syncInteraction.sourceViewBox = undefined;
      state.itemInteraction.click.active = true;
      state.keyboardInteraction.active = false;
      state.itemInteraction.click.index = action.payload.activeIndex;
      state.itemInteraction.click.dataKey = action.payload.activeDataKey;
      state.itemInteraction.click.graphicalItemId = action.payload.activeGraphicalItemId;
      state.itemInteraction.click.coordinate = action.payload.activeCoordinate;
    },
    setMouseOverAxisIndex(state, action) {
      state.syncInteraction.active = false;
      state.syncInteraction.sourceViewBox = undefined;
      state.axisInteraction.hover.active = true;
      state.keyboardInteraction.active = false;
      state.axisInteraction.hover.index = action.payload.activeIndex;
      state.axisInteraction.hover.dataKey = action.payload.activeDataKey;
      state.axisInteraction.hover.coordinate = action.payload.activeCoordinate;
    },
    setMouseClickAxisIndex(state, action) {
      state.syncInteraction.active = false;
      state.syncInteraction.sourceViewBox = undefined;
      state.keyboardInteraction.active = false;
      state.axisInteraction.click.active = true;
      state.axisInteraction.click.index = action.payload.activeIndex;
      state.axisInteraction.click.dataKey = action.payload.activeDataKey;
      state.axisInteraction.click.coordinate = action.payload.activeCoordinate;
    },
    setSyncInteraction(state, action) {
      state.syncInteraction = action.payload;
    },
    setKeyboardInteraction(state, action) {
      state.keyboardInteraction.active = action.payload.active;
      state.keyboardInteraction.index = action.payload.activeIndex;
      state.keyboardInteraction.coordinate = action.payload.activeCoordinate;
    }
  }
});
var _tooltipSlice$actions = tooltipSlice.actions,
  addTooltipEntrySettings = exports.addTooltipEntrySettings = _tooltipSlice$actions.addTooltipEntrySettings,
  replaceTooltipEntrySettings = exports.replaceTooltipEntrySettings = _tooltipSlice$actions.replaceTooltipEntrySettings,
  removeTooltipEntrySettings = exports.removeTooltipEntrySettings = _tooltipSlice$actions.removeTooltipEntrySettings,
  setTooltipSettingsState = exports.setTooltipSettingsState = _tooltipSlice$actions.setTooltipSettingsState,
  setActiveMouseOverItemIndex = exports.setActiveMouseOverItemIndex = _tooltipSlice$actions.setActiveMouseOverItemIndex,
  mouseLeaveItem = exports.mouseLeaveItem = _tooltipSlice$actions.mouseLeaveItem,
  mouseLeaveChart = exports.mouseLeaveChart = _tooltipSlice$actions.mouseLeaveChart,
  setActiveClickItemIndex = exports.setActiveClickItemIndex = _tooltipSlice$actions.setActiveClickItemIndex,
  setMouseOverAxisIndex = exports.setMouseOverAxisIndex = _tooltipSlice$actions.setMouseOverAxisIndex,
  setMouseClickAxisIndex = exports.setMouseClickAxisIndex = _tooltipSlice$actions.setMouseClickAxisIndex,
  setSyncInteraction = exports.setSyncInteraction = _tooltipSlice$actions.setSyncInteraction,
  setKeyboardInteraction = exports.setKeyboardInteraction = _tooltipSlice$actions.setKeyboardInteraction;
var tooltipReducer = exports.tooltipReducer = tooltipSlice.reducer;