"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetLegendPayload = SetLegendPayload;
exports.SetPolarLegendPayload = SetPolarLegendPayload;
var _react = require("react");
var _PanoramaContext = require("../context/PanoramaContext");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _hooks = require("./hooks");
var _legendSlice = require("./legendSlice");
function SetLegendPayload(_ref) {
  var legendPayload = _ref.legendPayload;
  var dispatch = (0, _hooks.useAppDispatch)();
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var prevPayloadRef = (0, _react.useRef)(null);
  (0, _react.useLayoutEffect)(() => {
    if (isPanorama) {
      return;
    }
    if (prevPayloadRef.current === null) {
      dispatch((0, _legendSlice.addLegendPayload)(legendPayload));
    } else if (prevPayloadRef.current !== legendPayload) {
      dispatch((0, _legendSlice.replaceLegendPayload)({
        prev: prevPayloadRef.current,
        next: legendPayload
      }));
    }
    prevPayloadRef.current = legendPayload;
  }, [dispatch, isPanorama, legendPayload]);
  (0, _react.useLayoutEffect)(() => {
    return () => {
      if (prevPayloadRef.current) {
        dispatch((0, _legendSlice.removeLegendPayload)(prevPayloadRef.current));
        prevPayloadRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}
function SetPolarLegendPayload(_ref2) {
  var legendPayload = _ref2.legendPayload;
  var dispatch = (0, _hooks.useAppDispatch)();
  var layout = (0, _hooks.useAppSelector)(_chartLayoutContext.selectChartLayout);
  var prevPayloadRef = (0, _react.useRef)(null);
  (0, _react.useLayoutEffect)(() => {
    if (layout !== 'centric' && layout !== 'radial') {
      return;
    }
    if (prevPayloadRef.current === null) {
      dispatch((0, _legendSlice.addLegendPayload)(legendPayload));
    } else if (prevPayloadRef.current !== legendPayload) {
      dispatch((0, _legendSlice.replaceLegendPayload)({
        prev: prevPayloadRef.current,
        next: legendPayload
      }));
    }
    prevPayloadRef.current = legendPayload;
  }, [dispatch, layout, legendPayload]);
  (0, _react.useLayoutEffect)(() => {
    return () => {
      if (prevPayloadRef.current) {
        dispatch((0, _legendSlice.removeLegendPayload)(prevPayloadRef.current));
        prevPayloadRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}