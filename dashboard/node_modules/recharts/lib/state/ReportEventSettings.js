"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportEventSettings = void 0;
var _react = require("react");
var _hooks = require("./hooks");
var _eventSettingsSlice = require("./eventSettingsSlice");
var _propsAreEqual = require("../util/propsAreEqual");
var ReportEventSettingsImpl = props => {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _eventSettingsSlice.setEventSettings)(props));
  }, [dispatch, props]);
  return null;
};
var ReportEventSettings = exports.ReportEventSettings = /*#__PURE__*/(0, _react.memo)(ReportEventSettingsImpl, _propsAreEqual.propsAreEqual);