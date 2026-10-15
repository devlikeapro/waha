function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { createSlice, prepareAutoBatched } from '@reduxjs/toolkit';
import { castDraft } from 'immer';

/**
 * @inline
 */

export var defaultAxisId = 0;

/**
 * Properties shared in X, Y, and Z axes.
 * User defined axis settings, coming from props.
 */

/**
 * Controls how Recharts calculates "nice" tick values for numerical axes.
 *
 * - `'none'`: Recharts does not apply any tick-rounding algorithm; tick positions are
 *   determined entirely by d3, evenly spaced but not rounded to human-friendly numbers.
 *   There is no domain-extension logic applied in this mode.
 *
 * - `'auto'` *(default)*: Recharts automatically decides whether and how to apply tick
 *   niceties based on the domain definition. When the domain contains an `'auto'` keyword,
 *   Recharts uses the `'adaptive'` algorithm and may extend the domain slightly to
 *   produce clean tick labels. Otherwise, it applies the same algorithm while keeping
 *   ticks within the fixed domain. This mirrors the default behavior from Recharts v2.
 *
 * - `'adaptive'`: Always applies the space-efficient algorithm (`getAdaptiveStep`),
 *   which fills the available range as densely as possible while still rounding steps
 *   to reasonable numbers (e.g. 10, 20, 25). May produce less "round-looking" labels
 *   than `'snap125'`, but wastes less space. The domain-extension logic still applies
 *   when the domain contains an `'auto'` keyword.
 *
 * - `'snap125'`: Always applies the round-numbers algorithm (`getSnap125Step`), which
 *   snaps step sizes to values from the set {1, 2, 2.5, 5} × 10ⁿ. Produces very
 *   human-friendly labels (e.g. 0, 5, 10, 15, 20) but may leave blank space at the
 *   edges of the chart. The domain-extension logic still applies when the domain
 *   contains an `'auto'` keyword.
 *
 * @see {@link https://recharts.github.io/guide/axisTicks/}
 * @inline
 */

/**
 * These are the external props, visible for users as they set them using our public API.
 * There is all sorts of internal computed things based on these, but they will come through selectors.
 *
 * Properties shared between X and Y axes
 */

/**
 * Z axis is special because it's never displayed. It controls the size of Scatter dots,
 * but it never displays ticks anywhere.
 */

var initialState = {
  xAxis: {},
  yAxis: {},
  zAxis: {}
};

/**
 * This is the slice where each individual Axis element pushes its own configuration.
 * Prefer to use this one instead of axisSlice.
 */
