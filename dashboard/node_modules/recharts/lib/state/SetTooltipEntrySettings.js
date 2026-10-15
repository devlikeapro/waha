"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetTooltipEntrySettings = SetTooltipEntrySettings;
var _react = require("react");
var _hooks = require("./hooks");
var _tooltipSlice = require("./tooltipSlice");
var _PanoramaContext = require("../context/PanoramaContext");
function SetTooltipEntrySettings(_ref) {
  var tooltipEntrySettings = _ref.tooltipEntrySettings;
  var dispatch = (0, _hooks.useAppDispatch)();
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var prevSettingsRef = (0, _react.useRef)(null);
  (0, _react.useLayoutEffect)(() => {
    if (isPanorama) {
      // Panorama graphical items should never contribute to Tooltip payload.
      return;
    }
    if (prevSettingsRef.current === null) {
      dispatch((0, _tooltipSlice.addTooltipEntrySettings)(tooltipEntrySettings));
    } else if (prevSettingsRef.current !== tooltipEntrySettings) {
      dispatch((0, _tooltipSlice.replaceTooltipEntrySettings)({
        prev: prevSettingsRef.current,
        next: tooltipEntrySettings
      }));
    }
    prevSettingsRef.current = tooltipEntrySettings;
  }, [tooltipEntrySettings, dispatch, isPanorama]);
  (0, _react.useLayoutEffect)(() => {
    return () => {
      if (prevSettingsRef.current) {
        dispatch((0, _tooltipSlice.removeTooltipEntrySettings)(prevSettingsRef.current));
        prevSettingsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}