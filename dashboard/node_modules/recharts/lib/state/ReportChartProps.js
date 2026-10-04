"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportChartProps = ReportChartProps;
var _react = require("react");
var _rootPropsSlice = require("./rootPropsSlice");
var _hooks = require("./hooks");
function ReportChartProps(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _rootPropsSlice.updateOptions)(props));
  }, [dispatch, props]);
  return null;
}