var cartesianAxisSlice = createSlice({
  name: 'cartesianAxis',
  initialState,
  reducers: {
    addXAxis: {
      reducer(state, action) {
        state.xAxis[action.payload.id] = castDraft(action.payload);
      },
      prepare: prepareAutoBatched()
    },
    replaceXAxis: {
      reducer(state, action) {
        var _action$payload = action.payload,
          prev = _action$payload.prev,
          next = _action$payload.next;
        if (state.xAxis[prev.id] !== undefined) {
          if (prev.id !== next.id) {
            delete state.xAxis[prev.id];
          }
          state.xAxis[next.id] = castDraft(next);
        }
      },
      prepare: prepareAutoBatched()
    },
    removeXAxis: {
      reducer(state, action) {
        delete state.xAxis[action.payload.id];
      },
      prepare: prepareAutoBatched()
    },
    addYAxis: {
      reducer(state, action) {
        state.yAxis[action.payload.id] = castDraft(action.payload);
      },
      prepare: prepareAutoBatched()
    },
    replaceYAxis: {
      reducer(state, action) {
        var _action$payload2 = action.payload,
          prev = _action$payload2.prev,
          next = _action$payload2.next;
        if (state.yAxis[prev.id] !== undefined) {
          if (prev.id !== next.id) {
            delete state.yAxis[prev.id];
          }
          state.yAxis[next.id] = castDraft(next);
        }
      },
      prepare: prepareAutoBatched()
    },
    removeYAxis: {
      reducer(state, action) {
        delete state.yAxis[action.payload.id];
      },
      prepare: prepareAutoBatched()
    },
    addZAxis: {
      reducer(state, action) {
        state.zAxis[action.payload.id] = castDraft(action.payload);
      },
      prepare: prepareAutoBatched()
    },
    replaceZAxis: {
      reducer(state, action) {
        var _action$payload3 = action.payload,
          prev = _action$payload3.prev,
          next = _action$payload3.next;
        if (state.zAxis[prev.id] !== undefined) {
          if (prev.id !== next.id) {
            delete state.zAxis[prev.id];
          }
          state.zAxis[next.id] = castDraft(next);
        }
      },
      prepare: prepareAutoBatched()
    },
    removeZAxis: {
      reducer(state, action) {
        delete state.zAxis[action.payload.id];
      },
      prepare: prepareAutoBatched()
    },
    updateYAxisWidth(state, action) {
      var _action$payload4 = action.payload,
        id = _action$payload4.id,
        width = _action$payload4.width;
      var axis = state.yAxis[id];
      if (axis) {
        var _history$;
        var history = axis.widthHistory || [];
        // An oscillation is detected when the new width is the same as the width before the last one.
        // This is a simple A -> B -> A pattern. If the next width is B, and the difference is less than 1 pixel, we ignore it.
        if (history.length === 3 && history[0] === history[2] && width === history[1] && width !== axis.width && Math.abs(width - ((_history$ = history[0]) !== null && _history$ !== void 0 ? _history$ : 0)) <= 1) {
          return;
        }
        var newHistory = [...history, width].slice(-3);
        state.yAxis[id] = _objectSpread(_objectSpread({}, axis), {}, {
          width,
          widthHistory: newHistory
        });
      }
    },
    updateXAxisHeight(state, action) {
      var _action$payload5 = action.payload,
        id = _action$payload5.id,
        height = _action$payload5.height;
      var axis = state.xAxis[id];
      if (axis) {
        var _history$2;
        var history = axis.heightHistory || [];
        // An oscillation is detected when the new height is the same as the height before the last one.
        // This is a simple A -> B -> A pattern. If the next height is B, and the difference is less than 1 pixel, we ignore it.
        if (history.length === 3 && history[0] === history[2] && height === history[1] && height !== axis.height && Math.abs(height - ((_history$2 = history[0]) !== null && _history$2 !== void 0 ? _history$2 : 0)) <= 1) {
          return;
        }
        var newHistory = [...history, height].slice(-3);
        state.xAxis[id] = _objectSpread(_objectSpread({}, axis), {}, {
          height,
          heightHistory: newHistory
        });
      }
    }
  }
});
var _cartesianAxisSlice$a = cartesianAxisSlice.actions,
  addXAxis = _cartesianAxisSlice$a.addXAxis,
  replaceXAxis = _cartesianAxisSlice$a.replaceXAxis,
  removeXAxis = _cartesianAxisSlice$a.removeXAxis,
  addYAxis = _cartesianAxisSlice$a.addYAxis,
  replaceYAxis = _cartesianAxisSlice$a.replaceYAxis,
  removeYAxis = _cartesianAxisSlice$a.removeYAxis,
  addZAxis = _cartesianAxisSlice$a.addZAxis,
  replaceZAxis = _cartesianAxisSlice$a.replaceZAxis,
  removeZAxis = _cartesianAxisSlice$a.removeZAxis,
  updateYAxisWidth = _cartesianAxisSlice$a.updateYAxisWidth,
  updateXAxisHeight = _cartesianAxisSlice$a.updateXAxisHeight;
export { addXAxis, replaceXAxis, removeXAxis, addYAxis, replaceYAxis, removeYAxis, addZAxis, replaceZAxis, removeZAxis, updateYAxisWidth, updateXAxisHeight };
export var cartesianAxisReducer = cartesianAxisSlice.reducer;