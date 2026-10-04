"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetPolarGraphicalItem = exports.SetCartesianGraphicalItem = void 0;
var _react = require("react");
var _hooks = require("./hooks");
var _graphicalItemsSlice = require("./graphicalItemsSlice");
var SetCartesianGraphicalItemImpl = props => {
  var dispatch = (0, _hooks.useAppDispatch)();
  var prevPropsRef = (0, _react.useRef)(null);
  (0, _react.useLayoutEffect)(() => {
    if (prevPropsRef.current === null) {
      dispatch((0, _graphicalItemsSlice.addCartesianGraphicalItem)(props));
    } else if (prevPropsRef.current !== props) {
      dispatch((0, _graphicalItemsSlice.replaceCartesianGraphicalItem)({
        prev: prevPropsRef.current,
        next: props
      }));
    }
    prevPropsRef.current = props;
  }, [dispatch, props]);
  (0, _react.useLayoutEffect)(() => {
    return () => {
      if (prevPropsRef.current) {
        dispatch((0, _graphicalItemsSlice.removeCartesianGraphicalItem)(prevPropsRef.current));
        /*
         * Here we have to reset the ref to null because in StrictMode, the effect will run twice,
         * but it will keep the same ref value from the first render.
         *
         * In browser, React will clear the ref after the first effect cleanup,
         * so that wouldn't be an issue.
         *
         * In StrictMode, however, the ref is kept,
         * and in the hook above the code checks for `prevPropsRef.current === null`
         * which would be false so it would not dispatch the `addCartesianGraphicalItem` action again.
         *
         * https://github.com/recharts/recharts/issues/6022
         */
        prevPropsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
};
var SetCartesianGraphicalItem = exports.SetCartesianGraphicalItem = /*#__PURE__*/(0, _react.memo)(SetCartesianGraphicalItemImpl);
var SetPolarGraphicalItemImpl = props => {
  var dispatch = (0, _hooks.useAppDispatch)();
  var prevPropsRef = (0, _react.useRef)(null);
  (0, _react.useLayoutEffect)(() => {
    if (prevPropsRef.current === null) {
      dispatch((0, _graphicalItemsSlice.addPolarGraphicalItem)(props));
    } else if (prevPropsRef.current !== props) {
      dispatch((0, _graphicalItemsSlice.replacePolarGraphicalItem)({
        prev: prevPropsRef.current,
        next: props
      }));
    }
    prevPropsRef.current = props;
  }, [dispatch, props]);
  (0, _react.useLayoutEffect)(() => {
    return () => {
      if (prevPropsRef.current) {
        dispatch((0, _graphicalItemsSlice.removePolarGraphicalItem)(prevPropsRef.current));
        prevPropsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
};
var SetPolarGraphicalItem = exports.SetPolarGraphicalItem = /*#__PURE__*/(0, _react.memo)(SetPolarGraphicalItemImpl);