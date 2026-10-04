function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * This slice contains a registry of z-index values for various components.
 * The state is a map from z-index numbers to element references.
 */
import { createSlice, prepareAutoBatched } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes';
var seed = {};
var initialState = {
  zIndexMap: Object.values(DefaultZIndexes).reduce((acc, current) => _objectSpread(_objectSpread({}, acc), {}, {
    [current]: {
      element: undefined,
      panoramaElement: undefined,
      consumers: 0
    }
  }), seed)
};
var defaultZIndexSet = new Set(Object.values(DefaultZIndexes));
function isDefaultZIndex(zIndex) {
  return defaultZIndexSet.has(zIndex);
}
var zIndexSlice = createSlice({
  name: 'zIndex',
  initialState,
  reducers: {
    registerZIndexPortal: {
      reducer: (state, action) => {
        var zIndex = action.payload.zIndex;
        if (state.zIndexMap[zIndex]) {
          state.zIndexMap[zIndex].consumers += 1;
        } else {
          state.zIndexMap[zIndex] = {
            consumers: 1,
            element: undefined,
            panoramaElement: undefined
          };
        }
      },
      prepare: prepareAutoBatched()
    },
    unregisterZIndexPortal: {
      reducer: (state, action) => {
        var zIndex = action.payload.zIndex;
        if (state.zIndexMap[zIndex]) {
          state.zIndexMap[zIndex].consumers -= 1;
          /*
           * Garbage collect unused z-index entries, except for default z-indexes.
           * Default z-indexes are always rendered, regardless of whether there are consumers or not.
           * And because of that, even if we delete this entry, the ZIndexPortal provider will still be rendered
           * and React is not going to re-create it, and it won't re-register the element ID.
           * So let's not delete default z-index entries.
           */
          if (state.zIndexMap[zIndex].consumers <= 0 && !isDefaultZIndex(zIndex)) {
            delete state.zIndexMap[zIndex];
          }
        }
      },
      prepare: prepareAutoBatched()
    },
    registerZIndexPortalElement: {
      reducer: (state, action) => {
        var _action$payload = action.payload,
          zIndex = _action$payload.zIndex,
          element = _action$payload.element,
          isPanorama = _action$payload.isPanorama;
        if (state.zIndexMap[zIndex]) {
          if (isPanorama) {
            state.zIndexMap[zIndex].panoramaElement = castDraft(element);
          } else {
            state.zIndexMap[zIndex].element = castDraft(element);
          }
        } else {
          state.zIndexMap[zIndex] = {
            consumers: 0,
            element: isPanorama ? undefined : castDraft(element),
            panoramaElement: isPanorama ? castDraft(element) : undefined
          };
        }
      },
      prepare: prepareAutoBatched()
    },
    unregisterZIndexPortalElement: {
      reducer: (state, action) => {
        var zIndex = action.payload.zIndex;
        if (state.zIndexMap[zIndex]) {
          if (action.payload.isPanorama) {
            state.zIndexMap[zIndex].panoramaElement = undefined;
          } else {
            state.zIndexMap[zIndex].element = undefined;
          }
        }
      },
      prepare: prepareAutoBatched()
    }
  }
});
var _zIndexSlice$actions = zIndexSlice.actions,
  registerZIndexPortal = _zIndexSlice$actions.registerZIndexPortal,
  unregisterZIndexPortal = _zIndexSlice$actions.unregisterZIndexPortal,
  registerZIndexPortalElement = _zIndexSlice$actions.registerZIndexPortalElement,
  unregisterZIndexPortalElement = _zIndexSlice$actions.unregisterZIndexPortalElement;
export { registerZIndexPortal, unregisterZIndexPortal, registerZIndexPortalElement, unregisterZIndexPortalElement };
export var zIndexReducer = zIndexSlice.reducer;