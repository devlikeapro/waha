"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportPolarOptions = ReportPolarOptions;
var _react = require("react");
var _hooks = require("./hooks");
var _polarOptionsSlice = require("./polarOptionsSlice");
function ReportPolarOptions(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _polarOptionsSlice.updatePolarOptions)(props));
  }, [dispatch, props]);
  return null;
}